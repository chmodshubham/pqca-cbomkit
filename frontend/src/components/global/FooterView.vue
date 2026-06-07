<template>
  <div class="pqs-footer-wrapper">
    <footer class="pqs-footer">
      <div class="pqs-footer__inner">
        <div class="pqs-footer__grid">
          <!-- Brand column -->
          <div class="pqs-footer__brand">
            <a href="https://www.pqstation.com" target="_blank" class="pqs-footer__logo-link">
              <img src="/pqstation-icon.png" alt="PQStation icon" class="pqs-footer__logo-img" />
              <span class="pqs-footer__logo-text">PQStation</span>
            </a>
            <p class="pqs-footer__tagline">
              Building the foundation for a <strong>quantum-safe future</strong>
              through visibility, remediation, and resilience.
            </p>
            <div class="pqs-footer__socials">
              <a href="https://www.linkedin.com/company/pqstation/" target="_blank" rel="noopener noreferrer" class="pqs-footer__social-link" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://x.com/pqstation_sg" target="_blank" rel="noopener noreferrer" class="pqs-footer__social-link" aria-label="X (Twitter)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.25 2.25h6.773l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="pqs-footer__col">
            <h4 class="pqs-footer__col-heading">Quick Links</h4>
            <ul class="pqs-footer__links">
              <li><a href="https://www.pqstation.com/" target="_blank" rel="noopener noreferrer">Home</a></li>
              <li><a href="https://www.pqstation.com/about" target="_blank" rel="noopener noreferrer">About</a></li>
              <li><a href="https://www.pqstation.com/#why1" target="_blank" rel="noopener noreferrer">Why</a></li>
              <li><a href="https://www.pqstation.com/#work-process-1" target="_blank" rel="noopener noreferrer">Process</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="pqs-footer__col">
            <h4 class="pqs-footer__col-heading">Support</h4>
            <ul class="pqs-footer__links">
              <li><a href="https://www.pqstation.com/contact" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
            </ul>
          </div>

          <!-- Resources -->
          <div class="pqs-footer__col">
            <h4 class="pqs-footer__col-heading">Resources</h4>
            <ul class="pqs-footer__links">
              <li><a href="https://www.pqstation.com/news" target="_blank" rel="noopener noreferrer">News</a></li>
              <li><a href="https://www.pqstation.com/blogs" target="_blank" rel="noopener noreferrer">Blog</a></li>
            </ul>
          </div>
        </div>

        <div class="pqs-footer__bottom">
          <p>© 2025 PQStation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "FooterView",
};
</script>

<style scoped>
.pqs-footer-wrapper {
  padding: 0 8px 8px;
  background: var(--c-bg, #f2f2f7);
}

.pqs-footer {
  background-color: #111113;
  color: #ffffff;
  border-radius: 16px;
  font-family: var(--font-body);
  overflow: hidden;
}

.pqs-footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 48px 0;
}

.pqs-footer__grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 0;
}

/* Brand */
.pqs-footer__logo-link {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  margin-bottom: 18px;
}

.pqs-footer__logo-img {
  height: 28px;
  width: 28px;
  object-fit: contain;
  border-radius: 6px;
}

.pqs-footer__logo-text {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.2px;
}

.pqs-footer__tagline {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.7;
  margin: 0 0 22px 0;
  max-width: 280px;
}

.pqs-footer__tagline strong {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.pqs-footer__socials {
  display: flex;
  gap: 8px;
}

.pqs-footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  text-decoration: none;
  transition: color 0.18s, background 0.18s;
}

.pqs-footer__social-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

/* Nav cols */
.pqs-footer__col-heading {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 16px 0;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.pqs-footer__links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pqs-footer__links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 400;
  transition: color 0.18s;
}

.pqs-footer__links a:hover {
  color: #ffffff;
}

/* Bottom bar */
.pqs-footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 18px 0;
}

.pqs-footer__bottom p {
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  margin: 0;
  text-align: center;
  letter-spacing: 0.1px;
}

@media (max-width: 900px) {
  .pqs-footer__grid {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }
  .pqs-footer__brand {
    grid-column: 1 / -1;
  }
  .pqs-footer__inner {
    padding: 40px 32px 0;
  }
}

@media (max-width: 540px) {
  .pqs-footer__grid {
    grid-template-columns: 1fr;
  }
  .pqs-footer__inner {
    padding: 32px 24px 0;
  }
}
</style>
