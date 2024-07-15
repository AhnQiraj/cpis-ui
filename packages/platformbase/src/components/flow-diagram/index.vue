<template>
  <div v-loading="loading" :element-loading-text="$t('common.loading')" class="flow-diagram">
    <div v-if="statusColorList.length > 0" class="ibps-pl-5">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <div slot="title">
            {{ $t('baseCommon.message.flowDiag') }}(<span class="red">{{ $t('baseCommon.message.serchNodeHis') }}</span
            >)
          </div>
          <el-row :gutter="5">
            <el-col v-for="(status, index) in statusColorList" :key="status.value + index" :span="3" class="ibps-ellipsis" style="padding-top: 5px"> <ibps-icon :style="{ color: status.color }" name="square-o" /> {{ status.value }} </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!--工具栏-->
    <div v-if="toolbar" class="io-toolbar-controls">
      <el-button-group>
        <el-button type="primary" icon="ibps-icon-crosshairs" plain @click="zoomReset">{{ $t('baseCommon.buttons.reduction') }}</el-button>
        <el-button type="info" icon="ibps-icon-plus" plain @click="zoomIn">{{ $t('baseCommon.buttons.amplify') }}</el-button>
        <el-button type="warning" icon="ibps-icon-minus" plain @click="zoomOut">{{ $t('baseCommon.buttons.reduce') }}</el-button>
      </el-button-group>
    </div>
    <div :id="id" class="canvas" style="padding-top: 20px" />
    <!--审批历史-->
    <approval-history-dialog :visible="approvalHistoryVisible" :task-id="taskId" :inst-id="instId" :node-id="nodeId" :biz-key="bizKey" type="node" width="70%" @close="visible => (approvalHistoryVisible = visible)" />
  </div>
