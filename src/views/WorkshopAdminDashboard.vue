<template>
  <div class="dashboard-container">
    <!-- Header Profesional -->
    <header class="dashboard-header">
      <div class="header-left">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <h1>Panel de Control</h1>
          <p>Visión general del taller y métricas clave</p>
        </div>
      </div>
      <div class="header-right">
        <span class="date-badge">{{ currentDate }}</span>
      </div>
    </header>

    <main class="dashboard-main">
      <!-- Métricas Principales -->
      <section class="metrics-section">
        <div class="metric-card">
          <div class="metric-icon blue">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="metric-info">
            <p class="metric-value">{{ totalClients }}</p>
            <p class="metric-label">Clientes Totales</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon green">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="metric-info">
            <p class="metric-value">{{ activeClients }}</p>
            <p class="metric-label">Clientes Activos</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon orange">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="metric-info">
            <p class="metric-value">{{ totalOrders }}</p>
            <p class="metric-label">Órdenes Totales</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon purple">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="metric-info">
            <p class="metric-value">{{ formatCurrency(totalRevenue) }}</p>
            <p class="metric-label">Ingresos Totales</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon red">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="metric-info">
            <p class="metric-value">{{ pendingOrders }}</p>
            <p class="metric-label">Órdenes Pendientes</p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon teal">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="metric-info">
            <p class="metric-value">{{ totalInvoices }}</p>
            <p class="metric-label">Facturas Generadas</p>
          </div>
        </div>
      </section>

      <!-- Desempeño de Técnicos -->
      <section class="panel performance-panel">
        <header class="panel-header">
          <div class="panel-header-left">
            <div class="panel-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <div>
              <h2>Desempeño de Técnicos</h2>
              <p>Métricas de productividad por mes</p>
            </div>
          </div>
          <div class="panel-filters">
            <select v-model="selectedMonth" class="filter-select">
              <option value="">Todos los meses</option>
              <option v-for="month in availableMonths" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </div>
        </header>

        <div class="panel-body">
          <div v-if="technicianPerformance.length === 0" class="empty-state">
            <p>No hay datos de desempeño para el período seleccionado</p>
          </div>
          <div v-else class="performance-grid">
            <div v-for="tech in technicianPerformance" :key="tech.name" class="performance-card">
              <div class="performance-header">
                <div class="tech-avatar">{{ getInitials(tech.name) }}</div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <span class="tech-role">{{ tech.role }}</span>
                </div>
              </div>
              <div class="performance-metrics">
                <div class="perf-metric">
                  <span class="perf-value">{{ tech.ordersCount }}</span>
                  <span class="perf-label">Órdenes</span>
                </div>
                <div class="perf-metric">
                  <span class="perf-value">{{ formatCurrency(tech.totalRevenue) }}</span>
                  <span class="perf-label">Ingresos</span>
                </div>
                <div class="perf-metric">
                  <span class="perf-value">{{ formatCurrency(tech.technicianShare) }}</span>
                  <span class="perf-label">Su 50%</span>
                </div>
                <div class="perf-metric">
                  <span class="perf-value">{{ formatCurrency(tech.workshopShare) }}</span>
                  <span class="perf-label">Taller 50%</span>
                </div>
              </div>
              <div class="performance-bar">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: tech.percentage + '%' }"></div>
                </div>
                <span class="progress-label">{{ tech.percentage.toFixed(1) }}% del total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Layout de dos columnas -->
      <div class="dashboard-columns">
        <!-- Columna izquierda: CRM -->
        <section class="panel panel-clients">
          <header class="panel-header">
            <div class="panel-header-left">
              <div class="panel-icon blue">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h2>Administración de Clientes</h2>
                <p>Gestiona tu base de clientes</p>
              </div>
            </div>
            <button type="button" class="btn sample" @click="handleCreateSampleClient">
              + Ejemplo
            </button>
          </header>

          <div class="panel-body">
            <form class="client-form" @submit.prevent="handleCreateOrUpdateClient">
              <div class="form-row">
                <div class="form-field">
                  <label for="name">Nombre del cliente</label>
                  <input id="name" v-model="clientForm.name" type="text" placeholder="Ej: Juan Pérez" required />
                </div>
                <div class="form-field">
                  <label for="phone">Teléfono</label>
                  <input id="phone" v-model="clientForm.phone" type="tel" placeholder="Ej: 300 123 4567" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label for="email">Correo electrónico</label>
                  <input id="email" v-model="clientForm.email" type="email" placeholder="Opcional" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-field full-width">
                  <label for="notes">Notas internas</label>
                  <textarea id="notes" v-model="clientForm.notes" rows="2"
                    placeholder="Ej: Cliente exigente, prefiere que lo llamen antes de cambiar repuestos."></textarea>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn primary">
                  {{ clientForm.id ? 'Guardar cambios' : 'Registrar cliente' }}
                </button>
                <button v-if="clientForm.id" type="button" class="btn ghost" @click="resetClientForm">
                  Cancelar
                </button>
              </div>
            </form>

            <div class="client-search">
              <div class="search-input-wrapper">
                <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input v-model="searchTerm" type="text" placeholder="Buscar por nombre, teléfono o correo..." />
              </div>
            </div>

            <div class="client-list-wrapper">
              <table class="client-table" v-if="filteredClients.length">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="client in filteredClients" :key="client.id"
                    :class="{ selected: selectedClient && selectedClient.id === client.id }"
                    @click="selectClient(client)">
                    <td>
                      <div class="client-main">
                        <div class="client-avatar">{{ getInitials(client.name) }}</div>
                        <span class="client-name">{{ client.name }}</span>
                      </div>
                    </td>
                    <td>{{ client.phone || '-' }}</td>
                    <td>{{ client.email || '-' }}</td>
                    <td>
                      <span class="client-tag" :class="client.isActive ? 'active' : 'inactive'">
                        {{ client.isActive ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="actions-cell" @click.stop>
                      <button class="btn tiny" @click="startEditClient(client)">Editar</button>
                      <button class="btn tiny danger" @click="handleDeactivateClient(client)">
                        {{ client.isActive ? 'Desactivar' : 'Activar' }}
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

        <!-- Columna derecha: Detalles -->
        <section class="details-column">
          <!-- Servicios -->
          <section class="panel panel-services">
            <header class="panel-header">
              <div class="panel-header-left">
                <div class="panel-icon purple">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </div>
                <div>
                  <h2>Servicios del Taller</h2>
                  <p>Catálogo de servicios disponibles</p>
                </div>
              </div>
            </header>
            <div class="panel-body">
              <div class="services-grid">
                <article class="service-card premium">
                  <div class="service-badge">Popular</div>
                  <header class="service-header">
                    <h4>Cambio de aceite</h4>
                    <span class="service-price">$120.000</span>
                  </header>
                  <p class="service-description">
                    Cambio de aceite de motor, revisión de niveles y chequeo visual de fugas.
                  </p>
                  <div class="service-footer">
                    <span class="service-time">~ 45 min</span>
                    <span class="service-tag">Rápido</span>
                  </div>
                </article>

                <article class="service-card">
                  <header class="service-header">
                    <h4>Mantenimiento preventivo</h4>
                    <span class="service-price">$280.000</span>
                  </header>
                  <p class="service-description">
                    Paquete completo para mantener el vehículo en óptimas condiciones.
                  </p>
                  <div class="service-footer">
                    <span class="service-time">~ 1 día</span>
                    <span class="service-tag">Completo</span>
                  </div>
                </article>

                <article class="service-card">
                  <header class="service-header">
                    <h4>Diagnóstico electrónico</h4>
                    <span class="service-price">$90.000</span>
                  </header>
                  <p class="service-description">
                    Escaneo con equipo especializado para encontrar el origen de problemas.
                  </p>
                  <div class="service-footer">
                    <span class="service-time">~ 60 min</span>
                    <span class="service-tag">Precisión</span>
                  </div>
                </article>

                <article class="service-card">
                  <header class="service-header">
                    <h4>Revisión para viaje</h4>
                    <span class="service-price">$150.000</span>
                  </header>
                  <p class="service-description">
                    Checklist completo antes de un viaje largo: seguridad y fluidos.
                  </p>
                  <div class="service-footer">
                    <span class="service-time">~ 2 horas</span>
                    <span class="service-tag">Seguridad</span>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <!-- Vehículos y Historial -->
          <section class="panel panel-details">
            <header class="panel-header">
              <div class="panel-header-left">
                <div class="panel-icon orange">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 17a2 2 0 1 1 4 0M15 17a2 2 0 1 1 4 0M5 17H3v-4h18v4h-2"/>
                    <path d="M3 13V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/>
                    <path d="M3 13h18"/>
                    <path d="M8 7v6"/>
                    <path d="M16 7v6"/>
                  </svg>
                </div>
                <div>
                  <h2>Vehículos e Historial</h2>
                  <p v-if="selectedClient">{{ selectedClient.name }}</p>
                  <p v-else>Selecciona un cliente</p>
                </div>
              </div>
            </header>

            <div class="panel-body">
              <section v-if="selectedClient" class="detail-section">
                <h3>Vehículos</h3>
                <div v-if="vehiclesLoading" class="loading-text">Cargando vehículos...</div>
                <div v-else-if="clientVehicles.length === 0" class="empty-state small">
                  <p>Este cliente no tiene vehículos registrados.</p>
                </div>
                <div v-else class="vehicle-grid">
                  <div v-for="vehicle in clientVehicles" :key="vehicle.id"
                    class="vehicle-card"
                    :class="{ selected: selectedVehicle && selectedVehicle.id === vehicle.id }"
                    @click="selectVehicle(vehicle)">
                    <div class="vehicle-plate">{{ vehicle.plate }}</div>
                    <div class="vehicle-model">{{ vehicle.brand }} {{ vehicle.model }}</div>
                    <div class="vehicle-year">{{ vehicle.year }}</div>
                    <div v-if="vehicle.mileage" class="vehicle-mileage">{{ vehicle.mileage }} km</div>
                  </div>
                </div>
              </section>

              <section v-if="selectedVehicle" class="detail-section">
                <h3>Historial de Servicios</h3>
                <div v-if="workOrdersLoading" class="loading-text">Cargando historial...</div>
                <div v-else-if="vehicleWorkOrders.length === 0" class="empty-state small">
                  <p>No hay servicios registrados.</p>
                </div>
                <div v-else class="workorder-timeline">
                  <div v-for="order in vehicleWorkOrders" :key="order.id" class="timeline-item">
                    <div class="timeline-dot" :class="getStatusClass(order.status)"></div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <span class="status-badge" :class="getStatusClass(order.status)">{{ formatStatus(order.status) }}</span>
                        <span class="timeline-date">{{ formatDate(order.createdAt) }}</span>
                      </div>
                      <div v-if="order.services?.length" class="timeline-services">
                        <span v-for="service in order.services" :key="service" class="service-tag">{{ service }}</span>
                      </div>
                      <p v-if="order.observations" class="timeline-notes">{{ order.observations }}</p>
                      <div class="timeline-meta">
                        <span v-if="order.gases" class="meta-tag">Gases</span>
                        <span v-if="order.escaner" class="meta-tag">Escáner</span>
                        <span v-if="order.total" class="meta-tag price">{{ formatCurrency(order.total) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div v-if="!selectedClient" class="empty-state">
                <div class="empty-icon">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <p>Selecciona un cliente para ver sus vehículos y historial</p>
              </div>
            </div>
          </section>
        </section>
      </div>
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

const selectedMonth = ref('');

const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

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
const activeClients = computed(() => clients.value.filter((c) => c.isActive).length);

// Métricas de órdenes y facturación (datos simulados para demo)
const totalOrders = computed(() => 156);
const totalRevenue = computed(() => 28400000);
const pendingOrders = computed(() => 12);
const totalInvoices = computed(() => 143);

const availableMonths = computed(() => {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })
    });
  }
  return months;
});

