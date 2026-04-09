<template>
  <section id="contacto" class="visit-section">
    <div class="visit-container">
      <header class="visit-header">
        <h2 class="visit-title">Visítanos</h2>
        <p class="visit-subtitle">
          Estamos en Cra 79 # 67-39, Bogotá, Colombia. Agenda tu servicio por WhatsApp o acércate
          directamente a nuestro taller.
        </p>
      </header>

      <div class="visit-layout">
        <div class="visit-map-card">
          <iframe
            class="visit-map"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Cra+79+%23+67-39,+Bogot%C3%A1,+Colombia&output=embed"
            title="Ubicación Job's Car"
          ></iframe>
        </div>

        <div class="visit-info-column">
          <a
            href="https://wa.me/573144607515"
            target="_blank"
            rel="noopener"
            class="visit-card visit-card-clickable"
          >
            <div class="visit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"
                />
              </svg>
            </div>
            <div class="visit-text">
              <span class="visit-label">Teléfono / WhatsApp</span>
              <span class="visit-value">+57 314 4607515</span>
              <span class="visit-note">Atención rápida para agendar tu servicio.</span>
            </div>
          </a>

          <div class="visit-card">
            <div class="visit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="4 6 12 12 20 6" />
              </svg>
            </div>
            <div class="visit-text">
              <span class="visit-label">Correo</span>
              <span class="visit-value">contacto@jobscar.com</span>
              <span class="visit-note">Escríbenos para cotizaciones o dudas sobre tu vehículo.</span>
            </div>
          </div>

          <div class="visit-card">
            <div class="visit-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 16 14" />
              </svg>
            </div>
            <div class="visit-text">
              <span class="visit-label">Horarios</span>
              <span class="visit-value">Lunes a Sábado: 8:00 AM - 6:00 PM</span>
              <span class="visit-note">Domingos y festivos: atención por disponibilidad.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="visit-address-card">
        <div class="visit-icon large">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M12 21s-6-5.14-6-10a6 6 0 1 1 12 0c0 4.86-6 10-6 10z" />
            <circle cx="12" cy="11" r="2.4" />
          </svg>
        </div>
        <div class="visit-text">
          <span class="visit-label">Dirección</span>
          <span class="visit-value">Cra 79 # 67-39, Bogotá, Colombia</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ContactSection'
})
</script>

<style scoped>
/* === ANIMACIONES (mantener por si se reutilizan) === */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Nueva sección "Visítanos" */
.visit-section {
  padding: 2.5rem 0 3rem;
  background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 55%),
    radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.9), #020617);
  border-top: 1px solid rgba(30, 64, 175, 0.5);
  border-bottom: 1px solid rgba(30, 64, 175, 0.4);
}

.visit-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.visit-header {
  text-align: center;
  margin-bottom: 2rem;
}

.visit-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #f9fafb;
  margin: 0 0 0.5rem;
}

.visit-subtitle {
  margin: 0 auto;
  max-width: 620px;
  font-size: 0.98rem;
  color: rgba(209, 213, 219, 0.9);
}

.visit-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(0, 1.2fr);
  gap: 1.75rem;
  align-items: stretch;
}

.visit-map-card {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.85);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.9);
}

.visit-map {
  width: 100%;
  height: 280px;
  border: 0;
}

.visit-info-column {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.visit-card {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 0.95rem 1.2rem;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid rgba(30, 64, 175, 0.6);
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.85);
}

.visit-card-clickable {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.visit-card-clickable:hover {
  transform: translateY(-2px);
  border-color: var(--primary-red);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.95);
}

.visit-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 0%, rgba(248, 250, 252, 0.25), transparent 55%),
    rgba(15, 23, 42, 1);
  border: 1px solid rgba(148, 163, 184, 0.8);
  color: var(--primary-red);
  flex-shrink: 0;
}

.visit-icon.large {
  width: 46px;
  height: 46px;
}

.visit-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.visit-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(148, 163, 184, 0.95);
}

.visit-value {
  font-size: 0.98rem;
  font-weight: 600;
  color: #e5e7eb;
}

.visit-note {
  font-size: 0.8rem;
  color: rgba(148, 163, 184, 0.95);
}

.visit-address-card {
  margin-top: 1.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1.4rem;
  border-radius: 16px;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.98), rgba(30, 64, 175, 0.9));
  border: 1px solid rgba(30, 64, 175, 0.9);
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.9);
}

/* Redes sociales compactas */
.social-links-compact {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.social-icon-compact {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-icon-compact:hover {
  transform: translateY(-2px);
}

.social-icon-compact.facebook:hover {
  background: #1877F2;
  border-color: #1877F2;
  color: #ffffff;
}

.social-icon-compact.instagram:hover {
  background: linear-gradient(135deg, #F58529, #DD2A7B);
  border-color: #E4405F;
  color: #ffffff;
}

.social-icon-compact.tiktok:hover {
  background: #000000;
  border-color: #00f2ea;
  color: #00f2ea;
}

/* Responsive para "Visítanos" */
@media (max-width: 1024px) {
  .visit-container {
    padding: 0 1.5rem;
  }

  .visit-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .visit-map {
    height: 260px;
  }
}

@media (max-width: 768px) {
  .visit-section {
    padding: 2rem 0 2.5rem;
  }

  .visit-title {
    font-size: 1.5rem;
  }

  .visit-subtitle {
    font-size: 0.9rem;
  }

  .visit-container {
    padding: 0 1.25rem;
  }

  .visit-map {
    height: 230px;
  }

  .visit-card {
    padding: 0.85rem 1rem;
  }

  .visit-icon {
    width: 38px;
    height: 38px;
  }

  .visit-address-card {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .visit-container {
    padding: 0 1rem;
  }

  .visit-title {
    font-size: 1.35rem;
  }

  .visit-subtitle {
    font-size: 0.86rem;
  }

  .visit-map {
    height: 210px;
  }

  .visit-card {
    padding: 0.8rem 0.9rem;
  }

  .visit-value {
    font-size: 0.92rem;
  }

  .visit-note {
    font-size: 0.76rem;
  }

  .visit-address-card {
    padding: 0.85rem 1rem;
    gap: 0.7rem;
  }

  .visit-icon.large {
    width: 42px;
    height: 42px;
  }
}
</style>
