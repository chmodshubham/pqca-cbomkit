<template>
  <div v-if="model.scanning.scanLogs.length > 0" class="terminal-panel">
    <!-- Header -->
    <div class="terminal-header">
      <div class="terminal-header__left">
        <span class="terminal-dot terminal-dot--red"></span>
        <span class="terminal-dot terminal-dot--yellow"></span>
        <span class="terminal-dot terminal-dot--green"></span>
        <span class="terminal-title">Scan Log</span>
      </div>
      <div class="terminal-header__right">
        <button class="terminal-download-btn" @click="downloadLogs" title="Download logs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Download</span>
        </button>
      </div>
    </div>

    <!-- Log body -->
    <div class="scan-log" ref="logBox">
      <div
        v-for="(entry, i) in model.scanning.scanLogs"
        :key="i"
        class="scan-log__line"
        :class="[
          'scan-log__line--' + entry.kind,
          { 'scan-log__line--active': i === model.scanning.scanLogs.length - 1 }
        ]"
      >
        <span class="scan-log__prefix">{{ prefixOf(entry.kind) }}</span>
        <span class="scan-log__text">{{ bodyOf(entry) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { model } from "@/model.js";

const KIND_PREFIX = {
  label:     "INFO ",
  detection: "FOUND",
  warn:      "WARN ",
  error:     "ERROR",
};

export default {
  name: "LoaderView",
  data() {
    return { model };
  },
  methods: {
    prefixOf(kind) { return KIND_PREFIX[kind] || "INFO "; },
    bodyOf(entry) {
      return entry.text.replace(/^(FOUND|ERROR|WARN)\s+/, "");
    },
    downloadLogs() {
      const lines = model.scanning.scanLogs.map(e => `[${this.prefixOf(e.kind)}] ${this.bodyOf(e)}`);
      const blob = new Blob([lines.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cbomkit-scan.log";
      a.click();
      URL.revokeObjectURL(url);
    },
  },
  watch: {
    'model.scanning.scanLogs.length'() {
      this.$nextTick(() => {
        const box = this.$refs.logBox;
        if (box) box.scrollTop = box.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.terminal-panel {
  border: 1px solid #30363d;
  border-radius: 0;
  overflow: hidden;
  background: #0d1117;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
  gap: 12px;
}

.terminal-header__left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.terminal-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  flex-shrink: 0;
}
.terminal-dot--red    { background: #ff5f57; }
.terminal-dot--yellow { background: #febc2e; }
.terminal-dot--green  { background: #28c840; }

.terminal-title {
  font-size: 0.72rem;
  font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", "Consolas", "Menlo", monospace;
  color: #8b949e;
  letter-spacing: 0.04em;
  margin-left: 6px;
}

.terminal-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}


.terminal-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  font-size: 0.72rem;
  font-family: inherit;
  color: #8b949e;
  background: transparent;
  border: 1px solid #30363d;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.12s, border-color 0.12s;
  white-space: nowrap;
}
.terminal-download-btn:hover {
  color: #c9d1d9;
  border-color: #58a6ff;
}

.scan-log {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px 14px;
  font-size: 0.8rem;
  font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", "Consolas", "Menlo", monospace;
  line-height: 1.75;
  letter-spacing: 0;
}
.scan-log::-webkit-scrollbar { width: 6px; }
.scan-log::-webkit-scrollbar-track { background: #161b22; }
.scan-log::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }

.scan-log__line {
  display: flex;
  gap: 10px;
}

.scan-log__prefix {
  flex-shrink: 0;
  font-weight: 600;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  padding: 1px 5px;
  border-radius: 3px;
  align-self: flex-start;
  margin-top: 2px;
}

.scan-log__text {
  color: #c9d1d9;
  white-space: pre-wrap;
  word-break: break-all;
}

.scan-log__line--label .scan-log__prefix  { color: #58a6ff; background: rgba(88,166,255,0.1); }
.scan-log__line--label .scan-log__text    { color: #8b949e; }

.scan-log__line--detection .scan-log__prefix { color: #3fb950; background: rgba(63,185,80,0.1); }
.scan-log__line--detection .scan-log__text   { color: #c9d1d9; }

.scan-log__line--warn .scan-log__prefix { color: #d29922; background: rgba(210,153,34,0.1); }
.scan-log__line--warn .scan-log__text   { color: #e3b341; }

.scan-log__line--error .scan-log__prefix { color: #f85149; background: rgba(248,81,73,0.1); }
.scan-log__line--error .scan-log__text   { color: #ffa198; }

.scan-log__line--active .scan-log__text { color: #e6edf3; }
</style>
