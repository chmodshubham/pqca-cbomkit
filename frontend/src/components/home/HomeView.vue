<template>
  <div class="home">
    <div class="hero">
      <div class="hero__header">
        <div class="hero__eyebrow">PQStation</div>
        <h1 class="hero__title">
          CBOMkit<span class="hero__title-accent"></span>
        </h1>
      </div>

      <div class="hero__body hero__body--stack">
        <p class="hero__description">
          CBOMkit is a collection of tools built for generating and managing
          Cryptographic Bills of Materials (CBOMs). A CBOM is a structured
          inventory of the cryptographic assets present in a software system:
          algorithms, keys, protocols, and their properties. The kit enables
          organizations to discover what cryptographic mechanisms their code
          depends on, how they are configured, and whether those
          configurations meet defined security standards, including readiness
          for post-quantum cryptography.
        </p>
        <div class="hero__lang-support">
          <span class="lang-support__label">Supports</span>
          <span class="lang-badge lang-badge--java">Java <em>JCA · BouncyCastle</em></span>
          <span class="lang-badge lang-badge--python">Python <em>pyca/cryptography</em></span>
          <span class="lang-badge lang-badge--go">Go <em>crypto · x/crypto</em></span>
          <span class="lang-badge lang-badge--cpp">C / C++ <em>OpenSSL</em></span>
          <span class="lang-badge lang-badge--csharp">C# <em>System.Security.Cryptography</em></span>
        </div>
      </div>
    </div>

    <div class="post-scan-section">
      <div class="hero__body hero__body--stack">

        <!-- Architecture diagram -->
        <div class="hero__diagram">
          <div class="diagram-header">
            <span class="diagram-header__label">Architecture</span>
          </div>
          <div
            class="flow-diagram"
            aria-hidden="true"
            ref="diagramRef"
            @mouseleave="hoveredNode = null"
          >
            <Teleport to="body">
              <div
                v-if="hoveredNode"
                class="node-tooltip"
                :style="{ top: tooltipPos.y + 'px', left: tooltipPos.x + 'px' }"
              >
                <div class="node-tooltip__title">
                  {{ tooltips[hoveredNode].title }}
                </div>
                <div class="node-tooltip__body">
                  {{ tooltips[hoveredNode].body }}
                </div>
              </div>
            </Teleport>
            <svg
              viewBox="0 0 710 210"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="flow-svg"
            >
              <defs>
                <marker
                  id="a"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M1,1 L1,7 L7,4 z"
                    fill="rgba(30,64,175,0.35)"
                    stroke="none"
                  />
                </marker>
                <marker
                  id="ap"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M1,1 L1,7 L7,4 z"
                    fill="rgba(88,86,214,0.55)"
                    stroke="none"
                  />
                </marker>
                <marker
                  id="aam"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M1,1 L1,7 L7,4 z"
                    fill="rgba(217,119,6,0.55)"
                    stroke="none"
                  />
                </marker>
                <marker
                  id="ab"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M1,1 L1,7 L7,4 z"
                    fill="#0071e3"
                    stroke="none"
                    opacity="0.6"
                  />
                </marker>
                <marker
                  id="at"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M1,1 L1,7 L7,4 z"
                    fill="#00a396"
                    stroke="none"
                    opacity="0.65"
                  />
                </marker>
              </defs>

              <!-- ════ INPUTS (cx=59) ════ -->
              <rect
                x="0"
                y="68"
                width="118"
                height="36"
                rx="8"
                fill="rgba(30,64,175,0.06)"
                stroke="rgba(30,64,175,0.22)"
                stroke-width="1"
                style="cursor: default"
              />
              <text
                x="59"
                y="83"
                text-anchor="middle"
                class="node-label node-label--input"
              >
                Git URL
              </text>
              <text x="59" y="96" text-anchor="middle" class="node-sublabel">
                Repository
              </text>

              <rect
                x="0"
                y="150"
                width="118"
                height="36"
                rx="8"
                fill="rgba(30,64,175,0.06)"
                stroke="rgba(30,64,175,0.22)"
                stroke-width="1"
              />
              <text
                x="59"
                y="165"
                text-anchor="middle"
                class="node-label node-label--input"
              >
                Package URL
              </text>
              <text x="59" y="178" text-anchor="middle" class="node-sublabel">
                purl (pkg:…)
              </text>

              <!-- ════ cbomkit-lib GROUP (cx=226) ════ -->
              <rect
                x="138"
                y="58"
                width="176"
                height="56"
                rx="10"
                fill="rgba(88,86,214,0.05)"
                stroke="rgba(88,86,214,0.24)"
                stroke-width="1"
                style="cursor: pointer"
                @mouseenter="showTooltip('cbomkit-lib', $event)"
                @mousemove="moveTooltip($event)"
                @mouseleave="hoveredNode = null"
              />
              <text
                x="226"
                y="51"
                text-anchor="middle"
                class="node-group-label node-group-label--purple"
              >
                cbomkit-lib
              </text>

              <!-- sonar-cryptography: x=152, y=66, w=148, h=40, cy=86 -->
              <rect
                x="152"
                y="66"
                width="148"
                height="40"
                rx="7"
                fill="rgba(88,86,214,0.11)"
                stroke="rgba(88,86,214,0.32)"
                stroke-width="1"
                style="cursor: pointer"
                @mouseenter="showTooltip('sonar-cryptography', $event)"
                @mousemove="moveTooltip($event)"
                @mouseleave="hoveredNode = null"
              />
              <text
                x="226"
                y="82"
                text-anchor="middle"
                class="node-label node-label--purple"
              >
                sonar-cryptography
              </text>
              <text x="226" y="96" text-anchor="middle" class="node-sublabel">
                Git source scanner
              </text>

              <!-- ════ cbomkit-theia standalone (cy=168) ════ -->
              <rect
                x="138"
                y="150"
                width="176"
                height="36"
                rx="8"
                fill="rgba(217,119,6,0.08)"
                stroke="rgba(217,119,6,0.38)"
                stroke-width="1"
                style="cursor: pointer"
                @mouseenter="showTooltip('cbomkit-theia', $event)"
                @mousemove="moveTooltip($event)"
                @mouseleave="hoveredNode = null"
              />
              <text
                x="226"
                y="165"
                text-anchor="middle"
                class="node-label node-label--amber"
              >
                cbomkit-theia
              </text>
              <text x="226" y="178" text-anchor="middle" class="node-sublabel">
                Package scanner
              </text>

              <!-- ════ ARROWS: inputs → scanners (horizontal) ════ -->
              <line
                x1="118"
                y1="86"
                x2="152"
                y2="86"
                stroke="rgba(88,86,214,0.4)"
                stroke-width="1.4"
                marker-end="url(#ap)"
              />
              <line
                x1="118"
                y1="168"
                x2="138"
                y2="168"
                stroke="rgba(217,119,6,0.45)"
                stroke-width="1.4"
                marker-end="url(#aam)"
              />

              <!-- ════ MERGE: both scanners → CBOM ════ -->
              <polyline
                points="300,86 328,86 328,126 346,126"
                stroke="rgba(0,113,227,0.35)"
                stroke-width="1.4"
                fill="none"
                stroke-linejoin="round"
                marker-end="url(#ab)"
              />
              <polyline
                points="314,168 328,168 328,126"
                stroke="rgba(0,113,227,0.3)"
                stroke-width="1.4"
                fill="none"
                stroke-linejoin="round"
              />

              <!-- ════ CBOM node: x=346, y=108, w=100, h=36, cy=126 ════ -->
              <rect
                x="346"
                y="108"
                width="100"
                height="36"
                rx="8"
                fill="rgba(0,113,227,0.1)"
                stroke="rgba(0,113,227,0.4)"
                stroke-width="1.5"
                style="cursor: pointer"
                @mouseenter="showTooltip('cbom', $event)"
                @mousemove="moveTooltip($event)"
                @mouseleave="hoveredNode = null"
              />
              <text
                x="396"
                y="122"
                text-anchor="middle"
                class="node-label node-label--accent"
              >
                CBOM
              </text>
              <text x="396" y="136" text-anchor="middle" class="node-sublabel">
                CycloneDX
              </text>

              <!-- ════ RIGHT COLUMN -all same width=198, x=494, cx=593 ════ -->

              <!-- CBOMkit group: y=10, h=182. Boxes: y=28,82,136 (h=40 each, gap=14). Bottom=176+10=186 -->
              <rect
                x="482"
                y="10"
                width="222"
                height="182"
                rx="10"
                fill="rgba(0,113,227,0.03)"
                stroke="rgba(0,113,227,0.19)"
                stroke-width="1"
              />
              <text
                x="593"
                y="24"
                text-anchor="middle"
                class="node-group-label"
              >
                CBOMkit
              </text>

              <!-- Dashboard: y=28, h=40, cy=48 -->
              <rect
                x="494"
                y="28"
                width="198"
                height="40"
                rx="8"
                fill="rgba(0,163,150,0.09)"
                stroke="rgba(0,163,150,0.38)"
                stroke-width="1.5"
                style="cursor: pointer"
                @mouseenter="showTooltip('dashboard', $event)"
                @mousemove="moveTooltip($event)"
                @mouseleave="hoveredNode = null"
              />
              <text
                x="593"
                y="52"
                text-anchor="middle"
                class="node-label node-label--teal"
              >
                Dashboard
              </text>

              <!-- Compliance Engine: y=82, h=40, cy=102 -->
              <rect
                x="494"
                y="82"
                width="198"
                height="40"
                rx="7"
                fill="rgba(0,113,227,0.08)"
                stroke="rgba(0,113,227,0.2)"
                stroke-width="1"
                style="cursor: pointer"
                @mouseenter="showTooltip('compliance', $event)"
                @mousemove="moveTooltip($event)"
                @mouseleave="hoveredNode = null"
              />
              <text
                x="593"
                y="96"
                text-anchor="middle"
                class="node-label node-label--accent"
              >
                Compliance Engine
              </text>
              <text x="593" y="111" text-anchor="middle" class="node-sublabel">
                OPA / Built-in
              </text>

              <!-- Repository: y=136, h=40, cy=156 -->
              <rect
                x="494"
                y="136"
                width="198"
                height="40"
                rx="7"
                fill="rgba(0,113,227,0.08)"
                stroke="rgba(0,113,227,0.2)"
                stroke-width="1"
                style="cursor: pointer"
                @mouseenter="showTooltip('repository', $event)"
                @mousemove="moveTooltip($event)"
                @mouseleave="hoveredNode = null"
              />
              <text
                x="593"
                y="150"
                text-anchor="middle"
                class="node-label node-label--accent"
              >
                Repository
              </text>
              <text x="593" y="165" text-anchor="middle" class="node-sublabel">
                PostgreSQL
              </text>

              <!-- ════ BUS: CBOM right (446,126) → horizontal → bus x=470 → vertical spine y=48..156 ════ -->
              <line
                x1="446"
                y1="126"
                x2="470"
                y2="126"
                stroke="rgba(0,113,227,0.35)"
                stroke-width="1.4"
              />
              <!-- vertical bus spine: Dashboard cy=48 → Repository cy=156 -->
              <line
                x1="470"
                y1="48"
                x2="470"
                y2="156"
                stroke="rgba(0,113,227,0.3)"
                stroke-width="1.4"
                stroke-dasharray="4 3"
              />

              <!-- branch → Dashboard (cy=48, teal) -->
              <line
                x1="470"
                y1="48"
                x2="494"
                y2="48"
                stroke="rgba(0,163,150,0.55)"
                stroke-width="1.2"
                marker-end="url(#at)"
              />

              <!-- branch → Compliance Engine (cy=102, blue) -->
              <line
                x1="470"
                y1="102"
                x2="494"
                y2="102"
                stroke="rgba(0,113,227,0.55)"
                stroke-width="1.2"
                marker-end="url(#ab)"
              />

              <!-- branch → Repository (cy=156, blue) -->
              <line
                x1="470"
                y1="156"
                x2="494"
                y2="156"
                stroke="rgba(0,113,227,0.55)"
                stroke-width="1.2"
                marker-end="url(#ab)"
              />
            </svg>
          </div>
        </div>

        <p class="hero__subtitle">
          Built on the open-source
          <a
            href="https://github.com/cbomkit/cbomkit"
            target="_blank"
            class="hero__link"
            >CBOMkit</a
          >
          by
          <a href="https://pqca.org" target="_blank" class="hero__link"
            >PQCA</a
          >, with extended support.
        </p>

      </div>
    </div>

    <div class="section-divider">
      <span class="section-divider__label">Generate CBOM</span>
    </div>

    <div v-if="isViewerOnly" class="viewer-section">
      <FileUploader class="file-uploader-viewer" />
      <TrySampleButton class="try-sample-button" />
      <PluginExplainerView class="plugin-explainer-view" />
    </div>
    <div v-else class="main-section">
      <SearchOrUploadView />
    </div>

  </div>
