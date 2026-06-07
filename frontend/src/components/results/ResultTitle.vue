<template>
  <div>
    <cv-tile style="padding: 0px">
      <div style="padding: 16px; padding-bottom: 8px">
        <div>
          <h3 style="padding-bottom: 6px; font-weight: 500">
            {{ dataTableTitle }}
          </h3>
          <h4 style="padding-bottom: 8px" v-html="dataTableSubtitle"></h4>
          <cv-tag v-if="showLink" :label="linkLabel" />
          <cv-tag v-if="showBranch" :label="branchLabel" />
          <cv-tag v-if="showCommitID" :label="commitIDLabel" />
          <cv-tag v-if="showSubfolder" :label="subfolderLabel" />
        </div>
      </div>
      <div v-if="getDetections().length > 0 || model.scanning.isScanning">
        <RegulatorResults style="padding-top: 12px" />
        <LoaderView style="margin: 16px 0 0" />
        <StatisticsView style="padding: 22px 16px" />
      </div>
    </cv-tile>
  </div>
</template>

<script>
import { model } from "@/model.js";
import { getDetections, numberFormatter, formatSeconds, limitString } from "@/helpers";
import RegulatorResults from "@/components/results/RegulatorResults.vue";
import StatisticsView from "@/components/results/StatisticsView.vue";
import LoaderView from "@/components/results/LoaderView.vue";

export default {
  name: "ResultsTitle",
  data() {
    return {
      model,
    };
  },
  components: {
    RegulatorResults,
    StatisticsView,
    LoaderView,
  },
  computed: {
    showLink() {
      return model.codeOrigin.gitUrl != null;
    },
    linkLabel() {
      return "gitUrl: " + model.codeOrigin.gitUrl;
    },
    showBranch() {
      return model.codeOrigin.revision != null;
    },
    branchLabel() {
      return "revision: " + model.codeOrigin.revision;
    },
    showCommitID() {
      return model.codeOrigin.commitID != null;
    },
    commitIDLabel() {
      return "commit: " + limitString(model.codeOrigin.commitID, 7);
    },
    showSubfolder() {
      return model.codeOrigin.subfolder != null;
    },
    subfolderLabel() {
      return "subfolder: " + model.codeOrigin.subfolder;
    },
    dataTableTitle() {
      var title = "Unknown CBOM";
      if (model.codeOrigin.uploadedFileName != null) {
        title = model.codeOrigin.uploadedFileName + " (uploaded)";
      }
      if (model.codeOrigin.projectIdentifier != null) {
        title = model.codeOrigin.projectIdentifier;
      } else if (model.codeOrigin.scanUrl != null) {
        title = model.codeOrigin.scanUrl.replace("https://", "");
      }
      return title;
    },
    dataTableSubtitle() {
      if (model.scanning.isScanning) {
        return model.scanning.liveDetections.length === 0
          ? `<h4>Scanning code for cryptographic assets...</h4>`
          : `<h4>${model.scanning.liveDetections.length} cryptographic assets found...</h4>`;
      }

      let parts = [];

      if (model.scanning.numberOfFiles && model.scanning.numberOfLines) {
        const lines = numberFormatter(model.scanning.numberOfLines);
        const files = numberFormatter(model.scanning.numberOfFiles);
        const lineWord = model.scanning.numberOfLines > 1 ? "lines" : "line";
        const fileWord = model.scanning.numberOfFiles > 1 ? "files" : "file";
        parts.push(`Scanned ${lines} ${lineWord} of code across ${files} ${fileWord}.`);
      }

      if (model.scanning.totalDuration) {
        parts.push(`Took ${formatSeconds(model.scanning.totalDuration)} to scan.`);
      }

      if (parts.length === 0) {
        const count = getDetections().length;
        if (count === 0) return `<h4>No cryptographic asset has been found.</h4>`;
        return `<h4>${count} cryptographic asset${count > 1 ? "s" : ""} found.</h4>`;
      }

      return `<h4>${parts.join(" ")}</h4>`;
    },
  },
  methods: {
    limitString,
    getDetections,
  },
};
</script>

<style scoped>
.result-note {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin: 10px 0 4px;
  padding: 8px 12px;
  background: rgba(217, 119, 6, 0.07);
  border-left: 3px solid rgba(217, 119, 6, 0.6);
  border-radius: 6px;
  font-size: 12px;
  color: #78450a;
  line-height: 1.5;
}

.result-note strong {
  font-weight: 600;
}
</style>
