<template>
  <div class="table-wrapper">
    <!-- Sliding drawer overlay -->
    <transition name="drawer-overlay">
      <div
        v-if="drawerOpen"
        class="drawer-overlay"
        @click="closeDrawer"
      />
    </transition>

    <!-- Sliding drawer panel -->
    <transition name="drawer-slide">
      <div
        v-if="drawerOpen"
        class="drawer-panel"
        role="dialog"
        aria-modal="true"
      >
        <div class="drawer-header">
          <div class="drawer-header-text">
            <div class="drawer-label">
              {{ assetType ? displayTerm(assetType) : 'Asset' }}
            </div>
            <h4 class="drawer-title">{{ assetName.toUpperCase() }}</h4>
          </div>
          <cv-icon-button
            kind="ghost"
            :icon="Close24"
            @click="closeDrawer"
            label="Close"
            tip-alignment="end"
            tip-position="bottom"
            class="drawer-close"
          />
        </div>
        <div class="drawer-body">
          <CryptoAssetDetails
            v-if="currentAssetDrawer"
            :asset="currentAssetDrawer"
            @open-code="openInCode"
            @open-asset="openAsset"
          />
        </div>
      </div>
    </transition>

    <cv-data-table-skeleton
      v-if="detections.length === 0 && model.scanning.isScanning"
      :columns="columns"
      :rows="5"
    >
      <template #actions>
        <cv-button :icon="downloadIcon" :disabled="true">Download CBOM</cv-button>
      </template>
    </cv-data-table-skeleton>

    <cv-data-table
      v-else
      batch-cancel-label="Cancel"
      :columns="columns"
      :sortable="true"
      @sort="onSort"
      :pagination="pagination"
      @pagination="actionOnPagination"
    >
      <template #actions>
        <h5 style="margin-left: 16px; display: flex; align-items: center;" :style="isViewerOnly ? 'margin-right: auto' : ''">
          List of all assets
        </h5>
        <div v-if="!isViewerOnly" style="display: flex; align-items: center; margin-right: auto;">
          <span
            v-if="model.scanning.isScanning"
            style="font-size: small; margin-right: auto; margin-left: 26px; color: #525252;"
          >Scan in progress...</span>
        </div>
        <cv-button
          v-if="!isViewerOnly"
          @click="downloadCBOM"
          :disabled="model.scanning.isScanning"
          :icon="downloadIcon"
        >
          Download CBOM
        </cv-button>
      </template>

      <template #headings>
        <cv-data-table-heading name="4" sortable heading="Compliance" />
        <cv-data-table-heading name="0" sortable heading="Cryptographic asset" />
        <cv-data-table-heading name="1" sortable>
          <div class="col-header" v-click-outside="() => typeDropOpen = false">
            <span>Type</span>
            <div class="filter-combo" @click.stop>
              <button class="filter-combo__btn" :class="{'filter-combo__btn--active': filterType}" @click.stop="openDrop('type', $event)">
                <span class="filter-combo__val">{{ filterType ? (typeOptions.find(o=>o.value===filterType)||{}).label||filterType : 'All' }}</span>
                <svg class="filter-combo__chevron" :class="{'filter-combo__chevron--open': typeDropOpen}" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <ul v-if="typeDropOpen" class="filter-combo__list" :style="dropStyle" @click.stop>
                <li class="filter-combo__item" :class="{'filter-combo__item--active': filterType === ''}" @mousedown.prevent="filterType = ''; typeDropOpen = false">All</li>
                <li v-for="opt in typeOptions" :key="opt.value" class="filter-combo__item" :class="{'filter-combo__item--active': filterType === opt.value}" @mousedown.prevent="filterType = opt.value; typeDropOpen = false">{{ opt.label }}</li>
              </ul>
            </div>
          </div>
        </cv-data-table-heading>
        <cv-data-table-heading name="2" sortable>
          <div class="col-header" v-click-outside="() => primDropOpen = false">
            <span>Primitive</span>
            <div class="filter-combo" @click.stop>
              <button class="filter-combo__btn" :class="{'filter-combo__btn--active': filterPrimitive}" @click.stop="openDrop('prim', $event)">
                <span class="filter-combo__val">{{ filterPrimitive ? (primitiveOptions.find(o=>o.value===filterPrimitive)||{}).label||filterPrimitive : 'All' }}</span>
                <svg class="filter-combo__chevron" :class="{'filter-combo__chevron--open': primDropOpen}" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <ul v-if="primDropOpen" class="filter-combo__list" :style="dropStyle" @click.stop>
                <li class="filter-combo__item" :class="{'filter-combo__item--active': filterPrimitive === ''}" @mousedown.prevent="filterPrimitive = ''; primDropOpen = false">All</li>
                <li v-for="opt in primitiveOptions" :key="opt.value" class="filter-combo__item" :class="{'filter-combo__item--active': filterPrimitive === opt.value}" @mousedown.prevent="filterPrimitive = opt.value; primDropOpen = false">{{ opt.label }}</li>
              </ul>
            </div>
          </div>
        </cv-data-table-heading>
        <cv-data-table-heading name="3" sortable heading="Location" />
      </template>

      <template #data>
        <cv-data-table-row
          v-for="(asset, rowIndex) in paginatedDetections"
          :key="rowIndex"
          :value="`${rowIndex}`"
          class="table-row"
          :class="{ 'table-row--active': currentAssetDrawer === asset }"
          @click="showDetectionDetailsFor({ index: rowIndex })"
          style="cursor: pointer;"
        >
          <!-- Compliance -->
          <cv-data-table-cell>
            <div class="compliance-cell">
              <cv-inline-loading
                v-if="isLoadingCompliance"
                state="loading"
                loadingText=""
              />
              <cv-tooltip
                v-else-if="hasValidComplianceResults"
                alignment="start"
                direction="top"
                :tip="getComplianceDescription(asset)"
              >
                <span class="compliance-badge" :style="complianceBadgeStyle(asset)">
                  <ComplianceIcon :asset="asset" class="compliance-badge-icon" />
                  <span class="compliance-badge-label">{{ complianceBadgeLabel(asset) }}</span>
                </span>
              </cv-tooltip>
              <span v-else class="compliance-badge compliance-badge--na">
                <WatsonHealthImageAvailabilityUnavailable24 class="compliance-badge-icon" />
                <span class="compliance-badge-label">N/A</span>
              </span>
            </div>
          </cv-data-table-cell>

          <!-- Asset name -->
          <cv-data-table-cell>
            <div class="asset-name-cell">
              <span class="asset-name">{{ asset.name.toUpperCase() }}</span>
            </div>
          </cv-data-table-cell>

          <!-- Type -->
          <cv-data-table-cell>
            <div class="tag-cell">
              <span v-if="type(asset)" class="asset-tag asset-tag--type">
                {{ displayTerm(type(asset)) }}
              </span>
              <em v-else class="unspecified-text">Unspecified</em>
            </div>
          </cv-data-table-cell>

          <!-- Primitive -->
          <cv-data-table-cell>
            <div class="tag-cell">
              <span v-if="primitive(asset)" class="asset-tag asset-tag--primitive">
                {{ displayTerm(primitive(asset)) }}
              </span>
              <em v-else class="unspecified-text">Unspecified</em>
            </div>
          </cv-data-table-cell>

          <!-- Location -->
          <cv-data-table-cell style="max-width: 200px; width: 30%;">
            <em v-if="occurrences(asset) == null" class="unspecified-text">No location</em>
            <span v-else class="location-chip" @click.stop="openInCodeFor({ index: rowIndex })">
              <span class="location-chip-text">{{ fileName(occurrences(asset)) }}:{{ lineNumber(occurrences(asset)) }}</span>
            </span>
          </cv-data-table-cell>

        </cv-data-table-row>
      </template>
    </cv-data-table>
  </div>
