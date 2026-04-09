<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div>
        <h1>Reportes del taller</h1>
        <p>Resumen de la salud de tu taller: tickets, servicios y facturación.</p>
      </div>
    </header>

    <main class="dashboard-main single-column">
      <section class="panel">
        <header class="panel-header">
          <div>
            <h2>Panel de indicadores</h2>
            <p>En la versión completa verás aquí KPIs y gráficos.</p>
          </div>
        </header>
        <div class="panel-body">
          <p class="hint">
            Esta vista está pensada para mostrar métricas clave del taller: servicios realizados, órdenes abiertas,
            facturación estimada, etc. Por ahora es sólo una maqueta visual.
          </p>
          <div class="kpi-grid">
            <div class="kpi-card">
              <p class="kpi-label">Órdenes abiertas</p>
              <p class="kpi-value">12</p>
              <p class="kpi-helper">En cola para hoy</p>
            </div>
            <div class="kpi-card">
              <p class="kpi-label">Servicios del mes</p>
              <p class="kpi-value">87</p>
              <p class="kpi-helper">Comparado con el mes anterior</p>
            </div>
            <div class="kpi-card">
              <p class="kpi-label">Facturación estimada</p>
              <p class="kpi-value">$18.5M</p>
              <p class="kpi-helper">Proyección estimada</p>
            </div>
          </div>
          <div class="placeholder-report">
            <h3>Gráficos y tendencias</h3>
            <p>Aquí irán gráficos de barras, líneas y comparativas de periodos.</p>
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
  gap: 16px;
}

.hint {
  font-size: 0.78rem;
  color: #9ca3af;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.kpi-card {
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(15, 23, 42, 0.9);
  padding: 10px 14px;
}

.kpi-label {
  font-size: 0.78rem;
  color: #9ca3af;
  margin-bottom: 4px;
}

.kpi-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #f9fafb;
}

.kpi-helper {
  margin-top: 2px;
  font-size: 0.78rem;
  color: #9ca3af;
}

.placeholder-report {
  border-radius: 14px;
  border: 1px dashed rgba(148, 163, 184, 0.5);
  background: rgba(15, 23, 42, 0.9);
  padding: 14px 16px;
}

.placeholder-report h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.placeholder-report p {
  font-size: 0.8rem;
  color: #d1d5db;
}

@media (max-width: 640px) {
  .dashboard-container {
    padding-inline: 12px;
  }
}
</style>
