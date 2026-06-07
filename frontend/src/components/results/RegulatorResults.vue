<template>
  <div>
    <!-- Scanning loader -->
    <div
      v-if="model.scanning.isScanning"
      class="skeleton-bordered"
      v-bind:style="{ borderColor: skeletonColor }"
    >
      <cv-inline-loading
        v-if="model.scanning.scanningStatus != null"
        ending-text="Scan ended"
        :error-text="model.scanning.scanningStatusMessage"
        :loading-text="model.scanning.scanningStatusMessage"
        loaded-text="Scan finished"
        :state="model.scanning.scanningStatus"
      />
    </div>

    <!-- Loading compliance skeleton -->
    <div
      class="skeleton-bordered"
      v-else-if="isLoadingCompliance"
      v-bind:style="{ borderColor: skeletonColor }"
    >
      <InProgress16 style="margin: 0px 16px 0px 6px" v-bind:style="{ color: skeletonColor }" />
      <h6 style="padding: 7px 12px 7px 0px">Analyzing compliance...</h6>
      <cv-skeleton-text :heading="false" :paragraph="false" :line-count="1" style="margin-bottom: -8px; width: 60%" />
    </div>

    <!-- Inline notification -->
    <cv-inline-notification
      v-else
      :kind="kind"
      title=""
      :sub-title="description"
      :low-contrast="true"
      :hide-close-button="true"
      style="margin: 0px"
      v-bind:style="{ background: backgroundColor }"
    />
  </div>
</template>

<script>
import { model } from "@/model.js";
import {
  getComplianceReport,
  isLoadingCompliance,
  hasValidComplianceResults,
  globalComplianceResult,
} from "@/helpers";
import { InProgress16 } from "@carbon/icons-vue";

export default {
  name: "RegulatorResults",
  data() { return { model }; },
  components: { InProgress16 },
  computed: {
    isLoadingCompliance,
    description() {
      return "Export the CBOM before initiating a new scan, as subsequent scans overwrite and do not retain prior results.";
    },
    backgroundColor() {
      return "";
    },
    skeletonColor() {
      return "#BAB9B9";
    },
    kind() {
      if (hasValidComplianceResults()) {
        return globalComplianceResult() ? "success" : "warning";
      }
      return "info";
    },
  },
  beforeMount() {
    if (model.cbom != null) getComplianceReport(model.cbom);
  },
  watch: {
    "model.cbom"(newResult) {
      if (newResult != null) getComplianceReport(model.cbom);
    },
  },
};
</script>

<style scoped>
.skeleton-bordered {
  padding: 7px;
  border-style: solid;
  border-width: thin;
  border-color: lightgray;
  border-left-width: medium;
  display: flex;
  align-items: center;
}
</style>

<style>
.bx--inline-notification {
  max-width: none !important;
}
</style>
