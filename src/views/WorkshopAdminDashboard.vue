<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div>
        <h1>Panel Job's Car</h1>
        <p>Gestiona los clientes y vehículos del taller desde una sola pantalla.</p>
      </div>
    </header>

    <main class="dashboard-main">
      <!-- Resumen superior de métricas del taller -->
      <section class="dashboard-overview">
        <div class="stat-card">
          <p class="stat-label">Clientes totales</p>
          <p class="stat-value">{{ totalClients }}</p>
          <p class="stat-helper">Registrados en Job's Car</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Clientes activos</p>
          <p class="stat-value">{{ activeClients }}</p>
          <p class="stat-helper">Con estado activo</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">Vehículos del cliente</p>
          <p class="stat-value">{{ selectedClient ? selectedClientVehiclesCount : '-' }}</p>
          <p class="stat-helper">
            {{ selectedClient ? `Asociados a ${selectedClient.name}` : 'Selecciona un cliente para ver sus vehículos' }}
          </p>
        </div>
      </section>

      <!-- Columna izquierda: CRM de clientes -->
      <section class="panel panel-clients" id="admin-clients">
        <header class="panel-header">
          <div>
            <h2>Administración de clientes</h2>
            <p>Registra nuevos clientes y gestiona los ya existentes.</p>
          </div>
          <button type="button" class="btn sample" @click="handleCreateSampleClient">
            Crear cliente de ejemplo
          </button>
        </header>

        <div class="panel-body">
          <form class="client-form" @submit.prevent="handleCreateOrUpdateClient">
            <div class="form-row">
              <div class="form-field">
                <label for="name">Nombre del cliente</label>
                <input
                  id="name"
                  v-model="clientForm.name"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>
              <div class="form-field">
                <label for="phone">Teléfono</label>
                <input
                  id="phone"
                  v-model="clientForm.phone"
                  type="tel"
                  placeholder="Ej: 300 123 4567"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="email">Correo electrónico</label>
                <input
                  id="email"
                  v-model="clientForm.email"
                  type="email"
                  placeholder="Opcional"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field full-width">
                <label for="notes">Notas internas del cliente</label>
                <textarea
                  id="notes"
                  v-model="clientForm.notes"
                  rows="2"
                  placeholder="Ej: Cliente exigente, prefiere que lo llamen antes de cambiar repuestos."
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn primary">
                {{ clientForm.id ? 'Guardar cambios' : 'Registrar cliente' }}
              </button>
              <button
                v-if="clientForm.id"
                type="button"
                class="btn ghost"
                @click="resetClientForm"
              >
                Cancelar edición
              </button>
            </div>
          </form>

          <div class="client-search">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nombre, teléfono o correo"
            />
          </div>

          <div class="client-list-wrapper">
            <table class="client-table" v-if="filteredClients.length">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Notas</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="client in filteredClients"
                  :key="client.id"
                  :class="{ selected: selectedClient && selectedClient.id === client.id }"
                  @click="selectClient(client)"
                >
                  <td>
                    <div class="client-main">
                      <span class="client-name">{{ client.name }}</span>
                      <span class="client-tag" v-if="client.isActive">Activo</span>
                      <span class="client-tag inactive" v-else>Inactivo</span>
                    </div>
                  </td>
                  <td>{{ client.phone || '-' }}</td>
                  <td>{{ client.email || '-' }}</td>
                  <td class="notes-cell">
                    <span v-if="client.notes" class="notes-text">{{ client.notes }}</span>
                    <span v-else class="notes-empty">Sin notas</span>
                  </td>
                  <td class="actions-cell" @click.stop>
                    <button class="btn tiny" @click="startEditClient(client)">Editar</button>
                    <button class="btn tiny danger" @click="handleDeactivateClient(client)">
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="empty-state">
              <p>Aún no tienes clientes registrados.</p>
              <p class="empty-hint">Registra tu primer cliente usando el formulario superior.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Columna derecha: Servicios + Vehículos/Historial -->
      <section class="details-column">
        <!-- Panel independiente de catálogo de servicios -->
        <section class="panel panel-services" id="admin-services">
          <header class="panel-header">
            <div>
              <h2>Servicios del taller</h2>
              <p>Catálogo visual para explicar lo que ofrece tu taller.</p>
            </div>
          </header>
          <div class="panel-body">
            <section class="detail-section">
              <p class="hint">
                Usa este catálogo como referencia al crear órdenes de trabajo o al explicar al cliente los paquetes disponibles.
              </p>
              <div class="services-grid">
                <article class="service-card premium">
                  <header class="service-header">
                    <h4>Cambio de aceite completo</h4>
                    <span class="chip service-chip">Servicio rápido</span>
                  </header>
                  <p class="service-description">
                    Cambio de aceite de motor, revisión de niveles y chequeo visual de fugas.
                  </p>
                  <div class="service-meta">
                    <span class="price">Desde $120.000</span>
                    <span class="time">~ 45 min</span>
                  </div>
                  <ul class="service-highlights">
                    <li>Incluye filtro de aceite (opcional)</li>
                    <li>Chequeo rápido de frenos y llantas</li>
                    <li>Revisión de luces y limpiabrisas</li>
                  </ul>
                </article>

                <article class="service-card">
                  <header class="service-header">
                    <h4>Mantenimiento preventivo</h4>
                    <span class="chip service-chip">Más vendido</span>
                  </header>
                  <p class="service-description">
                    Paquete completo para mantener el vehículo en óptimas condiciones y evitar fallas futuras.
                  </p>
                  <div class="service-meta">
                    <span class="price">Desde $280.000</span>
                    <span class="time">~ 1 día</span>
                  </div>
                  <ul class="service-highlights">
                    <li>Revisión de frenos, suspensión y dirección</li>
                    <li>Escaneo básico y lectura de códigos</li>
                    <li>Informe digital para el cliente</li>
                  </ul>
                </article>

                <article class="service-card">
                  <header class="service-header">
                    <h4>Diagnóstico electrónico</h4>
                    <span class="chip service-chip">Alta precisión</span>
                  </header>
                  <p class="service-description">
                    Escaneo con equipo especializado para encontrar el origen de luces encendidas en el tablero.
                  </p>
                  <div class="service-meta">
                    <span class="price">Desde $90.000</span>
                    <span class="time">~ 60 min</span>
                  </div>
                  <ul class="service-highlights">
                    <li>Lectura de códigos de error</li>
                    <li>Recomendaciones de reparación</li>
                    <li>Informe técnico para el cliente</li>
                  </ul>
                </article>

                <article class="service-card">
                  <header class="service-header">
                    <h4>Revisión para viaje</h4>
                    <span class="chip service-chip">Ideal vacaciones</span>
                  </header>
                  <p class="service-description">
                    Checklist completo antes de un viaje largo: seguridad, fluidos y elementos esenciales.
                  </p>
                  <div class="service-meta">
                    <span class="price">Desde $150.000</span>
                    <span class="time">~ 2 horas</span>
                  </div>
                  <ul class="service-highlights">
                    <li>Revisión de frenos, llantas y suspensión</li>
                    <li>Chequeo de batería y sistema eléctrico</li>
                    <li>Entrega de lista de hallazgos</li>
                  </ul>
                </article>
              </div>
            </section>
          </div>
        </section>

        <!-- Panel de vehículos, historial y recordatorios -->
        <section class="panel panel-details">
          <header class="panel-header">
            <div>
              <h2>Gestión de vehículos e historial</h2>
              <p v-if="selectedClient">Detalle para {{ selectedClient.name }}</p>
              <p v-else>Selecciona un cliente para ver sus vehículos y servicios.</p>
            </div>
          </header>

          <div class="panel-body">
            <!-- Secciones que dependen del cliente seleccionado -->
            <section
              v-if="selectedClient"
              class="detail-section"
              id="admin-vehicles"
            >
            <h3>Vehículos del cliente</h3>
            <div v-if="vehiclesLoading" class="loading-text">Cargando vehículos...</div>
            <div v-else-if="clientVehicles.length === 0" class="empty-state small">
              <p>Este cliente aún no tiene vehículos registrados.</p>
            </div>
            <ul v-else class="vehicle-list">
              <li
                v-for="vehicle in clientVehicles"
                :key="vehicle.id"
                :class="{ selected: selectedVehicle && selectedVehicle.id === vehicle.id }"
                @click="selectVehicle(vehicle)"
              >
                <div class="vehicle-main">
                  <span class="vehicle-plate">{{ vehicle.plate }}</span>
                  <span class="vehicle-model">{{ vehicle.brand }} {{ vehicle.model }} • {{ vehicle.year }}</span>
                </div>
                <div class="vehicle-meta">
                  <span v-if="vehicle.mileage" class="vehicle-mileage">{{ vehicle.mileage }} km</span>
                  <span v-if="vehicle.notes" class="vehicle-notes">{{ vehicle.notes }}</span>
                </div>
              </li>
            </ul>

            <h3 class="services-subtitle">Historial de servicios del vehículo</h3>
            <div v-if="!selectedVehicle" class="empty-state small">
              <p>Selecciona un vehículo para ver sus servicios realizados.</p>
            </div>
            <div v-else-if="workOrdersLoading" class="loading-text">Cargando historial...</div>
            <div
              v-else-if="vehicleWorkOrders.length === 0"
              class="empty-state small"
            >
              <p>Este vehículo aún no tiene servicios registrados.</p>
            </div>
            <ul v-else class="workorder-list">
              <li v-for="order in vehicleWorkOrders" :key="order.id" class="workorder-item">
                <div class="workorder-header">
                  <span class="status" :class="order.status">{{ formatStatus(order.status) }}</span>
                  <span class="date">{{ formatDate(order.createdAt) }}</span>
                </div>
                <p class="diagnosis">{{ order.initialDiagnosis || 'Sin diagnóstico registrado' }}</p>
                <div class="workorder-meta">
                  <span v-if="order.customerApproved" class="chip approved">Aprobado por el cliente</span>
                  <span v-if="order.closedAt" class="chip date">Cerrada: {{ formatDate(order.closedAt) }}</span>
                </div>
              </li>
            </ul>
          </section>

          <section v-if="selectedClient" class="detail-section">
            <h3>Recordatorios del vehículo</h3>
            <p class="hint">
              Usa estas notas rápidas para no olvidar mantenimientos, revisiones o SOAT.
            </p>
            <ul class="reminder-list">
              <li>Próximo cambio de aceite</li>
              <li>Revisión técnica / mecánica</li>
              <li>Vencimiento del SOAT</li>
            </ul>
            <textarea
              v-model="reminderNotes"
              rows="3"
              class="reminder-notes"
              placeholder="Ej: Revisar suspensión delantera en la próxima visita."
            ></textarea>
          </section>

          <section
            v-if="selectedClient"
            class="detail-section"
            id="admin-reports"
          >
            <h3>Reportes del taller</h3>
            <p class="hint">
              Aquí verás un resumen de servicios realizados, tickets abiertos y facturación del taller.
            </p>
            <div class="empty-state small">
                <p>La sección de reportes está en construcción para esta vista.</p>
            </div>
          </section>

          <div v-if="!selectedClient" class="empty-state">
            <p>Selecciona un cliente en la tabla de la izquierda para ver sus vehículos y su historial de servicios.</p>
            <p class="empty-hint">El catálogo de servicios ya está disponible en el panel superior de servicios.</p>
          </div>
        </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { WorkshopClient, CreateWorkshopClientRequest, UpdateWorkshopClientRequest } from '@/types/WorkshopClientType';
