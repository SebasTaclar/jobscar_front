<template>
  <section id="services" class="services-section">
    <div class="services-inner">
      <header class="services-header">
        <h2 class="services-title">Nuestros servicios destacados  </h2>
        <p class="services-subtitle">
          Ofrecemos servicio completo de diagnóstico, mantenimiento y reparación de automóviles
          con un equipo especializado en mecánica automotriz.
        </p>
        <div class="services-divider"></div>
      </header>

      <div class="services-layout">
        <!-- Tabs estilo original para desktop -->
        <div class="services-tabs-desktop">
          <button
            v-for="(service, index) in services"
            :key="service.id"
            type="button"
            class="service-pill"
            :class="{ active: index === activeIndex }"
            @click="setActive(index)"
          >
            <span class="pill-icon">
              <svg
                v-if="service.id === 'diagnostico'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="14" height="10" rx="2" />
                <path d="M7 19h6" />
                <path d="M10 13v6" />
                <circle cx="18.5" cy="8.5" r="2" />
              </svg>

              <svg
                v-else-if="service.id === 'motor'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="7" width="14" height="8" rx="2" />
                <path d="M7 7V5h4" />
                <path d="M17 11h3v3" />
              </svg>

              <svg
                v-else-if="service.id === 'liquidos'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 3h6l-1 4H7z" />
                <path d="M7 7h6v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7z" />
                <path d="M14 11c.5.3.9.9.9 1.5a1.6 1.6 0 0 1-3.2 0C11.7 11.5 12 11 12.5 10.7" />
              </svg>

              <svg
                v-else-if="service.id === 'llantas'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2.2" />
                <path d="M12 5v2.5M12 16.5V19M5 12h2.5M16.5 12H19" />
              </svg>

              <svg
                v-else-if="service.id === 'transmision'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="7" cy="5" r="2" />
                <circle cx="17" cy="5" r="2" />
                <circle cx="17" cy="12" r="2" />
                <circle cx="17" cy="19" r="2" />
                <path d="M7 7v10" />
                <path d="M9 5h6" />
                <path d="M17 7v3" />
                <path d="M17 14v3" />
              </svg>

              <svg
                v-else-if="service.id === 'baterias'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="7" width="18" height="10" rx="2" />
                <path d="M8 10h2M9 9v2" />
                <path d="M14 11h2" />
                <path d="M9 4h2M13 4h2" />
              </svg>
            </span>
            <span class="pill-label">{{ service.label }}</span>
          </button>
        </div>

        <!-- Carrusel con flechas solo para mobile -->
        <div class="services-tabs-mobile">
          <button type="button" class="carousel-arrow" @click="prevService" aria-label="Servicio anterior">
            ‹
          </button>

          <div class="service-pill active">
            <span class="pill-icon">
              <svg
                v-if="activeService.id === 'diagnostico'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="14" height="10" rx="2" />
                <path d="M7 19h6" />
                <path d="M10 13v6" />
                <circle cx="18.5" cy="8.5" r="2" />
              </svg>

              <svg
                v-else-if="activeService.id === 'motor'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="7" width="14" height="8" rx="2" />
                <path d="M7 7V5h4" />
                <path d="M17 11h3v3" />
              </svg>

              <svg
                v-else-if="activeService.id === 'liquidos'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 3h6l-1 4H7z" />
                <path d="M7 7h6v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7z" />
                <path d="M14 11c.5.3.9.9.9 1.5a1.6 1.6 0 0 1-3.2 0C11.7 11.5 12 11 12.5 10.7" />
              </svg>

              <svg
                v-else-if="activeService.id === 'llantas'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2.2" />
                <path d="M12 5v2.5M12 16.5V19M5 12h2.5M16.5 12H19" />
              </svg>

              <svg
                v-else-if="activeService.id === 'transmision'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="7" cy="5" r="2" />
                <circle cx="17" cy="5" r="2" />
                <circle cx="17" cy="12" r="2" />
                <circle cx="17" cy="19" r="2" />
                <path d="M7 7v10" />
                <path d="M9 5h6" />
                <path d="M17 7v3" />
                <path d="M17 14v3" />
              </svg>

              <svg
                v-else-if="activeService.id === 'baterias'"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="7" width="18" height="10" rx="2" />
                <path d="M8 10h2M9 9v2" />
                <path d="M14 11h2" />
                <path d="M9 4h2M13 4h2" />
              </svg>
            </span>
            <span class="pill-label">{{ activeService.label }}</span>
          </div>

          <button type="button" class="carousel-arrow" @click="nextService" aria-label="Siguiente servicio">
            ›
          </button>
        </div>

        <div class="services-hero">
          <div class="services-hero-content">
            <p class="hero-badge">SERVICIO ESPECIALIZADO</p>
            <p class="hero-text">
              {{ activeService.description }}
            </p>
          </div>
          <div class="services-hero-image"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type ServiceId = 'diagnostico' | 'motor' | 'liquidos' | 'llantas' | 'transmision' | 'baterias'

interface Service {
  id: ServiceId
  label: string
  description: string
}