const technicianPerformance = computed(() => {
  // Datos simulados de técnicos
  const technicians = [
    { name: 'Carlos Rodríguez', role: 'Técnico Senior', ordersCount: 45, totalRevenue: 8400000 },
    { name: 'Andrea Martínez', role: 'Técnica Especialista', ordersCount: 38, totalRevenue: 6200000 },
    { name: 'Luis Gómez', role: 'Técnico Junior', ordersCount: 28, totalRevenue: 4100000 },
    { name: 'María Sánchez', role: 'Diagnostica', ordersCount: 32, totalRevenue: 5800000 },
  ];

  const total = technicians.reduce((sum, t) => sum + t.totalRevenue, 0);

  return technicians.map(t => ({
    ...t,
    technicianShare: t.totalRevenue * 0.5,
    workshopShare: t.totalRevenue * 0.5,
    percentage: total > 0 ? (t.totalRevenue / total) * 100 : 0
  }));
});

const loadClients = async () => {
  try {
    isLoadingClients.value = true;
    const response = await workshopClientService.getClients({});
    clients.value = response.data?.clients || [];
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
        c.id === client.id ? { ...c, isActive: !c.isActive } : c,
      );
    }
  } catch (error) {
    console.error('Error cambiando estado del cliente', error);
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
    const allVehicles = response.data?.vehicles || [];
    clientVehicles.value = allVehicles.filter((vehicle) => vehicle.clientId === clientId);
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
    vehicleWorkOrders.value = response.data?.workOrders || [];
  } catch (error) {
    console.error('Error cargando órdenes de trabajo', error);
  } finally {
    workOrdersLoading.value = false;
  }
};

