<template>
  <footer class="modern-footer">
    <div class="footer-content">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Marca Job's Car -->
          <div class="brand-section">
            <div class="footer-logo-image">
              <img src="/images/logo.jpg" alt="Job's Car" />
            </div>
            <p class="footer-brand-name">Job's Car Taller Automotriz</p>
            <p class="footer-description">
              Taller mecánico en Bogotá especializado en diagnóstico, mantenimiento y reparación de
              vehículos particulares y de trabajo.
            </p>
          </div>

          <!-- Servicios -->
          <div class="footer-column">
            <h3 class="column-title">Servicios</h3>
            <ul class="footer-links">
              <li>Diagnóstico computarizado</li>
              <li>Mantenimiento preventivo y correctivo</li>
              <li>Sistema de frenos y suspensión</li>
              <li>Alineación, balanceo y llantas</li>
            </ul>
          </div>

          <!-- Enlaces rápidos -->
          <div class="footer-column">
            <h3 class="column-title">Enlaces rápidos</h3>
            <ul class="footer-links">
              <li><a href="#top">Inicio</a></li>
              <li><a href="#services">Servicios</a></li>
              <li><a href="#contacto">Contacto</a></li>
              <li><a href="https://wa.me/573144607515" target="_blank" rel="noopener">WhatsApp</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-container bottom-inner">
        <p class="copyright">
          &copy; 2025 Job's Car. Todos los derechos reservados. Creado por DataOr.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Footer moderno con grid de 4 columnas */
.modern-footer {
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.35), transparent 55%),
    radial-gradient(circle at bottom right, rgba(37, 99, 235, 0.3), #020617);
  color: var(--white);
  padding: 1.5rem 0 0 0;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(148, 163, 184, 0.4);
}

.modern-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(148, 163, 184, 0.4);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Grid de 4 columnas */
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr;
  gap: 2rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
}

/* Sección de marca/branding */
.brand-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo-image img {
  width: 120px;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.8);
  border: 2px solid rgba(148, 163, 184, 0.7);
}

/* Logo creativo del footer */
.creative-logo-footer {
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 1rem;
}

.logo-circle-footer {
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #a10000 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 12px 32px rgba(220, 38, 38, 0.5),
              0 0 60px rgba(220, 38, 38, 0.3),
              inset 0 4px 16px rgba(255, 255, 255, 0.2);
  animation: logoFloatFooter 4s ease-in-out infinite;
  transition: all 0.3s ease;
}

.logo-circle-footer::before {
  content: '';
  position: absolute;
  inset: -6px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #a10000 100%);
  border-radius: 50%;
  z-index: 0;
}

.logo-circle-footer::after {
  content: '';
  position: absolute;
  inset: 6px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(161, 0, 0, 0.9) 100%);
  border-radius: 50%;
  z-index: 1;
}

.logo-letter-footer {
  position: relative;
  z-index: 2;
  font-weight: 900;
  font-size: 36px;
  color: var(--white);
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5),
               0 0 30px rgba(255, 255, 255, 0.3);
  letter-spacing: -2px;
}

.logo-letter-footer:first-child::after {
  content: '•';
  margin: 0 4px;
  font-size: 20px;
  opacity: 0.6;
}

.logo-glow-footer {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.creative-logo-footer:hover .logo-circle-footer {
  transform: scale(1.05);
  box-shadow: 0 16px 40px rgba(220, 38, 38, 0.6),
              0 0 80px rgba(220, 38, 38, 0.4),
              inset 0 4px 20px rgba(255, 255, 255, 0.3);
}

.creative-logo-footer:hover .logo-glow-footer {
  opacity: 1;
}

@keyframes logoFloatFooter {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(2deg); }
}

.footer-brand-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e5e7eb;
  margin: 1rem 0 0.25rem;
}

.footer-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  max-width: 90%;
}

/* Columnas de enlaces */
.footer-column {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.column-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--white);
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 0.8rem;
}

.column-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #38bdf8 0%, transparent 100%);
  border-radius: 2px;
}

