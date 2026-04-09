<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div>
        <h1>Servicios del taller</h1>
        <p>Catálogo visual de los principales servicios que ofrece tu taller.</p>
      </div>
    </header>

    <main class="dashboard-main single-column">
      <section class="panel panel-services">
        <header class="panel-header">
          <div>
            <h2>Paquetes destacados</h2>
            <p>Muestra estos servicios a tus clientes al crear una orden.</p>
          </div>
        </header>
        <div class="panel-body">
          <p class="hint">
            Esta vista está pensada para explicar rápidamente qué incluye cada servicio y sus tiempos estimados.
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
  max-width: 1100px;
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
  margin-bottom: 6px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin: 6px 0 10px;
}

.service-card {
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: radial-gradient(circle at top left, rgba(30, 64, 175, 0.5), rgba(15, 23, 42, 0.95));
  padding: 12px 14px;
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

@media (max-width: 640px) {
  .dashboard-container {
    padding-inline: 12px;
  }
}
</style>