const normalizeStatus = (status: string) =>
  status
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

const formatStatus = (status: string) => {
  switch (normalizeStatus(status)) {
    case 'recepcion':
      return 'Recepción';
    case 'diagnostico':
      return 'Diagnóstico';
    case 'en-proceso':
      return 'En proceso';
    case 'finalizado':
    case 'completado':
      return 'Finalizado';
    case 'entregado':
      return 'Entregado';
    case 'pending':
      return 'Pendiente';
    case 'in-progress':
      return 'En progreso';
    case 'completed':
      return 'Completado';
    default:
      return status;
  }
};

const getStatusClass = (status: string) => {
  switch (normalizeStatus(status)) {
    case 'recepcion':
      return 'recepcion';
    case 'diagnostico':
      return 'diagnostico';
    case 'en-proceso':
    case 'pending':
      return 'pending';
    case 'finalizado':
    case 'completed':
      return 'completed';
    case 'entregado':
    case 'in-progress':
      return 'delivered';
    default:
      return normalizeStatus(status);
  }
};

const formatCurrency = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === '') return '';
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return String(value);
  return numericValue.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
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

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

onMounted(() => {
  loadClients();
});

watch(selectedClient, () => {
  // Reset reminder notes when client changes
});
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  padding: 120px clamp(16px, 4vw, 40px) 40px;
  background: #0f172a;
  color: #e2e8f0;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.header-left h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.02em;
}