</template>

<script>
import { model } from "@/model.js";
import { getTitle, isViewerOnly } from "@/helpers.js";
import SearchOrUploadView from "@/components/home/SearchOrUploadView.vue";
import FileUploader from "@/components/home/FileUploader.vue";
import PluginExplainerView from "@/components/home/PluginExplainerView.vue";
import TrySampleButton from "@/components/home/TrySampleButton.vue";

const TOOLTIPS = {
  "sonar-cryptography": {
    title: "sonar-cryptography",
    body: "SonarQube plugin that identifies cryptographic usage in source code via AST analysis. Supports Java, Python, C/C++, Go, and C#.",
  },
  "cbomkit-lib": {
    title: "cbomkit-lib",
    body: "Java library wrapping sonar-cryptography with a standalone programmatic API. Scan a local directory and receive a CBOM -no SonarQube installation required.",
  },
  "cbomkit-theia": {
    title: "cbomkit-theia",
    body: "Go CLI tool that detects cryptographic assets in container images and local directories. Inspects deployment artifacts - certificates, keys, secrets, and crypto config files.",
  },
  cbom: {
    title: "CBOM",
    body: "Cryptographic Bill of Materials in CycloneDX v1.6 format. Lists all cryptographic assets detected in the scanned source or container.",
  },
  dashboard: {
    title: "Dashboard",
    body: "A web interface for visualizing CBOMs, and reviewing compliance results.",
  },
  compliance: {
    title: "Compliance Engine",
    body: "Policy assessment engine backed by OPA and built-in rules. Evaluates CBOMs against quantum-safe compliance policies.",
  },
  repository: {
    title: "Repository",
    body: "Persistent PostgreSQL store for CBOMs. Supports querying, and importing externally generated CBOMs",
  },
};

