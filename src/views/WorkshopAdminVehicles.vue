<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div>
        <h1>Gestión de vehículos</h1>
        <p>Vista pensada para organizar los vehículos asociados a tus clientes.</p>
      </div>
    </header>

    <main class="dashboard-main single-column">
      <section class="panel">
        <header class="panel-header">
          <div>
            <h2>Gestión de flota de clientes</h2>
            <p>En la versión completa verás aquí vehículos, historial y próximos mantenimientos.</p>
          </div>
        </header>
        <div class="panel-body">
          <p class="hint">
            Esta vista está en construcción. La lógica de vehículos e historial ya existe en la pestaña de
            <strong>Clientes</strong>, donde puedes seleccionar un cliente y ver sus vehículos y servicios realizados.
          </p>
          <div class="placeholder-grid">
            <div class="placeholder-card">
              <h3>Listado de vehículos</h3>
              <p>Tabla con placa, marca, modelo, año y kilometraje por cliente.</p>
            </div>
            <div class="placeholder-card">
              <h3>Historial por vehículo</h3>
              <p>Detalle de órdenes de trabajo, diagnósticos y aprobaciones.</p>
            </div>
            <div class="placeholder-card">
              <h3>Recordatorios de mantenimiento</h3>
              <p>Alertas de próximos cambios de aceite, revisiones y SOAT.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
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

.dashboard-main.single-column {
  max-width: 1000px;
  margin: 0 auto;
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

.hint {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-bottom: 10px;
}

.placeholder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.placeholder-card {
  border-radius: 14px;
  border: 1px dashed rgba(148, 163, 184, 0.5);
  background: rgba(15, 23, 42, 0.9);
  padding: 12px 14px;
}

.placeholder-card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.placeholder-card p {
  font-size: 0.8rem;
  color: #d1d5db;
}

@media (max-width: 640px) {
  .dashboard-container {
    padding-inline: 12px;
  }
}
</style>
