<template>
  <div class="searchbar">
    <div class="scan-row">
      <div class="input-wrap">
        <svg
          class="input-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="scan-url-input"
          name="scan-url"
          class="scan-input"
          :class="{ 'scan-input--error': urlError }"
          type="text"
          placeholder="Enter a public Git or package URL to scan, or upload an existing CBOM file"
          v-model="model.codeOrigin.scanUrl"
          @keyup.enter="submit"
          @input="onUrlInput"
        />
      </div>
      <div class="btn-group">
        <button
          class="btn btn--primary"
          :disabled="!model.codeOrigin.scanUrl"
          @click="submit"
        >
          Scan
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
        <button class="btn btn--secondary" @click="triggerUpload">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload CBOM
        </button>
      </div>
      <input
        id="cbom-file-input"
        name="cbom-file"
        ref="fileInput"
        type="file"
        accept=".json"
        class="hidden-file-input"
        aria-hidden="true"
        tabindex="-1"
        @change="handleFileUpload"
      />
    </div>

    <transition name="err-fade">
      <div v-if="urlError" class="url-error">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ urlError }}
      </div>
    </transition>

    <div class="fields">
      <div class="field" v-click-outside="() => branchOpen = false">
        <label class="field__label" for="branch-input">
          Branch <span class="opt">(optional)</span>
          <span v-if="fetchingBranches" class="opt fetch-indicator">fetching...</span>
        </label>
        <div class="combo">
          <input
            id="branch-input"
            name="branch"
            class="field__input"
            type="text"
            placeholder="main"
            v-model="gitBranch"
            autocomplete="off"
            @focus="branchOpen = branchSuggestions.length > 0"
            @input="branchOpen = branchSuggestions.length > 0"
          />
          <button v-if="branchSuggestions.length" class="combo__arrow" @click.prevent="branchOpen = !branchOpen" tabindex="-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <ul v-if="branchOpen && filteredBranches.length" class="combo__list">
            <li
              v-for="b in filteredBranches"
              :key="b"
              class="combo__item"
              :class="{ 'combo__item--active': gitBranch === b }"
              @mousedown.prevent="gitBranch = b; branchOpen = false"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.45;flex-shrink:0">
                <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                <path d="M18 9a9 9 0 0 1-9 9"/>
              </svg>
              {{ b }}
            </li>
          </ul>
        </div>
      </div>

      <div class="field" v-click-outside="() => folderOpen = false">
        <label class="field__label" for="subfolder-input">
          Subfolder <span class="opt">(optional)</span>
          <span v-if="fetchingFolders" class="opt fetch-indicator">fetching...</span>
        </label>
        <div class="combo">
          <input
            id="subfolder-input"
            name="subfolder"
            class="field__input"
            type="text"
            placeholder="/src/crypto"
            v-model="gitSubfolder"
            autocomplete="off"
            @focus="folderOpen = folderSuggestions.length > 0"
            @input="folderOpen = folderSuggestions.length > 0; onSubfolderInput()"
          />
          <button v-if="folderSuggestions.length" class="combo__arrow" @click.prevent="folderOpen = !folderOpen" tabindex="-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <ul v-if="folderOpen && filteredFolders.length" class="combo__list">
            <li
              v-for="f in filteredFolders"
              :key="f"
              class="combo__item"
              :class="{ 'combo__item--active': gitSubfolder === f }"
            >
              <span class="combo__item-main" @mousedown.prevent="gitSubfolder = f; fetchSubfolderChildren(f)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.45;flex-shrink:0">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                {{ f }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { model, ErrorStatus } from "@/model.js";
import { connectAndScan, showResultFromUpload } from "@/helpers";
import { clickOutside } from "@/directives/clickOutside.js";

function validateScanUrl(raw) {
  if (!raw || !raw.trim()) return "Please enter a URL.";
  const url = raw.trim();
  // Package URLs: pkg:<type>/...
  if (url.startsWith("pkg:")) {
    if (!/^pkg:[a-zA-Z][^/\s]*\/.+/.test(url)) {
      return "Invalid package URL. Expected format: pkg:type/namespace/name@version";
    }
    return null;
  }
  // Git URLs: must look like a valid http/https/git URL or a bare host/path
  try {
    const normalized = url.includes("://") ? url : "https://" + url;
    const parsed = new URL(normalized);
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return "URL must include a valid hostname (e.g. github.com/org/repo).";
    }
    // Require at least one path segment (org/repo)
    const parts = parsed.pathname.replace(/^\//, "").split("/").filter(Boolean);
    if (parts.length < 2) {
      return "URL must point to a repository (e.g. github.com/org/repo).";
    }
    return null;
  } catch {
    return "Invalid URL. Enter a Git URL (https://…) or package URL (pkg:…).";
  }
}

export default {
  name: "SearchBar",
  directives: { clickOutside },
  data() {
    return {
      model,
      gitBranch: null,
      gitSubfolder: null,
      urlError: null,
      branchSuggestions: [],
      folderSuggestions: [],
      fetchingBranches: false,
      fetchingFolders: false,
      branchOpen: false,
      folderOpen: false,
      _lastFetchedRepo: null,
    };
  },
  computed: {
    filteredBranches() {
      const q = (this.gitBranch || "").toLowerCase();
      return q ? this.branchSuggestions.filter(b => b.toLowerCase().includes(q)) : this.branchSuggestions;
    },
    filteredFolders() {
      const q = (this.gitSubfolder || "").toLowerCase();
      return q ? this.folderSuggestions.filter(f => f.toLowerCase().includes(q)) : this.folderSuggestions;
    },
  },
  methods: {
    submit() {
      const error = validateScanUrl(model.codeOrigin.scanUrl);
      if (error) {
        this.urlError = error;
        return;
      }
      this.urlError = null;
      const branch = this.gitBranch?.trim() || null;
      const subfolder = this.gitSubfolder?.trim().replace(/^\//, "") || null;
      connectAndScan(branch, subfolder);
    },
    onUrlInput() {
      this.urlError = null;
      clearTimeout(this._urlDebounce);
      this._urlDebounce = setTimeout(() => this.fetchRepoData(), 800);
    },
    parseGithubRepo(url) {
      if (!url) return null;
      try {
        const normalized = url.includes("://") ? url : "https://" + url;
        const parsed = new URL(normalized);
        if (!parsed.hostname.includes("github.com")) return null;
        const parts = parsed.pathname.replace(/^\//, "").replace(/\.git$/, "").split("/").filter(Boolean);
        if (parts.length < 2) return null;
        return `${parts[0]}/${parts[1]}`;
      } catch { return null; }
    },
    async fetchRepoData() {
      const repo = this.parseGithubRepo(model.codeOrigin.scanUrl);
      if (!repo || repo === this._lastFetchedRepo) return;
      this._lastFetchedRepo = repo;
      this.branchSuggestions = [];
      this.folderSuggestions = [];
      this.fetchingBranches = true;
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/branches?per_page=50`);
        if (res.ok) {
          const data = await res.json();
          this.branchSuggestions = data.map(b => b.name);
        }
      } catch { /* silent */ } finally {
        this.fetchingBranches = false;
      }
      this.fetchingFolders = true;
      try {
        const branch = this.gitBranch || (this.branchSuggestions[0] || "main");
        const res = await fetch(`https://api.github.com/repos/${repo}/contents/?ref=${branch}`);
        if (res.ok) {
          const data = await res.json();
          this.folderSuggestions = data
            .filter(f => f.type === "dir")
            .map(f => "/" + f.name);
        }
      } catch { /* silent */ } finally {
        this.fetchingFolders = false;
      }
    },
    async fetchSubfolderChildren(selectedPath) {
      const repo = this.parseGithubRepo(model.codeOrigin.scanUrl);
      if (!repo) { this.folderOpen = false; return; }
      const path = selectedPath.replace(/^\//, "");
      const branch = this.gitBranch || (this.branchSuggestions[0] || "main");
      this.fetchingFolders = true;
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`);
        if (res.ok) {
          const data = await res.json();
          const children = data.filter(f => f.type === "dir").map(f => `/${path}/${f.name}`);
          if (children.length > 0) {
            this.folderSuggestions = children;
            this.folderOpen = true;
          } else {
            this.folderOpen = false;
          }
        } else {
          this.folderOpen = false;
        }
      } catch { this.folderOpen = false; } finally {
        this.fetchingFolders = false;
      }
    },
    onSubfolderInput() {
      clearTimeout(this._subfolderDebounce);
      this._subfolderDebounce = setTimeout(() => this._doSubfolderFetch(), 400);
    },
    async _doSubfolderFetch() {
      const repo = this.parseGithubRepo(model.codeOrigin.scanUrl);
      if (!repo) return;
      const raw = (this.gitSubfolder || "").replace(/^\//, "");
      const branch = this.gitBranch || (this.branchSuggestions[0] || "main");

      let fetchPath;
      if ((this.gitSubfolder || "").endsWith("/")) {
        fetchPath = raw.replace(/\/$/, "");
      } else {
        const lastSlash = raw.lastIndexOf("/");
        fetchPath = lastSlash > 0 ? raw.substring(0, lastSlash) : "";
      }

      this.fetchingFolders = true;
      try {
        const apiPath = fetchPath ? `${repo}/contents/${fetchPath}` : `${repo}/contents`;
        const res = await fetch(`https://api.github.com/repos/${apiPath}?ref=${branch}`);
        if (res.ok) {
          const data = await res.json();
          const prefix = fetchPath ? "/" + fetchPath : "";
          this.folderSuggestions = data
            .filter(f => f.type === "dir")
            .map(f => `${prefix}/${f.name}`);
          this.folderOpen = this.folderSuggestions.length > 0;
        }
      } catch { /* silent */ } finally {
        this.fetchingFolders = false;
      }
    },
    triggerUpload() {
      this.$refs.fileInput.value = null;
      this.$refs.fileInput.click();
    },
    _clearTimers() {
      clearTimeout(this._urlDebounce);
      clearTimeout(this._subfolderDebounce);
    },
    handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.addEventListener("load", () => {
        try {
          const cbom = JSON.parse(reader.result);
          showResultFromUpload(cbom, file.name);
        } catch {
          model.addError(ErrorStatus.InvalidFile || "");
        }
      });
    },
  },
  beforeUnmount() {
    this._clearTimers();
  },
};
</script>

<style scoped>
.searchbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── URL row ── */
.scan-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-wrap {
  flex: 1;
  position: relative;
}

.input-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-ink-tertiary);
  pointer-events: none;
  transition: color var(--transition);
}