import type { Vehicle } from '@/types/VehicleType';
import type { WorkOrder } from '@/types/WorkOrderType';
import { workshopClientService, vehicleService, workOrderService } from '@/services/api';

const clients = ref<WorkshopClient[]>([]);
const isLoadingClients = ref(false);
const searchTerm = ref('');
const selectedClient = ref<WorkshopClient | null>(null);
const selectedVehicle = ref<Vehicle | null>(null);

const vehiclesLoading = ref(false);
const clientVehicles = ref<Vehicle[]>([]);

const workOrdersLoading = ref(false);
const vehicleWorkOrders = ref<WorkOrder[]>([]);

const reminderNotes = ref('');

const clientForm = reactive<{
  id: number | null;
  name: string;
  phone: string;
  email: string;
  notes: string;
}>({
  id: null,
  name: '',
  phone: '',
  email: '',
  notes: '',
});

const filteredClients = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (!term) return clients.value;
  return clients.value.filter((c) => {
    return (
      c.name.toLowerCase().includes(term) ||
      (c.phone && c.phone.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term))
    );
  });
});

const totalClients = computed(() => clients.value.length);

const activeClients = computed(() =>
  clients.value.filter((c) => c.isActive).length,
);

const selectedClientVehiclesCount = computed(() => clientVehicles.value.length);

