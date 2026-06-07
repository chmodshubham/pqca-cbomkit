<template>
  <div class="notifications-stack">
    <transition-group name="toast" tag="div">
      <div
        v-for="(error, rowIndex) in model.errors"
        :key="rowIndex"
        class="toast"
        :class="'toast--' + errorComponents(error).kind"
      >
        <span class="toast__icon" aria-hidden="true">
          <svg v-if="errorComponents(error).kind === 'error'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>
          <svg v-else-if="errorComponents(error).kind === 'warning'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
          <svg v-else viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>
        </span>
        <div class="toast__body">
          <p class="toast__title">{{ errorComponents(error).title }}</p>
          <p class="toast__desc">{{ errorComponents(error).description }}</p>
        </div>
        <button class="toast__close" aria-label="Close" @click="model.closeError(rowIndex)">
          <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { model, ErrorStatus } from "@/model.js";

export default {
  name: "NotificationsView",
  data() {
    return { model };
  },
  methods: {
    errorComponents(error) {
      let kind = "error", title = "Unknown error", description = "An unknown error has occured.";
      if (error.status === ErrorStatus.NoConnection) {
        kind = "error"; title = "No connection";
        description = "Connection to the server has failed. Please try again later.";
      } else if (error.status === ErrorStatus.InvalidRepo) {
        kind = "error"; title = "Invalid repository";
        description = "The provided address does not lead to a readable repository.";
      } else if (error.status === ErrorStatus.JsonParsing) {
        kind = "error"; title = "Parsing error";
        description = "An incorrect JSON file cannot be parsed.";
      } else if (error.status === ErrorStatus.ScanError) {
        kind = "error"; title = "Error while scanning";
        description = error.message;
      } else if (error.status === ErrorStatus.InvalidCbom) {
        kind = "error"; title = "Invalid CBOM";
        description = "The provided CBOM does not respect the expected format.";
      } else if (error.status === ErrorStatus.IgnoredComponent) {
        kind = "info"; title = "Some components are not shown";
        description = "The provided CBOM contains one or several components that are not cryptographic assets. They are not displayed here.";
      } else if (error.status === ErrorStatus.MultiUpload) {
        kind = "error"; title = "Multiple upload";
        description = "Please only upload a single CBOM file.";
      } else if (error.status === ErrorStatus.EmptyDatabase) {
        kind = "warning"; title = "Empty database";
        description = "Connection to the server was successful, but the CBOM database is empty.";
      } else if (error.status === ErrorStatus.FallBackLocalComplianceReport) {
        kind = "warning"; title = "Limited compliance results";
        description = "An error occured with the remote compliance service, we fall back on a local compliance report instead, which may be less detailed.";
      } else if (error.status === ErrorStatus.ScanWarning) {
        kind = "warning"; title = "Warning while scanning";
        description = error.message;
      }
      return { kind, title, description };
    },
  },
};
</script>

<style scoped>
.notifications-stack {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 22rem;
  width: 100%;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid transparent;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.10);
  background: #1c1c1c;
  color: #f0f0f0;
}

.toast--error   { border-left-color: #fa4d56; }
.toast--warning { border-left-color: #f1c21b; }
.toast--info    { border-left-color: #4589ff; }

.toast__icon {
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.125rem;
}
.toast--error   .toast__icon { color: #fa4d56; }
.toast--warning .toast__icon { color: #f1c21b; }
.toast--info    .toast__icon { color: #4589ff; }

.toast__icon svg {
  width: 100%;
  height: 100%;
}

.toast__body {
  flex: 1;
  min-width: 0;
}

.toast__title {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 0.2rem;
  color: #f0f0f0;
}

.toast__desc {
  font-size: 0.8rem;
  line-height: 1.5;
  margin: 0;
  color: #a8a8a8;
}

.toast__close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #6f6f6f;
  width: 1rem;
  height: 1rem;
  margin-top: 0.125rem;
  transition: color 0.15s;
}
.toast__close:hover { color: #f0f0f0; }
.toast__close svg { width: 100%; height: 100%; }

/* transition */
.toast-enter-active { transition: all 0.2s ease; }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from  { opacity: 0; transform: translateY(0.5rem); }
.toast-leave-to    { opacity: 0; transform: translateX(1rem); }
</style>
