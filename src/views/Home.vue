<template>
  <main class="home-main">
    <MainBanner />
    <ServicesPage />

    <section class="home-contact">
      <ContactSection />
    </section>

    <section class="home-footer">
      <Footer_ />
    </section>
  </main>
</template>

<script setup lang="ts">
import ContactSection from '@/components/ContactSection.vue'
import Footer_ from '@/components/Footer_.vue'
import MainBanner from '@/components/MainBanner.vue'
import ServicesPage from '@/components/ServicesPage.vue'



defineOptions({
  name: 'HomeView',
})
</script>

<style scoped>
.home-main {
  padding-top: 80px;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  overflow-x: hidden;
  color: #f9fafb;
}

.home-contact {
  border-top: 1px solid rgba(15, 23, 42, 0.9);
}

.home-footer {
  border-top: 1px solid rgba(15, 23, 42, 0.9);
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    padding-top: 2.5rem;
  }

  .hero-logo {
    order: -1;
  }
}

@media (max-width: 640px) {
  .home-main {
    padding-top: 72px;
  }

  .hero {
    padding-inline: 1.25rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .services-inner {
    padding: 2rem 1.5rem 2.25rem;
  }
}
</style>