const loadClients = async () => {
  try {
    isLoadingClients.value = true;
    const response = await workshopClientService.getClients({});
    clients.value = response.data || [];
  } catch (error) {
    console.error('Error cargando clientes', error);
  } finally {
    isLoadingClients.value = false;
  }
};

const resetClientForm = () => {
  clientForm.id = null;
  clientForm.name = '';
  clientForm.phone = '';
  clientForm.email = '';
  clientForm.notes = '';
};

const startEditClient = (client: WorkshopClient) => {
  clientForm.id = client.id;
  clientForm.name = client.name;
  clientForm.phone = client.phone || '';
  clientForm.email = client.email || '';
  clientForm.notes = client.notes || '';
};

const handleCreateOrUpdateClient = async () => {
  const payload: CreateWorkshopClientRequest | UpdateWorkshopClientRequest = {
    name: clientForm.name.trim(),
    phone: clientForm.phone.trim() || undefined,
    email: clientForm.email.trim() || undefined,
    notes: clientForm.notes.trim() || undefined,
  };

  try {
    if (!clientForm.id) {
      const response = await workshopClientService.createClient(payload as CreateWorkshopClientRequest);
      if (response.data) {
        clients.value.unshift(response.data);
        resetClientForm();
      }
    } else {
      const response = await workshopClientService.updateClient(clientForm.id, payload as UpdateWorkshopClientRequest);
      if (response.data) {
        const idx = clients.value.findIndex((c) => c.id === clientForm.id);
        if (idx !== -1) {
          clients.value[idx] = response.data;
        }
        if (selectedClient.value && selectedClient.value.id === clientForm.id) {
          selectedClient.value = response.data;
        }
        resetClientForm();
      }
    }
  } catch (error) {
    console.error('Error guardando cliente', error);
  }
};