const services: Service[] = [
  {
    id: 'diagnostico',
    label: 'Diagnóstico',
    description:
      'Si tu vehículo presenta pérdida de potencia, ruidos extraños o testigos encendidos en el tablero, realizamos un diagnóstico completo para identificar el problema antes de reparar.',
  },
  {
    id: 'motor',
    label: 'Motor',
    description:
      'Mantenemos y reparamos el motor de tu vehículo, cuidando lubricación, sistema de inyección y componentes clave para que siempre responda con buena potencia.',
  },
  {
    id: 'liquidos',
    label: 'Líquidos',
    description:
      'Revisamos y cambiamos aceite, líquido de frenos, refrigerante y demás fluidos esenciales para que tu carro funcione seguro y sin sobrecalentamientos.',
  },
  {
    id: 'llantas',
    label: 'Llantas',
    description:
      'Inspeccionamos desgaste, presión y alineación de llantas para garantizar mejor agarre, estabilidad y seguridad en cada trayecto.',
  },
  {
    id: 'transmision',
    label: 'Transmisión',
    description:
      'Diagnosticamos y corregimos ruidos, golpes o dificultades al cambiar de marcha en sistemas de transmisión manual y automática.',
  },
  {
    id: 'baterias',
    label: 'Baterías',
    description:
      'Probamos y reemplazamos baterías para que tu vehículo siempre encienda a la primera y no te deje varado.',
  },
]

const activeIndex = ref(0)

const activeService = computed<Service>(() => services[activeIndex.value] ?? services[0])

const nextService = () => {
  activeIndex.value = (activeIndex.value + 1) % services.length
}

const prevService = () => {
  activeIndex.value = (activeIndex.value - 1 + services.length) % services.length
}

const setActive = (index: number) => {
  activeIndex.value = index
}

defineOptions({
  name: 'ServicesSection',
})
</script>

<style scoped>
.services-section {
  padding: 0 0rem 0rem;
}

.services-inner {
  max-width: auto;
  margin: 0 auto;
  background: #111827;
  border: 1px solid #0f1114;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  padding: 2.5rem 2.5rem 2.75rem;
}

.services-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.services-title {
  font-size: 1.9rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  color: #ffffff;
}

.services-subtitle {
  margin: 0 auto 1.2rem;
  max-width: 680px;
  font-size: 0.98rem;
  color: #ffffff;
}

.services-divider {
  width: 60px;
  height: 3px;
  margin: 0 auto;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, #b66e25, transparent);
}

.services-layout {
  margin-top: 2.5rem;
}
/* Tabs de escritorio (estilo original) */
.services-tabs-desktop {
  display: flex;
  border: 1px solid #ffffff;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
}

.services-tabs-desktop .service-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.1rem 0.9rem;
  flex: 1;
  min-width: 120px;
  background: #D1D9E1;
  border-right: 1px solid #ffffff;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  border-top: none;
  outline: none;
}

.services-tabs-desktop .service-pill:hover {
  background: #D1D9E1;
}

.services-tabs-desktop .service-pill:last-child {
  border-right: none;
}

.services-tabs-desktop .service-pill.active {
  background: #ffffff;
  border-bottom-color: #720d16;
}

.pill-icon {
  font-size: 1.6rem;
}

.pill-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
}

/* Carrusel mobile */
.services-tabs-mobile {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 999px;
  padding: 0.4rem 0.6rem;
}

.services-tabs-mobile .service-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.4rem;
  background: #D1D9E1;
  border-radius: 999px;
  border: 1px solid #ffffff;
  cursor: default;
}

.services-tabs-mobile .service-pill.active {
  background: #ffffff;
  border-bottom-color: #720d16;
}

.carousel-arrow {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: rgba(15, 23, 42, 0.85);
  color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.4rem;
  line-height: 1;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.carousel-arrow:hover {
  background: rgba(220, 38, 38, 0.9);
  border-color: rgba(248, 250, 252, 0.9);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
  transform: translateY(-1px);
}

.services-hero {
  position: relative;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  background: #4b4b4b;
  min-height: 260px;
  display: flex;
  align-items: stretch;

  border-top: none;
  margin-top: 0;
}

.services-hero-content {
  width: 45%;
  padding: 2rem 2.2rem;
  background: rgba(38, 38, 38, 0.9);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.hero-badge {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #e5e7eb;
}

.hero-text {
  font-size: 0.95rem;
  color: rgba(226, 232, 240, 0.95);
  line-height: 1.6;
}

.services-hero-image {
  flex: 1;
  min-height: 260px;
  height: 300px;
  background: url('https://de.cdn-website.com/14b5a3cb6822457bbce63f05e05d2402/MOBILE/jpg/partes-de-un-vehiculo.jpg') center/cover no-repeat;
}

@media (max-width: 900px) {
  .services-hero {
    flex-direction: column;
  }

  .services-hero-content {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .services-inner {
    padding: 2rem 1.5rem 2.25rem;
  }
}

@media (max-width: 1024px) {
  .services-inner {
    padding: 2.25rem 2rem 2.5rem;
  }

  .service-pill {
    padding-inline: 0.75rem;
  }
}

@media (max-width: 768px) {
  .services-inner {
    padding: 2rem 1.5rem 2.25rem;
  }
  .pill-icon svg {
    width: 26px;
    height: 26px;
    color: #0f1114;
  }

.services-tabs-mobile .service-pill
  {
    border-radius: 5px;
    width: 170px;
  }

  .services-hero {
    margin-top: 0.5rem;
  }
}

@media (max-width: 480px) {
  .services-inner {
    padding: 1.75rem 1.25rem 2rem;
  }

  .services-title {
    font-size: 1.6rem;
  }

  .services-subtitle {
    font-size: 0.9rem;
  }

.services-hero-image
  {
    min-height: 0;
  }
  .services-hero-content {
    padding: 1.1rem 1.4rem;
  }

  .hero-text {
    font-size: 0.9rem;
  }
}

/* Mostrar solo carrusel en mobile y tabs en desktop */
@media (max-width: 768px) {
  .services-tabs-desktop {
    display: none;
  }

  .services-tabs-mobile {
    display: flex;
  }
}

@media (min-width: 769px) {
  .services-tabs-desktop {
    display: flex;
  }

  .services-tabs-mobile {
    display: none;
  }
}
</style>