export default {
  name: "HomeView",
  components: {
    FileUploader,
    SearchOrUploadView,
    PluginExplainerView,
    TrySampleButton,
  },
  data() {
    return {
      model,
      hoveredNode: null,
      tooltipPos: { x: 0, y: 0 },
      tooltips: TOOLTIPS,
    };
  },
  computed: { getTitle, isViewerOnly },
  methods: {
    showTooltip(node, event) {
      this.hoveredNode = node;
      this.updateTooltipPos(event);
    },
    moveTooltip(event) {
      if (this.hoveredNode) this.updateTooltipPos(event);
    },
    updateTooltipPos(event) {
      this.tooltipPos = {
        x: event.clientX + 14,
        y: event.clientY - 8,
      };
    },
  },
};
</script>

<style scoped>
.home {
  padding: 0 5%;
}

/* ── Post-scan section (diagram + table) ── */
.post-scan-section {
  padding: 20px 0 20px;
}

/* ── Hero ── */
.hero {
  padding: 36px 0 20px;
  animation: hero-in 0.6s cubic-bezier(0.2, 0, 0.2, 1) both;
}

.hero__header {
  text-align: center;
  margin-bottom: 32px;
}

.hero__body {
  display: flex;
  align-items: flex-start;
  gap: 40px;
}