.scan-input {
  width: 100%;
  height: 44px;
  padding: 0 14px 0 40px;
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 400;
  color: var(--c-ink);
  background: var(--c-surface-secondary);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-input);
  outline: none;
  transition: border-color var(--transition), background var(--transition),
    box-shadow var(--transition);
  box-sizing: border-box;
}

.scan-input::placeholder {
  color: var(--c-ink-tertiary);
}

.scan-input:focus {
  background: var(--c-surface);
  border-color: rgba(0, 113, 227, 0.35);
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
}

.scan-input--error {
  border-color: rgba(220, 53, 69, 0.5) !important;
  background: var(--c-surface) !important;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.08) !important;
}

.scan-input:focus + .input-icon,
.input-wrap:focus-within .input-icon {
  color: var(--c-accent);
}

/* ── Inline error ── */
.url-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 12px;
  color: #c0392b;
  margin-top: -8px;
  line-height: 1.5;
}

.err-fade-enter-active,
.err-fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.err-fade-enter-from,
.err-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── Buttons ── */
.btn-group {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 44px;
  padding: 0 18px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: var(--radius-input);
  cursor: pointer;
  white-space: nowrap;
  transition: background var(--transition), opacity var(--transition),
    transform var(--transition), box-shadow var(--transition);
  letter-spacing: -0.1px;
}

