<template>
  <div class="asset-details">
    <!-- CODE SECTION -->
    <section class="details-section">
      <div class="section-header">
        <h4 class="section-title">Code</h4>
        <cv-button
          v-if="hasCodeLocation()"
          class="code-button"
          kind="ghost"
          v-on:click="$emit('open-code', true)"
        >
          View code <Launch16 class="bx--btn__icon" />
        </cv-button>
      </div>
      <GithubEmbed v-if="hasCodeLocation()" :asset="asset" @open-code="$emit('open-code', false)" />
      <div v-else class="no-code-box">
        No code location has been specified in the CBOM for this cryptographic asset. If you include code location information in a CBOM from a public online repository, you will be able to preview the code here and open it directly on a service like GitHub.
      </div>
    </section>

    <!-- SPECIFICATION SECTION -->
    <section class="details-section">
      <div class="section-header">
        <h4 class="section-title">Specification</h4>
      </div>
      <cv-structured-list condensed="true">
        <template #headings>
          <cv-structured-list-heading class="spec-type-heading">Type</cv-structured-list-heading>
          <cv-structured-list-heading>Value</cv-structured-list-heading>
        </template>
        <template #items>
          <cv-structured-list-item v-for="property in filteredProperties" :key="property.name">
            <cv-structured-list-data class="spec-type-cell">{{ property.name }}</cv-structured-list-data>
            <cv-structured-list-data>
              <div
                v-for="(value, index) in getPropertyValues(property.path)"
                :key="index"
                class="spec-value-row"
              >
                <span>{{ displayTerm(value) }}</span>
                <cv-tooltip
                  v-if="getTermDescription(value)"
                  :tip="getTermDescription(value)"
                  alignment="end"
                  class="spec-tooltip"
                />
              </div>
            </cv-structured-list-data>
          </cv-structured-list-item>
        </template>
      </cv-structured-list>
    </section>

    <!-- DEPENDENCIES -->
    <section class="details-section" v-if="getBomRef">
      <div class="section-header">
        <h4 class="section-title">Dependencies</h4>
      </div>
      <DependenciesView :bomRef="getBomRef" @open-asset="openAsset" />
    </section>

    <!-- COMPLIANCE SECTION -->
    <section class="details-section" v-if="hasValidComplianceResults">
      <div class="section-header">
        <h4 class="section-title">Compliance</h4>
      </div>
      <cv-structured-list condensed="true">
        <template #headings>
          <cv-structured-list-heading class="spec-type-heading">Type</cv-structured-list-heading>
          <cv-structured-list-heading>Value</cv-structured-list-heading>
        </template>
        <template #items>
          <cv-structured-list-item>
            <cv-structured-list-data class="spec-type-cell">Policy</cv-structured-list-data>
            <cv-structured-list-data>{{ getCompliancePolicyName }}</cv-structured-list-data>
          </cv-structured-list-item>
          <cv-structured-list-item>
            <cv-structured-list-data class="spec-type-cell">Status</cv-structured-list-data>
            <cv-structured-list-data>
              <div class="compliance-status-inline-row">
                <ComplianceIcon :asset="asset" class="compliance-inline-icon" />
                <span>{{ getComplianceDescription(asset) }}</span>
              </div>
            </cv-structured-list-data>
          </cv-structured-list-item>
          <cv-structured-list-item
            v-for="(finding, index) in getComplianceFindingsWithMessage(asset)"
            :key="index"
          >
            <cv-structured-list-data class="spec-type-cell">{{ getComplianceObjectFromId(finding.levelId).label }}</cv-structured-list-data>
            <cv-structured-list-data>{{ finding.message }}</cv-structured-list-data>
          </cv-structured-list-item>
        </template>
      </cv-structured-list>
    </section>
  </div>
</template>

<script>
import DependenciesView from "@/components/results/modal/DependenciesView.vue";
import {
  displayTerm,
  getTermDescription,
  capitalizeFirstLetter,
  getPolicyResultsByAsset,
  hasValidComplianceResults,
  getComplianceDescription,
  getComplianceFindingsWithMessage,
  getCompliancePolicyName,
  getComplianceLabel,
  getComplianceObjectFromId,
  resolvePath
} from "@/helpers";
import {
  Launch16,
  WatsonHealthImageAvailabilityUnavailable24,
} from "@carbon/icons-vue";
import GithubEmbed from "@/components/results/modal/GithubEmbed.vue";
import ComplianceIcon from "@/components/results/ComplianceIcon.vue"