.hero__body--stack {
  flex-direction: column;
  align-items: stretch;
  gap: 36px;
  max-width: 820px;
  margin: 0 auto;
}

.hero__left {
  flex: 0 0 420px;
  text-align: left;
}

.hero__right {
  flex: 1;
  min-width: 0;
}

.hero__diagram {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

/* ── Language support table ── */
.lang-table-wrap {
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: var(--c-surface);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.lang-table-title {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-ink-tertiary);
  padding: 12px 18px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.12);
  background: var(--c-surface-secondary);
}

.lang-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 13.5px;
}

.lang-table th,
.lang-table td {
  padding: 12px 18px;
  text-align: left;
  vertical-align: middle;
}

.lang-table thead th {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-ink-tertiary);
  border-bottom: 2px solid rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.015);
}

.lang-table tbody tr + tr {
  border-top: 2px solid rgba(0, 0, 0, 0.1);
}

.lang-table tbody td:first-child {
  width: 180px;
}

/* Horizontal variant: languages as columns */
.lang-table--horizontal {
  table-layout: fixed;
}

.lang-table--horizontal thead th {
  text-align: center;
  padding: 14px 12px;
  width: 25%;
}

.lang-table--horizontal tbody td {
  vertical-align: middle;
  text-align: center;
  padding: 10px 12px;
  height: 44px;
}