/* Enlaces de categorías */
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  list-style: none;
  padding: 0;
  margin: 0;
  color: rgba(226, 240, 232, 0.8);
}

.footer-links li {
  padding: 0;
}

.footer-links a {
  color: rgba(226, 240, 232, 0.8);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0;
}

.footer-links a:hover {
  color: #38bdf8;
}

/* Lista de contacto */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.8rem;
  background: rgba(220, 38, 38, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(220, 38, 38, 0.15);
  transition: all 0.3s ease;
}

.contact-item:hover {
  background: rgba(220, 38, 38, 0.12);
  border-color: var(--primary-red);
  transform: translateX(5px);
}

.contact-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #a10000 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.contact-icon svg {
  width: 18px;
  height: 18px;
  color: var(--white);
}

.contact-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.contact-label {
  font-size: 0.75rem;
  color: var(--primary-red);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-value {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
}

/* Grid de redes sociales */
.social-links-footer {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
}

.social-link-footer {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.social-link-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
  transition: left 0.5s ease;
}

.social-link-footer:hover::before {
  left: 100%;
}

.social-link-footer:hover {
  background: rgba(220, 38, 38, 0.15);
  border-color: var(--primary-red);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.35);
}

.social-icon-footer {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #a10000 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  transition: transform 0.3s ease;
}

.social-link-footer:hover .social-icon-footer {
  transform: scale(1.1) rotate(5deg);
}

.social-icon-footer svg {
  width: 20px;
  height: 20px;
  color: var(--white);
}

.social-info-footer {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.social-name-footer {
  font-size: 0.75rem;
  color: var(--primary-red);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.social-handle-footer {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
}

/* Barra inferior */
.footer-bottom {
  background: transparent;
  padding: 1.2rem 0 1.8rem;

}

.copyright {
  color: rgba(148, 163, 184, 0.9);
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
}

.made-with {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
}



/* Responsive Design */
@media (max-width: 1200px) {
  .footer-grid {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 3rem;
  }
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem 2rem;
  }

  .brand-section {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .modern-footer {
    padding: 3rem 0 0 0;
  }

  .footer-content {
    padding: 0 1.5rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding-bottom: 2rem;
  }

  .brand-section {
    align-items: center;
    text-align: center;
  }

  .footer-logo {
    width: 110px;
    height: 110px;
    font-size: 2.2rem;
  }

  .footer-brand-title {
    font-size: 2rem;
  }

  .footer-description {
    max-width: 100%;
    text-align: center;
  }

  .footer-column {
    text-align: center;
  }

  .column-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-links a {
    justify-content: center;
  }

  .contact-list {
    align-items: center;
  }

  .contact-item {
    max-width: 300px;
  }

  .social-links-footer {
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .modern-footer {
    padding: 2rem 0 0 0;
  }

  .footer-content {
    padding: 0 1rem;
  }

  .footer-grid {
    gap: 2rem;
  }

  .footer-logo {
    width: 90px;
    height: 90px;
    font-size: 1.8rem;
  }

  .footer-brand-title {
    font-size: 1.6rem;
    letter-spacing: 1px;
  }

  .footer-tagline {
    font-size: 0.95rem;
  }

  .footer-description {
    font-size: 0.9rem;
  }

  .column-title {
    font-size: 1.1rem;
  }

  .footer-links a {
    font-size: 0.9rem;
  }

  .contact-icon {
    width: 32px;
    height: 32px;
  }

  .contact-icon svg {
    width: 16px;
    height: 16px;
  }

  .contact-label {
    font-size: 0.7rem;
  }

  .contact-value {
    font-size: 0.85rem;
  }

  .social-icon-footer {
    width: 38px;
    height: 38px;
  }

  .social-icon-footer svg {
    width: 18px;
    height: 18px;
  }

  .social-name-footer {
    font-size: 0.7rem;
  }

  .social-handle-footer {
    font-size: 0.9rem;
  }

  .footer-bottom {
    padding: 1rem 0;
  }

  .copyright,
  .made-with {
    font-size: 0.8rem;
  }
}
</style>
