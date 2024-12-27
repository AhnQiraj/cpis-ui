<template>
  <div class="color-display">
    <div class="theme-selector p-6 bg-gray-1 rounded-lg shadow-sm">
      <div class="flex items-center mb-4">
        <span class="text-gray-7 text-xl font-semibold">选择主题色</span>
        <div
          class="ml-4 px-3 py-1 bg-primary-1 text-primary-6 rounded-full text-sm font-medium"
        >
          Primary Colors
        </div>
      </div>

      <div class="text-gray-5 text-sm mb-4">将随主题色动态变化</div>

      <select
        v-model="selectedTheme"
        class="w-full px-4 py-2 bg-white border border-gray-3 rounded-lg cursor-pointer hover:border-blue-6 focus:outline-none focus:ring-2 focus:ring-blue-5 focus:ring-opacity-50 transition-colors duration-200"
        @change="updatePrimaryColor"
      >
        <option v-for="theme in themes" :value="theme.value" class="py-2">
          {{ theme.label }}
        </option>
      </select>
    </div>
    <section v-for="(palette, name) in colorPalettes" :key="name">
      <h2 class="text-gray-8 text-xl font-semibold mb-4">
        {{ formatTitle(name) }}
      </h2>
      <div class="color-grid">
        <div v-for="(color, key) in palette" :key="key" class="color-item">
          <div class="color-block" :style="{ backgroundColor: color }"></div>
          <div class="color-info">
            <div class="color-name">
              <span class="text-gray-5">背景色：</span>
              <code
                class="bg-gray-1 px-1 rounded cursor-pointer"
                @click="copyWithFeedback($event, `bg-${name}-${key}`)"
                >bg-{{ name }}-{{ key }}</code
              >
            </div>
            <div class="color-name">
              <span class="text-gray-5">文本色：</span>
              <code
                class="bg-gray-1 px-1 rounded cursor-pointer"
                @click="copyWithFeedback($event, `text-${name}-${key}`)"
                >text-{{ name }}-{{ key }}</code
              >
            </div>
            <div
              class="color-value cursor-pointer"
              @click="copyWithFeedback($event, color)"
            >
              {{ color }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ColorPalette',
  data() {
    return {
      themes: [
        {
          label: '科技蓝',
          value: 'theme-cpisblue'
        },
        {
          label: '翡翠绿',
          value: 'theme-cpis-green'
        },
        {
          label: '中国红',
          value: 'theme-cpis-red'
        },
        {
          label: '活力橙',
          value: 'theme-cpis-orange'
        },
        {
          label: '中性灰',
          value: 'theme-cpis-gray'
        }
      ],
      selectedTheme: 'theme-cpisblue',
      colorPalettes: {
        primary: {
          1: 'var(--level-1)',
          2: 'var(--level-2)',
          3: 'var(--level-3)',
          4: 'var(--level-4)',
          5: 'var(--level-5)',
          6: 'var(--level-6)',
          7: 'var(--level-7)',
          8: 'var(--level-8)',
          9: 'var(--level-9)',
          10: 'var(--level-10)'
        },
        blue: {
          1: '#F0F9FF',
          2: '#D9F0FF',
          3: '#B0DDFF',
          4: '#87C7FF',
          5: '#5EAFFF',
          6: '#3491FA',
          7: '#226FD4',
          8: '#1351AD',
          9: '#083787',
          10: '#031531'
        },
        green: {
          1: '#f6ffed',
          2: '#d9f7be',
          3: '#b7eb8f',
          4: '#95de64',
          5: '#73d13d',
          6: '#52c41a',
          7: '#389e0d',
          8: '#237804',
          9: '#135200',
          10: '#092b00'
        },
        red: {
          1: '#FFEBE8',
          2: '#FEC8C3',
          3: '#FEA39F',
          4: '#FD7C7A',
          5: '#FD5659',
          6: '#FC323D',
          7: '#D01F2E',
          8: '#A41022',
          9: '#780617',
          10: '#2A0007'
        },
        gray: {
          1: '#FAFAFA',
          2: '#F5F5F5',
          3: '#D9D9D9',
          4: '#BFBFBF',
          5: '#8C8C8C',
          6: '#595959',
          7: '#434343',
          8: '#262626',
          9: '#1F1F1F',
          10: '#000000'
        },
        orange: {
          1: '#FFF7E6',
          2: '#FFE7BA',
          3: '#FFD591',
          4: '#FFC069',
          5: '#FFA940',
          6: '#FA8C16',
          7: '#D46B08',
          8: '#AD4E00',
          9: '#873800',
          10: '#301200'
        }
      }
    }
  },
  methods: {
    formatTitle(name) {
      return name.charAt(0).toUpperCase() + name.slice(1) + ' Colors'
    },
    copyWithFeedback(event, text) {
      const element = event.target
      const originalText = element.textContent

      navigator.clipboard
        .writeText(text)
        .then(() => {
          element.textContent = '复制成功'
          setTimeout(() => {
            element.textContent = originalText
          }, 1000)
        })
        .catch(err => {
          element.textContent = '复制失败'
          setTimeout(() => {
            element.textContent = originalText
          }, 1000)
          console.error('Failed to copy:', err)
        })
    },
    updatePrimaryColor() {
      document.body.classList.remove(
        'theme-cpisblue',
        'theme-cpis-green',
        'theme-cpis-red',
        'theme-cpis-orange',
        'theme-cpis-gray'
      )
      document.body.classList.add(this.selectedTheme)
    }
  },
  mounted() {
    // 初始化时设置默认主题色
    this.updatePrimaryColor()
  }
}
</script>

<style scoped>
.color-display {
  padding: 20px;
}

section {
  margin-bottom: 40px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.color-item {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.color-block {
  height: 100px;
  width: 100%;
}

.color-info {
  padding: 12px;
  background: white;
}

.color-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.color-value {
  color: #666;
  font-family: monospace;
  font-size: 0.9em;
}

.color-name code,
.color-value {
  cursor: pointer;
  transition: opacity 0.2s;
}

.color-name code:hover,
.color-value:hover {
  opacity: 0.7;
}
</style>