</template>

<script>
import { model } from "@/model";
import {
  canOpenOnline,
  capitalizeFirstLetter,
  getDetections,
  displayTerm,
  getComplianceLevel,
  getComplianceLabel,
  getComplianceColor,
  openOnline,
  hasValidComplianceResults,
  isViewerOnly,
  isLoadingCompliance,
  getComplianceDescription,
  resolvePath,
} from "@/helpers";

import {
  Close24,
  WatsonHealthImageAvailabilityUnavailable24,
} from "@carbon/icons-vue";
import CryptoAssetDetails from "@/components/results/modal/CryptoAssetDetails.vue";
import ComplianceIcon from "@/components/results/ComplianceIcon.vue";
import { clickOutside } from "@/directives/clickOutside.js";

const DOWNLOAD_ICON_SVG = `<svg fill-rule="evenodd" height="16" name="download" role="img" viewBox="0 0 14 16" width="14" aria-label="Download" alt="Download">
        <title>Download</title>
        <path d="M7.506 11.03l4.137-4.376.727.687-5.363 5.672-5.367-5.67.726-.687 4.14 4.374V0h1v11.03z"></path>
        <path d="M13 15v-2h1v2a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-2h1v2h12z"></path>
        </svg>`;
const UNSPECIFIED = "__unspecified__";