.header-left p {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.9rem;
}

.date-badge {
  padding: 8px 16px;
  border-radius: 10px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Main Layout */
.dashboard-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Metrics Section */
.metrics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.metric-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.metric-icon.green {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.metric-icon.orange {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.metric-icon.purple {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.metric-icon.red {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.metric-icon.teal {
  background: rgba(20, 184, 166, 0.15);
  color: #2dd4bf;
}

.metric-info {
  flex: 1;
}

.metric-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.2;
}

.metric-label {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 2px;
}

/* Panel Base */
.panel {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 20px;
  overflow: hidden;
}

.panel-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.panel-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.panel-icon.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.panel-icon.purple {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.panel-icon.orange {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.panel-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.panel-header p {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 0.82rem;
}

.panel-filters {
  display: flex;
  gap: 8px;
}

.filter-select {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
}

.filter-select:focus {
  border-color: #3b82f6;
}

.panel-body {
  padding: 20px 24px;
}

/* Performance Panel */
.performance-panel {
  margin-bottom: 8px;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.performance-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 14px;
  padding: 20px;
  transition: transform 0.2s;
}

.performance-card:hover {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.2);
}

.performance-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.tech-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.tech-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #f1f5f9;
}

.tech-role {
  font-size: 0.78rem;
  color: #94a3b8;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.perf-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.perf-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f8fafc;
}

.perf-label {
  font-size: 0.75rem;
  color: #94a3b8;
}

.performance-bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-bar {
  height: 6px;
  background: rgba(148, 163, 184, 0.15);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #6366f1);
  border-radius: 3px;
  transition: width 0.6s ease;
}

.progress-label {
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: right;
}

/* Dashboard Columns */
.dashboard-columns {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 20px;
  align-items: flex-start;
}

/* Client Form */
.client-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.form-row {
  display: flex;
  gap: 12px;
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
  font-size: 0.78rem;
  color: #94a3b8;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-field input,
.form-field textarea {
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.6);
  color: #e2e8f0;
  font-size: 0.85rem;
  transition: border-color 0.2s;
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: #64748b;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 4px;
}

/* Buttons */
.btn {
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn.primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn.ghost {
  background: transparent;
  color: #cbd5e1;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.btn.ghost:hover {
  background: rgba(148, 163, 184, 0.1);
}

.btn.tiny {
  padding: 5px 10px;
  font-size: 0.75rem;
}

.btn.sample {
  background: transparent;
  color: #60a5fa;
  border: 1px dashed rgba(96, 165, 250, 0.5);
  font-size: 0.8rem;
}

.btn.sample:hover {
  background: rgba(59, 130, 246, 0.1);
  border-style: solid;
}

.btn.danger {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

.btn.danger:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Search */
.client-search {
  margin: 4px 0 16px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #64748b;
  pointer-events: none;
}

.search-input-wrapper input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  padding: 10px 12px 10px 40px;
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  font-size: 0.85rem;
  transition: border-color 0.2s;
}

.search-input-wrapper input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input-wrapper input::placeholder {
  color: #64748b;
}

/* Client Table */
.client-list-wrapper {
  max-height: 360px;
  overflow: auto;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.client-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.client-table th,
.client-table td {
  padding: 10px 12px;
  text-align: left;
}

.client-table thead tr {
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.client-table th {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.client-table tbody tr {
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
  cursor: pointer;
  transition: background 0.15s;
}

.client-table tbody tr:hover {
  background: rgba(59, 130, 246, 0.08);
}

.client-table tbody tr.selected {
  background: rgba(59, 130, 246, 0.12);
}

.client-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.client-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.client-name {
  font-weight: 500;
  color: #f1f5f9;
}

.client-tag {
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.client-tag.active {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.client-tag.inactive {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.actions-cell {
  text-align: right;
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.service-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 14px;
  padding: 16px;
  position: relative;
  transition: transform 0.2s, border-color 0.2s;
}

.service-card:hover {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.2);
}

.service-card.premium {
  border-color: rgba(249, 115, 22, 0.3);
}

.service-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(249, 115, 22, 0.2);
  color: #fb923c;
  font-weight: 500;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 8px;
}

.service-header h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f1f5f9;
}

.service-price {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fbbf24;
  flex-shrink: 0;
}

.service-description {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 12px;
  line-height: 1.4;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-time {
  font-size: 0.75rem;
  color: #64748b;
}

.service-tag {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

/* Vehicle Grid */
.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.vehicle-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.vehicle-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
}

.vehicle-card.selected {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.vehicle-plate {
  font-size: 1rem;
  font-weight: 700;
  color: #fbbf24;
  margin-bottom: 4px;
}

.vehicle-model {
  font-size: 0.8rem;
  color: #cbd5e1;
  margin-bottom: 2px;
}

.vehicle-year {
  font-size: 0.75rem;
  color: #94a3b8;
}

.vehicle-mileage {
  font-size: 0.75rem;
  color: #4ade80;
  margin-top: 4px;
}

/* Timeline */
.workorder-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.timeline-dot.recepcion {
  background: #fbbf24;
}

.timeline-dot.diagnostico {
  background: #60a5fa;
}

.timeline-dot.pending {
  background: #fbbf24;
}

.timeline-dot.completed {
  background: #4ade80;
}

.timeline-dot.delivered {
  background: #fb923c;
}

.timeline-content {
  flex: 1;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.status-badge {
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 500;
}

.status-badge.recepcion {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.status-badge.diagnostico {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.status-badge.completed {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}

.status-badge.delivered {
  background: rgba(251, 146, 60, 0.15);
  color: #fb923c;
}

.timeline-date {
  font-size: 0.75rem;
  color: #64748b;
}

.timeline-services {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;
}

.service-tag {
  font-size: 0.72rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
}

.timeline-notes {
  font-size: 0.8rem;
  color: #cbd5e1;
  margin-bottom: 6px;
}

.timeline-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.meta-tag {
  font-size: 0.72rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(148, 163, 184, 0.15);
  color: #94a3b8;
}

.meta-tag.price {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  font-weight: 600;
}

/* Detail Section */
.detail-section {
  margin-bottom: 20px;
}

.detail-section h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 24px 16px;
  color: #64748b;
}

.empty-state.small {
  padding: 16px 8px;
  font-size: 0.85rem;
}

.empty-icon {
  margin-bottom: 12px;
  color: #475569;
}

.empty-hint {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #475569;
}

/* Loading */
.loading-text {
  font-size: 0.85rem;
  color: #64748b;
  padding: 12px;
  text-align: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .metrics-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .performance-grid {
    grid-template-columns: 1fr;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .form-row {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .metrics-section {
    grid-template-columns: 1fr;
  }

  .header-left h1 {
    font-size: 1.4rem;
  }
}
</style>
