<template>
  <main class="services-main">
    <MainBanner />

    <section class="services-wrapper">
      <ServicesPage />
    </section>

    <section class="services-contact">
      <ContactSection />
    </section>

    <section class="services-footer">
      <Footer_ />
    </section>
  </main>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import MainBanner from '@/components/MainBanner.vue'
import ServicesPage from '@/components/ServicesPage.vue'
import ContactSection from '@/components/ContactSection.vue'
import Footer_ from '@/components/Footer_.vue'

defineOptions({
  name: 'ServicesView',
})
</script>

<style scoped>
.services-main {
  padding-top: 80px;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  overflow-x: hidden;
  color: #f9fafb;
  background:
    radial-gradient(circle at top left, rgba(65, 65, 70, 0.5), transparent 60%),
    radial-gradient(circle at bottom right, rgba(170, 174, 182, 0.5), #020617);
}

.services-wrapper {
  /* Mantiene la misma separación que en Home */
}

.services-contact {
  border-top: 1px solid rgba(15, 23, 42, 0.9);
}

.services-footer {
  border-top: 1px solid rgba(15, 23, 42, 0.9);
}

@media (max-width: 640px) {
  .services-main {
    padding-top: 72px;
  }
}
</style>