export default {
  name: "DataTable",
  directives: { clickOutside },
  components: {
    CryptoAssetDetails,
    WatsonHealthImageAvailabilityUnavailable24,
    ComplianceIcon,
  },
  data() {
    return {
      model,
      localFinalListOfAssets: [],
      Close24,
      currentAssetDrawer: null,
      drawerOpen: false,
      filterType: "",
      filterPrimitive: "",
      typeDropOpen: false,
      primDropOpen: false,
      dropStyle: {},
      currentPagination: null,
      columns: ["Compliance", "Cryptographic asset", "Type", "Primitive", "Location"],
      downloadIcon: DOWNLOAD_ICON_SVG,
    };
  },
  computed: {
    isViewerOnly,
    isLoadingCompliance,
    hasValidComplianceResults,
    allDetections() {
      if (this.localFinalListOfAssets.length > 0) return this.localFinalListOfAssets;
      return getDetections();
    },
    typeOptions() {
      const seen = new Set();
      const all = getDetections();
      const hasUnspecified = all.some(a => !this.type(a));
      const opts = all
        .map(a => this.type(a)).filter(v => v)
        .filter(v => { if (seen.has(v)) return false; seen.add(v); return true; })
        .sort()
        .map(v => ({ value: v, label: displayTerm(v) }));
      if (hasUnspecified) opts.push({ value: UNSPECIFIED, label: 'Unspecified' });
      return opts;
    },
    primitiveOptions() {
      const seen = new Set();
      const all = getDetections();
      const hasUnspecified = all.some(a => !this.primitive(a));
      const opts = all
        .map(a => this.primitive(a)).filter(v => v)
        .filter(v => { if (seen.has(v)) return false; seen.add(v); return true; })
        .sort()
        .map(v => ({ value: v, label: displayTerm(v) }));
      if (hasUnspecified) opts.push({ value: UNSPECIFIED, label: 'Unspecified' });
      return opts;
    },
    hasActiveFilters() {
      return this.filterType !== "" || this.filterPrimitive !== "";
    },
    detections() {
      return this.allDetections.filter(a => {
        if (this.filterType) {
          const t = this.type(a);
          if (this.filterType === UNSPECIFIED ? t : t !== this.filterType) return false;
        }
        if (this.filterPrimitive) {
          const p = this.primitive(a);
          if (this.filterPrimitive === UNSPECIFIED ? p : p !== this.filterPrimitive) return false;
        }
        return true;
      });
    },
    paginatedDetections() {
      if (!this.currentPagination) return [];
      return this.detections.slice(
        this.currentPagination.start - 1,
        this.currentPagination.start + this.currentPagination.length - 1
      );
    },
    pagination() {
      return {
        numberOfItems: this.detections.length,
        pageSizes: [10, 25, 50, 100],
      };
    },
    assetName() {
      return this.currentAssetDrawer?.name ?? "";
    },
    assetType() {
      return this.currentAssetDrawer?.cryptoProperties?.assetType ?? "";
    },
  },
  watch: {
    filterType() { this.localFinalListOfAssets = []; },
    filterPrimitive() { this.localFinalListOfAssets = []; },
  },
  methods: {
    openDrop(which, event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const listWidth = 190;
      let left = rect.left;
      if (left + listWidth > window.innerWidth - 8) {
        left = rect.right - listWidth;
      }
      this.dropStyle = {
        top: (rect.bottom + 4) + 'px',
        left: left + 'px',
      };
      if (which === 'type') {
        this.typeDropOpen = !this.typeDropOpen;
        this.primDropOpen = false;
      } else {
        this.primDropOpen = !this.primDropOpen;
        this.typeDropOpen = false;
      }
    },
    clearFilters() {
      this.filterType = "";
      this.filterPrimitive = "";
      this.localFinalListOfAssets = [];
    },
    getComplianceLevel,
    getComplianceLabel,
    getComplianceColor,
    getComplianceDescription,
    displayTerm,
    capitalizeFirstLetter,
    resolvePath,
    actionOnPagination(content) {
      this.currentPagination = content;
    },
    downloadCBOM() {
      const data = JSON.stringify(model.cbom, null, 2);
      const el = document.createElement("a");
      el.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(data));
      el.setAttribute("download", "cbom.json");
      el.style.display = "none";
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    },
    showDetectionDetailsFor({ index }) {
      const asset = this.paginatedDetections[index];
      if (this.currentAssetDrawer === asset && this.drawerOpen) {
        this.closeDrawer();
        return;
      }
      this.currentAssetDrawer = asset;
      this.drawerOpen = true;
    },
    closeDrawer() {
      this.drawerOpen = false;
    },
    openInCodeFor({ index }) {
      this.currentAssetDrawer = this.paginatedDetections[index];
      if (!canOpenOnline()) return;
      openOnline(this.currentAssetDrawer);
    },
    openAsset(asset) {
      this.currentAssetDrawer = asset;
    },
    onSort(sortBy) {
      this.localFinalListOfAssets = [...getDetections()];
      if (!sortBy) return;
      this.localFinalListOfAssets.sort((a, b) => {
        let itemA = "", itemB = "";
        // name prop values: "4"=Compliance, "0"=Asset, "1"=Type, "2"=Primitive, "3"=Location
        const key = sortBy.name ?? (sortBy.index !== undefined ? String(sortBy.index) : null);
        switch (key) {
          case "4":
            itemA = getComplianceLevel(a).toString();
            itemB = getComplianceLevel(b).toString();
            break;
          case "0":
            itemA = getComplianceLevel(a).toString() + a.name;
            itemB = getComplianceLevel(b).toString() + b.name;
            break;
          case "1":
            itemA = displayTerm(this.type(a));
            itemB = displayTerm(this.type(b));
            break;
          case "2":
            itemA = displayTerm(this.primitive(a));
            itemB = displayTerm(this.primitive(b));
            break;
          case "3":
            itemA = this.fileName(this.occurrences(a));
            itemB = this.fileName(this.occurrences(b));
            break;
        }
        if (sortBy.order === "descending") return itemB.localeCompare(itemA);
        if (sortBy.order === "ascending") return itemA.localeCompare(itemB);
        return 0;
      });
    },
    complianceBadgeStyle(asset) {
      const color = getComplianceColor(asset);
      if (!color) return {};
      return {
        backgroundColor: color + "22",
        borderColor: color + "88",
        color: color,
      };
    },
    complianceBadgeLabel(asset) {
      return getComplianceLabel(asset) || "Unknown";
    },
    primitive(asset) {
      const r = resolvePath(asset, "cryptoProperties.algorithmProperties.primitive");
      return r ? r.toString() : "";
    },
    type(asset) {
      const r = resolvePath(asset, "cryptoProperties.assetType");
      return r ? r.toString() : "";
    },
    occurrences(asset) {
      const r = resolvePath(asset, "evidence.occurrences");
      if (r !== 0 && Array.isArray(r) && r.length > 0) return r[0];
      return null;
    },
    fileName(detection) {
      if (!detection) return "";
      return detection.location.substring(detection.location.lastIndexOf("/") + 1);
    },
    lineNumber(detection) {
      if (!detection) return "";
      return detection.line;
    },
  },
};
</script>

