<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { workshopClientService, type ApiResponse } from '@/services/api'
import type { WorkshopClient } from '@/types/WorkshopClientType'

const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const clients = ref<WorkshopClient[]>([])
const search = ref('')

const loadClients = async () => {
  isLoading.value = true
  errorMessage.value = null

  try {
    const response: ApiResponse<WorkshopClient[]> = await workshopClientService.getClients({
      search: search.value || undefined,
    })

    if (response.success) {
      clients.value = response.data
    } else {
      errorMessage.value = response.message || 'No se pudieron cargar los clientes.'
    }
  } catch (error) {
    console.error('Error cargando clientes de taller:', error)
    errorMessage.value = 'Ocurrió un error al cargar los clientes.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadClients()
})
</script>

<template>
  <section class="workshop-clients">
    <header class="workshop-clients__header">
      <div>
        <h1>Clientes del taller</h1>
        <p>CRM básico para gestionar clientes y sus vehículos.</p>
      </div>

      <div class="workshop-clients__actions">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nombre, teléfono o email"
          @keyup.enter="loadClients"
        />
        <button type="button" @click="loadClients">Buscar</button>
      </div>
    </header>

    <main>
      <p v-if="isLoading">Cargando clientes...</p>
      <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>

      <table v-else class="clients-table" v-if="clients.length">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Notas</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id">
            <td>{{ client.name }}</td>
            <td>{{ client.phone }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.notes || '-' }}</td>
            <td>
              <span :class="['badge', client.isActive ? 'badge--success' : 'badge--muted']">
                {{ client.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>No hay clientes registrados todavía.</p>
    </main>
  </section>
</template>

<style scoped>
.workshop-clients {
  padding: 1.5rem;
}

.workshop-clients__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.workshop-clients__actions {
  display: flex;
  gap: 0.5rem;
}

input[type='text'] {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
}

button {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: none;
  background: #111827;
  color: white;
  cursor: pointer;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
}

.clients-table th,
.clients-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.badge--success {
  background: #dcfce7;
  color: #166534;
}

.badge--muted {
  background: #e5e7eb;
  color: #374151;
}

.error {
  color: #b91c1c;
}
</style>
