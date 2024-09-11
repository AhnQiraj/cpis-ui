<template>
  <Story title="标签（Tag）" :layout="{ type: 'grid', width: 200 }">
    <Variant title="拟稿">
      <cpis-tag type="warning">拟稿</cpis-tag>
    </Variant>
    <Variant title="提交">
      <cpis-tag>提交</cpis-tag>
    </Variant>
    <Variant title="超期">
      <cpis-tag type='s'>超期</cpis-tag>
    </Variant>
    <Variant title="完成">
      <cpis-tag type="success">完成</cpis-tag>
    </Variant>
    <Variant title="取消">
      <cpis-tag type="info">取消</cpis-tag>
    </Variant>
    <Variant title="取消">
      <cpis-tag type="info">取消</cpis-tag>
    </Variant>
  </Story>
</template>
<script>
import CpisTag from '../../packages/cpis-ui/packages/tag/index.js'
import 'element-ui/lib/theme-chalk/index.css'
export default {
  components: {
    CpisTag
  }
}
</script>

<docs lang="md">
# 状态标签

状态，状态分为拟稿，提交，完成，取消，超期。颜色 class 如下：

拟稿的背景颜色 `bg-status-init`

拟稿的字体颜色 `text-status-init`

提交的背景颜色 `bg-status-submit`

提交的字体颜色 `text-status-submit`

完成的背景颜色 `bg-status-finish`

完成的字体颜色 `text-status-finish`

取消的背景颜色 `bg-status-cancel`

取消的字体颜色 `text-status-cancel`

超期的背景颜色 `bg-status-overdue`

超期的字体颜色 `text-status-overdue`
</docs>