<style scoped>
.table-wrapper {
  position: relative;
}

/* Stable table layout */
.table-wrapper :deep(.bx--data-table) {
  table-layout: fixed;
  width: 100%;
}

/* Fixed column widths — prevent reflow on sort/filter */
/* 1=Compliance, 2=Asset, 3=Type, 4=Primitive, 5=Location */
.table-wrapper :deep(.bx--data-table th:nth-child(1)),
.table-wrapper :deep(.bx--data-table td:nth-child(1)) {
  width: 130px;
  min-width: 130px;
}
.table-wrapper :deep(.bx--data-table th:nth-child(2)),
.table-wrapper :deep(.bx--data-table td:nth-child(2)) {
  width: 155px;
  min-width: 155px;
}
.table-wrapper :deep(.bx--data-table th:nth-child(3)),
.table-wrapper :deep(.bx--data-table td:nth-child(3)) {
  width: 220px;
  min-width: 220px;
}
.table-wrapper :deep(.bx--data-table th:nth-child(4)),
.table-wrapper :deep(.bx--data-table td:nth-child(4)) {
  width: 220px;
  min-width: 220px;
}
.table-wrapper :deep(.bx--data-table th:nth-child(5)),
.table-wrapper :deep(.bx--data-table td:nth-child(5)) {
  width: 160px;
  min-width: 120px;
}

/* Prevent heading text wrap */
.table-wrapper :deep(.bx--data-table th .bx--table-header-label) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Table row hover */
.table-row {
  transition: background 0.1s;
}