.lang-table--horizontal tbody tr + tr {
  border-top: 2px solid rgba(0, 0, 0, 0.1);
}

.lang-table--horizontal tbody td:first-child {
  width: auto;
}

.lang-table--horizontal tbody td + td {
  border-left: 2px solid rgba(0, 0, 0, 0.1);
}

.lang-table--horizontal thead th + th {
  border-left: 2px solid rgba(0, 0, 0, 0.1);
}

.lang-table--horizontal .lib-chip {
  display: inline-block;
  margin: 3px 3px;
}

.lang-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.lang-pill--java   { background: rgba(88, 86, 214, 0.1);  color: #5856d6; }
.lang-pill--python { background: rgba(52, 168, 83, 0.1);  color: #2e8b47; }
.lang-pill--go     { background: rgba(0, 163, 150, 0.1);  color: #008577; }
.lang-pill--cpp    { background: rgba(217, 76, 49, 0.1);  color: #b0462e; }
.lang-pill--csharp { background: rgba(104, 33, 122, 0.1); color: #68217a; }

.lib-chip {
  display: inline-block;
  padding: 3px 10px;
  margin-right: 6px;
  border-radius: 6px;
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  font-size: 12px;
  font-weight: 400;
  background: var(--c-surface-secondary);
  border: 1px solid var(--c-border);
  color: var(--c-ink-secondary);
}

.lib-chip--java   { border-color: rgba(88, 86, 214, 0.25); color: #474676; }
.lib-chip--python { border-color: rgba(52, 168, 83, 0.25); color: #2e6b3e; }
.lib-chip--go     { border-color: rgba(0, 163, 150, 0.25); color: #006b62; }
.lib-chip--cpp    { border-color: rgba(217, 76, 49, 0.25); color: #8a3a25; }
.lib-chip--csharp { border-color: rgba(104, 33, 122, 0.25); color: #5a1a6a; }

.hero__lang-intro {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--c-ink-tertiary);
  margin: 0 0 8px;
  padding-top: 14px;
  padding-left: 16px;
  border-top: 1px solid var(--c-border);
}

.hero__lang-list {
  list-style: none;
  padding: 0 0 0 28px;
  margin: 0 0 0;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--c-ink-secondary);
  line-height: 2;
}

.hero__lang-list li::before {
  content: "›";
  margin-right: 8px;
  color: var(--c-accent);
  font-weight: 600;
}

.hero__lang-name {
  font-weight: 600;
}

.hero__lang-name--java {
  color: #1e40af;
}
.hero__lang-name--python {
  color: #065f46;
}
.hero__lang-name--go {
  color: #0e7490;
}
.hero__lang-name--cpp {
  color: #9a3412;
}

.hero__lib {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  border-radius: 5px;
  padding: 1px 7px;
  margin-left: 5px;
  line-height: 1.6;
  border: 1px solid transparent;
  vertical-align: middle;
}

.hero__lib--java {
  color: #1e40af;
  background: rgba(30, 64, 175, 0.07);
  border-color: rgba(30, 64, 175, 0.2);
}
.hero__lib--python {
  color: #065f46;
  background: rgba(6, 95, 70, 0.07);
  border-color: rgba(6, 95, 70, 0.2);
}
.hero__lib--go {
  color: #0e7490;
  background: rgba(14, 116, 144, 0.07);
  border-color: rgba(14, 116, 144, 0.2);
}
.hero__lib--cpp {
  color: #9a3412;
  background: rgba(154, 52, 18, 0.07);
  border-color: rgba(154, 52, 18, 0.2);
}
.hero__lib--csharp {
  color: #68217a;
  background: rgba(104, 33, 122, 0.07);
  border-color: rgba(104, 33, 122, 0.2);
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero__eyebrow {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: var(--c-ink-tertiary);
  margin-bottom: 12px;
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4.5vw, 50px);
  font-weight: 600;
  color: var(--c-ink);
  line-height: 1.08;
  margin: 0 0 16px 0;
  letter-spacing: -1.5px;
}

.hero__title-accent {
  display: block;
  height: 3px;
  width: 48px;
  background: #5856d6;
  border-radius: 2px;
  margin: 8px auto 0;
}

.hero__description {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  color: var(--c-ink-secondary);
  line-height: 1.75;
  margin: 0;
  text-align: justify;
}

.hero__lang-support {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.lang-support__label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--c-ink-tertiary);
  margin-right: 2px;
}

.lang-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid transparent;
}

.lang-badge em {
  font-style: normal;
  font-weight: 400;
  opacity: 0.75;
  font-size: 11px;
}

.lang-badge--java   { background: rgba(88,86,214,0.08); border-color: rgba(88,86,214,0.2); color: #3730a3; }
.lang-badge--python { background: rgba(34,139,34,0.08); border-color: rgba(34,139,34,0.2); color: #166534; }
.lang-badge--go     { background: rgba(0,163,150,0.08); border-color: rgba(0,163,150,0.2); color: #0e7490; }
.lang-badge--cpp    { background: rgba(180,60,30,0.08); border-color: rgba(180,60,30,0.2); color: #9a3412; }
.lang-badge--csharp { background: rgba(104,33,122,0.08); border-color: rgba(104,33,122,0.2); color: #68217a; }

.hero__subtitle {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 400;
  font-style: italic;
  color: var(--c-ink-tertiary);
  opacity: 0.75;
  line-height: 1.6;
  margin: -20px 0 0;
  text-align: center;
}

.hero__link {
  color: var(--c-accent);
  text-decoration: none;
  font-weight: 500;
  transition: opacity var(--transition);
}

.hero__link:hover {
  opacity: 0.7;
}

.diagram-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 0;
  margin-bottom: 10px;
}

.diagram-header::before,
.diagram-header::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--c-border);
}

.diagram-header__label {
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--c-ink-tertiary);
  white-space: nowrap;
}

.flow-diagram {
  display: flex;
  justify-content: center;
  position: relative;
  overflow: visible;
  z-index: 10;
  background: linear-gradient(
    135deg,
    rgba(0, 113, 227, 0.02) 0%,
    rgba(88, 86, 214, 0.02) 50%,
    rgba(0, 163, 150, 0.02) 100%
  );
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 16px 8px;
  box-shadow: var(--shadow-card);
}

.flow-svg {
  width: 100%;
  max-width: 900px;
  height: auto;
  overflow: visible;
}

.flow-svg .node-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  fill: #1d1d1f;
  letter-spacing: -0.1px;
}

.flow-svg .node-label--accent {
  fill: #0071e3;
}

.flow-svg .node-label--purple {
  fill: #5856d6;
}

.flow-svg .node-label--teal {
  fill: #00a396;
}

.flow-svg .node-label--input {
  fill: rgba(30, 64, 175, 0.8);
}

.flow-svg .node-label--amber {
  fill: #b45309;
}

.flow-svg .node-sublabel {
  font-family: var(--font-body);
  font-size: 8.5px;
  font-weight: 400;
  fill: #8e8e93;
  letter-spacing: 0;
}

.flow-svg .node-group-label {
  font-family: var(--font-display);
  font-size: 9px;
  font-weight: 600;
  fill: rgba(0, 113, 227, 0.6);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.flow-svg .node-group-label--purple {
  fill: rgba(88, 86, 214, 0.65);
}

/* ── Main section ── */
.main-section {
  padding-bottom: 32px;
  max-width: 820px;
  margin: 0 auto;
  animation: hero-in 0.6s 0.08s cubic-bezier(0.2, 0, 0.2, 1) both;
}

.file-uploader-viewer {
  margin-bottom: 16px;
}
.try-sample-button {
  margin-bottom: 8px;
}
.plugin-explainer-view {
  padding-top: 24px;
  padding-bottom: 80px;
}

/* ── Section divider ── */
.section-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px auto 20px;
  max-width: 820px;
  animation: hero-in 0.6s 0.12s cubic-bezier(0.2, 0, 0.2, 1) both;
}

.section-divider::before,
.section-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--c-border);
}

.section-divider__label {
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--c-ink-tertiary);
  white-space: nowrap;
}

/* ── Node tooltip ── */
.node-tooltip {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  max-width: 240px;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
}

.node-tooltip__title {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  color: var(--c-ink);
  margin-bottom: 5px;
  letter-spacing: -0.1px;
}

.node-tooltip__body {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 400;
  color: var(--c-ink-secondary);
  line-height: 1.55;
}
</style>