</template>
<script>
import { remoteRequest } from '@platform/utils/remote'
import ApprovalHistoryDialog from '@platform/components/flow-approve-history/dialog'
import 'bpmn-js/dist/assets/diagram-js.css'
import BpmnViewer from 'bpmn-js'
import SelectionModule from 'diagram-js/lib/features/selection' // select elements
import TouchModule from 'diagram-js/lib/navigation/touch' // touch
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll' // zoom canvas
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas' // scroll canvas
import ModelingModule from 'diagram-js/lib/features/modeling' // basic modeling (create/move/remove shapes/connections)
import OutlineModule from 'diagram-js/lib/features/outline' // show element outlines
import PaletteModule from 'diagram-js/lib/features/palette' // palette
import ContextPadModule from 'diagram-js/lib/features/context-pad' // context pad for elements,
import ConnectModule from 'diagram-js/lib/features/connect' // connect elements
export default {
  name: 'FlowDiagram',
  components: {
    ApprovalHistoryDialog
  },
  props: {
    visible: Boolean,
    defId: String,
    taskId: String,
    instId: String,
    bizKey: String,
    toolbar: {
      type: Boolean,
      default: true
    },
    height: Number,
    width: Number,
    autoHeight: Boolean,
    id: {
      type: String,
      default: function () {
        // 随机个id避免一个页面多个流程图
        return 'ibps-flow-diagram' + Date.parse(new Date()) / 1000
      }
    }
  },
  data() {
    return {
      activeNames: [],
      statusColorList: [],
      viewer: null,
      loading: false,
      isInit: false,
      approvalHistoryVisible: false,
      nodeId: ''
    }
  },
  beforeDestroy() {
    this.activeNames = null
    this.statusColorList = null
    this.viewer = null
  },
  methods: {
    getFormData() {
      this.$nextTick(() => {
        this.init()
        this.loadData()
      })
    },
    loadData() {
      let hasEvent = true
      const params = {}
      if (this.$utils.isNotEmpty(this.defId)) {
        params.defId = this.defId
        hasEvent = false
      }
      if (this.$utils.isNotEmpty(this.taskId)) {
        params.taskId = this.taskId
      }
      if (this.$utils.isNotEmpty(this.instId)) {
        params.instId = this.instId
      }
      if (this.$utils.isNotEmpty(this.bizKey)) {
        params.bizKey = this.bizKey
      }
      params.ignoreInstIdNull = true
      this.loading = true
      remoteRequest('IbpsFlowDiagram', params, () => {
        return this.getRemoteTransFunc(params)
      })
        .then(response => {
          this.loading = false
          if (response.state === 103) {
            this.$emit('error', true)
            return
          }
          const data = response.data
          const xml = data.xml
          const styleMap = data.styleMap || {}
          this.statusColorList = this.$utils.isEmpty(styleMap) ? [] : data.statusColorList
          this.initStatusColorList()
          this.loadViewer(xml, styleMap, hasEvent)
        })
        ['catch'](() => {
          this.$emit('error', true)
          this.loading = false
        })
    },
    getRemoteTransFunc(params) {
      return new Promise((resolve, reject) => {
        window.apiList['bpmn/bpmImage']
          .getFlowDiagram(params)
          .then(response => {
            resolve(response)
          })
          ['catch'](error => {
            reject(error)
          })
      })
    },
    async loadViewer(xml, styleMap, hasEvent) {
      try {
        await this.viewer.importXML(xml)
        this.viewer.get('canvas').zoom('fit-viewport')
        this.handleColor(styleMap)
        if (hasEvent) {
          this.handleEventBus()
        }
      } catch (err) {
        this.loading = false
        console.error('[flow-diagram] something went wrong:', err)
      }
    },
    init() {
      if (this.isInit) {
        return
      }
      this.isInit = true
      // 当前窗口高度
      const height = this.autoHeight ? '90%' : window.innerHeight - 200
      this.viewer = new BpmnViewer({
        container: '#' + this.id,
        height: height,
        additionalModules: [
          SelectionModule,
          ZoomScrollModule,
          MoveCanvasModule,
          ModelingModule,
          // MoveModule,
          OutlineModule,
          // LassoToolModule,
          PaletteModule,
          // CreateModule,
          ContextPadModule,
          ConnectModule,
          // RulesModule,
          TouchModule
        ]
      })
    },
    initStatusColorList() {
      if (this.$utils.isEmpty(this.statusColorList)) {
        return
      }
      const id = 'ibps-flow-diagram'
      let newStyle = ''
      this.statusColorList.forEach(item => {
        newStyle += `.ibps-flow-diagram-${item.key}:not(.djs-connection) .djs-visual > :nth-child(1) {stroke: ${item.color} !important;}  `
      })
      this.$utils.createStyles(newStyle, id)
    },
    /**
     * 染色
     */
    handleColor(styleMap) {
      if (this.$utils.isEmpty(styleMap) || this.$utils.isEmpty(this.statusColorList)) {
        return
      }
      const canvas = this.viewer.get('canvas')
      const elementRegistry = this.viewer.get('elementRegistry')
      for (const key in styleMap) {
        if (styleMap[key]) {
          const style = styleMap[key]
          const shape = elementRegistry.get(key) // 存在的节点才上色
          if (shape) {
            canvas.addMarker(key, 'ibps-flow-diagram-' + style.status)
          }
        }
      }
    },
    handleEventBus() {
      const eventBus = this.viewer.get('eventBus')
      // you may hook into any of the following events
      const events = ['element.focus', 'element.click']
      events.forEach(event => {
        eventBus.on(event, e => {
          e.preventDefault()
          e.stopPropagation()
          if (e.element.type !== 'bpmn:UserTask') {
            return
          }
          this.nodeId = e.element.id
          this.approvalHistoryVisible = true
          // this.$refs.historyPopover.$el.children[0].style = `top:${e.element.y + 200}px;left:${e.element.x}px;`
        })
      })
    },
    zoomReset() {
      this.viewer.get('zoomScroll').reset()
    },
    zoomOut() {
      this.viewer.get('zoomScroll').stepZoom(-1)
    },
    zoomIn() {
      this.viewer.get('zoomScroll').stepZoom(1)
    }
  }
}
</script>
<style lang="scss">
.flow-diagram {
  .io-control {
    background: #fff;
    border-radius: 2px;
    border: solid 1px #e0e0e0;
    padding: 5px;
  }
  .io-toolbar-controls {
    float: right;
    padding-top: 5px;
  }
  .bjs-powered-by {
    display: none;
  }
}
</style>
