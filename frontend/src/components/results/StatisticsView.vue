<template>
  <div class="stats-wrapper">
    <!-- KPI Cards -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-value">{{ totalAssets }}</div>
        <div class="kpi-label">Total Assets</div>
      </div>
      <div class="kpi-card">
        <div
          class="kpi-value"
          :class="quantumSafePct > 0 ? 'kpi-value--safe' : 'kpi-value--warn'"
        >
          {{ quantumSafePct }}%
        </div>
        <div class="kpi-label">Quantum Safe</div>
        <div class="kpi-sub">{{ quantumSafeCount }} / {{ totalAssets }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">{{ nameNumber }}</div>
        <div class="kpi-label">Unique Types</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">{{ primitiveCount }}</div>
        <div class="kpi-label">Primitives</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">{{ functionsCount }}</div>
        <div class="kpi-label">Crypto Functions</div>
      </div>
    </div>

    <!-- ── Single Chart Block ── -->
    <div ref="chartBlock" class="chart-block" :class="{ 'chart-block--exporting': exportingChart }">

      <!-- Header row: dataset dropdown left, chart-type switcher right -->
      <div class="chart-block-header" ref="chartHeader">
        <div class="dataset-select-wrap" v-click-outside="() => datasetDropOpen = false">
          <span class="switcher-label">Distribution:</span>
          <span class="dataset-export-label">{{ datasets.find(d => d.key === activeDataset)?.label }}</span>
          <div class="dataset-combo">
            <button class="dataset-combo__btn" @click="datasetDropOpen = !datasetDropOpen">
              <span>{{ datasets.find(d => d.key === activeDataset)?.label }}</span>
              <svg class="dataset-combo__chevron" :class="{'dataset-combo__chevron--open': datasetDropOpen}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <ul v-if="datasetDropOpen" class="dataset-combo__list">
              <li
                v-for="ds in datasets"
                :key="ds.key"
                class="dataset-combo__item"
                :class="{'dataset-combo__item--active': activeDataset === ds.key}"
                @mousedown.prevent="activeDataset = ds.key; datasetDropOpen = false; userPickedDataset = true"
              >{{ ds.label }}</li>
            </ul>
          </div>
        </div>
        <div class="chart-type-switcher" ref="chartControls">
          <span class="switcher-label">View as:</span>
          <button
            v-for="t in chartTypes"
            :key="t.type"
            class="type-btn"
            :class="{ 'type-btn--active': activeChartType === t.type }"
            @click="activeChartType = t.type"
          >
            {{ t.label }}
          </button>
          <button class="type-btn export-btn" :disabled="exportingChart" @click="exportChart" title="Export as PNG">
            <svg v-if="!exportingChart" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span v-else style="font-size:0.7rem;">...</span>
          </button>
        </div>
      </div>

      <!-- Dataset subtitle -->
      <div class="chart-block-subtitle">{{ activeDatasetMeta.subtitle }}</div>

      <!-- Loading / empty states -->
      <cv-loading
        v-if="activeDatasetLoading"
        :active="true"
        :overlay="false"
        class="chart-loading"
      />
      <div v-else-if="activeDataset === 'compliance' && !complianceValid" class="chart-empty">
        Compliance data unavailable — no policy service connected.
      </div>
      <div v-else-if="activeChartData.length === 0" class="chart-empty">
        No data available.
      </div>

      <!-- Chart -->
      <template v-else>
        <div v-if="activeChartType === 'bar'" class="chart-bar-wrap">
          <ccv-simple-bar-chart
            ref="activeChart"
            :data="activeChartData"
            :options="activeBarOpts"
          />
        </div>
        <div v-else class="chart-two-col">
          <div class="chart-legend-col">
            <div
              v-for="item in activeChartData"
              :key="item.group"
              class="legend-item"
              :class="{ 'legend-item--dimmed': isItemDimmed(item.group) }"
              @mouseenter="hoverGroup(item.group)"
              @mouseleave="clearHover()"
            >
              <span
                class="legend-dot"
                :style="{ background: activeColorScale[item.group] || '#8d8d8d' }"
              ></span>
              <span class="legend-name">{{ item.group }}</span>
              <span class="legend-count">{{ item.value }}</span>
              <span class="legend-pct">{{ pct(item.value, activeTotal) }}%</span>
            </div>
          </div>
          <div class="chart-graph-col">
            <ccv-donut-chart
              v-if="activeChartType === 'donut'"
              ref="activeChart"
              :data="activeChartData"
              :options="activeRoundOpts"
            />
            <ccv-pie-chart
              v-else
              ref="activeChart"
              :data="activeChartData"
              :options="activeRoundOpts"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { model } from "@/model.js";
import { getTermFullName } from "@/helpers/info.js";
import { clickOutside } from "@/directives/clickOutside.js";
import {
  getDetections,
  getComplianceRepartition,
  getComplianceLevels,
  getColorScale,
  countOccurrences,
  capitalizeFirstLetter,
  countNames,
  hasValidComplianceResults,
  isLoadingCompliance,
  isUsingLocalComplianceService,
} from "@/helpers";

const PALETTE = [
  "#6929c4", "#1192e8", "#005d5d", "#9f1853", "#fa4d56",
  "#570408", "#198038", "#002d9c", "#ee538b", "#b28600",
  "#8a3ffc", "#33b1ff", "#007d79", "#ff7eb6", "#6fdc8c",
];

function labelGroup(raw) {
  const full = getTermFullName(raw);
  if (!full) return capitalizeFirstLetter(raw);
  const abbr = raw.toUpperCase();
  return abbr.length <= 4 && !raw.includes('-') ? `${full} (${abbr})` : full;
}

function buildColorScale(data) {
  const scale = {};
  data.forEach((d, i) => { scale[d.group] = PALETTE[i % PALETTE.length]; });
  return scale;
}

export default {
  name: "StatisticsView",
  directives: { clickOutside },
  data() {
    return {
      model,
      activeDataset: "compliance",
      activeChartType: "donut",
      hoveredGroup_: null,
      exportingChart: false,
      datasetDropOpen: false,
      userPickedDataset: false,
      datasets: [
        { key: "compliance",  label: "Quantum Safety Distribution" },
        { key: "primitives",  label: "Cryptographic Primitives" },
        { key: "functions",   label: "Cryptographic Functions" },
        { key: "types",       label: "Asset Type Distribution" },
        { key: "assets",      label: "Crypto Asset Distribution" },
      ],
      chartTypes: [
        { type: "donut", label: "Donut" },
        { type: "pie",   label: "Pie" },
        { type: "bar",   label: "Bar" },
      ],
    };
  },
  methods: {
    _autoSelectDataset(force = false) {
      if (!force && this.userPickedDataset) return;
      if (this.complianceValid && this.complianceData.length > 0) { this.activeDataset = 'compliance'; return; }
      if (this.typesData.length > 0) { this.activeDataset = 'types'; return; }
      if (this.assetsData.length > 0) { this.activeDataset = 'assets'; return; }
      if (this.primitivesData.length > 0) { this.activeDataset = 'primitives'; return; }
      if (this.functionsData.length > 0) { this.activeDataset = 'functions'; return; }
      this.activeDataset = 'compliance';
    },
    async exportChart() {
      this.exportingChart = true;
      try {
        await this.$nextTick();
        const el = this.$refs.chartBlock;
        const { default: html2canvas } = await import("html2canvas");
        const canvas = await html2canvas(el, {
          backgroundColor: "#f4f4f4",
          scale: 2,
          useCORS: true,
          logging: false,
        });
        const label = this.datasets.find(d => d.key === this.activeDataset)?.label || "chart";
        const filename = label.replace(/\s+/g, "-").toLowerCase() + "-" + this.activeChartType + ".png";
        const link = document.createElement("a");
        link.download = filename;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } finally {
        this.exportingChart = false;
      }
    },
    pct(value, total) {
      if (!total) return 0;
      return Math.round((value / total) * 100);
    },
    hoverGroup(group) {
      this.hoveredGroup_ = group;
      this._applyHighlight([group]);
    },
    clearHover() {
      this.hoveredGroup_ = null;
      this._applyHighlight([]);
    },
    _applyHighlight(selectedGroups) {
      const chartComp = this.$refs.activeChart;
      const instance = chartComp?.chart?.value ?? chartComp?.chart;
      if (!instance?.services?.events) return;
      const events = instance.services.events;
      if (selectedGroups.length === 0) {
        events.dispatchEvent('legend-item-onmouseout', {});
      } else {
        const hoveredElement = { datum: () => ({ name: selectedGroups[0] }) };
        events.dispatchEvent('legend-item-onhover', { hoveredElement });
      }
    },
    isItemDimmed(group) {
      return this.hoveredGroup_ !== null && this.hoveredGroup_ !== group;
    },
    makeTooltipFn(datasetTotal) {
      return (data, _defaultHTML, datum) => {
        let group = "", value = "";
        if (datum) { group = datum.group ?? datum.label ?? ""; value = datum.value ?? ""; }
        if (!group && Array.isArray(data) && data[0]) { group = data[0].group ?? data[0].label ?? ""; value = data[0].value ?? ""; }
        if (!group) return "";
        const pctStr = datasetTotal > 0 ? `, ${Math.round((Number(value) / datasetTotal) * 100)}%` : "";
        return `<div style="padding:6px 10px;font-size:13px;font-weight:500;white-space:nowrap;">${group} (${value}${pctStr})</div>`;
      };
    },
    mkRoundOpts(centerLabel, centerNumber, colorScale, datasetTotal) {
      const opts = {
        resizable: true,
        height: "420px",
        toolbar: { enabled: false },
        theme: "white",
        legend: { enabled: false },
        tooltip: { enabled: true, customHTML: this.makeTooltipFn(datasetTotal || 0) },
        pie: { labels: { enabled: false } },
      };
      if (centerLabel) opts.donut = { center: { label: centerLabel, number: centerNumber }, alignment: "center" };
      if (colorScale) opts.color = { scale: colorScale };
      return opts;
    },
    mkBarOpts(height, colorScale, datasetTotal) {
      const opts = {
        resizable: true,
        axes: {
          left: { mapsTo: "group", scaleType: "labels", truncation: { numCharacter: 64 } },
          bottom: { mapsTo: "value", title: "Count" },
        },
        height,
        toolbar: { enabled: false },
        theme: "white",
        legend: { enabled: false },
        tooltip: { enabled: true, customHTML: this.makeTooltipFn(datasetTotal || 0) },
      };
      if (colorScale) opts.color = { scale: colorScale };
      return opts;
    },
  },
  computed: {
    scanLoading() { return model.scanning.isScanning; },
    activeDatasetLoading() {
      if (this.activeDataset === 'compliance') return this.complianceLoading;
      return this.scanLoading && this.activeChartData.length === 0;
    },
    complianceLoading() { return isLoadingCompliance(); },
    complianceValid() { return hasValidComplianceResults(); },
    localComplianceService() { return isUsingLocalComplianceService(); },

    totalAssets() { return getDetections().length; },
    nameNumber() { return countNames()[1]; },
    primitiveCount() { return countOccurrences("primitive")[1]; },
    functionsCount() { return countOccurrences("cryptoFunctions")[1]; },

    quantumSafeCount() {
      if (!hasValidComplianceResults()) return 0;
      const repartition = getComplianceRepartition();
      const safeLevel = getComplianceLevels().find(l => typeof l.label === "string" && l.label.toLowerCase().includes("quantum safe"));
      return safeLevel ? repartition[safeLevel.id] || 0 : 0;
    },
    quantumSafePct() {
      const t = this.totalAssets;
      return t === 0 ? 0 : Math.round((this.quantumSafeCount / t) * 100);
    },

    // ── per-dataset raw data ────────────────────────────────────────────────
    complianceData() {
      const countsMap = getComplianceRepartition();
      const labelsMap = getComplianceLevels().reduce((acc, l) => { acc[l.id] = l.label; return acc; }, {});
      const total = Object.values(countsMap).reduce((s, v) => s + v, 0);
      if (total === 0) return [];
      return Object.keys(countsMap).filter(id => countsMap[id] > 0).map(id => ({ group: labelsMap[id] || String(id), value: countsMap[id] }));
    },
    primitivesData() {
      return countOccurrences("primitive")[0].map(obj => ({ ...obj, group: labelGroup(obj.group) })).sort((a, b) => b.value - a.value);
    },
    functionsData() {
      return countOccurrences("cryptoFunctions")[0].map(obj => ({ ...obj, group: labelGroup(obj.group) })).sort((a, b) => b.value - a.value);
    },
    typesData() {
      const counts = {};
      getDetections().forEach(c => {
        const t = c?.cryptoProperties?.assetType || "Unspecified";
        counts[t] = (counts[t] || 0) + 1;
      });
      return Object.entries(counts).map(([group, value]) => ({ group: labelGroup(group), value })).sort((a, b) => b.value - a.value);
    },
    assetsData() {
      const counts = {};
      getDetections().forEach(c => {
        const n = c?.name || "Unspecified";
        counts[n] = (counts[n] || 0) + 1;
      });
      return Object.entries(counts).map(([group, value]) => ({ group, value })).sort((a, b) => b.value - a.value);
    },

    complianceColorScale() { return getColorScale(); },
    primitivesColorScale() { return buildColorScale(this.primitivesData); },
    functionsColorScale()  { return buildColorScale(this.functionsData); },
    typesColorScale()      { return buildColorScale(this.typesData); },
    assetsColorScale()     { return buildColorScale(this.assetsData); },

    // ── active dataset façade ───────────────────────────────────────────────
    activeDatasetMeta() {
      const meta = {
        compliance: { subtitle: "Breakdown of assets by quantum-safety compliance level" },
        primitives: { subtitle: "Distribution of detected cryptographic primitive types across all assets" },
        functions:  { subtitle: "Frequency of cryptographic functions and named algorithm types" },
        types:      { subtitle: "Distribution of detected assets by cryptographic asset type" },
        assets:     { subtitle: "Frequency of each cryptographic asset name across all detections" },
      }[this.activeDataset];
      return meta || { subtitle: "" };
    },
    activeChartData() {
      const data = { compliance: this.complianceData, primitives: this.primitivesData, functions: this.functionsData, types: this.typesData, assets: this.assetsData }[this.activeDataset];
      return Array.isArray(data) ? data : [];
    },
    activeColorScale() {
      const scale = { compliance: this.complianceColorScale, primitives: this.primitivesColorScale, functions: this.functionsColorScale, types: this.typesColorScale, assets: this.assetsColorScale }[this.activeDataset];
      return scale || {};
    },
    activeTotal() {
      return this.activeChartData.reduce((s, d) => s + d.value, 0);
    },
    activeCenterLabel() {
      return { compliance: `Assets${this.localComplianceService ? "*" : ""}`, primitives: "Primitives", functions: "Functions", types: "Types", assets: "Assets" }[this.activeDataset];
    },
    activeCenterNumber() {
      return { compliance: this.totalAssets, primitives: this.primitiveCount, functions: this.functionsCount, types: this.typesData.length, assets: this.assetsData.length }[this.activeDataset];
    },
    activeRoundOpts() {
      return this.mkRoundOpts(this.activeCenterLabel, this.activeCenterNumber, this.activeColorScale, this.activeTotal);
    },
    activeBarOpts() {
      const data = this.activeChartData;
      const h = Math.max(320, data.length * 52) + "px";
      return this.mkBarOpts(h, this.activeColorScale, this.activeTotal);
    },
  },
  watch: {
    activeDataset() { this.hoveredGroup_ = null; },
    'model.scanning.isScanning'(scanning) {
      if (scanning) {
        this.userPickedDataset = false;
      } else {
        this._autoSelectDataset();
      }
    },
    complianceValid(valid) {
      if (!valid && this.activeDataset === 'compliance') this._autoSelectDataset();
    },
  },
  mounted() {
    this._autoSelectDataset();
  },
};
</script>

<style scoped>
.stats-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── KPI row ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.kpi-card {
  background: var(--cds-layer-01, #f4f4f4);
  border: 1px solid var(--cds-border-subtle-01, #e0e0e0);
  border-radius: 4px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 14px rgba(0,0,0,0.07);
  transition: box-shadow 0.15s;
}
.kpi-card:hover { box-shadow: 0 3px 10px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.1); }
.kpi-value {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--cds-text-primary, #161616);
}
.kpi-value--safe { color: #24a148; }
.kpi-value--warn { color: #da1e28; }
.kpi-label {
  font-size: 0.7rem;
  color: var(--cds-text-secondary, #525252);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.kpi-sub {
  font-size: 0.7rem;
  color: var(--cds-text-helper, #6f6f6f);
  margin-top: 2px;
}

/* ── Chart block ── */
.chart-block {
  background: var(--cds-layer-01, #f4f4f4);
  border: 1px solid var(--cds-border-subtle-01, #e0e0e0);
  border-radius: 4px;
  padding: 20px 24px 28px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 14px rgba(0,0,0,0.07);
}
/* ── Header: tabs left, switcher right ── */
.chart-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

/* ── Dataset dropdown ── */
.dataset-select-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dataset-combo {
  position: relative;
}

.dataset-combo__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  color: var(--cds-text-primary, #161616);
  background: var(--cds-layer-01, #f4f4f4);
  border: 1px solid var(--cds-border-strong-01, #8d8d8d);
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s;
}

.dataset-combo__btn:hover { border-color: var(--cds-text-primary, #161616); }

.dataset-combo__chevron {
  flex-shrink: 0;
  color: var(--cds-text-secondary, #525252);
  transition: transform 0.15s;
}

.dataset-combo__chevron--open { transform: rotate(180deg); }

.dataset-combo__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 100%;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06);
  z-index: 500;
  list-style: none;
  margin: 0;
  padding: 4px;
}

.dataset-combo__item {
  padding: 8px 12px;
  font-size: 0.875rem;
  color: #525252;
  border-radius: 7px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s, color 0.1s;
}

.dataset-combo__item:hover { background: #f4f4f4; color: #161616; }
.dataset-combo__item--active { color: #0f62fe; font-weight: 500; background: rgba(15,98,254,0.06); }

/* Export-only label — hidden normally, shown during export in place of combo */
.dataset-export-label {
  display: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #161616;
}

.chart-block--exporting .dataset-export-label {
  display: inline;
}

.chart-block--exporting .dataset-combo {
  display: none;
}

.chart-block-subtitle {
  font-size: 0.8rem;
  color: var(--cds-text-secondary, #525252);
  margin-bottom: 20px;
}

/* ── Chart type switcher ── */
.chart-type-switcher {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.switcher-label {
  font-size: 0.75rem;
  color: var(--cds-text-secondary, #525252);
  white-space: nowrap;
}
.type-btn {
  font-size: 0.75rem;
  padding: 4px 14px;
  border-radius: 2px;
  border: 1px solid var(--cds-border-strong-01, #8d8d8d);
  background: transparent;
  color: var(--cds-text-secondary, #525252);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
}
.type-btn:hover {
  background: var(--cds-layer-hover-01, #e8e8e8);
  color: var(--cds-text-primary, #161616);
}
.type-btn--active { background: #0f62fe; color: #fff; border-color: #0f62fe; }
.type-btn--active:hover { background: #0353e9; }
.export-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  margin-left: 4px;
}
.export-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Bar: full width ── */
.chart-bar-wrap { width: 100%; }

/* ── Two-column: legend left, chart right ── */
.chart-two-col {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 32px;
  align-items: start;
}

/* ── Legend column ── */
.chart-legend-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 32px;
  align-self: start;
}
.legend-item {
  display: grid;
  grid-template-columns: 10px 1fr 36px 44px;
  align-items: center;
  gap: 8px;
  line-height: 1.4;
  cursor: pointer;
  transition: opacity 0.18s;
}
.legend-item--dimmed { opacity: 0.3; }
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--cds-text-primary, #161616);
  white-space: normal;
  word-break: break-word;
}
.legend-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--cds-text-primary, #161616);
  text-align: right;
}
.legend-pct {
  font-size: 0.75rem;
  color: var(--cds-text-secondary, #525252);
  text-align: right;
}

/* ── Graph column ── */
.chart-graph-col {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.chart-loading { margin: 60px auto; }
.chart-empty {
  font-size: 0.875rem;
  color: var(--cds-text-secondary, #525252);
  text-align: center;
  padding: 60px 0;
}
</style>

<style>
@import "@carbon/charts-vue/styles.css";
.bx--loading__stroke { stroke: var(--cds-layer-active) !important; }
</style>