.btn:active {
  transform: scale(0.98);
}

.btn--primary {
  color: #ffffff;
  background: var(--c-ink);
}

.btn--primary:hover:not(:disabled) {
  background: #2a2a2e;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.btn--primary:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn--secondary {
  color: var(--c-ink-secondary);
  background: var(--c-surface-secondary);
  border: 1px solid var(--c-border);
}

.btn--secondary:hover {
  background: #ebebef;
  border-color: rgba(0, 0, 0, 0.1);
}

.hidden-file-input {
  display: none;
}

/* ── Optional fields ── */
.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field__label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  color: var(--c-ink-secondary);
  letter-spacing: 0.1px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.opt {
  font-weight: 400;
  font-size: 10px;
  color: var(--c-ink-tertiary);
  letter-spacing: 0;
}

.fetch-indicator {
  color: var(--c-accent);
  font-style: italic;
}

/* ── Custom combo ── */
.combo {
  position: relative;
}

.combo .field__input {
  padding-right: 32px;
}

.combo__arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: var(--c-ink-tertiary);
  display: flex;
  align-items: center;
  transition: color var(--transition);
}

.combo__arrow:hover {
  color: var(--c-ink);
}

.combo__list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--c-surface);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06);
  z-index: 100;
  list-style: none;
  margin: 0;
  padding: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.combo__item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  font-family: var(--font-body);
  font-size: 12.5px;
  color: var(--c-ink-secondary);
  border-radius: 7px;
  cursor: pointer;
  transition: background var(--transition), color var(--transition);
}

.combo__item:hover {
  background: var(--c-surface-secondary);
  color: var(--c-ink);
}

.combo__item--active {
  background: rgba(0,113,227,0.07);
  color: var(--c-accent);
  font-weight: 500;
}

.combo__item-main {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  cursor: pointer;
}


.field__input {
  height: 36px;
  padding: 0 11px;
  font-family: var(--font-body);
  font-size: 12.5px;
  color: var(--c-ink);
  background: var(--c-surface-secondary);
  border: 1px solid var(--c-border);
  border-radius: 9px;
  outline: none;
  transition: border-color var(--transition), background var(--transition),
    box-shadow var(--transition);
  box-sizing: border-box;
  width: 100%;
}

.field__input::placeholder {
  color: var(--c-ink-tertiary);
}

.field__input:focus {
  background: var(--c-surface);
  border-color: rgba(0, 113, 227, 0.3);
  box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.08);
}
</style>