export default {
  name: "CryptoAssetDetails",
  data: function () {
    return {
      propertyPaths: /* ordered */ [
        { name: "Asset Type", path: "cryptoProperties.assetType" },
        { name: "Primitive", path: "cryptoProperties.algorithmProperties.primitive" },
        { name: "Parameter Set Identifier", path: "cryptoProperties.algorithmProperties.parameterSetIdentifier" },
        { name: "Curve", path: "cryptoProperties.algorithmProperties.curve" },
        { name: "Execution Environment", path: "cryptoProperties.algorithmProperties.executionEnvironment" },
        { name: "Implementation Platform", path: "cryptoProperties.algorithmProperties.implementationPlatform" },
        { name: "Certification Level", path: "cryptoProperties.algorithmProperties.certificationLevel" },
        { name: "Mode", path: "cryptoProperties.algorithmProperties.mode" },
        { name: "Padding", path: "cryptoProperties.algorithmProperties.padding" },
        { name: "Crypto Functions", path: "cryptoProperties.algorithmProperties.cryptoFunctions" },
        { name: "Classical Security Level", path: "cryptoProperties.algorithmProperties.classicalSecurityLevel" },
        { name: "NIST Quantum Security Level", path: "cryptoProperties.algorithmProperties.nistQuantumSecurityLevel" },
        { name: "Subject Name", path: "cryptoProperties.certificateProperties.subjectName" },
        { name: "Issuer Name", path: "cryptoProperties.certificateProperties.issuerName" },
        { name: "Not Valid Before", path: "cryptoProperties.certificateProperties.notValidBefore" },
        { name: "Not Valid After", path: "cryptoProperties.certificateProperties.notValidAfter" },
        { name: "Signature Algorithm Reference", path: "cryptoProperties.certificateProperties.signatureAlgorithmRef" },
        { name: "Subject Public Key Reference", path: "cryptoProperties.certificateProperties.subjectPublicKeyRef" },
        { name: "Certificate Format", path: "cryptoProperties.certificateProperties.certificateFormat" },
        { name: "Certificate Extension", path: "cryptoProperties.certificateProperties.certificateExtension" },
        { name: "Type", path: "cryptoProperties.relatedCryptoMaterialProperties.type" },
        { name: "ID", path: "cryptoProperties.relatedCryptoMaterialProperties.id" },
        { name: "State", path: "cryptoProperties.relatedCryptoMaterialProperties.state" },
        { name: "Algorithm Reference", path: "cryptoProperties.relatedCryptoMaterialProperties.algorithmRef" },
        { name: "Creation Date", path: "cryptoProperties.relatedCryptoMaterialProperties.creationDate" },
        { name: "Activation Date", path: "cryptoProperties.relatedCryptoMaterialProperties.activationDate" },
        { name: "Update Date", path: "cryptoProperties.relatedCryptoMaterialProperties.updateDate" },
        { name: "Expiration Date", path: "cryptoProperties.relatedCryptoMaterialProperties.expirationDate" },
        { name: "Value", path: "cryptoProperties.relatedCryptoMaterialProperties.value" },
        { name: "Size", path: "cryptoProperties.relatedCryptoMaterialProperties.size" },
        { name: "Format", path: "cryptoProperties.relatedCryptoMaterialProperties.format" },
        { name: "Secured By", path: "cryptoProperties.relatedCryptoMaterialProperties.securedBy" },
        { name: "Type", path: "cryptoProperties.protocolProperties.type" },
        { name: "Version", path: "cryptoProperties.protocolProperties.version" },
        { name: "Cipher Suites", path: "cryptoProperties.protocolProperties.cipherSuites" },
        { name: "IKEv2 Transform Types", path: "cryptoProperties.protocolProperties.ikev2TransformTypes" },
        { name: "Cryptographic References", path: "cryptoProperties.protocolProperties.cryptoRefArray" },
        { name: "OID", path: "cryptoProperties.oid" },
        { name: "BOM Reference", path: "bom-ref" },
      ]
    };
  },
  components: {
    DependenciesView,
    GithubEmbed,
    Launch16,
    WatsonHealthImageAvailabilityUnavailable24,
    ComplianceIcon,
  },
  props: {
    asset: null,
  },
  computed: {
    hasValidComplianceResults,
    getCompliancePolicyName,
    filteredProperties() {
      return this.propertyPaths.filter(property => this.getPropertyValues(property.path));
    },
    getBomRef() {
      if (this.asset === undefined || this.asset === null) return;
      let values = this.getPropertyValues("bom-ref");
      if (values.length === 1) return values[0];
      return null;
    }
  },
  methods: {
    displayTerm,
    getTermDescription,
    capitalizeFirstLetter,
    getPolicyResultsByAsset,
    getComplianceDescription,
    getComplianceFindingsWithMessage,
    getComplianceLabel,
    getComplianceObjectFromId,
    resolvePath,
    hasCodeLocation() {
      let occurences = this.getPropertyValues("evidence.occurrences");
      return occurences !== null && occurences !== undefined;
    },
    getPropertyValues(path) {
      return resolvePath(this.asset, path);
    },
    openAsset(asset) {
      this.$emit('open-asset', asset);
    },
  },
};
</script>

<style scoped>
.asset-details {
  padding: 0 4px 24px;
}

.details-section {
  padding: 20px 20px 4px;
  border-bottom: 1px solid var(--cds-border-subtle-01, #e0e0e0);
}

.details-section:last-child {
  border-bottom: none;
  padding-bottom: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--cds-text-primary, #161616);
  margin: 0;
}

/* Code section */
.no-code-box {
  margin-bottom: 16px;
  border-radius: 8px;
  background: var(--cds-layer-02, #f4f4f4);
  border: 1px solid var(--cds-border-subtle-01, #e0e0e0);
  padding: 16px;
  font-size: 0.875rem;
  color: var(--cds-text-secondary, #525252);
  line-height: 1.5;
}

/* Kill Carbon structured-list bottom margin */
.details-section :deep(.bx--structured-list) {
  margin-bottom: 0;
}

/* Compliance inline status row */
.compliance-status-inline-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.compliance-inline-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

/* Specification section */
.spec-type-heading,
.spec-type-cell {
  width: 38%;
  flex-shrink: 0;
  color: var(--cds-text-secondary, #525252);
}

.spec-value-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-bottom: 2px;
}

.spec-tooltip {
  margin-left: 6px;
}
</style>
