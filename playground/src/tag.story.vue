<template>
  <Story title="标签（Tag）" :layout="{ type: 'grid', width: 200 }">
    <Variant title="拟稿" source='<cpis-tag type="draft">拟稿</cpis-tag>'>
      <cpis-tag type="draft">拟稿</cpis-tag>
    </Variant>
    <Variant title="提交" source='<cpis-tag type="submitted">提交</cpis-tag>'>
      <cpis-tag type="submitted">提交</cpis-tag>
    </Variant>
    <Variant title="超期" source='<cpis-tag type="overdue">超期</cpis-tag>'>
      <cpis-tag type="overdue">超期</cpis-tag>
    </Variant>
    <Variant title="完成" source='<cpis-tag type="completed">完成</cpis-tag>'>
      <cpis-tag type="completed">完成</cpis-tag>
    </Variant>
    <Variant title="取消" source='<cpis-tag type="cancelled">取消</cpis-tag>'>
      <cpis-tag type="cancelled">取消</cpis-tag>
    </Variant>
  </Story>
</template>
<script setup>
import CpisTag from '@cpis/cpis-ui/packages/tag/src/tag.vue'
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