const handleCreateSampleClient = async () => {
  const sample: CreateWorkshopClientRequest = {
    name: 'Juan Pérez (ejemplo)',
    phone: '3001234567',
    email: 'cliente.ejemplo@jobscar.com',
    notes: 'Cliente de ejemplo para probar el flujo de CRM.',
  };

  try {
    const response = await workshopClientService.createClient(sample);
    if (response.data) {
      clients.value.unshift(response.data);
    }
  } catch (error) {
    console.error('Error creando cliente de ejemplo', error);
    const now = new Date().toISOString();
    const localClient: WorkshopClient = {
      id: Date.now(),
      name: sample.name,
      phone: sample.phone,
      email: sample.email,
      notes: sample.notes,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    clients.value.unshift(localClient);
  }
};

const handleDeactivateClient = async (client: WorkshopClient) => {
  try {
    const response = await workshopClientService.deactivateClient(client.id);
    if (response.data) {
      const updated = response.data;
      const idx = clients.value.findIndex((c) => c.id === updated.id);
      if (idx !== -1) {
        clients.value[idx] = updated;
      }
      if (selectedClient.value && selectedClient.value.id === updated.id) {
        selectedClient.value = updated;
      }
    } else {
      clients.value = clients.value.map((c) =>
        c.id === client.id ? { ...c, isActive: false } : c,
      );
    }
  } catch (error) {
    console.error('Error desactivando cliente', error);
  }
};

const selectClient = (client: WorkshopClient) => {
  selectedClient.value = client;
  selectedVehicle.value = null;
  clientVehicles.value = [];
  vehicleWorkOrders.value = [];
  loadVehiclesForClient(client.id);
};

const loadVehiclesForClient = async (clientId: number) => {
  try {
    vehiclesLoading.value = true;
    const response = await vehicleService.getVehicles({ clientId });
    clientVehicles.value = response.data || [];
  } catch (error) {
    console.error('Error cargando vehículos', error);
  } finally {
    vehiclesLoading.value = false;
  }
};

const selectVehicle = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle;
  vehicleWorkOrders.value = [];
  loadWorkOrdersForVehicle(vehicle.id);
};

