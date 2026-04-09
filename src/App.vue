<template>
  <header>
    <nav class="navbar">
      <!-- Logo y marca -->
      <RouterLink class="link-navbar home" to="/" @click="goToMainBanner">
        <div class="brand-container">
          <div class="brand-logo-image">
            <img src="/images/logo.jpg" alt="Job's Car" />
          </div>

        </div>
      </RouterLink>

      <!-- Navegación principal -->
      <div class="nav-menu desktop-nav">
        <RouterLink
          to="/"
          class="nav-link"
          :class="{ active: isCurrentRoute('/') }"
          @click="goToMainBanner"
        >
          Inicio
        </RouterLink>
        <a href="#servicios" class="nav-link" @click="goToServicios">Servicios</a>
        <a href="#contacto" class="nav-link" @click="goToContacto">Contacto</a>
      </div>

      <!-- Controles de usuario -->
      <div class="nav-controls desktop-nav">
        <RouterLink class="btn access-btn" to="/admin/products">Acceder</RouterLink>
        <RouterLink v-if="isLoggedIn && isAdmin" class="btn admin-btn" to="/admin/products">⚙️ Panel Admin</RouterLink>
        <RouterLink v-if="isLoggedIn" @click="logout" class="btn logout-btn" to="/">Cerrar sesión</RouterLink>
        <div v-if="isLoggedIn" class="user-greeting">
          <span>{{ username }}</span>
        </div>
      </div>

      <!-- Menu hamburguesa para mobile -->
      <button class="hamburger-menu" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Menu mobile desplegable -->
      <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
        <div class="mobile-menu-content">
          <div class="mobile-nav-links">
            <RouterLink
              to="/"
              class="mobile-link"
              :class="{ active: isCurrentRoute('/') }"
              @click="goToMainBanner"
            >
              Inicio
            </RouterLink>
            <a href="#servicios" class="mobile-link" @click="goToServicios">Servicios</a>
            <a href="#contacto" class="mobile-link" @click="goToContacto">Contacto</a>
            <RouterLink
              v-if="isWorkshopAdminRoute"
              to="/workshop/admin/clients"
              class="mobile-link"
              :class="{ active: currentRoute.path === '/workshop/admin/clients' }"
              @click="closeMobileMenu"
            >
              Clientes
            </RouterLink>
            <RouterLink
              v-if="isWorkshopAdminRoute"
              to="/workshop/admin/services"
              class="mobile-link"
              :class="{ active: currentRoute.path === '/workshop/admin/services' }"
              @click="closeMobileMenu"
            >
              Servicios
            </RouterLink>
            <RouterLink
              v-if="isWorkshopAdminRoute"
              to="/workshop/admin/vehicles"
              class="mobile-link"
              :class="{ active: currentRoute.path === '/workshop/admin/vehicles' }"
              @click="closeMobileMenu"
            >
              Gestión de vehículos
            </RouterLink>
            <RouterLink
              v-if="isWorkshopAdminRoute"
              to="/workshop/admin/reports"
              class="mobile-link"
              :class="{ active: currentRoute.path === '/workshop/admin/reports' }"
              @click="closeMobileMenu"
            >
              Reportes
            </RouterLink>
          </div>

          <div class="mobile-controls">
            <RouterLink class="mobile-btn access-btn" to="/admin/products" @click="closeMobileMenu">
              Acceder
            </RouterLink>
            <div v-if="isLoggedIn" class="mobile-user-greeting">
              <span>Hola, {{ username }}</span>
            </div>
            <RouterLink v-if="isLoggedIn && isAdmin" class="mobile-btn admin-btn" to="/admin/products" @click="closeMobileMenu">
              ⚙️ Panel Admin
            </RouterLink>
            <button v-if="isLoggedIn" @click="handleMobileLogout" class="mobile-btn logout-btn">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
    <div v-if="isWorkshopAdminRoute" class="admin-tabs-bar desktop-nav">
        <RouterLink
          to="/workshop/admin/clients"
          class="admin-tab-link"
          :class="{ active: currentRoute.path === '/workshop/admin/clients' }"
        >
          Clientes
        </RouterLink>
        <RouterLink
          to="/workshop/admin/services"
          class="admin-tab-link"
          :class="{ active: currentRoute.path === '/workshop/admin/services' }"
        >
          Servicios
        </RouterLink>
        <RouterLink
          to="/workshop/admin/vehicles"
          class="admin-tab-link"
          :class="{ active: currentRoute.path === '/workshop/admin/vehicles' }"
        >
          Gestión de vehículos
        </RouterLink>
        <RouterLink
          to="/workshop/admin/reports"
          class="admin-tab-link"
          :class="{ active: currentRoute.path === '/workshop/admin/reports' }"
        >
          Reportes
        </RouterLink>
    </div>
  </header>

  <RouterView />

  <!-- Botones flotantes de redes sociales -->
  <SocialFloating />
</template>

