<template>
  <el-tooltip :content="$t('components.back-to-top.tip')" placement="top">
    <transition :name="transitionName">
      <div
        v-show="visible"
        :style="customStyle"
        class="back-to-ceiling"
        @click="backToTop"
      >
        <ibps-icon name="arrow-circle-up" />
      </div>
    </transition>
  </el-tooltip>
</template>
<script>
export default {
  name: 'IbpsBackToTop',
  props: {
    visibilityHeight: {
      type: Number,
      default: 200
    },
    backPosition: {
      type: Number,
      default: 0
    },
    customStyle: {
      type: Object,
      default: function() {
        return {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          'border-radius': '20px',
          'box-shadow': '0 0 6px rgba(0,0,0,.12)',
          'line-height': '45px', // 请保持与高度一致以垂直居中
          'background-color': '#ccc9c966'// 按钮的背景颜色
        }
      }
    },
    transitionName: {
      type: String,
      default: 'fade'
    },
    scrollTop: {
      type: Number
    }
  },
  data() {
    return {
      visible: false,
      interval: null
    }
  },
  watch: {
    scrollTop() {
      this.handleScroll()
    }
  },
  methods: {
    handleScroll() {
      this.visible = this.scrollTop > this.visibilityHeight
    },
    backToTop() {
      this.$emit('scroll-to-top')
    }
  }
}
</script>
<style lang="scss" scoped>
  .back-to-ceiling {
    position: fixed;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }
  .back-to-ceiling:hover {
    background: #d5dbe7;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0
  }
  .back-to-ceiling {
    .ibps-icon {
      color: #fff;
      font-size: 22px;
      background: none;
    }
  }
</style>