const loadWorkOrdersForVehicle = async (vehicleId: number) => {
  try {
    workOrdersLoading.value = true;
    const response = await workOrderService.getWorkOrders({ vehicleId });
    vehicleWorkOrders.value = response.data || [];
  } catch (error) {
    console.error('Error cargando órdenes de trabajo', error);
  } finally {
    workOrdersLoading.value = false;
  }
};

const formatStatus = (status: WorkOrder['status']) => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'in-progress':
      return 'En progreso';
    case 'completed':
      return 'Completado';
    case 'delivered':
      return 'Entregado';
    default:
      return status;
  }
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

onMounted(() => {
  loadClients();
});

watch(selectedClient, () => {
  reminderNotes.value = '';
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  padding: 150px clamp(16px, 4vw, 40px) 40px;
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 1));
  color: #e5e7eb;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: clamp(1.6rem, 2.4vw, 2rem);
  font-weight: 700;
  color: #f9fafb;
}

.dashboard-header p {
  margin-top: 4px;
  color: #9ca3af;
  font-size: 0.9rem;
}

.badge-demo {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  font-size: 0.75rem;
  border: 1px solid rgba(37, 99, 235, 0.5);
}

.dashboard-main {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.1fr);
  gap: 20px;
  align-items: flex-start;
}

.dashboard-overview {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 6px;
}

.stat-card {
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 64, 175, 0.7));
  padding: 10px 14px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.8);
}

.stat-label {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f9fafb;
}

.stat-helper {
  margin-top: 2px;
  font-size: 0.78rem;
  color: #9ca3af;
}

.panel {
  background: radial-gradient(circle at top left, rgba(30, 64, 175, 0.4), rgba(15, 23, 42, 0.98));
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.8);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px 18px 10px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
}

.panel-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e5e7eb;
}

.panel-header p {
  margin-top: 4px;
  color: #9ca3af;
  font-size: 0.85rem;
}

.panel-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-clients {
  min-height: 520px;
}

.panel-details {
  min-height: 520px;
}

.details-column {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.client-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 8px;
  padding: 10px 12px;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.form-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.form-field {
  flex: 1;
  min-width: 140px;
}

.form-field.full-width {
  width: 100%;
}

.form-field label {
  display: block;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-bottom: 4px;
}

.form-field input,
.form-field textarea {
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  padding: 7px 10px;
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  font-size: 0.82rem;
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: #6b7280;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.4);
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
}

.btn {
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.8rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.5);
}

.btn.ghost {
  background: transparent;
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.7);
}

.btn.tiny {
  padding: 4px 8px;
  font-size: 0.72rem;
}

.btn.sample {
  background: transparent;
  color: #bfdbfe;
  border-radius: 999px;
  padding: 6px 12px;
  border: 1px dashed rgba(96, 165, 250, 0.8);
  font-size: 0.8rem;
}

.btn.sample:hover {
  background: rgba(37, 99, 235, 0.15);
}

.btn.danger {
  background: rgba(248, 113, 113, 0.12);
  color: #fecaca;
}

.btn.danger:hover {
  background: rgba(248, 113, 113, 0.25);
}

.client-search {
  margin: 4px 0;
}

.client-search input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 7px 12px;
  background: rgba(15, 23, 42, 0.85);
  color: #e5e7eb;
  font-size: 0.82rem;
}

.client-search input::placeholder {
  color: #6b7280;
}

.client-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.client-table th,
.client-table td {
  padding: 8px 6px;
  text-align: left;
}

.client-table thead tr {
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
}

.client-table tbody tr {
  border-bottom: 1px solid rgba(31, 41, 55, 0.8);
  cursor: pointer;
}

.client-table tbody tr:hover {
  background: rgba(30, 64, 175, 0.4);
}

.client-table tbody tr.selected {
  background: rgba(37, 99, 235, 0.3);
}

