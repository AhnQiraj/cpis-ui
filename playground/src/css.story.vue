<template>
  <Story title="全局css" :layout="{ type: 'single', iframe: false }">
    <Variant title="背景色">
      <h1>Orange</h1>
      <HstColorShades
        :shades="{
          1: '#fff7e5',
          2: '#fee8c7',
          3: '#fdd99f',
          4: '#fcc97c',
          5: '#fbb95a',
          6: '#f9a938',
          7: '#e99833',
          8: '#d1872e',
          9: '#b57528',
          10: '#996322',
          11: '#E6A23C',
          12: '#7a4d1c'
        }"
        :get-name="shade => `cpis-bg-orange-${shade}`"
      >
        <template #default="{ color }">
          <div
            class="htw-rounded w-10 h-10"
            :style="{ backgroundColor: color }"
          />
        </template>
      </HstColorShades>
    </Variant>
    <Variant title="字体色">
      <h1>Orange</h1>
      <HstColorShades
        :shades="{
          1: '#fff7e5',
          2: '#fee8c7',
          3: '#fdd99f',
          4: '#fcc97c',
          5: '#fbb95a',
          6: '#f9a938',
          7: '#e99833',
          8: '#d1872e',
          9: '#b57528',
          10: '#996322',
          11: '#E6A23C',
          12: '#7a4d1c'
        }"
        :get-name="shade => `cpis-text-orange-${shade}`"
      >
        <template #default="{ color }">
          <div
            class="htw-rounded htw-h-[100px] htw-text-5xl htw-flex htw-items-end"
            :style="{ color: color }"
          >
            Aa
          </div>
        </template>
      </HstColorShades>
    </Variant>
    <Variant title="边框色">
      <h1>Orange</h1>
      <HstColorShades
        :shades="{
          1: '#fff7e5',
          2: '#fee8c7',
          3: '#fdd99f',
          4: '#fcc97c',
          5: '#fbb95a',
          6: '#f9a938',
          7: '#e99833',
          8: '#d1872e',
          9: '#b57528',
          10: '#996322',
          11: '#E6A23C',
          12: '#7a4d1c'
        }"
        :get-name="shade => `cpis-board-orange-${shade}`"
      >
        <template #default="{ color }">
          <div
            class="htw-rounded w-20 h-20 htw-border-solid htw-border-2"
            :style="{
              borderColor: color
            }"
          />
        </template>
      </HstColorShades>
    </Variant>
    <Variant title="Font Size">
      <HstTokenGrid
        :tokens="{
}"
        :get-name="
          key => (key === 'DEFAULT' ? 'drop-shadow' : `drop-shadow-${key}`)
        "
        :col-size="160"
      >
        <template #default="{ token }">
          <div
            class="htw-w-32 htw-h-32 htw-bg-white dark:htw-bg-black htw-rounded htw-mb-2"
          />
        </template>
      </HstTokenGrid>
      <template
        v-for="item in [
          {
            className: 'text-xs',
            description: '这个字体大小是text-xs',
            fontSize: '12px'
          },
          {
            className: 'text-sm',
            description: '这个字体大小是text-sm',
            fontSize: '14px'
          },
          {
            className: 'text-base',
            description: '这个字体大小是text-base',
            fontSize: '16px'
          },
          {
            className: 'text-lg',
            description: '这个字体大小是text-lg',
            fontSize: '18px'
          },
          {
            className: 'text-xl',
            description: '这个字体大小是text-xl',
            fontSize: '20px'
          },
          {
            className: 'text-2xl',
            description: '这个字体大小是text-2xl',
            fontSize: '24px'
          },
          {
            className: 'text-3xl',
            description: '这个字体大小是text-3xl',
            fontSize: '30px'
          }
        ]"
      >
        <p :class="item.className">{{ item.description }}</p>
        <pre class="p-2 rounded-2 bg-gray-100">
font-size: {{ item.fontSize }}</pre
        >
      </template>
    </Variant>
    <Variant title="内边距">
      <!--      <HstColorShades >拟稿</HstColorShades>-->
    </Variant>
    <Variant title="外边距">
      <!--      <HstColorShades >拟稿</HstColorShades>-->
    </Variant>
    <Variant title="圆角">
      <div class="grid grid-cols-4 gap-4">
        <template
          v-for="item in [
            {
              className: 'rounded-none',
              description: '这个圆角是rounded-none',
              code: 'border-radius: 0px;'
            },
            {
              className: 'rounded-sm',
              description: '这个圆角是rounded-sm',
              code: 'border-radius: 0.125rem; /* 2px */'
            },
            {
              className: 'rounded',
              description: '这个圆角是rounded',
              code: 'border-radius: 0.25rem; /* 4px */'
            },
            {
              className: 'rounded-md',
              description: '这个圆角是rounded-md',
              code: 'border-radius: 0.375rem; /* 6px */'
            },
            {
              className: 'rounded-lg',
              description: '这个圆角是rounded-lg',
              code: 'border-radius: 0.5rem; /* 8px */'
            },
            {
              className: 'rounded-xl',
              description: '这个圆角是rounded-xl',
              code: 'border-radius: 0.75rem; /* 12px */'
            },
            {
              className: 'rounded-2xl',
              description: '这个圆角是rounded-2xl',
              code: 'border-radius: 1rem; /* 16px */'
            },
            {
              className: 'rounded-3xl',
              description: '这个圆角是rounded-3xl',
              code: 'border-radius: 1.5rem; /* 24px */'
            },
            {
              className: 'rounded-full',
              description: '这个圆角是rounded-full',
              code: 'border-radius: 9999px;'
            }
          ]"
        >
          <div class="flex flex-col gap-4">
            <div :class="item.className" class="h-20 w-20 bg-gray"></div>
            <i>{{ item.description }}</i>
          </div>
        </template>
      </div>

      <!--      <HstColorShades >拟稿</HstColorShades>-->
    </Variant>
    <Variant title="Flex 布局">
      <!--      <HstColorShades >拟稿</HstColorShades>-->
    </Variant>
    <Variant title="Grid 布局">
      <!--      <HstColorShades >拟稿</HstColorShades>-->
    </Variant>
  </Story>
</template>
<script setup>
import '@cpis/cpis-ui/dist/style.css'
</script>

<docs lang="md">
# Tag

对 `element-ui` `tag`的二次封装，更加语义化表达业务中的状态

`拟稿(draft)`

`提交(submitted)`

`超期(overdue)`

`完成(completed)`

`取消(cancelled)`

同时，对于 tag 的颜色 也提供了语义化的 class 使用

字体颜色：`text-[status]`

背景颜色：`bg-[status]`

边框颜色：`board-[status]`
</docs>
