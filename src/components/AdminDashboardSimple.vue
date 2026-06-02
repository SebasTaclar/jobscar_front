<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">
        <span class="icon">⚙️</span>
        Panel de Administración - JOB'S CAR
      </h1>
      <p class="dashboard-subtitle">Gestiona clientes, servicios, vehículos y reportes del taller</p>
    </div>
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
                  <input v-model="editingVehicle.plate" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Marca</label>
                  <input v-model="editingVehicle.brand" type="text" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label>Modelo</label>
                <input v-model="editingVehicle.model" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>Km Actual</label>
                <input v-model="editingVehicle.km" type="number" class="form-input" />
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
                <textarea v-model="editingVehicle.observations" class="form-input" rows="3"></textarea>
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



    <!-- Pestaña: Clientes
    <div v-if="activeTab === 'clients'" class="content-section">
      <div class="section-title-bar">
        <h2 class="section-title">👥 Clientes</h2>
      </div>
      <div class="clients-grid">
        <div v-for="client in burnedClients" :key="client.id" class="pro-card client-card">
          <div class="card-header">
            <div class="avatar-large">{{ client.name.charAt(0).toUpperCase() }}</div>
            <div class="type-badge" :class="client.type">{{ client.type }}</div>
          </div>
          <h3 class="card-title">{{ client.name }}</h3>
          <div class="card-body">
            <p class="info-row"><span class="label">📞</span> {{ client.phone }}</p>
            <p class="info-row"><span class="label">✉️</span> {{ client.email }}</p>
            <p class="info-row highlight"><span class="label">🔔</span> {{ getReminderTypeDisplay(client) }}</p>
            <p class="info-row note"><span class="label">📝</span> {{ client.notes }}</p>
          </div>
          <div class="card-footer">
            <div class="stat"><strong>{{ client.totalOrders }}</strong> órdenes</div>
            <div class="stat"><strong>${{ (client.totalSpent / 1000).toFixed(0) }}k</strong> gastado</div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Pestaña: Servicios -->
    <div v-if="activeTab === 'services'" class="content-section">
      <div class="section-title-bar">
        <h2 class="section-title">🛠️ Servicios</h2>
      </div>
      <div class="services-grid">
        <div v-for="service in burnedServices" :key="service.id" class="pro-card service-card">
          <h3 class="card-title">{{ service.name }}</h3>
          <p class="card-description">{{ service.description }}</p>
          <div class="card-footer">
            <span class="price-badge">${{ service.price.toLocaleString() }}</span>
            <span class="status-badge available">{{ service.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pestaña: Categorías -->
    <div v-if="activeTab === 'categories'" class="content-section">
      <div class="section-title-bar">
        <h2 class="section-title">📂 Categorías</h2>
      </div>
      <div class="categories-grid">
        <div v-for="cat in burnedCategories" :key="cat.id" class="pro-card category-card">
          <h3 class="card-title">{{ cat.name }}</h3>
          <p class="card-description">{{ cat.description }}</p>
        </div>
      </div>
    </div>

    <!-- Pestaña: Vehículos -->
    <div v-if="activeTab === 'vehicles'" class="content-section">
      <div class="section-title-bar"
        style="display:grid;grid-template-columns:1fr minmax(320px,420px) auto;align-items:center;gap:12px;">
        <h2 class="section-title">Vehículos</h2>
        <div style="justify-self:center;">
          <div class="search-input-wrapper" style="max-width:420px;">
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
          <button class="btn btn-primary" @click="showCreateVehicle = true">➕ Crear Vehículo</button>
        </div>
      </div>

      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table vehicles-table compact">
          <colgroup>
            <col style="width:9%" /> <!-- ID Vehículo -->
            <col style="width:13%" /> <!-- Nombre Cliente -->
            <col style="width:10%" /> <!-- Placa -->
            <col style="width:10%" /> <!-- Marca -->
            <col style="width:9%" /> <!-- Modelo -->
            <col style="width:10%" /> <!-- Tipo Vehículo -->
            <col style="width:11%" /> <!-- Fecha Registro -->
            <col style="width:8%" /> <!-- Km Actual -->
            <col style="width:11%" /> <!-- Último Servicio -->
            <col style="width:15%" /> <!-- Observaciones -->
            <col style="width:9%" /> <!-- Acciones -->
          </colgroup>
          <thead class="table-header">
            <tr>
              <th>ID Vehículo</th>
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
            <tr v-for="(v, idx) in burnedVehicles.filter(vehicle => {
              if (!searchVehicles) return true
              const q = searchVehicles.toLowerCase()
              return (vehicle.client && vehicle.client.toLowerCase().includes(q)) ||
                (vehicle.plate && vehicle.plate.toLowerCase().includes(q)) ||
                (vehicle.brand && vehicle.brand.toLowerCase().includes(q)) ||
                (vehicle.model && vehicle.model.toLowerCase().includes(q))
            })" :key="v.plate || idx">
              <td data-label="ID">{{ v.id || (idx + 1) }}</td>
              <td data-label="Nombre Cliente">{{ v.client || '-' }}</td>
              <td data-label="Placa">{{ v.plate || '-' }}</td>
              <td data-label="Marca">{{ v.brand || '-' }}</td>
              <td data-label="Modelo">{{ v.model || '-' }}</td>
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
            <tr v-if="burnedVehicles.length === 0">
              <td colspan="11">No hay vehículos registrados.</td>
            </tr>
          </tbody>
        </table>
        <!-- Datalist con clientes para autocompletar nombre -->
        <datalist id="clients-list">
          <option v-for="c in burnedClients" :key="c.id" :value="c.name"></option>
        </datalist>
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
                <select v-model.number="newVehicle.clientId" class="form-input">
                  <option :value="0">Seleccionar cliente</option>
                  <option v-for="c in burnedClients" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Placa</label>
                  <input v-model="newVehicle.plate" type="text" class="form-input" placeholder="ABC123" />
                </div>
                <div class="form-group">
                  <label>Marca</label>
                  <input v-model="newVehicle.brand" type="text" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label>Modelo</label>
                <input v-model="newVehicle.model" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>Km Actual</label>
                <input v-model="newVehicle.km" type="number" class="form-input" />
              </div>
              <div class="form-row">
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
                <textarea v-model="newVehicle.observations" class="form-input" rows="3"></textarea>
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

    <!-- Pestaña: Órdenes de trabajo -->
    <div v-if="activeTab === 'orders'" class="content-section">
      <div class="section-title-bar" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <h2 class="section-title">📝 Órdenes de Trabajo (Activos)</h2>
        <div>
          <button class="btn btn-primary" @click="openCreateOrder">➕ Nueva Orden</button>
        </div>
      </div>

      <div class="orders-grid orders-row">
        <div v-if="activeWorkOrders.length === 0" class="empty">No hay órdenes de trabajo activas.</div>
        <template v-else>
          <div v-for="order in activeWorkOrders" :key="order.id"
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

              <div class="order-extra-row">
                <span class="order-extra-icon purple" aria-hidden="true">
                  👨‍🔧
                </span>
                <span class="order-extra-label">Técnico:</span>
                <span class="order-extra-value">{{ order.mechanic || '-' }}</span>
              </div>

            </div>

            <div class="order-bottom-divider"></div>

            <div class="order-total-bar">
              <span class="order-total-label">Total</span>
              <span class="order-total-value">${{ Number(order.total || 0).toLocaleString('en-US') }}</span>
              <span class="order-total-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2.75A9.25 9.25 0 1 0 21.25 12 9.26 9.26 0 0 0 12 2.75Zm0 1.5A7.75 7.75 0 1 1 4.25 12 7.76 7.76 0 0 1 12 4.25Zm-1.1 3.75h2.7a2.35 2.35 0 0 1 0 4.7h-1.1a.85.85 0 0 0 0 1.7h1.8a.75.75 0 0 1 0 1.5h-1.1v1a.75.75 0 0 1-1.5 0v-1h-1.8a.75.75 0 0 1 0-1.5h2.7a.85.85 0 0 0 0-1.7h-1.8a2.35 2.35 0 1 1 0-4.7Z"
                    fill="currentColor" />
                </svg>
              </span>
            </div>
          </div>
        </template>
      </div>

      <div class="section-title-bar" style="margin-top:24px;">
        <h2 class="section-title">📚 Histórico de Órdenes de Trabajo</h2>
      </div>
      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table orders-table compact">
          <colgroup>
            <col style="width:8%" /> <!-- ID -->
            <col style="width:10%" /> <!-- Placa -->
            <col style="width:12%" /> <!-- Fecha creación -->
            <col style="width:12%" /> <!-- Fecha entrega -->
            <col style="width:12%" /> <!-- Cliente -->
            <col style="width:16%" /> <!-- Estado -->
            <col style="width:11%" /> <!-- Tipo servicio -->
            <col style="width:10%" /> <!-- Técnico -->
            <!-- Kilometraje column removed -->
            <col style="width:12%" /> <!-- Total -->
            <col style="width:15%" /> <!-- Diagnóstico / Servicios -->
            <col style="width:12%" /> <!-- Acciones -->
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
              <th>Total</th>
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
              <td data-label="Total">${{ (order.total || 0).toLocaleString() }}</td>
              <td data-label="Diagnóstico / Servicios">
                <div style="display:flex;align-items:center;gap:8px;justify-content:center;">
                  <button class="btn btn-sm btn-secondary" type="button"
                    @click.prevent="openDiagnosisModal(order)">ver</button>
                </div>
              </td>
              <td data-label="Acciones">
                <div class="actions" style="display:flex;gap:6px;justify-content:center;">
                  <button class="btn btn-sm btn-secondary" @click="editOrder(order)">✏️</button>
                  <button class="btn btn-sm btn-primary" @click="exportOrderPdf(order)">PDF</button>
                  <button class="btn btn-sm btn-danger" @click="deleteOrder(order.id)">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="historicalWorkOrders.length === 0">
              <td colspan="11">No hay historial de órdenes.</td>
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
              <div class="form-group"><label>Buscar placa</label><input v-model="orderPlateSearch" type="search"
                  class="form-input" placeholder="Escribe placa, cliente o marca" /></div>
              <div class="form-group"><label>Placa</label><select v-model="newOrder.vehicle" class="form-input">
                  <option value="">Seleccionar placa</option>
                  <option v-for="v in getOrderPlateOptions(newOrder.vehicle)" :key="v.plate" :value="v.plate">{{ v.plate
                  }}
                    · {{ v.client || 'Sin cliente' }} · {{ v.brand || 'Sin marca' }}</option>
                </select></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Cliente</label><input v-model="newOrder.client" class="form-input"
                  placeholder="Se completará si existe placa" /></div>
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
              <div class="form-group"><label>Total</label><input v-model.number="newOrder.total" type="number"
                  class="form-input" /></div>
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
              <div class="form-group"><label>Buscar placa</label><input v-model="orderPlateSearch" type="search"
                  class="form-input" placeholder="Escribe placa, cliente o marca" /></div>
              <div class="form-group"><label>Placa</label><select v-model="editingOrder.vehicle" class="form-input">
                  <option value="">Seleccionar placa</option>
                  <option v-for="v in getOrderPlateOptions(editingOrder.vehicle)" :key="v.plate" :value="v.plate">{{
                    v.plate
                  }} · {{ v.client || 'Sin cliente' }} · {{ v.brand || 'Sin marca' }}</option>
                </select></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Cliente</label><input v-model="editingOrder.client" class="form-input"
                  placeholder="Se completará si existe placa" /></div>
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
              <div class="form-group"><label>Total</label><input v-model.number="editingOrder.total" type="number"
                  class="form-input" /></div>
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
          <div class="so-meta-card">
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
              <option value="Pagado">Pagado</option>
              <option value="Anulado">Anulado</option>
            </select>
            <input type="date" v-model="dateFrom" class="form-input" />
            <input type="date" v-model="dateTo" class="form-input" />
          </div>
        </div>
      </div>

      <div class="table-responsive invoices-fullwidth" style="margin-top:12px;">
        <table class="simple-table invoices-table compact">
          <colgroup>
            <col style="width:40px" />
            <col style="width:6%" />
            <col style="width:8%" />
            <col style="width:17%" />
            <col style="width:12%" />
            <col style="width:5%" />
            <col style="width:10%" />
            <col style="width:4%" />
            <col style="width:7%" />
            <col style="width:8%" />
            <col style="width:13%" />
          </colgroup>
          <thead class="table-header">
            <tr>
              <th><input type="checkbox" :checked="selectAllChecked" @change="toggleSelectAllVisible" /></th>
              <th @click="setSort('id')" style="cursor:pointer">ID <span v-if="sortKey === 'id'">{{ sortDir === -1 ? '▼'
                :
                '▲'
                  }}</span></th>
              <th @click="setSort('createdAt')" style="cursor:pointer">Fecha <span v-if="sortKey === 'createdAt'">{{
                sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th @click="setSort('client')" style="cursor:pointer">Cliente <span v-if="sortKey === 'client'">{{
                sortDir === -1
                  ? '▼' : '▲' }}</span></th>
              <th @click="setSort('vehicle')" style="cursor:pointer">Vehículo <span v-if="sortKey === 'vehicle'">{{
                sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th>Items</th>
              <th @click="setSort('subtotal')" style="cursor:pointer">Subtotal <span v-if="sortKey === 'subtotal'">{{
                sortDir === -1 ? '▼' : '▲' }}</span></th>
              <th>IVA</th>
              <th @click="setSort('total')" style="cursor:pointer">Total <span v-if="sortKey === 'total'">{{ sortDir ===
                -1
                ?
                '▼' : '▲' }}</span></th>
              <th @click="setSort('status')" style="cursor:pointer">Estado <span v-if="sortKey === 'status'">{{
                sortDir === -1 ?
                  '▼' : '▲' }}</span></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in paginatedInvoices" :key="invoice.id">
              <td data-label="Sel"><input type="checkbox" :checked="selectedInvoices.includes(invoice.id)"
                  @change="toggleSelectInvoice(invoice.id)" /></td>
              <td data-label="ID">#{{ invoice.id }}</td>
              <td data-label="Fecha">{{ invoice.createdAt ? formatShortDate(new Date(invoice.createdAt)) : '-' }}</td>
              <td data-label="Cliente">{{ invoice.client }}</td>
              <td data-label="Vehículo">{{ invoice.vehicle || '-' }}</td>
              <td data-label="Items">{{ Array.isArray(invoice.items) ? invoice.items.length : (invoice.items ||
                '').toString().split(',').length }}</td>
              <td data-label="Subtotal">${{ invoiceSubtotal(invoice).toLocaleString() }}</td>
              <td data-label="IVA">${{ invoiceTax(invoice).toLocaleString() }}</td>
              <td data-label="Total">${{ invoiceTotal(invoice).toLocaleString() }}</td>
              <td data-label="Estado"><span class="status-badge" :class="invoice.status.toLowerCase()">{{ invoice.status
              }}</span></td>
              <td data-label="Acciones">
                <div class="actions-vertical" style="display:flex;flex-direction:column;gap:6px;align-items:center;">
                  <div class="actions-row" style="display:flex;gap:6px;justify-content:center;">
                    <button class="btn btn-sm btn-secondary" @click="previewInvoiceFn(invoice)">👁️</button>
                    <button class="btn btn-sm btn-secondary" @click="editInvoice(invoice)">✏️</button>
                    <button class="btn btn-sm btn-primary" @click="viewInvoice(invoice)">📄</button>
                  </div>
                  <div class="actions-row" style="display:flex;gap:6px;justify-content:center;">
                    <button class="btn btn-sm btn-success" @click="toggleInvoicePaid(invoice)">{{ invoice.status ===
                      'Pagado' ? 'Marcar Pendiente' : 'Marcar Pagado' }}</button>
                    <button class="btn btn-sm btn-danger" @click="deleteInvoice(invoice.id)">🗑️</button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="sortedInvoices.length === 0">
              <td colspan="11">No hay facturas para mostrar.</td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer"
          style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;gap:12px;flex-wrap:wrap;">
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="btn btn-secondary" @click="exportSelectedCsv">Exportar Seleccionadas</button>
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

      <!-- Modal crear/editar factura -->
      <div v-if="showInvoiceModal" class="modal-overlay" @click="showInvoiceModal = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ editingInvoice ? 'Editar Factura #' + editingInvoice.id : 'Nueva Factura' }}</h3>
            <button class="modal-close" @click="showInvoiceModal = false">✕</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveInvoice">
              <div class="form-group">
                <label>Cliente *</label>
                <input v-model="formInvoice.client" type="text" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Vehículo</label>
                <input v-model="formInvoice.vehicle" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>Items</label>
                <div v-for="(it, idx) in formInvoice.items" :key="idx" class="form-row"
                  style="gap:8px;align-items:center;">
                  <input v-model="it.description" placeholder="Descripción" class="form-input" />
                  <input v-model.number="it.qty" type="number" min="1" class="form-input" style="width:80px" />
                  <input v-model.number="it.price" type="number" min="0" class="form-input" style="width:120px" />
                  <button type="button" class="btn btn-sm btn-danger" @click="removeInvoiceItem(idx)">−</button>
                </div>
                <button type="button" class="btn btn-secondary" @click="addInvoiceItem">➕ Agregar item</button>
              </div>
              <div class="form-row" style="gap:12px;">
                <div class="form-group"><label>% IVA</label><input v-model.number="formInvoice.taxPct" type="number"
                    min="0" class="form-input" /></div>
                <div class="form-group"><label>Pagos</label><input v-model="formInvoice.payments"
                    placeholder="Ej: Efectivo, Transferencia" class="form-input" /></div>
                <div class="form-group"><label>Estado</label><select v-model="formInvoice.status" class="form-input">
                    <option>Pendiente</option>
                    <option>Pagado</option>
                    <option>Anulado</option>
                  </select></div>
              </div>
              <div class="form-row" style="justify-content:space-between;align-items:center;margin-top:8px;">
                <div><strong>Subtotal:</strong> ${{ invoiceSubtotal(formInvoice).toLocaleString() }}
                  <strong>IVA:</strong>
                  ${{ invoiceTax(formInvoice).toLocaleString() }}
                </div>
                <div><strong>Total:</strong> ${{ invoiceTotal(formInvoice).toLocaleString() }}</div>
              </div>
              <div class="form-actions" style="margin-top:12px;">
                <button type="button" class="btn btn-secondary" @click="showInvoiceModal = false">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Modal vista previa factura (solo lectura) -->
      <div v-if="showInvoicePreview" class="modal-overlay" @click="showInvoicePreview = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Vista previa Factura #{{ previewInvoice?.id }}</h3>
            <button class="modal-close" @click="showInvoicePreview = false">✕</button>
          </div>
          <div class="modal-body">
            <p><strong>Cliente:</strong> {{ previewInvoice?.client }}</p>
            <p><strong>Vehículo:</strong> {{ previewInvoice?.vehicle || '-' }}</p>
            <p><strong>Fecha:</strong> {{ previewInvoice?.createdAt ? formatShortDate(new
              Date(previewInvoice.createdAt)) :
              '-' }}</p>
            <table style="width:100%;border-collapse:collapse;margin-top:8px;">
              <thead>
                <tr>
                  <th style="text-align:left;border-bottom:1px solid #ccc;padding:6px;">Descripción</th>
                  <th style="text-align:right;border-bottom:1px solid #ccc;padding:6px;">Cantidad</th>
                  <th style="text-align:right;border-bottom:1px solid #ccc;padding:6px;">Precio</th>
                  <th style="text-align:right;border-bottom:1px solid #ccc;padding:6px;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(it, idx) in (previewInvoice?.items || [])" :key="idx">
                  <td style="padding:6px 4px;">{{ it.description || it }}</td>
                  <td style="padding:6px 4px;text-align:right;">{{ it.qty ?? 1 }}</td>
                  <td style="padding:6px 4px;text-align:right;">${{ (it.price ?? 0).toLocaleString() }}</td>
                  <td style="padding:6px 4px;text-align:right;">${{ ((it.qty ?? 1) * (it.price ?? 0)).toLocaleString()
                  }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top:12px;text-align:right;">
              <div><strong>Subtotal:</strong> ${{ invoiceSubtotal(previewInvoice).toLocaleString() }}</div>
              <div><strong>IVA:</strong> ${{ invoiceTax(previewInvoice).toLocaleString() }}</div>
              <div><strong>Total:</strong> ${{ invoiceTotal(previewInvoice).toLocaleString() }}</div>
            </div>
            <div style="margin-top:8px;"><strong>Pagos:</strong> {{ Array.isArray(previewInvoice?.payments) ?
              previewInvoice.payments.join(', ') : (previewInvoice?.payments || '') }}</div>
            <div style="margin-top:8px;"><strong>Notas:</strong> {{ previewInvoice?.notes || '-' }}</div>
          </div>
          <div class="modal-footer form-actions" style="margin-top:12px;display:flex;justify-content:flex-end;gap:8px;">
            <button type="button" class="btn btn-secondary" @click="showInvoicePreview = false">Cerrar</button>
            <button type="button" class="btn btn-secondary" @click="editPreviewInvoice">Editar</button>
            <button type="button" class="btn btn-primary" @click="printPreviewInvoice">Imprimir</button>
          </div>
        </div>
      </div>

      <!-- Impresión factura -->
      <div v-if="printInvoice" class="print-area" aria-hidden="true">
        <div class="invoice-print-card">
          <div class="ip-header">
            <img class="ip-logo" src="/images/logo.png" alt="Jobs Car logo" />
            <div class="ip-title">
              <h1>FACTURA - JOB'S CAR</h1>
              <div class="ip-meta">Factura #{{ printInvoice.id }} — Fecha: {{ new Date(printInvoice.createdAt ||
                Date.now()).toLocaleDateString() }}</div>
            </div>
          </div>
          <div class="ip-section">
            <p><strong>Cliente:</strong> {{ printInvoice.client }}</p>
            <p><strong>Vehículo:</strong> {{ printInvoice.vehicle || '-' }}</p>
            <table style="width:100%;border-collapse:collapse;margin-top:8px;">
              <thead>
                <tr>
                  <th style="text-align:left;border-bottom:1px solid #ccc;padding:6px;">Descripción</th>
                  <th style="text-align:right;border-bottom:1px solid #ccc;padding:6px;">Cantidad</th>
                  <th style="text-align:right;border-bottom:1px solid #ccc;padding:6px;">Precio</th>
                  <th style="text-align:right;border-bottom:1px solid #ccc;padding:6px;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(it, idx) in (printInvoice.items || [])" :key="idx">
                  <td style="padding:6px 4px;">{{ it.description || '' }}</td>
                  <td style="padding:6px 4px;text-align:right;">{{ it.qty ?? 1 }}</td>
                  <td style="padding:6px 4px;text-align:right;">${{ (Number(it.price) || 0).toLocaleString() }}</td>
                  <td style="padding:6px 4px;text-align:right;">${{ ((Number(it.qty) || 1) * (Number(it.price) ||
                    0)).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top:12px;text-align:right;">
              <div><strong>Subtotal:</strong> ${{ invoiceSubtotal(printInvoice).toLocaleString() }}</div>
              <div><strong>IVA:</strong> ${{ invoiceTax(printInvoice).toLocaleString() }}</div>
              <div><strong>Total:</strong> ${{ invoiceTotal(printInvoice).toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Pestaña: Inventario -->
    <div v-if="activeTab === 'inventory'" class="content-section">
      <div class="section-title-bar" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <h2 class="section-title">🧰 Inventario</h2>
        <button class="btn btn-primary" @click="showCreateInventory = true">➕ Agregar inventario</button>
      </div>
      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table compact">
          <colgroup>
            <col style="width:14%" />
            <col style="width:18%" />
            <col style="width:10%" />
            <col style="width:18%" />
            <col style="width:20%" />
            <col style="width:20%" />
            <col style="width:12%" />
          </colgroup>
          <thead class="table-header">
            <tr>
              <th>Fecha</th>
              <th>Actividad</th>
              <th>Cantidad</th>
              <th>Costo Repuestos</th>
              <th>Valor Repuestos en Factura</th>
              <th>Ganancia Neta Repuestos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in burnedInventory" :key="item.id">
              <td data-label="Fecha">{{ item.date }}</td>
              <td data-label="Actividad">{{ item.activity }}</td>
              <td data-label="Cantidad">{{ item.quantity }}</td>
              <td data-label="Costo Repuestos">${{ item.cost.toLocaleString('es-CO') }}</td>
              <td data-label="Valor Repuestos en Factura">${{ item.invoiceValue.toLocaleString('es-CO') }}</td>
              <td data-label="Ganancia Neta Repuestos">${{ item.netProfit.toLocaleString('es-CO') }}</td>
              <td data-label="Acciones">
                <div style="display:flex;gap:6px;justify-content:center;">
                  <button class="btn btn-sm btn-secondary" type="button" @click="editInventoryItem(item)"
                    aria-label="Editar inventario">✏️</button>
                  <button class="btn btn-sm btn-danger" type="button" @click="deleteInventoryItem(item.id)"
                    aria-label="Eliminar inventario">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="burnedInventory.length === 0">
              <td colspan="7">No hay registros de inventario.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal crear inventario -->
    <div v-if="showCreateInventory" class="modal-overlay" @click="showCreateInventory = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Agregar Inventario</h3>
          <button class="modal-close" @click="showCreateInventory = false">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addInventoryItem">
            <div class="form-row">
              <div class="form-group">
                <label>Fecha</label>
                <input v-model="newInventoryItem.date" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Actividad</label>
                <input v-model="newInventoryItem.activity" type="text" class="form-input" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Cantidad</label>
                <input v-model.number="newInventoryItem.quantity" type="number" min="1" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Costo Repuestos</label>
                <input v-model.number="newInventoryItem.cost" type="number" min="0" class="form-input" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Valor Repuestos en Factura</label>
                <input v-model.number="newInventoryItem.invoiceValue" type="number" min="0" class="form-input"
                  required />
              </div>
              <div class="form-group">
                <label>Ganancia Neta Repuestos</label>
                <input v-model.number="newInventoryItem.netProfit" type="number" min="0" class="form-input" required />
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
          <h3>Editar Inventario</h3>
          <button class="modal-close" @click="showEditInventory = false">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEditedInventory">
            <div class="form-row">
              <div class="form-group">
                <label>Fecha</label>
                <input v-model="editingInventory.date" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Actividad</label>
                <input v-model="editingInventory.activity" type="text" class="form-input" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Cantidad</label>
                <input v-model.number="editingInventory.quantity" type="number" min="1" class="form-input" required />
              </div>
              <div class="form-group">
                <label>Costo Repuestos</label>
                <input v-model.number="editingInventory.cost" type="number" min="0" class="form-input" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Valor Repuestos en Factura</label>
                <input v-model.number="editingInventory.invoiceValue" type="number" min="0" class="form-input"
                  required />
              </div>
              <div class="form-group">
                <label>Ganancia Neta Repuestos</label>
                <input v-model.number="editingInventory.netProfit" type="number" min="0" class="form-input" required />
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

    <!-- Pestaña: Caja -->
    <div v-if="activeTab === 'cash'" class="content-section">
      <div class="section-title-bar">
        <h2 class="section-title">💰 Caja</h2>
      </div>
      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table compact">
          <colgroup>
            <col style="width:12%" />
            <col style="width:10%" />
            <col style="width:14%" />
            <col style="width:20%" />
            <col style="width:12%" />
            <col style="width:12%" />
            <col style="width:10%" />
            <col style="width:10%" />
          </colgroup>
          <thead class="table-header">
            <tr>
              <th>Fecha</th>
              <th>Referencia</th>
              <th>Nombre</th>
              <th>Conceptos</th>
              <th>Movimiento</th>
              <th>Valor</th>
              <th>Cuenta</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in burnedCashMovements" :key="entry.id">
              <td data-label="Fecha">{{ entry.date }}</td>
              <td data-label="Referencia">{{ entry.reference || '-' }}</td>
              <td data-label="Nombre">{{ entry.name }}</td>
              <td data-label="Conceptos">{{ entry.concept }}</td>
              <td data-label="Movimiento">
                <span class="status-badge" :class="entry.movement === 'Ingreso' ? 'available' : 'danger'">{{
                  entry.movement
                }}</span>
              </td>
              <td data-label="Valor">${{ Number(entry.amount).toLocaleString('es-CO') }}</td>
              <td data-label="Cuenta">{{ entry.account }}</td>
              <td data-label="Observación">{{ entry.observation || '-' }}</td>
            </tr>
            <tr v-if="burnedCashMovements.length === 0">
              <td colspan="8">No hay movimientos de caja registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pestaña: Empleados -->
    <div v-if="activeTab === 'employees'" class="content-section">
      <div class="section-title-bar"
        style="display:grid;grid-template-columns:1fr minmax(320px,420px) auto;align-items:center;gap:12px;">
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
            <col style="width:10%" /> <!-- ID Empleado -->
            <col style="width:13%" /> <!-- Nombre -->
            <col style="width:11%" /> <!-- Cargo -->
            <col style="width:13%" /> <!-- Especialidad -->
            <col style="width:12%" /> <!-- Teléfono -->
            <col style="width:12%" /> <!-- Estado -->
            <col style="width:11%" /> <!-- Fecha Ingreso -->
            <col style="width:10%" /> <!-- OT Activas -->
            <col style="width:13%" /> <!-- Observaciones -->
            <col style="width:9%" /> <!-- Acciones -->
          </colgroup>
          <thead class="table-header">
            <tr>
              <th>ID Empleado</th>
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
              <td data-label="ID Empleado">{{ emp.id }}</td>
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
              <td colspan="10">No hay empleados registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section-title-bar"
        style="margin-top:24px;display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <h2 class="section-title">💼 Nómina</h2>
        <div style="font-weight:600;">
          50% taller / 50% técnico
        </div>
      </div>

      <div class="stats-grid" style="margin-top:16px;">
        <div class="stat-card">
          <div class="stat-icon">🧾</div>
          <div class="stat-content">
            <div class="stat-number">{{ payrollTotals.ordersCount }}</div>
            <div class="stat-label">Servicios entregados</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💵</div>
          <div class="stat-content">
            <div class="stat-number">${{ payrollTotals.grossTotal.toLocaleString('es-CO') }}</div>
            <div class="stat-label">Total facturado</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👨‍🔧</div>
          <div class="stat-content">
            <div class="stat-number">${{ payrollTotals.technicianShare.toLocaleString('es-CO') }}</div>
            <div class="stat-label">50% técnicos</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏪</div>
          <div class="stat-content">
            <div class="stat-number">${{ payrollTotals.workshopShare.toLocaleString('es-CO') }}</div>
            <div class="stat-label">50% taller</div>
          </div>
        </div>
      </div>

      <div class="table-responsive" style="margin-top:16px;">
        <table class="simple-table compact">
          <colgroup>
            <col style="width:24%" />
            <col style="width:16%" />
            <col style="width:16%" />
            <col style="width:20%" />
            <col style="width:24%" />
          </colgroup>
          <thead class="table-header">
            <tr>
              <th>Técnico</th>
              <th>Servicios</th>
              <th>Total</th>
              <th>50% Técnico</th>
              <th>50% Taller</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in payrollRows" :key="row.id">
              <td data-label="Técnico">
                <strong>{{ row.name }}</strong>
                <div style="color:var(--muted);font-size:0.9rem;">{{ row.role }}</div>
              </td>
              <td data-label="Servicios">{{ row.ordersCount }}</td>
              <td data-label="Total">${{ row.grossTotal.toLocaleString('es-CO') }}</td>
              <td data-label="50% Técnico">${{ row.technicianShare.toLocaleString('es-CO') }}</td>
              <td data-label="50% Taller">${{ row.workshopShare.toLocaleString('es-CO') }}</td>
            </tr>
            <tr v-if="payrollRows.length === 0">
              <td colspan="5">No hay datos de nómina disponibles.</td>
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

    <!-- Pestaña: Agenda (Calendario) -->
    <div v-if="activeTab === 'agenda'" class="content-section">
      <div class="section-title-bar" style="display:flex;justify-content:space-between;align-items:center;">
        <h2 class="section-title">📅 Agenda</h2>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="btn" @click="prevMonth">◀</button>
          <div style="font-weight:700">{{ monthNames[calendarDate.getMonth()] }} {{ calendarDate.getFullYear() }}</div>
          <button class="btn" @click="nextMonth">▶</button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 340px;gap:16px;margin-top:12px;">
        <div class="pro-card" style="padding:12px;">
          <div
            style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;font-weight:700;padding:8px 0;gap:6px;">
            <div>Dom</div>
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:8px;">
            <div v-for="cell in monthDays" :key="cell.iso" :class="['calendar-cell', { 'other-month': !cell.inMonth }]"
              style="min-height:90px;padding:8px;border-radius:8px;background:var(--brand-bg-end);">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div :style="{ opacity: cell.inMonth ? 1 : 0.4 }">{{ cell.day }}</div>
                <button class="btn btn-sm" style="padding:4px 6px" @click="openScheduleModal(null, cell.iso)">+</button>
              </div>
              <div style="margin-top:6px;display:flex;flex-direction:column;gap:6px;">
                <div v-for="(ev, idx) in (eventsByDate[cell.iso] || []).slice(0, 3)" :key="idx"
                  :style="{ padding: '6px', borderRadius: '8px', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: (ev.type === 'order' ? 'rgba(59,130,246,0.08)' : 'rgba(16,185,129,0.08)') }">
                  <span v-if="ev.type === 'order'">🧾 {{ ev.client || ev.vehicle }}</span>
                  <span v-else>📅 {{ ev.service || ev.client || ev.vehicle }}</span>
                </div>
                <div v-if="(eventsByDate[cell.iso] || []).length > 3"><small>+{{ (eventsByDate[cell.iso] || []).length -
                  3
                    }}
                    más</small></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pro-card" style="padding:12px;overflow:auto;max-height:640px;">
          <h3 style="margin-top:0;margin-bottom:8px;">Órdenes activas — {{ monthNames[calendarDate.getMonth()] }} ({{
            activeOrdersForMonth.length }})</h3>
          <div v-if="activeOrdersForMonth.length === 0" style="color:var(--muted);margin-bottom:8px;">No hay órdenes
            activas
            para este mes.</div>
          <div v-for="order in activeOrdersForMonth" :key="order.id"
            style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--brand-border);">
            <div>
              <div style="font-weight:700">#{{ order.id }} — {{ order.client || '-' }}</div>
              <div style="color:var(--brand-accent-alt);font-size:0.9rem">{{ order.vehicle || '-' }} · {{
                (order.services &&
                  order.services.length) ? order.services.join(', ') : (order.serviceType || 'General') }}</div>
              <div v-if="order.deliveryDate" style="color:var(--brand-success);font-weight:700">Entrega: {{
                order.deliveryDate }}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button class="btn btn-sm btn-secondary" @click="autoScheduleOrder(order.id)">Agendar IA</button>
              <button class="btn btn-sm btn-primary" @click="openScheduleModal(order.id)">Agendar</button>
            </div>
          </div>
          <div v-if="unassignedActiveWorkOrders.length"
            style="margin-top:12px;border-top:1px dashed var(--brand-border);padding-top:8px;">
            <h4 style="margin:4px 0;">Sin fecha asignada ({{ unassignedActiveWorkOrders.length }})</h4>
            <div v-for="o in unassignedActiveWorkOrders" :key="o.id"
              style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.03);">
              <div>
                <div style="font-weight:700">#{{ o.id }} — {{ o.client || '-' }}</div>
                <div style="font-size:0.9rem;color:var(--brand-accent-alt)">{{ o.vehicle || '-' }} · {{ (o.services &&
                  o.services.length) ? o.services.join(', ') : (o.serviceType || 'General') }}</div>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <button class="btn btn-sm btn-secondary" @click="autoScheduleOrder(o.id)">Agendar IA</button>
                <button class="btn btn-sm btn-primary" @click="openScheduleModal(o.id)">Agendar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal agendar -->
      <div v-if="showScheduleModal" class="modal-overlay" @click="showScheduleModal = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ scheduleSelectedOrderId ? 'Agendar Orden' : 'Crear Cita' }}</h3>
            <button class="modal-close" @click="showScheduleModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div style="margin-bottom:8px;">
              <label><strong>Fecha:</strong></label>
              <input type="date" v-model="scheduleDateIso" class="form-input" />
            </div>
            <div class="form-group">
              <label>Orden</label>
              <select v-model="scheduleSelectedOrderId" class="form-input">
                <option :value="null">Seleccionar orden</option>
                <option v-for="o in activeWorkOrders" :key="o.id" :value="o.id">#{{ o.id }} — {{ o.client }}</option>
              </select>
            </div>
            <div v-if="!scheduleSelectedOrderId"
              style="margin-top:8px;border-top:1px dashed var(--brand-border);padding-top:8px;">
              <small>Crear nueva cita/evento en la agenda</small>
              <div class="form-row">
                <div class="form-group"><label>Placa</label><input v-model="newCalendarOrder.vehicle"
                    class="form-input" />
                </div>
                <div class="form-group"><label>Cliente</label><input v-model="newCalendarOrder.client"
                    class="form-input" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Asunto / Servicio</label><input v-model="newCalendarOrder.serviceType"
                    class="form-input" /></div>
                <div class="form-group"><label>Técnico</label>
                  <select v-model="newCalendarOrder.mechanic" class="form-input">
                    <option value="">Seleccionar técnico</option>
                    <option v-for="emp in burnedEmployees" :key="emp.id" :value="emp.name">{{ emp.name }}</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group"><label>Total</label><input v-model.number="newCalendarOrder.total" type="number"
                    class="form-input" /></div>
                <div class="form-group"><label>Diagnóstico</label><input v-model="newCalendarOrder.diagnosis"
                    class="form-input" /></div>
              </div>
            </div>
            <div class="form-group">
              <label>Hora</label>
              <input type="time" v-model="scheduleTime" class="form-input" />
            </div>
            <div class="form-actions" style="margin-top:12px;">
              <button class="btn btn-secondary" @click="showScheduleModal = false">Cancelar</button>
              <button class="btn btn-primary" @click="confirmSchedule">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pestaña: Reportes -->
    <!-- <div v-if="activeTab === 'reports'" class="content-section">
      <div class="section-title-bar">
        <h2 class="section-title">📊 Dashboard</h2>
      </div>
      <div class="reports-grid">
        <div class="pro-card report-card">
          <h3 class="report-title">💰 Ingresos recientes</h3>
          <ul class="report-list">
            <li v-for="ing in burnedReports.ingresos" :key="ing.fecha" class="report-item">
              <span class="report-label">{{ ing.fecha }}</span>
              <span class="report-value">${{ ing.total.toLocaleString() }}</span>
            </li>
          </ul>
        </div>
        <div class="pro-card report-card">
          <h3 class="report-title">🏆 Servicios más vendidos</h3>
          <ul class="report-list">
            <li v-for="srv in burnedReports.servicios" :key="srv.nombre" class="report-item">
              <span class="report-label">{{ srv.nombre }}</span>
              <span class="report-value">{{ srv.vendidos }} vendidos</span>
            </li>
          </ul>
        </div>
        <div class="pro-card report-card">
          <h3 class="report-title">👥 Clientes frecuentes</h3>
          <ul class="report-list">
            <li v-for="cli in burnedReports.clientes" :key="cli.nombre" class="report-item">
              <span class="report-label">{{ cli.nombre }}</span>
              <span class="report-value">{{ cli.visitas }} visitas</span>
            </li>
          </ul>
        </div>
      </div>
    </div> -->
    <div class="tab-content">

      <!-- Pestaña de Clientes (tabla) -->
      <div v-if="activeTab === 'clients'" class="content-section">
        <div class="section-header" style="flex-direction:column;align-items:center;gap:12px;">
          <div style="width:100%;display:flex;align-items:center;justify-content:space-between;">
            <h2>Clientes</h2>
            <button class="btn btn-primary" @click="showCreateClient = true">➕ Crear Cliente</button>
          </div>
          <div style="width:100%;display:flex;justify-content:center;margin-top:12px;">
            <div class="search-input-wrapper" style="max-width:520px;">
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
              <col style="width:6%" /> <!-- ID -->
              <col style="width:18%" /> <!-- Nombre -->
              <col style="width:12%" /> <!-- Teléfono -->
              <col style="width:18%" /> <!-- Correo -->
              <col style="width:12%" /> <!-- Fecha registro -->
              <col style="width:22%" /> <!-- Notas -->
              <col style="width:12%" /> <!-- Acciones (fijo) -->
            </colgroup>
            <thead class="table-header">
              <tr>
                <th>ID</th>
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
                <td data-label="ID">{{ client.id }}</td>
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
                <td colspan="7">No hay clientes registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pestaña de Servicios (antes Productos) -->
      <div v-if="activeTab === 'services'" class="content-section">
        <div class="section-header">
          <h2>Gestión de Servicios</h2>
          <button class="btn btn-primary" @click="showProductForm = true">
            <span class="btn-icon">➕</span>
            Nuevo Servicio
          </button>
        </div>

        <!-- Barra de búsqueda para productos -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
            </svg>
            <input type="search" v-model="searchProducts" placeholder="Buscar productos por nombre..."
              aria-label="Buscar productos" class="search-input" />
            <button v-if="searchProducts" class="search-clear" @click.prevent="searchProducts = ''"
              aria-label="Limpiar búsqueda">X</button>
          </div>
        </div>

        <!-- Lista de productos -->
        <div class="products-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="product-card">
            <div class="product-image">
              <img v-if="product.images && product.images.length > 0" :src="product.images[0]" :alt="product.name" />
              <div v-else class="no-image">📷</div>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-meta">
                <span class="price">${{ product.price.toLocaleString() }}</span>
                <span :class="['status', product.status]">{{ getStatusText(product.status) }}</span>
              </div>
              <div class="product-actions">
                <button class="btn btn-sm btn-secondary" @click="editProduct(product)">✏️ Editar</button>
                <button class="btn btn-sm btn-danger" @click="deleteProductConfirm(product.id)">🗑️ Eliminar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío o sin resultados -->
        <div v-if="filteredProducts.length === 0 && !searchProducts" class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>No hay servicios</h3>
          <p>Comienza agregando tu primer servicio del taller</p>
          <button class="btn btn-primary" @click="showProductForm = true">
            Crear Primer Servicio
          </button>
        </div>
        <div v-else-if="filteredProducts.length === 0 && searchProducts" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron resultados</h3>
          <p>No hay servicios que coincidan con "{{ searchProducts }}"</p>
          <button class="btn btn-secondary" @click="searchProducts = ''">
            Limpiar búsqueda
          </button>
        </div>
      </div>

      <!-- Pestaña de Categorías -->
      <div v-if="activeTab === 'categories'" class="content-section">
        <div class="section-header">
          <h2>Gestión de Categorías</h2>
          <button class="btn btn-primary" @click="showCategoryForm = true">
            <span class="btn-icon">➕</span>
            Nueva Categoría
          </button>
        </div>

        <!-- Barra de búsqueda para categorías -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
            </svg>
            <input type="search" v-model="searchCategories" placeholder="Buscar categorías por nombre..."
              aria-label="Buscar categorías" class="search-input" />
            <button v-if="searchCategories" class="search-clear" @click.prevent="searchCategories = ''"
              aria-label="Limpiar búsqueda">X</button>
          </div>
        </div>

        <!-- Lista de categorías -->
        <div class="categories-list">
          <div v-for="category in filteredCategories" :key="category.id" class="category-item">
            <div class="category-info">
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
              <span class="category-count">{{ getProductsInCategory(category.id) }} productos</span>
            </div>
            <div class="category-actions">
              <button class="btn btn-sm btn-secondary" @click="editCategory(category)">✏️</button>
              <button class="btn btn-sm btn-danger" @click="handleDeleteCategory(category.id)">🗑️</button>
            </div>
          </div>
        </div>

        <!-- Estado vacío o sin resultados -->
        <div v-if="filteredCategories.length === 0 && !searchCategories" class="empty-state">
          <div class="empty-icon">🏷️</div>
          <h3>No hay categorías</h3>
          <p>Crea categorías para organizar tus productos</p>
          <button class="btn btn-primary" @click="showCategoryForm = true">
            Crear Primera Categoría
          </button>
        </div>
        <div v-else-if="filteredCategories.length === 0 && searchCategories" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron resultados</h3>
          <p>No hay categorías que coincidan con "{{ searchCategories }}"</p>
          <button class="btn btn-secondary" @click="searchCategories = ''">
            Limpiar búsqueda
          </button>
        </div>
      </div>

      <!-- Pestaña de Novedades (ProductShowcase) -->
      <div v-if="activeTab === 'showcase'" class="content-section">
        <div class="section-header">
          <h2>Gestión de Novedades</h2>
          <button class="btn btn-primary" @click="showShowcaseForm = true">
            <span class="btn-icon">✨</span>
            Nueva Novedad
          </button>
        </div>

        <!-- Barra de búsqueda para novedades -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor"
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z" />
            </svg>
            <input type="search" v-model="searchShowcase" placeholder="Buscar novedades por nombre..."
              aria-label="Buscar novedades" class="search-input" />
            <button v-if="searchShowcase" class="search-clear" @click.prevent="searchShowcase = ''"
              aria-label="Limpiar búsqueda">X</button>
          </div>
        </div>

        <!-- Lista de productos showcase -->
        <div class="showcase-grid">
          <div v-for="product in filteredShowcase" :key="product.id" class="showcase-card">
            <div class="showcase-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="showcase-info">
              <h3>{{ product.name }}</h3>
              <p class="showcase-description">{{ product.description }}</p>
              <div class="showcase-meta">
                <span class="showcase-category">{{ getCategoryById(product.category)?.name || 'Sin categoría' }}</span>
                <span class="showcase-status available">
                  Disponible
                </span>
              </div>
            </div>
            <div class="showcase-actions">
              <button class="btn btn-sm btn-secondary" @click="editShowcaseProduct(product)">✏️</button>
              <button class="btn btn-sm btn-danger" @click="deleteShowcaseConfirm(product.id)">🗑️</button>
            </div>
          </div>
        </div>

        <!-- Estado vacío o sin resultados -->
        <div v-if="filteredShowcase.length === 0 && !searchShowcase" class="empty-state">
          <div class="empty-icon">✨</div>
          <h3>No hay novedades</h3>
          <p>Agrega productos destacados para mostrar en la sección de novedades</p>
          <button class="btn btn-primary" @click="showShowcaseForm = true">
            Crear Primera Novedad
          </button>
        </div>
        <div v-else-if="filteredShowcase.length === 0 && searchShowcase" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron resultados</h3>
          <p>No hay novedades que coincidan con "{{ searchShowcase }}"</p>
          <button class="btn btn-secondary" @click="searchShowcase = ''">
            Limpiar búsqueda
          </button>
        </div>
      </div>

      <!-- Pestaña de Gestión de Vehículos
      <div v-if="activeTab === 'vehicles'" class="content-section">
        <div class="section-header">
          <h2>Gestión de vehículos</h2>
        </div>

        <div v-if="sales.length > 0">
          <div class="sales-table-container">
            <table class="sales-table vehicles-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sale in sales" :key="sale.id" class="sale-row">
                  <td>
                    <div class="customer-info">
                      <div class="customer-name">{{ sale.customerName }}</div>
                      <div class="customer-email">{{ sale.customerEmail }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="product-name">{{ sale.productName }}</div>
                  </td>
                  <td>
                    <span :class="['status-badge', sale.status]">
                      {{ getSaleStatusText(sale.status) }}
                    </span>
                  </td>
                  <td>
                    <span class="date">{{ formatDate(sale.date) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon">🚗</div>
          <h3>No hay vehículos registrados</h3>
          <p>Cuando registres servicios o ventas, los vehículos aparecerán aquí.</p>
        </div>
      </div> -->

      <!-- Dashboard: resumen y estadísticas -->
      <div v-if="activeTab === 'reports'" class="content-section">
        <div class="section-header">
          <h2>📊 Dashboard</h2>
          <button @click="loadPurchases" class="btn-secondary" :disabled="isLoadingSales">
            {{ isLoadingSales ? 'Cargando...' : 'Actualizar' }}
          </button>
        </div>

        <div class="dashboard-grid">
          <div class="kpi-row">
            <div class="kpi-card">
              <div class="kpi-label">Ingresos por Quincena</div>
              <div class="kpi-value">${{ dashboardBiweeklyLast.toLocaleString() }}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Vehículos Atendidos</div>
              <div class="kpi-value">{{ vehiclesCount }}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Órdenes Abiertas</div>
              <div class="kpi-value">{{ ordersOpenCount }}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Órdenes Terminadas</div>
              <div class="kpi-value">{{ ordersCompletedCount }}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Tiempo Promedio Servicio</div>
              <div class="kpi-value">{{ avgServiceTime }}</div>
            </div>
          </div>

          <div class="charts-row">
            <!-- Dona grande y visual -->
            <div class="chart-card donut-card">
              <h3>Estado de Órdenes</h3>
              <div class="donut-area">
                <div class="donut-wrap">
                  <apexchart type="donut" :options="donutOptions" :series="donutSeries" width="260" />
                </div>
                <div class="donut-legend">
                  <ul class="status-list">
                    <li v-for="(count, status, idx) in orderStatusCounts" :key="status">
                      <span class="legend-color" :style="{ background: donutLegendColors[idx] || '#ccc' }"></span>
                      <span class="legend-text">{{ status }}:</span>
                      <span class="legend-value">{{ count }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Tarjetas pequeñas a la derecha: Próximas Citas + Alertas -->
            <div class="right-column small-cards">
              <div class="chart-card upcoming-card">
                <h3>Próximas Citas</h3>
                <ul class="upcoming-list">
                  <li v-for="appt in upcomingAppointments" :key="appt.id">{{ appt.date ? formatShortDate(new
                    Date(appt.date)) : '—' }} · {{ appt.time }} · {{ appt.client }}</li>
                  <li v-if="upcomingAppointments.length === 0">Sin próximas citas</li>
                </ul>
              </div>

              <div class="chart-card alerts-card">
                <h3>Alertas</h3>
                <ul>
                  <li v-for="a in dashboardAlerts" :key="a">{{ a }}</li>
                  <li v-if="dashboardAlerts.length === 0">Sin alertas</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bottom-row">
            <div class="card warranty-card">
              <h3>Garantía en Empleados</h3>
              <table class="table small-table tech-table">
                <thead>
                  <tr>
                    <th>Técnico</th>
                    <th>Garantías</th>
                    <th style="text-align:right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in warrantyPerformanceEnhanced" :key="row.name">
                    <td class="tech-name">
                      <strong>{{ row.name }}</strong>
                      <div style="color:var(--brand-accent-alt);font-size:0.85rem;">{{ row.role }}</div>
                    </td>
                    <td class="tech-orders">
                      <div class="orders-count">{{ row.warrantyOrders }}</div>
                      <div class="orders-bar" role="progressbar" :aria-valuenow="row.warrantyPct" aria-valuemin="0"
                        aria-valuemax="100">
                        <div class="orders-bar-fill" :style="{ width: row.warrantyPct + '%' }"></div>
                      </div>
                    </td>
                    <td style="text-align:right;font-weight:700;">${{ row.warrantyValueFormatted }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="card tech-card">
              <h3>Desempeño de Técnicos</h3>
              <table class="table small-table tech-table">
                <thead>
                  <tr>
                    <th>Técnico</th>
                    <th>Trabajos</th>
                    <th style="text-align:right">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in techniciansPerformanceEnhanced" :key="t.name">
                    <td class="tech-name">{{ t.name }}</td>
                    <td class="tech-orders">
                      <div class="orders-count">{{ t.orders }}</div>
                      <div class="orders-bar" role="progressbar" :aria-valuenow="t.ordersPct" aria-valuemin="0"
                        aria-valuemax="100">
                        <div class="orders-bar-fill" :style="{ width: t.ordersPct + '%' }"></div>
                      </div>
                    </td>
                    <td class="tech-income">{{ t.incomeFormatted }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Fila financiera: Ingresos por Quincena + Ingresos vs Costos -->
          <div class="financial-row">
            <div class="card wide">
              <h3>Ingresos por Quincena</h3>
              <div class="chart-area">
                <apexchart type="line" :options="lineOptions" :series="lineSeries" height="180" />
              </div>
            </div>
            <div class="card small">
              <h3>Ingresos vs Costos</h3>
              <div class="mini-chart">
                <div class="bar rev" :style="{ width: revenueVsCosts.revPct + '%' }">Ingresos</div>
                <div class="bar cost" :style="{ width: revenueVsCosts.costPct + '%' }">Costos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Producto -->
    <div v-if="showProductForm" class="modal-overlay" @click="closeProductForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
          <button class="modal-close" @click="closeProductForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="form-group">
              <label>Nombre del Producto *</label>
              <input v-model="productForm.name" type="text" class="form-input" required
                placeholder="Ej: iPhone 15 Pro" />
            </div>

            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="productForm.description" class="form-input" rows="3"
                placeholder="Describe las características principales del producto"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Precio *</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input v-model.number="productForm.price" type="number" class="form-input" step="1000" min="0"
                    required placeholder="0" />
                </div>
              </div>
              <div class="form-group">
                <label>Precio Original (descuento)</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input v-model.number="productForm.originalPrice" type="number" class="form-input" step="1000" min="0"
                    placeholder="0" />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Categoría *</label>
                <select v-model="productForm.category" class="form-input" required>
                  <option value="">Seleccionar categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Estado de Disponibilidad *</label>
                <select v-model="productForm.status" class="form-input" required>
                  <option value="available">✅ Disponible</option>
                  <option value="out-of-stock">❌ Sin Stock</option>
                  <option value="coming-soon">🔜 Próximamente</option>
                </select>
              </div>
            </div>

            <!-- Selector de Colores -->
            <div class="form-group">
              <label>Colores Disponibles</label>
              <div class="colors-selector">
                <div class="colors-grid">
                  <div v-for="color in appleColors" :key="color.name" class="color-option"
                    :class="{ selected: isColorSelected(color.name) }" @click="toggleProductColor(color.name)">
                    <div class="color-circle" :style="{ background: color.hex }">
                      <span v-if="isColorSelected(color.name)" class="check-icon">✓</span>
                    </div>
                    <span class="color-name">{{ color.name }}</span>
                  </div>
                </div>
                <div v-if="productForm.colors.length > 0" class="selected-colors">
                  <span class="selected-label">Seleccionados: </span>
                  <span class="selected-list">{{ productForm.colors.join(', ') }}</span>
                </div>
              </div>
            </div>

            <!-- Subida de imagen -->
            <div class="form-group">
              <label>Imagen del Producto *</label>

              <!-- Tabs para elegir método de imagen -->
              <div class="image-tabs">
                <button type="button" class="tab-btn" :class="{ active: productImageUploadMethod === 'url' }"
                  @click="productImageUploadMethod = 'url'">
                  URL de Imagen
                </button>
                <button type="button" class="tab-btn" :class="{ active: productImageUploadMethod === 'file' }"
                  @click="productImageUploadMethod = 'file'">
                  Subir Archivo
                </button>
              </div>

              <!-- Campo URL -->
              <div v-if="productImageUploadMethod === 'url'" class="image-input-section">
                <input :value="productForm.images[0] || ''"
                  @input="(e) => { productForm.images = [(e.target as HTMLInputElement).value]; updateImagePreview(); }"
                  type="url" class="form-input" required placeholder="https://ejemplo.com/imagen.jpg" />
              </div>

              <!-- Campo de archivo -->
              <div v-if="productImageUploadMethod === 'file'" class="image-input-section">
                <input ref="fileInput" type="file" class="file-input" accept="image/*" multiple
                  @change="handleMultipleFileSelect" />
                <div class="file-upload-area" @click="fileInput?.click()">
                  <div v-if="productForm.images.length === 0" class="upload-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <p>Haz clic para seleccionar imágenes</p>
                    <span>JPG, PNG, GIF hasta 5MB (máximo 5 imágenes)</span>
                  </div>
                  <div v-if="productForm.images.length > 0" class="images-preview-grid">
                    <div v-for="(image, index) in productForm.images" :key="index" class="image-preview-item">
                      <img :src="image" :alt="`Preview ${index + 1}`" />
                      <button type="button" class="remove-single-image" @click.stop="removeSingleImage(index)">
                        ✕
                      </button>
                      <span class="image-index">{{ index + 1 }}</span>
                      <div class="image-actions">
                        <button type="button" class="img-action-btn" :disabled="index === 0"
                          @click.stop="moveImageLeft(index)" title="Mover a la izquierda">←</button>
                        <button type="button" class="img-action-btn" :disabled="index === productForm.images.length - 1"
                          @click.stop="moveImageRight(index)" title="Mover a la derecha">→</button>
                        <!-- Botón Portada removido temporalmente -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información adicional -->
            <div v-if="productForm.originalPrice && productForm.originalPrice > productForm.price"
              class="discount-info">
              <span class="discount-badge">
                💰 Descuento: {{ Math.round(((productForm.originalPrice - productForm.price) /
                  productForm.originalPrice) *
                  100) }}%
              </span>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeProductForm">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
                {{ editingProduct ? 'Actualizar Producto' : 'Crear Producto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Categoría -->
    <div v-if="showCategoryForm" class="modal-overlay" @click="closeCategoryForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button class="modal-close" @click="closeCategoryForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCategory">
            <div class="form-group">
              <label>Nombre de la Categoría</label>
              <input v-model="categoryForm.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="categoryForm.description" class="form-input" rows="3"></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeCategoryForm">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ editingCategory ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Novedad -->
    <div v-if="showShowcaseForm" class="modal-overlay" @click="closeShowcaseForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingShowcaseProduct ? 'Editar Novedad' : 'Nueva Novedad' }}</h3>
          <button class="modal-close" @click="closeShowcaseForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveShowcaseProduct">
            <div class="form-group">
              <label>Nombre del Producto *</label>
              <input v-model="showcaseForm.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Descripción *</label>
              <textarea v-model="showcaseForm.description" class="form-input" rows="3" required></textarea>
            </div>
            <!-- Campo de precio oculto - siempre será 0 para novedades -->
            <div class="form-group" style="display: none;">
              <label>Precio</label>
              <input v-model.number="showcaseForm.price" type="number" class="form-input" min="0" step="1000" />
            </div>
            <div class="form-group">
              <label>Imagen del Producto *</label>

              <!-- Tabs para elegir método de imagen -->
              <div class="image-tabs">
                <button type="button" class="tab-btn" :class="{ active: imageUploadMethod === 'url' }"
                  @click="imageUploadMethod = 'url'">
                  URL de Imagen
                </button>
                <button type="button" class="tab-btn" :class="{ active: imageUploadMethod === 'file' }"
                  @click="imageUploadMethod = 'file'">
                  Subir Archivo
                </button>
              </div>

              <!-- Campo URL -->
              <div v-if="imageUploadMethod === 'url'" class="image-input-section">
                <input v-model="showcaseForm.image" type="url" class="form-input" required
                  placeholder="https://ejemplo.com/imagen.jpg" />
              </div>

              <!-- Campo de archivo -->
              <div v-if="imageUploadMethod === 'file'" class="image-input-section">
                <input ref="showcaseFileInput" type="file" class="file-input" accept="image/*"
                  @change="handleShowcaseFileSelect" />
                <div class="file-upload-area" @click="showcaseFileInput?.click()">
                  <div v-if="!showcaseImagePreview" class="upload-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <p>Haz clic para seleccionar una imagen</p>
                    <span>JPG, PNG, GIF hasta 5MB</span>
                  </div>
                  <div v-if="showcaseImagePreview" class="image-preview">
                    <img :src="showcaseImagePreview" alt="Preview" />
                    <button type="button" class="remove-image" @click.stop="removeShowcaseImage">✕</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="showcaseForm.category" class="form-input" required>
                <option value="">Seleccionar categoría</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeShowcaseForm">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="isSavingShowcase || !showcaseFormValid">
                <span v-if="isSavingShowcase">Guardando...</span>
                <span v-else>{{ editingShowcaseProduct ? 'Actualizar' : 'Crear' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onBeforeUnmount, watch, nextTick, type Ref } from 'vue'
import { useProducts, type ShowcaseProduct } from '@/composables/useProducts'
import type { Product } from '@/types/ProductType'
import type { Category, CreateCategoryRequest } from '@/types/CategoryType'
import { workshopClientService, vehicleService, employeeService, workOrderService } from '@/services/api'
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

const mapVehicleToRow = (vehicle: Vehicle): VehicleRow => ({
  ...vehicle,
  clientId: vehicle.clientId,
  client: vehicle.client ?? '',
  km: vehicle.km,
  mileage: vehicle.mileage ?? vehicle.km,
  registrationDate: vehicle.registrationDate || vehicle.createdAt || '',
  lastServiceDate: vehicle.lastServiceDate || '',
  nextServiceKm: vehicle.nextServiceKm ?? 0,
  observations: vehicle.observations || '',
})

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
      newVehicle.model = ''
      newVehicle.year = new Date().getFullYear()
      newVehicle.km = ''
      newVehicle.vehicleType = ''
      newVehicle.status = ''
      newVehicle.registrationDate = ''
      newVehicle.lastServiceDate = ''
      newVehicle.nextServiceKm = ''
      newVehicle.observations = ''
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

  console.log('🔄 Cargando categorías y productos al montar el componente...')
  await loadCategories()
  await loadProducts()
  await loadShowcaseProducts()
  await loadPurchases()
  console.log('✅ Categorías cargadas:', categories.value)
  console.log('✅ Productos cargados:', products.value)
  console.log('✅ Productos showcase cargados:', showcaseProducts.value)
})

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
  { id: 'inventory', name: 'Inventario', icon: '🧰' },
  { id: 'cash', name: 'Caja', icon: '💰' },
  { id: 'employees', name: 'Empleados', icon: '🧑‍🔧' },
  { id: 'agenda', name: 'Agenda', icon: '📅' },
  { id: 'reports', name: 'Dashboard', icon: '📊' }
]
const burnedOrders = reactive<any[]>([])

const mapApiWorkOrderToDashboardOrder = (order: any) => {
  const services = Array.isArray(order?.services) ? order.services.filter(Boolean).map((service: any) => String(service).trim()) : []
  const createdDate = order?.createdAt ? String(order.createdAt).slice(0, 10) : ''
  return {
    id: order?.id,
    vehicle: order?.vehicle?.plate || String(order?.vehicleId || ''),
    client: order?.vehicle?.client || '',
    diagnosis: order?.diagnosis || '',
    services,
    parts: [],
    mechanic: order?.mechanicId ? String(order.mechanicId) : '',
    mechanicId: order?.mechanicId || null,
    vehicleId: order?.vehicleId || null,
    status: order?.status || 'Recepción',
    serviceType: services[0] || 'General',
    mileage: 0,
    total: Number(order?.total) || 0,
    observations: order?.observations || '',
    garantia: Number(order?.garantia) || 0,
    createdDate,
    deliveryDate: order?.deliveryDate ? String(order.deliveryDate).slice(0, 10) : null,
    deliveryTime: '',
    gases: Boolean(order?.gases),
    escaner: Boolean(order?.escaner),
    backendId: order?.id,
  }
}

const refreshWorkOrders = async () => {
  try {
    const response = await workOrderService.getWorkOrders()
    const apiOrders = response.data?.workOrders || []
    burnedOrders.splice(0, burnedOrders.length, ...apiOrders.map(mapApiWorkOrderToDashboardOrder))
  } catch (error) {
    console.error('No se pudieron cargar las órdenes reales', error)
    burnedOrders.splice(0, burnedOrders.length)
  }
}

const INVOICES_STORAGE_KEY = 'jobscar_invoices'
const INVOICES_STORAGE_VERSION_KEY = 'jobscar_invoices_seed_version'
// Incrementar esta versión cuando actualices los ejemplos para forzar recarga
const INVOICES_SEED_VERSION = 'v1'

const _storedInvoices = (() => {
  try {
    const savedVer = localStorage.getItem(INVOICES_STORAGE_VERSION_KEY)
    // Si la versión guardada no coincide, eliminar el cache para forzar los ejemplos
    if (savedVer !== INVOICES_SEED_VERSION) {
      localStorage.removeItem(INVOICES_STORAGE_KEY)
      localStorage.setItem(INVOICES_STORAGE_VERSION_KEY, INVOICES_SEED_VERSION)
    }
    const raw = localStorage.getItem(INVOICES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.warn('No se pudo leer facturas desde localStorage', e)
    return null
  }
})()

const DEFAULT_INVOICES = [
  { id: 1001, client: 'Juan Pérez', vehicle: 'ABC123', total: 350000, status: 'Pagado', payments: ['Efectivo'], items: ['Cambio aceite', 'Revisión general'], createdAt: '2026-04-10' },
  { id: 1002, client: 'María Gómez', vehicle: 'XYZ789', total: 220000, status: 'Pendiente', payments: ['Transferencia'], items: ['Revisión frenos', 'Pastillas'], createdAt: '2026-04-12' },
  { id: 1003, client: 'Carlos Ramírez', vehicle: 'JKL456', status: 'Pagado', payments: ['Tarjeta'], items: [{ description: 'Alineación', qty: 1, price: 80000 }, { description: 'Balanceo', qty: 1, price: 30000 }], createdAt: '2026-04-13' },
  { id: 1004, client: 'Ana López', vehicle: 'QWE321', total: 120000, status: 'Anulado', payments: [], items: ['Cambio de bujías'], createdAt: '2026-04-08' },
  { id: 1005, client: 'Pedro Martínez', vehicle: '', status: 'Pendiente', payments: ['Efectivo'], items: [{ description: 'Mano de obra', qty: 2, price: 45000 }], createdAt: '2026-04-15' },
  { id: 1006, client: 'Laura García', vehicle: 'TYU987', status: 'Pagado', payments: ['Transferencia'], items: [{ description: 'Reparación motor', qty: 1, price: 600000 }, { description: 'Filtro', qty: 1, price: 20000 }], createdAt: '2026-04-02' },
  { id: 1007, client: 'Esteban Ruiz', vehicle: 'MNO234', total: 0, status: 'Pendiente', payments: [], items: [], createdAt: '2026-04-16' },
  { id: 1008, client: 'Empresa XYZ', vehicle: '', status: 'Pagado', payments: ['Contrato'], items: [{ description: 'Contrato mantenimiento mensual', qty: 3, price: 120000 }], createdAt: '2026-03-30' }
]

const burnedInvoices = reactive(_storedInvoices || DEFAULT_INVOICES.map((i: any) => ({ ...i })))

// Persistir facturas en localStorage
watch(burnedInvoices, (newVal) => {
  try {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(newVal))
    // Asegurar que la versión de seed se mantenga en sync
    try { localStorage.setItem(INVOICES_STORAGE_VERSION_KEY, INVOICES_SEED_VERSION) } catch (e) { /* noop */ }
    console.log('✅ Facturas guardadas en localStorage:', newVal.length)
  } catch (e) {
    console.warn('No se pudo persistir facturas en localStorage', e)
  }
}, { deep: true })

// UI y helpers para facturación
const invoiceSearch = ref('')
const invoiceFilterStatus = ref('')
const showInvoiceModal = ref(false)
const editingInvoice: Ref<any | null> = ref(null)
const formInvoice = reactive({
  id: 0,
  client: '',
  vehicle: '',
  items: [{ description: '', qty: 1, price: 0 }],
  taxPct: 19,
  payments: [] as string[],
  status: 'Pendiente',
  notes: '',
  createdAt: ''
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

function invoiceTax(inv: any) {
  try {
    const pct = typeof inv.taxPct === 'number' ? inv.taxPct : 19
    return Math.round(invoiceSubtotal(inv) * (pct / 100))
  } catch (e) { /* noop */ }
  return 0
}

function invoiceTotal(inv: any) {
  if (typeof inv.total === 'number') return inv.total
  return invoiceSubtotal(inv) + invoiceTax(inv)
}

function addInvoiceItem() {
  formInvoice.items.push({ description: '', qty: 1, price: 0 })
}

function removeInvoiceItem(idx: number) {
  if (formInvoice.items.length === 1) formInvoice.items.splice(0, 1)
  else formInvoice.items.splice(idx, 1)
}

const nextInvoiceId = () => {
  const ids = Array.isArray(burnedInvoices) ? burnedInvoices.map((i: any) => Number(i.id)).filter(Number.isFinite) : []
  return ids.length ? Math.max(...ids) + 1 : 1001
}

function openCreateInvoice() {
  Object.assign(formInvoice, { id: 0, client: '', vehicle: '', items: [{ description: '', qty: 1, price: 0 }], taxPct: 19, payments: [], status: 'Pendiente', notes: '', createdAt: new Date().toISOString() })
  editingInvoice.value = null
  showInvoiceModal.value = true
}

function saveInvoice() {
  const subtotal = invoiceSubtotal(formInvoice)
  const tax = invoiceTax(formInvoice)
  const total = subtotal + tax
  if (!formInvoice.client) { alert('Cliente requerido'); return }
  if (editingInvoice.value) {
    const idx = burnedInvoices.findIndex((i: any) => i.id === editingInvoice.value.id)
    if (idx > -1) {
      const updated = {
        ...editingInvoice.value,
        client: String(formInvoice.client),
        vehicle: formInvoice.vehicle || '',
        items: formInvoice.items.map((it: any) => ({ ...it })),
        taxPct: formInvoice.taxPct,
        payments: Array.isArray(formInvoice.payments) ? formInvoice.payments : String(formInvoice.payments).split(',').map((s: any) => s.trim()),
        status: formInvoice.status || 'Pendiente',
        notes: formInvoice.notes || '',
        subtotal,
        tax,
        total,
        createdAt: formInvoice.createdAt || new Date().toISOString()
      }
      burnedInvoices.splice(idx, 1, updated)
    }
    editingInvoice.value = null
  } else {
    const id = nextInvoiceId()
    const newInv = {
      id,
      client: String(formInvoice.client),
      vehicle: formInvoice.vehicle || '',
      items: formInvoice.items.map((it: any) => ({ ...it })),
      taxPct: formInvoice.taxPct,
      payments: Array.isArray(formInvoice.payments) ? formInvoice.payments : String(formInvoice.payments).split(',').map((s: any) => s.trim()),
      status: formInvoice.status || 'Pendiente',
      subtotal,
      tax,
      total,
      createdAt: formInvoice.createdAt || new Date().toISOString(),
      notes: formInvoice.notes || ''
    }
    burnedInvoices.push(newInv)
  }
  showInvoiceModal.value = false
}

function editInvoice(inv: any) {
  editingInvoice.value = { ...inv }
  formInvoice.id = inv.id
  formInvoice.client = inv.client || ''
  formInvoice.vehicle = inv.vehicle || ''
  formInvoice.items = Array.isArray(inv.items) && inv.items.length ? inv.items.map((it: any) => ({ ...it })) : [{ description: '', qty: 1, price: 0 }]
  formInvoice.taxPct = inv.taxPct || 19
  formInvoice.payments = Array.isArray(inv.payments) ? inv.payments.slice() : (inv.payments ? String(inv.payments).split(',').map((s: any) => s.trim()) : [])
  formInvoice.status = inv.status || 'Pendiente'
  formInvoice.notes = inv.notes || ''
  formInvoice.createdAt = inv.createdAt || new Date().toISOString()
  showInvoiceModal.value = true
}

function viewInvoice(inv: any) {
  printInvoice.value = { ...inv }
  nextTick(() => window.print())
}

function deleteInvoice(id: any) {
  if (!confirm('¿Eliminar factura?')) return
  const idx = burnedInvoices.findIndex((i: any) => i.id === id)
  if (idx > -1) burnedInvoices.splice(idx, 1)
}

function toggleInvoicePaid(inv: any) {
  inv.status = (inv.status === 'Pagado') ? 'Pendiente' : 'Pagado'
  const idx = burnedInvoices.findIndex((i: any) => i.id === inv.id)
  if (idx > -1) burnedInvoices.splice(idx, 1, { ...inv })
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
        status: inv.status
      }
    })
    const csv = [
      ['id', 'date', 'client', 'vehicle', 'items', 'subtotal', 'tax', 'total', 'status'],
      ...rows.map((r: any) => [r.id, r.date, `"${(r.client || '').replace(/"/g, '""')}"`, `"${(r.vehicle || '').replace(/"/g, '""')}"`, `"${(r.items || '').replace(/"/g, '""')}"`, r.subtotal, r.tax, r.total, r.status])
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
  return burnedInvoices.filter((inv: any) => {
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

function bulkMarkPaid() {
  if (!selectedInvoices.value.length) { alert('Ninguna factura seleccionada'); return }
  selectedInvoices.value.forEach((id: any) => {
    const inv = burnedInvoices.find((i: any) => i.id === id)
    if (inv) { inv.status = 'Pagado'; const idx = burnedInvoices.findIndex((i: any) => i.id === id); if (idx > -1) burnedInvoices.splice(idx, 1, { ...inv }) }
  })
  selectedInvoices.value = []
}

function exportSelectedCsv() {
  try {
    const rows = burnedInvoices.filter((i: any) => selectedInvoices.value.includes(i.id)).map((inv: any) => ({
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

function bulkDeleteSelected() {
  if (!selectedInvoices.value.length) { alert('Ninguna factura seleccionada'); return }
  if (!confirm(`¿Eliminar ${selectedInvoices.value.length} facturas?`)) return
  selectedInvoices.value.forEach((id: any) => {
    const idx = burnedInvoices.findIndex((i: any) => i.id === id)
    if (idx > -1) burnedInvoices.splice(idx, 1)
  })
  selectedInvoices.value = []
  currentPage.value = Math.min(currentPage.value, totalPages.value)
}

function goToPage(n: number) { currentPage.value = Math.min(Math.max(1, n), totalPages.value) }

// --- Fin mejoras ---

const burnedInventory = reactive([
  { id: 1, date: '2026-03-09', activity: 'Mantenimiento', quantity: 1, cost: 368000, invoiceValue: 715000, netProfit: 347000 },
  { id: 2, date: '2026-03-10', activity: 'Reparación', quantity: 1, cost: 260000, invoiceValue: 380000, netProfit: 120000 },
  { id: 3, date: '2026-03-12', activity: 'Diagnóstico', quantity: 1, cost: 40000, invoiceValue: 100000, netProfit: 60000 },
  { id: 4, date: '2026-03-13', activity: 'Mecánica general', quantity: 1, cost: 1698000, invoiceValue: 2560000, netProfit: 862000 },
  { id: 5, date: '2026-03-14', activity: 'Revisión de repuestos', quantity: 1, cost: 285000, invoiceValue: 440000, netProfit: 155000 }
])

const showCreateInventory = ref(false)
const showEditInventory = ref(false)
const newInventoryItem = reactive({
  date: new Date().toISOString().slice(0, 10),
  activity: '',
  quantity: 1,
  cost: 0,
  invoiceValue: 0,
  netProfit: 0
})
const editingInventory = ref<any | null>(null)

function nextInventoryId(): number {
  const ids = Array.isArray(burnedInventory) ? burnedInventory.map((item: any) => Number(item.id)).filter((id) => Number.isFinite(id)) : []
  return ids.length ? Math.max(...ids) + 1 : 1
}

function addInventoryItem() {
  const activity = String(newInventoryItem.activity || '').trim()
  if (!newInventoryItem.date || !activity) return
  burnedInventory.push({
    id: nextInventoryId(),
    date: newInventoryItem.date,
    activity,
    quantity: Number(newInventoryItem.quantity) || 1,
    cost: Number(newInventoryItem.cost) || 0,
    invoiceValue: Number(newInventoryItem.invoiceValue) || 0,
    netProfit: Number(newInventoryItem.netProfit) || 0
  })
  newInventoryItem.date = new Date().toISOString().slice(0, 10)
  newInventoryItem.activity = ''
  newInventoryItem.quantity = 1
  newInventoryItem.cost = 0
  newInventoryItem.invoiceValue = 0
  newInventoryItem.netProfit = 0
  showCreateInventory.value = false
}

function editInventoryItem(item: any) {
  editingInventory.value = { ...item }
  showEditInventory.value = true
}

function saveEditedInventory() {
  if (!editingInventory.value) return
  const idx = burnedInventory.findIndex((entry: any) => entry.id === editingInventory.value.id)
  if (idx === -1) return
  burnedInventory.splice(idx, 1, {
    ...editingInventory.value,
    quantity: Number(editingInventory.value.quantity) || 1,
    cost: Number(editingInventory.value.cost) || 0,
    invoiceValue: Number(editingInventory.value.invoiceValue) || 0,
    netProfit: Number(editingInventory.value.netProfit) || 0
  })
  editingInventory.value = null
  showEditInventory.value = false
}

function deleteInventoryItem(id: number) {
  if (!confirm('¿Eliminar este registro de inventario?')) return
  const idx = burnedInventory.findIndex((item: any) => item.id === id)
  if (idx > -1) burnedInventory.splice(idx, 1)
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



const AGENDA_STORAGE_KEY = 'jobscar_agenda'
const _storedAgenda = (() => {
  try {
    const raw = localStorage.getItem(AGENDA_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
})()

const burnedAgenda = reactive(_storedAgenda || [
  { id: 1, date: '2026-04-10', time: '09:00', client: 'Juan Pérez', vehicle: 'ABC123', service: 'Cambio aceite', mechanic: 'Pedro' },
  { id: 2, date: '2026-04-10', time: '11:00', client: 'María Gómez', vehicle: 'XYZ789', service: 'Revisión frenos', mechanic: 'Luis' }
])

// Persistir agenda en localStorage
watch(burnedAgenda, (newVal) => {
  try {
    localStorage.setItem(AGENDA_STORAGE_KEY, JSON.stringify(newVal))
  } catch (e) { }
}, { deep: true })

// ---------- Calendar / Agenda helpers ----------
const calendarDate = ref(new Date())
const showScheduleModal = ref(false)
const scheduleSelectedOrderId = ref(null)
const scheduleDateIso = ref('')
const scheduleTime = ref('09:00')
const orderPlateSearch = ref('')

const newCalendarOrder = reactive({ vehicle: '', client: '', serviceType: '', mechanic: '', total: 0, diagnosis: '' })

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
  // burnedAgenda items
  if (Array.isArray(burnedAgenda)) {
    burnedAgenda.forEach((a: any) => {
      if (a.date) {
        const iso = String(a.date).slice(0, 10)
        map[iso] = map[iso] || []
        map[iso].push({ type: 'agenda', ...a })
      }
    })
  }
  // burnedOrders scheduled events
  if (Array.isArray(burnedOrders)) {
    burnedOrders.forEach((o: any) => {
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

const activeOrdersForMonth = computed(() => {
  const month = calendarDate.value.getMonth()
  const year = calendarDate.value.getFullYear()
  const arr = (activeWorkOrders && 'value' in activeWorkOrders) ? activeWorkOrders.value : activeWorkOrders
  if (!Array.isArray(arr)) return []
  return arr.filter((o: any) => {
    const dateStr = o.deliveryDate || o.createdDate
    if (!dateStr) return false
    const d = new Date(dateStr)
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
  scheduleSelectedOrderId.value = orderId || null
  // si no viene fecha, usar fecha actual
  scheduleDateIso.value = dateIso || (new Date()).toISOString().slice(0, 10)
  scheduleTime.value = '09:00'
  showScheduleModal.value = true
}

function confirmSchedule() {
  const id = scheduleSelectedOrderId.value
  const dateIso = scheduleDateIso.value
  const time = scheduleTime.value || '09:00'
  if (!dateIso) { alert('Selecciona fecha'); return }
  if (id) {
    scheduleOrder(id, dateIso, time)
  } else {
    // crear nuevo evento/cita en la agenda en lugar de crear una orden
    createAgendaEvent(dateIso, time, { ...newCalendarOrder })
  }
  showScheduleModal.value = false
}

function nextAgendaId(): number {
  const ids = Array.isArray(burnedAgenda) ? burnedAgenda.map((a: any) => Number(a.id)).filter(n => Number.isFinite(n)) : []
  return ids.length ? Math.max(...ids) + 1 : 1
}

function createAgendaEvent(dateIso: string, time: string, payload: any) {
  // payload: vehicle, client, serviceType, mechanic
  const id = nextAgendaId()
  const ev = {
    id,
    date: dateIso,
    time: time || '09:00',
    client: String(payload.client || ''),
    vehicle: String(payload.vehicle || ''),
    service: String(payload.serviceType || payload.service || ''),
    mechanic: String(payload.mechanic || '')
  }
  burnedAgenda.push(ev)
  // limpiar form
  Object.assign(newCalendarOrder, { vehicle: '', client: '', serviceType: '', mechanic: '', total: 0, diagnosis: '' })
  alert('Cita creada: ' + dateIso + ' ' + time)
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

const burnedCashMovements = [
  { id: 1, date: '2026-03-27', reference: '', name: 'NISSAN', concept: 'TRABAJO REALIZADO', movement: 'Ingreso', amount: 80000, account: 'Banco', observation: '' },
  { id: 2, date: '2026-03-27', reference: '', name: 'BYD', concept: 'TRABAJO REALIZADO', movement: 'Ingreso', amount: 850000, account: 'Banco', observation: '' },
  { id: 3, date: '2026-03-27', reference: '', name: 'ACOPLES', concept: 'GASTO TALLER', movement: 'Egreso', amount: 10000, account: 'Caja Menor', observation: '' },
  { id: 4, date: '2026-03-28', reference: '', name: 'VW', concept: 'TRABAJO REALIZADO', movement: 'Ingreso', amount: 610000, account: 'Banco', observation: '' },
  { id: 5, date: '2026-03-28', reference: '', name: 'VW', concept: 'TRABAJO REALIZADO', movement: 'Ingreso', amount: 40000, account: 'Caja Menor', observation: '' },
  { id: 6, date: '2026-03-28', reference: '', name: 'ESKODA', concept: 'TRABAJO REALIZADO', movement: 'Ingreso', amount: 100000, account: 'Caja Menor', observation: '' },
  { id: 7, date: '2026-03-28', reference: '', name: 'PAGO FONDO', concept: 'GASTO CESAR', movement: 'Egreso', amount: 100000, account: 'Caja Menor', observation: '' },
  { id: 8, date: '2026-03-28', reference: '2X', name: 'VALE FREDY', concept: 'VALE EMPLEADO', movement: 'Egreso', amount: 250000, account: 'Banco', observation: '' },
  { id: 9, date: '2026-03-28', reference: '', name: 'CESAR', concept: 'GASTO CESAR', movement: 'Egreso', amount: 200000, account: 'Caja Menor', observation: '' }
]

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
    if (!Array.isArray(burnedReports.ingresos)) return []
    const buckets = new Map<string, number>()
    burnedReports.ingresos.forEach((r: any) => {
      const d = new Date(r.fecha)
      if (Number.isNaN(d.getTime())) return
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const half = d.getDate() <= 15 ? 'Q1' : 'Q2'
      const key = `${monthKey} ${half}`
      buckets.set(key, (buckets.get(key) || 0) + (Number(r.total) || 0))
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
// Filtrar órdenes activas e histórico (activo = status !== 'Entregado')
const activeWorkOrders = computed(() => {
  if (!Array.isArray(burnedOrders)) return []
  return burnedOrders.filter((o: any) => {
    const st = (o.status || '').toString().toLowerCase().trim()
    return st !== 'entregado'
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

const payrollRows = computed(() => {
  return burnedEmployees.map((employee: any) => {
    const mechanicKey = String(employee.name || '').trim().toLowerCase()
    const orders = historicalWorkOrders.value.filter((order: any) => {
      const orderMechanic = String(order.mechanic || '').trim().toLowerCase()
      return mechanicKey && orderMechanic === mechanicKey && Number(order.total || 0) > 0
    })
    const grossTotal = orders.reduce((sum: number, order: any) => sum + (Number(order.total) || 0), 0)

    return {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      ordersCount: orders.length,
      grossTotal,
      technicianShare: grossTotal * 0.5,
      workshopShare: grossTotal * 0.5
    }
  })
})

const payrollTotals = computed(() => {
  const grossTotal = payrollRows.value.reduce((sum: number, row: any) => sum + (Number(row.grossTotal) || 0), 0)
  return {
    grossTotal,
    technicianShare: grossTotal * 0.5,
    workshopShare: grossTotal * 0.5,
    ordersCount: historicalWorkOrders.value.filter((order: any) => Number(order.total || 0) > 0 && String(order.mechanic || '').trim()).length
  }
})

// UI state y helpers para crear/editar/eliminar órdenes
const showCreateOrder = ref(false)
const showEditOrder = ref(false)
const editingOrder: Ref<any | null> = ref(null)
const newOrder = reactive({ vehicle: '', client: '', status: 'Recepción', serviceType: '', services: [] as string[], parts: [] as string[], mechanic: '', mileage: null as number | null, total: 0, diagnosis: '', observations: '', garantia: 0, createdDate: '', deliveryDate: '', gases: false, escaner: false })

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
    const vehicleObj = (Array.isArray(burnedVehicles) ? burnedVehicles.find((v: any) => v.plate === order.vehicle) : null) || null
    const issueDate = order.createdDate ? (new Date(order.createdDate).toLocaleDateString()) : (new Date().toLocaleDateString())
    const servicesHtml = (Array.isArray(order.services) && order.services.length)
      ? `<ul style="margin:0;padding-left:18px">${order.services.map((s: string) => `<li style="margin-bottom:6px">${s}</li>`).join('')}</ul>`
      : (order.serviceType ? `<p>${order.serviceType}</p>` : '-')
    const partsText = (Array.isArray(order.parts) && order.parts.length) ? ('<div style="margin-top:8px;font-size:0.95rem;color:#334155">Repuestos: ' + order.parts.join(', ') + '</div>') : ''
    const flagsHtml = ((order.gases ? '<div style="margin-top:8px;font-size:0.95rem;color:#334155">Gases: Sí</div>' : '') + (order.escaner ? '<div style="margin-top:4px;font-size:0.95rem;color:#334155">Escaner: Sí</div>' : ''))
    const observationsHtml = (String(order.observations || '').trim() || partsText) ? (`<div>${String(order.observations || '').trim().replace(/\n/g, '<br/>')}</div>${partsText}`) : '-'
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Job's Car | Taller Automotriz en Bogotá - Mantenimiento y Reparación de Vehículos</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>
      @page { margin: 12mm; }
      body { font-family: Arial, Helvetica, sans-serif; color:#111827; background:#ffffff; margin:0; padding:0; }
      .service-order-card { max-width: 920px; margin: 10mm auto; padding: 0; box-sizing: border-box; background: #ffffff; border-radius: 12px; overflow: visible; box-shadow: 0 6px 22px rgba(16,24,40,0.06); border: 1px solid rgba(0,0,0,0.06); }
      .so-topbar { display:flex; justify-content:space-between; align-items:stretch; gap:16px; padding: 18px 20px; background: transparent; color:#111827; border-top-left-radius:12px; border-top-right-radius:12px; }
      .so-brand { display:flex; align-items:center; gap:14px; min-width:0; }
      .so-logo { width:98px; height:68px; flex:0 0 auto; border-radius:12px; background:#000000;  display:inline-flex; align-items:center; justify-content:center; box-shadow: 0 6px 20px rgba(11,12,13,0.12); }
      .so-logo img { width:100%; height:100%; object-fit:cover; border-radius:8px; display:block; }
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
      .so-meta-grid { display:grid; grid-template-columns: 1fr 1.35fr 0.75fr; gap:12px; padding: 18px 24px 0 24px; }
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
            <img class="so-logo" src="${location.origin}/images/logo.png" alt="Jobs Car logo" />
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
          <div class="so-meta-card"><span>Técnico</span><strong>${order.mechanic || '-'}</strong></div>
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
          setTimeout(onLoaded, 400)
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

onMounted(() => {
  window.addEventListener('afterprint', clearPrintOrder)
  refreshWorkOrders()
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

function buildWorkOrderPayload(source: any) {
  const vehicleId = Number(source?.vehicleId || resolveVehicleIdByPlate(source?.vehicle || ''))
  const mechanicId = Number(source?.mechanicId || resolveMechanicIdByName(source?.mechanic || ''))

  if (!vehicleId) {
    throw new Error('No se pudo resolver el vehículo para la orden')
  }

  if (!mechanicId) {
    throw new Error('Selecciona un técnico válido para la orden')
  }

  return {
    vehicleId,
    mechanicId,
    status: String(source?.status || 'Recepción'),
    services: getOrderServiceChips(source),
    gases: Boolean(source?.gases),
    escaner: Boolean(source?.escaner),
    observations: String(source?.observations || ''),
    diagnosis: String(source?.diagnosis || ''),
    deliveryDate: source?.deliveryDate || undefined,
    garantia: Number(source?.garantia) || 0,
    total: Number(source?.total) || 0
  }
}

function openCreateOrder() {
  Object.assign(newOrder, { vehicle: '', client: '', status: 'Recepción', serviceType: '', services: [], parts: [], mechanic: '', mileage: null, total: 0, diagnosis: '', observations: '', garantia: 0, gases: false, escaner: false })
  orderPlateSearch.value = ''
  newServiceItem.value = ''
  showCreateOrder.value = true
}

async function createOrder() {
  try {
    const payload = buildWorkOrderPayload(newOrder)
    await workOrderService.createWorkOrder(payload)
    await refreshWorkOrders()
    Object.assign(newOrder, { vehicle: '', client: '', status: 'Recepción', serviceType: '', services: [], parts: [], mechanic: '', mileage: null, total: 0, diagnosis: '', observations: '', garantia: 0, createdDate: '', deliveryDate: '', gases: false, escaner: false })
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
    await refreshWorkOrders()
    showEditOrder.value = false
    editingOrder.value = null
  } catch (error) {
    console.error('No se pudo actualizar la orden', error)
    alert(error instanceof Error ? error.message : 'No se pudo actualizar la orden')
  }
}

async function deleteOrder(id: number) {
  if (!confirm('¿Estás seguro de eliminar esta orden?')) return
  try {
    await workOrderService.deleteWorkOrder(id)
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
  const rev = dashboardBiweeklyLast.value || totalRevenue.value || 0
  const cost = Math.round(rev * 0.6)
  const total = rev + cost || 1
  return { rev, cost, revPct: Math.round((rev / total) * 100), costPct: Math.round((cost / total) * 100) }
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
  padding: 0.875rem 3.5rem 0.875rem 2.75rem;
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
  .print-area {
    display: block !important;
    position: relative !important;
    left: auto !important;
    top: auto !important;
    width: 100% !important;
    background: #fff !important;
    color: #000 !important;
    padding: 0 !important;
    margin: 0 auto !important;
  }

  .print-area * {
    display: block !important;
  }

  /* Estilos de la tarjeta dentro del área de impresión */
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
  }

  .service-order-card {
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
    margin: 12mm 10mm;
  }
}
</style>