<script setup lang="ts">
// Función para ir al banner principal (Home)
const goToMainBanner = (e: Event) => {
  e.preventDefault();
  closeMobileMenu();
  router.push('/');
  setTimeout(() => {
    const banner = document.querySelector('.main-banner');
    if (banner) {
      banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

// Función para ir a la sección de servicios
const goToServicios = (e: Event) => {
  e.preventDefault();
  closeMobileMenu();
  const scrollToServices = () => {
    const services = document.getElementById('services');
    if (services) {
      services.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  if (currentRoute.path !== '/') {
    router.push('/').then(() => {
      setTimeout(scrollToServices, 300);
    });
  } else {
    scrollToServices();
  }
};

// Función para ir a la sección de contacto
const goToContacto = (e: Event) => {
  e.preventDefault();
  closeMobileMenu();
  if (currentRoute.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const contacto = document.getElementById('contacto');
        if (contacto) {
          contacto.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    });
  } else {
    const contacto = document.getElementById('contacto');
    if (contacto) {
      contacto.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { authService } from '@/services/api';
import { onMounted, ref, watch, computed } from 'vue';
import router from './router';
import SocialFloating from '@/components/SocialFloating.vue';

const isLoggedIn = ref(false);
const username = ref('');
const isMobileMenuOpen = ref(false);

// Router hooks
const currentRoute = useRoute();

// Ruta de panel del taller
const isWorkshopAdminRoute = computed(() => currentRoute.path.startsWith('/workshop/admin'));

// Verificar si el usuario es administrador
const isAdmin = computed(() => authService.isAdmin());

// Función para verificar la ruta actual
const isCurrentRoute = (path: string): boolean => {
  return currentRoute.path === path;
};

// Funciones para el menú hamburguesa
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Función para hacer scroll a la sección de productos
/* const scrollToProductStore = () => {
  const productStoreSection = document.querySelector('.product-store');
  if (productStoreSection) {
    productStoreSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}; */

// Función para hacer scroll a la sección de contacto
/* const scrollToContact = () => {
  const contactSection = document.querySelector('.contact-section');
  if (contactSection) {
    contactSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}; */

const checkAuthStatus = () => {
  isLoggedIn.value = authService.isAuthenticated();
  if (isLoggedIn.value) {
    const currentUser = authService.getCurrentUser();
    username.value = currentUser?.name || '';
  } else {
    username.value = '';
  }
};

const logout = () => {
  authService.logout();
  isLoggedIn.value = false;
  username.value = '';
  // Usar replace para no dejar historial que permita volver a la página autenticada
  router.replace({ name: 'home' });
};

const handleMobileLogout = () => {
  closeMobileMenu();
  logout();
};

onMounted(() => {
  checkAuthStatus();
});

const route = useRoute();
watch(route, () => {
  checkAuthStatus();
});
</script>

<style scoped>
.navbar {
  background: linear-gradient(to right, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.96));
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 85px;
  padding: 20px 50px 10px 50px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(18px);
  border-bottom: 2px solid rgba(220, 38, 38, 0.6);
}

/* Logo y marca */
.brand-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-logo-image img {
  width: 140px;
  height: 75px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow:
    0 12px 32px rgba(15, 23, 42, 0.9),
    0 0 40px rgba(59, 130, 246, 0.7);
  border: 3px solid rgba(191, 219, 254, 0.9);
}

/* Logo creativo */
.creative-logo {
  position: relative;
  width: 50px;
  height: 50px;
}

.logo-circle {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #a10000 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5),
              0 0 30px rgba(220, 38, 38, 0.3),
              inset 0 2px 8px rgba(255, 255, 255, 0.2);
  animation: logoFloat 4s ease-in-out infinite;
  transition: all 0.3s ease;
}

.logo-circle::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #a10000 100%);
  border-radius: 50%;
  z-index: 0;
}

.logo-circle::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(161, 0, 0, 0.9) 100%);
  border-radius: 50%;
  z-index: 1;
}

.logo-letter {
  position: relative;
  z-index: 2;
  font-weight: 900;
  font-size: 14px;
  color: var(--white);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5),
               0 0 20px rgba(255, 255, 255, 0.3);
  letter-spacing: -1px;
}

.logo-letter:first-child::after {
  content: '•';
  margin: 0 1px;
  font-size: 8px;
  opacity: 0.6;
}

.logo-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.creative-logo:hover .logo-circle {
  transform: scale(1.08);
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.6),
              0 0 40px rgba(220, 38, 38, 0.4),
              inset 0 2px 12px rgba(255, 255, 255, 0.3);
}

.creative-logo:hover .logo-glow {
  opacity: 1;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(2deg); }
}



.brand-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.brand-title {
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
  margin: 0;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.brand-title .highlight {
  background: linear-gradient(135deg, var(--white) 0%, var(--primary-red) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  filter: drop-shadow(0 2px 8px rgba(220, 38, 38, 0.3));
}

.brand-tagline {
  font-size: 11px;
  color: rgba(226, 232, 240, 0.8);
  font-weight: 500;
  letter-spacing: 0.4px;
}

.brand-subtitle {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  line-height: 1;
  margin: 0;
}

/* Navegación principal */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-left: auto;
  margin-right: 30px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  padding: 10px 18px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  letter-spacing: 0.3px;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  transform: none;
  width: 0;
  height: 2px;
  background: #ffffff;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--white);
  background-color: rgba(220, 38, 38, 0.1);
  transform: translateY(-2px);
}

.nav-link:hover::after {
  width: 70%;
}

/* El estado activo visual se mantiene limpio; solo el hover muestra la línea */

.share-btn {
  background: linear-gradient(135deg, #22d3ee 0%, #0891b2 100%);
  color: #ffffff !important;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(34, 211, 238, 0.3);
}

.share-btn:hover {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  box-shadow: 0 4px 15px rgba(34, 211, 238, 0.5);
  transform: translateY(-2px);
}

/* Controles de usuario */
.nav-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.access-btn {
  background: #ffffff;
  color: var(--primary-red);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.35);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.access-btn:hover {
  background: #e5e7eb;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.45);
  transform: translateY(-3px);
}

.logout-btn {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.logout-btn:hover {
  background: rgba(248, 113, 113, 0.2);
  border-color: rgba(248, 113, 113, 0.5);
  transform: translateY(-1px);
}

.admin-btn {
  background: linear-gradient(135deg, var(--black) 0%, #1a1a1a 100%);
  color: var(--primary-red);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(220, 38, 38, 0.3);
  font-weight: 700;
}

.admin-btn:hover {
  background: linear-gradient(135deg, #1a1a1a 0%, var(--black) 100%);
  box-shadow: 0 6px 24px rgba(220, 38, 38, 0.4);
  transform: translateY(-3px);
  border-color: var(--primary-red);
}

.purchases-btn {
  background: var(--brand-accent-gradient);
  color: #ffffff;
  box-shadow: 0 2px 10px var(--brand-accent-glow);
}

.purchases-btn:hover {
  background: var(--brand-accent-gradient);
  filter: brightness(1.1);
  box-shadow: 0 4px 15px var(--brand-accent-glow);
  transform: translateY(-2px);
}

.user-greeting {
  color: var(--white);
  font-weight: 700;
  font-size: 14px;
  padding: 10px 16px;
  background: rgba(220, 38, 38, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(220, 38, 38, 0.3);
  letter-spacing: 0.3px;
}

/* Menu hamburguesa */
.hamburger-menu {
  display: none;
  flex-direction: column;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  justify-content: space-around;
  align-items: center;
  z-index: 1001;
}

.hamburger-menu span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: var(--brand-primary-contrast);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger-menu.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Menu mobile */
.mobile-menu {
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: var(--brand-gradient);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
  overflow-y: auto;
}

.mobile-menu.active {
  transform: translateX(0);
}

.mobile-menu-content {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-link {
  color: #e2e8f0;
  text-decoration: none;
  padding: 15px 20px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: translateY(-2px);
}

.mobile-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-btn {
  padding: 15px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  width: 100%;
  font-family: inherit;
}

.mobile-btn.access-btn {
  background: #ffffff;
  color: var(--primary-red);
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.35);
}

.mobile-btn.logout-btn {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.mobile-btn.admin-btn {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
}

.mobile-btn.purchases-btn {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.3);
}

.mobile-user-greeting {
  color: #e2e8f0;
  text-align: center;
  padding: 15px 20px;
  font-weight: 600;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* Barra de pestañas del panel de taller (desktop) */
.admin-tabs-bar {
  position: fixed;
  top: 95px;
  left: 0;
  width: 100%;
  z-index: 950;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 8px 16px;
  background: linear-gradient(to right, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.96));
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.8);
}

.admin-tab-link {
  color: #e5e7eb;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: radial-gradient(circle at top left, rgba(30, 64, 175, 0.4), rgba(15, 23, 42, 1));
  transition: all 0.2s ease;
}

.admin-tab-link:hover {
  border-color: #60a5fa;
  color: #f9fafb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    height: 70px;
    padding: 0 20px;
  }

  .desktop-nav {
    display: none;
  }

  .hamburger-menu {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }

  .admin-tabs-bar {
    display: none;
  }

  .brand-title {
    font-size: 18px;
  }

  .brand-logo {
    width: 42px;
    height: 42px;
  }

  .brand-subtitle {
    font-size: 11px;
  }

  .logo-circle {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 15px;
  }

  .brand-container {
    gap: 10px;
  }

  .brand-title {
    font-size: 16px;
  }

  .brand-logo-image img
  {
    width: 100px;
    height: 59px;
  }

  .brand-logo {
    width: 38px;
    height: 38px;
  }

  .logo-circle {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}

/* Quitar subrayado del link principal */
.link-navbar {
  text-decoration: none !important;
}

.link-navbar:hover {
  text-decoration: none !important;
}
</style>
