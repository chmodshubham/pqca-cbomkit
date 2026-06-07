<template>
  <div class="deps-root">
    <template v-for="group in visibleGroups" :key="group.label">
      <div class="deps-group-divider">
        <span class="deps-group-pill" :style="{ '--accent': group.color }">
          <component :is="group.icon" class="deps-group-icon" :style="{ fill: group.color }" />
          {{ group.label }}
        </span>
      </div>

      <div
        v-for="([asset, path], index) in group.items"
        :key="index"
        class="dep-card"
        :style="{ '--accent': group.color }"
        @click="$emit('open-asset', asset)"
      >
        <div class="dep-accent-bar" />
        <div class="dep-body">
          <div class="dep-primary">
            <span class="dep-name">{{ getName(asset).toUpperCase() }}</span>
            <span v-if="getAssetType(asset)" class="dep-type-sep">·</span>
            <span v-if="getAssetType(asset)" class="dep-type">{{ getAssetType(asset) }}</span>
          </div>
          <div class="dep-secondary" v-if="getBomRef(asset)">
            <span class="dep-ref-label">BOM ref</span>
            <code class="dep-ref-code">{{ getBomRef(asset) }}</code>
          </div>
        </div>
        <button class="dep-action-btn" @click.stop="$emit('open-asset', asset)" title="See details">
          <component :is="Launch16" />
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { getDependencies, getTermFullName } from "@/helpers.js";
import { Launch16, Downstream24, Upstream24 } from "@carbon/icons-vue";

export default {
  name: "DependenciesView",
  props: { bomRef: null },
  data() {
    return { Launch16 };
  },
  components: { Downstream24, Upstream24, Launch16 },
  computed: {
    allGroups() {
      const d = getDependencies(this.bomRef);
      return [
        { label: "Depends on",     items: d["dependsComponentList"],      icon: "Downstream24", color: "#05BE8D" },
        { label: "Provides to",    items: d["providesComponentList"],     icon: "Upstream24",   color: "#188A99" },
        { label: "Is used by",     items: d["isDependedOnComponentList"], icon: "Upstream24",   color: "#FFBA1A" },
        { label: "Is provided by", items: d["isProvidedByComponentList"], icon: "Downstream24", color: "#FF488E" },
      ];
    },
    visibleGroups() {
      return this.allGroups.filter(g => g.items && g.items.length > 0);
    },
  },
  methods: {
    getName(a) { return (a && a.name) ? a.name : ""; },
    getAssetType(a) {
      return (a?.cryptoProperties?.assetType) ? getTermFullName(a.cryptoProperties.assetType) : "";
    },
    getBomRef(a) {
      return (a && Object.hasOwn(a, "bom-ref")) ? a["bom-ref"] : "";
    },
  },
};
</script>

<style scoped>
.deps-root {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Group divider with inline pill label */
.deps-group-divider {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 10px 0 4px;
}

.deps-group-divider:first-child {
  margin-top: 0;
}

.deps-group-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 20px;
  padding: 2px 10px 2px 7px;
  white-space: nowrap;
}

.deps-group-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

/* Dependency card row */
.dep-card {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--cds-layer-01, #ffffff);
  border: 1px solid var(--cds-border-subtle-01, #e0e0e0);
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.dep-card:hover {
  border-color: color-mix(in srgb, var(--accent) 60%, transparent);
  box-shadow: 0 1px 6px color-mix(in srgb, var(--accent) 12%, transparent);
}

.dep-accent-bar {
  width: 3px;
  align-self: stretch;
  background: var(--accent);
  flex-shrink: 0;
}

.dep-body {
  flex: 1;
  min-width: 0;
  padding: 9px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dep-primary {
  display: flex;
  align-items: baseline;
  gap: 5px;
  min-width: 0;
}

.dep-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cds-text-primary, #161616);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dep-type-sep {
  font-size: 0.75rem;
  color: var(--cds-text-disabled, #c6c6c6);
  flex-shrink: 0;
}

.dep-type {
  font-size: 0.8125rem;
  color: var(--cds-text-secondary, #525252);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dep-secondary {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dep-ref-label {
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--cds-text-secondary, #525252);
  flex-shrink: 0;
}

.dep-ref-code {
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  color: var(--cds-text-secondary, #525252);
  background: var(--cds-layer-02, #f4f4f4);
  border: 1px solid var(--cds-border-subtle-01, #e0e0e0);
  border-radius: 3px;
  padding: 1px 5px;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
}

/* Action button */
.dep-action-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 4px;
  color: var(--cds-link-primary, #0f62fe);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.15s, background 0.15s;
}

.dep-card:hover .dep-action-btn {
  opacity: 1;
  background: var(--cds-layer-hover-01, #e8e8e8);
}
</style>