.client-main {
  display: flex;
  align-items: center;
  gap: 6px;
}

.client-name {
  font-weight: 500;
  color: #f9fafb;
}

.client-tag {
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.client-tag.inactive {
  background: rgba(248, 113, 113, 0.15);
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.5);
}

.notes-cell {
  max-width: 220px;
}

.notes-text {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.76rem;
  color: #d1d5db;
}

.notes-empty {
  font-size: 0.76rem;
  color: #6b7280;
}

.actions-cell {
  text-align: right;
}

.client-list-wrapper {
  max-height: 340px;
  overflow: auto;
  border-radius: 12px;
}

.detail-section {
  margin-bottom: 14px;
}

.detail-section h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 6px;
}

.vehicle-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vehicle-list li {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.9);
  cursor: pointer;
}

.vehicle-list li.selected {
  border-color: #60a5fa;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.5);
}

.vehicle-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.vehicle-plate {
  font-weight: 600;
  color: #f9fafb;
}

.vehicle-model {
  font-size: 0.78rem;
  color: #9ca3af;
}

.vehicle-meta {
  margin-top: 4px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.75rem;
}

.vehicle-mileage {
  color: #facc15;
}

.vehicle-notes {
  color: #d1d5db;
}

.workorder-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.workorder-item {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.9);
}

.workorder-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 4px;
}

.status {
  padding: 2px 6px;
  border-radius: 999px;
  font-weight: 500;
}

.status.pending {
  background: rgba(251, 191, 36, 0.15);
  color: #facc15;
}

.status.in-progress {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.status.completed {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.status.delivered {
  background: rgba(249, 115, 22, 0.15);
  color: #fdba74;
}

.date {
  color: #9ca3af;
}

.diagnosis {
  font-size: 0.8rem;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.workorder-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  border-radius: 999px;
  padding: 2px 6px;
  font-size: 0.7rem;
}

.chip.approved {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.chip.date {
  background: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
  margin: 6px 0 10px;
}

.service-card {
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: radial-gradient(circle at top left, rgba(30, 64, 175, 0.5), rgba(15, 23, 42, 0.95));
  padding: 10px 12px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.8);
}

.service-card.premium {
  border-color: rgba(249, 115, 22, 0.8);
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.service-header h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f9fafb;
}

.service-description {
  font-size: 0.78rem;
  color: #d1d5db;
  margin-bottom: 4px;
}

.service-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  margin-bottom: 4px;
}

.service-meta .price {
  color: #facc15;
  font-weight: 600;
}

.service-meta .time {
  color: #9ca3af;
}

.service-highlights {
  list-style: none;
  padding-left: 0;
  margin: 0;
  font-size: 0.75rem;
  color: #e5e7eb;
}

.service-highlights li::before {
  content: '• ';
  color: #60a5fa;
}

.service-chip {
  border-radius: 999px;
  padding: 2px 6px;
  font-size: 0.65rem;
  border: 1px solid rgba(59, 130, 246, 0.6);
  color: #bfdbfe;
  background: rgba(15, 23, 42, 0.9);
}

.services-subtitle {
  margin-top: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #e5e7eb;
}

.reminder-list {
  list-style: disc;
  padding-left: 16px;
  margin-bottom: 6px;
  font-size: 0.8rem;
  color: #d1d5db;
}

.reminder-notes {
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  padding: 7px 10px;
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  font-size: 0.82rem;
}

.loading-text {
  font-size: 0.8rem;
  color: #9ca3af;
}

.empty-state {
  text-align: center;
  padding: 16px 8px;
  color: #9ca3af;
}

.empty-state.small {
  padding: 8px 4px;
  font-size: 0.8rem;
}

.empty-hint {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #6b7280;
}

.hint {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-bottom: 6px;
}

@media (max-width: 1024px) {
  .dashboard-main {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.1fr);
  }
}

@media (max-width: 840px) {
  .dashboard-main {
    grid-template-columns: minmax(0, 1fr);
  }

  .panel-clients,
  .panel-details {
    min-height: auto;
  }
}

@media (max-width: 640px) {
  .dashboard-container {
    padding-inline: 12px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