.table-row:hover :deep(td) {
  background: var(--cds-layer-hover-01, #e8e8e8) !important;
}

.table-row--active :deep(td) {
  background: var(--cds-layer-selected-01, #d1e4ff) !important;
}

/* Column header with inline filter */
.col-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.col-header > span {
  font-size: 0.875rem;
  font-weight: 600;
  color: inherit;
  white-space: nowrap;
  flex-shrink: 0;
}
/* Custom filter dropdown — matches home page combo style */
.filter-combo {
  position: relative;
}

.filter-combo__btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 7px;
  font-size: 0.6875rem;
  font-weight: 500;
  font-family: inherit;
  color: var(--cds-text-secondary, #525252);
  background: #ffffff;
  border: 1px solid var(--cds-border-subtle-01, #e0e0e0);
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  max-width: 110px;
  transition: border-color 0.15s, box-shadow 0.15s, color 0.15s;
}

.filter-combo__btn:hover {
  border-color: var(--cds-border-strong-01, #8d8d8d);
  color: var(--cds-text-primary, #161616);
}

.filter-combo__btn--active {
  border-color: rgba(15, 98, 254, 0.5);
  color: #0f62fe;
}

.filter-combo__val {
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.filter-combo__chevron {
  flex-shrink: 0;
  color: var(--cds-text-secondary, #525252);
  transition: transform 0.15s;
}

.filter-combo__chevron--open {
  transform: rotate(180deg);
}

.filter-combo__list {
  position: fixed;
  min-width: 180px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06);
  z-index: 9999;
  list-style: none;
  margin: 0;
  padding: 4px;
  max-height: 260px;
  overflow-y: auto;
}

.filter-combo__item {
  padding: 7px 10px;
  font-size: 12.5px;
  color: #525252;
  border-radius: 7px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s, color 0.1s;
}

.filter-combo__item:hover {
  background: #f4f4f4;
  color: #161616;
}

.filter-combo__item--active {
  background: rgba(0, 113, 227, 0.07);
  color: #0f62fe;
  font-weight: 500;
}

/* Compliance badge */
.compliance-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 2px;
}

.compliance-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px 3px 6px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: default;
  border: 1px solid transparent;
}

.compliance-badge-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.compliance-badge-label {
  line-height: 1;
}

.compliance-badge--na {
  background: #e8e8e8;
  color: #525252;
  border-color: #c6c6c6;
}

/* Asset name cell */
.asset-name-cell {
  padding: 6px;
  min-width: 130px;
}

.asset-name {
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.01em;
  color: var(--cds-text-primary, #161616);
}

/* Tag cells */
.tag-cell {
  padding: 6px 4px;
  min-width: 100px;
}

.asset-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 400;
  white-space: nowrap;
}

.asset-tag--type {
  background: #e5f6ff;
  color: #003a6d;
  border: 1px solid #bae6ff;
}

.asset-tag--primitive {
  background: #f3e8ff;
  color: #491d8b;
  border: 1px solid #d4bbff;
}

.unspecified-text {
  font-size: 0.8125rem;
  color: var(--cds-text-secondary, #525252);
}

/* Location chip */
.location-chip {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  background: var(--cds-layer-02, #f4f4f4);
  border: 1px solid var(--cds-border-subtle-01, #e0e0e0);
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
  transition: background 0.1s, border-color 0.1s;
}

.location-chip:hover {
  background: var(--cds-layer-hover-02, #e8e8e8);
  border-color: var(--cds-border-strong-01, #8d8d8d);
}

.location-chip-text {
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--cds-link-primary, #0f62fe);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  display: block;
}

/* Drawer overlay */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 8000;
}

/* Sliding drawer panel */
.drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 580px;
  max-width: 90vw;
  background: var(--cds-layer-01, #ffffff);
  border-left: 1px solid var(--cds-border-subtle-01, #e0e0e0);
  z-index: 8001;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
}

.drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--cds-border-subtle-01, #e0e0e0);
  flex-shrink: 0;
}

.drawer-header-text {
  flex: 1;
  min-width: 0;
}

.drawer-label {
  font-size: 0.75rem;
  color: var(--cds-text-secondary, #525252);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.drawer-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--cds-text-primary, #161616);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawer-close {
  flex-shrink: 0;
  margin-left: 8px;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* Drawer transition */
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

.drawer-overlay-enter-active,
.drawer-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-overlay-enter-from,
.drawer-overlay-leave-to {
  opacity: 0;
}
</style>
