<template>
  <div class="page">
    <div class="card">
      <div class="card__body">
        <SearchBar />
      </div>
    </div>

  </div>
</template>

<script>
import { model } from "@/model.js";
import SearchBar from "@/components/home/SearchBar.vue";

export default {
  name: "SearchOrUploadView",
  components: { SearchBar },
  data() {
    return { model };
  },
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  background: var(--c-surface);
  border-radius: var(--radius-card);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-card);
  overflow: visible;
}

.card__head {
  padding: 20px 22px 0;
}

.card__body {
  padding: 14px 22px 20px;
}

.card__title {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--c-ink);
  margin: 0 0 5px 0;
  letter-spacing: -0.3px;
}

.card__desc {
  font-family: var(--font-body);
  font-size: 12.5px;
  color: var(--c-ink-tertiary);
  margin: 0;
  line-height: 1.6;
}

.notice {
  display: flex;
  align-items: stretch;
  gap: 12px;
  background: var(--c-surface-secondary);
  border-radius: 10px;
  padding: 12px 16px;
}

.notice__bar {
  width: 3px;
  border-radius: 2px;
  background: rgba(217,119,6,0.6);
  flex-shrink: 0;
}

.notice__text {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  color: var(--c-ink-secondary);
  line-height: 1.6;
  margin: 0;
}

.notice__label {
  font-weight: 600;
  color: var(--c-ink);
  margin-right: 4px;
}
</style>
