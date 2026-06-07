<template>
  <cv-header aria-label="PQStation CBOMkit">
    <cv-header-name href="https://www.pqstation.com" prefix="" target="_blank">
      <span class="header-brand">
        <img src="/pqstation-icon.png" alt="PQStation" class="header-logo-icon" />
        <span class="header-logo-text">CBOMkit</span>
      </span>
    </cv-header-name>
  </cv-header>
</template>

<script>
import { model } from "@/model.js";

export default {
  name: "HeaderBar",
  data() {
    return { model };
  },
};
</script>

<style scoped>
.header-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-display);
}

.header-logo-icon {
  height: 24px;
  width: 24px;
  object-fit: contain;
  border-radius: 5px;
}

.header-logo-text {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 15px;
  color: #ffffff;
  letter-spacing: -0.3px;
}
</style>
