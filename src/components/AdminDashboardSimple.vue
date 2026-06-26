<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">
        <span class="icon">⚙️</span>
        Panel de Administración - JOB'S CAR
      </h1>
      <p class="dashboard-subtitle">Gestiona clientes, servicios, vehículos y reportes del taller</p>
    </div>



    <!-- ==========================================================
         NAVEGACIÓN POR PESTAÑAS
          Permite cambiar entre secciones de clientes, vehículos y órdenes
    ========================================================== -->
    <!-- Navegación por pestañas -->
    <div class="tabs-container">
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.id" type="button" :class="['tab', { active: activeTab === tab.id }]"
          @click="selectTab(tab.id)">
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.name }}
        </button>
      </div>
      <!-- Modal editar vehículo -->
      <div v-if="showEditVehicle && editingVehicle" class="modal-overlay" @click="showEditVehicle = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Editar Vehículo</h3>
            <button class="modal-close" @click="showEditVehicle = false">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEditedVehicle">
              <div class="form-group">
                <label>Nombre Cliente</label>
                <select v-model.number="editingVehicle.clientId" class="form-input">
                  <option :value="0">Seleccionar cliente</option>
                  <option v-for="c in burnedClients" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Placa</label>
                  <input v-model="editingVehicle.plate" type="text" class="form-input" style="text-transform: uppercase;" placeholder="Ej: ABC123" />
                </div>
                <div class="form-group">
                  <label>Marca</label>
                  <input v-model="editingVehicle.brand" type="text" class="form-input" style="text-transform: uppercase;" placeholder="Ej: TOYOTA" />
                </div>
              </div>
              <div class="form-group">
                <label>Modelo</label>
                <input v-model="editingVehicle.model" type="text" class="form-input" style="text-transform: uppercase;" placeholder="Ej: COROLLA 2022" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Km Actual</label>
                  <input v-model="editingVehicle.km" type="number" class="form-input" placeholder="Ej: 45000" />
                </div>
                <div class="form-group">
                  <label>Tipo Vehículo</label>
                  <select v-model="editingVehicle.vehicleType" class="form-input">
                    <option value="">Seleccionar tipo</option>
                    <option value="Automovil">Automóvil</option>
                    <option value="Camioneta">Camioneta</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Fecha Registro</label>
                  <input v-model="editingVehicle.registrationDate" type="date" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Último Servicio</label>
                  <input v-model="editingVehicle.lastServiceDate" type="date" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label>Observaciones</label>
                <textarea v-model="editingVehicle.observations" class="form-input" rows="3" placeholder="Ej: Revisión general al ingresar, detalles de daños visibles..."></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="showEditVehicle = false">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>



    <!-- ==========================================================
         ESTADÍSTICAS RÁPIDAS DEL TALLER
          Muestra datos clave como número de clientes, órdenes activas
          y vehículos atendidos para una visión general rápida.
    ========================================================== -->
    <!-- Estadísticas rápidas del taller -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-number">{{ uniqueClientsCount }}</div>
          <div class="stat-label">Clientes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📝</div>
        <div class="stat-content">
          <div class="stat-number">{{ activeWorkOrders.length }}</div>
          <div class="stat-label">Órdenes activas</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <div class="stat-number">{{ vehiclesCount }}</div>
          <div class="stat-label">Vehículos atendidos</div>
        </div>
      </div>
    </div>



    <!-- ==========================================================
         PESTAÑA: CLIENTES
         Muestra el listado de clientes registrados con opciones
         para crear, editar, eliminar y buscar clientes.
         ========================================================== -->
    <!-- Pestaña: Clientes (versión tarjetas - comentada) -->

    <div v-if="activeTab === 'clients'" class="content-section">
      <div class="section-header" style="display:grid;grid-template-columns:1fr minmax(260px,420px) auto;align-items:center;gap:12px;">
        <h2>Clientes</h2>
        <div style="justify-self:center;">
          <div class="search-input-wrapper" style="max-width:420px;">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
            </svg>
            <input type="search" v-model="searchClients" placeholder="Buscar clientes..." aria-label="Buscar clientes"
              class="search-input" />
            <button v-if="searchClients" class="search-clear" @click.prevent="searchClients = ''"
              aria-label="Limpiar búsqueda">X</button>
          </div>
        </div>
        <div style="justify-self:end;">
          <button class="btn btn-primary" @click="showCreateClient = true">➕ Crear Cliente</button>
        </div>
      </div>

      <!-- Modal para crear cliente (mantener) -->
      <div v-if="showCreateClient" class="modal-overlay" @click="showCreateClient = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Registrar Cliente</h3>
            <button class="modal-close" @click="showCreateClient = false">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addBurnedClient">
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="newClient.name" type="text" class="form-input" required
                  placeholder="Ej: Juan Pérez" />
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="newClient.phone" type="text" class="form-input" placeholder="Ej: 3001234567" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="newClient.email" type="email" class="form-input" placeholder="Ej: juan@email.com" />
              </div>
              <div class="form-group">
                <label>Notas internas</label>
                <textarea v-model="newClient.notes" class="form-input" rows="2"
                  placeholder="Ej: Cliente exigente, siempre paga tarde"></textarea>
              </div>
              <!-- Campos de aviso removidos según requerimiento -->
              <div class="form-group">
                <label>Fecha de Registro</label>
                <input v-model="newClient.registrationDate" type="date" class="form-input" />
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="showCreateClient = false">Cancelar</button>
                <button type="submit" class="btn btn-primary">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal de edición de cliente -->
      <div v-if="showEditClient && editingClient" class="modal-overlay" @click="closeEditClient">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Editar Cliente</h3>
            <button class="modal-close" @click="closeEditClient">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEditedClient">
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="editingClient.name" type="text" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="editingClient.phone" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="editingClient.email" type="email" class="form-input" />
              </div>
              <!-- Campos de aviso removidos en edición -->
              <div class="form-group">
                <label>Fecha de Registro</label>
                <input v-model="editingClient.registrationDate" type="date" class="form-input" />
              </div>
              <div class="form-group">
                <label>Notas</label>
                <textarea v-model="editingClient.notes" class="form-input" rows="2"></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="closeEditClient">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Tabla de clientes -->
      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table">
          <colgroup>
            <col style="width:20%" /> <!-- Nombre -->
            <col style="width:14%" /> <!-- Teléfono -->
            <col style="width:26%" /> <!-- Correo -->
            <col style="width:12%" /> <!-- Fecha registro -->
            <col style="width:15%" /> <!-- Notas -->
            <col style="width:13%" /> <!-- Acciones (fijo) -->
          </colgroup>
          <thead class="table-header">
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Fecha Registro</th>
              <th>Notas</th>
              <th style="text-align:center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in burnedClients.filter(c => {
              if (!searchClients) return true
              const q = searchClients.toLowerCase()
              return (c.name && c.name.toLowerCase().includes(q)) || (c.email && c.email.toLowerCase().includes(q)) || (c.phone && c.phone.toLowerCase().includes(q))
            })" :key="client.id">
              <td data-label="Nombre"><span class="client-name">{{ client.name }}</span></td>
              <td data-label="Teléfono">{{ client.phone }}</td>
              <td data-label="Correo"><span class="client-email">{{ client.email }}</span></td>
              <td data-label="Fecha de Registro">{{ client.registrationDate ? formatShortDate(new
                Date(client.registrationDate)) : '-' }}</td>
              <td data-label="Notas"><span class="client-notes">{{ client.notes }}</span></td>
              <td data-label="Acciones">
                <div class="actions">
                  <button class="btn btn-sm btn-secondary" @click="editClient(client)">✏️</button>
                  <button class="btn btn-sm btn-danger" @click="deleteClient(client.id)">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="burnedClients.length === 0">
              <td colspan="6">No hay clientes registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>




    <!-- ==========================================================
         PESTAÑA: VEHÍCULOS
         Registro y gestión de vehículos: búsqueda, creación,
         edición, eliminación y relación con clientes.
         ========================================================== -->
    <!-- Pestaña: Vehículos -->
    <div v-if="activeTab === 'vehicles'" class="content-section">
      <div class="section-title-bar"
        style="display:grid;grid-template-columns:1fr minmax(360px,560px) auto;align-items:center;gap:12px;">
        <h2 class="section-title">Vehículos</h2>
        <div style="justify-self:center;">
          <div class="search-input-wrapper" style="max-width:560px;">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
            </svg>
            <input type="search" v-model="searchVehicles" placeholder="Buscar por cliente, placa, marca..."
              aria-label="Buscar vehículos" class="search-input" />
            <button v-if="searchVehicles" class="search-clear" @click.prevent="searchVehicles = ''"
              aria-label="Limpiar búsqueda">X</button>
          </div>
        </div>
        <div style="justify-self:end;">
          <button class="btn btn-primary" @click="vehicleClientSearch = ''; vehicleClientDropdownOpen = false; showCreateVehicle = true">➕ Crear Vehículo</button>
        </div>
      </div>

      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table vehicles-table compact">
          <colgroup>
            <col style="width:13%" /> <!-- Nombre Cliente -->
            <col style="width:9%" /> <!-- Placa -->
            <col style="width:15%" /> <!-- Marca -->
            <col style="width:12%" /> <!-- Modelo -->
            <col style="width:10%" /> <!-- Tipo Vehículo -->
            <col style="width:10%" /> <!-- Fecha Registro -->
            <col style="width:8%" /> <!-- Km Actual -->
            <col style="width:10%" /> <!-- Último Servicio -->
            <col style="width:13%" /> <!-- Observaciones -->
            <col style="width:10%" /> <!-- Acciones -->
          </colgroup>
          <thead class="table-header">
            <tr>
              <th>Nombre Cliente</th>
              <th>Placa</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Tipo Vehículo</th>
              <th>Fecha Registro</th>
              <th>Km Actual</th>
              <th>Último Servicio</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, idx) in paginatedVehicles" :key="v.plate || idx">
              <td data-label="Nombre Cliente">{{ v.client || '-' }}</td>
              <td data-label="Placa" style="text-transform: uppercase;">{{ v.plate || '-' }}</td>
              <td data-label="Marca" style="text-transform: uppercase;">{{ v.brand || '-' }}</td>
              <td data-label="Modelo" style="text-transform: uppercase;">{{ v.model || '-' }}</td>
              <td data-label="Tipo Vehículo">{{ v.vehicleType || '-' }}</td>
              <td data-label="Fecha Registro">{{ v.registrationDate ? formatShortDate(new Date(v.registrationDate)) :
                '-' }}</td>
              <td data-label="Km Actual">{{ typeof v.km === 'number' ? v.km.toLocaleString() + '' : (v.km || '-') }}
              </td>
              <td data-label="Último Servicio">{{ v.lastServiceDate ? formatShortDate(new Date(v.lastServiceDate)) : '-'
              }}</td>
              <td data-label="Observaciones"><span class="client-notes">{{ v.observations || '-' }}</span></td>
              <td data-label="Acciones">
                <div class="actions" style="display:flex;gap:6px;justify-content:center;">
                  <button class="btn btn-sm btn-secondary" @click="editVehicle(v)">✏️</button>
                  <button class="btn btn-sm btn-danger" @click="deleteVehicle(v.id || v.plate)">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredVehicles.length === 0">
              <td colspan="10">No hay vehículos registrados.</td>
            </tr>
          </tbody>
        </table>
        <!-- Datalist con clientes para autocompletar nombre -->
        <datalist id="clients-list">
          <option v-for="c in burnedClients" :key="c.id" :value="c.name"></option>
        </datalist>
      </div>
      <!-- Paginación vehículos -->
      <div v-if="vehicleTotalPages > 1" style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:16px;flex-wrap:wrap;">
        <button class="btn" :disabled="vehiclePage <= 1" @click.prevent="vehiclePage--">Anterior</button>
        <span>Página {{ vehiclePage }} / {{ vehicleTotalPages }}</span>
        <button class="btn" :disabled="vehiclePage >= vehicleTotalPages" @click.prevent="vehiclePage++">Siguiente</button>
      </div>

      <!-- Modal crear vehículo -->
      <div v-if="showCreateVehicle" class="modal-overlay" @click="showCreateVehicle = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Registrar Vehículo</h3>
            <button class="modal-close" @click="showCreateVehicle = false">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addBurnedVehicle">
              <div class="form-group">
                <label>Nombre Cliente</label>
                <div style="position:relative;">
                  <input type="text" class="form-input" v-model="vehicleClientSearch"
                    @focus="vehicleClientDropdownOpen = true"
                    @input="vehicleClientDropdownOpen = true"
                    @blur="closeVehicleClientDropdown"
                    placeholder="Buscar cliente..." autocomplete="off" />
                  <div v-if="vehicleClientDropdownOpen && filteredVehicleClients.length > 0"
                    style="position:absolute;top:100%;left:0;right:0;max-height:200px;overflow-y:auto;background:var(--bg-card, #1a1a2e);border:1px solid var(--border-color, #333);border-radius:0 0 6px 6px;z-index:10;">
                    <div v-for="c in filteredVehicleClients" :key="c.id"
                      @mousedown.prevent="selectVehicleClient(c)"
                      style="padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border-color, #333);"
                      :style="{ background: newVehicle.clientId === c.id ? 'var(--brand-primary, #00897b)' : 'transparent' }">
                      {{ c.name }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Placa</label>
                  <input v-model="newVehicle.plate" type="text" class="form-input" style="text-transform: uppercase;" placeholder="Ej: ABC123" />
                </div>
                <div class="form-group">
                  <label>Marca</label>
                  <input v-model="newVehicle.brand" type="text" class="form-input" style="text-transform: uppercase;" placeholder="Ej: TOYOTA" />
                </div>
              </div>
              <div class="form-group">
                <label>Modelo</label>
                <input v-model="newVehicle.model" type="text" class="form-input" style="text-transform: uppercase;" placeholder="Ej: COROLLA 2022" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Km Actual</label>
                  <input v-model="newVehicle.km" type="number" class="form-input" placeholder="Ej: 45000" />
                </div>
                <div class="form-group">
                  <label>Tipo Vehículo</label>
                  <select v-model="newVehicle.vehicleType" class="form-input">
                    <option value="">Seleccionar tipo</option>
                    <option value="Automovil">Automóvil</option>
                    <option value="Camioneta">Camioneta</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Fecha Registro</label>
                  <input v-model="newVehicle.registrationDate" type="date" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Último Servicio</label>
                  <input v-model="newVehicle.lastServiceDate" type="date" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label>Observaciones</label>
                <textarea v-model="newVehicle.observations" class="form-input" rows="3" placeholder="Ej: Revisión general al ingresar, detalles de daños visibles..."></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="showCreateVehicle = false">Cancelar</button>
                <button type="submit" class="btn btn-primary">Registrar Vehículo</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>




    <!-- ==========================================================
         PESTAÑA: ÓRDENES DE TRABAJO
         Visualización de órdenes activas e históricas con
         opciones para crear, editar, eliminar y exportar a PDF.
         ========================================================== -->
    <!-- Pestaña: Órdenes de trabajo -->
    <div v-if="activeTab === 'orders'" class="content-section">
      <div class="section-title-bar" style="display:grid;grid-template-columns:1fr minmax(260px,420px) auto;align-items:center;gap:12px;">
        <h2 class="section-title">📝 Órdenes de Trabajo (Activos)</h2>
        <div style="justify-self:center;">
          <div class="search-input-wrapper" style="max-width:420px;">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
            </svg>
            <input type="search" v-model="searchOrders" placeholder="Buscar por cliente, placa, estado..."
              aria-label="Buscar órdenes" class="search-input" />
            <button v-if="searchOrders" class="search-clear" @click.prevent="searchOrders = ''"
              aria-label="Limpiar búsqueda">X</button>
          </div>
        </div>
        <div style="justify-self:end;">
          <button class="btn btn-primary" @click="openCreateOrder">➕ Nueva Orden</button>
        </div>
      </div>

      <div class="orders-grid orders-row">
        <div v-if="filteredActiveWorkOrders.length === 0" class="empty">No hay órdenes de trabajo activas.</div>
        <template v-else>
          <div v-for="order in filteredActiveWorkOrders" :key="order.id"
            :class="['pro-card', 'order-card', statusClass(order.status)]">
            <div class="order-top-row">
              <span class="order-id-badge">#{{ order.id }}</span>
              <div class="order-action-row">
                <button class="order-action-btn" @click="editOrder(order)" aria-label="Editar orden">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25Zm14.71-9.54a.996.996 0 0 0 0-1.41l-1.99-1.99a.996.996 0 1 0-1.41 1.41l1.99 1.99c.39.39 1.02.39 1.41 0Z"
                      fill="currentColor" />
                  </svg>
                  Editar
                </button>

                <button class="order-action-btn pdf" @click="exportOrderPdf(order)" aria-label="Exportar a PDF">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 2h7l5 5v15H6V2Zm7 1.5V8h4.5L13 3.5ZM8 12h8v1.5H8V12Zm0 3h8v1.5H8V15Zm0-6h4.5v1.5H8V9Z"
                      fill="currentColor" />
                  </svg>
                  Exportar a PDF
                </button>
                <button class="order-action-btn danger" @click="deleteOrder(order.id)" aria-label="Eliminar orden">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M8 3.75A1.75 1.75 0 0 1 9.75 2h4.5A1.75 1.75 0 0 1 16 3.75V5h3.25a.75.75 0 0 1 0 1.5h-1.04l-.7 12.25A2.25 2.25 0 0 1 15.27 21H8.73a2.25 2.25 0 0 1-2.24-2.25L5.8 6.5H4.75a.75.75 0 0 1 0-1.5H8V3.75Zm1.5 0V5h5V3.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25ZM9 9.25a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0V10a.75.75 0 0 1 .75-.75Zm6 0a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0V10a.75.75 0 0 1 .75-.75Z"
                      fill="currentColor" />
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>

            <div class="order-title-row">
              <div class="order-icon-box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 3.75A1.75 1.75 0 0 1 8.75 2h6.5A1.75 1.75 0 0 1 17 3.75V4h1.25A2.75 2.75 0 0 1 21 6.75v11.5A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25V6.75A2.75 2.75 0 0 1 5.75 4H7v-.25Zm1.5.25h7V4a.25.25 0 0 0-.25-.25h-6.5A.25.25 0 0 0 8.5 4v0ZM5.75 5.5A1.25 1.25 0 0 0 4.5 6.75v11.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25H5.75Zm2.25 5h8.25a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5Zm0 3.25h5.75a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1 0-1.5Z"
                    fill="currentColor" />
                </svg>
              </div>
              <h3 class="card-title">{{ order.vehicle }} - {{ order.client }}</h3>
            </div>

            <div class="order-divider"></div>

            <div class="order-info-grid">
              <div class="order-info-card">
                <div class="order-info-icon blue">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 2.75a.75.75 0 0 1 1.5 0V4H15V2.75a.75.75 0 0 1 1.5 0V4H18a2 2 0 0 1 2 2v2H4V6a2 2 0 0 1 2-2h1V2.75Zm14 6.75H3v8.5A2.25 2.25 0 0 0 5.25 20h13.5A2.25 2.25 0 0 0 21 17.75V9.5Zm-13 3h3v3H8v-3Z"
                      fill="currentColor" />
                  </svg>
                </div>
                <span class="order-info-label">Fecha creación</span>
                <strong class="order-info-value">{{ order.createdDate ? formatShortDate(new Date(order.createdDate)) :
                  '-' }}</strong>
              </div>
              <div class="order-info-card">
                <div class="order-info-icon green">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 2.75a.75.75 0 0 1 1.5 0V4H15V2.75a.75.75 0 0 1 1.5 0V4H18a2 2 0 0 1 2 2v2H4V6a2 2 0 0 1 2-2h1V2.75ZM4 10h16v7.75A2.25 2.25 0 0 1 17.75 20H6.25A2.25 2.25 0 0 1 4 17.75V10Z"
                      fill="currentColor" />
                  </svg>
                </div>
                <span class="order-info-label">Fecha entrega</span>
                <strong class="order-info-value">{{ order.deliveryDate ? formatShortDate(new Date(order.deliveryDate)) :
                  '-' }}</strong>
              </div>
              <div class="order-info-card">
                <div class="order-info-icon orange">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 12 2.5Zm0 1.5a8 8 0 1 1-8 8 8.01 8.01 0 0 1 8-8Zm-.75 4.25a.75.75 0 0 1 1.5 0v4.25h3.25a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75V8.25Z"
                      fill="currentColor" />
                  </svg>
                </div>
                <span class="order-info-label">Estado</span>
                <span class="status-badge order-status-pill" :class="statusClass(order.status)">{{ order.status
                }}</span>
              </div>
            </div>

            <div class="service-section">
              <div class="service-title">Tipo de servicio</div>
              <div class="type-list">
                <span v-for="chip in getOrderServiceChips(order)" :key="chip" class="type-chip">
                  <span class="type-chip-dot" aria-hidden="true">•</span>
                  <span>{{ chip }}</span>
                </span>
              </div>
              <div class="type-list flag-list" style="margin-top:8px;">
                <span v-if="order.gases" class="type-chip flag-chip flag-gases"><span class="type-chip-dot"
                    aria-hidden="true">•</span><span>Gases</span></span>
                <span v-if="order.escaner" class="type-chip flag-chip flag-escaner"><span class="type-chip-dot"
                    aria-hidden="true">•</span><span>Escaner</span></span>
              </div>
            </div>

            <div class="order-extra-rows">
              <div class="order-extra-row">
                <span class="order-extra-label">Observaciones:</span>
                <span class="order-extra-value order-observations">{{ order.observations || '-' }}</span>
              </div>

              <div class="order-extra-row" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;align-items:center;gap:4px;">
                  <span class="order-extra-icon purple" aria-hidden="true">
                    👨‍🔧
                  </span>
                  <span class="order-extra-label">Técnico:</span>
                  <span class="order-extra-value">{{ order.mechanic || '-' }}</span>
                </div>
                <button v-if="isOrderBillable(order.status)" type="button" class="order-action-btn success" @click="openInvoiceForOrder(order)" aria-label="Facturar orden" style="padding:4px 10px;font-size:0.75rem;height:auto;">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="width:14px;height:14px;">
                    <path d="M12 2.75a9.25 9.25 0 1 0 9.25 9.25A9.26 9.26 0 0 0 12 2.75Zm0 1.5A7.75 7.75 0 1 1 4.25 12 7.76 7.76 0 0 1 12 4.25Zm-1.1 3.75h2.7a2.35 2.35 0 0 1 0 4.7h-1.1a.85.85 0 0 0 0 1.7h1.8a.75.75 0 0 1 0 1.5h-1.1v1a.75.75 0 0 1-1.5 0v-1h-1.8a.75.75 0 0 1 0-1.5h2.7a.85.85 0 0 0 0-1.7h-1.8a2.35 2.35 0 1 1 0-4.7Z"
                      fill="currentColor" />
                  </svg>
                  {{ findInvoiceByOrderId(order.id) ? 'Actualizar Factura' : 'Facturar' }}
                </button>
              </div>

            </div>

            <div class="order-bottom-divider"></div>
          </div>
        </template>
      </div>

      <!-- Pestaña: Órdenes de trabajo - Históricas -->
      <div class="section-title-bar" style="margin-top:24px;">
        <h2 class="section-title">📚 Histórico de Órdenes de Trabajo</h2>
      </div>
      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table orders-table compact">
          <colgroup>
            <col style="width:8%" /> <!-- ID -->
            <col style="width:10%" /> <!-- Placa -->
            <col style="width:12%" /> <!-- Cliente -->
            <col style="width:10%" /> <!-- Fecha creación -->
            <col style="width:10%" /> <!-- Fecha entrega -->
            <col style="width:14%" /> <!-- Estado -->
            <col style="width:10%" /> <!-- Tipo servicio -->
            <col style="width:10%" /> <!-- Técnico -->
            <!-- Kilometraje column removed -->
            <col style="width:12%" /> <!-- Diagnóstico / Servicios -->
            <col style="width:18%" /> <!-- Acciones -->
          </colgroup>
          <thead class="table-header">
            <tr>
              <th># OT</th>
              <th>Placa</th>
              <th>Cliente</th>
              <th>Fecha creación</th>
              <th>Fecha entrega</th>
              <th>Estado</th>
              <th>Tipo servicio</th>
              <th>Técnico</th>
              <!-- Kilometraje removed -->
              <th>Diagnóstico</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in historicalWorkOrders" :key="order.id">
              <td data-label="ID">#{{ order.id }}</td>
              <td data-label="Placa">{{ order.vehicle || '-' }}</td>
              <td data-label="Cliente">{{ order.client || '-' }}</td>
              <td data-label="Fecha creación">{{ order.createdDate ? formatShortDate(new Date(order.createdDate)) : '-'
              }}
              </td>
              <td data-label="Fecha entrega">{{ order.deliveryDate ? formatShortDate(new Date(order.deliveryDate)) : '-'
              }}
              </td>
              <td data-label="Estado"><span class="status-badge" :class="statusClass(order.status)">{{ order.status
              }}</span>
              </td>
              <td data-label="Tipo servicio">
                <div style="display:flex;align-items:center;gap:8px;justify-content:center;">
                  <button class="btn btn-sm btn-secondary" type="button"
                    @click.prevent="openServicesModal(order)">ver</button>
                </div>
              </td>
              <td data-label="Técnico">{{ order.mechanic || '-' }}</td>
              <!-- Kilometraje removed -->
              <td data-label="Diagnóstico / Servicios">
                <div style="display:flex;align-items:center;gap:8px;justify-content:center;">
                  <button class="btn btn-sm btn-secondary" type="button"
                    @click.prevent="openDiagnosisModal(order)">ver</button>
                </div>
              </td>
              <td data-label="Acciones">
                <div class="actions" style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;">
                  <button class="btn btn-sm btn-secondary" type="button" @click="editOrder(order)">✏️</button>
                  <button v-if="normalizeText(order.status || '') === 'entregado'" class="btn btn-sm btn-success" type="button" @click="openInvoiceForOrder(order)">{{ findInvoiceByOrderId(order.id) ? '✏️ Actualizar' : '💵 Fact.' }}</button>
                  <button class="btn btn-sm btn-primary" type="button" @click="exportOrderPdf(order)">PDF</button>
                  <button class="btn btn-sm btn-danger" type="button" @click="deleteOrder(order.id)">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="historicalWorkOrders.length === 0">
              <td colspan="10">No hay historial de órdenes.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modales para crear/editar orden -->
    <div v-if="showCreateOrder" class="modal-overlay" @click="showCreateOrder = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Nueva Orden</h3>
          <button class="modal-close" @click="showCreateOrder = false">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createOrder">
            <div class="form-row">
              <div class="form-group" style="position:relative;">
                <label>Placa</label>
                <input v-model="orderPlateSearch" type="search" class="form-input"
                  placeholder="Buscar placa, cliente o marca..."
                  @focus="showPlateDropdownCreate = true"
                  @blur="blurPlateDropdown(false)" />
                <div v-if="showPlateDropdownCreate && getOrderPlateOptions(newOrder.vehicle).length"
                  style="position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:200;background:var(--brand-surface);border:1px solid var(--brand-border);border-radius:8px;max-height:180px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.35);color:var(--brand-primary-contrast);">
                  <div v-for="v in getOrderPlateOptions(newOrder.vehicle)" :key="v.plate"
                    @mousedown.prevent="selectPlateForOrder(v, false)"
                    style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--brand-border);font-size:0.95rem;transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--brand-bg-end)'"
                    onmouseleave="this.style.background='transparent'">
                    <strong>{{ v.plate }}</strong> · {{ v.client || 'Sin cliente' }} · {{ v.brand || 'Sin marca' }}
                  </div>
                </div>
              </div>
              <div class="form-group"><label>Cliente</label><input :value="newOrder.client || 'No registrado'" class="form-input form-input-readonly" readonly /></div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Tipo Vehículo</label>
                <input :value="newOrder.vehicleType || 'No registrado'" class="form-input form-input-readonly" readonly />
              </div>
              <div class="form-group">
                <label>Modelo</label>
                <input :value="newOrder.vehicleModel || 'No registrado'" class="form-input form-input-readonly" readonly />
              </div>
              <div class="form-group"><label>Estado</label>
                <select v-model="newOrder.status" class="form-input">
                  <option>Recepción</option>
                  <option>Diagnóstico</option>
                  <option>Terminado</option>
                  <option>Entregado</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Tipo de servicio</label>
              <div style="display:flex;gap:8px;align-items:center;">
                <input v-model="newServiceItem" class="form-input" placeholder="Agregar servicio (ej: Alineación)" />
                <button type="button" class="btn btn-secondary" @click.prevent="addNewService">➕</button>
              </div>
              <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:8px;">
                <span v-for="(s, idx) in newOrder.services" :key="idx" class="chip"
                  style="background:#eef2ff;padding:6px 10px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;">{{
                    s }} <button type="button" class="btn btn-sm" style="padding:0 6px;margin-left:6px;"
                    @click.prevent="removeNewService(idx)">✕</button></span>
                <small v-if="!newOrder.services || !newOrder.services.length" style="color:var(--muted);">Usar 'General'
                  si
                  no se agrega ninguno</small>
              </div>

              <div style="margin-top:10px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                <label style="display:inline-flex;align-items:center;gap:8px;font-weight:600;">
                  <input type="checkbox" v-model="newOrder.gases" /> Gases
                </label>
                <label style="display:inline-flex;align-items:center;gap:8px;font-weight:600;">
                  <input type="checkbox" v-model="newOrder.escaner" /> Escaner
                </label>
              </div>
            </div>
            <div class="form-group"><label>Observaciones</label><textarea v-model="newOrder.observations"
                class="form-input" rows="3" placeholder="Notas adicionales de la orden"></textarea></div>
            <div class="form-row">

              <div class="form-group">
                <label>Técnico</label>
                <select v-model="newOrder.mechanic" class="form-input">
                  <option value="">Seleccionar técnico</option>
                  <option v-for="emp in burnedEmployees" :key="emp.id" :value="emp.name">{{ emp.name }}</option>
                </select>
                <label style="display:inline-flex;align-items:center;gap:8px;font-weight:600;margin-top:10px;">
                  <input type="checkbox" v-model="newOrder.showTechnicianInPdf" />
                  Mostrar técnico en PDF
                </label>
              </div>
              <div class="form-group"><label>Fecha entrega (opcional)</label><input v-model="newOrder.deliveryDate"
                  type="date" class="form-input" /></div>
            </div>
            <div class="form-group"><label>Diagnóstico</label><textarea v-model="newOrder.diagnosis" class="form-input"
                rows="3" placeholder="Escribe el diagnóstico"></textarea></div>
            <div class="form-row">
            </div>
            <div class="form-row">
              <div class="form-group"><label>Garantía (# veces)</label><input v-model.number="newOrder.garantia"
                  type="number" min="0" class="form-input" /></div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showCreateOrder = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Crear orden</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal ver servicios de una orden -->
    <div v-if="showServicesModal" class="modal-overlay" @click="closeServicesModal()">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Servicios - Orden #{{ servicesModalOrder && servicesModalOrder.id }}</h3>
          <button class="modal-close" @click="closeServicesModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="margin-bottom:8px;display:flex;gap:8px;align-items:center;">
            <span v-if="servicesModalOrder && servicesModalOrder.gases" class="chip chip-flag"
              style="background:#FFF4E5;color:#92400e;padding:6px 10px;border-radius:999px;font-size:0.9rem;">Gases</span>
            <span v-if="servicesModalOrder && servicesModalOrder.escaner" class="chip chip-flag"
              style="background:#ECFDF5;color:#065f46;padding:6px 10px;border-radius:999px;font-size:0.9rem;">Escaner</span>
          </div>
          <div v-if="servicesModalOrder && servicesModalOrder.services && servicesModalOrder.services.length">
            <ul style="padding-left:18px;margin:0;">
              <li v-for="(s, i) in servicesModalOrder.services" :key="i" style="margin-bottom:8px">{{ s }}</li>
            </ul>
          </div>
          <div v-else>
            <p>{{ servicesModalOrder ? (servicesModalOrder.serviceType || 'General') : '-' }}</p>
          </div>
        </div>
        <div class="form-actions" style="margin-top:12px;text-align:right;">
          <button type="button" class="btn btn-secondary" @click="closeServicesModal()">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal ver diagnóstico de una orden -->
    <div v-if="showDiagnosisModal" class="modal-overlay" @click="closeDiagnosisModal()">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Diagnóstico - Orden #{{ diagnosisModalOrder && diagnosisModalOrder.id }}</h3>
          <button class="modal-close" @click="closeDiagnosisModal()">✕</button>
        </div>
        <div class="modal-body">
          <div v-if="diagnosisModalOrder && diagnosisModalOrder.diagnosis">
            <pre style="white-space:pre-wrap;word-break:break-word;margin:0">{{ diagnosisModalOrder.diagnosis }}</pre>
          </div>
          <div v-else>
            <p>No hay diagnóstico registrado.</p>
          </div>
        </div>
        <div class="form-actions" style="margin-top:12px;text-align:right;">
          <button type="button" class="btn btn-secondary" @click="closeDiagnosisModal()">Cerrar</button>
        </div>
      </div>
    </div>

    <div v-if="showEditOrder && editingOrder" class="modal-overlay" @click="showEditOrder = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Editar Orden #{{ editingOrder.id }}</h3>
          <button class="modal-close" @click="showEditOrder = false">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEditedOrder">
            <div class="form-row">
              <div class="form-group" style="position:relative;">
                <label>Placa</label>
                <input v-model="orderPlateSearch" type="search" class="form-input"
                  placeholder="Buscar placa, cliente o marca..."
                  @focus="showPlateDropdownEdit = true"
                  @blur="blurPlateDropdown(true)" />
                <div v-if="showPlateDropdownEdit && getOrderPlateOptions(editingOrder.vehicle).length"
                  style="position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:200;background:var(--brand-surface);border:1px solid var(--brand-border);border-radius:8px;max-height:180px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.35);color:var(--brand-primary-contrast);">
                  <div v-for="v in getOrderPlateOptions(editingOrder.vehicle)" :key="v.plate"
                    @mousedown.prevent="selectPlateForOrder(v, true)"
                    style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--brand-border);font-size:0.95rem;transition:background 0.15s;"
                    onmouseenter="this.style.background='var(--brand-bg-end)'"
                    onmouseleave="this.style.background='transparent'">
                    <strong>{{ v.plate }}</strong> · {{ v.client || 'Sin cliente' }} · {{ v.brand || 'Sin marca' }}
                  </div>
                </div>
              </div>
              <div class="form-group"><label>Cliente</label><input :value="editingOrder.client || 'No registrado'" class="form-input form-input-readonly" readonly /></div>
            </div>
            <div class="form-row">

              <div class="form-group">
                <label>Tipo Vehículo</label>
                <input :value="editingOrder.vehicleType || 'No registrado'" class="form-input form-input-readonly" readonly />
              </div>
              <div class="form-group">
                <label>Modelo</label>
                <input :value="editingOrder.vehicleModel || 'No registrado'" class="form-input form-input-readonly" readonly />
              </div>
              <div class="form-group"><label>Estado</label>
                <select v-model="editingOrder.status" class="form-input">
                  <option>Recepción</option>
                  <option>Diagnóstico</option>
                  <option>Terminado</option>
                  <option>Entregado</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Tipo de servicio</label>
              <div style="display:flex;gap:8px;align-items:center;">
                <input v-model="editingServiceItem" class="form-input"
                  placeholder="Agregar servicio (ej: Alineación)" />
                <button type="button" class="btn btn-secondary" @click.prevent="addEditingService">➕</button>
              </div>
              <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:8px;">
                <span v-for="(s, idx) in (editingOrder.services || [])" :key="idx" class="chip"
                  style="background:#eef2ff;padding:6px 10px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;">{{
                    s }} <button type="button" class="btn btn-sm" style="padding:0 6px;margin-left:6px;"
                    @click.prevent="removeEditingService(idx)">✕</button></span>
                <small v-if="!(editingOrder.services && editingOrder.services.length)" style="color:var(--muted);">Usar
                  'General' si no se agrega ninguno</small>
              </div>
              <div style="margin-top:10px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                <label style="display:inline-flex;align-items:center;gap:8px;font-weight:600;">
                  <input type="checkbox" v-model="editingOrder.gases" /> Gases
                </label>
                <label style="display:inline-flex;align-items:center;gap:8px;font-weight:600;">
                  <input type="checkbox" v-model="editingOrder.escaner" /> Escaner
                </label>
              </div>
            </div>
            <div class="form-group"><label>Observaciones</label><textarea v-model="editingOrder.observations"
                class="form-input" rows="3" placeholder="Notas adicionales de la orden"></textarea></div>
            <div class="form-row">

              <div class="form-group">
                <label>Técnico</label>
                <select v-model="editingOrder.mechanic" class="form-input">
                  <option value="">Seleccionar técnico</option>
                  <option v-for="emp in burnedEmployees" :key="emp.id" :value="emp.name">{{ emp.name }}</option>
                </select>
                <label style="display:inline-flex;align-items:center;gap:8px;font-weight:600;margin-top:10px;">
                  <input type="checkbox" v-model="editingOrder.showTechnicianInPdf" />
                  Mostrar técnico en PDF
                </label>
              </div>
              <div class="form-group"><label>Fecha entrega (opcional)</label><input v-model="editingOrder.deliveryDate"
                  type="date" class="form-input" /></div>
            </div>
            <div class="form-group"><label>Diagnóstico</label><textarea v-model="editingOrder.diagnosis"
                class="form-input" rows="3" placeholder="Escribe el diagnóstico"></textarea></div>
            <div class="form-row">
            </div>
            <div class="form-row">
              <div class="form-group"><label>Garantía (# veces)</label><input v-model.number="editingOrder.garantia"
                  type="number" min="0" class="form-input" /></div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showEditOrder = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Datalist de placas extraído de la pestaña Vehículos -->
    <datalist id="plates-list">
      <option v-for="v in burnedVehicles" :key="v.plate" :value="v.plate"></option>
    </datalist>

    <!-- Plantilla de impresión para Orden de Servicio (visible sólo en impresión) -->
    <div v-if="printOrder" class="print-area" aria-hidden="true">
      <div class="service-order-card">
        <div class="so-topbar">
          <div class="so-brand">
            <img class="so-logo" src="/images/logo.png" alt="Jobs Car logo" />
            <div class="so-brand-copy">
              <p class="so-kicker">Orden de servicio</p>
              <h1>JOB'S CAR</h1>
              <p class="so-subtitle">Centro automotriz</p>
            </div>
          </div>
          <div class="so-number">
            <span>Orden</span>
            <strong>#{{ printOrder.id }}</strong>
          </div>
        </div>

        <div class="so-meta-grid">
          <div class="so-meta-card">
            <span>Fecha emisión</span>
            <strong>{{ new Date().toLocaleDateString() }}</strong>
          </div>
          <div class="so-meta-card">
            <span>Cliente</span>
            <strong>{{ printOrder.client || '-' }}</strong>
          </div>
          <div class="so-meta-card">
            <span>Vehículo</span>
            <strong>{{ printOrder.vehicle || '-' }}</strong>
          </div>
          <div v-if="printOrder.showTechnicianInPdf !== false" class="so-meta-card">
            <span>Técnico</span>
            <strong>{{ printOrder.mechanic || '-' }}</strong>
          </div>
        </div>

        <div class="so-section-grid">
          <div class="so-panel so-panel-wide">
            <div class="so-panel-title">Diagnóstico</div>
            <div class="so-panel-body">{{ printOrder.diagnosis || '-' }}</div>
          </div>
          <div class="so-panel">
            <div class="so-panel-title">Trabajo a realizar</div>
            <div class="so-panel-body">{{ [(printOrder.services && printOrder.services.length) ?
              printOrder.services.join(', ') : (printOrder.serviceType || '-'), (printOrder.gases ? 'Gases: Sí' : ''),
            (printOrder.escaner ? 'Escaner: Sí' : '')].filter(Boolean).join('\n') }}</div>
          </div>
          <div class="so-panel so-panel-wide">
            <div class="so-panel-title">Observaciones</div>
            <div class="so-panel-body">{{ [printOrder.observations, (printOrder.parts && printOrder.parts.length) ?
              ('Repuestos: ' + printOrder.parts.join(', ')) : ''].filter(Boolean).join('\n') || '-' }}</div>
          </div>
        </div>
      </div>
    </div>





    <!-- ==========================================================
         PESTAÑA: FACTURACIÓN
         Administración de facturas: listado, filtros, creación,
         edición, cambio de estado y exportación a CSV/PDF.
         ========================================================== -->
    <!-- Pestaña: Facturación -->
    <div v-if="activeTab === 'invoices'" class="content-section">
      <div class="section-title-bar">
        <div class="section-top"
          style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:nowrap;">
          <h2 class="section-title">💵 Facturación</h2>
          <div class="header-actions" style="display:flex;gap:8px;align-items:center;justify-content:flex-end;">
            <button class="btn btn-secondary header-action" @click="exportInvoicesCsv">Exportar CSV</button>
            <button class="btn btn-primary header-action" @click="openCreateInvoice">➕ Nueva factura</button>
          </div>
        </div>
        <div class="section-controls" style="margin-top:10px;">
          <div class="header-controls">
            <input type="search" v-model="invoiceSearch" placeholder="Buscar por cliente, vehículo o id..."
              class="search-input header-search-input" />
            <select v-model="invoiceFilterStatus" class="form-input">
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Abonado">Abonado</option>
              <option value="Pagado">Pagado</option>
              <option value="Anulado">Anulado</option>
            </select>
            <input type="date" v-model="dateFrom" class="form-input" />
            <input type="date" v-model="dateTo" class="form-input" />
          </div>
        </div>
      </div>

      <div v-if="invoicesLoading" class="loading-indicator" style="text-align:center;padding:24px;color:var(--muted);font-size:1.1rem;">⏳ Cargando facturas...</div>
      <div v-else-if="invoicesError" class="error-banner" style="text-align:center;padding:24px;color:#dc2626;font-size:1.1rem;">❌ {{ invoicesError }}</div>
      <div v-else class="table-responsive invoices-fullwidth" style="margin-top:12px;">
        <table class="simple-table invoices-table compact">
          <colgroup>
            <col style="width:7%" />
            <col style="width:9%" />
            <col style="width:14%" />
            <col style="width:10%" />
            <col style="width:8%" />
            <col style="width:10%" />
            <col style="width:9%" />
            <col style="width:9%" />
            <col style="width:9%" />
            <col style="width:15%" />
          </colgroup>
          <thead class="table-header">
            <tr>
              <th @click="setSort('id')" style="cursor:pointer"># Factura <span v-if="sortKey === 'id'">{{ sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th @click="setSort('createdAt')" style="cursor:pointer">Fecha <span v-if="sortKey === 'createdAt'">{{ sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th @click="setSort('client')" style="cursor:pointer">Cliente <span v-if="sortKey === 'client'">{{ sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th @click="setSort('vehicle')" style="cursor:pointer">Vehículo <span v-if="sortKey === 'vehicle'">{{ sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th>Placa</th>
              <th @click="setSort('total')" style="cursor:pointer">Total <span v-if="sortKey === 'total'">{{ sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th @click="setSort('deposit')" style="cursor:pointer">Abono <span v-if="sortKey === 'deposit'">{{ sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th @click="setSort('balance')" style="cursor:pointer">Saldo <span v-if="sortKey === 'balance'">{{ sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th @click="setSort('status')" style="cursor:pointer">Estado <span v-if="sortKey === 'status'">{{ sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in paginatedInvoices" :key="invoice.id">
              <td data-label="# Factura">#{{ invoice.id }}</td>
              <td data-label="Fecha">{{ invoice.createdAt ? formatShortDate(new Date(invoice.createdAt)) : '-' }}</td>
              <td data-label="Cliente">
                <strong>{{ invoice.client }}</strong>
                <div style="color:var(--muted);font-size:0.85rem;">{{ invoice.placa || invoice.vehicle || '' }}</div>
              </td>
              <td data-label="Vehículo">{{ invoice.vehicleModel || invoice.vehicleBrand || '-' }}</td>
              <td data-label="Placa"><span style="text-transform:uppercase;font-weight:700;">{{ invoice.placa || invoice.vehicle || '-' }}</span></td>
              <td data-label="Total"><strong>${{ invoiceTotal(invoice).toLocaleString() }}</strong></td>
              <td data-label="Abono" :style="{ color: invoiceDepositTotal(invoice) > 0 ? '#22c55e' : 'var(--muted)', fontWeight: invoiceDepositTotal(invoice) > 0 ? '600' : '400' }">${{ invoiceDepositTotal(invoice).toLocaleString() }}</td>
              <td data-label="Saldo" :style="{ color: (invoiceTotal(invoice) - invoiceDepositTotal(invoice)) > 0 ? '#f59e0b' : '#22c55e', fontWeight: '600' }">${{ (invoiceTotal(invoice) - invoiceDepositTotal(invoice)).toLocaleString() }}</td>
              <td data-label="Estado"><span class="status-badge" :class="invoice.status.toLowerCase()">{{ invoice.status }}</span></td>
              <td data-label="Acciones">
                <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">
                  <button class="btn btn-sm btn-secondary" @click="previewInvoiceFn(invoice)" title="Vista previa">👁️</button>
                  <button class="btn btn-sm btn-secondary" @click="editInvoice(invoice)" title="Editar">✏️</button>
                  <button class="btn btn-sm btn-primary" @click="viewInvoice(invoice)" title="PDF">📄</button>
                  <button class="btn btn-sm btn-success" @click="toggleInvoicePaid(invoice)">{{ invoice.status === 'Pagado' ? 'Marcar Pendiente' : (invoice.status === 'Abonado' ? 'Marcar Pagado' : 'Marcar Abonado') }}</button>
                  <button class="btn btn-sm btn-danger" @click="deleteInvoice(invoice.id)" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="sortedInvoices.length === 0">
              <td colspan="10">No hay facturas asociadas</td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer"
          style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;gap:12px;flex-wrap:wrap;">
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn btn-secondary" @click="exportInvoicesCsv">Exportar CSV</button>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn" :disabled="currentPage <= 1"
              @click.prevent="goToPage(currentPage - 1)">Anterior</button>
            <span>Página {{ currentPage }} / {{ totalPages }}</span>
            <button class="btn" :disabled="currentPage >= totalPages"
              @click.prevent="goToPage(currentPage + 1)">Siguiente</button>
            <select v-model.number="pageSize" class="form-input">
              <option :value="5">5</option>
              <option :value="8">8</option>
              <option :value="15">15</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>

    </div>




    <!-- ==========================================================
         PESTAÑA: REPUESTOS
         Control de repuestos y materiales: registro de entradas,
         costos, valor en factura y ganancia neta.
         ========================================================== -->
    <!-- Pestaña: Repuestos -->
    <div v-if="activeTab === 'inventory'" class="content-section">
      <div class="section-title-bar" style="display:grid;grid-template-columns:1fr minmax(260px,420px) auto;align-items:center;gap:12px;">
        <h2 class="section-title">🧰 Repuestos</h2>
        <div style="justify-self:center;">
          <div class="search-input-wrapper" style="max-width:420px;">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
            </svg>
            <input type="search" v-model="searchInventory" placeholder="Buscar respuesto, cliente, etc..."
              aria-label="Buscar inventario" class="search-input" />
            <button v-if="searchInventory" class="search-clear" @click.prevent="searchInventory = ''"
              aria-label="Limpiar búsqueda">X</button>
          </div>
        </div>
        <div style="justify-self:end;">
          <button class="btn btn-primary" @click="showCreateInventory = true">➕ Agregar Repuesto</button>
        </div>
      </div>
      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table compact">
          <colgroup>
            <col style="width:8%" />
            <col style="width:12%" />
            <col style="width:20%" />
            <col style="width:12%" />
            <col style="width:15%" />
            <col style="width:15%" />
            <col style="width:15%" />
            <col style="width:13%" />
          </colgroup>
          <thead class="table-header">
            <tr>
              <th></th>
              <th>Orden # /<br>Factura #</th>
              <th>Cliente / Vehículo</th>
              <th>Cantidad Items</th>
              <th>Costo Total</th>
              <th>Valor Factura</th>
              <th>Ganancia Neta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(items, orderId) in getInventoryGroups()" :key="orderId">
              <!-- Fila principal de la orden -->
              <tr class="inventory-group-row" @click="toggleInventoryOrder(Number(orderId))">
                <td style="text-align:center;">
                  <span style="font-size:1.2rem;color:var(--brand-primary-contrast);">{{ expandedInventoryOrders.has(Number(orderId)) ? '▼' : '▶' }}</span>
                </td>
                <td data-label="Orden #">
                  <strong style="color:var(--brand-primary-contrast);">#{{ orderId }}</strong>
                  <div v-if="findInvoiceByOrderId(Number(orderId))" style="font-size:0.75rem;color:var(--brand-accent);margin-top:2px;">
                    Fact #{{ findInvoiceByOrderId(Number(orderId))?.id }}
                  </div>
                </td>
                <td data-label="Cliente / Vehículo">
                  <div v-if="getOrderForInventory(Number(orderId))">
                    <div style="color:var(--brand-primary-contrast);font-weight:600;">{{ getOrderForInventory(Number(orderId))?.client || 'Sin cliente' }}</div>
                    <div style="font-size:0.85rem;color:var(--muted);">{{ getOrderForInventory(Number(orderId))?.vehicle || '' }}</div>
                  </div>
                  <div v-else>
                    <div style="color:var(--brand-primary-contrast);font-weight:600;">Orden #{{ orderId }}</div>
                    <div style="font-size:0.85rem;color:var(--muted);">Sin información de cliente</div>
                  </div>
                </td>
                <td data-label="Cantidad Items" style="color:var(--brand-primary-contrast);">{{ items.length }}</td>
                <td data-label="Costo Total" style="color:var(--brand-primary-contrast);">${{ items.reduce((sum: number, i: any) => sum + (Number(i.cost) || 0), 0).toLocaleString('es-CO') }}</td>
                <td data-label="Valor Factura" style="color:var(--brand-primary-contrast);">${{ items.reduce((sum: number, i: any) => sum + (Number(i.invoiceValue) || 0), 0).toLocaleString('es-CO') }}</td>
                <td data-label="Ganancia Neta" style="color:var(--brand-primary-contrast);">${{ items.reduce((sum: number, i: any) => sum + (Number(i.netProfit) || 0), 0).toLocaleString('es-CO') }}</td>
                <td data-label="Acciones">
                  <div style="display:flex;gap:6px;justify-content:center;">
                    <button class="btn btn-sm btn-secondary" type="button" @click.stop="showCreateInventory = true; newInventoryItem.orderId = Number(orderId)"
                      aria-label="Agregar repuesto">➕</button>
                  </div>
                </td>
              </tr>
              <!-- Filas desplegadas de actividades -->
              <tr v-if="expandedInventoryOrders.has(Number(orderId))" v-for="item in items" :key="item.id" class="inventory-item-row">
                <td></td>
                <td data-label="Fecha" style="color:var(--muted);">{{ item.date }}</td>
                <td data-label="Actividad" style="color:var(--brand-primary-contrast);">{{ item.activity }}</td>
                <td data-label="Cantidad" style="color:var(--muted);">{{ item.quantity }}</td>
                <td data-label="Costo" style="color:var(--brand-primary-contrast);">${{ (Number(item.cost) || 0).toLocaleString('es-CO') }}</td>
                <td data-label="Valor Factura" style="color:var(--brand-primary-contrast);">${{ (Number(item.invoiceValue) || 0).toLocaleString('es-CO') }}</td>
                <td data-label="Ganancia" style="color:var(--brand-primary-contrast);">${{ (Number(item.netProfit) || 0).toLocaleString('es-CO') }}</td>
                <td data-label="Acciones">
                  <div style="display:flex;gap:6px;justify-content:center;">
                    <button class="btn btn-sm btn-secondary" type="button" @click="editInventoryItem(item)"
                      aria-label="Editar">✏️</button>
                    <button class="btn btn-sm btn-danger" type="button" @click="deleteInventoryItem(item.id)"
                      aria-label="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="burnedInventory.length === 0">
              <td colspan="8">No hay registros de inventario.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal crear inventario -->
    <div v-if="showCreateInventory" class="modal-overlay" @click="showCreateInventory = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Agregar Repuesto al Inventario</h3>
          <button class="modal-close" @click="showCreateInventory = false">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addInventoryItem">
            <div class="form-row">
              <div class="form-group">
                <label>Orden de Servicio *</label>
                <select v-model.number="newInventoryItem.orderId" class="form-input" required>
                  <option :value="0">Seleccionar orden</option>
                  <option v-for="order in burnedOrders" :key="order.id" :value="order.id">#{{ order.id }} - {{ order.client }} ({{ order.vehicle }})</option>
                </select>
              </div>
              <div class="form-group">
                <label>Factura (opcional)</label>
                <select v-model.number="newInventoryItem.invoiceId" class="form-input" @change="newInventoryItem.invoiceItemIndex = null">
                  <option :value="null">Sin factura</option>
                  <option v-for="inv in invoices.filter((i: any) => i.orderId === newInventoryItem.orderId)" :key="inv.id" :value="inv.id">#{{ inv.id }} - {{ inv.client }}</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Fecha</label>
                <input v-model="newInventoryItem.date" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Actividad / Repuesto</label>
                <input v-model="newInventoryItem.activity" type="text" class="form-input" placeholder="Ej: Filtro de aceite" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Cantidad</label>
                <input v-model.number="newInventoryItem.quantity" type="number" min="1" class="form-input" required @input="onQuantityChange(false)" />
              </div>
              <div class="form-group">
                <label>Costo Unitario</label>
                <input :value="formatNumber(newInventoryItem.unitCost)" type="text" class="form-input" required @input="onNumberInput($event, false, 'unitCost')" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Valor Unitario en Factura</label>
                <input :value="formatNumber(newInventoryItem.unitValue)" type="text" class="form-input" required @input="onNumberInput($event, false, 'unitValue')" />
              </div>
              <div class="form-group">
                <label>Costo Total</label>
                <input :value="formatNumber(newInventoryItem.cost)" type="text" class="form-input" required @input="onNumberInput($event, false, 'cost')" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Valor Total en Factura</label>
                <input :value="formatNumber(newInventoryItem.invoiceValue)" type="text" class="form-input" required @input="onNumberInput($event, false, 'invoiceValue')" />
              </div>
              <div class="form-group">
                <label>Ganancia Neta</label>
                <input :value="formatNumber(newInventoryItem.netProfit)" type="text" class="form-input" readonly style="background-color:var(--brand-surface);" />
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showCreateInventory = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal editar inventario -->
    <div v-if="showEditInventory && editingInventory" class="modal-overlay" @click="showEditInventory = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Editar Repuesto del Inventario</h3>
          <button class="modal-close" @click="showEditInventory = false">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEditedInventory">
            <div class="form-row">
              <div class="form-group">
                <label>Orden de Servicio *</label>
                <select v-model.number="editingInventory.orderId" class="form-input" required>
                  <option :value="0">Seleccionar orden</option>
                  <option v-for="order in burnedOrders" :key="order.id" :value="order.id">#{{ order.id }} - {{ order.client }} ({{ order.vehicle }})</option>
                </select>
              </div>
              <div class="form-group">
                <label>Factura (opcional)</label>
                <select v-model.number="editingInventory.invoiceId" class="form-input" @change="editingInventory.invoiceItemIndex = null">
                  <option :value="null">Sin factura</option>
                  <option v-for="inv in invoices.filter((i: any) => i.orderId === editingInventory.orderId)" :key="inv.id" :value="inv.id">#{{ inv.id }} - {{ inv.client }}</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Fecha</label>
                <input v-model="editingInventory.date" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Actividad / Repuesto</label>
                <input v-model="editingInventory.activity" type="text" class="form-input" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Cantidad</label>
                <input v-model.number="editingInventory.quantity" type="number" min="1" class="form-input" required @input="onQuantityChange(true)" />
              </div>
              <div class="form-group">
                <label>Costo Unitario</label>
                <input :value="formatNumber(editingInventory.unitCost)" type="text" class="form-input" required @input="onNumberInput($event, true, 'unitCost')" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Valor Unitario en Factura</label>
                <input :value="formatNumber(editingInventory.unitValue)" type="text" class="form-input" required @input="onNumberInput($event, true, 'unitValue')" />
              </div>
              <div class="form-group">
                <label>Costo Total</label>
                <input :value="formatNumber(editingInventory.cost)" type="text" class="form-input" required @input="onNumberInput($event, true, 'cost')" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Valor Total en Factura</label>
                <input :value="formatNumber(editingInventory.invoiceValue)" type="text" class="form-input" required @input="onNumberInput($event, true, 'invoiceValue')" />
              </div>
              <div class="form-group">
                <label>Ganancia Neta</label>
                <input :value="formatNumber(editingInventory.netProfit)" type="text" class="form-input" readonly style="background-color:var(--brand-surface);" />
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showEditInventory = false">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>





    <!-- ==========================================================
         PESTAÑA: CAJA
         Movimientos de caja del taller: ingresos, egresos,
         referencias, conceptos y observaciones.
         ========================================================== -->
    <!-- Pestaña: Caja -->
    <div v-if="activeTab === 'cash'" class="content-section">
      <div class="section-title-bar" style="display:grid;grid-template-columns:1fr minmax(260px,420px) auto;align-items:center;gap:12px;">
        <h2 class="section-title">💰 Caja</h2>
        <div style="justify-self:center;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
          <div class="search-input-wrapper" style="max-width:280px;">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a 1 1 0 0 0 1.414-1.414z" />
            </svg>
            <input type="search" v-model="searchCash" placeholder="Buscar movimientos..."
              aria-label="Buscar movimientos de caja" class="search-input" />
            <button v-if="searchCash" class="search-clear" @click.prevent="searchCash = ''"
              aria-label="Limpiar búsqueda">X</button>
          </div>
          <select v-model="cashFilterMovement" class="form-input" style="max-width:160px;padding:6px 8px;font-size:0.85rem;">
            <option value="">Todos</option>
            <option value="Ingreso">Ingresos</option>
            <option value="Egreso">Egresos</option>
          </select>
          <input v-model="cashFilterMonth" type="month" class="form-input" style="max-width:180px;padding:6px 8px;font-size:0.85rem;" />
        </div>
        <div style="justify-self:end;">
          <button class="btn btn-primary" @click="showCreateCash = true">➕ Crear Movimiento</button>
        </div>
      </div>
      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table compact">
          <colgroup>
            <col style="width:6%" />
            <col style="width:14%" />
            <col style="width:14%" />
            <col style="width:20%" />
            <col style="width:11%" />
            <col style="width:12%" />
            <col style="width:10%" />
            <col style="width:13%" />
          </colgroup>
          <thead class="table-header">
            <tr>
              <th></th>
              <th>Referencia</th>
              <th>Nombre</th>
              <th>Conceptos</th>
              <th>Movimiento</th>
              <th>Valor</th>
              <th>Cuenta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(items, reference) in cashPaginatedGroups" :key="reference">
              <!-- Fila principal de referencia -->
              <tr class="cash-group-row" @click="toggleCashReference(reference)" v-if="items.length > 1">
                <td style="text-align:center;">
                  <span style="font-size:1.2rem;color:var(--brand-primary-contrast);">{{ expandedCashReferences.has(reference) ? '▼' : '▶' }}</span>
                </td>
                <td data-label="Referencia"><strong style="color:var(--brand-primary-contrast);">{{ reference || '-' }}</strong></td>
                <td data-label="Nombre">{{ items[0].name }}</td>
                <td data-label="Conceptos">{{ items.length }} movimientos</td>
                <td data-label="Movimiento">
                  <span class="status-badge" :class="items[0].movement === 'Ingreso' ? 'available' : 'danger'">{{ items[0].movement }}</span>
                </td>
                <td data-label="Valor"><strong style="color:var(--brand-primary-contrast);">${{ items.reduce((sum: number, i: any) => sum + (Number(i.amount) || 0), 0).toLocaleString('es-CO') }}</strong></td>
                <td data-label="Cuenta">{{ items[0].account }}</td>
                <td data-label="Acciones">
                  <div style="display:flex;gap:6px;justify-content:center;">
                    <button class="btn btn-sm btn-secondary" type="button" @click.stop="editCashItem(items[0])" aria-label="Editar">✏️</button>
                    <button class="btn btn-sm btn-danger" type="button" @click.stop="deleteCashItem(items[0].id)" aria-label="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
              <!-- Filas desplegadas de detalle -->
              <tr v-if="items.length === 1 || expandedCashReferences.has(reference)" v-for="entry in items" :key="entry.id" :class="items.length > 1 ? 'cash-item-row' : ''">
                <td></td>
                <td data-label="Referencia">{{ entry.reference || '-' }}</td>
                <td data-label="Nombre">{{ entry.name }}</td>
                <td data-label="Conceptos">{{ entry.concept }}</td>
                <td data-label="Movimiento">
                  <span class="status-badge" :class="entry.movement === 'Ingreso' ? 'available' : 'danger'">{{ entry.movement }}</span>
                </td>
                <td data-label="Valor">${{ Number(entry.amount).toLocaleString('es-CO') }}</td>
                <td data-label="Cuenta">{{ entry.account }}</td>
                <td data-label="Acciones">
                  <div style="display:flex;gap:6px;justify-content:center;">
                    <button class="btn btn-sm btn-secondary" type="button" @click="editCashItem(entry)" aria-label="Editar movimiento">✏️</button>
                    <button class="btn btn-sm btn-danger" type="button" @click="deleteCashItem(entry.id)" aria-label="Eliminar movimiento">🗑️</button>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="Object.keys(cashPaginatedGroups).length === 0">
              <td colspan="8">No hay movimientos de caja registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Paginación caja -->
      <div v-if="cashTotalPages > 1" style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:16px;flex-wrap:wrap;">
        <button class="btn" :disabled="cashPage <= 1" @click.prevent="cashPage--">Anterior</button>
        <span>Página {{ cashPage }} / {{ cashTotalPages }}</span>
        <button class="btn" :disabled="cashPage >= cashTotalPages" @click.prevent="cashPage++">Siguiente</button>
      </div>

      <!-- Modal crear movimiento de caja -->
      <div v-if="showCreateCash" class="modal-overlay" @click="showCreateCash = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Crear Movimiento de Caja</h3>
            <button class="modal-close" @click="showCreateCash = false">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCashItem">
              <div class="form-row">
                <div class="form-group">
                  <label>Fecha</label>
                  <input v-model="newCashItem.date" type="date" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Referencia</label>
                  <input v-model="newCashItem.reference" type="text" class="form-input" placeholder="Ej: 2X" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre *</label>
                  <input v-model="newCashItem.name" type="text" class="form-input" required placeholder="Ej: NISSAN" />
                </div>
                <div class="form-group">
                  <label>Concepto *</label>
                  <input v-model="newCashItem.concept" type="text" class="form-input" required placeholder="Ej: TRABAJO REALIZADO" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Movimiento</label>
                  <select v-model="newCashItem.movement" class="form-input">
                    <option>Ingreso</option>
                    <option>Egreso</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Valor</label>
                  <input :value="formatNumber(newCashItem.amount)" type="text" class="form-input" required @input="newCashItem.amount = parseNumber(($event.target as HTMLInputElement).value)" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Cuenta</label>
                  <select v-model="newCashItem.account" class="form-input">
                    <option>Banco</option>
                    <option>Caja Menor</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Observación</label>
                  <input v-model="newCashItem.observation" type="text" class="form-input" placeholder="Notas opcionales" />
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="showCreateCash = false">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal editar movimiento de caja -->
      <div v-if="showEditCash && editingCash" class="modal-overlay" @click="showEditCash = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Editar Movimiento de Caja</h3>
            <button class="modal-close" @click="showEditCash = false">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEditedCash">
              <div class="form-row">
                <div class="form-group">
                  <label>Fecha</label>
                  <input v-model="editingCash.date" type="date" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Referencia</label>
                  <input v-model="editingCash.reference" type="text" class="form-input" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre *</label>
                  <input v-model="editingCash.name" type="text" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Concepto *</label>
                  <input v-model="editingCash.concept" type="text" class="form-input" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Movimiento</label>
                  <select v-model="editingCash.movement" class="form-input">
                    <option>Ingreso</option>
                    <option>Egreso</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Valor</label>
                  <input :value="formatNumber(editingCash.amount)" type="text" class="form-input" required @input="editingCash.amount = parseNumber(($event.target as HTMLInputElement).value)" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Cuenta</label>
                  <select v-model="editingCash.account" class="form-input">
                    <option>Banco</option>
                    <option>Caja Menor</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Observación</label>
                  <input v-model="editingCash.observation" type="text" class="form-input" />
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="showEditCash = false">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>



    <!-- ==========================================================
         PESTAÑA: EMPLEADOS
         Gestión del personal del taller: creación, edición,
         búsqueda, nómina y resumen de desempeño.
         ========================================================== -->
    <!-- Pestaña: Empleados -->
    <div v-if="activeTab === 'employees'" class="content-section">
      <div class="section-title-bar"
        style="margin-top:0;display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <h2 class="section-title">💼 Nómina</h2>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="btn" :class="payrollViewMode === 'employee' ? 'btn-primary' : 'btn-secondary'" @click="payrollViewMode = 'employee'">Por Empleado</button>
          <button class="btn" :class="payrollViewMode === 'biweekly' ? 'btn-primary' : 'btn-secondary'" @click="payrollViewMode = 'biweekly'">Por Quincena</button>
          <select v-model="payrollEmployeeFilter" class="form-input" style="min-width:180px;">
            <option value="">Todos los empleados</option>
            <option v-for="emp in burnedEmployees" :key="emp.id" :value="emp.name">{{ emp.name }}</option>
          </select>
          <select v-model="payrollBiweeklyFilter" class="form-input" style="min-width:180px;">
            <option value="">Todas las quincenas</option>
            <option v-for="period in payrollBiweeklyPeriods" :key="period" :value="period">{{ period }}</option>
          </select>
        </div>
      </div>

      <div class="stats-grid" style="margin-top:16px; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px;">
        <div class="stat-card" style="padding: 10px; gap: 10px;">
          <div class="stat-icon" style="font-size: 1.2rem; width: 32px; height: 32px; min-width: 32px; min-height: 32px; flex-shrink: 0;">🧾</div>
          <div class="stat-content">
            <div class="stat-number" style="font-size: 1.1rem;">{{ payrollTotals.ordersCount }}</div>
            <div class="stat-label" style="font-size: 0.65rem;">Servicios entregados</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 10px; gap: 10px;">
          <div class="stat-icon" style="font-size: 1.2rem; width: 32px; height: 32px; min-width: 32px; min-height: 32px; flex-shrink: 0;">💵</div>
          <div class="stat-content">
            <div class="stat-number" style="font-size: 1.1rem;">${{ formatNumber(payrollTotals.grossTotal) }}</div>
            <div class="stat-label" style="font-size: 0.65rem;">Total M.O.</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 10px; gap: 10px;">
          <div class="stat-icon" style="font-size: 1.2rem; width: 32px; height: 32px; min-width: 32px; min-height: 32px; flex-shrink: 0;">➖</div>
          <div class="stat-content">
            <div class="stat-number" style="font-size: 1.1rem;">${{ formatNumber(payrollTotals.totalDiscount) }}</div>
            <div class="stat-label" style="font-size: 0.65rem;">Descuentos</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 10px; gap: 10px;">
          <div class="stat-icon" style="font-size: 1.2rem; width: 32px; height: 32px; min-width: 32px; min-height: 32px; flex-shrink: 0;">👨‍🔧</div>
          <div class="stat-content">
            <div class="stat-number" style="font-size: 1.1rem;">${{ formatNumber(payrollTotals.technicianShare) }}</div>
            <div class="stat-label" style="font-size: 0.65rem;">Total a pagar técnicos</div>
          </div>
        </div>
        <div class="stat-card" style="padding: 10px; gap: 10px;">
          <div class="stat-icon" style="font-size: 1.2rem; width: 32px; height: 32px; min-width: 32px; min-height: 32px; flex-shrink: 0;">🏪</div>
          <div class="stat-content">
            <div class="stat-number" style="font-size: 1.1rem;">${{ formatNumber(payrollTotals.workshopShare) }}</div>
            <div class="stat-label" style="font-size: 0.65rem;">50% taller</div>
          </div>
        </div>
      </div>

      <!-- Vista por Empleado -->
      <div v-if="payrollViewMode === 'employee'" class="table-responsive" style="margin-top:16px;">
        <table class="simple-table compact">
          <colgroup>
            <col style="width:6%" />
            <col style="width:18%" />
            <col style="width:10%" />
            <col style="width:14%" />
            <col style="width:14%" />
            <col style="width:14%" />
            <col style="width:14%" />
            <col style="width:10%" />
          </colgroup>
          <thead class="table-header">
            <tr>
              <th></th>
              <th>Técnico</th>
              <th>Servicios</th>
              <th>Total M.O.</th>
              <th>Descuento</th>
              <th>50% Técnico</th>
              <th>50% Taller</th>
              <th>A Pagar</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in payrollRows" :key="row.id">
              <!-- Fila principal del empleado -->
              <tr class="payroll-group-row" @click="togglePayrollEmployee(row.id)">
                <td style="text-align:center;">
                  <span style="font-size:1.2rem;color:var(--brand-primary-contrast);">{{ expandedPayrollEmployees.has(row.id) ? '▼' : '▶' }}</span>
                </td>
                <td data-label="Técnico">
                  <strong style="color:var(--brand-primary-contrast);">{{ row.name }}</strong>
                  <div style="color:var(--muted);font-size:0.85rem;">{{ row.role }}</div>
                </td>
                <td data-label="Servicios" style="color:var(--brand-primary-contrast);">{{ row.ordersCount }}</td>
                <td data-label="Total M.O." style="color:var(--brand-primary-contrast);">${{ formatNumber(row.grossTotal) }}</td>
                <td data-label="Descuento" style="color:var(--brand-primary-contrast);">${{ formatNumber(row.totalDiscount) }}</td>
                <td data-label="50% Técnico" style="color:var(--brand-primary-contrast);">${{ formatNumber(row.technicianShare) }}</td>
                <td data-label="50% Taller" style="color:var(--brand-primary-contrast);">${{ formatNumber(row.workshopShare) }}</td>
                <td data-label="A Pagar" style="color:var(--brand-primary-contrast);">${{ formatNumber(row.technicianShare) }}</td>
              </tr>
              <!-- Filas desplegadas de facturas/órdenes -->
              <tr v-if="expandedPayrollEmployees.has(row.id)" v-for="order in row.orders" :key="order.id" class="payroll-item-row">
                <td></td>
                <td data-label="Orden">#{{ order.id }} - {{ order.vehicle }}</td>
                <td data-label="Fecha">{{ order.createdDate }}</td>
                <td data-label="Mano de Obra">${{ formatNumber(order.laborTotal) }}</td>
                <td data-label="Descuento">${{ formatNumber(order.discount) }}</td>
                <td data-label="50% Técnico">${{ formatNumber(order.laborTotal * 0.5) }}</td>
                <td data-label="50% Taller">${{ formatNumber(order.laborTotal * 0.5) }}</td>
                <td data-label="A Pagar">${{ formatNumber(order.technicianShare) }}</td>
              </tr>
            </template>
            <tr v-if="payrollRows.length === 0">
              <td colspan="8">No hay datos de nómina disponibles.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vista por Quincena -->
      <div v-if="payrollViewMode === 'biweekly'" class="table-responsive" style="margin-top:16px;">
        <table class="simple-table compact">
          <colgroup>
            <col style="width:20%" />
            <col style="width:12%" />
            <col style="width:16%" />
            <col style="width:16%" />
            <col style="width:16%" />
            <col style="width:16%" />
          </colgroup>
          <thead class="table-header">
            <tr>
              <th>Quincena</th>
              <th>Servicios</th>
              <th>Total M.O.</th>
              <th>Descuento</th>
              <th>50% Técnico</th>
              <th>50% Taller</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="biweekly in payrollBiweeklyRows" :key="biweekly.period">
              <td data-label="Quincena"><strong>{{ biweekly.period }}</strong></td>
              <td data-label="Servicios">{{ biweekly.ordersCount }}</td>
              <td data-label="Total M.O.">${{ formatNumber(biweekly.grossTotal) }}</td>
              <td data-label="Descuento">${{ formatNumber(biweekly.totalDiscount) }}</td>
              <td data-label="50% Técnico">${{ formatNumber(biweekly.technicianShare) }}</td>
              <td data-label="50% Taller">${{ formatNumber(biweekly.workshopShare) }}</td>
            </tr>
            <tr v-if="payrollBiweeklyRows.length === 0">
              <td colspan="6">No hay datos de quincenas disponibles.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section-title-bar"
        style="margin-top:24px;display:grid;grid-template-columns:1fr minmax(320px,420px) auto;align-items:center;gap:12px;">
        <h2 class="section-title">Empleados</h2>
        <div style="justify-self:center;">
          <div class="search-input-wrapper" style="max-width:420px;">
            <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
            </svg>
            <input type="search" v-model="searchEmployees" placeholder="Buscar empleados..."
              aria-label="Buscar empleados" class="search-input" />
            <button v-if="searchEmployees" class="search-clear" @click.prevent="searchEmployees = ''"
              aria-label="Limpiar búsqueda">X</button>
          </div>
        </div>
        <div style="justify-self:end;">
          <button class="btn btn-primary" @click="showCreateEmployee = true">➕ Crear Empleado</button>
        </div>
      </div>

      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table employees-table">
          <colgroup>
            <col style="width:15%" /> <!-- Nombre -->
            <col style="width:12%" /> <!-- Cargo -->
            <col style="width:14%" /> <!-- Especialidad -->
            <col style="width:13%" /> <!-- Teléfono -->
            <col style="width:12%" /> <!-- Estado -->
            <col style="width:12%" /> <!-- Fecha Ingreso -->
            <col style="width:11%" /> <!-- OT Activas -->
            <col style="width:14%" /> <!-- Observaciones -->
            <col style="width:10%" /> <!-- Acciones -->
          </colgroup>
          <thead class="table-header">
            <tr>
              <th>Nombre</th>
              <th>Cargo</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Fecha Ingreso</th>
              <th>OT Activas</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in burnedEmployees.filter(emp => {
              if (!searchEmployees) return true
              const q = searchEmployees.toLowerCase().trim()
              return (emp.name && emp.name.toLowerCase().includes(q)) ||
                (emp.role && emp.role.toLowerCase().includes(q)) ||
                (emp.specialty && emp.specialty.toLowerCase().includes(q)) ||
                (emp.phone && emp.phone.toLowerCase().includes(q)) ||
                (emp.notes && emp.notes.toLowerCase().includes(q))
            })" :key="emp.id">
              <td data-label="Nombre">{{ emp.name }}</td>
              <td data-label="Cargo">{{ emp.role }}</td>
              <td data-label="Especialidad">{{ emp.specialty || '-' }}</td>
              <td data-label="Teléfono">{{ emp.phone || '-' }}</td>
              <td data-label="Estado">Activo</td>
              <td data-label="Fecha Ingreso">{{ emp.entryDate ? formatShortDate(new Date(emp.entryDate)) : '-' }}</td>
              <td data-label="OT Activas">{{ getEmployeeActiveOrders(emp) }}</td>
              <td data-label="Observaciones"><span class="client-notes">{{ emp.notes || '-' }}</span></td>
              <td data-label="Acciones">
                <div class="actions" style="display:flex;gap:6px;justify-content:center;">
                  <button class="btn btn-sm btn-secondary" @click="editEmployee(emp)">✏️</button>
                  <button class="btn btn-sm btn-danger" @click="deleteEmployee(emp.id)">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="burnedEmployees.length === 0">
              <td colspan="9">No hay empleados registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal crear empleado -->
      <div v-if="showCreateEmployee" class="modal-overlay" @click="showCreateEmployee = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Crear Empleado</h3>
            <button class="modal-close" @click="showCreateEmployee = false">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addBurnedEmployee">
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre *</label>
                  <input v-model="newEmployee.name" type="text" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Cargo *</label>
                  <input v-model="newEmployee.role" type="text" class="form-input" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Especialidad</label>
                  <input v-model="newEmployee.specialty" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="newEmployee.email" type="email" class="form-input" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Teléfono</label>
                  <input v-model="newEmployee.phone" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Órdenes asignadas</label>
                  <input :value="0" type="number" class="form-input" min="0" disabled />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Estado</label>
                  <input :value="'Activo'" type="text" class="form-input" disabled />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Fecha ingreso</label>
                  <input v-model="newEmployee.entryDate" type="date" class="form-input" />
                </div>
                <div class="form-group" style="visibility:hidden"></div>
              </div>
              <div class="form-group">
                <label>Notas</label>
                <textarea v-model="newEmployee.notes" class="form-input" rows="2"></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="showCreateEmployee = false">Cancelar</button>
                <button type="submit" class="btn btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal editar empleado -->
      <div v-if="showEditEmployee && editingEmployee" class="modal-overlay" @click="showEditEmployee = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Editar Empleado</h3>
            <button class="modal-close" @click="showEditEmployee = false">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEditedEmployee">
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre *</label>
                  <input v-model="editingEmployee.name" type="text" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Cargo *</label>
                  <input v-model="editingEmployee.role" type="text" class="form-input" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Especialidad</label>
                  <input v-model="editingEmployee.specialty" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="editingEmployee.email" type="email" class="form-input" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Teléfono</label>
                  <input v-model="editingEmployee.phone" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Órdenes asignadas</label>
                  <input :value="editingEmployee ? getEmployeeActiveOrders(editingEmployee) : 0" type="number"
                    class="form-input" min="0" disabled />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Estado</label>
                  <input :value="'Activo'" type="text" class="form-input" disabled />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Fecha ingreso</label>
                  <input v-model="editingEmployee.entryDate" type="date" class="form-input" />
                </div>
                <div class="form-group" style="visibility:hidden"></div>
              </div>
              <div class="form-group">
                <label>Notas</label>
                <textarea v-model="editingEmployee.notes" class="form-input" rows="2"></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" @click="showEditEmployee = false">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>




    <!-- ==========================================================
         PESTAÑA: AGENDA / CALENDARIO
         Calendario mensual interactivo para programar órdenes
         y citas, con vista de órdenes activas y agendamiento.
         ========================================================== -->
    <!-- Pestaña: Agenda (Calendario) -->
    <div v-if="activeTab === 'agenda'" class="content-section">
      <div class="section-title-bar" style="display:flex;justify-content:space-between;align-items:center;">
        <h2 class="section-title">📅 Agenda</h2>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="btn btn-primary" @click="openScheduleModal(null)">+ Crear Cita</button>
          <button class="btn" @click="prevMonth">◀</button>
          <div style="font-weight:700">{{ monthNames[calendarDate.getMonth()] }} {{ calendarDate.getFullYear() }}</div>
          <button class="btn" @click="nextMonth">▶</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 280px;gap:12px;margin-top:12px;">
        <div class="pro-card" style="padding:8px;overflow:auto;">
          <div
            style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-weight:700;padding:6px 0;gap:4px;font-size:0.75rem;">
            <div>Dom</div>
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:6px;">
            <div v-for="cell in monthDays" :key="cell.iso" :class="['calendar-cell', { 'other-month': !cell.inMonth }]"
              style="min-height:68px;max-height:68px;padding:4px;border-radius:6px;background:var(--brand-bg-end);overflow:hidden;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div :style="{ opacity: cell.inMonth ? 1 : 0.4, fontSize: '0.75rem' }">{{ cell.day }}</div>
                <button class="btn btn-sm" style="padding:2px 5px;font-size:0.7rem;" @click="openScheduleModal(null, cell.iso)">+</button>
              </div>
              <div style="margin-top:2px;display:flex;flex-direction:column;gap:3px;overflow-y:auto;max-height:48px;">
                <!-- Órdenes en AZUL (no editables) -->
                <div v-for="(ev, idx) in (eventsByDate[cell.iso] || []).filter(e => e.type === 'order').slice(0, 6)" :key="'order-'+idx"
                  class="calendar-event order-event"
                  @click="openOrderViewModal(ev.id)"
                  :title="ev.client + ' - ' + ev.vehicle + ' #' + ev.id">
                  <span class="event-dot blue"></span>
                  <span class="event-text">{{ ev.vehicle || '-' }} - {{ ev.client || '-' }} #{{ ev.id }}</span>
                </div>
                <!-- Citas en VERDE (editables) -->
                <div v-for="(ev, idx) in (eventsByDate[cell.iso] || []).filter(e => e.type === 'agenda').slice(0, 6)" :key="'agenda-'+idx"
                  class="calendar-event agenda-event"
                  @click="openEditAgendaModal(ev)"
                  :title="ev.client + ' - ' + ev.vehicle">
                  <span class="event-dot green"></span>
                  <span class="event-text">{{ ev.client || '-' }} - {{ ev.vehicle || '-' }}</span>
                </div>
                <div v-if="(eventsByDate[cell.iso] || []).length > 6"><small style="font-size:0.65rem;">+{{ (eventsByDate[cell.iso] || []).length - 6 }} más</small></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel lateral reformado -->
        <div class="pro-card" style="padding:10px;overflow:auto;max-height:480px;">
          <!-- Citas (Verde) -->
          <div style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <h3 style="margin:0;display:flex;align-items:center;gap:8px;">
                <span style="width:10px;height:10px;border-radius:50%;background:#22c55e;display:inline-block;"></span>
                Citas Programadas
              </h3>
              <span style="font-size:0.85rem;color:var(--brand-accent-alt);">{{ agendaItemsForMonth.length }}</span>
            </div>
            <div v-if="agendaItemsForMonth.length === 0" style="color:var(--muted);font-size:0.9rem;margin-bottom:8px;">
              No hay citas para este mes.
            </div>
            <div v-for="item in agendaItemsForMonth" :key="item.id"
              class="agenda-list-item agenda-item-green"
              @click="openEditAgendaModal(item)">
              <div style="font-weight:600;font-size:0.9rem;">{{ item.client || '-' }} - {{ item.vehicle || '-' }}</div>
              <div style="font-size:0.8rem;color:var(--brand-accent-alt);">{{ item.date }} {{ item.time ? '· ' + item.time : '' }}</div>
              <div v-if="item.service" style="font-size:0.8rem;color:var(--brand-accent-alt);">{{ item.service }}</div>
            </div>
          </div>

           <!-- Órdenes Activas con Fecha (Azul) -->
          <div style="border-top:1px solid var(--brand-border);padding-top:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <h3 style="margin:0;display:flex;align-items:center;gap:8px;">
                <span style="width:10px;height:10px;border-radius:50%;background:#3b82f6;display:inline-block;"></span>
                Órdenes Activas
              </h3>
              <span style="font-size:0.85rem;color:var(--brand-accent-alt);">{{ activeOrdersForMonth.length }}</span>
            </div>
            <div v-if="activeOrdersForMonth.length === 0" style="color:var(--muted);font-size:0.9rem;margin-bottom:8px;">
              No hay órdenes con fecha para este mes.
            </div>
            <div v-for="order in activeOrdersForMonth" :key="order.id"
              class="agenda-list-item agenda-item-blue">
              <div style="font-weight:600;font-size:0.9rem;">#{{ order.id }} — {{ order.client || '-' }}</div>
              <div style="font-size:0.8rem;color:var(--brand-accent-alt);">{{ order.vehicle || '-' }} · {{ order.status }}</div>
              <div v-if="order.deliveryDate" style="font-size:0.8rem;color:var(--brand-success);font-weight:600;">
                Entrega: {{ order.deliveryDate }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Crear / Editar Cita -->
      <div v-if="showScheduleModal" class="modal-overlay" @click="showScheduleModal = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ editingAgendaId ? 'Editar Cita' : 'Crear Cita' }}</h3>
            <button class="modal-close" @click="showScheduleModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div style="margin-bottom:8px;">
              <label><strong>Fecha:</strong></label>
              <input type="date" v-model="scheduleDateIso" class="form-input" />
            </div>
            <div style="margin-top:8px;border-top:1px dashed var(--brand-border);padding-top:8px;">
              <small>{{ editingAgendaId ? 'Editar cita' : 'Crear nueva cita' }}</small>
              <div class="form-row">
                <div class="form-group"><label>Placa / Carro</label><input v-model="newCalendarOrder.vehicle" class="form-input" /></div>
                <div class="form-group"><label>Cliente</label><input v-model="newCalendarOrder.client" class="form-input" /></div>
              </div>
              <div class="form-group">
                <label>Asunto / Servicio</label>
                <input v-model="newCalendarOrder.serviceType" class="form-input" />
              </div>
            </div>
            <div class="form-group">
              <label>Hora</label>
              <input type="time" v-model="scheduleTime" class="form-input" />
            </div>
            <div class="form-actions" style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
              <button v-if="editingAgendaId" class="btn btn-danger" @click="deleteEditingAgenda">Eliminar</button>
              <button class="btn btn-secondary" @click="showScheduleModal = false">Cancelar</button>
              <button class="btn btn-primary" @click="confirmSchedule">Guardar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Ver Orden (solo lectura) -->
      <div v-if="showOrderViewModal" class="modal-overlay" @click="showOrderViewModal = false">
        <div class="modal" @click.stop style="max-width:480px;">
          <div class="modal-header">
            <h3>Orden #{{ orderViewData?.id }}</h3>
            <button class="modal-close" @click="showOrderViewModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
              <div class="form-group" style="margin:0;">
                <label>Cliente</label>
                <div class="form-input" style="background:rgba(15,23,42,0.3);cursor:default;">{{ orderViewData?.client || '-' }}</div>
              </div>
              <div class="form-group" style="margin:0;">
                <label>Vehículo</label>
                <div class="form-input" style="background:rgba(15,23,42,0.3);cursor:default;">{{ orderViewData?.vehicle || '-' }}</div>
              </div>
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label>Estado</label>
              <div class="form-input" style="background:rgba(15,23,42,0.3);cursor:default;">{{ orderViewData?.status || '-' }}</div>
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label>Servicios</label>
              <div class="form-input" style="background:rgba(15,23,42,0.3);cursor:default;">{{ orderViewData?.services?.join(', ') || orderViewData?.serviceType || 'General' }}</div>
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label>Técnico</label>
              <div class="form-input" style="background:rgba(15,23,42,0.3);cursor:default;">{{ orderViewData?.mechanic || '-' }}</div>
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label>Diagnóstico</label>
              <div class="form-input" style="background:rgba(15,23,42,0.3);cursor:default;min-height:60px;white-space:pre-wrap;">{{ orderViewData?.diagnosis || '-' }}</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
              <div class="form-group" style="margin:0;">
                <label>Fecha Entrega</label>
                <div class="form-input" style="background:rgba(15,23,42,0.3);cursor:default;">{{ orderViewData?.deliveryDate || '-' }}</div>
              </div>
              <div class="form-group" style="margin:0;">
                <label>Fecha Creación</label>
                <div class="form-input" style="background:rgba(15,23,42,0.3);cursor:default;">{{ orderViewData?.createdDate || '-' }}</div>
              </div>
            </div>
            <div class="form-actions" style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
              <button class="btn btn-secondary" @click="showOrderViewModal = false">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==========================================================
          PESTAÑA: DASHBOARD / REPORTES
          Panel de indicadores clave (KPIs): ingresos, órdenes,
          desempeño de técnicos, garantías, alertas y gráficas.
          ========================================================== -->
    <!-- Dashboard: resumen y estadísticas -->
    <div v-if="activeTab === 'reports'" class="content-section">
      <div class="dashboard-professional-header">
        <div class="dashboard-header-left">
          <div class="dashboard-header-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h2 class="dashboard-title">Dashboard General</h2>
            <p class="dashboard-subtitle">Visión general y métricas clave del taller</p>
          </div>
        </div>
        <div class="dashboard-header-center">
          <span class="dashboard-user-name" @click="router.push('/admin/cesar-olivos')">Cesar Olivos</span>
        </div>
        <div class="dashboard-header-right">
          <span class="dashboard-date">{{ currentDate }}</span>
          <button @click="loadPurchases" class="btn btn-secondary" :disabled="isLoadingSales">
            {{ isLoadingSales ? 'Cargando...' : 'Actualizar' }}
          </button>
        </div>
      </div>

      <!-- Filtro de Métricas Principales -->
      <div class="dashboard-metrics-filter-bar">
        <div class="dashboard-metrics-filter-tabs">
          <button class="dashboard-metrics-filter-tab" :class="{ active: dashboardMetricsFilterMode === 'month' }" @click="dashboardMetricsFilterMode = 'month'">Mes</button>
          <button class="dashboard-metrics-filter-tab" :class="{ active: dashboardMetricsFilterMode === 'range' }" @click="dashboardMetricsFilterMode = 'range'">Rango</button>
          <button class="dashboard-metrics-filter-tab" :class="{ active: dashboardMetricsFilterMode === 'biweekly' }" @click="dashboardMetricsFilterMode = 'biweekly'">Quincena</button>
        </div>
        <div class="dashboard-metrics-filter-inputs">
          <div v-if="dashboardMetricsFilterMode === 'month'" class="dashboard-date-range">
            <input type="month" v-model="dashboardMetricsMonth" class="dashboard-date-input" />
            <button v-if="dashboardMetricsMonth" class="dashboard-date-clear" @click="dashboardMetricsMonth = ''">✕</button>
          </div>
          <div v-if="dashboardMetricsFilterMode === 'range'" class="dashboard-date-range">
            <input type="date" v-model="dashboardMetricsDateFrom" class="dashboard-date-input" />
            <span class="dashboard-date-separator">→</span>
            <input type="date" v-model="dashboardMetricsDateTo" class="dashboard-date-input" />
            <button v-if="dashboardMetricsDateFrom || dashboardMetricsDateTo" class="dashboard-date-clear" @click="dashboardMetricsDateFrom = ''; dashboardMetricsDateTo = ''">✕</button>
          </div>
          <div v-if="dashboardMetricsFilterMode === 'biweekly'" class="dashboard-date-range">
            <select v-model="dashboardMetricsBiweekly" class="dashboard-date-input">
              <option value="">Todas</option>
              <option v-for="p in dashboardAvailablePeriods.filter(p => p.value.includes('Q'))" :key="p.value" :value="p.value">{{ p.label }}</option>
            </select>
            <button v-if="dashboardMetricsBiweekly" class="dashboard-date-clear" @click="dashboardMetricsBiweekly = ''">✕</button>
          </div>
        </div>
      </div>

      <!-- Métricas de Cantidades -->
      <div class="dashboard-metrics-grid">
        <!-- 1. Órdenes Activas -->
        <div class="dashboard-metric-card">
          <div class="dashboard-metric-icon orange">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div class="dashboard-metric-info">
            <p class="dashboard-metric-value">{{ filteredOrdersActiveCount }}</p>
            <p class="dashboard-metric-label">Órdenes Activas</p>
          </div>
        </div>

        <!-- 2. Órdenes Entregadas -->
        <div class="dashboard-metric-card">
          <div class="dashboard-metric-icon green">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <div class="dashboard-metric-info">
            <p class="dashboard-metric-value">{{ filteredOrdersDeliveredCount }}</p>
            <p class="dashboard-metric-label">Órdenes Entregadas</p>
          </div>
        </div>

        <!-- 3. Vehículos Atendidos -->
        <div class="dashboard-metric-card">
          <div class="dashboard-metric-icon blue">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 17a2 2 0 1 1 4 0M15 17a2 2 0 1 1 4 0M5 17H3v-4h18v4h-2"/>
              <path d="M3 13V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/>
            </svg>
          </div>
          <div class="dashboard-metric-info">
            <p class="dashboard-metric-value">{{ filteredVehiclesCount }}</p>
            <p class="dashboard-metric-label">Vehículos Atendidos</p>
          </div>
        </div>

        <!-- 4. Facturas Generadas -->
        <div class="dashboard-metric-card">
          <div class="dashboard-metric-icon blue">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="dashboard-metric-info">
            <p class="dashboard-metric-value">{{ filteredTotalInvoices }}</p>
            <p class="dashboard-metric-label">Facturas Generadas</p>
          </div>
        </div>

        <!-- 5. Facturas sin abono -->
        <div class="dashboard-metric-card">
          <div class="dashboard-metric-icon red">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="dashboard-metric-info">
            <p class="dashboard-metric-value">{{ filteredWithoutDepositInvoices }}</p>
            <p class="dashboard-metric-label">Facturas sin abono</p>
          </div>
        </div>

        <!-- 6. Facturas con abono -->
        <div class="dashboard-metric-card">
          <div class="dashboard-metric-icon orange">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="dashboard-metric-info">
            <p class="dashboard-metric-value">{{ filteredWithDepositInvoices }}</p>
            <p class="dashboard-metric-label">Facturas con abono</p>
          </div>
        </div>

        <!-- 7. Facturas Pagadas -->
        <div class="dashboard-metric-card">
          <div class="dashboard-metric-icon purple">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="dashboard-metric-info">
            <p class="dashboard-metric-value">{{ filteredPaidInvoices }}</p>
            <p class="dashboard-metric-label">Facturas Pagadas</p>
          </div>
        </div>
      </div>

      <!-- Métricas de Ingresos ($) -->
      <div class="dashboard-metrics-grid" style="margin-top:12px;">
        <!-- 1. Ingresos Facturados -->
        <div class="dashboard-metric-card">
          <div class="dashboard-metric-icon teal">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="dashboard-metric-info">
            <p class="dashboard-metric-value">${{ filteredTotalInvoiced.toLocaleString() }}</p>
            <p class="dashboard-metric-label">Ingresos Facturados</p>
          </div>
        </div>

        <!-- 2. Ingresos con Abono -->
        <div class="dashboard-metric-card">
          <div class="dashboard-metric-icon orange">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="dashboard-metric-info">
            <p class="dashboard-metric-value">${{ filteredTotalDepositsOnly.toLocaleString() }}</p>
            <p class="dashboard-metric-label">Ingresos con Abono</p>
          </div>
        </div>

        <!-- 3. Ingresos Pagados Total -->
        <div class="dashboard-metric-card">
          <div class="dashboard-metric-icon green">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="dashboard-metric-info">
            <p class="dashboard-metric-value">${{ filteredTotalPaidOnly.toLocaleString() }}</p>
            <p class="dashboard-metric-label">Ingresos Pagados Total</p>
          </div>
        </div>
      </div>
      <!-- Próximas Citas - Primero de todo -->
      <div class="dashboard-upcoming-section" v-if="upcomingAppointments.length > 0">
        <div class="dashboard-upcoming-header">
          <div class="dashboard-upcoming-header-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <h3 class="dashboard-upcoming-title">Próximas Citas</h3>
            <p class="dashboard-upcoming-subtitle">{{ upcomingAppointments.length }} citas programadas</p>
          </div>
        </div>
        <div class="dashboard-upcoming-grid">
          <div v-for="appt in upcomingAppointments.slice(0, 6)" :key="appt.id" class="dashboard-upcoming-card">
            <div class="dashboard-upcoming-card-date">
              <span class="dashboard-upcoming-day">{{ appt.date ? new Date(appt.date).getDate() : '-' }}</span>
              <span class="dashboard-upcoming-month">{{ appt.date ? new Date(appt.date).toLocaleDateString('es-CO', { month: 'short' }) : '' }}</span>
            </div>
            <div class="dashboard-upcoming-card-info">
              <div class="dashboard-upcoming-card-time">{{ appt.time }}</div>
              <div class="dashboard-upcoming-card-client">{{ appt.client }}</div>
              <div class="dashboard-upcoming-card-service">{{ appt.service || 'Servicio general' }}</div>
            </div>
            <div class="dashboard-upcoming-card-status" :class="getAppointmentStatusClass(appt)">
              {{ getAppointmentStatusLabel(appt) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de Facturas - Detalle -->
      <div class="dashboard-panel" v-if="filteredInvoicesForDashboard.length > 0">
        <div class="dashboard-panel-header">
          <div class="dashboard-panel-header-left">
            <div class="dashboard-panel-icon" style="background:rgba(139,92,246,0.15);color:#a78bfa;">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div>
              <h3 class="dashboard-panel-title">Estado de Facturas</h3>
              <p class="dashboard-panel-subtitle">{{ filteredInvoicesForDashboard.length }} facturas en el período</p>
            </div>
          </div>
          <div class="dashboard-panel-filters">
            <div class="dashboard-date-range">
              <input type="month" v-model="dashboardInvoiceMonth" class="dashboard-date-input" />
              <button v-if="dashboardInvoiceMonth" class="dashboard-date-clear" @click="dashboardInvoiceMonth = ''">✕</button>
            </div>
            <div class="dashboard-date-range">
              <input type="date" v-model="dashboardInvoiceDateFrom" class="dashboard-date-input" placeholder="Desde" />
              <span class="dashboard-date-separator">→</span>
              <input type="date" v-model="dashboardInvoiceDateTo" class="dashboard-date-input" placeholder="Hasta" />
              <button v-if="dashboardInvoiceDateFrom || dashboardInvoiceDateTo" class="dashboard-date-clear" @click="dashboardInvoiceDateFrom = ''; dashboardInvoiceDateTo = ''">✕</button>
            </div>
            <div class="dashboard-date-range">
              <select v-model="dashboardFilterPeriod" class="dashboard-date-input">
                <option value="">Todas</option>
                <option v-for="p in dashboardAvailablePeriods" :key="p.value" :value="p.value">{{ p.label }}</option>
              </select>
              <button v-if="dashboardFilterPeriod" class="dashboard-date-clear" @click="dashboardFilterPeriod = ''">✕</button>
            </div>
          </div>
        </div>
        <div class="dashboard-panel-body">
          <div class="table-responsive">
            <table class="simple-table compact">
              <thead class="table-header">
                <tr>
                  <th style="text-align:center;"># Factura</th>
                  <th style="text-align:left;">Cliente</th>
                  <th style="text-align:center;">Placa</th>
                  <th style="text-align:center;">Estado</th>
                  <th style="text-align:right;">Total</th>
                  <th style="text-align:right;">Abonado</th>
                  <th style="text-align:right;">Saldo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="inv in dashboardPaginatedInvoices" :key="inv.id">
                  <td style="text-align:center;font-weight:700;">#{{ inv.id }}</td>
                  <td style="text-align:left;">
                    <strong>{{ inv.client }}</strong>
                    <div style="color:var(--muted);font-size:0.85rem;">{{ inv.vehicleBrand || '' }} {{ inv.vehicleModel || '' }}</div>
                  </td>
                  <td style="text-align:center;"><span style="text-transform:uppercase;font-weight:700;">{{ inv.vehicle || '-' }}</span></td>
                  <td style="text-align:center;"><span class="status-badge" :class="String(inv.status || 'Pendiente').toLowerCase()">{{ inv.status || 'Pendiente' }}</span></td>
                  <td style="text-align:right;font-weight:600;">${{ invoiceTotal(inv).toLocaleString() }}</td>
                  <td style="text-align:right;color:#22c55e;font-weight:600;">${{ invoiceDepositTotal(inv).toLocaleString() }}</td>
                  <td style="text-align:right;color:#f59e0b;font-weight:600;">${{ (invoiceTotal(inv) - invoiceDepositTotal(inv)).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="dashboardInvoiceTotalPages > 1" style="display:flex;justify-content:center;align-items:center;gap:12px;padding:12px 0;flex-wrap:wrap;">
            <button class="btn" :disabled="dashboardInvoicePage <= 1" @click.prevent="dashboardInvoicePage--">Anterior</button>
            <span>Página {{ dashboardInvoicePage }} / {{ dashboardInvoiceTotalPages }}</span>
            <button class="btn" :disabled="dashboardInvoicePage >= dashboardInvoiceTotalPages" @click.prevent="dashboardInvoicePage++">Siguiente</button>
          </div>
        </div>
      </div>
      <div class="dashboard-panel">
        <div class="dashboard-panel-header">
          <div class="dashboard-panel-header-left">
            <div class="dashboard-panel-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <div>
              <h3 class="dashboard-panel-title">Desempeño de Técnicos</h3>
              <p class="dashboard-panel-subtitle">Métricas de productividad por período</p>
            </div>
          </div>
          <div class="dashboard-panel-filters">
            <div class="dashboard-date-range">
              <input type="month" v-model="dashboardSelectedMonth" class="dashboard-date-input" />
              <button v-if="dashboardSelectedMonth" class="dashboard-date-clear" @click="dashboardSelectedMonth = ''">✕</button>
            </div>
            <div class="dashboard-date-range">
              <input type="date" v-model="dashboardDateFrom" class="dashboard-date-input" />
              <span class="dashboard-date-separator">→</span>
              <input type="date" v-model="dashboardDateTo" class="dashboard-date-input" />
              <button v-if="dashboardDateFrom || dashboardDateTo" class="dashboard-date-clear" @click="dashboardDateFrom = ''; dashboardDateTo = ''">✕</button>
            </div>
          </div>
        </div>
        <div class="dashboard-panel-body">
          <div v-if="dashboardTechniciansByMonth.length === 0" class="dashboard-empty">
            <p>No hay datos de desempeño para el período seleccionado</p>
          </div>
          <div v-else class="dashboard-performance-grid">
            <div v-for="tech in dashboardTechniciansByMonth" :key="tech.name" class="dashboard-performance-card">
              <div class="dashboard-performance-header">
                <div class="dashboard-tech-avatar">{{ getInitials(tech.name) }}</div>
                <div class="dashboard-tech-info">
                  <h4>{{ tech.name }}</h4>
                  <span>{{ tech.role }}</span>
                </div>
              </div>
              <div class="dashboard-performance-metrics">
                <div class="dashboard-perf-metric">
                  <span class="dashboard-perf-value">{{ tech.ordersCount }}</span>
                  <span class="dashboard-perf-label">Órdenes</span>
                </div>
                <div class="dashboard-perf-metric">
                  <span class="dashboard-perf-value">${{ tech.totalRevenue.toLocaleString() }}</span>
                  <span class="dashboard-perf-label">Ingresos</span>
                </div>
                <div class="dashboard-perf-metric">
                  <span class="dashboard-perf-value">${{ tech.technicianShare.toLocaleString() }}</span>
                  <span class="dashboard-perf-label">Su 50%</span>
                </div>
                <div class="dashboard-perf-metric">
                  <span class="dashboard-perf-value">${{ tech.workshopShare.toLocaleString() }}</span>
                  <span class="dashboard-perf-label">Taller 50%</span>
                </div>
              </div>
              <div class="dashboard-warranty-section">
                <div class="dashboard-warranty-header">
                  <span class="dashboard-warranty-label">Garantías</span>
                  <span class="dashboard-warranty-value">{{ tech.warrantyCount }}</span>
                </div>
                <div class="dashboard-warranty-bar">
                  <div class="dashboard-warranty-fill" :style="{ width: tech.ordersCount > 0 ? ((tech.warrantyCount / tech.ordersCount) * 100) + '%' : '0%' }"></div>
                </div>
                <div class="dashboard-warranty-sub">
                  <span>${{ tech.warrantyValue.toLocaleString() }} en garantías</span>
                  <span>{{ tech.ordersCount > 0 ? ((tech.warrantyCount / tech.ordersCount) * 100).toFixed(1) : '0.0' }}% de órdenes</span>
                </div>
              </div>
              <div class="dashboard-performance-bar">
                <div class="dashboard-progress-bar">
                  <div class="dashboard-progress-fill" :style="{ width: tech.percentage + '%' }"></div>
                </div>
                <span class="dashboard-progress-label">{{ tech.percentage.toFixed(1) }}% del total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fila de dos columnas: Estado de Órdenes (izq) + Facturación (der) -->
      <div class="dashboard-two-columns">
        <!-- Estado de Órdenes (Izquierda) -->
        <div class="dashboard-orders-status-panel">
          <div class="dashboard-orders-status-header">
            <div class="dashboard-orders-status-header-left">
              <div class="dashboard-orders-status-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div>
                <h3 class="dashboard-orders-status-title">Estado de Órdenes</h3>
                <p class="dashboard-orders-status-subtitle">{{ filteredOrderStats.total }} órdenes en total</p>
              </div>
            </div>
            <div class="dashboard-panel-filters">
              <div class="dashboard-date-range">
                <input type="month" v-model="dashboardOrderMonth" class="dashboard-date-input" />
                <button v-if="dashboardOrderMonth" class="dashboard-date-clear" @click="dashboardOrderMonth = ''">✕</button>
              </div>
              <div class="dashboard-date-range">
                <input type="date" v-model="dashboardOrderDateFrom" class="dashboard-date-input" placeholder="Desde" />
                <span class="dashboard-date-separator">→</span>
                <input type="date" v-model="dashboardOrderDateTo" class="dashboard-date-input" placeholder="Hasta" />
                <button v-if="dashboardOrderDateFrom || dashboardOrderDateTo" class="dashboard-date-clear" @click="dashboardOrderDateFrom = ''; dashboardOrderDateTo = ''">✕</button>
              </div>
            </div>
          </div>

          <div class="dashboard-orders-summary">
            <div class="dashboard-orders-summary-item active">
              <div class="dashboard-orders-summary-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="dashboard-orders-summary-info">
                <div class="dashboard-orders-summary-value">{{ filteredOrderStats.active }}</div>
                <div class="dashboard-orders-summary-label">Activas</div>
              </div>
              <div class="dashboard-orders-summary-pct">{{ filteredOrderStats.total > 0 ? Math.round((filteredOrderStats.active / filteredOrderStats.total) * 100) : 0 }}%</div>
            </div>
            <div class="dashboard-orders-summary-item completed">
              <div class="dashboard-orders-summary-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div class="dashboard-orders-summary-info">
                <div class="dashboard-orders-summary-value">{{ filteredOrderStats.completed }}</div>
                <div class="dashboard-orders-summary-label">Terminadas</div>
              </div>
              <div class="dashboard-orders-summary-pct">{{ filteredOrderStats.total > 0 ? Math.round((filteredOrderStats.completed / filteredOrderStats.total) * 100) : 0 }}%</div>
            </div>
            <div class="dashboard-orders-summary-item finished">
              <div class="dashboard-orders-summary-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div class="dashboard-orders-summary-info">
                <div class="dashboard-orders-summary-value">{{ filteredOrderStats.finished }}</div>
                <div class="dashboard-orders-summary-label">Entregadas</div>
              </div>
              <div class="dashboard-orders-summary-pct">{{ filteredOrderStats.total > 0 ? Math.round((filteredOrderStats.finished / filteredOrderStats.total) * 100) : 0 }}%</div>
            </div>
          </div>

          <div class="dashboard-orders-pie-chart">
            <apexchart type="pie" :options="ordersPieOptions" :series="ordersPieSeries" width="300" />
          </div>
        </div>

        <!-- Facturación (Derecha) -->
        <div class="dashboard-invoices-panel">
          <div class="dashboard-invoices-header">
            <div class="dashboard-invoices-header-left">
              <div class="dashboard-invoices-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div>
                <h3 class="dashboard-invoices-title">Facturación</h3>
                <p class="dashboard-invoices-subtitle">{{ filteredInvoiceStats.total }} facturas en total</p>
              </div>
            </div>
            <div class="dashboard-panel-filters">
              <div class="dashboard-date-range">
                <input type="month" v-model="dashboardInvoiceMonth" class="dashboard-date-input" />
                <button v-if="dashboardInvoiceMonth" class="dashboard-date-clear" @click="dashboardInvoiceMonth = ''">✕</button>
              </div>
              <div class="dashboard-date-range">
                <input type="date" v-model="dashboardInvoiceDateFrom" class="dashboard-date-input" placeholder="Desde" />
                <span class="dashboard-date-separator">→</span>
                <input type="date" v-model="dashboardInvoiceDateTo" class="dashboard-date-input" placeholder="Hasta" />
                <button v-if="dashboardInvoiceDateFrom || dashboardInvoiceDateTo" class="dashboard-date-clear" @click="dashboardInvoiceDateFrom = ''; dashboardInvoiceDateTo = ''">✕</button>
              </div>
            </div>
          </div>

          <div class="dashboard-invoices-stats">
            <div class="dashboard-invoices-stat-item pending">
              <div class="dashboard-invoices-stat-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="dashboard-invoices-stat-info">
                <div class="dashboard-invoices-stat-value">{{ filteredInvoiceStats.pending }}</div>
                <div class="dashboard-invoices-stat-label">Sin abono</div>
              </div>
            </div>
            <div class="dashboard-invoices-stat-item deposit">
              <div class="dashboard-invoices-stat-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="dashboard-invoices-stat-info">
                <div class="dashboard-invoices-stat-value">{{ filteredInvoiceStats.withDeposit }}</div>
                <div class="dashboard-invoices-stat-label">Con abono</div>
              </div>
            </div>
            <div class="dashboard-invoices-stat-item paid">
              <div class="dashboard-invoices-stat-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div class="dashboard-invoices-stat-info">
                <div class="dashboard-invoices-stat-value">{{ filteredInvoiceStats.paid }}</div>
                <div class="dashboard-invoices-stat-label">Pagadas</div>
              </div>
            </div>
          </div>
          <div class="dashboard-invoices-pie-chart">
            <apexchart type="pie" :options="filteredInvoicePieOptions" :series="filteredInvoicePieSeries" width="300" />
          </div>
        </div>
      </div>

      <!-- Gráficos Financieros -->
      <div class="dashboard-financial-row">
        <div class="dashboard-chart-card wide">
          <h3>Ingresos por Quincena</h3>
          <div class="dashboard-chart-area">
            <apexchart type="line" :options="lineOptions" :series="lineSeries" height="180" />
          </div>
        </div>
        <div class="dashboard-chart-card small">
          <h3>Ingresos vs Costos</h3>
          <div class="dashboard-mini-chart">
            <div class="dashboard-bar rev" :style="{ width: revenueVsCosts.revPct + '%' }">Ingresos</div>
            <div class="dashboard-bar cost" :style="{ width: revenueVsCosts.costPct + '%' }">Costos</div>
          </div>
          <div class="dashboard-mini-chart-legend">
            <div><span class="dashboard-dot rev"></span> ${{ revenueVsCosts.rev.toLocaleString() }}</div>
            <div><span class="dashboard-dot cost"></span> ${{ revenueVsCosts.cost.toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ==========================================================
       MODALES GLOBALES DE FACTURACIÓN
       Disponibles desde cualquier pestaña.
       ========================================================== -->
  <!-- Modal crear/editar factura -->
  <div v-if="showInvoiceModal" class="modal-overlay" @click="showInvoiceModal = false">
    <div class="modal" @click.stop style="max-width:960px;">
      <div class="modal-header">
        <h3>{{ editingInvoice ? 'Editar Factura #' + editingInvoice.id : 'Nueva Factura' }}</h3>
        <button class="modal-close" @click="showInvoiceModal = false">✕</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="saveInvoice">

          <!-- Cliente -->
          <div class="form-section">
            <div class="form-section-title">👤 Cliente</div>
            <div class="form-row">
              <div class="form-group"><label>Nombre *</label><input v-model="formInvoice.client" type="text" class="form-input" required placeholder="Ej: Juan Pérez" /></div>
              <div class="form-group"><label>Teléfono</label><input v-model="formInvoice.clientPhone" type="text" class="form-input" placeholder="Ej: 3001234567" /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Correo</label><input v-model="formInvoice.clientEmail" type="email" class="form-input" placeholder="Ej: juan@email.com" /></div>
              <div class="form-group"><label>Dirección</label><input v-model="formInvoice.clientAddress" type="text" class="form-input" placeholder="Ej: Calle 123 #45-67" /></div>
            </div>
          </div>

          <!-- Vehículo -->
          <div class="form-section">
            <div class="form-section-title">🚗 Vehículo</div>
            <div class="form-row">
              <div class="form-group"><label>Marca</label><input v-model="formInvoice.vehicleBrand" type="text" class="form-input" placeholder="Ej: Toyota" /></div>
              <div class="form-group"><label>Modelo</label><input v-model="formInvoice.vehicleModel" type="text" class="form-input" placeholder="Ej: Corolla 2022" /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Tipo de Vehículo</label><select v-model="formInvoice.vehicleType" class="form-input"><option value="">Seleccionar tipo</option><option value="Automovil">Automóvil</option><option value="Camioneta">Camioneta</option></select></div>
              <div class="form-group"><label>Placa</label><input v-model="formInvoice.vehicle" type="text" class="form-input" placeholder="Ej: ABC123" style="text-transform:uppercase;" /></div>
              <div class="form-group"><label>Kilometraje</label><input v-model="formInvoice.vehicleKm" type="text" class="form-input" placeholder="Ej: 45000" /></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Técnico / Asesor</label><select v-model="formInvoice.advisorName" class="form-input">
                  <option value="">Seleccionar técnico...</option>
                  <option v-for="emp in burnedEmployees" :key="emp.id" :value="emp.name">{{ emp.name }} ({{ emp.role || 'Sin cargo' }})</option>
                </select></div>
            </div>
          </div>

          <!-- Items -->
          <div class="form-section">
            <div class="form-section-title">🛠️ Productos y Servicios</div>
            <table class="simple-table compact" style="margin-bottom:10px;">
              <thead class="table-header">
                 <tr>
                   <th style="width:30%">Descripción</th>
                   <th style="width:12%">Cant.</th>
                   <th style="width:16%">Valor Unit.</th>
                   <th style="width:12%">Valor Total</th>
                   <th style="width:8%">M.O</th>
                   <th style="width:10%">Desc. Téc.</th>
                   <th style="width:12%">Acción</th>
                 </tr>
              </thead>
              <tbody>
                 <tr v-for="(it, idx) in formInvoice.items" :key="idx">
                    <td><input v-model="it.description" class="form-input" placeholder="Descripción de mano de obra / servicio" /></td>
                   <td><input :value="formatNumber(it.qty)" type="text" class="form-input" @input="it.qty = parseNumber(($event.target as HTMLInputElement).value)" /></td>
                   <td><input :value="formatNumber(it.price)" type="text" class="form-input" @input="it.price = parseNumber(($event.target as HTMLInputElement).value)" /></td>
                   <td style="text-align:right;font-weight:600;">${{ formatNumber((Number(it.qty)||0) * (Number(it.price)||0)) }}</td>
                   <td style="text-align:center;white-space:nowrap;">
                     <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:0.85rem;justify-content:center;">
                       <input v-model="it.isLabor" type="checkbox" style="width:16px;height:16px;cursor:pointer;" />
                       <span>🛠️</span>
                     </label>
                   </td>
                    <td v-if="['gases','escaner'].includes(String(it.description || '').trim().toLowerCase())" style="text-align:center;white-space:nowrap;">
                       <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:0.85rem;justify-content:center;" title="Descontar al técnico">
                         <input v-model="it.discountToTechnician" type="checkbox" style="width:16px;height:16px;cursor:pointer;" />
                         <span>➖</span>
                       </label>
                    </td>
                    <td v-else style="text-align:center;white-space:nowrap;"></td>
                   <td><button type="button" class="btn btn-sm btn-danger" @click="removeInvoiceItem(idx)">−</button></td>
                 </tr>
              </tbody>
            </table>
            <button type="button" class="btn btn-secondary" @click="addInvoiceItem">➕ Agregar item</button>
          </div>

          <!-- Resumen y Estado -->
          <div class="form-section">
            <div class="form-section-title">💰 Resumen Financiero</div>
            <div class="form-row">
              <div class="form-group" style="display:flex;align-items:center;gap:8px;min-height:48px;">
                <label style="margin:0;">IVA (19%)</label>
                <input v-model="formInvoice.applyTax" type="checkbox" style="width:20px;height:20px;cursor:pointer;" />
              </div>
              <div class="form-group"><label>Descuento ($)</label><input :value="formatNumber(formInvoice.discount)" type="text" class="form-input" @input="formInvoice.discount = parseNumber(($event.target as HTMLInputElement).value)" /></div>
              <div class="form-group"><label>Retención ($)</label><input :value="formatNumber(formInvoice.retention)" type="text" class="form-input" @input="formInvoice.retention = parseNumber(($event.target as HTMLInputElement).value)" /></div>
            </div>
            <!-- Abonos -->
            <div class="form-section">
              <div class="form-section-title">💰 Abonos</div>
              <table class="simple-table compact" style="margin-bottom:10px;">
                <thead class="table-header">
                  <tr>
                    <th style="width:30%">Fecha</th>
                    <th style="width:30%">Método</th>
                    <th style="width:25%">Monto</th>
                    <th style="width:15%">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(dep, idx) in formInvoice.deposits" :key="idx">
                    <td><input type="date" v-model="dep.date" class="form-input" /></td>
                    <td><input v-model="dep.method" class="form-input" placeholder="Ej: Efectivo" /></td>
                    <td><input :value="formatNumber(dep.amount)" type="text" class="form-input" @input="dep.amount = parseNumber(($event.target as HTMLInputElement).value)" placeholder="0" /></td>
                    <td><button type="button" class="btn btn-sm btn-danger" @click="removeDeposit(idx)">−</button></td>
                  </tr>
                </tbody>
              </table>
              <button type="button" class="btn btn-secondary" @click="addDeposit">➕ Agregar abono</button>
            </div>

            <div class="form-row">
              <div class="form-group"><label>Forma de pago</label><input v-model="formInvoice.payments" placeholder="Ej: Efectivo, Transferencia" class="form-input" /></div>
              <div class="form-group"><label>Estado</label><select v-model="formInvoice.status" class="form-input">
                  <option>Pendiente</option>
                  <option>Abonado</option>
                  <option>Pagado</option>
                  <option>Anulado</option>
                </select></div>
            </div>
            <div class="invoice-totals-bar" style="margin-top:14px;display:flex;justify-content:flex-end;gap:18px;flex-wrap:wrap;">
              <div><span style="color:var(--muted);">Subtotal</span> <strong style="font-size:1.1rem;">${{ invoiceSubtotal(formInvoice).toLocaleString() }}</strong></div>
              <div><span style="color:var(--muted);">IVA</span> <strong style="font-size:1.1rem;">${{ invoiceTax(formInvoice).toLocaleString() }}</strong></div>
              <div><span style="color:var(--muted);">Descuento</span> <strong style="font-size:1.1rem;color:#dc2626;">-${{ Number(formInvoice.discount).toLocaleString() }}</strong></div>
              <div><span style="color:var(--muted);">Retención</span> <strong style="font-size:1.1rem;color:#dc2626;">-${{ Number(formInvoice.retention).toLocaleString() }}</strong></div>
              <div style="border-left:2px solid var(--brand-border);padding-left:14px;"><span style="color:var(--muted);">TOTAL</span> <strong style="font-size:1.4rem;color:var(--brand-primary);">${{ invoiceTotal(formInvoice).toLocaleString() }}</strong></div>
              <div v-if="invoiceDepositTotal(formInvoice) > 0" style="border-left:2px solid var(--brand-border);padding-left:14px;"><span style="color:var(--muted);">ABONADO</span> <strong style="font-size:1.1rem;color:#22c55e;">${{ invoiceDepositTotal(formInvoice).toLocaleString() }}</strong></div>
              <div v-if="invoiceDepositTotal(formInvoice) > 0 && invoiceTotal(formInvoice) > invoiceDepositTotal(formInvoice)" style="border-left:2px solid var(--brand-border);padding-left:14px;"><span style="color:var(--muted);">SALDO</span> <strong style="font-size:1.1rem;color:#f59e0b;">${{ (invoiceTotal(formInvoice) - invoiceDepositTotal(formInvoice)).toLocaleString() }}</strong></div>
            </div>
          </div>

          <!-- Notas -->
          <div class="form-section">
            <div class="form-section-title">📝 Notas Adicionales</div>
            <div class="form-group">
              <textarea v-model="formInvoice.notes" class="form-input" rows="2" placeholder="Notas internas sobre la factura"></textarea>
            </div>
          </div>

          <!-- Evidencias -->
          <div class="form-section">
            <div class="form-section-title">📷 Evidencias Fotográficas</div>
            <div v-for="(ev, idx) in formInvoice.evidences" :key="idx" class="form-row" style="align-items:flex-end;">
              <div class="form-group" style="flex:0 0 140px;">
                <label>Tipo</label>
                <select v-model="ev.type" class="form-input">
                  <option value="actual">Actual</option>
                  <option value="pasada">Pasada</option>
                </select>
              </div>
              <div class="form-group" style="flex:1;">
                <label>URL de la imagen</label>
                <input v-model="ev.url" type="url" class="form-input" placeholder="https://blob.core.windows.net/evidences/foto.jpg" />
              </div>
              <button type="button" class="btn btn-sm btn-danger" @click="formInvoice.evidences.splice(idx, 1)" style="margin-bottom:2px;">−</button>
            </div>
            <button type="button" class="btn btn-secondary" @click="formInvoice.evidences.push({ type: 'actual', url: '' })">➕ Agregar evidencia</button>
            <label style="display:inline-flex;align-items:center;gap:8px;font-weight:600;margin-top:10px;">
              <input type="checkbox" v-model="formInvoice.showEvidencesInPdf" /> Incluir fotografías en PDF
            </label>
          </div>

          <div class="form-actions" style="margin-top:12px;display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary" @click="showInvoiceModal = false">Cancelar</button>

            <button type="submit" class="btn btn-primary">💾 Guardar Factura</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal vista previa factura (solo lectura) -->
  <div v-if="showInvoicePreview" class="modal-overlay" @click="showInvoicePreview = false">
    <div class="modal" @click.stop style="max-width:720px;">
      <div class="modal-header">
        <h3>Vista previa Factura #{{ previewInvoice?.id }}</h3>
        <button class="modal-close" @click="showInvoicePreview = false">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
          <div class="pro-card" style="padding:12px;">
            <div style="font-size:0.85rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">👤 Cliente</div>
            <div style="font-weight:700;">{{ previewInvoice?.client || '-' }}</div>
            <div style="font-size:0.9rem;color:var(--brand-accent-alt);">{{ previewInvoice?.clientPhone || '' }}</div>
            <div style="font-size:0.9rem;color:var(--brand-accent-alt);">{{ previewInvoice?.clientEmail || '' }}</div>
            <div style="font-size:0.9rem;color:var(--brand-accent-alt);">{{ previewInvoice?.clientAddress || '' }}</div>
          </div>
          <div class="pro-card" style="padding:12px;">
            <div style="font-size:0.85rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">🚗 Vehículo</div>
            <div style="font-weight:700;">{{ previewInvoice?.vehicleBrand || '' }} {{ previewInvoice?.vehicleModel || '' }}</div>
            <div style="font-size:0.9rem;color:var(--brand-accent-alt);">Placa: <strong>{{ previewInvoice?.vehicle || '-' }}</strong></div>
            <div style="font-size:0.9rem;color:var(--brand-accent-alt);">Km: {{ previewInvoice?.vehicleKm || '-' }}</div>
          </div>
          <div class="pro-card" style="padding:12px;">
            <div style="font-size:0.85rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">📋 Estado</div>
            <span class="status-badge" :class="String(previewInvoice?.status || 'Pendiente').toLowerCase()">{{ previewInvoice?.status || 'Pendiente' }}</span>
            <div style="font-size:0.85rem;color:var(--muted);margin-top:6px;">{{ previewInvoice?.createdAt ? formatShortDate(new Date(previewInvoice.createdAt)) : '-' }}</div>
          </div>
          <div class="pro-card" style="padding:12px;">
            <div style="font-size:0.85rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">🔧 Orden</div>
            <div style="font-weight:700;">#{{ previewInvoice?.orderId || '-' }}</div>
            <div v-if="previewInvoice?.orderId" style="font-size:0.85rem;color:var(--muted);margin-top:6px;">
              {{ getOrderForInventory(Number(previewInvoice.orderId))?.vehicle || '' }}
            </div>
          </div>
        </div>

        <div style="font-size:0.85rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">🛠️ Productos y Servicios</div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
          <thead>
            <tr>
              <th style="text-align:left;border-bottom:1.5px solid #ccc;padding:6px;">Descripción</th>
              <th style="text-align:center;border-bottom:1.5px solid #ccc;padding:6px;">Cant.</th>
              <th style="text-align:right;border-bottom:1.5px solid #ccc;padding:6px;">Valor Unit.</th>
              <th style="text-align:right;border-bottom:1.5px solid #ccc;padding:6px;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in (previewInvoice?.items || [])" :key="idx">
              <td style="padding:6px 4px;">{{ it.description || it }}</td>
              <td style="padding:6px 4px;text-align:center;">{{ it.qty ?? 1 }}</td>
              <td style="padding:6px 4px;text-align:right;">${{ (it.price ?? 0).toLocaleString() }}</td>
              <td style="padding:6px 4px;text-align:right;">${{ ((it.qty ?? 1) * (it.price ?? 0)).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
          <div style="width:260px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;font-size:0.95rem;color:#374151;"><span>Subtotal</span><strong style="color:#111827;">${{ invoiceSubtotal(previewInvoice).toLocaleString() }}</strong></div>
            <div v-if="(previewInvoice?.discount || 0) > 0" style="display:flex;justify-content:space-between;font-size:0.95rem;color:#374151;"><span>Descuento</span><strong style="color:#dc2626;">-${{ Number(previewInvoice?.discount || 0).toLocaleString() }}</strong></div>
            <div v-if="(previewInvoice?.taxPct || 0) > 0" style="display:flex;justify-content:space-between;font-size:0.95rem;color:#374151;"><span>IVA ({{ previewInvoice?.taxPct || 19 }}%)</span><strong style="color:#111827;">${{ invoiceTax(previewInvoice).toLocaleString() }}</strong></div>
            <div v-if="(previewInvoice?.retention || 0) > 0" style="display:flex;justify-content:space-between;font-size:0.95rem;color:#374151;"><span>Retención</span><strong style="color:#dc2626;">-${{ Number(previewInvoice?.retention || 0).toLocaleString() }}</strong></div>
            <div style="display:flex;justify-content:space-between;font-size:1.15rem;border-top:1.5px solid #d1d5db;padding-top:6px;margin-top:2px;color:#111827;"><span style="font-weight:700;">TOTAL</span><strong style="color:#111827;">${{ invoiceTotal(previewInvoice).toLocaleString() }}</strong></div>
            <div v-if="invoiceDepositTotal(previewInvoice) > 0" style="display:flex;justify-content:space-between;font-size:0.95rem;color:#166534;"><span style="font-weight:700;">ABONADO</span><strong>${{ invoiceDepositTotal(previewInvoice).toLocaleString() }}</strong></div>
            <div v-if="invoiceDepositTotal(previewInvoice) > 0 && invoiceTotal(previewInvoice) > invoiceDepositTotal(previewInvoice)" style="display:flex;justify-content:space-between;font-size:0.95rem;color:#92400e;"><span style="font-weight:700;">SALDO</span><strong>${{ (invoiceTotal(previewInvoice) - invoiceDepositTotal(previewInvoice)).toLocaleString() }}</strong></div>
          </div>
        </div>

        <div style="margin-top:8px;font-size:0.9rem;"><strong>Pagos:</strong> {{ Array.isArray(previewInvoice?.payments) ? previewInvoice.payments.join(', ') : (previewInvoice?.payments || '-') }}</div>
        <div style="margin-top:6px;font-size:0.9rem;"><strong>Notas:</strong> {{ previewInvoice?.notes || '-' }}</div>
      </div>
      <div class="modal-footer form-actions" style="margin-top:12px;display:flex;justify-content:flex-end;gap:8px;">
        <button type="button" class="btn btn-secondary" @click="showInvoicePreview = false">Cerrar</button>
        <button type="button" class="btn btn-secondary" @click="editPreviewInvoice">Editar</button>
        <button type="button" class="btn btn-primary" @click="printPreviewInvoice">📄 Imprimir / PDF</button>
      </div>
    </div>
  </div>

  <!-- Impresión factura moderna -->
  <div v-if="printInvoice" class="print-area invoice-modern" aria-hidden="true">
    <div class="inv-sheet">
      <!-- Encabezado -->
      <div class="inv-header">
        <div class="inv-brand">
          <img class="inv-logo" src="/images/logobn.png" alt="Jobs Car logo" />
          <div class="inv-brand-text">
            <div class="inv-company">JOB'S CAR</div>
            <div class="inv-tagline">Centro Automotriz Especializado</div>
          </div>
        </div>
        <div class="inv-badge-wrap">
          <div class="inv-doc-type">Remision</div>
          <div class="inv-doc-number">#RM-{{ String(printInvoice.id).padStart(4, '0') }}</div>
          <div class="inv-date">Fecha: {{ new Date(printInvoice.createdAt || Date.now()).toLocaleDateString() }}</div>
          <span class="inv-status" :class="String(printInvoice.status || 'Pendiente').toLowerCase()">{{ printInvoice.status || 'Pendiente' }}</span>
        </div>
      </div>

      <!-- Tarjetas de info -->
      <div class="inv-cards">
        <div class="inv-card">
          <div class="inv-card-title">Cliente</div>
          <div class="inv-card-body">
            <div class="inv-line"><span class="inv-label">Nombre</span><span class="inv-val">{{ printInvoice.client || '-' }}</span></div>
            <div class="inv-line"><span class="inv-label">Teléfono</span><span class="inv-val">{{ printInvoice.clientPhone || '-' }}</span></div>
            <div class="inv-line"><span class="inv-label">Correo</span><span class="inv-val">{{ printInvoice.clientEmail || '-' }}</span></div>
            <div class="inv-line"><span class="inv-label">Dirección</span><span class="inv-val">{{ printInvoice.clientAddress || '-' }}</span></div>
          </div>
        </div>
        <div class="inv-card">
          <div class="inv-card-title">Vehículo</div>
          <div class="inv-card-body">
            <div class="inv-line"><span class="inv-label">Marca</span><span class="inv-val">{{ printInvoice.vehicleBrand || '-' }}</span></div>
            <div class="inv-line"><span class="inv-label">Modelo</span><span class="inv-val">{{ printInvoice.vehicleModel || '-' }}</span></div>
            <div class="inv-line"><span class="inv-label">Placa</span><span class="inv-val">{{ printInvoice.vehicle || '-' }}</span></div>
            <div class="inv-line"><span class="inv-label">Kilometraje</span><span class="inv-val">{{ printInvoice.vehicleKm || '-' }}</span></div>
          </div>
        </div>
      </div>

      <!-- Tabla de productos y servicios -->
      <div class="inv-table-wrap">
        <div class="inv-section-title">Detalle de Productos y Servicios</div>
        <table class="inv-table">
          <thead>
            <tr>
              <th class="inv-col-num">#</th>
              <th class="inv-col-desc">Descripción</th>
              <th class="inv-col-qty">Cant.</th>
              <th class="inv-col-price">Valor Unit.</th>
              <th class="inv-col-tax">IVA</th>
              <th class="inv-col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(it, idx) in (printInvoice.items || [])" :key="idx">
              <td class="inv-col-num">{{ idx + 1 }}</td>
              <td class="inv-col-desc">{{ it.description || '-' }}</td>
              <td class="inv-col-qty">{{ it.qty ?? 1 }}</td>
              <td class="inv-col-price">${{ (Number(it.price) || 0).toLocaleString() }}</td>
              <td class="inv-col-tax">{{ printInvoice.taxPct || 19 }}%</td>
              <td class="inv-col-total">${{ ((Number(it.qty) || 1) * (Number(it.price) || 0)).toLocaleString() }}</td>
            </tr>
            <tr v-if="!(printInvoice.items && printInvoice.items.length)">
              <td class="inv-col-num">1</td>
              <td class="inv-col-desc">Servicio general</td>
              <td class="inv-col-qty">1</td>
              <td class="inv-col-price">${{ invoiceSubtotal(printInvoice).toLocaleString() }}</td>
              <td class="inv-col-tax">{{ printInvoice.taxPct || 19 }}%</td>
              <td class="inv-col-total">${{ invoiceSubtotal(printInvoice).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resumen financiero -->
      <div class="inv-summary">
        <div class="inv-summary-box">
          <div class="inv-row">
            <span class="inv-row-label">Subtotal</span>
            <span class="inv-row-val">${{ invoiceSubtotal(printInvoice).toLocaleString() }}</span>
          </div>
          <div class="inv-row">
            <span class="inv-row-label">Descuentos</span>
            <span class="inv-row-val">${{ Number(printInvoice.discount || 0).toLocaleString() }}</span>
          </div>
          <div v-if="(printInvoice.taxPct || 0) > 0" class="inv-row">
            <span class="inv-row-label">IVA ({{ printInvoice.taxPct || 19 }}%)</span>
            <span class="inv-row-val">${{ invoiceTax(printInvoice).toLocaleString() }}</span>
          </div>
          <div class="inv-row">
            <span class="inv-row-label">Retenciones</span>
            <span class="inv-row-val">${{ Number(printInvoice.retention || 0).toLocaleString() }}</span>
          </div>
          <div class="inv-row inv-total-row">
            <span class="inv-row-label">TOTAL A PAGAR</span>
            <span class="inv-row-val">${{ invoiceTotal(printInvoice).toLocaleString() }}</span>
          </div>
          <div v-if="invoiceDepositTotal(printInvoice) > 0" class="inv-row" style="color:#22c55e;">
            <span class="inv-row-label">ABONADO</span>
            <span class="inv-row-val">${{ invoiceDepositTotal(printInvoice).toLocaleString() }}</span>
          </div>
          <div v-if="invoiceDepositTotal(printInvoice) > 0 && invoiceTotal(printInvoice) > invoiceDepositTotal(printInvoice)" class="inv-row" style="color:#f59e0b;">
            <span class="inv-row-label">SALDO PENDIENTE</span>
            <span class="inv-row-val">${{ (invoiceTotal(printInvoice) - invoiceDepositTotal(printInvoice)).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Evidencia fotográfica -->
      <div v-if="printInvoice.showEvidencesInPdf !== false" class="inv-photos">
        <div class="inv-section-title">Evidencia Fotográfica</div>
        <div class="inv-photo-grid">
          <div v-for="(ev, idx) in (printInvoice.evidences || [])" :key="idx" class="inv-photo-group">
            <div class="inv-photo-label">{{ ev.type === 'pasada' ? 'Pasada' : 'Actual' }}</div>
            <img v-if="ev.url" :src="ev.url" class="inv-photo-thumb" alt="Evidencia" />
            <div v-else class="inv-photo-thumb inv-placeholder">📷 Sin fotografía</div>
          </div>
          <div v-if="!(printInvoice.evidences && printInvoice.evidences.length)" class="inv-photo-group">
            <div class="inv-photo-label">Actual</div>
            <div class="inv-photo-thumb inv-placeholder">📷 Sin fotografía</div>
          </div>
          <div v-if="!(printInvoice.evidences && printInvoice.evidences.length)" class="inv-photo-group">
            <div class="inv-photo-label">Pasada</div>
            <div class="inv-photo-thumb inv-placeholder">📷 Sin fotografía</div>
          </div>
        </div>
      </div>

      <!-- Notas adicionales -->
      <div class="inv-notes">
        <div class="inv-section-title">Notas Adicionales</div>
        <div style="font-size:0.9rem;color:#374151;white-space:pre-wrap;">{{ printInvoice.notes || 'no registran' }}</div>
      </div>

      <!-- Firmas -->
      <div class="inv-signatures">
        <div class="inv-sig-box">
          <div class="inv-sig-line"></div>
          <div class="inv-sig-label">Firma del Cliente</div>
          <div class="inv-sig-name">{{ printInvoice.client || '' }}</div>
        </div>
        <div class="inv-sig-box">
          <div class="inv-sig-line"></div>
          <div class="inv-sig-label">Firma del Responsable (JOB'S)</div>
          <div class="inv-sig-name">JOB'S CAR</div>
        </div>
      </div>

      <!-- Pie de página -->
      <div class="inv-footer">
        <div class="inv-footer-col">
          <span>Carrera 79 No. 67 - 39 - Barrio San Marcos - Cal: +57 314 4607515 - Bogotá, D.C</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onBeforeUnmount, watch, nextTick, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts, type ShowcaseProduct } from '@/composables/useProducts'
import type { Product } from '@/types/ProductType'
import type { Category, CreateCategoryRequest } from '@/types/CategoryType'
import { workshopClientService, vehicleService, employeeService, workOrderService, appointmentService, invoiceService, sparePartService, moneyMovementService } from '@/services/api'
import { paymentService } from '@/services/api/paymentService'
import type { Purchase, ProductPaymentItem } from '@/services/api/paymentService'
import type {
  WorkshopClient,
  CreateWorkshopClientRequest,
  UpdateWorkshopClientRequest,
} from '@/types/WorkshopClientType'
import type {
  Vehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '@/types/VehicleType'
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from '@/types/EmployeeType'

const router = useRouter()

// Estado para modal y formulario de cliente quemado
const showCreateClient = ref(false)
const newClient = reactive({
  name: '',
  phone: '',
  email: '',
  notes: '',
  // Nuevo: tipo de aviso, fecha de aviso (YYYY-MM-DD), nota de aviso y fecha de registro
  reminderType: '',
  reminderDate: '',
  reminderNote: '',
  registrationDate: ''
})

interface WorkshopClientRow extends WorkshopClient {
  reminder?: string
  reminderType?: string
  reminderDate?: string
  reminderNote?: string
  registrationDate?: string
  type?: string
  totalOrders?: number
  totalSpent?: number
}

const burnedClients = ref<WorkshopClientRow[]>([])

const mapClientToRow = (client: WorkshopClient): WorkshopClientRow => ({
  ...client,
  reminder: '',
  reminderType: '',
  reminderDate: '',
  reminderNote: '',
  registrationDate: client.createdAt,
  type: client.isActive ? 'activo' : 'inactivo',
  totalOrders: 0,
  totalSpent: 0,
})

interface VehicleRow extends Vehicle {
  clientId: number
  client?: string
}

const burnedVehicles = reactive<VehicleRow[]>([])

const mapVehicleToRow = (vehicle: Vehicle): VehicleRow => {
  // Resolver nombre real del cliente desde burnedClients si el backend devuelve un placeholder
  let clientName = vehicle.client ?? ''
  if (!clientName || clientName.startsWith('Client #')) {
    const found = burnedClients.value.find(c => c.id === vehicle.clientId)
    if (found?.name) clientName = found.name
  }
  return {
    ...vehicle,
    clientId: vehicle.clientId,
    client: clientName,
    km: vehicle.km,
    mileage: vehicle.mileage ?? vehicle.km,
    registrationDate: vehicle.registrationDate || vehicle.createdAt || '',
    lastServiceDate: vehicle.lastServiceDate || '',
    nextServiceKm: vehicle.nextServiceKm ?? 0,
    observations: vehicle.observations || '',
  }
}

const loadBurnedVehicles = async () => {
  try {
    const response = await vehicleService.getVehicles({})
    const vehicles = response.data?.vehicles?.map(mapVehicleToRow) || []
    burnedVehicles.splice(0, burnedVehicles.length, ...vehicles)
  } catch (error) {
    console.error('Error cargando vehículos desde el backend', error)
  }
}

const loadBurnedClients = async () => {
  try {
    const response = await workshopClientService.getClients({})
    burnedClients.value = response.data?.clients.map(mapClientToRow) || []
  } catch (error) {
    console.error('Error cargando clientes desde el backend', error)
    burnedClients.value = []
  }
}

async function addBurnedClient() {
  if (!newClient.name.trim()) return

  const payload: CreateWorkshopClientRequest = {
    name: newClient.name.trim(),
    phone: newClient.phone.trim(),
    email: newClient.email.trim(),
    notes: newClient.notes.trim() || undefined,
  }

  try {
    const response = await workshopClientService.createClient(payload)
    if (response.data) {
      burnedClients.value.unshift(mapClientToRow(response.data))
      newClient.name = ''
      newClient.phone = ''
      newClient.email = ''
      newClient.notes = ''
      newClient.registrationDate = ''
      showCreateClient.value = false
    }
  } catch (error) {
    console.error('Error creando cliente en el backend', error)
  }
}

// Edición y eliminación de clientes quemados
const editingClient: Ref<WorkshopClientRow | null> = ref(null)
const showEditClient = ref(false)

const editClient = (client: WorkshopClientRow) => {
  // Preparar clon para edición y normalizar fechas a YYYY-MM-DD para inputs
  const clone: any = { ...client }
  // registrationDate -> YYYY-MM-DD
  if (clone.registrationDate) {
    try {
      clone.registrationDate = clone.registrationDate.includes('T') ? clone.registrationDate.split('T')[0] : clone.registrationDate
    } catch (e) {
      clone.registrationDate = ''
    }
  } else {
    clone.registrationDate = ''
  }

  // reminderDate -> YYYY-MM-DD
  if (clone.reminderDate) {
    try {
      clone.reminderDate = clone.reminderDate.includes('T') ? clone.reminderDate.split('T')[0] : clone.reminderDate
    } catch (e) {
      clone.reminderDate = ''
    }
  } else {
    clone.reminderDate = ''
  }

  // Si no existe reminderType, intentar inferirlo desde reminder legible
  if (!clone.reminderType && clone.reminder) {
    const parts = clone.reminder.split(':')
    const left = parts[0] ? parts[0].trim() : ''
    if (['SOAT', 'Tecnomecánica', 'Mantenimiento', 'Otro'].includes(left)) {
      clone.reminderType = left
      // intentar extraer fecha si está despues de ':'
      const right = parts.slice(1).join(':').trim()
      // detectar formato dd/mm/yyyy
      const dateMatch = right.match(/(\d{1,2}\/\d{1,2}\/\d{4})/)
      if (dateMatch) {
        const [d, m, y] = dateMatch[0].split('/')
        clone.reminderDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
      } else {
        clone.reminderNote = right || ''
      }
    } else {
      clone.reminderType = ''
      clone.reminderNote = clone.reminder
    }
  }

  // Asegurar campos por defecto
  clone.reminderType = clone.reminderType || ''
  clone.reminderNote = clone.reminderNote || ''

  editingClient.value = clone
  showEditClient.value = true
}

const closeEditClient = () => {
  showEditClient.value = false
  editingClient.value = null
}

const saveEditedClient = async () => {
  if (!editingClient.value) return
  const ec = editingClient.value
  const payload: UpdateWorkshopClientRequest = {
    name: ec.name.trim(),
    phone: ec.phone.trim(),
    email: ec.email.trim(),
    notes: ec.notes?.trim() || undefined,
    isActive: ec.isActive,
  }

  try {
    const response = await workshopClientService.updateClient(ec.id, payload)
    if (response.data) {
      const updatedRow = mapClientToRow(response.data)
      const idx = burnedClients.value.findIndex((c) => c.id === ec.id)
      if (idx > -1) {
        burnedClients.value.splice(idx, 1, updatedRow)
      }
      closeEditClient()
    }
  } catch (error) {
    console.error('Error actualizando cliente en el backend', error)
  }
}

const deleteClient = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar este cliente?')) return
  try {
    await workshopClientService.deleteClient(id)
    burnedClients.value = burnedClients.value.filter((c) => c.id !== id)
  } catch (error) {
    console.error('Error eliminando cliente en el backend', error)
  }
}

// Tipos
interface Sale {
  id: string
  productId: string
  productName: string
  customerName: string
  customerEmail: string
  quantity: number
  unitPrice: number
  totalAmount: number
  status: 'completed' | 'pending' | 'cancelled'
  date: Date
  selectedColor?: string
  items?: ProductPaymentItem[] // Items detallados de la compra
}

// Estado reactivo (persistente)
const ACTIVE_TAB_KEY = 'admin_active_tab'
const activeTab = ref<string>(localStorage.getItem(ACTIVE_TAB_KEY) || 'clients')
const showProductForm = ref(false)
const showCategoryForm = ref(false)
const showShowcaseForm = ref(false)
const editingProduct = ref<Product | null>(null)
const editingCategory = ref<Category | null>(null)
const editingShowcaseProduct = ref<ShowcaseProduct | null>(null)
const imagePreview = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Variables para product image upload
const productImageUploadMethod = ref('url')

// Variables para showcase image upload
const imageUploadMethod = ref('url')
const showcaseImagePreview = ref('')
const showcaseFileInput = ref<HTMLInputElement | null>(null)

// Variables para búsqueda
const searchProducts = ref('')
const searchCategories = ref('')
const searchShowcase = ref('')
const searchSales = ref('')
const searchClients = ref('')
const searchEmployees = ref('')
const searchVehicles = ref('')
const vehiclePage = ref(1)
const vehiclePageSize = ref(20)

const filteredVehicles = computed(() => {
  if (!searchVehicles.value) return burnedVehicles
  const q = searchVehicles.value.toLowerCase()
  return burnedVehicles.filter((v: any) =>
    (v.client && v.client.toLowerCase().includes(q)) ||
    (v.plate && v.plate.toLowerCase().includes(q)) ||
    (v.brand && v.brand.toLowerCase().includes(q)) ||
    (v.model && v.model.toLowerCase().includes(q))
  )
})

const vehicleTotalPages = computed(() => Math.max(1, Math.ceil(filteredVehicles.value.length / vehiclePageSize.value)))

const paginatedVehicles = computed(() => {
  const start = (vehiclePage.value - 1) * vehiclePageSize.value
  return filteredVehicles.value.slice(start, start + vehiclePageSize.value)
})

watch(searchVehicles, () => { vehiclePage.value = 1 })
const searchOrders = ref('')
const searchCash = ref('')
const cashFilterMovement = ref('')
const cashFilterMonth = ref('')
const cashPage = ref(1)
const cashPageSize = ref(15)
const searchInventory = ref('')

// Vehículos: modal y formulario rápido
const showCreateVehicle = ref(false)
const newVehicle = reactive({
  clientId: 0,
  plate: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  km: '',
  vehicleType: '',
  status: '',
  registrationDate: '',
  lastServiceDate: '',
  nextServiceKm: '',
  observations: ''
})

const vehicleClientSearch = ref('')
const vehicleClientDropdownOpen = ref(false)

const filteredVehicleClients = computed(() => {
  const q = vehicleClientSearch.value.toLowerCase()
  if (!q) return burnedClients.value || []
  return (burnedClients.value || []).filter((c: any) => c.name && c.name.toLowerCase().includes(q))
})

function selectVehicleClient(c: any) {
  newVehicle.clientId = c.id
  vehicleClientSearch.value = c.name
  vehicleClientDropdownOpen.value = false
}

function closeVehicleClientDropdown() {
  setTimeout(() => { vehicleClientDropdownOpen.value = false }, 150)
}

async function addBurnedVehicle() {
  if (!newVehicle.plate.trim() || !newVehicle.clientId) return

  const payload: CreateVehicleRequest = {
    clientId: newVehicle.clientId,
    plate: newVehicle.plate.trim(),
    brand: newVehicle.brand.trim(),
    model: newVehicle.model.trim(),
    year: Number(newVehicle.year) || new Date().getFullYear(),
    km: Number(newVehicle.km) || 0,
    vehicleType: newVehicle.vehicleType.trim() || undefined,
    status: newVehicle.status.trim() || undefined,
    registrationDate: newVehicle.registrationDate
      ? new Date(newVehicle.registrationDate).toISOString()
      : undefined,
    lastServiceDate: newVehicle.lastServiceDate
      ? new Date(newVehicle.lastServiceDate).toISOString()
      : undefined,
    nextServiceKm: newVehicle.nextServiceKm ? Number(newVehicle.nextServiceKm) : undefined,
    observations: newVehicle.observations.trim() || undefined,
  }

  try {
    const response = await vehicleService.createVehicle(payload)
    if (response.data) {
      burnedVehicles.unshift(mapVehicleToRow(response.data))
      newVehicle.clientId = 0
      newVehicle.plate = ''
      newVehicle.brand = ''
      newVehicle.model = ''
      newVehicle.year = new Date().getFullYear()
      newVehicle.km = ''
      newVehicle.vehicleType = ''
      newVehicle.status = ''
      newVehicle.registrationDate = ''
      newVehicle.lastServiceDate = ''
      newVehicle.nextServiceKm = ''
      newVehicle.observations = ''
      vehicleClientSearch.value = ''
      showCreateVehicle.value = false
    }
  } catch (error) {
    console.error('Error creando vehículo en el backend', error)
  }
}

// Edición y eliminación de vehículos
const editingVehicle: Ref<VehicleRow | null> = ref(null)
const showEditVehicle = ref(false)

const editVehicle = (vehicle: VehicleRow) => {
  const clone: any = { ...vehicle }
  if (clone.registrationDate) {
    try {
      clone.registrationDate = clone.registrationDate.includes('T') ? clone.registrationDate.split('T')[0] : clone.registrationDate
    } catch (e) {
      clone.registrationDate = ''
    }
  } else {
    clone.registrationDate = ''
  }
  if (clone.lastServiceDate) {
    try {
      clone.lastServiceDate = clone.lastServiceDate.includes('T') ? clone.lastServiceDate.split('T')[0] : clone.lastServiceDate
    } catch (e) {
      clone.lastServiceDate = ''
    }
  } else {
    clone.lastServiceDate = ''
  }

  editingVehicle.value = clone
  showEditVehicle.value = true
}

const saveEditedVehicle = async () => {
  if (!editingVehicle.value) return
  const ev = { ...editingVehicle.value }

  const payload: UpdateVehicleRequest = {
    clientId: ev.clientId,
    plate: ev.plate?.trim(),
    brand: ev.brand?.trim(),
    model: ev.model?.trim(),
    year: ev.year,
    km: Number(ev.km) || 0,
    vehicleType: ev.vehicleType?.trim(),
    status: ev.status?.trim(),
    registrationDate: ev.registrationDate
      ? ev.registrationDate.includes('T')
        ? ev.registrationDate
        : new Date(ev.registrationDate).toISOString()
      : undefined,
    lastServiceDate: ev.lastServiceDate
      ? ev.lastServiceDate.includes('T')
        ? ev.lastServiceDate
        : new Date(ev.lastServiceDate).toISOString()
      : undefined,
    nextServiceKm: ev.nextServiceKm ? Number(ev.nextServiceKm) : undefined,
    observations: ev.observations?.trim() || undefined,
  }

  try {
    const response = await vehicleService.updateVehicle(ev.id, payload)
    if (response.data) {
      const updated = mapVehicleToRow(response.data)
      const idx = burnedVehicles.findIndex((b) => b.id === ev.id)
      if (idx > -1) {
        burnedVehicles.splice(idx, 1, updated)
      }
      showEditVehicle.value = false
      editingVehicle.value = null
    }
  } catch (error) {
    console.error('Error actualizando vehículo en el backend', error)
  }
}

const deleteVehicle = async (idOrPlate: string | number) => {
  if (!confirm('¿Estás seguro de eliminar este vehículo?')) return

  const vehicleToDelete = burnedVehicles.find(
    (b) => b.id === idOrPlate || String(b.plate) === String(idOrPlate),
  )
  if (!vehicleToDelete) return

  try {
    await vehicleService.deleteVehicle(vehicleToDelete.id)
    const remaining = burnedVehicles.filter((b) => b.id !== vehicleToDelete.id)
    burnedVehicles.splice(0, burnedVehicles.length, ...remaining)
  } catch (error) {
    console.error('Error eliminando vehículo en el backend', error)
  }
}

// Usar el composable de productos
const {
  regularProducts, // Productos regulares (sin showcase) - para mostrar en sección Productos
  showcaseProducts,
  categories,
  availableProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  loadShowcaseProducts,
  addShowcaseProduct,
  updateShowcaseProduct,
  deleteShowcaseProduct,
  getCategoryById,
  loadCategories,
  loadProducts,
  addCategory,
  updateCategory,
  deleteCategory
} = useProducts()

// Alias para compatibilidad: usar regularProducts en la vista de productos
const products = regularProducts

// Cargar categorías y productos desde el backend al montar el componente
onMounted(async () => {
  await loadBurnedClients()
  await loadBurnedVehicles()
  await loadBurnedEmployees()
  await refreshWorkOrders()
  await refreshAppointments()

  console.log('🔄 Cargando categorías y productos al montar el componente...')
  await loadCategories()
  await loadProducts()
  await loadShowcaseProducts()
  await loadPurchases()
  await loadInvoices()
  console.log('✅ Categorías cargadas:', categories.value)
  console.log('✅ Productos cargados:', products.value)
  console.log('✅ Productos showcase cargados:', showcaseProducts.value)
})

// Watcher para re-mapear órdenes cuando los vehículos cambien (evita "Client #")
watch(() => burnedVehicles, () => {
  if (rawApiOrders.length > 0) {
    burnedOrders.splice(0, burnedOrders.length, ...rawApiOrders.map(mapApiWorkOrderToDashboardOrder))
  }
}, { deep: true })

// Watcher para debug: observar cambios en categorías
watch(categories, (newCategories) => {
  console.log('🔔 [Watch] Categorías cambiaron:', newCategories.length, newCategories)
}, { deep: true })

// Sales / Purchases data
const sales = ref<Sale[]>([])
const isLoadingSales = ref(false)
const salesError = ref('')

// Transform Purchase to Sale format
const transformPurchaseToSale = (purchase: Purchase): Sale => {
  const firstItem = purchase.items?.[0]
  const itemCount = purchase.items?.length || 0
  const totalQuantity = purchase.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  // Generar nombre descriptivo del producto
  let productName = 'Múltiples productos'
  if (itemCount === 1) {
    productName = firstItem?.productName || 'Producto desconocido'
  } else if (itemCount > 1) {
    productName = `${itemCount} productos diferentes`
  }

  return {
    id: purchase.id.toString(),
    productId: '', // No longer available from API
    productName: productName,
    customerName: purchase.buyerName,
    customerEmail: purchase.buyerEmail,
    quantity: totalQuantity, // Suma total de cantidades
    unitPrice: firstItem?.unitPrice || 0,
    totalAmount: purchase.amount, // Use amount directly from API
    status: mapPurchaseStatus(purchase.status),
    date: new Date(purchase.createdAt),
    selectedColor: firstItem?.selectedColor,
    // Información adicional para mostrar detalles
    items: purchase.items
  }
}

// Map purchase status to sale status
const mapPurchaseStatus = (status: string): 'completed' | 'pending' | 'cancelled' => {
  const upperStatus = status.toUpperCase()
  if (upperStatus === 'COMPLETED' || upperStatus === 'APPROVED') return 'completed'
  if (upperStatus === 'CANCELLED' || upperStatus === 'REJECTED') return 'cancelled'
  return 'pending'
}

// Load purchases from API
const loadPurchases = async () => {
  isLoadingSales.value = true
  salesError.value = ''
  try {
    console.log('📦 Cargando compras desde API...')
    const response = await paymentService.getAllPurchases()
    console.log('📦 Respuesta completa de compras:', response)

    if (response.success && response.data) {
      console.log('📦 Purchases raw data:', response.data.purchases)
      sales.value = response.data.purchases.map((purchase) => {
        console.log('📦 Transformando purchase:', {
          id: purchase.id,
          amount: purchase.amount,
          items: purchase.items
        })
        return transformPurchaseToSale(purchase)
      })
      console.log('✅ Compras transformadas:', sales.value)
    } else {
      salesError.value = 'No se pudieron cargar las compras'
      console.error('❌ Error en respuesta de compras:', response)
    }
  } catch (error) {
    salesError.value = 'Error al cargar las compras'
    console.error('❌ Error cargando compras:', error)
  } finally {
    isLoadingSales.value = false
  }
}

// Formularios
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  images: [] as string[],
  category: '',
  status: 'available' as 'available' | 'out-of-stock' | 'coming-soon',
  colors: [] as string[]
})

// Colores de Apple predeterminados
const appleColors = ref([
  { name: 'Naranja Cósmico', hex: '#ff5e00' },
  { name: 'Azul Profundo', hex: '#003d5c' },
  { name: 'Plata', hex: '#c0c0c0' },
  { name: 'Azul', hex: '#1976d2' },
  { name: 'Negro', hex: '#000000' },
  { name: 'Blanco', hex: '#ffffff' },
  { name: 'Azul Neblina', hex: '#a8c7dd' },
  { name: 'Dorado Claro', hex: '#f7e7a1' },
  { name: 'Azul Cielo', hex: '#87ceeb' },
  { name: 'Rosa', hex: '#ff69b4' },
  { name: 'Amarillo', hex: '#ffeb3b' },
  { name: 'Verde', hex: '#4caf50' },
  { name: 'Púrpura', hex: '#9c27b0' },
  { name: 'Oro', hex: '#ffd700' }
])

const categoryForm = ref<CreateCategoryRequest>({
  name: '',
  description: ''
})

const showcaseForm = ref({
  name: '',
  description: '',
  price: 0,
  image: '',
  category: ''
})

// Estado de guardado de showcase (evita clicks múltiples y sensación de "bloqueo")
const isSavingShowcase = ref(false)

// Validación rápida del formulario de novedad (precio no requerido - siempre será 0)
const showcaseFormValid = computed(() => {
  return (
    showcaseForm.value.name.trim().length > 0 &&
    showcaseForm.value.description.trim().length > 0 &&
    showcaseForm.value.image.trim().length > 0 &&
    showcaseForm.value.category.trim().length > 0
  )
})

// Pestañas
const tabs = [
  { id: 'clients', name: 'Clientes', icon: '👥' },
  { id: 'vehicles', name: 'Vehículos', icon: '🚗' },
  { id: 'orders', name: 'Órdenes', icon: '📝' },
  { id: 'invoices', name: 'Facturación', icon: '💵' },
  { id: 'inventory', name: 'Repuestos', icon: '🧰' },
  { id: 'cash', name: 'Caja', icon: '💰' },
  { id: 'employees', name: 'Empleados', icon: '🧑‍🔧' },
  { id: 'agenda', name: 'Agenda', icon: '📅' },
  { id: 'reports', name: 'Dashboard', icon: '📊' }
]
const burnedOrders = reactive<any[]>([])
let rawApiOrders: any[] = []

const mapApiWorkOrderToDashboardOrder = (order: any) => {
  const services = Array.isArray(order?.services) ? order.services.filter(Boolean).map((service: any) => String(service).trim()) : []
  const createdDate = order?.createdAt ? String(order.createdAt).slice(0, 10) : ''
  // Resolver nombre del técnico (puede venir como string, objeto o ID)
  let mechanicName = ''
  if (order?.mechanic) {
    if (typeof order.mechanic === 'object' && order.mechanic !== null) {
      mechanicName = order.mechanic.name || ''
    } else {
      mechanicName = String(order.mechanic)
    }
  }
  if (!mechanicName && order?.mechanicId) {
    const found = burnedEmployees.find((e: any) => String(e.id) === String(order.mechanicId))
    mechanicName = found?.name || ''
  }
  // Resolver nombre real del cliente desde burnedVehicles (evita "Client #3")
  const vehicleId = order?.vehicleId
  const vehicleObj = Array.isArray(burnedVehicles) ? burnedVehicles.find((v: any) => v.id === vehicleId) : null
  const clientName = vehicleObj?.client || order?.vehicle?.client || ''
  return {
    id: order?.id,
    vehicle: order?.vehicle?.plate || String(order?.vehicleId || ''),
    client: clientName,
    diagnosis: order?.diagnosis || '',
    services,
    parts: [],
    mechanic: mechanicName,
    mechanicId: order?.mechanicId || null,
    vehicleId: order?.vehicleId || null,
    status: order?.status || 'Recepción',
    serviceType: services[0] || 'General',
    mileage: 0,
    total: Number(order?.total) || 0,
    observations: order?.observations || '',
    garantia: Number(order?.garantia) || 0,
    createdDate,
    createdAt: order?.createdAt || createdDate,
    date: order?.createdAt || createdDate,
    deliveryDate: order?.deliveryDate ? String(order.deliveryDate).slice(0, 10) : null,
    deliveryTime: '',
    gases: Boolean(order?.gases),
    escaner: Boolean(order?.escaner),
    showTechnicianInPdf: getShowTechPdf(order?.id),
    vehicleType: vehicleObj?.vehicleType || order?.vehicleType || '',
    vehicleModel: vehicleObj?.model || order?.vehicle?.model || '',
    backendId: order?.id,
  }
}

const refreshWorkOrders = async () => {
  try {
    const response = await workOrderService.getWorkOrders()
    const apiOrders = response.data?.workOrders || []
    rawApiOrders = apiOrders
    burnedOrders.splice(0, burnedOrders.length, ...apiOrders.map(mapApiWorkOrderToDashboardOrder))
  } catch (error) {
    console.error('No se pudieron cargar las órdenes reales', error)
    rawApiOrders = []
    burnedOrders.splice(0, burnedOrders.length)
  }
}

const SHOW_TECH_PDF_KEY = 'jobscar_show_tech_pdf'
function getShowTechPdf(orderId: number | string): boolean {
  try {
    const raw = localStorage.getItem(`${SHOW_TECH_PDF_KEY}_${orderId}`)
    return raw !== null ? raw === 'true' : true
  } catch { return true }
}
function setShowTechPdf(orderId: number | string, value: boolean) {
  try {
    localStorage.setItem(`${SHOW_TECH_PDF_KEY}_${orderId}`, String(value))
  } catch { /* noop */ }
}

const invoices = reactive([] as any[])

// UI y helpers para facturación
const invoicesLoading = ref(false)
const invoicesError = ref('')

function mapInvoiceFromApi(inv: any) {
  return {
    id: inv.id,
    client: inv.clientName || inv.client || '',
    clientPhone: inv.clientPhone || '',
    clientEmail: inv.clientEmail || '',
    clientAddress: inv.clientAddress || '',
    vehicle: inv.placa || inv.vehicle || '',
    vehicleType: inv.vehicleType || '',
    vehicleBrand: inv.vehicleBrand || '',
    vehicleModel: inv.vehiculo || inv.vehicleModel || '',
    vehicleKm: inv.vehicleKm || '',
    placa: inv.placa || '',
    advisorName: inv.advisorName || '',
    items: (inv.items || []).map((it: any) => ({ ...it, discountToTechnician: it.discountToTechnician !== false })),
    taxPct: typeof inv.taxPct === 'number' ? inv.taxPct : inv.taxPct === true ? 19 : 0,
    discount: inv.discount || 0,
    retention: inv.retention || 0,
    deposits: inv.deposits || [],
    formaDePago: inv.formaDePago || '',
    payments: inv.formaDePago || '',
    status: inv.status || 'Pendiente',
    notes: inv.notes || '',
    evidences: inv.evidences || [],
    total: typeof inv.total === 'number' ? inv.total : 0,
    abono: inv.abono || 0,
    saldo: inv.saldo || 0,
    orderId: inv.workOrderId ?? null,
    workOrderId: inv.workOrderId ?? null,
    applyTax: inv.taxPct === true || typeof inv.taxPct === 'number',
    createdAt: inv.createdAt || inv.fechaCreacion || '',
    updatedAt: inv.updatedAt || '',
    showEvidencesInPdf: inv.showEvidencesInPdf !== false
  }
}

function enrichInvoiceFromRelatedData(inv: any) {
  const order = burnedOrders.find((o: any) => Number(o.id) === Number(inv.orderId))
  const vehiclePlaca = inv.vehicle || order?.vehicle || ''
  const vehicleObj = order?.vehicleId
    ? (Array.isArray(burnedVehicles) ? burnedVehicles.find((v: any) => v.id === order.vehicleId) : null)
    : (Array.isArray(burnedVehicles) && vehiclePlaca ? burnedVehicles.find((v: any) => String(v.plate || '').toUpperCase() === String(vehiclePlaca).toUpperCase()) : null)
  const clientObj = vehicleObj?.clientId
    ? (Array.isArray(burnedClients.value) ? burnedClients.value.find((c: any) => c.id === vehicleObj.clientId) : null)
    : (Array.isArray(burnedClients.value) && (inv.client || order?.client)
      ? burnedClients.value.find((c: any) => String(c.name || '').toLowerCase() === String(inv.client || order?.client || '').toLowerCase())
      : null)
  return {
    ...inv,
    client: inv.client || order?.client || clientObj?.name || '',
    clientPhone: inv.clientPhone || clientObj?.phone || '',
    clientEmail: inv.clientEmail || clientObj?.email || '',
    vehicle: inv.vehicle || order?.vehicle || vehicleObj?.plate || '',
    placa: inv.placa || inv.vehicle || order?.vehicle || vehicleObj?.plate || '',
    vehicleType: inv.vehicleType || vehicleObj?.vehicleType || order?.vehicleType || '',
    vehicleBrand: inv.vehicleBrand || vehicleObj?.brand || order?.vehicleBrand || '',
    vehicleModel: inv.vehicleModel || vehicleObj?.model || order?.vehicleModel || '',
    vehicleKm: inv.vehicleKm || (vehicleObj?.km ? String(vehicleObj.km) : ''),
    advisorName: inv.advisorName || order?.mechanic || '',
  }
}

async function loadInvoices() {
  invoicesLoading.value = true
  invoicesError.value = ''
  try {
    const res = await invoiceService.getAll()
    invoices.length = 0
    if (res.success && res.data) {
      const data = Array.isArray(res.data.invoices) ? res.data.invoices : []
      invoices.push(...data.map(mapInvoiceFromApi).map(enrichInvoiceFromRelatedData))
    } else {
      invoicesError.value = 'Error al cargar facturas'
    }
  } catch (e: any) {
    invoicesError.value = e.message || 'Error al cargar facturas'
  } finally {
    invoicesLoading.value = false
  }
}

const invoiceSearch = ref('')
const invoiceFilterStatus = ref('')
const showInvoiceModal = ref(false)
const editingInvoice: Ref<any | null> = ref(null)
const formInvoice = reactive({
  id: 0,
  client: '',
  clientPhone: '',
  clientEmail: '',
  clientAddress: '',
  vehicle: '',
  vehicleType: '',
  vehicleBrand: '',
  vehicleModel: '',
  vehicleKm: '',
  advisorName: '',
  items: [{ description: '', qty: 1, price: 0, isLabor: false, discountToTechnician: true }],
  taxPct: 19,
  applyTax: true,
  discount: 0,
  retention: 0,
  deposits: [] as { amount: number; date: string; method: string }[],
  payments: '',
  status: 'Pendiente',
  notes: '',
  evidences: [] as { type: string; url: string }[],
  showEvidencesInPdf: true,
  createdAt: '',
  orderId: null
})
const printInvoice: Ref<any | null> = ref(null)
const showInvoicePreview = ref(false)
const previewInvoice: Ref<any | null> = ref(null)

function previewInvoiceFn(inv: any) {
  previewInvoice.value = { ...inv }
  showInvoicePreview.value = true
}

function editPreviewInvoice() {
  if (!previewInvoice.value) return
  editInvoice(previewInvoice.value)
  showInvoicePreview.value = false
}

function printPreviewInvoice() {
  if (!previewInvoice.value) return
  viewInvoice(previewInvoice.value)
  showInvoicePreview.value = false
}

// Nota: el filtrado principal se realiza más abajo en `baseFilteredInvoices` (incluye fechas, estado y búsqueda)

function invoiceSubtotal(inv: any) {
  try {
    if (Array.isArray(inv.items) && inv.items.length) {
      return inv.items.reduce((s: number, it: any) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0)
    }
    if (typeof inv.subtotal === 'number') return inv.subtotal
    if (typeof inv.total === 'number') return Math.round(inv.total / 1.19)
  } catch (e) { /* noop */ }
  return 0
}

function formatNumber(n: number | string): string {
  const num = Number(n) || 0
  return num.toLocaleString('es-CO')
}

function parseNumber(s: string): number {
  if (!s) return 0
  return Number(String(s).replace(/\./g, '').replace(/,/g, '.')) || 0
}

function onNumberInput(e: Event, isEditing: boolean, field: string) {
  const target = isEditing ? editingInventory.value : newInventoryItem
  if (!target) return
  const input = e.target as HTMLInputElement
  const raw = input.value
  const numeric = parseNumber(raw)
  target[field] = numeric
  input.value = formatNumber(numeric)
  if (field === 'unitCost') onUnitCostChange(isEditing)
  else if (field === 'unitValue') onUnitValueChange(isEditing)
  else if (field === 'cost') onTotalCostChange(isEditing)
  else if (field === 'invoiceValue') onTotalValueChange(isEditing)
  else if (field === 'quantity') onQuantityChange(isEditing)
}

function onNumberInputCash(e: Event, isEditing: boolean) {
  const target = isEditing ? editingCash.value : newCashItem
  if (!target) return
  const input = e.target as HTMLInputElement
  const raw = input.value
  const numeric = parseNumber(raw)
  target.amount = numeric
  input.value = formatNumber(numeric)
}

function invoiceTax(inv: any) {
  try {
    if (inv.applyTax === false || (typeof inv.taxPct === 'number' && inv.taxPct === 0)) return 0
    const pct = typeof inv.taxPct === 'number' ? inv.taxPct : 19
    return Math.round(invoiceSubtotal(inv) * (pct / 100))
  } catch (e) { /* noop */ }
  return 0
}

function invoiceTotal(inv: any) {
  if (typeof inv.total === 'number') return inv.total
  return invoiceSubtotal(inv) + invoiceTax(inv) - Number(inv.discount || 0) - Number(inv.retention || 0)
}

function invoiceDepositTotal(inv: any): number {
  if (Array.isArray(inv.deposits)) {
    return inv.deposits.reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0)
  }
  // fallback para datos antiguos
  return Number(inv.deposit || 0)
}

function invoicePayrollDiscount(inv: any): number {
  if (!Array.isArray(inv.items)) return 0
  return inv.items.reduce((sum: number, it: any) => {
    const desc = String(it.description || '').trim().toLowerCase()
    if ((desc === 'gases' || desc === 'escaner') && it.discountToTechnician !== false) {
      return sum + (Number(it.price) || 0)
    }
    return sum
  }, 0)
}

function addInvoiceItem() {
  formInvoice.items.push({ description: '', qty: 1, price: 0, isLabor: false, discountToTechnician: true })
}

function removeInvoiceItem(idx: number) {
  if (formInvoice.items.length === 1) formInvoice.items.splice(0, 1)
  else formInvoice.items.splice(idx, 1)
}

function addDeposit() {
  formInvoice.deposits.push({ amount: 0, date: new Date().toISOString().slice(0, 10), method: '' })
}

function removeDeposit(idx: number) {
  formInvoice.deposits.splice(idx, 1)
}

function openCreateInvoice() {
  Object.assign(formInvoice, {
    id: 0,
    client: '', clientPhone: '', clientEmail: '', clientAddress: '',
    vehicle: '', vehicleType: '', vehicleBrand: '', vehicleModel: '', vehicleKm: '',
    placa: '',
    advisorName: '',
  items: [{ description: '', qty: 1, price: 0, isLabor: false, discountToTechnician: true }],
    taxPct: 19, applyTax: true, discount: 0, retention: 0, deposits: [],
    payments: '', status: 'Pendiente', notes: '',
    evidences: [],
    showEvidencesInPdf: true,
    createdAt: new Date().toISOString(),
    orderId: null
  })
  editingInvoice.value = null
  showInvoiceModal.value = true
}

function findInvoiceByOrderId(workOrderId: number | string | undefined) {
  if (!workOrderId) return null
  return invoices.find((inv: any) => Number(inv.orderId) === Number(workOrderId)) || null
}

async function syncInvoiceFromOrder(order: any) {
  const existingInvoice = findInvoiceByOrderId(order.id)
  if (!existingInvoice) {
    alert('Esta orden no tiene factura creada aún')
    return
  }
  try {
    const vehicle = Array.isArray(burnedVehicles)
      ? burnedVehicles.find((v: any) => String(v.plate || '').trim().toUpperCase() === String(order.vehicle || '').trim().toUpperCase())
      : null
    const client = Array.isArray(burnedClients.value)
      ? burnedClients.value.find((c: any) => String(c.name || '').trim().toLowerCase() === String(order.client || '').trim().toLowerCase())
      : null

    // Preservar items manuales (repuestos u otros) que no sean servicios de la orden ni gases/escaner
    const currentItems = Array.isArray(existingInvoice.items) ? existingInvoice.items : []
    const orderServiceDescriptions = new Set(
      (Array.isArray(order.services) && order.services.length)
        ? order.services.map((s: string) => String(s).trim().toLowerCase())
        : [String(order.serviceType || 'Servicio general').trim().toLowerCase()]
    )
    const preservedItems = currentItems.filter((it: any) => {
      const desc = String(it.description || '').trim().toLowerCase()
      return desc !== 'gases' && desc !== 'escaner' && !orderServiceDescriptions.has(desc)
    })

    const items: any[] = []
    if (Array.isArray(order.services) && order.services.length) {
      order.services.forEach((s: string) => {
        items.push({ description: s, qty: 1, price: 0, isLabor: true })
      })
    } else {
      items.push({ description: order.serviceType || 'Servicio general', qty: 1, price: 0, isLabor: true })
    }
    // Preservar discountToTechnician de items existentes
    const existingGases = currentItems.find((it: any) => String(it.description || '').trim().toLowerCase() === 'gases')
    const existingEscaner = currentItems.find((it: any) => String(it.description || '').trim().toLowerCase() === 'escaner')
    if (order.gases) {
      items.push({ description: 'Gases', qty: 1, price: 20000, isLabor: false, discountToTechnician: existingGases ? existingGases.discountToTechnician !== false : true })
    }
    if (order.escaner) {
      const scannerPrice = String(vehicle?.vehicleType || '').toLowerCase() === 'camioneta' ? 50000 : 30000
      items.push({ description: 'Escaner', qty: 1, price: scannerPrice, isLabor: false, discountToTechnician: existingEscaner ? existingEscaner.discountToTechnician !== false : true })
    }
    // Agregar items manuales preservados (repuestos: M.O desmarcado)
    items.push(...preservedItems.map((it: any) => ({ ...it, isLabor: false })))

    const payload: any = {
      client: order.client || '',
      clientPhone: client?.phone || '',
      clientEmail: client?.email || '',
      placa: order.vehicle || '',
      vehicle: [vehicle?.brand, vehicle?.model].filter(Boolean).join(' ') || order.vehicle || '',
      vehicleBrand: vehicle?.brand || '',
      vehicleModel: vehicle?.model || '',
      vehicleKm: vehicle?.km ? String(vehicle.km) : '',
      advisorName: order.mechanic || '',
      items,
      workOrderId: order.id || null
    }
    const res = await invoiceService.update(existingInvoice.id, payload)
    const idx = invoices.findIndex((i: any) => i.id === existingInvoice.id)
    if (idx > -1) {
      invoices.splice(idx, 1, enrichInvoiceFromRelatedData(mapInvoiceFromApi(res.data)))
    }
    alert('Factura actualizada correctamente desde la orden')
  } catch (e) {
    console.error('Error al sincronizar factura desde orden:', e)
    alert('Error al actualizar la factura')
  }
}

async function openInvoiceForOrder(order: any) {
  const existingInvoice = findInvoiceByOrderId(order.id)
  if (existingInvoice) {
    await syncInvoiceFromOrder(order)
  } else {
    createInvoiceFromOrder(order)
  }
}

function createInvoiceFromOrder(order: any) {
  console.log('🧾 createInvoiceFromOrder llamado', order)
  try {
    const vehicle = Array.isArray(burnedVehicles)
      ? burnedVehicles.find((v: any) => String(v.plate || '').trim().toUpperCase() === String(order.vehicle || '').trim().toUpperCase())
      : null
    const client = Array.isArray(burnedClients.value)
      ? burnedClients.value.find((c: any) => String(c.name || '').trim().toLowerCase() === String(order.client || '').trim().toLowerCase())
      : null
    const items: any[] = []
    // Agregar servicios como items (mano de obra)
    if (Array.isArray(order.services) && order.services.length) {
      order.services.forEach((s: string) => {
        items.push({ description: s, qty: 1, price: 0, isLabor: true })
      })
    } else {
      items.push({ description: order.serviceType || 'Servicio general', qty: 1, price: 0, isLabor: true })
    }
    // Agregar Gases si aplica (repuesto)
    if (order.gases) {
      items.push({ description: 'Gases', qty: 1, price: 20000, isLabor: false, discountToTechnician: true })
    }
    // Agregar Escaner si aplica (servicio / mano de obra)
    if (order.escaner) {
      const scannerPrice = String(vehicle?.vehicleType || '').toLowerCase() === 'camioneta' ? 50000 : 30000
      items.push({ description: 'Escaner', qty: 1, price: scannerPrice, isLabor: false, discountToTechnician: true })
    }
    formInvoice.id = 0
    formInvoice.client = order.client || ''
    formInvoice.clientPhone = client?.phone || ''
    formInvoice.clientEmail = client?.email || ''
    formInvoice.clientAddress = ''
    formInvoice.vehicle = order.vehicle || ''
    formInvoice.vehicleType = vehicle?.vehicleType || ''
    formInvoice.vehicleBrand = vehicle?.brand || ''
    formInvoice.vehicleModel = vehicle?.model || ''
    formInvoice.vehicleKm = vehicle?.km ? String(vehicle.km) : ''
    formInvoice.advisorName = order.mechanic || ''
    formInvoice.items = items
    formInvoice.taxPct = 19
    formInvoice.applyTax = true
    formInvoice.discount = 0
    formInvoice.retention = 0
    formInvoice.deposits = []
    formInvoice.payments = ''
    formInvoice.status = 'Pendiente'
    formInvoice.notes = ''
    formInvoice.showEvidencesInPdf = true
    formInvoice.createdAt = new Date().toISOString()
    formInvoice.orderId = order.id || null
    editingInvoice.value = null
    showInvoiceModal.value = true
    console.log('✅ Modal factura abierto con items:', items)
  } catch (e) {
    console.error('❌ Error al crear factura desde orden:', e)
    alert('Error al abrir factura. Revisa la consola.')
  }
}

async function createCashMovementFromDeposit(invoiceId: number, deposit: any, clientName: string) {
  try {
    const response = await moneyMovementService.create({
      reference: `Fact #${invoiceId}`,
      name: clientName || 'Cliente',
      concept: `Abono factura #${invoiceId}`,
      movement: 'INGRESO',
      amount: Number(deposit.amount) || 0,
      account: 'Banco',
      observation: deposit.method || '',
    })
    const created = response.data
    if (created) {
      burnedCashMovements.push({
        id: created.id,
        date: created.createdAt ? created.createdAt.slice(0, 10) : deposit.date,
        reference: created.reference || '',
        name: created.name,
        concept: created.concept,
        movement: created.movement === 'INGRESO' ? 'Ingreso' : 'Egreso',
        amount: created.amount,
        account: created.account,
        observation: created.observation || '',
      })
    }
  } catch (error: any) {
    console.error('Error creando movimiento de caja desde abono:', error)
  }
}

async function saveInvoice() {
  if (!formInvoice.client) { alert('Cliente requerido'); return }
  const payload: any = {
    client: String(formInvoice.client),
    clientPhone: formInvoice.clientPhone || '',
    clientEmail: formInvoice.clientEmail || '',
    clientAddress: formInvoice.clientAddress || '',
    placa: formInvoice.vehicle || '',
    vehicle: [formInvoice.vehicleBrand, formInvoice.vehicleModel].filter(Boolean).join(' ') || formInvoice.vehicle || '',
    vehicleType: formInvoice.vehicleType || '',
    vehicleBrand: formInvoice.vehicleBrand || '',
    vehicleModel: formInvoice.vehicleModel || '',
    vehicleKm: formInvoice.vehicleKm || '',
    advisorName: formInvoice.advisorName || '',
    items: formInvoice.items.map((it: any) => ({ ...it })),
    taxPct: formInvoice.applyTax,
    discount: Number(formInvoice.discount) || 0,
    retention: Number(formInvoice.retention) || 0,
    deposits: formInvoice.deposits.map((d: any) => ({ ...d })),
    formaDePago: formInvoice.payments || '',
    status: formInvoice.status || 'Pendiente',
    notes: formInvoice.notes || '',
    evidences: formInvoice.evidences.map((e: any) => ({ type: e.type || 'actual', url: e.url || '' })),
    showEvidencesInPdf: formInvoice.showEvidencesInPdf !== false,
    workOrderId: formInvoice.orderId || null
  }
  const previousDeposits = editingInvoice.value
    ? (invoices.find((i: any) => i.id === editingInvoice.value.id)?.deposits || [])
    : []
  try {
    let savedInvoiceId: number | null = null
    if (editingInvoice.value) {
      const res = await invoiceService.update(editingInvoice.value.id, payload)
      savedInvoiceId = res.data?.id || editingInvoice.value.id
      const idx = invoices.findIndex((i: any) => i.id === editingInvoice.value.id)
      if (idx > -1) {
      invoices.splice(idx, 1, enrichInvoiceFromRelatedData(mapInvoiceFromApi(res.data)))
      }
      editingInvoice.value = null
    } else {
      const res = await invoiceService.create(payload)
      savedInvoiceId = res.data?.id || null
      invoices.push(enrichInvoiceFromRelatedData(mapInvoiceFromApi(res.data)))
    }
    // Crear ingresos de caja automáticos por cada abono nuevo
    const savedInvoice = invoices.find((i: any) => i.id === savedInvoiceId)
    const newDeposits = savedInvoice?.deposits || formInvoice.deposits || []
    for (const deposit of newDeposits) {
      const exists = previousDeposits.some((d: any) =>
        d.date === deposit.date &&
        Number(d.amount) === Number(deposit.amount) &&
        d.method === deposit.method
      )
      if (!exists) {
        await createCashMovementFromDeposit(savedInvoiceId || 0, deposit, formInvoice.client)
      }
    }
    showInvoiceModal.value = false
  } catch (e: any) {
    alert('Error al guardar la factura: ' + (e.message || 'Error desconocido'))
  }
}

function editInvoice(inv: any) {
  editingInvoice.value = { ...inv }
  formInvoice.id = inv.id
  formInvoice.client = inv.client || ''
  formInvoice.clientPhone = inv.clientPhone || ''
  formInvoice.clientEmail = inv.clientEmail || ''
  formInvoice.clientAddress = inv.clientAddress || ''
  formInvoice.vehicle = inv.vehicle || ''
  formInvoice.vehicleType = inv.vehicleType || ''
  formInvoice.vehicleBrand = inv.vehicleBrand || ''
  formInvoice.vehicleModel = inv.vehicleModel || ''
  formInvoice.vehicleKm = inv.vehicleKm || ''
  formInvoice.advisorName = inv.advisorName || ''
  formInvoice.items = Array.isArray(inv.items) && inv.items.length ? inv.items.map((it: any) => ({ ...it, isLabor: it.isLabor ?? true, discountToTechnician: it.discountToTechnician !== false })) : [{ description: '', qty: 1, price: 0, isLabor: false, discountToTechnician: true }]
  formInvoice.taxPct = 19
  formInvoice.applyTax = inv.applyTax !== false
  formInvoice.discount = inv.discount || 0
  formInvoice.retention = inv.retention || 0
  formInvoice.deposits = Array.isArray(inv.deposits) ? inv.deposits.map((d: any) => ({ ...d })) : []
  formInvoice.payments = inv.payments || ''
  formInvoice.status = inv.status || 'Pendiente'
  formInvoice.notes = inv.notes || ''
  formInvoice.evidences = Array.isArray(inv.evidences) ? inv.evidences.map((e: any) => ({ type: e.type || 'actual', url: e.url || '' })) : []
  formInvoice.showEvidencesInPdf = inv.showEvidencesInPdf !== false
  formInvoice.createdAt = inv.createdAt || new Date().toISOString()
  formInvoice.orderId = inv.orderId || inv.workOrderId || null
  showInvoiceModal.value = true
}

function buildInvoiceHtml(inv: any): string {
  const subtotal = invoiceSubtotal(inv)
  const tax = invoiceTax(inv)
  const total = subtotal + tax - Number(inv.discount || 0) - Number(inv.retention || 0)
  const dateStr = new Date(inv.createdAt || Date.now()).toLocaleDateString()
  const dueStr = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '-'
  const items = Array.isArray(inv.items) ? inv.items : []
  const itemsHtml = items.map((it: any, idx: number) => {
    const qty = it.qty ?? 1
    const price = Number(it.price) || 0
    return `<tr><td class="inv-col-num">${idx + 1}</td><td class="inv-col-desc">${it.description || '-'}</td><td class="inv-col-qty">${qty}</td><td class="inv-col-price">$${price.toLocaleString()}</td><td class="inv-col-total">$${(qty * price).toLocaleString()}</td></tr>`
  }).join('')
  const fallbackRow = `<tr><td class="inv-col-num">1</td><td class="inv-col-desc">Servicio general</td><td class="inv-col-qty">1</td><td class="inv-col-price">$${subtotal.toLocaleString()}</td><td class="inv-col-total">$${subtotal.toLocaleString()}</td></tr>`
  const statusClass = String(inv.status || 'Pendiente').toLowerCase()
  const statusLabel = inv.status || 'Pendiente'
  const discountRow = inv.discount ? `<div class="inv-totals-row discount"><span>Descuento</span><span>-$${Number(inv.discount).toLocaleString()}</span></div>` : ''
  const retentionRow = inv.retention ? `<div class="inv-totals-row retention"><span>Retención</span><span>-$${Number(inv.retention).toLocaleString()}</span></div>` : ''
  const taxRow = (inv.applyTax !== false && (inv.taxPct || 0) > 0) ? `<div class="inv-totals-row"><span>IVA (${inv.taxPct || 19}%)</span><span>$${tax.toLocaleString()}</span></div>` : ''
  const depositTotal = invoiceDepositTotal(inv)
  const depositRow = depositTotal > 0 ? `<div class="inv-totals-row" style="color:#166534;"><span>ABONADO</span><span>$${depositTotal.toLocaleString()}</span></div>` : ''
  const balanceRow = depositTotal > 0 && total > depositTotal ? `<div class="inv-totals-row" style="color:#b45309;"><span>SALDO PENDIENTE</span><span>$${(total - depositTotal).toLocaleString()}</span></div>` : ''
  const photosHtml = (Array.isArray(inv.evidences) ? inv.evidences : []).map((ev: any) => `<img src="${ev.url}" class="inv-photo" alt="Evidencia ${ev.type || ''}" />`).join('')
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<style>
@page { margin: 0; size: A4 portrait; }
body { margin:0; padding:0; background:#fff; color:#111827; font-family:'Inter','Segoe UI',Arial,sans-serif; print-color-adjust:exact; -webkit-print-color-adjust:exact; }
.inv-sheet { max-width:210mm; margin:0 auto; padding:12mm 10mm; }
.inv-header { display:flex; align-items:center; margin-bottom:14px; padding-bottom:10px; border-bottom:2px solid #1f2937; }
.inv-header-left { display:flex; align-items:center; gap:12px; flex:0 0 auto; }
.inv-header-separator { width:1px; height:70px; background:#e5e7eb; margin:0 20px; }
.inv-header-center { text-align:left; flex:0 0 auto; }
.inv-doc-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#6b7280; margin:0; }
.inv-doc-id { font-size:28px; font-weight:800; color:#111827; margin:4px 0 0 0; }
.inv-logo { height:90px; width:auto; display:block; }
.inv-brand-text h1 { font-size:28px; font-weight:800; color:#111827; margin:0; line-height:1.1; }
.inv-brand-text p { font-size:10px; color:#6b7280; margin:3px 0 0 0; letter-spacing:0.1em; text-transform:uppercase; }
.inv-header-right { text-align:left; flex:0 0 auto; display:flex; flex-direction:column; align-items:flex-start; gap:8px; }
.inv-header-meta { display:flex; align-items:flex-start; gap:8px; }
.inv-header-meta svg { color:#9ca3af; margin-top:2px; }
.inv-meta-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#9ca3af; }
.inv-meta-val { font-size:12px; color:#374151; font-weight:500; }
.inv-status { display:inline-block; padding:3px 10px; border-radius:999px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
.inv-status.pendiente { background:#fef9c3; color:#854d0e; border:1px solid #fde047; }
.inv-status.pagada { background:#dcfce7; color:#166534; border:1px solid #86efac; }
.inv-status.abonada, .inv-status.abonado { background:#dbeafe; color:#1e40af; border:1px solid #93c5fd; }
.inv-status.anulada { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; }
.inv-info-grid { display:flex; align-items:stretch; gap:0; margin-bottom:14px; border:1px solid #e2e8f0; border-radius:12px; background:#f9fafb; overflow:hidden; }
.inv-info-col { flex:1; padding:16px 20px; }
.inv-info-separator { width:1px; border-left:1px solid #d1d5db; margin:12px 0; }
.inv-info-header { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.inv-info-header svg { color:#6b7280; flex-shrink:0; }
.inv-info-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#9ca3af; }
.inv-info-name { font-size:14px; font-weight:700; color:#111827; margin-top:2px; }
.inv-info-divider { height:1px; border-bottom:1px solid #d1d5db; margin:10px 0; }
.inv-info-row { display:flex; align-items:center; gap:8px; font-size:11px; color:#374151; margin-bottom:6px; }
.inv-info-row svg { color:#9ca3af; flex-shrink:0; }
.inv-info-pair { display:flex; align-items:baseline; gap:10px; margin-bottom:5px; font-size:11px; }
.inv-info-key { font-size:9px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#9ca3af; min-width:70px; }
.inv-info-val { color:#374151; font-weight:500; }
.inv-table { width:100%; border-collapse:collapse; margin:0 auto 14px auto; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; }
.inv-table th { background:#f9fafb; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#6b7280; padding:8px 10px; text-align:center; border-bottom:1px solid #e5e7eb; }
.inv-table td { font-size:11px; color:#374151; padding:8px 10px; text-align:center; border-bottom:1px solid #f3f4f6; }
.inv-table tr:last-child td { border-bottom:none; }
.inv-col-desc { text-align:left !important; }
.inv-col-num { width:30px; text-align:center; }
.inv-col-qty { width:50px; text-align:center; }
.inv-col-price,.inv-col-total { width:90px; text-align:center; }
.inv-totals { display:flex; justify-content:flex-end; margin-bottom:14px; }
.inv-totals-box { width:260px; border:1px solid #e5e7eb; border-radius:8px; padding:12px 14px; background:#f9fafb; }
.inv-totals-row { display:flex; justify-content:space-between; font-size:11px; margin-bottom:6px; color:#374151; }
.inv-totals-row.discount { color:#dc2626; }
.inv-totals-row.retention { color:#ea580c; }
.inv-totals-row.total { font-size:14px; font-weight:700; color:#111827; margin-top:8px; padding-top:8px; border-top:1px solid #d1d5db; }
.inv-evidence-section { border:1px solid #e5e7eb; border-radius:12px; background:#f9fafb; padding:16px; margin-bottom:14px; }
.inv-evidence-header { display:flex; align-items:center; gap:8px; margin-bottom:12px; font-size:12px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:0.5px; }
.inv-evidence-header svg { color:#6b7280; }
.inv-evidence-grid { display:flex; gap:16px; }
.inv-evidence-col { flex:1; }
.inv-evidence-title { font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
.inv-evidence-photos { display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; }
.inv-evidence-photo { width:100%; height:80px; object-fit:cover; border-radius:8px; border:1px solid #e5e7eb; filter: grayscale(100%); }
.inv-evidence-placeholder { width:100%; height:80px; border-radius:8px; background:#f3f4f6; border:2px dashed #d1d5db; display:flex; align-items:center; justify-content:center; font-size:12px; color:#9ca3af; }
.inv-evidence-separator { width:1px; background:#e5e7eb; margin:0 8px; }
.inv-bottom-section { display:flex; gap:16px; margin-bottom:14px; }
.inv-bottom-card { flex:1; border:1px solid #e5e7eb; border-radius:12px; background:#f9fafb; padding:16px; }
.inv-bottom-header { display:flex; align-items:center; gap:8px; margin-bottom:12px; font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; }
.inv-bottom-header svg { color:#6b7280; }
.inv-signature-line { display:flex; flex-direction:column; align-items:center; padding-top:20px; }
.inv-sig-line { width:200px; border-top:1px solid #9ca3af; padding-top:8px; }
.inv-sig-text { font-size:10px; color:#6b7280; margin-top:4px; }
.inv-notes-lines { display:flex; flex-direction:column; gap:8px; }
.inv-note-line { height:1px; background:#e5e7eb; border-bottom:1px dashed #d1d5db; }
.inv-footer { display:flex; align-items:center; justify-content:space-between; border-top:1px solid #e5e7eb; padding-top:12px; margin-top:8px; font-size:9px; color:#6b7280; }
.inv-footer-left { display:flex; align-items:center; gap:8px; }
.inv-footer-left svg { color:#6b7280; flex-shrink:0; }
.inv-footer-tagline { font-size:8px; color:#9ca3af; margin-top:2px; }
.inv-footer-center { display:flex; align-items:center; gap:6px; }
.inv-footer-center svg { color:#6b7280; flex-shrink:0; }
.inv-footer-right { display:flex; align-items:center; gap:6px; }
.inv-footer-right svg { color:#6b7280; flex-shrink:0; }
</style>
</head>
<body>
  <div class="inv-sheet">
  <div class="inv-header">
    <div class="inv-header-left">
      <img src="/images/logobn.png" class="inv-logo" alt="JOB'S CAR" />
      <div class="inv-brand-text"><h1>JOB'S CAR</h1><p>CENTRO AUTOMOTRIZ ESPECIALIZADO</p></div>
    </div>
    <div class="inv-header-separator"></div>
    <div class="inv-header-center">
      <p class="inv-doc-title">Remision</p>
      <p class="inv-doc-id">No. RM-${String(inv.id).padStart(4,'0')}</p>
    </div>
    <div class="inv-header-separator"></div>
    <div class="inv-header-right">
      <div class="inv-header-meta">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <div>
          <div class="inv-meta-label">FECHA EMISIÓN</div>
          <div class="inv-meta-val">${dateStr}</div>
        </div>
      </div>
      <div class="inv-header-meta">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <div>
          <div class="inv-meta-label">ESTADO</div>
          <span class="inv-status ${statusClass}">${statusLabel}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="inv-info-grid">
    <div class="inv-info-col">
      <div class="inv-info-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <div>
          <div class="inv-info-label">CLIENTE</div>
          <div class="inv-info-name">${inv.client || '-'}</div>
        </div>
      </div>
      <div class="inv-info-divider"></div>
      <div class="inv-info-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        <span>${inv.clientPhone || '-'}</span>
      </div>
      <div class="inv-info-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        <span>${inv.clientEmail || '-'}</span>
      </div>
    </div>
    <div class="inv-info-separator"></div>
    <div class="inv-info-col">
      <div class="inv-info-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path><circle cx="6.5" cy="16.5" r="2.5"></circle><circle cx="16.5" cy="16.5" r="2.5"></circle></svg>
        <div>
          <div class="inv-info-label">VEHÍCULO</div>
          <div class="inv-info-name">${inv.vehicleBrand || ''} ${inv.vehicleModel || ''}</div>
        </div>
      </div>
      <div class="inv-info-divider"></div>
      <div class="inv-info-pair"><span class="inv-info-key">PLACA</span><span class="inv-info-val">${inv.vehicle || '-'}</span></div>
      <div class="inv-info-pair"><span class="inv-info-key">MODELO</span><span class="inv-info-val"> ${inv.vehicleModel || ''}</span></div>
      <div class="inv-info-pair"><span class="inv-info-key">KILOMETRAJE</span><span class="inv-info-val">${inv.vehicleKm || '-'}</span></div>
    </div>
  </div>
  <table class="inv-table">
    <thead><tr><th class="inv-col-num">#</th><th class="inv-col-desc">Descripción</th><th class="inv-col-qty">Cantidad</th><th class="inv-col-price">Valor Unitario</th><th class="inv-col-total">Total</th></tr></thead>
    <tbody>${itemsHtml || fallbackRow}</tbody>
  </table>
  <div class="inv-totals">
    <div class="inv-totals-box">
      <div class="inv-totals-row"><span>Subtotal</span><span>$${subtotal.toLocaleString()}</span></div>
      ${taxRow}
      ${discountRow}
      ${retentionRow}
      <div class="inv-totals-row total"><span>TOTAL</span><span>$${total.toLocaleString()}</span></div>
      ${depositRow}
      ${balanceRow}
    </div>
  </div>
  ${inv.showEvidencesInPdf !== false ? `
  <div class="inv-evidence-section">
    <div class="inv-evidence-header">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
      <span>4. EVIDENCIA FOTOGRÁFICA</span>
    </div>
    <div class="inv-evidence-grid">
      <div class="inv-evidence-col">
        <div class="inv-evidence-title">ANTES DEL SERVICIO</div>
        <div class="inv-evidence-photos">
          ${inv.evidences && inv.evidences.filter((e: any) => e.type === 'pasada').map((e: any) => `<img src="${e.url}" class="inv-evidence-photo" alt="Antes" />`).join('') || '<div class="inv-evidence-placeholder">📷 Sin fotografía</div>'}
        </div>
      </div>
      <div class="inv-evidence-separator"></div>
      <div class="inv-evidence-col">
        <div class="inv-evidence-title">DESPUÉS DEL SERVICIO</div>
        <div class="inv-evidence-photos">
          ${inv.evidences && inv.evidences.filter((e: any) => e.type !== 'pasada').map((e: any) => `<img src="${e.url}" class="inv-evidence-photo" alt="Después" />`).join('') || '<div class="inv-evidence-placeholder">📷 Sin fotografía</div>'}
        </div>
      </div>
    </div>
  </div>` : ''}

  <div class="inv-bottom-section">
    <div class="inv-bottom-card">
      <div class="inv-bottom-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>5. FIRMAS</span>
      </div>
      <div class="inv-signature-line">
        <div class="inv-sig-line"></div>
        <div class="inv-sig-text">Firma del Encargado JOBS CAR</div>
      </div>
    </div>
    <div class="inv-bottom-card">
      <div class="inv-bottom-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <span>NOTAS ADICIONALES</span>
      </div>
      <div class="inv-notes-lines">
        ${inv.notes ? `<div style="font-size:11px;color:#374151;white-space:pre-wrap;">${String(inv.notes || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : '<div style="font-size:11px;color:#9ca3af;font-style:italic;">no registran</div>'}
      </div>
    </div>
  </div>

  <div class="inv-footer">
    <div class="inv-footer-left">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      <div>
        <div>Gracias por confiar en <strong>JOB'S CAR</strong></div>
        <div class="inv-footer-tagline">Calidad, honestidad y confianza.</div>
      </div>
    </div>
    <div class="inv-footer-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      <span>+57 314 4607515</span>
    </div>
    <div class="inv-footer-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      <span>Carrera 79 No. 67 - 39, Bogotá D.C</span>
    </div>
  </div>
</div>
</body>
</html>`
}

function viewInvoice(inv: any) {
  const html = buildInvoiceHtml(inv)
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;z-index:-1;'
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument || iframe.contentWindow?.document
  if (!doc) {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
    return
  }
  doc.open()
  doc.write(html)
  doc.close()
  const onLoaded = () => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } catch (e) {
      // fallback
    } finally {
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
      }, 1000)
    }
  }
  iframe.onload = onLoaded
  // Fallback si onload no se dispara (ej. contenido ya cargado)
  setTimeout(onLoaded, 2000)
}

async function deleteInvoice(id: any) {
  if (!confirm('¿Estás seguro de eliminar esta factura?')) return
  try {
    await invoiceService.delete(id)
    const idx = invoices.findIndex((i: any) => i.id === id)
    if (idx > -1) invoices.splice(idx, 1)
  } catch (e: any) {
    alert('Error al eliminar la factura: ' + (e.message || 'Error desconocido'))
  }
}

async function toggleInvoicePaid(inv: any) {
  const statusMap: Record<string, string> = {
    'Pendiente': 'Abonado',
    'Abonado': 'Pagado',
    'Pagado': 'Pendiente'
  }
  const newStatus = statusMap[inv.status] || 'Pendiente'
  try {
    const res = await invoiceService.update(inv.id, { status: newStatus })
    const idx = invoices.findIndex((i: any) => i.id === inv.id)
    if (idx > -1) {
      invoices.splice(idx, 1, enrichInvoiceFromRelatedData({ ...inv, ...mapInvoiceFromApi(res.data) }))
    }
  } catch (e: any) {
    alert('Error al cambiar estado: ' + (e.message || 'Error desconocido'))
  }
}

function exportInvoicesCsv() {
  try {
    const rows = sortedInvoices.value.map((inv: any) => {
      return {
        id: inv.id,
        date: inv.createdAt || '',
        client: inv.client,
        vehicle: inv.vehicle || '',
        items: Array.isArray(inv.items) ? inv.items.map((it: any) => typeof it === 'string' ? it : (it.description || '')).join('; ') : String(inv.items || ''),
        subtotal: invoiceSubtotal(inv),
        tax: invoiceTax(inv),
        total: invoiceTotal(inv),
        deposit: invoiceDepositTotal(inv),
        balance: Math.max(0, invoiceTotal(inv) - invoiceDepositTotal(inv)),
        status: inv.status
      }
    })
    const csv = [
      ['id', 'date', 'client', 'vehicle', 'items', 'subtotal', 'tax', 'total', 'deposit', 'balance', 'status'],
      ...rows.map((r: any) => [r.id, r.date, `"${(r.client || '').replace(/"/g, '""')}"`, `"${(r.vehicle || '').replace(/"/g, '""')}"`, `"${(r.items || '').replace(/"/g, '""')}"`, r.subtotal, r.tax, r.total, r.deposit, r.balance, r.status])
    ].map((r: any) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facturas_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (e) { console.error(e) }
}

// --- Mejoras: filtros por fecha, ordenamiento, paginación y selección múltiple ---
const dateFrom = ref('')
const dateTo = ref('')
const sortKey = ref('createdAt')
const sortDir = ref(-1) // -1 = desc, 1 = asc
const pageSize = ref(8)
const currentPage = ref(1)
const selectedInvoices = ref<any[]>([])

const baseFilteredInvoices = computed(() => {
  const q = invoiceSearch.value.trim().toLowerCase()
  return invoices.filter((inv: any) => {
    if (invoiceFilterStatus.value && inv.status !== invoiceFilterStatus.value) return false
    // rango de fechas
    if (dateFrom.value) {
      const invDate = inv.createdAt ? new Date(inv.createdAt) : null
      if (!invDate) return false
      const from = new Date(dateFrom.value); from.setHours(0, 0, 0, 0)
      if (invDate < from) return false
    }
    if (dateTo.value) {
      const invDate = inv.createdAt ? new Date(inv.createdAt) : null
      if (!invDate) return false
      const to = new Date(dateTo.value); to.setHours(23, 59, 59, 999)
      if (invDate > to) return false
    }
    if (!q) return true
    const idMatch = String(inv.id).toLowerCase().includes(q)
    const clientMatch = inv.client && String(inv.client).toLowerCase().includes(q)
    const vehicleMatch = inv.vehicle && String(inv.vehicle).toLowerCase().includes(q)
    let itemsText = ''
    if (Array.isArray(inv.items)) {
      itemsText = inv.items.map((it: any) => (typeof it === 'string' ? it : (it.description || ''))).join(' ').toLowerCase()
    } else {
      itemsText = String(inv.items || '').toLowerCase()
    }
    const itemsMatch = itemsText.includes(q)
    const paymentsMatch = Array.isArray(inv.payments) ? inv.payments.join(' ').toLowerCase().includes(q) : String(inv.payments || '').toLowerCase().includes(q)
    const statusMatch = inv.status && String(inv.status).toLowerCase().includes(q)
    return idMatch || clientMatch || vehicleMatch || itemsMatch || paymentsMatch || statusMatch
  })
})

const sortedInvoices = computed(() => {
  const arr = baseFilteredInvoices.value.slice()
  const k = sortKey.value
  const dir = sortDir.value
  arr.sort((a: any, b: any) => {
    let va: any = k === 'subtotal' ? invoiceSubtotal(a) : k === 'tax' ? invoiceTax(a) : k === 'total' ? invoiceTotal(a) : a[k]
    let vb: any = k === 'subtotal' ? invoiceSubtotal(b) : k === 'tax' ? invoiceTax(b) : k === 'total' ? invoiceTotal(b) : b[k]
    if (k === 'createdAt') { va = a.createdAt ? new Date(a.createdAt).getTime() : 0; vb = b.createdAt ? new Date(b.createdAt).getTime() : 0 }
    if (typeof va === 'string') va = va.toLowerCase()
    if (typeof vb === 'string') vb = vb.toLowerCase()
    if (va > vb) return dir
    if (va < vb) return -dir
    return 0
  })
  return arr
})

const totalPages = computed(() => Math.max(1, Math.ceil(sortedInvoices.value.length / pageSize.value)))

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedInvoices.value.slice(start, start + pageSize.value)
})

// Reiniciar paginación cuando cambien filtros o búsqueda
watch([invoiceSearch, invoiceFilterStatus, dateFrom, dateTo], () => {
  currentPage.value = 1
})

watch([searchCash, cashFilterMovement, cashFilterMonth], () => {
  cashPage.value = 1
})

const selectAllChecked = computed(() => {
  const ids = paginatedInvoices.value.map((i: any) => i.id)
  return ids.length > 0 && ids.every((id: any) => selectedInvoices.value.includes(id))
})

function setSort(k: string) {
  if (sortKey.value === k) sortDir.value = -sortDir.value
  else { sortKey.value = k; sortDir.value = -1 }
  currentPage.value = 1
}

function toggleSelectAllVisible() {
  const ids = paginatedInvoices.value.map((i: any) => i.id)
  const all = ids.every((id: any) => selectedInvoices.value.includes(id))
  if (all) selectedInvoices.value = selectedInvoices.value.filter((id: any) => !ids.includes(id))
  else {
    const set = new Set(selectedInvoices.value)
    ids.forEach((id: any) => set.add(id))
    selectedInvoices.value = Array.from(set)
  }
}

function toggleSelectInvoice(id: any) {
  const idx = selectedInvoices.value.indexOf(id)
  if (idx === -1) selectedInvoices.value.push(id)
  else selectedInvoices.value.splice(idx, 1)
}

async function bulkMarkPaid() {
  if (!selectedInvoices.value.length) { alert('Ninguna factura seleccionada'); return }
  try {
    await Promise.all(selectedInvoices.value.map((id: any) => invoiceService.update(id, { status: 'Pagado' })))
    await loadInvoices()
    selectedInvoices.value = []
  } catch (e: any) {
    alert('Error al marcar como pagadas: ' + (e.message || 'Error desconocido'))
  }
}

function exportSelectedCsv() {
  try {
    const rows = invoices.filter((i: any) => selectedInvoices.value.includes(i.id)).map((inv: any) => ({
      id: inv.id,
      date: inv.createdAt || '',
      client: inv.client,
      vehicle: inv.vehicle || '',
      items: Array.isArray(inv.items) ? inv.items.map((it: any) => typeof it === 'string' ? it : (it.description || '')).join('; ') : String(inv.items || ''),
      subtotal: invoiceSubtotal(inv),
      tax: invoiceTax(inv),
      total: invoiceTotal(inv),
      status: inv.status
    }))
    const csv = [
      ['id', 'date', 'client', 'vehicle', 'items', 'subtotal', 'tax', 'total', 'status'],
      ...rows.map((r: any) => [r.id, r.date, `"${(r.client || '').replace(/"/g, '""')}"`, `"${(r.vehicle || '').replace(/"/g, '""')}"`, `"${(r.items || '').replace(/"/g, '""')}"`, r.subtotal, r.tax, r.total, r.status])
    ].map((r: any) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facturas_seleccionadas_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (e) { console.error(e) }
}

async function bulkDeleteSelected() {
  if (!selectedInvoices.value.length) { alert('Ninguna factura seleccionada'); return }
  if (!confirm(`¿Eliminar ${selectedInvoices.value.length} facturas?`)) return
  try {
    await Promise.all(selectedInvoices.value.map((id: any) => invoiceService.delete(id)))
    await loadInvoices()
    selectedInvoices.value = []
    currentPage.value = Math.min(currentPage.value, totalPages.value)
  } catch (e: any) {
    alert('Error al eliminar facturas: ' + (e.message || 'Error desconocido'))
  }
}

function goToPage(n: number) { currentPage.value = Math.min(Math.max(1, n), totalPages.value) }

// --- Fin mejoras ---

const burnedInventory = reactive<any[]>([])

const showCreateInventory = ref(false)
const showEditInventory = ref(false)
const newInventoryItem = reactive({
  orderId: 0,
  invoiceId: null as any,
  invoiceItemIndex: null as number | null,
  date: new Date().toISOString().slice(0, 10),
  activity: '',
  quantity: 1,
  unitCost: 0,
  cost: 0,
  unitValue: 0,
  invoiceValue: 0,
  netProfit: 0
})
const editingInventory = ref<any | null>(null)
const expandedInventoryOrders = reactive<Set<number>>(new Set())
const expandedCashReferences = reactive<Set<string>>(new Set())

function toggleInventoryOrder(orderId: number) {
  if (expandedInventoryOrders.has(orderId)) {
    expandedInventoryOrders.delete(orderId)
  } else {
    expandedInventoryOrders.add(orderId)
  }
}

function toggleCashReference(reference: string) {
  if (expandedCashReferences.has(reference)) {
    expandedCashReferences.delete(reference)
  } else {
    expandedCashReferences.add(reference)
  }
}

function getInventoryGroups() {
  const groups: Record<number, any[]> = {}
  burnedInventory.forEach((item: any) => {
    const oid = item.orderId || 0
    if (!groups[oid]) groups[oid] = []
    groups[oid].push(item)
  })
  return groups
}

function getCashGroups() {
  const groups: Record<string, any[]> = {}
  const filtered = burnedCashMovements.filter((e: any) => {
    if (searchCash.value) {
      const q = searchCash.value.toLowerCase()
      const match = (e.name && e.name.toLowerCase().includes(q)) ||
        (e.concept && e.concept.toLowerCase().includes(q)) ||
        (e.reference && e.reference.toLowerCase().includes(q)) ||
        (e.account && e.account.toLowerCase().includes(q)) ||
        (e.observation && e.observation.toLowerCase().includes(q))
      if (!match) return false
    }
    if (cashFilterMovement.value) {
      const m = (e.movement || '').toLowerCase()
      if (cashFilterMovement.value === 'Ingreso' && m !== 'ingreso') return false
      if (cashFilterMovement.value === 'Egreso' && m !== 'egreso') return false
    }
    if (cashFilterMonth.value && e.date) {
      if (!e.date.startsWith(cashFilterMonth.value)) return false
    }
    return true
  })
  filtered.forEach((entry: any) => {
    const ref = entry.reference || 'Sin referencia'
    if (!groups[ref]) groups[ref] = []
    groups[ref].push(entry)
  })
  return groups
}

const cashAllGroups = computed(() => getCashGroups())

const cashTotalPages = computed(() => {
  const keys = Object.keys(cashAllGroups.value)
  return Math.max(1, Math.ceil(keys.length / cashPageSize.value))
})

const cashPaginatedGroups = computed(() => {
  const allKeys = Object.keys(cashAllGroups.value)
  const start = (cashPage.value - 1) * cashPageSize.value
  const pageKeys = allKeys.slice(start, start + cashPageSize.value)
  const result: Record<string, any[]> = {}
  for (const key of pageKeys) {
    result[key] = cashAllGroups.value[key]
  }
  return result
})

function getOrderForInventory(orderId: number) {
  return burnedOrders.find((o: any) => o.id === orderId) || null
}

function getInvoiceForInventory(invoiceId: number | null) {
  if (!invoiceId) return null
  return invoices.find((i: any) => i.id === invoiceId) || null
}

async function loadInventoryFromBackend() {
  try {
    const response = await sparePartService.getAll()
    const spareParts = response.data?.spareParts || []
    // Mapear campos del backend a los del frontend
    const mapped = spareParts.map((sp: any) => ({
      id: sp.id,
      orderId: sp.workOrderId,
      invoiceId: sp.invoiceId || null,
      date: sp.createdAt ? sp.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
      activity: sp.item,
      quantity: sp.quantity,
      unitCost: sp.unitCost,
      cost: sp.totalCost,
      unitValue: sp.unitValue,
      invoiceValue: sp.totalInvoice,
      netProfit: sp.gananciaNeta,
    }))
    burnedInventory.splice(0, burnedInventory.length, ...mapped)
  } catch (error) {
    console.error('Error cargando inventario desde el backend:', error)
    alert('Error cargando inventario. Por favor intenta de nuevo.')
  }
}

async function addInventoryItem() {
  const activity = String(newInventoryItem.activity || '').trim()
  if (!newInventoryItem.date || !activity || !newInventoryItem.orderId) {
    alert('Fecha, actividad y orden son obligatorios')
    return
  }
  calculateNetProfit(false)
  const invId = newInventoryItem.invoiceId || null
  try {
    const response = await sparePartService.create({
      workOrderId: Number(newInventoryItem.orderId),
      invoiceId: invId,
      item: activity,
      quantity: Number(newInventoryItem.quantity) || 1,
      unitCost: Number(newInventoryItem.unitCost) || 0,
      unitValue: Number(newInventoryItem.unitValue) || 0,
      totalCost: Number(newInventoryItem.cost) || 0,
      totalInvoice: Number(newInventoryItem.invoiceValue) || 0,
      gananciaNeta: Number(newInventoryItem.netProfit) || 0,
    })
    const created = response.data
    if (created) {
      burnedInventory.push({
        id: created.id,
        orderId: created.workOrderId,
        invoiceId: created.invoiceId || null,
        date: created.createdAt ? created.createdAt.slice(0, 10) : newInventoryItem.date,
        activity: created.item,
        quantity: created.quantity,
        unitCost: created.unitCost,
        cost: created.totalCost,
        unitValue: created.unitValue,
        invoiceValue: created.totalInvoice,
        netProfit: created.gananciaNeta,
      })
    }
    // Si está anclado a una factura, agregar el item a la factura
    if (invId) {
      const invoice = invoices.find((i: any) => i.id === invId)
      if (invoice) {
        if (!Array.isArray(invoice.items)) invoice.items = []
        invoice.items.push({
          description: activity,
          qty: Number(newInventoryItem.quantity) || 1,
          price: Number(newInventoryItem.unitValue) || 0,
          isLabor: false,
        })
      }
    }
    newInventoryItem.orderId = 0
    newInventoryItem.invoiceId = null
    newInventoryItem.invoiceItemIndex = null
    newInventoryItem.date = new Date().toISOString().slice(0, 10)
    newInventoryItem.activity = ''
    newInventoryItem.quantity = 1
    newInventoryItem.unitCost = 0
    newInventoryItem.cost = 0
    newInventoryItem.unitValue = 0
    newInventoryItem.invoiceValue = 0
    newInventoryItem.netProfit = 0
    showCreateInventory.value = false
  } catch (error: any) {
    alert('Error guardando repuesto: ' + (error.message || 'Error desconocido'))
  }
}

function editInventoryItem(item: any) {
  editingInventory.value = { ...item }
  showEditInventory.value = true
}

async function saveEditedInventory() {
  if (!editingInventory.value) return
  const idx = burnedInventory.findIndex((entry: any) => entry.id === editingInventory.value.id)
  if (idx === -1) return
  calculateNetProfit(true)
  const invId = editingInventory.value.invoiceId || null
  const oldItem = burnedInventory[idx]
  try {
    await sparePartService.update(editingInventory.value.id, {
      workOrderId: Number(editingInventory.value.orderId) || 0,
      invoiceId: invId,
      item: String(editingInventory.value.activity || '').trim(),
      quantity: Number(editingInventory.value.quantity) || 1,
      unitCost: Number(editingInventory.value.unitCost) || 0,
      unitValue: Number(editingInventory.value.unitValue) || 0,
      totalCost: Number(editingInventory.value.cost) || 0,
      totalInvoice: Number(editingInventory.value.invoiceValue) || 0,
      gananciaNeta: Number(editingInventory.value.netProfit) || 0,
    })
    burnedInventory.splice(idx, 1, {
      ...editingInventory.value,
      orderId: Number(editingInventory.value.orderId) || 0,
      invoiceId: invId,
      quantity: Number(editingInventory.value.quantity) || 1,
      unitCost: Number(editingInventory.value.unitCost) || 0,
      cost: Number(editingInventory.value.cost) || 0,
      unitValue: Number(editingInventory.value.unitValue) || 0,
      invoiceValue: Number(editingInventory.value.invoiceValue) || 0,
      netProfit: Number(editingInventory.value.netProfit) || 0,
    })
    // Si está anclado a una factura, sincronizar el item en la factura
    if (invId) {
      const invoice = invoices.find((i: any) => i.id === invId)
      if (invoice) {
        if (!Array.isArray(invoice.items)) invoice.items = []
        // Si antes también estaba anclado a esta misma factura, actualizar el item existente
        if (oldItem && oldItem.invoiceId === invId) {
          const existingItem = invoice.items.find((it: any) => it.description === oldItem.activity)
          if (existingItem) {
            existingItem.description = editingInventory.value.activity
            existingItem.qty = Number(editingInventory.value.quantity) || 1
            existingItem.price = Number(editingInventory.value.unitValue) || 0
          } else {
            invoice.items.push({
              description: editingInventory.value.activity,
              qty: Number(editingInventory.value.quantity) || 1,
              price: Number(editingInventory.value.unitValue) || 0,
              isLabor: false,
            })
          }
        } else {
          // Si es nuevo en esta factura, agregarlo
          invoice.items.push({
            description: editingInventory.value.activity,
            qty: Number(editingInventory.value.quantity) || 1,
            price: Number(editingInventory.value.unitValue) || 0,
            isLabor: false,
          })
        }
      }
    }
    editingInventory.value = null
    showEditInventory.value = false
  } catch (error: any) {
    alert('Error actualizando repuesto: ' + (error.message || 'Error desconocido'))
  }
}

async function deleteInventoryItem(id: number) {
  if (!confirm('¿Eliminar este registro de inventario?')) return
  const invItem = burnedInventory.find((item: any) => item.id === id)
  try {
    await sparePartService.delete(id)
    const idx = burnedInventory.findIndex((item: any) => item.id === id)
    if (idx > -1) burnedInventory.splice(idx, 1)
    // Si estaba vinculado a una factura, quitar el item de la factura
    if (invItem?.invoiceId) {
      const invoice = invoices.find((i: any) => Number(i.id) === Number(invItem.invoiceId))
      if (invoice && Array.isArray(invoice.items)) {
        const updatedItems = invoice.items.filter((it: any) => String(it.description || '').trim().toLowerCase() !== String(invItem.activity || '').trim().toLowerCase())
        if (updatedItems.length !== invoice.items.length) {
          try {
            const payload = {
              items: updatedItems.map((it: any) => ({ description: it.description, qty: Number(it.qty) || 1, price: Number(it.price) || 0, isLabor: it.isLabor === true })),
              taxPct: invoice.applyTax === true,
              discount: Number(invoice.discount) || 0,
              retention: Number(invoice.retention) || 0,
              deposits: Array.isArray(invoice.deposits) ? invoice.deposits.map((d: any) => ({ amount: Number(d.amount) || 0, date: d.date || '', method: d.method || '' })) : [],
              formaDePago: invoice.payments || invoice.formaDePago || '',
              status: invoice.status || 'Pendiente',
              notes: invoice.notes || ''
            }
            const res = await invoiceService.update(invoice.id, payload)
            const invoiceIdx = invoices.findIndex((i: any) => i.id === invoice.id)
            if (invoiceIdx > -1) {
              invoices.splice(invoiceIdx, 1, enrichInvoiceFromRelatedData(mapInvoiceFromApi(res.data)))
            }
          } catch (e: any) {
            console.error('Error actualizando factura al eliminar repuesto:', e)
            alert('Repuesto eliminado, pero no se pudo actualizar la factura: ' + (e.message || 'Error desconocido'))
          }
        }
      }
    }
  } catch (error: any) {
    alert('Error eliminando repuesto: ' + (error.message || 'Error desconocido'))
  }
}

async function createInventoryFromInvoice(invoice: any) {
  if (!invoice || !invoice.items || !invoice.items.length) {
    alert('La factura no tiene items para generar inventario')
    return
  }
  const orderId = invoice.orderId || null
  if (!orderId) {
    alert('La factura no está vinculada a una orden')
    return
  }

  let count = 0
  for (const item of invoice.items) {
    if (item.description && item.price > 0) {
      try {
        const response = await sparePartService.create({
          workOrderId: Number(orderId),
          invoiceId: invoice.id,
          item: item.description,
          quantity: Number(item.qty) || 1,
          unitCost: 0,
          unitValue: Number(item.price) || 0,
          totalCost: 0,
          totalInvoice: Number(item.price) * (Number(item.qty) || 1),
          gananciaNeta: 0,
        })
        const created = response.data
        if (created) {
          burnedInventory.push({
            id: created.id,
            orderId: created.workOrderId,
            invoiceId: created.invoiceId || null,
            date: created.createdAt ? created.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
            activity: created.item,
            quantity: created.quantity,
            unitCost: created.unitCost,
            cost: created.totalCost,
            unitValue: created.unitValue,
            invoiceValue: created.totalInvoice,
            netProfit: created.gananciaNeta,
          })
        }
        count++
      } catch (error: any) {
        console.error('Error creando repuesto desde factura:', error)
      }
    }
  }

  if (count > 0) {
    alert(`Se generaron ${count} registros de inventario desde la factura`)
  } else {
    alert('No se generaron registros de inventario')
  }
}

function populateFromInvoiceItem(isEditing: boolean = false) {
  const target = isEditing ? editingInventory.value : newInventoryItem
  if (!target || !target.invoiceId || target.invoiceItemIndex === null) return

  const invoice = invoices.find((i: any) => i.id === target.invoiceId)
  if (!invoice || !Array.isArray(invoice.items)) return

  const item = invoice.items[target.invoiceItemIndex]
  if (!item) return

  target.activity = item.description || target.activity || ''
  target.unitValue = Number(item.price) || 0
  target.quantity = Number(item.qty) || target.quantity || 1
  onUnitValueChange(isEditing)
}

function onUnitCostChange(isEditing: boolean) {
  const target = isEditing ? editingInventory.value : newInventoryItem
  if (!target) return
  const qty = Number(target.quantity) || 1
  const unitCost = Number(target.unitCost) || 0
  target.cost = unitCost * qty
  calculateNetProfit(isEditing)
}

function onTotalCostChange(isEditing: boolean) {
  const target = isEditing ? editingInventory.value : newInventoryItem
  if (!target) return
  const qty = Number(target.quantity) || 1
  const cost = Number(target.cost) || 0
  target.unitCost = qty > 0 ? cost / qty : 0
  calculateNetProfit(isEditing)
}

function onUnitValueChange(isEditing: boolean) {
  const target = isEditing ? editingInventory.value : newInventoryItem
  if (!target) return
  const qty = Number(target.quantity) || 1
  const unitValue = Number(target.unitValue) || 0
  target.invoiceValue = unitValue * qty
  calculateNetProfit(isEditing)
}

function onTotalValueChange(isEditing: boolean) {
  const target = isEditing ? editingInventory.value : newInventoryItem
  if (!target) return
  const qty = Number(target.quantity) || 1
  const invoiceValue = Number(target.invoiceValue) || 0
  target.unitValue = qty > 0 ? invoiceValue / qty : 0
  calculateNetProfit(isEditing)
}

function onQuantityChange(isEditing: boolean) {
  const target = isEditing ? editingInventory.value : newInventoryItem
  if (!target) return
  const qty = Number(target.quantity) || 1
  const unitCost = Number(target.unitCost) || 0
  const unitValue = Number(target.unitValue) || 0
  target.cost = unitCost * qty
  target.invoiceValue = unitValue * qty
  calculateNetProfit(isEditing)
}

function calculateNetProfit(isEditing: boolean) {
  const target = isEditing ? editingInventory.value : newInventoryItem
  if (!target) return
  const cost = Number(target.cost) || 0
  const invoiceValue = Number(target.invoiceValue) || 0
  target.netProfit = Math.max(0, invoiceValue - cost)
}

const burnedEmployees = reactive<Employee[]>([])

const mapEmployeeToRow = (employee: Employee): Employee => ({
  ...employee,
  status: employee.status || 'Activo',
  activeOrders: employee.activeOrders ?? 0,
})

const loadBurnedEmployees = async (name?: string) => {
  try {
    const response = await employeeService.getEmployees(name ? { name } : undefined)
    const employees = response.data?.employees?.map(mapEmployeeToRow) || []
    burnedEmployees.splice(0, burnedEmployees.length, ...employees)
  } catch (error) {
    console.error('Error cargando empleados desde el backend', error)
    burnedEmployees.splice(0, burnedEmployees.length)
  }
}

const showCreateEmployee = ref(false)
const showEditEmployee = ref(false)
const newEmployee = reactive<Employee>({
  id: 0,
  name: '',
  role: '',
  specialty: '',
  email: '',
  phone: '',
  status: 'Activo',
  entryDate: '',
  activeOrders: 0,
  notes: '',
})
const editingEmployee: Ref<Employee | null> = ref(null)

const addBurnedEmployee = async () => {
  if (!newEmployee.name.trim() || !newEmployee.role.trim()) return

  const payload: CreateEmployeeRequest = {
    name: newEmployee.name.trim(),
    role: newEmployee.role.trim(),
    specialty: newEmployee.specialty?.trim() || undefined,
    email: newEmployee.email?.trim() || undefined,
    phone: newEmployee.phone?.trim() || undefined,
    status: newEmployee.status?.trim() || 'Activo',
    entryDate: newEmployee.entryDate ? new Date(newEmployee.entryDate).toISOString() : undefined,
    notes: newEmployee.notes?.trim() || undefined,
  }

  try {
    const response = await employeeService.createEmployee(payload)
    if (response.data) {
      burnedEmployees.unshift(mapEmployeeToRow(response.data))
      newEmployee.name = ''
      newEmployee.role = ''
      newEmployee.specialty = ''
      newEmployee.email = ''
      newEmployee.phone = ''
      newEmployee.status = 'Activo'
      newEmployee.entryDate = ''
      newEmployee.activeOrders = 0
      newEmployee.notes = ''
      showCreateEmployee.value = false
    }
  } catch (error) {
    console.error('Error creando empleado en el backend', error)
  }
}

function editEmployee(emp: Employee) {
  editingEmployee.value = mapEmployeeToRow({ ...emp })
  showEditEmployee.value = true
}

const saveEditedEmployee = async () => {
  if (!editingEmployee.value) return
  const employee = { ...editingEmployee.value }

  const payload: UpdateEmployeeRequest = {
    name: employee.name.trim(),
    role: employee.role.trim(),
    specialty: employee.specialty?.trim() || undefined,
    email: employee.email?.trim() || undefined,
    phone: employee.phone?.trim() || undefined,
    status: employee.status?.trim() || 'Activo',
    entryDate: employee.entryDate ? new Date(employee.entryDate).toISOString() : undefined,
    notes: employee.notes?.trim() || undefined,
  }

  try {
    const response = await employeeService.updateEmployee(employee.id, payload)
    if (response.data) {
      const updatedEmployee = mapEmployeeToRow(response.data)
      const idx = burnedEmployees.findIndex((e) => e.id === employee.id)
      if (idx > -1) burnedEmployees.splice(idx, 1, updatedEmployee)
      editingEmployee.value = null
      showEditEmployee.value = false
    }
  } catch (error) {
    console.error('Error actualizando empleado en el backend', error)
  }
}

const deleteEmployee = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar este empleado?')) return

  try {
    await employeeService.deleteEmployee(id)
    const idx = burnedEmployees.findIndex((e) => e.id === id)
    if (idx > -1) burnedEmployees.splice(idx, 1)
  } catch (error) {
    console.error('Error eliminando empleado en el backend', error)
  }
}



const burnedAgenda = reactive<any[]>([])

const mapApiAppointmentToDashboardAgenda = (appointment: any) => {
  return {
    id: appointment?.id,
    date: appointment?.date ? String(appointment.date).slice(0, 10) : '',
    time: appointment?.date ? String(appointment.date).slice(11, 19) : '09:00',
    vehicle: appointment?.plate || '',
    client: appointment?.client || '',
    service: appointment?.subject || '',
    plate: appointment?.plate || '',
    subject: appointment?.subject || '',
    createdAt: appointment?.createdAt,
    updatedAt: appointment?.updatedAt,
    backendId: appointment?.id,
  }
}

const refreshAppointments = async () => {
  try {
    const response = await appointmentService.getAppointments()
    const apiAppointments = response.data?.appointments || []
    burnedAgenda.splice(0, burnedAgenda.length, ...apiAppointments.map(mapApiAppointmentToDashboardAgenda))
  } catch (error) {
    console.error('No se pudieron cargar las citas', error)
    burnedAgenda.splice(0, burnedAgenda.length)
  }
}

// ---------- Calendar / Agenda helpers ----------
const calendarDate = ref(new Date())
const showScheduleModal = ref(false)
const scheduleSelectedOrderId = ref(null)
const scheduleDateIso = ref('')
const scheduleTime = ref('09:00')
const editingAgendaId = ref<number | null>(null)
const showOrderViewModal = ref(false)
const orderViewData = ref<any>(null)
const orderPlateSearch = ref('')
const showPlateDropdownCreate = ref(false)
const showPlateDropdownEdit = ref(false)

const newCalendarOrder = reactive({ vehicle: '', client: '', serviceType: '', mechanic: '', total: 0, diagnosis: '' })

function openOrderViewModal(orderId: number | string) {
  const order = burnedOrders.find((o: any) => o.id === orderId)
  if (!order) return
  orderViewData.value = order
  showOrderViewModal.value = true
}

function selectPlateForOrder(vehicle: any, isEditing: boolean) {
  orderPlateSearch.value = vehicle.plate
  if (isEditing && editingOrder.value) {
    editingOrder.value.vehicle = vehicle.plate
    editingOrder.value.client = vehicle.client || ''
    editingOrder.value.vehicleType = vehicle.vehicleType || ''
    editingOrder.value.vehicleModel = vehicle.model || ''
  } else {
    newOrder.vehicle = vehicle.plate
    newOrder.client = vehicle.client || ''
    newOrder.vehicleType = vehicle.vehicleType || ''
    newOrder.vehicleModel = vehicle.model || ''
  }
  showPlateDropdownCreate.value = false
  showPlateDropdownEdit.value = false
}

function blurPlateDropdown(isEditing: boolean) {
  setTimeout(() => {
    if (isEditing) showPlateDropdownEdit.value = false
    else showPlateDropdownCreate.value = false
  }, 150)
}

function getOrderPlateOptions(selectedPlate = '') {
  const query = orderPlateSearch.value.trim().toLowerCase()
  const filtered = burnedVehicles.filter((vehicle: any) => {
    if (!query) return true
    return [vehicle.plate, vehicle.client, vehicle.brand, vehicle.model]
      .some((value) => String(value || '').toLowerCase().includes(query))
  }).slice(0, 20)

  if (selectedPlate) {
    const exists = filtered.some((vehicle: any) => vehicle.plate === selectedPlate)
    if (!exists) {
      const selected = burnedVehicles.find((vehicle: any) => vehicle.plate === selectedPlate)
      if (selected) return [selected, ...filtered]
    }
  }

  return filtered
}

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const monthDays = computed(() => {
  const year = calendarDate.value.getFullYear()
  const month = calendarDate.value.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  // start on Sunday before/at first day
  const start = new Date(firstOfMonth)
  start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay())
  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    days.push({ date: d, iso, day: d.getDate(), inMonth: d.getMonth() === month })
  }
  return days
})

const eventsByDate = computed(() => {
  const map: Record<string, any[]> = {}
  // 1) Citas manuales (burnedAgenda) - VERDE
  if (Array.isArray(burnedAgenda)) {
    burnedAgenda.forEach((a: any) => {
      if (a.date) {
        const iso = String(a.date).slice(0, 10)
        map[iso] = map[iso] || []
        map[iso].push({ type: 'agenda', ...a })
      }
    })
  }
  // 2) Órdenes de trabajo (burnedOrders) - AZUL
  // NO mostrar órdenes en estado "Entregado"
  if (Array.isArray(burnedOrders)) {
    burnedOrders.forEach((o: any) => {
      const st = normalizeText(String(o.status || '')).trim()
      // Filtrar órdenes entregadas - NO aparecen en calendario
      if (st === 'entregado' || st === 'entregada') return
      const iso = o.deliveryDate ? String(o.deliveryDate).slice(0, 10) : null
      if (iso) {
        map[iso] = map[iso] || []
        map[iso].push({ type: 'order', id: o.id, client: o.client, vehicle: o.vehicle, mechanic: o.mechanic, serviceType: o.serviceType, time: o.deliveryTime || o.time || '' })
      }
    })
  }
  return map
})

const unassignedActiveWorkOrders = computed(() => {
  const arr = (activeWorkOrders && 'value' in activeWorkOrders) ? activeWorkOrders.value : activeWorkOrders
  return Array.isArray(arr) ? arr.filter((o: any) => !o.deliveryDate) : []
})

const agendaItemsForMonth = computed(() => {
  const month = calendarDate.value.getMonth()
  const year = calendarDate.value.getFullYear()
  if (!Array.isArray(burnedAgenda)) return []
  return burnedAgenda.filter((a: any) => {
    if (!a.date) return false
    const d = new Date(a.date)
    return d.getFullYear() === year && d.getMonth() === month
  })
})

const activeOrdersForMonth = computed(() => {
  const month = calendarDate.value.getMonth()
  const year = calendarDate.value.getFullYear()
  const arr = (activeWorkOrders && 'value' in activeWorkOrders) ? activeWorkOrders.value : activeWorkOrders
  if (!Array.isArray(arr)) return []
  return arr.filter((o: any) => {
    // Solo órdenes con fecha de entrega (deliveryDate)
    if (!o.deliveryDate) return false
    const d = new Date(o.deliveryDate)
    return d.getFullYear() === year && d.getMonth() === month
  })
})

function prevMonth() {
  const d = new Date(calendarDate.value)
  d.setMonth(d.getMonth() - 1)
  calendarDate.value = d
}

function nextMonth() {
  const d = new Date(calendarDate.value)
  d.setMonth(d.getMonth() + 1)
  calendarDate.value = d
}

function openScheduleModal(orderId = null, dateIso = '') {
  editingAgendaId.value = null
  scheduleSelectedOrderId.value = orderId || null
  scheduleDateIso.value = dateIso || (new Date()).toISOString().slice(0, 10)
  scheduleTime.value = '09:00'
  Object.assign(newCalendarOrder, { vehicle: '', client: '', serviceType: '', mechanic: '', total: 0, diagnosis: '' })
  showScheduleModal.value = true
}

function openEditAgendaModal(agendaItem: any) {
  if (!agendaItem || !agendaItem.id) return
  editingAgendaId.value = agendaItem.id
  scheduleSelectedOrderId.value = null
  scheduleDateIso.value = agendaItem.date || (new Date()).toISOString().slice(0, 10)
  scheduleTime.value = agendaItem.time || '09:00'
  newCalendarOrder.vehicle = agendaItem.vehicle || ''
  newCalendarOrder.client = agendaItem.client || ''
  newCalendarOrder.serviceType = agendaItem.service || ''
  showScheduleModal.value = true
}

function confirmSchedule() {
  const id = scheduleSelectedOrderId.value
  const dateIso = scheduleDateIso.value
  const time = scheduleTime.value || '09:00'
  if (!dateIso) { alert('Selecciona fecha'); return }
  if (editingAgendaId.value) {
    updateAgendaEvent(editingAgendaId.value, dateIso, { ...newCalendarOrder })
  } else if (id) {
    scheduleOrder(id, dateIso, time)
  } else {
    createAgendaEvent(dateIso, time, { ...newCalendarOrder })
  }
  showScheduleModal.value = false
  editingAgendaId.value = null
}

async function deleteEditingAgenda() {
  if (!editingAgendaId.value) return
  if (!confirm('¿Eliminar esta cita?')) return
  await deleteAgendaEvent(editingAgendaId.value)
  showScheduleModal.value = false
  editingAgendaId.value = null
}

async function createAgendaEvent(dateIso: string, time: string, payload: any) {
  try {
    const isoDateTime = `${dateIso}T${time || '09:00'}:00.000Z`
    const request = {
      date: isoDateTime,
      plate: String(payload.vehicle || ''),
      client: String(payload.client || ''),
      subject: String(payload.serviceType || payload.service || '')
    }
    await appointmentService.createAppointment(request)
    await refreshAppointments()
    Object.assign(newCalendarOrder, { vehicle: '', client: '', serviceType: '', mechanic: '', total: 0, diagnosis: '' })
    alert('Cita creada: ' + dateIso + ' ' + time)
  } catch (error) {
    console.error('No se pudo crear la cita', error)
    alert(error instanceof Error ? error.message : 'No se pudo crear la cita')
  }
}

async function updateAgendaEvent(appointmentId: number, dateIso: string, payload: any) {
  try {
    const time = payload.time || '09:00'
    const isoDateTime = `${dateIso}T${time}:00.000Z`
    const request = {
      date: isoDateTime,
      plate: String(payload.vehicle || ''),
      client: String(payload.client || ''),
      subject: String(payload.serviceType || '')
    }
    await appointmentService.updateAppointment(appointmentId, request)
    await refreshAppointments()
    alert('Cita actualizada')
  } catch (error) {
    console.error('No se pudo actualizar la cita', error)
    alert(error instanceof Error ? error.message : 'No se pudo actualizar la cita')
  }
}

async function deleteAgendaEvent(appointmentId: number) {
  if (!confirm('¿Eliminar esta cita?')) return
  try {
    await appointmentService.deleteAppointment(appointmentId)
    await refreshAppointments()
    alert('Cita eliminada')
  } catch (error) {
    console.error('No se pudo eliminar la cita', error)
    alert(error instanceof Error ? error.message : 'No se pudo eliminar la cita')
  }
}

async function scheduleOrder(orderId: number | string, dateIso: string, time: string) {
  try {
    await workOrderService.updateWorkOrder(Number(orderId), { deliveryDate: dateIso })
    await refreshWorkOrders()
    alert('Orden agendada: ' + dateIso + ' ' + time)
  } catch (error) {
    console.error('No se pudo agendar la orden', error)
    alert('No se pudo agendar la orden')
  }
}

function autoScheduleOrder(orderId: number | string) {
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    const count = (eventsByDate.value[iso] || []).length
    if (count < 4) { // permitir hasta 4 eventos por día
      scheduleOrder(orderId, iso, '09:00')
      return
    }
  }
  alert('No se encontró hueco en los próximos 30 días')
}

async function createOrderFromCalendar(dateIso: string, time: string, payload: any) {
  // payload: vehicle, client, serviceType, mechanic, total, diagnosis
  try {
    const request = buildWorkOrderPayload({ ...payload, deliveryDate: dateIso })
    const response = await workOrderService.createWorkOrder(request)
    await refreshWorkOrders()
    Object.assign(newCalendarOrder, { vehicle: '', client: '', serviceType: '', mechanic: '', total: 0, diagnosis: '' })
    alert('Orden creada y agendada: #' + (response.data?.id || 'N/A'))
  } catch (error) {
    console.error('No se pudo crear la orden desde el calendario', error)
    alert(error instanceof Error ? error.message : 'No se pudo crear la orden')
  }
}


// Servicios
const burnedServices = [
  { id: 1, name: 'Cambio de aceite', description: 'Cambio de aceite y filtro', price: 80000, status: 'Disponible' },
  { id: 2, name: 'Revisión general', description: 'Inspección completa del vehículo', price: 120000, status: 'Disponible' },
  { id: 3, name: 'Reparación de frenos', description: 'Reparación y ajuste de sistema de frenos', price: 250000, status: 'Disponible' }
]

// Categorías
const burnedCategories = [
  { id: 1, name: 'Mantenimiento', description: 'Servicios de mantenimiento regular' },
  { id: 2, name: 'Reparaciones', description: 'Reparaciones y correcciones' },
  { id: 3, name: 'Diagnóstico', description: 'Servicios de diagnóstico' }
]

// Reportes
const burnedReports = {
  ingresos: [
    { fecha: '2026-04-08', total: 350000 },
    { fecha: '2026-04-09', total: 220000 }
  ],
  servicios: [
    { nombre: 'Cambio de aceite', vendidos: 10 },
    { nombre: 'Revisión frenos', vendidos: 7 }
  ],
  clientes: [
    { nombre: 'Juan Pérez', visitas: 5 },
    { nombre: 'María Gómez', visitas: 2 }
  ]
}

const burnedCashMovements = reactive<any[]>([])

async function loadCashFromBackend() {
  try {
    const response = await moneyMovementService.getAll()
    const movements = response.data?.moneyMovements || []
    const mapped = movements.map((mm: any) => ({
      id: mm.id,
      date: mm.createdAt ? mm.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
      reference: mm.reference || '',
      name: mm.name,
      concept: mm.concept,
      movement: mm.movement === 'INGRESO' ? 'Ingreso' : mm.movement === 'EGRESO' ? 'Egreso' : mm.movement,
      amount: mm.amount,
      account: mm.account,
      observation: mm.observation || '',
    }))
    burnedCashMovements.splice(0, burnedCashMovements.length, ...mapped)
  } catch (error) {
    console.error('Error cargando movimientos de caja desde el backend:', error)
    alert('Error cargando movimientos de caja. Por favor intenta de nuevo.')
  }
}

const showCreateCash = ref(false)
const showEditCash = ref(false)
const newCashItem = reactive({
  date: new Date().toISOString().slice(0, 10),
  reference: '',
  name: '',
  concept: '',
  movement: 'Ingreso',
  amount: 0,
  account: 'Banco',
  observation: ''
})
const editingCash = ref<any | null>(null)

async function addCashItem() {
  const name = String(newCashItem.name || '').trim()
  const concept = String(newCashItem.concept || '').trim()
  if (!newCashItem.date || !name || !concept) return
  try {
    const response = await moneyMovementService.create({
      reference: newCashItem.reference || '',
      name,
      concept,
      movement: newCashItem.movement === 'Ingreso' ? 'INGRESO' : 'EGRESO',
      amount: Number(newCashItem.amount) || 0,
      account: newCashItem.account || 'Banco',
      observation: newCashItem.observation || '',
    })
    const created = response.data
    if (created) {
      burnedCashMovements.push({
        id: created.id,
        date: created.createdAt ? created.createdAt.slice(0, 10) : newCashItem.date,
        reference: created.reference || '',
        name: created.name,
        concept: created.concept,
        movement: created.movement === 'INGRESO' ? 'Ingreso' : 'Egreso',
        amount: created.amount,
        account: created.account,
        observation: created.observation || '',
      })
    }
    newCashItem.date = new Date().toISOString().slice(0, 10)
    newCashItem.reference = ''
    newCashItem.name = ''
    newCashItem.concept = ''
    newCashItem.movement = 'Ingreso'
    newCashItem.amount = 0
    newCashItem.account = 'Banco'
    newCashItem.observation = ''
    showCreateCash.value = false
  } catch (error: any) {
    alert('Error guardando movimiento de caja: ' + (error.message || 'Error desconocido'))
  }
}

function editCashItem(item: any) {
  editingCash.value = { ...item }
  showEditCash.value = true
}

async function saveEditedCash() {
  if (!editingCash.value) return
  const idx = burnedCashMovements.findIndex((entry: any) => entry.id === editingCash.value.id)
  if (idx === -1) return
  try {
    await moneyMovementService.update(editingCash.value.id, {
      reference: editingCash.value.reference || '',
      name: String(editingCash.value.name || '').trim(),
      concept: String(editingCash.value.concept || '').trim(),
      movement: editingCash.value.movement === 'Ingreso' ? 'INGRESO' : 'EGRESO',
      amount: Number(editingCash.value.amount) || 0,
      account: editingCash.value.account || 'Banco',
      observation: editingCash.value.observation || '',
    })
    burnedCashMovements.splice(idx, 1, {
      ...editingCash.value,
      amount: Number(editingCash.value.amount) || 0,
    })
    editingCash.value = null
    showEditCash.value = false
  } catch (error: any) {
    alert('Error actualizando movimiento de caja: ' + (error.message || 'Error desconocido'))
  }
}

async function deleteCashItem(id: number) {
  if (!confirm('¿Eliminar este movimiento de caja?')) return
  try {
    await moneyMovementService.delete(id)
    const idx = burnedCashMovements.findIndex((item: any) => item.id === id)
    if (idx > -1) burnedCashMovements.splice(idx, 1)
  } catch (error: any) {
    alert('Error eliminando movimiento de caja: ' + (error.message || 'Error desconocido'))
  }
}

// Asegurar que la pestaña activa siempre sea válida
if (!tabs.some((t) => t.id === activeTab.value)) {
  activeTab.value = tabs[0].id
}

// Computed
const availableProductsCount = computed(() =>
  availableProducts.value.length
)

const totalValue = computed(() =>
  sales.value
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + sale.totalAmount, 0)
)

// Computed para estadísticas de ventas
const completedSales = computed(() =>
  sales.value.filter(s => s.status === 'completed')
)

const totalRevenue = computed(() =>
  completedSales.value.reduce((sum, s) => sum + s.totalAmount, 0)
)

const pendingSales = computed(() =>
  sales.value.filter(s => s.status === 'pending').length
)

const totalSalesCount = computed(() => sales.value.length)

// Métricas del taller
const uniqueClientsCount = computed(() => {
  const emails = new Set<string>()

  // Priorizar emails de ventas (si existen)
  sales.value.forEach((sale) => {
    const candidate = (sale.customerEmail || sale.customerName || '').toString().trim().toLowerCase()
    if (candidate) emails.add(candidate)
  })

  // Incluir clientes quemados (registro manual)
  if (Array.isArray(burnedClients.value)) {
    burnedClients.value.forEach((c: any) => {
      const candidate = (c.email || c.name || '').toString().trim().toLowerCase()
      if (candidate) emails.add(candidate)
    })
  }

  // Incluir resúmenes calculados por si hay nombres/otros
  clientSummaries.value.forEach((c) => {
    const candidate = (c.email || c.name || '').toString().trim().toLowerCase()
    if (candidate) emails.add(candidate)
  })

  return emails.size
})

const servicesCount = computed(() => {
  const names = new Set<string>()
  if (Array.isArray(products.value)) {
    products.value.forEach((p: any) => {
      if (p && p.name) names.add(p.name.toString().trim().toLowerCase())
    })
  }
  if (Array.isArray(burnedServices)) {
    burnedServices.forEach((s: any) => {
      if (s && s.name) names.add(s.name.toString().trim().toLowerCase())
    })
  }
  // Si no hay ninguno, devolver 0
  return names.size
})

const vehiclesCount = computed(() => {
  // Contar placas únicas combinando órdenes y vehículos registrados
  const plates = new Set<string>()
  if (Array.isArray(burnedOrders)) {
    burnedOrders.forEach((o: any) => {
      if (o.vehicle) plates.add(String(o.vehicle))
    })
  }
  if (Array.isArray(burnedVehicles)) {
    burnedVehicles.forEach((v: any) => {
      if (v.plate) plates.add(String(v.plate))
    })
  }
  if (plates.size > 0) return plates.size

  // Si hay ventas reales, devolver el total de ventas
  if (totalSalesCount.value > 0) return totalSalesCount.value

  return 0
})

const reportsCount = computed(() => burnedReports.servicios.length)

// --- Dashboard computed values ---
const dashboardBiweeklySeries = computed(() => {
  try {
    if (!Array.isArray(burnedCashMovements) || burnedCashMovements.length === 0) return []
    const buckets = new Map<string, number>()
    burnedCashMovements.forEach((m: any) => {
      if (m.movement !== 'Ingreso') return
      const d = new Date(m.date)
      if (Number.isNaN(d.getTime())) return
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const half = d.getDate() <= 15 ? 'Q1' : 'Q2'
      const key = `${monthKey} ${half}`
      buckets.set(key, (buckets.get(key) || 0) + (Number(m.amount) || 0))
    })
    return Array.from(buckets.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label))
  } catch (e) {
    return []
  }
})

const dashboardBiweeklyLast = computed(() => {
  const s = dashboardBiweeklySeries.value
  return s.length ? s[s.length - 1].value : 0
})

const orderStatusCounts = computed(() => {
  const map: Record<string, number> = {}
  if (Array.isArray(burnedOrders)) {
    burnedOrders.forEach((o: any) => {
      const st = (o.status || 'Pendiente').toString()
      map[st] = (map[st] || 0) + 1
    })
  }
  return map
})

const ordersTotal = computed(() => Array.isArray(burnedOrders) ? burnedOrders.length : 0)
const ordersCompletedCount = computed(() => {
  let c = 0
  Object.keys(orderStatusCounts.value).forEach(k => {
    if (k.toLowerCase().includes('termin') || k.toLowerCase().includes('complet')) c += orderStatusCounts.value[k]
  })
  return c
})
const ordersOpenCount = computed(() => ordersTotal.value - ordersCompletedCount.value)

const ordersCompletedPercent = computed(() => {
  if (ordersTotal.value === 0) return 0
  return Math.round((ordersCompletedCount.value / ordersTotal.value) * 100)
})

// Estadísticas de órdenes: Activas vs Terminadas/Entregadas
const ordersActiveCount = computed(() => {
  let c = 0
  Object.keys(orderStatusCounts.value).forEach(k => {
    const kl = normalizeText(k)
    if (kl === 'recepcion' || kl === 'diagnostico' || kl === 'en proceso' || kl === 'en-proceso' || kl === 'pendiente') {
      c += orderStatusCounts.value[k]
    }
  })
  return c
})

const ordersFinishedCount = computed(() => {
  let c = 0
  Object.keys(orderStatusCounts.value).forEach(k => {
    const kl = normalizeText(k)
    if (kl === 'terminado' || kl === 'terminada' || kl === 'entregado' || kl === 'entregada' || kl === 'completado') {
      c += orderStatusCounts.value[k]
    }
  })
  return c
})

// Helper: filtrar por período de métricas principales
function matchesDashboardMetricsPeriod(dateStr: string | null | undefined): boolean {
  const mode = dashboardMetricsFilterMode.value
  const hasFilter = (mode === 'month' && dashboardMetricsMonth.value) ||
    (mode === 'range' && (dashboardMetricsDateFrom.value || dashboardMetricsDateTo.value)) ||
    (mode === 'biweekly' && dashboardMetricsBiweekly.value)
  // Si no hay filtro activo, incluir todo (incluso sin fecha)
  if (!hasFilter) return true
  // Si hay filtro pero no hay fecha, excluir
  if (!dateStr) return false
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return false
  if (mode === 'month') {
    const month = dashboardMetricsMonth.value
    const d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    return d === month
  }
  if (mode === 'range') {
    const from = dashboardMetricsDateFrom.value
    const to = dashboardMetricsDateTo.value
    const fromDate = from ? new Date(from + 'T00:00:00') : null
    const toDate = to ? new Date(to + 'T23:59:59') : null
    if (fromDate && date < fromDate) return false
    if (toDate && date > toDate) return false
    return true
  }
  if (mode === 'biweekly') {
    const bw = dashboardMetricsBiweekly.value
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const quincena = day <= 15 ? 'Q1' : 'Q2'
    const periodStr = `${year}-${String(month).padStart(2, '0')} ${quincena}`
    return periodStr === bw
  }
  return true
}

// Métricas principales filtradas por período
const filteredOrdersActiveCount = computed(() => {
  if (!Array.isArray(burnedOrders)) return 0
  return burnedOrders.filter((o: any) => {
    if (!matchesDashboardMetricsPeriod(o.createdAt || o.date)) return false
    const st = normalizeText(String(o.status || '')).trim()
    return st === 'recepcion' || st === 'diagnostico' || st === 'en proceso' || st === 'en-proceso' || st === 'pendiente' || st === 'terminado' || st === 'terminada'
  }).length
})

const filteredOrdersDeliveredCount = computed(() => {
  if (!Array.isArray(burnedOrders)) return 0
  return burnedOrders.filter((o: any) => {
    if (!matchesDashboardMetricsPeriod(o.createdAt || o.date)) return false
    const st = normalizeText(String(o.status || '')).trim()
    return st === 'entregado' || st === 'entregada'
  }).length
})

const filteredVehiclesCount = computed(() => {
  if (!Array.isArray(burnedOrders)) return 0
  const plates = new Set<string>()
  burnedOrders.forEach((o: any) => {
    if (matchesDashboardMetricsPeriod(o.createdAt || o.date) && o.vehicle) {
      plates.add(String(o.vehicle))
    }
  })
  return plates.size
})

const filteredTotalInvoices = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => matchesDashboardMetricsPeriod(inv.createdAt)).length
})

const filteredWithoutDepositInvoices = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => {
    if (!matchesDashboardMetricsPeriod(inv.createdAt)) return false
    const st = String(inv.status || '').toLowerCase().trim()
    return !(st === 'pagada' || st === 'pagado' || st === 'completed' || st === 'completada' || st === 'abonada' || st === 'abonado')
  }).length
})

const filteredWithDepositInvoices = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => {
    if (!matchesDashboardMetricsPeriod(inv.createdAt)) return false
    const st = String(inv.status || '').toLowerCase().trim()
    return st === 'abonada' || st === 'abonado'
  }).length
})

const filteredPaidInvoices = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => {
    if (!matchesDashboardMetricsPeriod(inv.createdAt)) return false
    const st = String(inv.status || '').toLowerCase().trim()
    return st === 'pagada' || st === 'pagado' || st === 'completed' || st === 'completada'
  }).length
})

const filteredTotalInvoiced = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => matchesDashboardMetricsPeriod(inv.createdAt))
    .reduce((sum: number, inv: any) => sum + Number(inv.total || 0), 0)
})

const filteredTotalPaid = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => {
    if (!matchesDashboardMetricsPeriod(inv.createdAt)) return false
    const st = String(inv.status || '').toLowerCase().trim()
    return st === 'pagada' || st === 'pagado' || st === 'completed' || st === 'completada'
  }).reduce((sum: number, inv: any) => sum + Number(inv.total || 0), 0)
})

const filteredDepositInvoices = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => {
    if (!matchesDashboardMetricsPeriod(inv.createdAt)) return false
    const st = String(inv.status || '').toLowerCase().trim()
    return st === 'abonado' || st === 'abonada'
  }).length
})

const filteredTotalDeposits = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => matchesDashboardMetricsPeriod(inv.createdAt))
    .reduce((sum: number, inv: any) => sum + invoiceDepositTotal(inv), 0)
})

const filteredTotalDepositsOnly = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => {
    if (!matchesDashboardMetricsPeriod(inv.createdAt)) return false
    const st = String(inv.status || '').toLowerCase().trim()
    return st === 'abonado' || st === 'abonada'
  }).reduce((sum: number, inv: any) => sum + invoiceDepositTotal(inv), 0)
})

const filteredTotalPaidOnly = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => {
    if (!matchesDashboardMetricsPeriod(inv.createdAt)) return false
    const st = String(inv.status || '').toLowerCase().trim()
    return st === 'pagada' || st === 'pagado' || st === 'completed' || st === 'completada'
  }).reduce((sum: number, inv: any) => sum + Number(inv.total || 0), 0)
})

const filteredTotalBalance = computed(() => {
  if (!Array.isArray(invoices)) return 0
  return invoices.filter((inv: any) => matchesDashboardMetricsPeriod(inv.createdAt))
    .reduce((sum: number, inv: any) => sum + Math.max(0, Number(inv.total || 0) - invoiceDepositTotal(inv)), 0)
})

// Estadísticas de Facturación
const invoiceStats = computed(() => {
  const invList = Array.isArray(invoices) ? invoices : []
  const total = invList.length
  let pending = 0
  let paid = 0
  let deposit = 0
  let pendingValue = 0
  let paidValue = 0
  let depositValue = 0
  let balanceValue = 0
  invList.forEach((inv: any) => {
    const st = String(inv.status || '').toLowerCase().trim()
    const val = Number(inv.total || 0)
    const dep = invoiceDepositTotal(inv)
    if (st === 'pagada' || st === 'pagado' || st === 'completed' || st === 'completada') {
      paid += 1
      paidValue += val
    } else if (st === 'abonada' || st === 'abonado') {
      deposit += 1
      depositValue += dep
      balanceValue += Math.max(0, val - dep)
    } else {
      pending += 1
      pendingValue += val
    }
  })
  return { total, pending, paid, deposit, totalValue: pendingValue + paidValue + depositValue + balanceValue, pendingValue, paidValue, depositValue, balanceValue }
})

const invoicePieSeries = computed(() => [invoiceStats.value.paid, invoiceStats.value.pending, invoiceStats.value.deposit])
const invoicePieOptions = computed(() => ({
  labels: ['Pagadas', 'Pendientes', 'Abonadas'],
  colors: ['#22c55e', '#f59e0b', '#3b82f6'],
  legend: { show: true, position: 'bottom', labels: { colors: 'var(--brand-accent-alt)' } },
  dataLabels: { enabled: true, style: { colors: ['#fff'] } },
  chart: { background: 'transparent', foreColor: 'var(--brand-accent-alt)' },
  plotOptions: { pie: { expandOnClick: false } }
}))

// Filtrar órdenes activas e histórico (activo = status !== 'Entregado')
const activeWorkOrders = computed(() => {
  if (!Array.isArray(burnedOrders)) return []
  return burnedOrders.filter((o: any) => {
    const st = (o.status || '').toString().toLowerCase().trim()
    return st !== 'entregado'
  })
})

const filteredActiveWorkOrders = computed(() => {
  if (!searchOrders.value) return activeWorkOrders.value
  const q = searchOrders.value.toLowerCase().trim()
  return activeWorkOrders.value.filter((o: any) => {
    return (o.client && o.client.toLowerCase().includes(q)) ||
      (o.vehicle && o.vehicle.toLowerCase().includes(q)) ||
      (o.status && o.status.toLowerCase().includes(q)) ||
      (o.mechanic && o.mechanic.toLowerCase().includes(q)) ||
      (o.observations && o.observations.toLowerCase().includes(q)) ||
      (o.id && String(o.id).includes(q))
  })
})

const activeOrdersByEmployee = computed(() => {
  const map = new Map<string, number>()
  activeWorkOrders.value.forEach((order: any) => {
    const key = String(order.mechanic || '').trim().toLowerCase()
    if (!key) return
    map.set(key, (map.get(key) || 0) + 1)
  })
  return map
})

function getEmployeeActiveOrders(employee: Employee | null | undefined): number {
  if (!employee) return 0
  const key = String(employee.name || '').trim().toLowerCase()
  if (!key) return 0
  return activeOrdersByEmployee.value.get(key) || 0
}

const historicalWorkOrders = computed(() => {
  if (!Array.isArray(burnedOrders)) return []
  return burnedOrders.filter((o: any) => {
    const st = (o.status || '').toString().toLowerCase().trim()
    return st === 'entregado'
  })
})

const warrantyPerformance = computed(() => {
  const map = new Map<string, { name: string; role: string; warrantyOrders: number; warrantyValue: number }>()
  historicalWorkOrders.value.forEach((order: any) => {
    const warrantyUnits = Number(order.garantia || 0)
    if (warrantyUnits <= 0) return
    const technicianName = String(order.mechanic || '').trim()
    if (!technicianName) return
    const key = technicianName.toLowerCase()
    const current = map.get(key) || { name: technicianName, role: '', warrantyOrders: 0, warrantyValue: 0 }
    const employee = Array.isArray(burnedEmployees) ? burnedEmployees.find((e: any) => String(e.name || '').trim().toLowerCase() === key) : null
    current.role = employee?.role || current.role || 'Técnico'
    current.warrantyOrders += 1
    current.warrantyValue += Number(order.total || 0)
    map.set(key, current)
  })
  return Array.from(map.values()).sort((a, b) => b.warrantyOrders - a.warrantyOrders)
})

const warrantyMaxOrders = computed(() => {
  if (!warrantyPerformance.value.length) return 1
  return Math.max(...warrantyPerformance.value.map((row: any) => row.warrantyOrders)) || 1
})

const warrantyPerformanceEnhanced = computed(() => {
  return warrantyPerformance.value.map((row: any) => ({
    ...row,
    warrantyPct: Math.round(((row.warrantyOrders || 0) / warrantyMaxOrders.value) * 100),
    warrantyValueFormatted: Number(row.warrantyValue || 0).toLocaleString('es-CO')
  }))
})

const payrollViewMode = ref('employee')
const payrollBiweeklyFilter = ref('')
const payrollEmployeeFilter = ref('')
const dashboardSelectedMonth = ref('')
const dashboardFilterPeriod = ref('')
const dashboardDateFrom = ref('')
const dashboardDateTo = ref('')
const dashboardOrderMonth = ref('')
const dashboardOrderDateFrom = ref('')
const dashboardOrderDateTo = ref('')
const dashboardInvoiceMonth = ref('')
const dashboardInvoiceDateFrom = ref('')
const dashboardInvoiceDateTo = ref('')
const dashboardMetricsFilterMode = ref<'month'|'range'|'biweekly'>('month')
const dashboardMetricsMonth = ref('')
const dashboardMetricsDateFrom = ref('')
const dashboardMetricsDateTo = ref('')
const dashboardMetricsBiweekly = ref('')
const expandedPayrollEmployees = reactive<Set<number>>(new Set())

function togglePayrollEmployee(employeeId: number) {
  if (expandedPayrollEmployees.has(employeeId)) {
    expandedPayrollEmployees.delete(employeeId)
  } else {
    expandedPayrollEmployees.add(employeeId)
  }
}

const payrollRows = computed(() => {
  return burnedEmployees
    .filter((employee: any) => {
      if (!payrollEmployeeFilter.value) return true
      return String(employee.name || '').toLowerCase() === String(payrollEmployeeFilter.value).toLowerCase()
    })
    .map((employee: any) => {
      const mechanicKey = String(employee.name || '').trim().toLowerCase()
      const employeeInvoices = invoices.filter((inv: any) => {
        const advisorName = String(inv.advisorName || '').trim().toLowerCase()
        if (!mechanicKey || advisorName !== mechanicKey || Number(inv.total || 0) <= 0) return false
        if (!payrollBiweeklyFilter.value) return true
        const date = inv.createdAt ? new Date(inv.createdAt) : new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const quincena = day <= 15 ? '1' : '2'
        const period = `${year}-${String(month).padStart(2, '0')} Q${quincena}`
        return period === payrollBiweeklyFilter.value
      })
      const grossTotal = employeeInvoices.reduce((sum: number, inv: any) => {
        const laborTotal = Array.isArray(inv.items)
          ? inv.items.reduce((s: number, it: any) => s + (it.isLabor ? (Number(it.qty) || 0) * (Number(it.price) || 0) : 0), 0)
          : 0
        return sum + laborTotal
      }, 0)
      const totalDiscount = employeeInvoices.reduce((sum: number, inv: any) => sum + invoicePayrollDiscount(inv), 0)
      const technicianShare = Math.max(0, grossTotal * 0.5 - totalDiscount)

      return {
        id: employee.id,
        name: employee.name,
        role: employee.role,
        ordersCount: employeeInvoices.length,
        grossTotal,
        totalDiscount,
        technicianShare,
        workshopShare: grossTotal * 0.5,
        orders: employeeInvoices.map((inv: any) => {
          const laborTotal = Array.isArray(inv.items)
            ? inv.items.reduce((s: number, it: any) => s + (it.isLabor ? (Number(it.qty) || 0) * (Number(it.price) || 0) : 0), 0)
            : 0
          const discount = invoicePayrollDiscount(inv)
          return {
            id: inv.id,
            vehicle: inv.vehicle || '-',
            client: inv.client || '-',
            createdDate: inv.createdAt ? String(inv.createdAt).slice(0, 10) : '',
            total: Number(inv.total) || 0,
            laborTotal,
            discount,
            technicianShare: Math.max(0, laborTotal * 0.5 - discount)
          }
        })
      }
    })
})

const payrollTotals = computed(() => {
  const grossTotal = payrollRows.value.reduce((sum: number, row: any) => sum + (Number(row.grossTotal) || 0), 0)
  const totalDiscount = payrollRows.value.reduce((sum: number, row: any) => sum + (Number(row.totalDiscount) || 0), 0)
  return {
    grossTotal,
    totalDiscount,
    technicianShare: payrollRows.value.reduce((sum: number, row: any) => sum + (Number(row.technicianShare) || 0), 0),
    workshopShare: grossTotal * 0.5,
    ordersCount: payrollRows.value.reduce((sum: number, row: any) => sum + (Number(row.ordersCount) || 0), 0)
  }
})

const payrollBiweeklyPeriods = computed(() => {
  const periods = new Set<string>()
  invoices.forEach((inv: any) => {
    const laborTotal = Array.isArray(inv.items)
      ? inv.items.reduce((s: number, it: any) => s + (it.isLabor ? (Number(it.qty) || 0) * (Number(it.price) || 0) : 0), 0)
      : 0
    if (laborTotal <= 0) return
    const date = inv.createdAt ? new Date(inv.createdAt) : new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const quincena = day <= 15 ? '1' : '2'
    periods.add(`${year}-${String(month).padStart(2, '0')} Q${quincena}`)
  })
  return Array.from(periods).sort().reverse()
})

const payrollBiweeklyRows = computed(() => {
  const groups: Record<string, { period: string; ordersCount: number; grossTotal: number; totalDiscount: number; technicianShare: number; workshopShare: number }> = {}

  invoices.forEach((inv: any) => {
    const laborTotal = Array.isArray(inv.items)
      ? inv.items.reduce((s: number, it: any) => s + (it.isLabor ? (Number(it.qty) || 0) * (Number(it.price) || 0) : 0), 0)
      : 0
    if (laborTotal <= 0) return

    const date = inv.createdAt ? new Date(inv.createdAt) : new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const quincena = day <= 15 ? '1' : '2'
    const period = `${year}-${String(month).padStart(2, '0')} Q${quincena}`

    if (payrollBiweeklyFilter.value && period !== payrollBiweeklyFilter.value) return

    const discount = invoicePayrollDiscount(inv)
    if (!groups[period]) {
      groups[period] = { period, ordersCount: 0, grossTotal: 0, totalDiscount: 0, technicianShare: 0, workshopShare: 0 }
    }
    groups[period].ordersCount += 1
    groups[period].grossTotal += laborTotal
    groups[period].totalDiscount += discount
    groups[period].technicianShare = Math.max(0, groups[period].grossTotal * 0.5 - groups[period].totalDiscount)
    groups[period].workshopShare = groups[period].grossTotal * 0.5
  })

  return Object.values(groups).sort((a, b) => b.period.localeCompare(a.period))
})

// UI state y helpers para crear/editar/eliminar órdenes
const showCreateOrder = ref(false)
const showEditOrder = ref(false)
const editingOrder: Ref<any | null> = ref(null)
const newOrder = reactive({ vehicle: '', client: '', status: 'Recepción', serviceType: '', services: [] as string[], parts: [] as string[], mechanic: '', mileage: null as number | null, total: 0, diagnosis: '', observations: '', garantia: 0, createdDate: '', deliveryDate: '', gases: false, escaner: false, showTechnicianInPdf: true, vehicleType: '', vehicleModel: '' })

// Estado para manejo de 'Tipo de servicio' como lista
const newServiceItem = ref('')
const editingServiceItem = ref('')

function addNewService() {
  const v = String(newServiceItem.value || '').trim()
  if (!v) return
  if (!Array.isArray(newOrder.services)) newOrder.services = []
  newOrder.services.push(v)
  newServiceItem.value = ''
}

function removeNewService(idx: number) {
  if (!Array.isArray(newOrder.services)) return
  newOrder.services.splice(idx, 1)
}

function addEditingService() {
  const v = String(editingServiceItem.value || '').trim()
  if (!v || !editingOrder || !editingOrder.value) return
  if (!Array.isArray(editingOrder.value.services)) editingOrder.value.services = []
  editingOrder.value.services.push(v)
  editingServiceItem.value = ''
}

function removeEditingService(idx: number) {
  if (!editingOrder || !editingOrder.value || !Array.isArray(editingOrder.value.services)) return
  editingOrder.value.services.splice(idx, 1)
}

// Estado para impresión / exportar a PDF
const printOrder: Ref<any | null> = ref(null)

// Modal para ver servicios de una orden
const showServicesModal: Ref<boolean> = ref(false)
const servicesModalOrder: Ref<any | null> = ref(null)

function openServicesModal(order: any) {
  servicesModalOrder.value = { ...order }
  // asegurar array
  if (!Array.isArray(servicesModalOrder.value.services)) servicesModalOrder.value.services = servicesModalOrder.value.serviceType ? [String(servicesModalOrder.value.serviceType)] : []
  showServicesModal.value = true
}

function closeServicesModal() {
  showServicesModal.value = false
  servicesModalOrder.value = null
}

// Modal para ver diagnóstico de una orden
const showDiagnosisModal: Ref<boolean> = ref(false)
const diagnosisModalOrder: Ref<any | null> = ref(null)

function openDiagnosisModal(order: any) {
  diagnosisModalOrder.value = { ...order }
  showDiagnosisModal.value = true
}

function closeDiagnosisModal() {
  showDiagnosisModal.value = false
  diagnosisModalOrder.value = null
}

function exportOrderPdf(order: any) {
  // Imprimir en la misma pestaña usando un iframe oculto con HTML mínimo.
  try {
    // Preparar datos
    const showTech = order.showTechnicianInPdf !== false
    const vehicleObj = (Array.isArray(burnedVehicles) ? burnedVehicles.find((v: any) => v.plate === order.vehicle) : null) || null
    const issueDate = order.createdDate ? (new Date(order.createdDate).toLocaleDateString()) : (new Date().toLocaleDateString())
    const servicesHtml = (Array.isArray(order.services) && order.services.length)
      ? `<ul style="margin:0;padding-left:18px">${order.services.map((s: string) => `<li style="margin-bottom:6px">${s}</li>`).join('')}</ul>`
      : (order.serviceType ? `<p>${order.serviceType}</p>` : '-')
    const partsText = (Array.isArray(order.parts) && order.parts.length) ? ('<div style="margin-top:8px;font-size:0.95rem;color:#334155">Repuestos: ' + order.parts.join(', ') + '</div>') : ''
    const flagsHtml = ((order.gases ? '<div style="margin-top:8px;font-size:0.95rem;color:#334155">Gases: Sí</div>' : '') + (order.escaner ? '<div style="margin-top:4px;font-size:0.95rem;color:#334155">Escaner: Sí</div>' : ''))
    const observationsHtml = (String(order.observations || '').trim() || partsText) ? (`<div>${String(order.observations || '').trim().replace(/\n/g, '<br/>')}</div>${partsText}`) : '-'
    const techHtml = showTech ? `<div class="so-meta-card"><span>Técnico</span><strong>${order.mechanic || '-'}</strong></div>` : ''
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Job's Car | Taller Automotriz en Bogotá - Mantenimiento y Reparación de Vehículos</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>
      @page { margin: 12mm; }
      body { font-family: Arial, Helvetica, sans-serif; color:#111827; background:#ffffff; margin:0; padding:0; }
      .service-order-card { max-width: 920px; margin: 10mm auto; padding: 0; box-sizing: border-box; background: #ffffff; border-radius: 12px; overflow: visible; box-shadow: 0 6px 22px rgba(16,24,40,0.06); border: 1px solid rgba(0,0,0,0.06); }
      .so-topbar { display:flex; justify-content:space-between; align-items:stretch; gap:16px; padding: 18px 20px; background: transparent; color:#111827; border-top-left-radius:12px; border-top-right-radius:12px; }
      .so-brand { display:flex; align-items:center; gap:14px; min-width:0; }
      .so-logo { width:140px; height:96px; flex:0 0 auto; display:inline-flex; align-items:center; justify-content:center; }
      .so-logo img { width:100%; height:100%; object-fit:contain; display:block; }
      .so-brand-copy { min-width:0; }
      .so-kicker { margin:0 0 4px 0; font-size:9pt; letter-spacing: .16em; text-transform:uppercase; color:#9ca3af; }
      .so-brand-copy h1 { margin:0; font-size:22pt; line-height:1.02; color:#9ca3af; font-weight:800; }
      .so-subtitle { margin:4px 0 0 0; font-size:10pt; color:#9ca3af; }
      .so-number { align-self:center; text-align:right; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.22); padding: 12px 16px; border-radius: 14px; min-width: 200px; display:flex; flex-direction:column; gap:8px; }
      .so-number { align-self:center; text-align:right; background: transparent; border: none; padding: 8px 12px; border-radius: 10px; min-width: 160px; display:flex; flex-direction:column; gap:6px; }
      .so-number .meta { display:flex; justify-content:space-between; gap:12px; align-items:center; }
      .so-number span { display:block; font-size:9pt; text-transform:uppercase; letter-spacing:.12em; color:#9ca3af; }
      .so-number strong { display:block; margin-top:4px; font-size:18pt; line-height:1; color:#6b7280; }
      .so-number .date { font-size:10pt; color:#9ca3af; }
      .so-meta-grid { display:grid; grid-template-columns: ${showTech ? '1fr 1.35fr 0.75fr' : '1fr 1fr'}; gap:12px; padding: 18px 24px 0 24px; }
      .so-meta-card { border:1px solid #e6e9ef; background:#f7f7f9; border-radius:14px; padding:12px 14px; }
      .so-meta-card span { display:block; font-size:9pt; text-transform:uppercase; letter-spacing:.08em; color:#64748b; margin-bottom:6px; }
      .so-meta-card strong { display:block; font-size:11pt; color:#0f172a; line-height:1.25; }
      .so-section-grid { display:grid; grid-template-columns: 1.4fr 1fr; gap:12px; padding: 18px 24px 24px 24px; }
      .so-panel { border:1px solid #e2e8f0; border-radius:16px; background:#fff; overflow: visible; }
      .so-panel-wide { grid-column: 1 / -1; }
      .so-panel-title { padding: 11px 14px; background: #f1f5f9; color:#0f172a; font-size:9.5pt; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
      .so-panel-body { padding: 14px; font-size:12pt; line-height:1.6; color:#1e293b; white-space: pre-wrap; }
    </style></head><body>
      <div class="service-order-card">
        <div class="so-topbar">
          <div class="so-brand">
            <img class="so-logo" src="${location.origin}/images/logobn.png" alt="Jobs Car logo" />
            <div class="so-brand-copy">
              <p class="so-kicker">Orden de servicio</p>
              <h1>JOB'S CAR</h1>
              <p class="so-subtitle">Centro automotriz</p>
            </div>
          </div>
          <div class="so-number">
            <div class="meta"><div style="text-align:left"><span class="date">Fecha emisión</span><strong class="date">${issueDate}</strong></div><div style="text-align:right"><span>Orden</span><strong>#${order.id}</strong></div></div>
          </div>
        </div>
        <div class="so-meta-grid">
          <div class="so-meta-card"><span>Cliente</span><strong>${order.client || '-'}</strong></div>
          <div class="so-meta-card"><span>Vehículo</span><strong>${order.vehicle || '-'}${vehicleObj ? ((vehicleObj.brand ? ' · ' + vehicleObj.brand : '') + (vehicleObj.model ? ' · ' + vehicleObj.model : '')) : ''}</strong></div>
          ${techHtml}
        </div>
        <div class="so-section-grid">
          <div class="so-panel so-panel-wide">
            <div class="so-panel-title">Trabajo a realizar</div>
            <div class="so-panel-body">${servicesHtml}${flagsHtml}</div>
          </div>
          <div class="so-panel so-panel-wide">
            <div class="so-panel-title">Observaciones</div>
            <div class="so-panel-body">${observationsHtml}</div>
          </div>
        </div>
      </div>
    </body></html>`

    const iframe = document.createElement('iframe') as HTMLIFrameElement
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.style.visibility = 'hidden'
    iframe.style.zIndex = '-1'
    document.body.appendChild(iframe)

    const cleanup = () => {
      try { if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe) } catch (e) { /* noop */ }
    }

    const onLoaded = () => {
      try {
        iframe.contentWindow?.focus()
        // Llamar a print() desde el contexto del iframe (misma pestaña)
        iframe.contentWindow?.print()
      } catch (e) {
        // Fallback: usar el mecanismo inline existente
        printOrder.value = { ...order }
        nextTick(() => window.print())
      } finally {
        // Esperar un poco antes de limpiar para no interrumpir el diálogo de impresión
        setTimeout(cleanup, 1000)
      }
    }

    try {
      const supportsSrcdoc = typeof (iframe as any).srcdoc !== 'undefined'
      if (supportsSrcdoc) {
        ; (iframe as any).srcdoc = html
        iframe.onload = onLoaded
        } else {
          const doc = iframe.contentDocument ?? iframe.contentWindow?.document ?? null
          if (doc) {
            doc.open()
            doc.write(html)
            doc.close()
            iframe.onload = onLoaded
            setTimeout(onLoaded, 2000)
          } else {
          // Ultimo recurso: fallback
          printOrder.value = { ...order }
          nextTick(() => window.print())
          cleanup()
        }
      }
    } catch (e) {
      printOrder.value = { ...order }
      nextTick(() => window.print())
      cleanup()
    }
  } catch (err) {
    printOrder.value = { ...order }
    nextTick(() => window.print())
  }
}

function clearPrintOrder() {
  printOrder.value = null
  printInvoice.value = null
}

onMounted(async () => {
  window.addEventListener('afterprint', clearPrintOrder)
  // Limpiar datos antiguos de localStorage (ya no se usan, ahora van al backend)
  localStorage.removeItem('burnedInventory')
  await loadInventoryFromBackend()
  await loadCashFromBackend()
  await refreshWorkOrders()
  await refreshAppointments()
})

onBeforeUnmount(() => {
  window.removeEventListener('afterprint', clearPrintOrder)
})

const nextOrderId = (): number => {
  const ids = Array.isArray(burnedOrders) ? burnedOrders.map((o: any) => Number(o.id)).filter(n => Number.isFinite(n)) : []
  return ids.length ? Math.max(...ids) + 1 : 1
}

function resolveVehicleIdByPlate(plate: string): number | null {
  const normalizedPlate = String(plate || '').trim().toUpperCase()
  if (!normalizedPlate || !Array.isArray(burnedVehicles)) return null
  const vehicle = burnedVehicles.find((entry: any) => String(entry.plate || '').trim().toUpperCase() === normalizedPlate)
  return vehicle?.id ? Number(vehicle.id) : null
}

function resolveMechanicIdByName(name: string): number | null {
  const normalizedName = String(name || '').trim().toLowerCase()
  if (!normalizedName || !Array.isArray(burnedEmployees)) return null
  const employee = burnedEmployees.find((entry: any) => String(entry.name || '').trim().toLowerCase() === normalizedName)
  return employee?.id ? Number(employee.id) : null
}

function buildWorkOrderPayload(source: any): any {
  const vehicleId = Number(source?.vehicleId || resolveVehicleIdByPlate(source?.vehicle || ''))
  const mechanicId = resolveMechanicIdByName(source?.mechanic || '')

  if (!vehicleId) {
    throw new Error('No se pudo resolver el vehículo para la orden')
  }

  return {
    vehicleId,
    mechanicId: mechanicId || undefined,
    status: String(source?.status || 'Recepción'),
    services: getOrderServiceChips(source),
    gases: Boolean(source?.gases),
    escaner: Boolean(source?.escaner),
    observations: String(source?.observations || ''),
    diagnosis: String(source?.diagnosis || ''),
    deliveryDate: source?.deliveryDate || undefined,
    garantia: Number(source?.garantia) || 0,
    total: Number(source?.total) || 0,
    vehicleType: String(source?.vehicleType || '')
  }
}

function openCreateOrder() {
  Object.assign(newOrder, { vehicle: '', client: '', status: 'Recepción', serviceType: '', services: [], parts: [], mechanic: '', mileage: null, total: 0, diagnosis: '', observations: '', garantia: 0, gases: false, escaner: false, showTechnicianInPdf: true, vehicleType: '' })
  orderPlateSearch.value = ''
  newServiceItem.value = ''
  showCreateOrder.value = true
}

async function createOrder() {
  try {
    const payload = buildWorkOrderPayload(newOrder)
    const response = await workOrderService.createWorkOrder(payload)
    if (response.data?.id) {
      setShowTechPdf(response.data.id, newOrder.showTechnicianInPdf !== false)
    }
    await refreshWorkOrders()
    Object.assign(newOrder, { vehicle: '', client: '', status: 'Recepción', serviceType: '', services: [], parts: [], mechanic: '', mileage: null, total: 0, diagnosis: '', observations: '', garantia: 0, createdDate: '', deliveryDate: '', gases: false, escaner: false, showTechnicianInPdf: true, vehicleType: '', vehicleModel: '' })
    showCreateOrder.value = false
  } catch (error) {
    console.error('No se pudo crear la orden', error)
    alert(error instanceof Error ? error.message : 'No se pudo crear la orden')
  }
}

function editOrder(order: any) {
  editingOrder.value = { ...order }
  // asegurar campos booleanos para edición
  if (typeof editingOrder.value.gases === 'undefined') editingOrder.value.gases = false
  if (typeof editingOrder.value.escaner === 'undefined') editingOrder.value.escaner = false
  if (typeof editingOrder.value.showTechnicianInPdf === 'undefined') editingOrder.value.showTechnicianInPdf = true
  if (typeof editingOrder.value.vehicleType === 'undefined') editingOrder.value.vehicleType = ''
  if (typeof editingOrder.value.vehicleModel === 'undefined') editingOrder.value.vehicleModel = ''
  // Resolver nombre del técnico si viene como ID o está vacío
  if ((!editingOrder.value.mechanic || /^\d+$/.test(String(editingOrder.value.mechanic))) && editingOrder.value.mechanicId) {
    const found = burnedEmployees.find((e: any) => String(e.id) === String(editingOrder.value.mechanicId))
    if (found?.name) editingOrder.value.mechanic = found.name
  }
  // asegurar que exista el array services para la edición
  if (!editingOrder.value.services || !Array.isArray(editingOrder.value.services)) {
    editingOrder.value.services = editingOrder.value.serviceType ? [String(editingOrder.value.serviceType)] : []
  }
  editingServiceItem.value = ''
  orderPlateSearch.value = String(order?.vehicle || '')
  showEditOrder.value = true
}

async function saveEditedOrder() {
  if (!editingOrder.value) return
  try {
    const payload = buildWorkOrderPayload(editingOrder.value)
    await workOrderService.updateWorkOrder(editingOrder.value.id, payload)
    setShowTechPdf(editingOrder.value.id, editingOrder.value.showTechnicianInPdf !== false)
    await refreshWorkOrders()
    showEditOrder.value = false
    editingOrder.value = null
  } catch (error) {
    console.error('No se pudo actualizar la orden', error)
    alert(error instanceof Error ? error.message : 'No se pudo actualizar la orden')
  }
}

async function deleteOrder(id: number) {
  if (!confirm('¿Estás seguro de eliminar esta orden?\n\n⚠️ Si tiene una factura asociada, también se eliminará.')) return
  try {
    await workOrderService.deleteWorkOrder(id)
    // Eliminar factura asociada si existe
    const existingInvoice = findInvoiceByOrderId(id)
    if (existingInvoice) {
      try {
        await invoiceService.delete(existingInvoice.id)
        const invoiceIdx = invoices.findIndex((inv: any) => inv.orderId === id)
        if (invoiceIdx > -1) invoices.splice(invoiceIdx, 1)
        console.log('✅ Factura asociada eliminada')
      } catch {
        console.warn('No se pudo eliminar la factura asociada, puede que ya no exista en el servidor')
      }
    }
    await refreshWorkOrders()
  } catch (error) {
    console.error('No se pudo eliminar la orden', error)
    alert('No se pudo eliminar la orden')
  }
}

function statusClass(status: string) {
  if (!status) return ''
  const s = status.toString().toLowerCase().trim()
  if (s.includes('recep') || s === 'recepción' || s === 'recepcion') return 'recepcion'
  if (s.includes('diagn') || s === 'diagnóstico' || s === 'diagnostico') return 'diagnostico'
  if (s.includes('en proceso') || s === 'en-proceso' || s.includes('proceso')) return 'en-proceso'
  if (s.includes('termin') || s === 'terminado') return 'terminado'
  if (s.includes('entreg') || s === 'entregado') return 'entregado'
  return s.replace(/\s+/g, '-')
}

function isOrderBillable(status: string): boolean {
  if (!status) return false
  const s = normalizeText(status.toString().trim())
  // Solo permitir facturar desde: En Proceso, Pendiente, Diagnóstico
  // No permitir facturar desde: Recepción, Terminado, Entregado
  return s === 'en proceso' || s === 'en-proceso' || s === 'pendiente' || s === 'diagnostico'
}

function getOrderServiceChips(order: any): string[] {
  const services = Array.isArray(order?.services)
    ? order.services.map((service: any) => String(service || '').trim()).filter(Boolean)
    : []

  if (services.length) return services

  const fallback = String(order?.serviceType || 'General').trim()
  return [fallback || 'General']
}

// Autocompletar cliente al seleccionar placa (crear)
watch(() => newOrder.vehicle, (val) => {
  try {
    const plateVal = val ? String(val).trim() : ''
    if (!plateVal) {
      // Si borró la placa, limpiar cliente para permitir elegir otra
      newOrder.client = ''
      newOrder.mileage = null
      return
    }
    const plate = plateVal.toUpperCase()
    const found = burnedVehicles.find((v: any) => (v.plate || '').toString().toUpperCase() === plate)
    if (found) {
      newOrder.client = found.client || ''
      newOrder.mileage = typeof found.km === 'number' ? found.km : Number(found.km) || 0
    }
  } catch (e) {
    // ignore
  }
})

// Autocompletar cliente al seleccionar placa (editar)
watch(() => (editingOrder && editingOrder.value ? editingOrder.value.vehicle : null), (val) => {
  try {
    if (!editingOrder || !editingOrder.value) return
    const plateVal = val ? String(val).trim() : ''
    if (!plateVal) {
      editingOrder.value.client = ''
      editingOrder.value.mileage = null
      return
    }
    const plate = plateVal.toUpperCase()
    const found = burnedVehicles.find((v: any) => (v.plate || '').toString().toUpperCase() === plate)
    if (found) {
      editingOrder.value.client = found.client || ''
      editingOrder.value.mileage = typeof found.km === 'number' ? found.km : Number(found.km) || 0
    }
  } catch (e) {
    // ignore
  }
})

const dashboardAlerts = computed(() => {
  const alerts: string[] = []
  try {
    const now = new Date()
    const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    if (Array.isArray(burnedClients)) {
      burnedClients.value.forEach((c: any) => {
        if (c.reminderDate) {
          const d = new Date(c.reminderDate)
          if (!isNaN(d.getTime()) && d <= in30) {
            const t = c.reminderType || (c.reminder || '').split(':')[0]
            alerts.push(`${t || 'Aviso'}: ${c.name} - ${formatShortDate(d)}`)
          }
        }
      })
    }
  } catch (e) {
    // ignore
  }
  return alerts
})

const techniciansPerformance = computed(() => {
  const totalOrdersEmp = (Array.isArray(burnedEmployees) ? burnedEmployees.reduce((s: number, e: any) => s + getEmployeeActiveOrders(e), 0) : 0) || 1
  return (Array.isArray(burnedEmployees) ? burnedEmployees.map((e: any) => ({
    name: e.name,
    orders: getEmployeeActiveOrders(e),
    income: Math.round((getEmployeeActiveOrders(e)) / totalOrdersEmp * (totalRevenue.value || 0))
  })) : [])
})

// Enhanced technicians data: percentage and formatted income
const techMaxOrders = computed(() => {
  if (!Array.isArray(burnedEmployees) || burnedEmployees.length === 0) return 1
  return Math.max(...burnedEmployees.map((e: any) => getEmployeeActiveOrders(e))) || 1
})

const techniciansPerformanceEnhanced = computed(() => {
  return techniciansPerformance.value.map((t: any) => ({
    ...t,
    ordersPct: Math.round(((t.orders || 0) / techMaxOrders.value) * 100),
    incomeFormatted: `$${(t.income || 0).toLocaleString()}`
  }))
})

const upcomingAppointments = computed(() => {
  if (!Array.isArray(burnedAgenda)) return []
  const now = new Date()
  return burnedAgenda
    .map((a: any) => ({ ...a }))
    .filter((a: any) => !a.date || new Date(a.date) >= now)
    .sort((a: any, b: any) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime())
    .slice(0, 5)
})

// Line chart points for ingresos
const lineChart = computed(() => {
  const series = dashboardBiweeklySeries.value
  const w = 320
  const h = 120
  if (!series.length) return { points: '', w, h }
  const vals = series.map(s => Number(s.value || 0))
  const max = Math.max(...vals, 1)
  const stepX = series.length > 1 ? w / (series.length - 1) : w
  const points = vals.map((v, i) => `${(i * stepX).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`).join(' ')
  return { points, w, h }
})

// Series & opciones para ApexCharts
const lineSeries = computed(() => [{
  name: 'Ingresos',
  data: dashboardBiweeklySeries.value.map((s: any) => Number(s.value || 0))
}])

const lineOptions = computed(() => ({
  chart: {
    id: 'biweekly-revenue',
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent',
    foreColor: 'var(--brand-accent-alt)'
  },
  xaxis: {
    categories: dashboardBiweeklySeries.value.map((s: any) => s.label),
    labels: { style: { colors: 'var(--brand-accent-alt)' } }
  },
  yaxis: {
    labels: { style: { colors: 'var(--brand-accent-alt)' } }
  },
  stroke: { curve: 'smooth' },
  colors: ['#60a5fa'],
  markers: { size: 4, strokeColors: '#60a5fa', strokeWidth: 2 },
  tooltip: { theme: 'dark', y: { formatter: (val: any) => `$${Number(val).toLocaleString()}` } },
  grid: { show: true, borderColor: 'rgba(255,255,255,0.04)', strokeDashArray: 4 }
}))

const donutSeries = computed(() => [ordersCompletedCount.value, Math.max(0, ordersTotal.value - ordersCompletedCount.value)])
const donutOptions = computed(() => {
  const total = donutSeries.value.reduce((a: number, b: number) => a + b, 0)
  return {
    chart: { type: 'donut', toolbar: { show: false }, background: 'transparent', foreColor: 'var(--brand-accent-alt)' },
    labels: ['Completadas', 'Abiertas'],
    colors: ['#16a34a', '#2563eb'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: { show: true, fontSize: '14px', color: 'var(--brand-accent-alt)' },
            value: { show: true, fontSize: '18px', color: 'var(--brand-primary-contrast)', formatter: (v: any) => `${v}` },
            total: { show: true, label: 'Total', formatter: () => `${total}` }
          }
        }
      }
    },
    legend: { show: true, position: 'right', labels: { colors: 'var(--brand-accent-alt)' } },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark', y: { formatter: (val: any) => `${val}` } }
  }
})

// Colors used by the custom donut legend (match donut colors)
const donutLegendColors = ['#16a34a', '#2563eb']

const revenueVsCosts = computed(() => {
  const rev = burnedCashMovements
    .filter((m: any) => m.movement === 'Ingreso')
    .reduce((sum: number, m: any) => sum + (Number(m.amount) || 0), 0)
  const egresos = burnedCashMovements
    .filter((m: any) => m.movement === 'Egreso')
    .reduce((sum: number, m: any) => sum + (Number(m.amount) || 0), 0)
  const nomina = payrollTotals.value.workshopShare || 0
  const cost = egresos + nomina
  const total = rev + cost || 1
  return { rev, cost, revPct: Math.round((rev / total) * 100), costPct: Math.round((cost / total) * 100) }
})

const dashboardAvailableMonths = computed(() => {
  const months = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })
    })
  }
  return months
})

const dashboardAvailablePeriods = computed(() => {
  const periods = [{ value: '', label: 'Todos los períodos' }]
  const now = new Date()

  // Meses
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthValue = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })
    periods.push({ value: monthValue, label: `Mes: ${monthLabel}` })
  }

  // Quincenas (últimas 6)
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), 1)
    d.setMonth(d.getMonth() - i)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const q1 = `${year}-${String(month).padStart(2, '0')} Q1`
    const q2 = `${year}-${String(month).padStart(2, '0')} Q2`
    const monthName = d.toLocaleDateString('es-CO', { month: 'long' })
    periods.push({ value: q1, label: `Quincena: ${monthName} Q1 (1-15)` })
    periods.push({ value: q2, label: `Quincena: ${monthName} Q2 (16-31)` })
  }

  return periods
})

function matchesPeriod(dateStr: string | null | undefined, period: string): boolean {
  if (!period || !dateStr) return true
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return false
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  // Es mes
  if (!period.includes(' Q')) {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`
    return monthStr === period
  }

  // Es quincena
  const quincena = day <= 15 ? 'Q1' : 'Q2'
  const periodStr = `${year}-${String(month).padStart(2, '0')} ${quincena}`
  return periodStr === period
}

function matchesDateRange(dateStr: string | null | undefined, from: string, to: string): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  let fromDate: Date | null = null
  let toDate: Date | null = null
  if (from) {
    // Si es formato mes (YYYY-MM), usar primer día del mes
    if (from.length === 7) {
      const [y, m] = from.split('-').map(Number)
      fromDate = new Date(y, m - 1, 1, 0, 0, 0)
    } else {
      fromDate = new Date(from + 'T00:00:00')
    }
  }
  if (to) {
    // Si es formato mes (YYYY-MM), usar último día del mes
    if (to.length === 7) {
      const [y, m] = to.split('-').map(Number)
      toDate = new Date(y, m, 0, 23, 59, 59)
    } else {
      toDate = new Date(to + 'T23:59:59')
    }
  }
  if (fromDate && date < fromDate) return false
  if (toDate && date > toDate) return false
  return true
}

// Estadísticas de Órdenes filtradas por período
const filteredOrdersForDashboard = computed(() => {
  const period = dashboardFilterPeriod.value
  const orderMonth = dashboardOrderMonth.value
  const dateFrom = dashboardOrderDateFrom.value
  const dateTo = dashboardOrderDateTo.value
  if (!period && !orderMonth && !dateFrom && !dateTo) return burnedOrders
  return burnedOrders.filter((o: any) => {
    if (orderMonth) {
      if (!matchesDateRange(o.createdAt || o.date, orderMonth, orderMonth)) return false
    }
    if (dateFrom || dateTo) {
      if (!matchesDateRange(o.createdAt || o.date, dateFrom, dateTo)) return false
    }
    if (period) {
      if (!matchesPeriod(o.createdAt || o.date, period)) return false
    }
    return true
  })
})

function normalizeText(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const filteredOrderStats = computed(() => {
  const orders = filteredOrdersForDashboard.value
  const total = orders.length
  let active = 0
  let completed = 0
  let finished = 0

  orders.forEach((o: any) => {
    const st = normalizeText(String(o.status || '')).trim()
    if (st === 'terminado' || st === 'terminada') {
      completed += 1
    } else if (st === 'entregado' || st === 'entregada') {
      finished += 1
    } else if (st === 'recepcion' || st === 'diagnostico' || st === 'en proceso' || st === 'en-proceso' || st === 'pendiente') {
      active += 1
    }
  })

  return { total, active, completed, finished }
})

const ordersPieSeries = computed(() => [filteredOrderStats.value.active, filteredOrderStats.value.completed, filteredOrderStats.value.finished])
const ordersPieOptions = computed(() => ({
  labels: ['Activas', 'Terminadas', 'Entregadas'],
  colors: ['#3b82f6', '#f59e0b', '#22c55e'],
  legend: { show: true, position: 'bottom', labels: { colors: 'var(--brand-accent-alt)' } },
  dataLabels: { enabled: true, style: { colors: ['#fff'] } },
  chart: { background: 'transparent', foreColor: 'var(--brand-accent-alt)' },
  plotOptions: { pie: { expandOnClick: false } }
}))

// Estadísticas de Facturación filtradas por período
const filteredInvoicesForDashboard = computed(() => {
  const period = dashboardFilterPeriod.value
  const invoiceMonth = dashboardInvoiceMonth.value
  const dateFrom = dashboardInvoiceDateFrom.value
  const dateTo = dashboardInvoiceDateTo.value
  if (!period && !invoiceMonth && !dateFrom && !dateTo) return invoices
  return invoices.filter((inv: any) => {
    if (invoiceMonth) {
      if (!matchesDateRange(inv.createdAt, invoiceMonth, invoiceMonth)) return false
    }
    if (dateFrom || dateTo) {
      if (!matchesDateRange(inv.createdAt, dateFrom, dateTo)) return false
    }
    if (period) {
      if (!matchesPeriod(inv.createdAt, period)) return false
    }
    return true
  })
})

const dashboardInvoicePage = ref(1)
const dashboardInvoicePageSize = ref(10)

const dashboardInvoiceTotalPages = computed(() => Math.max(1, Math.ceil(filteredInvoicesForDashboard.value.length / dashboardInvoicePageSize.value)))

const dashboardPaginatedInvoices = computed(() => {
  const start = (dashboardInvoicePage.value - 1) * dashboardInvoicePageSize.value
  return filteredInvoicesForDashboard.value.slice(start, start + dashboardInvoicePageSize.value)
})

watch([filteredInvoicesForDashboard], () => {
  dashboardInvoicePage.value = 1
})

const dashboardDepositInvoices = computed(() => {
  if (!Array.isArray(invoices)) return []
  return invoices.filter((inv: any) => {
    const st = String(inv.status || '').toLowerCase().trim()
    return st === 'abonada' || st === 'abonado'
  }).sort((a: any, b: any) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
    return dateB.getTime() - dateA.getTime()
  })
})

const dashboardRecentInvoices = computed(() => {
  if (!Array.isArray(invoices)) return []
  return invoices.filter((inv: any) => {
    const st = String(inv.status || '').toLowerCase().trim()
    return st !== 'anulada' && st !== 'anulado'
  }).sort((a: any, b: any) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
    return dateB.getTime() - dateA.getTime()
  })
})

const filteredInvoiceStats = computed(() => {
  const invoices = filteredInvoicesForDashboard.value
  const total = invoices.length
  let pending = 0
  let paid = 0
  let withDeposit = 0
  let pendingValue = 0
  let paidValue = 0
  let withDepositValue = 0

  invoices.forEach((inv: any) => {
    const st = String(inv.status || '').toLowerCase().trim()
    const val = Number(inv.total || 0)
    if (st === 'pagada' || st === 'pagado' || st === 'completed' || st === 'completada') {
      paid += 1
      paidValue += val
    } else if (st === 'abonada' || st === 'abonado') {
      withDeposit += 1
      withDepositValue += val
    } else {
      pending += 1
      pendingValue += val
    }
  })

  return { total, pending, paid, withDeposit, totalValue: pendingValue + paidValue + withDepositValue, pendingValue, paidValue, withDepositValue }
})

const filteredInvoicePieSeries = computed(() => [filteredInvoiceStats.value.paid, filteredInvoiceStats.value.pending, filteredInvoiceStats.value.withDeposit])
const filteredInvoicePieOptions = computed(() => ({
  labels: ['Pagadas', 'Sin abono', 'Con abono'],
  colors: ['#22c55e', '#f59e0b', '#3b82f6'],
  legend: { show: true, position: 'bottom', labels: { colors: 'var(--brand-accent-alt)' } },
  dataLabels: { enabled: true, style: { colors: ['#fff'] } },
  chart: { background: 'transparent', foreColor: 'var(--brand-accent-alt)' },
  plotOptions: { pie: { expandOnClick: false } }
}))

const dashboardTechniciansByMonth = computed(() => {
  const employees = Array.isArray(burnedEmployees) ? burnedEmployees : []
  if (!employees.length) return []
  const selectedMonth = dashboardSelectedMonth.value
  const from = dashboardDateFrom.value
  const to = dashboardDateTo.value
  const allInvoices = Array.isArray(invoices) ? invoices : []
  const allOrders = Array.isArray(burnedOrders) ? burnedOrders : []

  const total = employees.reduce((sum: number, e: any) => {
    const mechanicKey = String(e.name || '').trim().toLowerCase()
    const invoices = allInvoices.filter((inv: any) => {
      const advisorName = String(inv.advisorName || '').trim().toLowerCase()
      if (advisorName !== mechanicKey || Number(inv.total || 0) <= 0) return false
      if (selectedMonth) {
        const date = inv.createdAt ? new Date(inv.createdAt) : new Date()
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (month !== selectedMonth) return false
      }
      if (from || to) {
        if (!matchesDateRange(inv.createdAt, from, to)) return false
      }
      return true
    })
    return sum + invoices.reduce((s: number, i: any) => s + Number(i.total || 0), 0)
  }, 0)

  return employees.map((e: any) => {
    const mechanicKey = String(e.name || '').trim().toLowerCase()
    const invoices = allInvoices.filter((inv: any) => {
      const advisorName = String(inv.advisorName || '').trim().toLowerCase()
      if (advisorName !== mechanicKey || Number(inv.total || 0) <= 0) return false
      if (selectedMonth) {
        const date = inv.createdAt ? new Date(inv.createdAt) : new Date()
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (month !== selectedMonth) return false
      }
      if (from || to) {
        if (!matchesDateRange(inv.createdAt, from, to)) return false
      }
      return true
    })

    // Contar garantías del técnico (desde órdenes históricas)
    const warrantyOrders = allOrders.filter((o: any) => {
      const orderMechanic = String(o.mechanic || '').trim().toLowerCase()
      if (orderMechanic !== mechanicKey) return false
      if (Number(o.garantia || 0) <= 0) return false
      if (selectedMonth) {
        const date = o.createdAt ? new Date(o.createdAt) : new Date()
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (month !== selectedMonth) return false
      }
      if (from || to) {
        if (!matchesDateRange(o.createdAt || o.date, from, to)) return false
      }
      return true
    })

    const revenue = invoices.reduce((s: number, i: any) => s + Number(i.total || 0), 0)
    return {
      name: e.name || 'Sin nombre',
      role: e.role || 'Técnico',
      ordersCount: invoices.length,
      totalRevenue: revenue,
      technicianShare: revenue * 0.5,
      workshopShare: revenue * 0.5,
      percentage: total > 0 ? (revenue / total) * 100 : 0,
      warrantyCount: warrantyOrders.length,
      warrantyValue: warrantyOrders.reduce((s: number, o: any) => s + Number(o.total || 0), 0)
    }
  }).sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
})

const avgServiceTime = computed(() => '2.4 Días')

// Computed properties para búsqueda y filtrado
const filteredProducts = computed(() => {
  if (!searchProducts.value.trim()) {
    return products.value
  }
  const searchLower = searchProducts.value.toLowerCase().trim()
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchLower) ||
    product.description?.toLowerCase().includes(searchLower)
  )
})

const filteredCategories = computed(() => {
  if (!searchCategories.value.trim()) {
    return categories.value
  }
  const searchLower = searchCategories.value.toLowerCase().trim()
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchLower) ||
    category.description?.toLowerCase().includes(searchLower)
  )
})

const filteredShowcase = computed(() => {
  if (!searchShowcase.value.trim()) {
    return showcaseProducts.value
  }
  const searchLower = searchShowcase.value.toLowerCase().trim()
  return showcaseProducts.value.filter(product =>
    product.name.toLowerCase().includes(searchLower) ||
    product.description?.toLowerCase().includes(searchLower)
  )
})

const filteredSales = computed(() => {
  if (!searchSales.value.trim()) {
    return sales.value
  }
  const searchLower = searchSales.value.toLowerCase().trim()
  return sales.value.filter(sale =>
    sale.customerName.toLowerCase().includes(searchLower) ||
    sale.customerEmail.toLowerCase().includes(searchLower) ||
    sale.productName.toLowerCase().includes(searchLower) ||
    // Buscar también en los items individuales
    (sale.items && sale.items.some(item =>
      item.productName.toLowerCase().includes(searchLower)
    ))
  )
})

// Resumen de clientes a partir de ventas
interface ClientSummary {
  id: string
  name: string
  email: string
  totalOrders: number
  totalSpent: number
}

const clientSummaries = computed<ClientSummary[]>(() => {
  const map = new Map<string, ClientSummary>()

  sales.value.forEach((sale) => {
    const key = (sale.customerEmail || sale.customerName).toLowerCase()
    const existing = map.get(key) || {
      id: key,
      name: sale.customerName,
      email: sale.customerEmail,
      totalOrders: 0,
      totalSpent: 0
    }

    existing.totalOrders += 1
    if (sale.status === 'completed') {
      existing.totalSpent += sale.totalAmount
    }

    map.set(key, existing)
  })

  return Array.from(map.values())
})

const filteredClients = computed(() => {
  if (!searchClients.value.trim()) {
    return clientSummaries.value
  }
  const searchLower = searchClients.value.toLowerCase().trim()
  return clientSummaries.value.filter((client) =>
    client.name.toLowerCase().includes(searchLower) ||
    client.email.toLowerCase().includes(searchLower)
  )
})

// Helper para convertir nombres de colores a hex
const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'naranja cósmico': '#ff5e00',
    'naranja cosmico': '#ff5e00',
    'azul profundo': '#003d5c',
    'plata': '#c0c0c0',
    'silver': '#c0c0c0',
    'azul': '#1976d2',
    'blue': '#1976d2',
    'negro': '#000000',
    'black': '#000000',
    'blanco': '#ffffff',
    'white': '#ffffff',
    'azul neblina': '#a8c7dd',
    'dorado claro': '#f7e7a1',
    'azul cielo': '#87ceeb',
    'rosa': '#ff69b4',
    'pink': '#ff69b4',
    'amarillo': '#ffeb3b',
    'yellow': '#ffeb3b',
    'verde': '#4caf50',
    'green': '#4caf50',
    'púrpura': '#9c27b0',
    'purpura': '#9c27b0',
    'purple': '#9c27b0',
    'morado': '#9c27b0',
    'oro': '#ffd700',
    'gold': '#ffd700'
  }

  const normalized = colorName.toLowerCase().trim()
  return colorMap[normalized] || '#9e9e9e' // Gris por defecto
}

// Cambio de pestaña con persistencia
const selectTab = (tabId: string) => {
  activeTab.value = tabId
  try {
    localStorage.setItem(ACTIVE_TAB_KEY, tabId)
  } catch (e) {
    console.warn('No se pudo persistir la pestaña activa', e)
  }
}

// Métodos
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'available': 'Disponible',
    'out-of-stock': 'Sin Stock',
    'coming-soon': 'Próximamente'
  }
  return statusMap[status] || status
}

const getSaleStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'completed': 'Completada',
    'pending': 'Pendiente',
    'cancelled': 'Cancelada'
  }
  return statusMap[status] || status
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
// Fecha corta, formato local (ej. 10/04/2026)
const formatShortDate = (date: Date) => {
  return date.toLocaleDateString('es-CO')
}

const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getStatusClassForDashboard = (status: string) => {
  const s = normalizeText(status.toString().trim())
  if (s.includes('recepcion')) return 'recepcion'
  if (s.includes('diagnostico')) return 'diagnostico'
  if (s.includes('proceso') || s.includes('progreso')) return 'en-proceso'
  if (s.includes('termin') || s.includes('complet')) return 'terminado'
  if (s.includes('entreg')) return 'entregado'
  return 'default'
}

const getAppointmentStatusClass = (appt: any) => {
  if (!appt) return 'pending'
  const status = String(appt.status || '').toLowerCase()
  if (status.includes('confirm') || status.includes('confirmada')) return 'confirmed'
  if (status.includes('complet') || status.includes('realizada')) return 'completed'
  if (status.includes('cancel')) return 'cancelled'
  return 'pending'
}

const getAppointmentStatusLabel = (appt: any) => {
  const status = String(appt.status || '').toLowerCase()
  if (status.includes('confirm')) return 'Confirmada'
  if (status.includes('complet')) return 'Realizada'
  if (status.includes('cancel')) return 'Cancelada'
  return 'Pendiente'
}

// Devuelve sólo el tipo de aviso para mostrar en la UI.
const getReminderTypeDisplay = (client: any): string => {
  if (!client) return '-'
  if (client.reminderType) return client.reminderType
  const r = (client.reminder || '').toString()
  if (!r) return '-'
  // Si hay ':' tomar la parte izquierda (ej. "SOAT: 10/10/2026")
  const idx = r.indexOf(':')
  if (idx !== -1) {
    const left = r.slice(0, idx).trim()
    if (left) return left
  }
  // Si contiene la palabra 'vence' tomar la primera palabra (ej. "SOAT vence 10/2026")
  const tokens = r.split(/\s+/)
  if (tokens.length > 0) return tokens[0]
  return r
}

const getProductsInCategory = (categoryId: string) => {
  return products.value.filter(p => p.category === categoryId).length
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice || 0,
    images: product.images ? [...product.images] : [],
    category: product.category,
    status: product.status,
    colors: product.colors ? [...product.colors] : []
  }
  // Configurar preview con la primera imagen si existe
  if (product.images && product.images.length > 0) {
    if (product.images[0].startsWith('http')) {
      productImageUploadMethod.value = 'url'
    } else {
      productImageUploadMethod.value = 'file'
    }
    imagePreview.value = product.images[0]
  } else {
    imagePreview.value = ''
  }
  showProductForm.value = true
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    description: category.description || '' // Manejar descripción opcional
  }
  showCategoryForm.value = true
}

const deleteProductConfirm = (id: string) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    deleteProduct(id)
  }
}

// Función wrapper para eliminar categoría con confirmación
const handleDeleteCategory = async (id: string) => {
  const productsCount = getProductsInCategory(id)

  let confirmMessage = '¿Estás seguro de eliminar esta categoría?'

  if (productsCount > 0) {
    confirmMessage = `⚠️ ADVERTENCIA: Esta categoría tiene ${productsCount} producto${productsCount > 1 ? 's' : ''} asociado${productsCount > 1 ? 's' : ''}.\n\n` +
      `Si eliminas esta categoría, ${productsCount > 1 ? 'estos productos' : 'este producto'} quedará${productsCount > 1 ? 'n' : ''} sin categoría asignada.\n\n` +
      `¿Estás seguro de que deseas continuar?`
  }

  if (confirm(confirmMessage)) {
    await deleteCategory(Number(id))
  }
}

// Funciones para showcase products
const editShowcaseProduct = (product: ShowcaseProduct) => {
  editingShowcaseProduct.value = product
  showcaseForm.value = {
    name: product.name,
    description: product.description,
    price: 5000, // Siempre 0 para novedades
    image: product.image,
    category: product.category
  }
  // Determinar el método de imagen basado en si es URL o base64
  if (product.image.startsWith('http')) {
    imageUploadMethod.value = 'url'
    showcaseImagePreview.value = ''
  } else {
    imageUploadMethod.value = 'file'
    showcaseImagePreview.value = product.image
  }
  imagePreview.value = product.image
  showShowcaseForm.value = true
}

const deleteShowcaseConfirm = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar esta novedad?')) {
    try {
      await deleteShowcaseProduct(id)
      console.log('✅ Producto showcase eliminado')
    } catch (error) {
      console.error('❌ Error eliminando producto showcase:', error)
      alert('Error al eliminar la novedad')
    }
  }
}

const saveShowcaseProduct = async () => {
  if (isSavingShowcase.value) return
  if (!showcaseFormValid.value) {
    alert('Por favor completa todos los campos requeridos de la novedad.')
    return
  }
  try {
    isSavingShowcase.value = true

    // Asegurar que el precio siempre sea 0 para novedades
    showcaseForm.value.price = 5000

    // Validación extra de URL (si se usa modo URL)
    if (imageUploadMethod.value === 'url' && showcaseForm.value.image.startsWith('http')) {
      const testImg = new Image()
      const loadPromise = new Promise<void>((resolve, reject) => {
        testImg.onload = () => resolve()
        testImg.onerror = () => reject(new Error('No se pudo cargar la imagen proporcionada.'))
      })
      testImg.src = showcaseForm.value.image
      await Promise.race([
        loadPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Tiempo de espera al validar la imagen.')), 4000))
      ])
    }

    if (editingShowcaseProduct.value) {
      // Actualizar novedad existente - mostrar confirmación
      const confirmMessage = `¿Estás seguro de que deseas actualizar la novedad "${editingShowcaseProduct.value.name}"?\n\nSe actualizarán todos los cambios realizados.`
      if (!confirm(confirmMessage)) {
        isSavingShowcase.value = false
        return
      }
      await updateShowcaseProduct(editingShowcaseProduct.value.id, showcaseForm.value)
      console.log('✅ Producto showcase actualizado')
    } else {
      await addShowcaseProduct(showcaseForm.value)
      console.log('✅ Producto showcase agregado')
    }
    closeShowcaseForm()
  } catch (e: unknown) {
    console.error('❌ Error guardando producto showcase:', e)
    const msg = typeof e === 'object' && e && 'message' in e ? (e as { message?: string }).message : undefined
    alert(msg || 'Ocurrió un problema al guardar la novedad.')
  } finally {
    isSavingShowcase.value = false
  }
}

const closeShowcaseForm = () => {
  showShowcaseForm.value = false
  editingShowcaseProduct.value = null
  imagePreview.value = ''
  showcaseImagePreview.value = ''
  imageUploadMethod.value = 'url'
  showcaseForm.value = {
    name: '',
    description: '',
    price: 0,
    image: '',
    category: ''
  }
  // Limpiar input de archivo
  if (showcaseFileInput.value) {
    showcaseFileInput.value.value = ''
  }
}

// Computed para validación de formulario
const isFormValid = computed(() => {
  return productForm.value.name.trim() !== '' &&
    productForm.value.price > 0 &&
    productForm.value.category !== ''
})

const handleMultipleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    handleMultipleImageFiles(files)
  }
}

const handleMultipleImageFiles = (files: FileList) => {
  const imagePromises: Promise<string>[] = []

  for (let i = 0; i < Math.min(files.length, 5); i++) { // Máximo 5 imágenes
    const file = files[i]

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alert(`El archivo ${file.name} es demasiado grande. Máximo 5MB.`)
      continue
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert(`${file.name} no es un archivo de imagen válido.`)
      continue
    }

    // Crear promesa para leer el archivo
    const promise = new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })

    imagePromises.push(promise)
  }

  // Procesar todas las imágenes
  Promise.all(imagePromises).then((base64Images) => {
    productForm.value.images = base64Images
    imagePreview.value = base64Images[0] || ''
  })
}


const updateImagePreview = () => {
  if (productForm.value.images.length > 0 && productForm.value.images[0].startsWith('http')) {
    imagePreview.value = productForm.value.images[0]
  } else {
    imagePreview.value = ''
  }
}

// removeImage eliminado (uso sustituido por removeSingleImage o reinicio manual)

const removeSingleImage = (index: number) => {
  productForm.value.images.splice(index, 1)
  if (productForm.value.images.length > 0) {
    imagePreview.value = productForm.value.images[0]
  } else {
    imagePreview.value = ''
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// Reordenar: mover a la izquierda
const moveImageLeft = (index: number) => {
  if (index <= 0) return
  const imgs = productForm.value.images
    ;[imgs[index - 1], imgs[index]] = [imgs[index], imgs[index - 1]]
  imagePreview.value = imgs[0] || ''
}

// Reordenar: mover a la derecha
const moveImageRight = (index: number) => {
  const imgs = productForm.value.images
  if (index >= imgs.length - 1) return
    ;[imgs[index + 1], imgs[index]] = [imgs[index], imgs[index + 1]]
  imagePreview.value = imgs[0] || ''
}

// setAsCover removido (no se usa actualmente)

// Funciones específicas para showcase image upload
const handleShowcaseFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleShowcaseImageFile(file)
  }
}

const handleShowcaseImageFile = (file: File) => {
  // Validar tamaño (5MB máximo)
  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo es demasiado grande. Máximo 5MB.')
    return
  }

  // Validar tipo
  if (!file.type.startsWith('image/')) {
    alert('Solo se permiten archivos de imagen.')
    return
  }

  // Crear URL temporal para vista previa
  const reader = new FileReader()
  reader.onload = (e) => {
    showcaseImagePreview.value = e.target?.result as string
    showcaseForm.value.image = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeShowcaseImage = () => {
  showcaseImagePreview.value = ''
  showcaseForm.value.image = ''
  if (showcaseFileInput.value) {
    showcaseFileInput.value.value = ''
  }
}

// Función auxiliar para normalizar strings (quitar tildes, espacios extra, etc.)
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes y diacríticos
    .trim()
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples a uno solo
}

// Función para verificar si un color está seleccionado (comparación normalizada)
const isColorSelected = (colorName: string) => {
  const normalizedColorName = normalizeString(colorName)
  return productForm.value.colors.some(
    c => normalizeString(c) === normalizedColorName
  )
}

// Función para manejar la selección de colores
const toggleProductColor = (colorName: string) => {
  const normalizedColorName = normalizeString(colorName)

  // Buscar el índice comparando strings normalizados
  const index = productForm.value.colors.findIndex(
    c => normalizeString(c) === normalizedColorName
  )

  if (index > -1) {
    // Si ya está seleccionado, lo removemos
    productForm.value.colors.splice(index, 1)
  } else {
    // Si no está seleccionado, lo agregamos (usando el formato correcto del appleColors)
    productForm.value.colors.push(colorName)
  }
}

const saveProduct = () => {
  if (editingProduct.value) {
    // Actualizar producto existente - mostrar confirmación
    const confirmMessage = `¿Estás seguro de que deseas actualizar el producto "${editingProduct.value.name}"?\n\nSe actualizarán todos los cambios realizados.`
    if (!confirm(confirmMessage)) {
      return
    }
    updateProduct(editingProduct.value.id, productForm.value)
  } else {
    // Crear nuevo producto
    addProduct(productForm.value)
  }
  closeProductForm()
}

const saveCategory = async () => {
  if (editingCategory.value) {
    // Actualizar categoría existente - mostrar confirmación
    const confirmMessage = `¿Estás seguro de que deseas actualizar la categoría "${editingCategory.value.name}"?\n\nSe actualizarán todos los cambios realizados.`
    if (!confirm(confirmMessage)) {
      return
    }
    await updateCategory(Number(editingCategory.value.id), categoryForm.value)
  } else {
    // Crear nueva categoría
    await addCategory(categoryForm.value)
  }
  closeCategoryForm()
}

const closeProductForm = () => {
  showProductForm.value = false
  editingProduct.value = null
  imagePreview.value = ''
  productImageUploadMethod.value = 'url'
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    images: [],
    category: '',
    status: 'available',
    colors: []
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const closeCategoryForm = () => {
  showCategoryForm.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    description: ''
  }
}
</script>

<style scoped>
/* Encabezado destacado tipo panel */
.panel-admin-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  margin-top: 1.5rem;
}

.panel-admin-icon {
  font-size: 2.2rem;
  filter: drop-shadow(0 1px 2px #2228);
}

.panel-admin-title {
  letter-spacing: -1px;
  color: #fff;
  text-shadow: 0 1px 4px #0008;
}

.panel-admin-subtitle {
  text-align: center;
  color: #3b82f6;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.admin-dashboard {
  min-height: 100vh;
  background: var(--brand-gradient);
  padding: 20px;
  color: var(--brand-primary-contrast);
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: var(--brand-surface);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--brand-border);
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  margin: 3rem 10px 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.dashboard-title .icon {
  font-size: 3rem;
}

.dashboard-title .highlight {
  color: var(--brand-success);
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: var(--brand-accent-alt);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: var(--brand-surface);
  border-radius: 16px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--brand-border);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  border-color: var(--brand-accent);
}

.stat-icon {
  font-size: 1.5rem;
  background: linear-gradient(135deg, #0c515a 0%, #115c80 100%);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-number {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--brand-accent-alt);
  font-weight: 500;
}

.tabs-container {
  margin-bottom: 30px;
  align-items: center;
}

/* Botones de acción compactos dentro de tablas: horizontal y sin wrap */
.actions {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
}

.actions button,
.actions .btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  padding: 4px 3px !important;
  font-size: 0.68rem !important;
  height: 26px !important;
  line-height: 1 !important;
  border-radius: 8px !important;
  white-space: nowrap !important;
  min-width: 0 !important;
}

/* Reducir tamaño de los botones de acciones en las tarjetas */
.order-action-btn {
  height: 28px;
  padding: 0 8px;
  font-size: 0.72rem;
}

.order-action-btn svg {
  width: 12px;
  height: 12px;
}

.tabs {
  display: flex;
  gap: 5px;
  background: var(--brand-surface);
  padding: 5px;
  border-radius: 12px;
  width: fit-content;
  border: 1px solid var(--brand-border);
}

.tab {
  background: none;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  color: var(--brand-accent-alt);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab.active {
  background: var(--brand-success);
  color: var(--brand-primary-contrast);
  box-shadow: 0 2px 8px rgba(56, 65, 62, 0.5);
}

.table-header {
  background: var(--brand-surface);
  border: 1px solid var(--brand-border);
  text-align: center;
}

/* Tabla simple: forzar layout fijo y permitir wrap para palabras largas */
.simple-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

}

.simple-table th,
.simple-table td {
  white-space: normal;
  overflow-wrap: anywhere;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  vertical-align: middle;
  text-align: center;

}

.simple-table td .client-notes,
.simple-table td .client-name,
.simple-table td .client-email {
  display: block;
  white-space: normal;
  overflow-wrap: anywhere;
}

/* Compact vehicles table: slightly larger font and balanced paddings */
.vehicles-table.compact th,
.vehicles-table.compact td {
  font-size: 14px;
  padding: 9px 12px;
  text-align: center;
}

.vehicles-table.compact th {
  font-size: 14px;
  font-weight: 700;
  color: var(--brand-accent-alt);
}

.vehicles-table.compact td {
  color: var(--brand-primary-contrast);
}

.vehicles-table.compact td .client-notes {
  font-size: 13px;
  color: var(--brand-accent-alt);
}

.vehicles-table.compact td[data-label="Km Actual"],
.vehicles-table.compact td[data-label="Próximo Servicio (km)"] {
  text-align: right;
}

/* Tabla de facturas: espaciado y alineación para columnas numéricas */
.invoices-table.compact {
  width: auto;
  max-width: auto;
  margin: 0 auto;
}

.header-search-input {
  max-width: 340px;
  min-width: 180px;
  width: 34vw;
}

/* Inputs en tabla compacta del modal de facturación */
.simple-table.compact td .form-input {
  padding: 6px 8px;
  font-size: 0.9rem;
  min-width: 60px;
  white-space: nowrap;
}

/* Header controls: mantener en una sola fila y permitir scroll horizontal en pantallas pequeñas */
.header-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.header-controls>.form-input,
.header-controls>input[type="date"],
.header-controls>select {
  flex: 0 0 auto;
  min-width: 110px;
  max-width: 260px;
}

.header-controls>.header-action {
  flex: 0 0 auto;
  min-width: 60px;
  padding: 6px 10px;
  white-space: nowrap;
}

.header-controls>.header-search-input {
  flex: 0 1 260px;
  min-width: 140px;
  max-width: 340px;
}

.header-controls::-webkit-scrollbar {
  height: 8px
}

.header-controls::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 6px
}

.invoices-table.compact th,
.invoices-table.compact td {
  font-size: 14px;
  padding: 10px 12px;
  vertical-align: middle;
}

.invoices-table.compact th {
  font-weight: 700;
  color: var(--brand-accent-alt);
  text-align: center;
}

.invoices-table.compact td {
  color: var(--brand-primary-contrast);
  text-align: center;
}

.invoices-table.compact td[data-label="Subtotal"],
.invoices-table.compact td[data-label="IVA"],
.invoices-table.compact td[data-label="Total"] {
  text-align: center;
  white-space: nowrap;
}

/* Forzar acciones en línea y sin wrap */
.invoices-table.compact .actions {
  display: flex;
  flex-direction: row;
  gap: 6px;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
}

.table-footer .form-input {
  width: auto;
  padding: 6px 8px
}

@media (max-width: 880px) {

  .invoices-table.compact thead th:nth-child(n+6):not(:last-child),
  .invoices-table.compact td:nth-child(n+6):not(:last-child) {
    display: none;
  }

  .invoices-table.compact td:first-child {
    position: sticky;
    left: 0;
    background: inherit
  }
}


.tab:hover:not(.active) {
  background: var(--brand-border);
  color: var(--brand-primary-contrast);
}

.content-section {
  background: var(--brand-surface);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--brand-border);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--brand-border);
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  margin: 0;
}

/* Barras de búsqueda en Admin */
.search-bar {
  display: flex;
  justify-content: center;
  margin: 0 0 2rem;
  position: relative;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--brand-accent-alt);
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: .875rem 4.5rem 0.875rem 2.75rem;
  border-radius: 999px;
  border: 1px solid var(--brand-border);
  background: var(--brand-bg-end);
  font-size: 1rem;
  color: var(--brand-primary-contrast);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  background: var(--brand-surface);
  border-color: var(--brand-success);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.search-input:hover {
  border-color: var(--brand-accent);
}

.search-input::placeholder {
  color: var(--brand-accent-alt);
  opacity: 0.7;
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(16, 185, 129, 0.1);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brand-success);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-clear:hover {
  background: rgba(16, 185, 129, 0.2);
  transform: translateY(-50%) scale(1.05);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-card {
  background: var(--brand-bg-end);
  border-radius: 16px;
  padding: 20px;
  border: 2px solid var(--brand-border);
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: var(--brand-success);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
  background: var(--brand-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  font-size: 3rem;
  color: var(--brand-accent-alt);
}

.product-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 8px;
}

.product-description {
  color: var(--brand-accent-alt);
  font-size: 0.9rem;
  margin: 0 0 15px;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--brand-success);
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status.available {
  background: #d1fae5;
  color: #065f46;
}

.status.out-of-stock {
  background: #dbeafe;
  color: #2563eb;
}

.status.coming-soon {
  background: #dbeafe;
  color: #1e40af;
}

.product-actions {
  display: flex;
  gap: 10px;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.category-item {
  background: var(--brand-bg-end);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid var(--brand-border);
  transition: all 0.3s ease;
}

.category-item:hover {
  border-color: var(--brand-success);
  transform: translateY(-1px);
}

.category-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 5px;
}

.category-info p {
  color: var(--brand-accent-alt);
  margin: 0 0 5px;
  font-size: 0.9rem;
}

.category-count {
  font-size: 0.8rem;
  color: var(--brand-success);
  font-weight: 600;
}

.category-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--brand-accent-alt);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 10px;
  color: var(--brand-primary-contrast);
}

.empty-state p {
  margin: 0 0 30px;
  font-size: 1rem;
}

/* Clientes */
.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.client-card {
  background: var(--brand-bg-end);
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 2px solid var(--brand-border);
  transition: all 0.3s ease;
}

.client-card:hover {
  border-color: var(--brand-success);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.25);
  transform: translateY(-2px);
}

.client-avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: #f9fafb;
}

.client-info h3 {
  margin: 0 0 4px;
  font-size: 1rem;
  color: var(--brand-primary-contrast);
}

.client-email {
  margin: 0 0 4px;
  font-size: 0.85rem;
  color: var(--brand-accent-alt);
}

.client-meta {
  margin: 0;
  font-size: 0.8rem;
  color: var(--brand-accent-alt);
}

/* Loading and Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-state p,
.error-state p {
  margin-top: 20px;
  font-size: 1rem;
  color: var(--brand-accent-alt);
}

.error-state {
  color: #f44336;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--brand-primary);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Product info in sales table */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-weight: 500;
}

.product-color {
  font-size: 0.85rem;
  color: var(--brand-accent-alt);
}

/* === SELECTOR DE COLORES === */
.colors-selector {
  margin-top: 10px;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  margin-bottom: 15px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
}

.color-option:hover {
  border-color: rgba(96, 165, 250, 0.5);
  background: rgba(96, 165, 250, 0.1);
}

.color-option.selected {
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.25);
  transform: scale(1.05);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
}

.color-option.selected .color-circle {
  border-color: #60a5fa;
  border-width: 3px;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3);
}

.color-option.selected .color-name {
  color: #60a5fa;
  font-weight: 700;
}

.color-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.5);
  position: absolute;
  animation: checkPop 0.3s ease;
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.color-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--brand-primary-contrast);
  text-align: center;
  line-height: 1.2;
}

.selected-colors {
  padding: 10px 12px;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 8px;
  margin-top: 10px;
}

.selected-label {
  font-weight: 600;
  color: #60a5fa;
  font-size: 0.85rem;
}

.selected-list {
  color: var(--brand-primary-contrast);
  font-size: 0.85rem;
}

/* Botones */
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background: var(--brand-success);
  color: var(--brand-primary-contrast);
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.5);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.6);
  background: #059669;
}

.btn-secondary {
  background: var(--brand-border);
  color: var(--brand-primary-contrast);
}

.btn-secondary:hover {
  background: var(--brand-surface);
}

.btn-danger {
  background: rgba(37, 99, 235, 0.15);
  /* azul */
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.25);
}

.btn-danger:hover {
  background: rgba(37, 99, 235, 0.25);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.55rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: var(--brand-surface);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  border: 1px solid var(--brand-border);
}

.modal-header {
  padding: 30px 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--brand-accent-alt);
  padding: 5px;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--brand-border);
  color: var(--brand-primary-contrast);
}

.modal-body {
  padding: 30px;
}

/* Formularios */
.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--brand-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  background: var(--brand-bg-end);
  color: var(--brand-primary-contrast);
}

.form-input:focus {
  outline: none;
  border-color: var(--brand-success);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.form-input::placeholder {
  color: var(--brand-accent-alt);
}

.form-input[readonly], .form-input-readonly {
  background: var(--brand-bg) !important;
  border: 2px solid var(--brand-border) !important;
  cursor: not-allowed;
  opacity: 0.85;
  color: var(--brand-primary-contrast);
}

.price-input {
  position: relative;
  display: flex;
  align-items: center;
}

.currency {
  position: absolute;
  left: 16px;
  font-weight: 600;
  color: var(--brand-accent-alt);
  z-index: 1;
}

.price-input .form-input {
  padding-left: 35px;
}

/* Subida de imágenes */
.image-upload-area {
  margin-bottom: 15px;
}

.image-preview {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--brand-border);
  margin-bottom: 15px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(37, 99, 235, 0.9);
  /* azul */
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.3s ease;
}

.remove-image:hover {
  background: rgba(37, 99, 235, 1);
}

/* Estilos para vista previa de múltiples imágenes */
.images-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.image-preview-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--brand-border);
  background: var(--brand-bg-end);
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-single-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(37, 99, 235, 0.9);
  /* azul */
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background 0.3s ease;
}

.remove-single-image:hover {
  background: rgba(37, 99, 235, 1);
}

.image-index {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

.image-actions {
  position: absolute;
  left: 5px;
  top: 5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.img-action-btn {
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  border: none;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 4px;
  cursor: pointer;
  line-height: 1.1;
  transition: background .2s ease, transform .15s ease;
}

.img-action-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-1px);
}

.img-action-btn:disabled {
  opacity: .35;
  cursor: default;
}

.img-action-btn.primary {
  background: var(--brand-success);
}

.img-action-btn.primary:hover {
  background: #059669;
}

.drop-zone {
  border: 2px dashed var(--brand-border);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  background: var(--brand-bg-end);
  cursor: pointer;
}

.drop-zone.dragover {
  border-color: var(--brand-success);
  background: rgba(16, 185, 129, 0.1);
}

.drop-zone:hover {
  border-color: var(--brand-success);
  background: rgba(16, 185, 129, 0.1);
}

.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 3rem;
  color: var(--brand-accent-alt);
}

.upload-btn {
  background: none;
  border: none;
  color: var(--brand-success);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.upload-btn:hover {
  color: #059669;
}

.url-input {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--brand-border);
}

.url-input label {
  font-size: 0.9rem;
  color: var(--brand-accent-alt);
  margin-bottom: 8px;
}

.discount-info {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.discount-badge {
  color: var(--brand-success);
  font-weight: 600;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid var(--brand-border);
}

/* Responsive */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 10px;
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .dashboard-title {
    font-size: 1.6rem;
    line-height: 1.2;
  }

  .dashboard-subtitle {
    font-size: 0.9rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-number {
    font-size: 1.3rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .stat-icon {
    font-size: 1.8rem;
    width: 50px;
    height: 50px;
  }

  .tabs-container {
    margin-bottom: 20px;
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .tab {
    padding: 8px 12px;
    font-size: 0.9rem;
    min-width: auto;
  }

  .tab-icon {
    display: none;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .section-header h2 {
    font-size: 1.4rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .product-card {
    padding: 15px;
  }

  .product-actions {
    flex-direction: column;
    gap: 8px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .form-actions {
    flex-direction: column;
    gap: 10px;
  }

  .modal {
    margin: 10px;
    max-width: none;
  }

  .modal-header h3 {
    font-size: 1.3rem;
  }

  .modal-body {
    padding: 15px;
  }
}

/* Ajustes específicos para filas de órdenes */
@media (max-width: 1200px) {
  .orders-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .orders-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .orders-row {
    grid-template-columns: 1fr;
  }
}

/* Estilos para la sección de ventas */
/* Desempeño de Técnicos */
.enhanced-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.enhanced-bar-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.bar-left {
  flex: 0 0 38%;
  min-width: 160px;
}

.bar-label {
  font-weight: 700;
  color: var(--brand-primary-contrast);
  font-size: 0.95rem;
}

.bar-meta {
  color: var(--brand-accent-alt);
  font-size: 0.85rem;
  margin-top: 4px;
}

.bar-track {
  flex: 1 1 auto;
  height: 14px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.bar-fill {
  height: 100%;
  border-radius: 8px;
  border-radius: 8px;
  transition: width 0.5s ease;
  box-shadow: inset 0 -2px 6px rgba(0, 0, 0, 0.18);
}

.bar-number {
  min-width: 40px;
  text-align: right;
  font-weight: 800;
  color: var(--brand-primary-contrast);
  margin-left: 10px;
}

/* Bottom row layout: services left, tech right */
.bottom-row {
  display: flex;
  gap: 18px;
}

.card.services-card {
  flex: 1 1 60%;
}

.card.tech-card {
  flex: 0 0 40%;
}

/* Tech table polished styling */
.tech-table thead th {
  background: var(--brand-surface);
  color: var(--brand-accent-alt);
  padding: 10px 12px;
  font-weight: 700;
  text-align: left;
  border-bottom: 1px solid var(--brand-border);
}

.tech-table tbody tr {
  background: transparent;
  color: var(--brand-accent-alt);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.tech-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.tech-table tbody td {
  padding: 12px;
  vertical-align: middle;
}

.tech-table .tech-income {
  text-align: right;
  font-weight: 700;
  color: var(--brand-primary-contrast);
}

.tech-table .tech-name {
  font-weight: 700;
  color: var(--brand-primary-contrast);
}

.tech-card {
  background: var(--brand-bg-end);
  border: 1px solid var(--brand-border);
}

.donut-card .donut-area,
.donut-card .donut-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.donut-card .donut-wrap {
  justify-content: center;
}

.donut-legend {
  min-width: 160px;
}

.donut-legend .status-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.donut-legend li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  color: var(--brand-accent-alt);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}

.legend-text {
  font-weight: 600;
  margin-left: 6px;
}

.legend-value {
  margin-left: auto;
  font-weight: 800;
  color: var(--brand-primary-contrast);
}

/* Small cards on the right */
.small-cards .chart-card {
  margin-bottom: 12px;
}

.upcoming-card h3 {
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
  color: #fff;
  padding: 8px;
  border-radius: 8px;
}

.alerts-card h3 {
  background: linear-gradient(90deg, #b91c1c, #ef4444);
  color: #fff;
  padding: 8px;
  border-radius: 8px;
}

.upcoming-list {
  list-style: none;
  padding: 8px 12px;
  margin: 0;
  color: var(--brand-accent-alt);
}

/* Financial row */
.financial-row {
  display: flex;
  gap: 18px;
  margin-top: 18px;
  align-items: flex-start;
}

.financial-row .card.wide {
  flex: 1 1 50%;
}

.financial-row .card.small {
  flex: 0 0 50%;
}

.sold-count {
  font-weight: 600;
  margin-right: 6px;
  color: var(--brand-accent-alt);
}

.pct {
  color: var(--brand-accent-alt);
  font-weight: 600;
}

/* Technicians performance bars */
.tech-table td.tech-orders {
  width: 40%;
  text-align: left;
  padding-left: 12px;
}

.orders-count {
  font-weight: 700;
  color: var(--brand-primary-contrast);
  margin-bottom: 6px;
}

.orders-bar {
  height: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.orders-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #16a34a, #86efac);
  transition: width 0.4s ease;
  box-shadow: inset 0 -1px 3px rgba(0, 0, 0, 0.18);
}

.sales-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.sales-table-container {
  background: var(--brand-bg-end);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--brand-border);
  overflow-x: auto;
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.sales-table th {
  background: var(--brand-surface);
  color: var(--brand-primary-contrast);
  font-weight: 600;
  padding: 18px 100px;
  text-align: center;
  border-bottom: 2px solid var(--brand-border);
  white-space: nowrap;
  font-size: 0.95rem;
}

.sales-table td {
  padding: 18px 60px;
  border-bottom: 1px solid var(--brand-border);
  color: var(--brand-accent-alt);
  text-align: center;
}

.sale-row {
  transition: background-color 0.3s ease;
}

.sale-row:hover {
  background: var(--brand-surface);
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name {
  font-weight: 600;
  color: var(--brand-primary-contrast);
  font-size: 0.85rem;
}

.customer-email {
  font-size: 0.75rem;
  color: var(--brand-accent-alt);
}

.product-name {
  font-weight: 500;
  color: var(--brand-primary-contrast);
  font-size: 0.85rem;
}

.quantity {
  background: var(--brand-accent);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 600;
  display: inline-block;
  min-width: 30px;
  text-align: center;
}

.amount {
  font-weight: 700;
  color: var(--brand-success);
  font-size: 0.9rem;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.status-badge.completed {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.status-badge.cancelled {
  background: rgba(37, 99, 235, 0.15);
  /* azul */
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.25);
}

.date {
  color: var(--brand-accent-alt);
  font-size: 0.75rem;
}

/* Estilos para productos múltiples */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.single-product {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-color {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--brand-accent-alt);
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.multiple-products {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.products-summary {
  display: flex;
  align-items: center;
  gap: 8px;
}

.products-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.products-details {
  margin-top: 4px;
}

.products-toggle {
  cursor: pointer;
  color: var(--brand-accent);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 0;
  user-select: none;
  transition: color 0.2s;
}

.products-toggle:hover {
  color: var(--brand-primary-contrast);
}

.products-toggle::marker {
  color: var(--brand-accent);
}

.products-list {
  list-style: none;
  padding: 8px 0 0 0;
  margin: 4px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid var(--brand-border);
}

.product-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: var(--brand-surface);
  border-radius: 6px;
  font-size: 0.8rem;
}

.item-name {
  flex: 1;
  font-weight: 500;
  color: var(--brand-primary-contrast);
}

.item-quantity {
  background: var(--brand-accent);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.item-color {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: var(--brand-accent-alt);
}

.color-dot-small {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Estilos para cantidad mejorada */
.quantity-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.quantity-header {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--brand-accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  width: 100%;
}

.quantity-badge {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  display: inline-block;
  min-width: 40px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

.quantity-sublabel {
  font-size: 0.65rem;
  color: var(--brand-accent-alt);
  text-align: left;
  line-height: 1.2;
  width: 100%;
}

.quantity-label {
  font-size: 0.65rem;
  color: var(--brand-accent-alt);
  text-align: center;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .sales-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-card {
    padding: 12px;
  }

  .sales-table-container {
    overflow-x: scroll;
    padding: 12px;
    border-radius: 8px;
  }

  .sales-table {
    min-width: 400px;
    font-size: 0.75rem;
  }

  .sales-table th:last-child,
  .sales-table td:last-child {
    min-width: 80px;
    width: 80px;
  }

  .sales-table th {
    padding: 8px 6px;
    font-size: 0.7rem;
  }

  .sales-table td {
    padding: 8px 6px;
  }

  .customer-info {
    gap: 1px;
  }

  .customer-name {
    font-size: 0.8rem;
  }

  .customer-email {
    font-size: 0.7rem;
  }

  .product-name {
    font-size: 0.8rem;
  }

  .quantity {
    padding: 2px 6px;
    font-size: 0.7rem;
    min-width: 24px;
  }

  .amount {
    font-size: 0.8rem;
  }

  .status-badge {
    padding: 4px 8px;
    font-size: 0.65rem;
  }

  .date {
    font-size: 0.7rem;
  }
}

/* Estilos para la sección de showcase/novedades */
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.showcase-card {
  background: var(--brand-bg-end);
  border-radius: 16px;
  padding: 20px;
  border: 2px solid var(--brand-border);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.showcase-card:hover {
  border-color: var(--brand-accent);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.showcase-image {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
  background: var(--brand-border);
}

.showcase-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.showcase-info {
  flex: 1;
  margin-bottom: 15px;
}

.showcase-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 8px;
}

.showcase-description {
  color: var(--brand-accent-alt);
  font-size: 0.9rem;
  margin: 0 0 15px;
  line-height: 1.4;
}

.showcase-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.showcase-category {
  background: var(--brand-accent);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.showcase-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.showcase-status.available {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.showcase-status.unavailable {
  background: rgba(37, 99, 235, 0.15);
  /* azul */
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.25);
}

.showcase-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--brand-primary-contrast);
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--brand-success);
}

/* Estilos para upload de imágenes en showcase */
.image-tabs {
  display: flex;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #333;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #2a2a2a;
  color: rgba(255, 255, 255, 0.7);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab-btn.active {
  background: var(--brand-success);
  color: white;
}

.tab-btn:hover:not(.active) {
  background: #333;
  color: rgba(255, 255, 255, 0.9);
}

.image-input-section {
  margin-top: 0.5rem;
}

.file-input {
  display: none;
}

.file-upload-area {
  border: 2px dashed #333;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #1a1a1a;
}

.file-upload-area:hover {
  border-color: var(--brand-success);
  background: rgba(16, 185, 129, 0.05);
}

.upload-placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.upload-placeholder svg {
  color: #555;
  margin-bottom: 1rem;
}

.upload-placeholder p {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.upload-placeholder span {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-image:hover {
  background: #1d4ed8;
  transform: scale(1.1);
}

@media (max-width: 1400px) {
  .showcase-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1000px) {
  .showcase-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .showcase-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .admin-dashboard {
    padding: 8px;
  }

  .dashboard-title {
    font-size: 1.4rem;
  }

  .dashboard-subtitle {
    font-size: 0.85rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .stat-card {
    padding: 10px;
  }

  .stat-number {
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .stat-icon {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .tab {
    padding: 10px;
    text-align: center;
    border-radius: 8px;
  }

  .section-header h2 {
    font-size: 1.2rem;
  }

  .product-card {
    padding: 12px;
  }

  .product-info h3 {
    font-size: 1rem;
  }

  .product-description {
    font-size: 0.8rem;
    line-height: 1.3;
  }

  .price {
    font-size: 0.9rem;
  }

  .btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .modal-header h3 {
    font-size: 1.1rem;
  }

  .form-group label {
    font-size: 0.9rem;
  }

  .form-input,
  .form-textarea,
  .form-select {
    padding: 8px;
    font-size: 0.9rem;
  }

  .showcase-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .showcase-card {
    padding: 15px;
  }

  .showcase-image {
    height: 160px;
  }

  .showcase-info h3 {
    font-size: 1rem;
  }

  .showcase-description {
    font-size: 0.8rem;
  }

  .showcase-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .file-upload-area {
    padding: 1.2rem;
  }

  .upload-placeholder svg {
    width: 28px;
    height: 28px;
  }

  .upload-text {
    font-size: 0.8rem;
  }

  /* Sales section optimizations for very small screens */
  .sales-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 15px;
  }

  .sales-table-container {
    padding: 8px;
    margin: 0 -8px;
  }

  .sales-table {
    min-width: 350px;
    font-size: 0.7rem;
  }

  .sales-table th:last-child,
  .sales-table td:last-child {
    min-width: 90px;
    width: 90px;
  }

  .sales-table th {
    padding: 6px 4px;
    font-size: 0.65rem;
  }

  .sales-table td {
    padding: 6px 4px;
  }

  .customer-name {
    font-size: 0.75rem;
  }

  .customer-email {
    font-size: 0.65rem;
  }

  .product-name {
    font-size: 0.75rem;
  }

  .quantity {
    padding: 2px 4px;
    font-size: 0.65rem;
    min-width: 20px;
  }

  .amount {
    font-size: 0.75rem;
  }

  .status-badge {
    padding: 3px 6px;
    font-size: 0.6rem;
  }

  .date {
    font-size: 0.65rem;
  }
}

/* ============ ESTILOS PROFESIONALES PARA TARJETAS ============ */

/* Grillas para cada sección */
.clients-grid,
.services-grid,
.categories-grid,
.vehicles-grid,
.orders-grid,
.invoices-grid,
.inventory-grid,
.employees-grid,
.agenda-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

/* Layout para órdenes: 3 por fila por defecto */
.orders-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;
  padding-bottom: 6px;
}

.orders-row .pro-card {
  width: 100%;
  min-width: 0;
}

.clients-grid,
.vehicles-grid,
.orders-grid,
.invoices-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

/* Forzar 3 columnas en órdenes aunque también use la clase orders-grid */
.orders-grid.orders-row {
  grid-template-columns: repeat(3, 1fr);
}

.services-grid,
.categories-grid,
.employees-grid,
.agenda-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.inventory-grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

/* Estilos para tabla de inventario colapsable */
.inventory-group-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid var(--brand-border);
}

.inventory-group-row:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.inventory-item-row {
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--brand-border);
}

.inventory-item-row td {
  padding-top: 8px;
  padding-bottom: 8px;
}

.cash-group-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid var(--brand-border);
}

.cash-group-row:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.cash-item-row {
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--brand-border);
}

.cash-item-row td {
  padding-top: 8px;
  padding-bottom: 8px;
}

/* Estilos para tabla de nómina colapsable */
.payroll-group-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid var(--brand-border);
}

.payroll-group-row:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.payroll-item-row {
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--brand-border);
}

.payroll-item-row td {
  padding-top: 8px;
  padding-bottom: 8px;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

/* Estilos base para tarjetas profesionales */
.pro-card {
  background: linear-gradient(135deg, var(--brand-surface) 0%, var(--brand-bg-end) 100%);
  border: 1px solid var(--brand-border);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.pro-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
  pointer-events: none;
}

.pro-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--brand-success);
}

.pro-card:hover::before {
  left: 100%;
}

/* Estructura interna de la tarjeta */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 10px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  margin: 0 0 12px;
  word-break: break-word;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: var(--brand-accent-alt);
  position: relative;
  z-index: 1;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  line-height: 1.4;
}

.info-row .label {
  font-size: 1.1rem;
  min-width: 20px;
}

.info-row.highlight {
  background: rgba(16, 185, 129, 0.1);
  padding: 6px 8px;
  border-radius: 6px;
  color: var(--brand-success);
  font-weight: 600;
}

.info-row.note {
  font-size: 0.85rem;
  font-style: italic;
  opacity: 0.9;
  padding: 6px 8px;
  background: rgba(107, 114, 128, 0.08);
  border-radius: 6px;
}

/* Variante: mostrar label arriba y lista compacta debajo (usado en 'Tipo de servicio') */
.info-row.stacked {
  display: block;
  padding: 4px 0;
}

.info-row.stacked .label {
  display: block;
  margin-bottom: 6px;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--brand-accent-alt);
}

.type-list-ul {
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
}

.type-item {
  background: rgba(255, 255, 255, 0.04);
  color: var(--brand-accent-alt);
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 0.86rem;
  white-space: nowrap;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--brand-border);
  font-size: 0.85rem;
  color: var(--brand-accent-alt);
}

.card-footer .stat {
  flex: 1;
  text-align: center;
}

.card-footer .stat strong {
  display: block;
  font-size: 1.2rem;
  color: var(--brand-success);
}

/* Avatares */
.avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.3rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.emp-avatar {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  margin: 0 auto 12px;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

/* Badges de estado */
.type-badge,
.status-badge,
.price-badge,
.plate-badge,
.time-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.type-badge.frecuente {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: #0f5f4d;
}

.type-badge.moroso {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #5f1f0f;
}

.type-badge.nuevo {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #3d5a3d;
}

.status-badge {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.terminado,
.status-badge.completed,
.status-badge.pagado {
  background: linear-gradient(135deg, #86efac 0%, #4ade80 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.status-badge.en-proceso,
.status-badge.pending,
.status-badge.pendiente {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.status-badge.abonado,
.status-badge.abonada {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.status-badge.cancelado,
.status-badge.cancelled {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.status-badge.available {
  background: linear-gradient(135deg, #86efac 0%, #4ade80 100%);
  color: white;
}

.status-badge.recepcion {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

/* Ajuste compacto para el estado 'Pendiente' (columna más estrecha) */
.status-badge.pendiente,
.status-badge.pending {
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.12);
  transform: none;
  white-space: nowrap;
  display: inline-block;
}

/* Contenedor full-bleed para la tabla de facturas */
.invoices-fullwidth {
  box-sizing: border-box;
  padding: 12px 0px;
  background: transparent;
}

.invoices-fullwidth .invoices-table {
  width: 100%;
  table-layout: auto;
}

/* Mejorar responsividad: permitir scroll horizontal si es necesario */
.invoices-fullwidth .invoices-table.compact {
  overflow-x: auto;
}

.status-badge.diagnostico {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
}

.order-card.recepcion {
  border-left-color: #60a5fa;
}

.order-card.diagnostico {
  border-left-color: #7c3aed;
}

.order-card.en-proceso {
  border-left-color: #f59e0b;
}

.order-card.terminado {
  border-left-color: #16a34a;
}

.order-card {
  border-left: 1px solid rgba(56, 189, 248, 0.32);
  border-top: 1px solid rgba(56, 189, 248, 0.12);
  border-right: 1px solid rgba(56, 189, 248, 0.18);
  border-bottom: 1px solid rgba(8, 18, 32, 0.8);
  border-radius: 22px;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 32%),
    linear-gradient(180deg, rgba(8, 18, 32, 0.98) 0%, rgba(7, 16, 29, 0.98) 100%);
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.16),
    0 0 0 8px rgba(59, 130, 246, 0.02),
    0 20px 50px rgba(0, 0, 0, 0.46),
    0 0 26px rgba(59, 130, 246, 0.28);
  padding: 18px 16px 16px;
  color: #e5eefc;
  max-width: 100%;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.22),
    0 0 0 10px rgba(59, 130, 246, 0.03),
    0 26px 60px rgba(0, 0, 0, 0.54),
    0 0 38px rgba(59, 130, 246, 0.42);
}

.order-card::before {
  left: -120%;
  background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.14), transparent);
}

.order-card .card-title {
  margin: 0;
  font-size: 1.12rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f8fbff;
}

.order-top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.order-id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(56, 189, 248, 0.18);
  color: #38bdf8;
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.03), 0 0 14px rgba(56, 189, 248, 0.14);
}

.order-action-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.order-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  padding: 0 11px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.62);
  color: #dbeafe;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}

.order-action-btn svg {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  color: #e2e8f0;
}

.order-action-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(56, 189, 248, 0.22);
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.08), 0 12px 22px rgba(0, 0, 0, 0.28);
}

.order-action-btn.pdf {
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.92), rgba(5, 150, 105, 0.82));
  border-color: rgba(16, 185, 129, 0.28);
  color: #ecfdf5;
}

.order-action-btn.danger {
  background: linear-gradient(135deg, rgba(127, 29, 29, 0.94), rgba(153, 27, 27, 0.82));
  border-color: rgba(248, 113, 113, 0.22);
  color: #fff1f2;
}

.order-action-btn.success {
  background: linear-gradient(135deg, rgba(22, 101, 52, 0.92), rgba(34, 197, 94, 0.82));
  border-color: rgba(74, 222, 128, 0.28);
  color: #f0fdf4;
}

.order-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.order-icon-box {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.96), rgba(96, 165, 250, 0.92));
  box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.18), 0 0 18px rgba(59, 130, 246, 0.34);
  flex: 0 0 auto;
}

.order-icon-box svg {
  width: 22px;
  height: 22px;
  color: white;
}

.order-divider,
.order-bottom-divider {
  height: 1px;
  margin: 16px 0;
  background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.18), rgba(15, 23, 42, 0.9), rgba(56, 189, 248, 0.18), transparent);
}

.order-info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.order-info-card {
  min-height: 76px;
  padding: 11px 11px 10px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(12, 24, 45, 0.92), rgba(11, 20, 37, 0.88));
  border: 1px solid rgba(96, 165, 250, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 0 18px rgba(59, 130, 246, 0.08);
  overflow: hidden;
}

.order-info-icon {
  width: 18px;
  height: 18px;
  margin-bottom: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.order-info-icon svg {
  width: 18px;
  height: 18px;
}

.order-info-icon.blue {
  color: #60a5fa;
}

.order-info-icon.green {
  color: #34d399;
}

.order-info-icon.orange {
  color: #f59e0b;
}

.order-info-label {
  display: block;
  margin-bottom: 4px;
  color: #94a3b8;
  font-size: 0.74rem;
  line-height: 1.1;
}

.order-info-value {
  display: block;
  color: #f8fbff;
  font-size: 0.97rem;
  font-weight: 700;
  line-height: 1.2;
}

.order-status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  min-width: 0;
  margin-top: 2px;
  padding: 7px 10px;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  border-radius: 999px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
  align-self: flex-start;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.16), 0 0 18px rgba(37, 99, 235, 0.26);
  transform: translateZ(0);
}

.order-status-pill.recepcion {
  background: linear-gradient(135deg, #2563eb 0%, #38bdf8 100%);
  color: #ffffff;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.22), 0 0 20px rgba(37, 99, 235, 0.34);
}

.order-status-pill.diagnostico {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  color: #ffffff;
  box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.22), 0 0 20px rgba(124, 58, 237, 0.34);
}

.order-status-pill.en-proceso,
.order-status-pill.pending,
.order-status-pill.pendiente {
  background: linear-gradient(135deg, #f59e0b 0%, #fb7185 100%);
  color: #ffffff;
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.18), 0 0 20px rgba(245, 158, 11, 0.30);
}

.order-status-pill.terminado,
.order-status-pill.completed,
.order-status-pill.pagado {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: #ffffff;
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.2), 0 0 20px rgba(16, 185, 129, 0.32);
}

.order-status-pill.cancelado,
.order-status-pill.cancelled {
  background: linear-gradient(135deg, #ef4444 0%, #fb7185 100%);
  color: #ffffff;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.18), 0 0 20px rgba(239, 68, 68, 0.30);
}

.service-section {
  margin-top: 6px;
}

.service-title {
  margin-bottom: 10px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.type-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 14px;
  padding: 0 8px 0 3px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(96, 165, 250, 0.12);
  color: #cbd5e1;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 0 14px rgba(59, 130, 246, 0.06);
}

.type-chip-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  flex: 0 0 12px;
  color: #94a3b8;
  font-size: 14px;
  line-height: 1;
  transform: translateY(-1px);
}

.type-chip svg {
  width: 15px;
  height: 15px;
  color: #94a3b8;
  flex: 0 0 auto;
}

.order-extra-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.order-extra-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e2e8f0;
  font-size: 0.92rem;
}

.order-extra-icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
}

.order-extra-icon svg {
  width: 18px;
  height: 18px;
}

.order-extra-icon.purple {
  color: #8b5cf6;
}

.order-extra-icon.blue {
  color: #38bdf8;
}

.order-extra-label {
  color: #cbd5e1;
  font-weight: 600;
}

.order-extra-value {
  color: #f8fbff;
}

.flag-chip {
  background: rgba(96, 165, 250, 0.06);
  border: 1px solid rgba(96, 165, 250, 0.12);
  color: #cfe8ff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02), 0 0 8px rgba(96, 165, 250, 0.03);
}

.flag-gases {
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.12);
  color: #ffdc9f;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02), 0 0 8px rgba(245, 158, 11, 0.03);
}

.flag-gases .type-chip-dot {
  color: #f59e0b;
}

.flag-escaner {
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.10);
  color: #c8f8e6;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02), 0 0 8px rgba(16, 185, 129, 0.03);
}

.flag-escaner .type-chip-dot {
  color: #10b981;
}

.order-total-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 14px;
  margin-top: 2px;
  border-radius: 16px;
  background: linear-gradient(90deg, rgba(10, 17, 31, 0.98) 0%, rgba(18, 24, 39, 0.98) 52%, rgba(245, 158, 11, 0.14) 100%);
  border: 1px solid rgba(245, 158, 11, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 0 28px rgba(245, 158, 11, 0.11);
}

.order-total-label {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
}

.order-total-value {
  margin-left: auto;
  color: #f59e0b;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.order-total-icon {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: #fff7ed;
  box-shadow: 0 0 0 1px rgba(251, 191, 36, 0.18), 0 0 18px rgba(245, 158, 11, 0.46);
  flex: 0 0 auto;
}

.order-total-icon svg {
  width: 18px;
  height: 18px;
}

.order-card.recepcion .order-id-badge,
.order-card.diagnostico .order-id-badge,
.order-card.en-proceso .order-id-badge,
.order-card.terminado .order-id-badge {
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.16), 0 0 18px rgba(56, 189, 248, 0.18);
}

.card-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.empty {
  color: var(--brand-accent-alt);
  padding: 18px;
  text-align: center;
}

.price-badge {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 8px 14px;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.plate-badge {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: #fbbf24;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 10px;
  border: 2px solid #fbbf24;
}

.time-badge {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: white;
  font-size: 0.8rem;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Estilos específicos por tipo de tarjeta */
.client-card .card-footer {
  gap: 15px;
}

.vehicle-card .card-body p {
  margin: 4px 0;
}

.order-card {
  border-left: 4px solid var(--brand-success);
}

.order-card .order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.order-id {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--brand-success);
}

.invoice-card {
  border-left: 4px solid #f59e0b;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.invoice-num {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f59e0b;
}

.invoice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--brand-border);
  gap: 10px;
}

.total-amount {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--brand-success);
}

.payment-method {
  font-size: 0.8rem;
  color: var(--brand-accent-alt);
  background: rgba(59, 130, 246, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.category-label {
  font-size: 0.8rem;
  color: var(--brand-accent-alt);
  background: rgba(102, 126, 234, 0.1);
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  margin-bottom: 10px;
}

.stock-info {
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(34, 197, 94, 0.1);
  color: var(--brand-success);
  font-weight: 600;
}

.stock-info.low {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid var(--brand-border);
  font-size: 0.85rem;
}

.cost,
.price {
  font-weight: 600;
}

.cost {
  color: var(--brand-accent-alt);
}

.price {
  color: var(--brand-success);
}

.role-label {
  font-size: 0.85rem;
  color: var(--brand-success);
  font-weight: 600;
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.emp-stats {
  text-align: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--brand-border);
}

.stat-num {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--brand-success);
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--brand-accent-alt);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.agenda-card {
  border-left: 4px solid #60a5fa;
}

.date-footer {
  padding-top: 12px;
  border-top: 1px solid var(--brand-border);
  font-size: 0.8rem;
  color: var(--brand-accent-alt);
  font-weight: 600;
}

.report-card {
  display: flex;
  flex-direction: column;
}

.report-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  margin: 0 0 12px;
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.report-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--brand-success);
  transition: all 0.2s ease;
}

.report-item:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateX(2px);
}

.report-label {
  font-size: 0.9rem;
  color: var(--brand-accent-alt);
  font-weight: 600;
}

.report-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--brand-success);
}

.service-card .card-footer {
  gap: 10px;
}

.card-description {
  color: var(--brand-accent-alt);
  font-size: 0.9rem;
  margin: 0 0 12px;
  line-height: 1.4;
}

/* Barra de título de sección */
.section-title-bar {
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 12px;

}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Media queries para responsividad */
@media (max-width: 1200px) {

  .clients-grid,
  .vehicles-grid,
  .invoices-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .orders-grid.orders-row {
    grid-template-columns: repeat(3, 1fr);
  }

  .reports-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {

  .clients-grid,
  .vehicles-grid,
  .invoices-grid,
  .services-grid,
  .categories-grid,
  .employees-grid,
  .agenda-grid,
  .inventory-grid {
    grid-template-columns: 1fr;
  }

  .orders-grid.orders-row {
    grid-template-columns: 1fr;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }

  .pro-card {
    padding: 16px;
  }

  .card-footer {
    flex-direction: column;
    gap: 8px;
  }

  .card-footer .stat {
    text-align: left;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .price-row {
    flex-direction: column;
    gap: 8px;
  }

  .invoice-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Estilos para tabla de clientes bonita y responsiva */
.table-responsive {
  overflow-x: auto;
  margin-top: 12px;
}

.simple-table {
  width: 100%;
  border-collapse: collapse;
  background: linear-gradient(180deg, var(--brand-bg-end) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid var(--brand-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(2, 6, 23, 0.45);
}

.simple-table thead th {
  background: var(--brand-surface);
  color: var(--brand-primary-contrast);
  font-weight: 700;
  padding: 14px 18px;
  text-align: center;
  font-size: 0.8rem;
  border-bottom: 1px solid var(--brand-border);
}

.simple-table tbody td {
  padding: 12px 18px;
  color: var(--brand-accent-alt);
  vertical-align: middle;
  font-size: 0.8rem;
  text-align: center;
}

.simple-table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.01);
}

.simple-table tbody tr:hover {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.03));
}

.simple-table td .client-name {
  font-weight: 700;
  color: var(--brand-primary-contrast);
}

.simple-table td .client-email {
  display: block;
  color: var(--brand-accent-alt);
  font-size: 0.9rem;
  margin-top: 4px;
}

.simple-table td .client-notes {
  color: var(--brand-accent-alt);
  font-size: 0.9rem;
}

.simple-table .actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* Botones de acción más compactos y consistentes */
.btn-sm {
  padding: 8px 10px;
  font-size: 0.65rem;
  border-radius: 8px;
}

@media (max-width: 720px) {
  .simple-table thead th {
    display: none;
  }

  .simple-table,
  .simple-table tbody,
  .simple-table tr,
  .simple-table td {
    display: block;
    width: 100%;
  }

  .simple-table tr {
    margin-bottom: 12px;
    border-bottom: 1px solid var(--brand-border);
  }

  .simple-table td {
    padding: 12px;
    text-align: center;
  }

  .simple-table td::before {
    content: attr(data-label);
    display: block;
    font-weight: 700;
    color: var(--brand-accent-alt);
    margin-bottom: 6px;
    font-size: 0.8rem;
    text-align: center;
  }

  .simple-table td .actions {
    justify-content: flex-start;
    margin-top: 8px;
  }
}

/* Ajustes de ancho y recorte para columna Notas / Nombre / Fecha */
.simple-table td[data-label="Notas"] {
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Permitir que Tipo servicio y Diagnóstico se envuelvan y no rompan el layout */
.simple-table td[data-label="Tipo servicio"],
.simple-table td[data-label="Diagnóstico / Servicios"] {
  max-width: 260px;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  text-align: left;
}

/* Asegurar que la columna acciones tenga espacio para botones */
.simple-table td[data-label="Acciones"] .actions {
  gap: 6px;
}

.simple-table td[data-label="Nombre"] {
  /* dar un poco más de espacio al nombre */
  min-width: 180px;
}

.simple-table td[data-label="Fecha de Registro"] {
  /* dar un poco más de espacio a la fecha */
  min-width: 120px;
}

/* Dashboard styles */
.dashboard-grid {
  display: grid;
  gap: 18px;
}

.kpi-row {
  display: flex;
  gap: 12px;
}

.kpi-card {
  flex: 1 1 0;
  background: var(--brand-bg-end);
  border: 1px solid var(--brand-border);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}

.kpi-label {
  color: var(--brand-accent-alt);
  font-size: 0.85rem;
}

.kpi-value {
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--brand-success);
  margin-top: 6px;
}

.charts-row {
  display: flex;
  gap: 16px;
  align-items: stretch;
}

.chart-card {
  background: var(--brand-bg-end);
  border: 1px solid var(--brand-border);
  border-radius: 10px;
  padding: 12px;
  flex: 1;
  box-sizing: border-box;
}

.chart-card.small {
  max-width: 320px;
}

.chart-card.donut-card {
  flex: 1 1 70%;
  max-width: 59%;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 0 0 40%;
  max-width: 50%;
  box-sizing: border-box;
}

.line-chart {
  width: 100%;
  height: 120px;
  display: block;
}

.donut {
  width: 120px;
  height: 120px;
  display: block;
  margin: 6px auto;
}

.donut-bg {
  stroke: #e6eef8;
}

.donut-complete {
  transform: rotate(-90deg);
  transform-origin: center;
  stroke-linecap: round;
}

.donut-text {
  font-size: 0.75rem;
  fill: var(--brand-primary-contrast);
}

.status-list,
.upcoming-list {
  list-style: none;
  padding: 0;
  margin: 0;
  color: var(--brand-accent-alt);
}

.bars {
  padding-top: 6px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 0;
}

.bar-label {
  width: 35%;
  color: var(--brand-accent-alt);
  font-size: 0.95rem;
}

.bar {
  height: 20px;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
  border-radius: 6px;
  color: #fff;
  padding: 2px 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.card.wide {
  flex: 1 1 60%;
}

.card.small {
  flex: 1 1 30%;
}

.mini-chart .rev {
  background: linear-gradient(90deg, #10b981, #059669);
}

.mini-chart .cost {
  background: linear-gradient(90deg, #f97316, #f43f5e);
}

.table.small-table {
  width: 100%;
  border-collapse: collapse;
}

.table.small-table th,
.table.small-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--brand-border);
  text-align: left;
}

@media (max-width: 900px) {
  .charts-row {
    flex-direction: column;
  }

  .right-column {
    flex: 1 1 100%;
    max-width: 100%;
    width: 100%;
  }

  .chart-card.donut-card {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .kpi-row {
    flex-direction: column;
  }
}

/* ApexCharts tweaks for dark theme and better contrast */
.chart-card .apexcharts-canvas,
.chart-card .apexcharts-svg,
.chart-card .apexcharts-canvas svg {
  background: transparent !important;
}

.apexcharts-tooltip {
  background: rgba(10, 10, 10, 0.92) !important;
  color: #fff !important;
  border-radius: 8px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6) !important;
  padding: 8px 10px !important;
}

.apexcharts-tooltip .apexcharts-tooltip-title {
  color: #fff !important;
  font-weight: 700;
}

.apexcharts-legend-text,
.apexcharts-legend-marker {
  fill: var(--brand-accent-alt) !important;
  color: var(--brand-accent-alt) !important;
}

.chart-legend .legend-item {
  color: var(--brand-accent-alt);
  font-size: 0.85rem;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  display: inline-block;
  margin-right: 6px;
}

.donut-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
}

/* Mini chart contrast and labels */
.mini-chart .rev,
.mini-chart .cost {
  color: #fff;
  padding: 6px 8px;
  border-radius: 6px;
  font-weight: 700;
  display: inline-block;
}

/* Force apexcharts legend text color in dark theme */
.apexcharts-legend .apexcharts-legend-text {
  fill: var(--brand-accent-alt) !important;
}

/* Chips para lista de servicios */
.chip {
  background: #eef2ff;
  color: #0f172a;
  padding: 6px 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.chip .btn,
.chip .btn-sm {
  padding: 0 6px;
  min-width: 0;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  color: #0f172a;
}

.chip .btn:hover,
.chip .btn-sm:hover {
  background: rgba(0, 0, 0, 0.06);
}

.chip small {
  color: var(--brand-accent-alt);
  margin-left: 6px;
  font-size: 0.85rem;
}

/* Ajustes para el input+botón de agregar servicio dentro del modal */
.form-group .form-input {
  min-width: 0;
}

.form-group .form-input[placeholder] {
  color: inherit;
}

.form-group>div[style] {
  align-items: center;
}
</style>

<style>
/* Estilos para impresión: mostrar sólo .print-area durante print */
.print-area {
  display: none;
}

@media print {

  /* Ocultar todo el contenido del documento para evitar que elementos invisibles sigan ocupando espacio */
  body * {
    display: none !important;
  }

  /* Mostrar únicamente la zona preparada para imprimir */
  .print-area,
  .print-area * {
    display: revert !important;
  }

  .print-area {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    width: 100% !important;
    background: #fff !important;
    color: #000 !important;
    padding: 0 !important;
    margin: 0 auto !important;
  }

  /* ======= Factura moderna ======= */
  .inv-sheet {
    max-width: 210mm;
    margin: 0 auto;
    background: #fff !important;
    color: #111827 !important;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif !important;
    padding: 16mm 14mm;
    box-sizing: border-box;
  }

  .inv-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1.5px solid #e5e7eb;
  }

  .inv-brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .inv-logo {
    height: 70px;
    width: auto;
    object-fit: contain;
    border-radius: 10px;
  }

  .inv-brand-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .inv-company {
    font-size: 20pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .inv-tagline {
    font-size: 9.5pt;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  .inv-badge-wrap {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .inv-doc-type {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #9ca3af;
  }

  .inv-doc-number {
    font-size: 18pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .inv-date {
    font-size: 9.5pt;
    color: #6b7280;
  }

  .inv-status {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 4px;
  }

  .inv-status.pagado,
  .inv-status.paid {
    background: #d1fae5 !important;
    color: #065f46 !important;
  }

  .inv-status.pendiente,
  .inv-status.pending {
    background: #fef3c7 !important;
    color: #92400e !important;
  }

  .inv-status.anulado,
  .inv-status.cancelled {
    background: #fee2e2 !important;
    color: #991b1b !important;
  }

  .inv-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .inv-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .inv-card-title {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #9ca3af;
    font-weight: 600;
    margin-bottom: 2px;
  }

  .inv-card-body {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .inv-line {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 9pt;
    line-height: 1.35;
  }

  .inv-label {
    color: #6b7280;
    font-weight: 500;
  }

  .inv-val {
    color: #111827;
    font-weight: 600;
    text-align: right;
  }

  .inv-qr {
    font-family: monospace;
    font-size: 7pt;
    line-height: 1.15;
    color: #111827;
    text-align: center;
    letter-spacing: 0.12em;
    white-space: pre;
    margin-bottom: 4px;
  }

  .inv-qr-hint {
    font-size: 7.5pt;
    color: #6b7280;
    text-align: center;
  }

  .inv-table-wrap {
    margin-bottom: 18px;
  }

  .inv-section-title {
    font-size: 10pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #374151;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1.5px solid #e5e7eb;
  }

  .inv-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 9.5pt;
  }

  .inv-table thead th {
    background: #f3f4f6;
    color: #374151;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 8pt;
    letter-spacing: 0.06em;
    padding: 8px 10px;
    border-bottom: 1.5px solid #d1d5db;
    text-align: left;
  }

  .inv-table tbody td {
    padding: 8px 10px;
    border-bottom: 1px solid #e5e7eb;
    color: #1f2937;
    vertical-align: middle;
  }

  .inv-table tbody tr:last-child td {
    border-bottom: 1.5px solid #d1d5db;
  }

  .inv-col-num { width: 5%; text-align: center; }
  .inv-col-desc { width: 44%; }
  .inv-col-qty { width: 9%; text-align: center; }
  .inv-col-price { width: 16%; text-align: right; }
  .inv-col-tax { width: 10%; text-align: center; }
  .inv-col-total { width: 16%; text-align: right; font-weight: 700; }

  .inv-summary {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }

  .inv-summary-box {
    width: 260px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .inv-row {
    display: flex;
    justify-content: space-between;
    font-size: 9.5pt;
    color: #4b5563;
  }

  .inv-row-label {
    font-weight: 500;
  }

  .inv-row-val {
    font-weight: 600;
    color: #111827;
  }

  .inv-total-row {
    border-top: 1.5px solid #d1d5db;
    padding-top: 8px;
    margin-top: 2px;
    font-size: 12pt;
    color: #0f172a;
  }

  .inv-total-row .inv-row-label,
  .inv-total-row .inv-row-val {
    font-weight: 800;
  }

  .inv-photos {
    margin-bottom: 20px;
  }

  .inv-notes {
    margin-bottom: 20px;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
  }

  .inv-photo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .inv-photo-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .inv-photo-label {
    font-size: 8.5pt;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .inv-photo-thumb {
    width: 100%;
    height: 120px;
    background: #f3f4f6;
    border: 1.5px dashed #d1d5db;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9pt;
    color: #9ca3af;
  }

  .inv-signatures {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 18px;
    padding: 0 20px;
  }

  .inv-sig-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .inv-sig-line {
    width: 100%;
    border-bottom: 1.5px solid #9ca3af;
    height: 40px;
  }

  .inv-sig-label {
    font-size: 8.5pt;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }

  .inv-sig-name {
    font-size: 9pt;
    color: #111827;
    font-weight: 700;
  }

  .inv-footer {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    border-top: 1.5px solid #e5e7eb;
    padding-top: 12px;
    margin-top: 4px;
  }

  .inv-footer-col {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 8.5pt;
    color: #6b7280;
    text-align: center;
  }

  .inv-footer-icon {
    font-size: 10pt;
  }

  /* ======= Orden de servicio (mantener existente) ======= */
  .service-order-card {
    max-width: 860px;
    margin: 0 auto;
    padding: 0;
    font-size: 12pt;
    background: #fff !important;
    border: 1px solid #d8deea;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 10px 32px rgba(15, 23, 42, 0.12);
    position: relative;
  }

  .so-topbar {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: 16px;
    padding: 22px 24px;
    background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 48%, #38bdf8 100%);
    color: #fff;
  }

  .so-brand {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .so-logo {
    width: 72px;
    height: auto;
    flex: 0 0 auto;
    filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.22));
  }

  .so-brand-copy {
    min-width: 0;
  }

  .so-kicker {
    margin: 0 0 4px 0;
    font-size: 9pt;
    letter-spacing: .18em;
    text-transform: uppercase;
    opacity: .82;
  }

  .so-brand-copy h1 {
    margin: 0;
    line-height: 1.02;
    font-size: 22pt;
  }

  .so-subtitle {
    margin: 4px 0 0 0;
    font-size: 10pt;
    opacity: .84;
  }

  .so-number {
    align-self: center;
    text-align: right;
    background: rgba(255, 255, 255, .14);
    border: 1px solid rgba(255, 255, 255, .22);
    padding: 12px 16px;
    border-radius: 14px;
    min-width: 132px;
  }

  .so-number span {
    display: block;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: .14em;
    opacity: .78;
  }

  .so-number strong {
    display: block;
    margin-top: 4px;
    font-size: 20pt;
    line-height: 1;
  }

  .so-meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 18px 24px 0 24px;
  }

  .so-meta-card {
    border: 1px solid rgba(15, 23, 42, 0.03);
    background: #ffffff;
    border-radius: 14px;
    padding: 12px 14px;
  }

  .so-meta-card span {
    display: block;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: #9ca3af;
    margin-bottom: 6px;
  }

  .so-meta-card strong {
    display: block;
    font-size: 11pt;
    color: #111827;
    line-height: 1.25;
  }

  .so-section-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 12px;
    padding: 18px 24px 24px 24px;
  }

  .so-panel {
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    background: #fff;
    overflow: hidden;
  }

  .so-panel-wide {
    grid-column: 1 / -1;
  }

  .so-panel-title {
    padding: 11px 14px;
    background: #f1f5f9;
    color: #0f172a;
    font-size: 9.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .08em;
  }

  .so-panel-body {
    padding: 14px;
    font-size: 12pt;
    line-height: 1.6;
    color: #1e293b;
    white-space: pre-wrap;
  }

  @page {
    margin: 10mm 8mm;
    size: A4 portrait;
  }
}

/* ============ DASHBOARD PROFESIONAL ============ */

.dashboard-professional-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

.dashboard-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dashboard-header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.dashboard-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  letter-spacing: -0.02em;
  margin: 0;
}

.dashboard-subtitle {
  margin: 2px 0 0;
  color: var(--brand-accent-alt);
  font-size: 0.85rem;
}

.dashboard-header-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-user-name {
  padding: 8px 18px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2));
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #e2e8f0;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.dashboard-user-name:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.35), rgba(99, 102, 241, 0.35));
  border-color: rgba(99, 102, 241, 0.5);
}

.dashboard-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-date {
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: var(--brand-accent-alt);
  font-size: 0.85rem;
  font-weight: 500;
}

/* Métricas */
.dashboard-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.dashboard-metric-card {
  background: var(--brand-surface);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 14px;
  padding: 12px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 0;
}

.dashboard-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.dashboard-metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dashboard-metric-icon svg {
  width: 16px;
  height: 16px;
}

.dashboard-metric-icon.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.dashboard-metric-icon.green {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.dashboard-metric-icon.orange {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.dashboard-metric-icon.purple {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.dashboard-metric-icon.red {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.dashboard-metric-icon.teal {
  background: rgba(20, 184, 166, 0.15);
  color: #2dd4bf;
}

.dashboard-metric-icon.blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.dashboard-metric-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  line-height: 1.2;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard-metric-label {
  font-size: 0.7rem;
  color: var(--brand-accent-alt);
  margin: 2px 0 0;
  line-height: 1.2;
}

/* Panel */
.dashboard-panel {
  background: var(--brand-surface);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 20px;
}

.dashboard-panel-header {
  padding: 18px 24px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-panel-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-panel-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.dashboard-panel-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0;
}

.dashboard-panel-subtitle {
  margin: 2px 0 0;
  color: var(--brand-accent-alt);
  font-size: 0.8rem;
}

.dashboard-panel-filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dashboard-date-range {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--brand-bg-end);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  padding: 6px 10px;
}

.dashboard-date-input {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.5);
  color: var(--brand-primary-contrast);
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
  font-family: inherit;
}

.dashboard-date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.7);
  cursor: pointer;
}

.dashboard-date-separator {
  color: var(--brand-accent-alt);
  font-size: 0.9rem;
  font-weight: 500;
}

.dashboard-date-clear {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  margin-left: 4px;
}

.dashboard-date-clear:hover {
  background: rgba(239, 68, 68, 0.3);
}

/* Filtro de métricas principales */
.dashboard-metrics-filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.dashboard-metrics-filter-tabs {
  display: flex;
  gap: 4px;
  background: var(--brand-bg-end);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  padding: 4px;
}

.dashboard-metrics-filter-tab {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--brand-accent-alt);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.dashboard-metrics-filter-tab:hover {
  color: var(--brand-primary);
}

.dashboard-metrics-filter-tab.active {
  background: var(--brand-primary);
  color: #fff;
  font-weight: 600;
}

.dashboard-metrics-filter-inputs {
  display: flex;
  align-items: center;
}

.dashboard-panel-body {
  padding: 20px 24px;
}

/* Performance */
.dashboard-performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.dashboard-performance-card {
  background: var(--brand-bg-end);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 14px;
  padding: 18px;
  transition: transform 0.2s;
}

.dashboard-performance-card:hover {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.2);
}

.dashboard-performance-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.dashboard-tech-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
}

.dashboard-tech-info h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0;
}

.dashboard-tech-info span {
  font-size: 0.75rem;
  color: var(--brand-accent-alt);
}

.dashboard-performance-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.dashboard-perf-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dashboard-perf-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
}

.dashboard-perf-label {
  font-size: 0.72rem;
  color: var(--brand-accent-alt);
}

.dashboard-performance-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dashboard-progress-bar {
  height: 6px;
  background: rgba(148, 163, 184, 0.15);
  border-radius: 3px;
  overflow: hidden;
}

.dashboard-progress-fill {
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #6366f1);
  border-radius: 3px;
  transition: width 0.6s ease;
}

.dashboard-progress-label {
  font-size: 0.72rem;
  color: var(--brand-accent-alt);
  text-align: right;
}

/* Charts */
.dashboard-charts-row {
  display: flex;
  gap: 18px;
  margin-bottom: 18px;
}

.dashboard-chart-card {
  background: var(--brand-surface);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 16px;
  padding: 18px;
  flex: 1;
}

.dashboard-chart-card.wide {
  flex: 2;
}

.dashboard-chart-card.small {
  flex: 1;
}

.dashboard-chart-card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 14px;
}

.dashboard-donut-area {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-donut-wrap {
  flex: 0 0 auto;
}

.dashboard-donut-legend {
  flex: 1;
}

.dashboard-status-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dashboard-status-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  color: var(--brand-accent-alt);
}

.dashboard-legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}

.dashboard-legend-text {
  font-weight: 600;
  margin-left: 4px;
}

.dashboard-legend-value {
  margin-left: auto;
  font-weight: 700;
  color: var(--brand-primary-contrast);
}

.dashboard-side-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.dashboard-upcoming-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dashboard-upcoming-list li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  color: var(--brand-accent-alt);
  font-size: 0.85rem;
}

.dashboard-upcoming-date {
  font-weight: 600;
  color: var(--brand-primary-contrast);
}

.dashboard-upcoming-time {
  font-size: 0.8rem;
}

.dashboard-upcoming-client {
  font-size: 0.8rem;
  color: var(--brand-accent-alt);
}

/* Próximas Citas Destacadas */
.dashboard-upcoming-section {
  background: var(--brand-surface);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.dashboard-upcoming-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.dashboard-upcoming-header-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-upcoming-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0;
}

.dashboard-upcoming-subtitle {
  margin: 2px 0 0;
  color: var(--brand-accent-alt);
  font-size: 0.8rem;
}

.dashboard-upcoming-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.dashboard-upcoming-card {
  background: var(--brand-bg-end);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.2s;
}

.dashboard-upcoming-card:hover {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.2);
}

.dashboard-upcoming-card-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  padding: 6px;
  background: rgba(59, 130, 246, 0.15);
  border-radius: 10px;
  color: #60a5fa;
}

.dashboard-upcoming-day {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
}

.dashboard-upcoming-month {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.dashboard-upcoming-card-info {
  flex: 1;
  min-width: 0;
}

.dashboard-upcoming-card-time {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
}

.dashboard-upcoming-card-client {
  font-size: 0.8rem;
  color: var(--brand-accent-alt);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard-upcoming-card-service {
  font-size: 0.72rem;
  color: var(--brand-accent-alt);
  opacity: 0.8;
}

.dashboard-upcoming-card-status {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
  white-space: nowrap;
}

.dashboard-upcoming-card-status.pending {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.dashboard-upcoming-card-status.confirmed {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.dashboard-upcoming-card-status.completed {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.dashboard-upcoming-card-status.cancelled {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

/* Estado de Órdenes Mejorado */
.dashboard-orders-status-panel {
  background: var(--brand-surface);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.dashboard-orders-status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.dashboard-orders-status-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-orders-status-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-orders-status-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0;
}

.dashboard-orders-status-subtitle {
  margin: 2px 0 0;
  color: var(--brand-accent-alt);
  font-size: 0.8rem;
}

/* Dos columnas: Órdenes + Facturación */
.dashboard-two-columns {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.dashboard-two-columns > * {
  flex: 1;
  min-width: 0;
}

/* Panel Órdenes */
.dashboard-orders-status-panel {
  background: var(--brand-surface);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
  padding: 20px 24px;
}

.dashboard-orders-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.dashboard-status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--brand-bg-end);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px;
  transition: transform 0.2s;
}

.dashboard-status-item:hover {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.2);
}

.dashboard-status-item-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dashboard-status-item-icon.recepcion {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.dashboard-status-item-icon.diagnostico {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.dashboard-status-item-icon.en-proceso {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.dashboard-status-item-icon.terminado {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.dashboard-status-item-icon.entregado {
  background: rgba(20, 184, 166, 0.15);
  color: #2dd4bf;
}

.dashboard-status-item-icon.default {
  background: rgba(148, 163, 184, 0.15);
  color: #94a3b8;
}

.dashboard-status-item-info {
  flex: 1;
  min-width: 0;
}

.dashboard-status-item-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin-bottom: 6px;
}

.dashboard-status-item-bar {
  height: 6px;
  background: rgba(148, 163, 184, 0.15);
  border-radius: 3px;
  overflow: hidden;
}

.dashboard-status-item-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
  background: linear-gradient(to right, #3b82f6, #6366f1);
}

.dashboard-status-item-count {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  min-width: 30px;
  text-align: right;
}

.dashboard-status-item-pct {
  font-size: 0.75rem;
  color: var(--brand-accent-alt);
  min-width: 36px;
  text-align: right;
}

/* Garantías en Técnicos */
.dashboard-warranty-section {
  margin-bottom: 12px;
  padding: 10px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-radius: 8px;
}

.dashboard-warranty-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.dashboard-warranty-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #f87171;
}

.dashboard-warranty-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: #f87171;
}

.dashboard-warranty-bar {
  height: 4px;
  background: rgba(239, 68, 68, 0.15);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 6px;
}

.dashboard-warranty-fill {
  height: 100%;
  background: linear-gradient(to right, #ef4444, #f87171);
  border-radius: 2px;
  transition: width 0.6s ease;
}

.dashboard-warranty-sub {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--brand-accent-alt);
}

.dashboard-empty {
  text-align: center;
  padding: 16px;
  color: var(--brand-accent-alt);
  font-size: 0.85rem;
}

/* Resumen Órdenes (Activas vs Terminadas) */
.dashboard-orders-summary {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
}

.dashboard-orders-summary-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  background: var(--brand-bg-end);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.dashboard-orders-summary-item.active {
  border-color: rgba(59, 130, 246, 0.2);
  background: rgba(59, 130, 246, 0.05);
}

.dashboard-orders-summary-item.finished {
  border-color: rgba(34, 197, 94, 0.2);
  background: rgba(34, 197, 94, 0.05);
}

.dashboard-orders-summary-item.completed {
  border-color: rgba(251, 191, 36, 0.2);
  background: rgba(251, 191, 36, 0.05);
}

.dashboard-orders-summary-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dashboard-orders-summary-item.active .dashboard-orders-summary-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.dashboard-orders-summary-item.finished .dashboard-orders-summary-icon {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.dashboard-orders-summary-item.completed .dashboard-orders-summary-icon {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.dashboard-orders-summary-info {
  flex: 1;
  min-width: 0;
}

.dashboard-orders-summary-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  line-height: 1.2;
}

.dashboard-orders-summary-label {
  font-size: 0.75rem;
  color: var(--brand-accent-alt);
}

.dashboard-orders-summary-pct {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--brand-accent-alt);
}

/* Panel Facturación */
.dashboard-invoices-panel {
  background: var(--brand-surface);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 18px;
  padding: 20px 24px;
}

.dashboard-invoices-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.dashboard-invoices-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-invoices-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(16, 185, 129, 0.15);
  color: #4ade80;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-invoices-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0;
}

.dashboard-invoices-subtitle {
  margin: 2px 0 0;
  color: var(--brand-accent-alt);
  font-size: 0.8rem;
}

.dashboard-orders-pie-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-top: 16px;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.dashboard-invoices-pie-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-bottom: 16px;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.dashboard-invoices-stats {
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 16px;
  margin-top: 25px;
}

.dashboard-invoices-stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--brand-bg-end);
  border: 1px solid rgba(148, 163, 184, 0.1);
}

.dashboard-invoices-stat-item.paid {
  border-color: rgba(34, 197, 94, 0.2);
  background: rgba(34, 197, 94, 0.05);
}

.dashboard-invoices-stat-item.pending {
  border-color: rgba(251, 191, 36, 0.2);
  background: rgba(251, 191, 36, 0.05);
}

.dashboard-invoices-stat-item.deposit {
  border-color: rgba(59, 130, 246, 0.2);
  background: rgba(59, 130, 246, 0.05);
}

.dashboard-invoices-stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dashboard-invoices-stat-item.paid .dashboard-invoices-stat-icon {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.dashboard-invoices-stat-item.pending .dashboard-invoices-stat-icon {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.dashboard-invoices-stat-item.deposit .dashboard-invoices-stat-icon {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.dashboard-invoices-stat-info {
  flex: 1;
  min-width: 0;
}

.dashboard-invoices-stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  line-height: 1.2;
}

.dashboard-invoices-stat-label {
  font-size: 0.75rem;
  color: var(--brand-accent-alt);
}

.dashboard-invoices-stat-money {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  white-space: nowrap;
}

/* Financial */
.dashboard-financial-row {
  display: flex;
  gap: 18px;
}

.dashboard-chart-area {
  min-height: 180px;
}

.dashboard-mini-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.dashboard-bar {
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  transition: width 0.6s ease;
}

.dashboard-bar.rev {
  background: linear-gradient(90deg, #3b82f6, #6366f1);
}

.dashboard-bar.cost {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.dashboard-mini-chart-legend {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: var(--brand-accent-alt);
}

.dashboard-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.dashboard-dot.rev {
  background: #3b82f6;
}

.dashboard-dot.cost {
  background: #ef4444;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-charts-row {
    flex-direction: column;
  }

  .dashboard-financial-row {
    flex-direction: column;
  }

  .dashboard-upcoming-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-professional-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .dashboard-metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .dashboard-performance-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .dashboard-upcoming-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-orders-status-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-two-columns {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .dashboard-metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-title {
    font-size: 1.3rem;
  }

  .dashboard-upcoming-card {
    padding: 10px;
  }
}

/* Ocultar scrollbar en calendario y panel lateral */
.pro-card::-webkit-scrollbar,
.calendar-cell::-webkit-scrollbar {
  width: 0px;
  height: 0px;
  background: transparent;
}

.pro-card {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.calendar-cell {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* Calendar Events */
.calendar-event {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  line-height: 1.2;
  min-height: 16px;
  flex-shrink: 0;
}

.calendar-event.order-event {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.2);
  color: #93bbfc;
}

.calendar-event.agenda-event {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.2);
  color: #86efac;
  cursor: pointer;
}

.calendar-event.agenda-event:hover {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
}

.event-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  flex-shrink: 0;
}

.event-dot.blue {
  background: #3b82f6;
}

.event-dot.green {
  background: #22c55e;
}

.event-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Agenda List Items */
.agenda-list-item {
  padding: 8px 10px;
  border-radius: 8px;
  margin-bottom: 6px;
  border-left: 3px solid transparent;
  background: rgba(148, 163, 184, 0.05);
  transition: all 0.2s ease;
}

.agenda-list-item:hover {
  background: rgba(148, 163, 184, 0.1);
}

.agenda-item-green {
  border-left-color: #22c55e;
  background: rgba(34, 197, 94, 0.05);
  cursor: pointer;
}

.agenda-item-green:hover {
  background: rgba(34, 197, 94, 0.1);
}

.agenda-item-blue {
  border-left-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.agenda-item-blue:hover {
  background: rgba(59, 130, 246, 0.1);
}
</style>
