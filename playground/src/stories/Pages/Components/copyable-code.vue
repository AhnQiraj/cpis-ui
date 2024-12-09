<template>
  <div class="code-container">
    <pre class="code-block">
      <code>{{ code }}</code>
    </pre>
    <button
      class="copy-button"
      @click="copyCode"
    >
      {{ copied ? '已复制!' : '复制代码' }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'CopyableCode',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      copied: false
    }
  },
  methods: {
    copyCode() {
      navigator.clipboard.writeText(this.code);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
  }
}
</script>

<style scoped>
.code-container {
  position: relative;
  background: #f8f8f8;
  border-radius: 4px;
}

.code-block {
  padding: 0.75rem;
  margin: 0;
  overflow-x: auto;
  font-family: monospace;
}

.copy-button {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 4px 8px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 12px;
}

.code-container:hover .copy-button {
  opacity: 1;
}

.copy-button:hover {
  background: #444;
}
</style>