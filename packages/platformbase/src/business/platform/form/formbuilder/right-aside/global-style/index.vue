<template>
  <div class="global-style">
    <el-form
      v-if="formDef && formDef.attrs && formDef.attrs.styles"
      ref="formDef"
      :model="formDef"
      size="mini"
      label-width="80px"
      @submit.native.prevent
    >
      <div class="panel panel-default">
        <div class="panel-heading">页面背景</div>
        <div class="panel-body">
          <el-form-item label="背景设置">
            <el-radio-group v-model="formDef.attrs.styles.pageBackground">
              <el-radio-button label="bgColor">底色</el-radio-button>
              <el-radio-button label="picture">图片</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formDef.attrs.styles.pageBackground === 'bgColor'" label="底色">
            <div class="mg-up_down color-select">
              <el-color-picker
                v-model="formDef.attrs.styles.bgColor"
                show-alpha
              />
            </div>
          </el-form-item>
          <el-form-item v-else>
            <template slot="label">图片<help-tip prop="formBackground" /></template>
            <!-- 图片上传 -->
            <ibps-image
              v-model="formDef.attrs.styles.backgroundImage"
              :height="style.picHeight"
              :width="style.picWidth"
              :limit="1"
              :accept="imagesAccept"
            />
            <el-select v-model="formDef.attrs.styles.isRepeat" placeholder="请选择" class="ibps-mt-10 " :class="className.mr">
              <el-option
                v-for="item in options.repeat"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button type="text" @click.stop="remove">移除</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">表单全局</div>
        <div class="panel-body">
          <el-form-item>
            <template slot="label">宽度<help-tip prop="formWidth" /></template>
            <el-select v-model="formDef.attrs.styles.PCWidth" placeholder="请选择">
              <el-option
                v-for="item in options.width"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="样式">
            <el-row>
              <el-col :span="5">
                <div class="mg-up_down color-select">
                  <el-color-picker
                    v-model="formDef.attrs.styles.styleBgColor"
                    show-alpha
                  />
                </div>
                <div :class="className.descName">底色<help-tip prop="formBackgroundColor" /></div>
              </el-col>
              <el-col :span="19">
                <el-select v-model="formDef.attrs.styles.shadow" placeholder="请选择">
                  <el-option
                    v-for="item in options.isOpen"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div :class="className.descName">阴影<help-tip prop="formShadow" /></div>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">页眉</div>
        <div class="panel-body">
          <el-form-item label="页眉展示">
            <el-radio-group v-model="formDef.attrs.styles.headerDisplay">
              <el-radio-button label="show">展示</el-radio-button>
              <el-radio-button label="hidden">隐藏</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <template v-if="formDef.attrs.styles.headerDisplay === 'show'">
            <el-form-item>
              <template slot="label">类型<help-tip prop="formHeader" /></template>
              <el-radio-group v-model="formDef.attrs.styles.headerType">
                <el-radio-button label="text">文字</el-radio-button>
                <el-radio-button label="sola">单张图</el-radio-button>
                <el-radio-button label="carousel">轮播图</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <template v-if="formDef.attrs.styles.headerType === 'sola'">
              <el-form-item>
                <template slot="label">上传<help-tip prop="formHeaderImage" /></template>
                <!-- 上传图片 -->
                <ibps-image
                  v-model="formDef.attrs.styles.headerPicture"
                  :height="style.picHeight"
                  :width="style.picWidth"
                  :limit="1"
                  :accept="imagesAccept"
                />
              </el-form-item>
              <el-form-item label="布局">
                <el-radio-group v-model="formDef.attrs.styles.headerLayout">
                  <el-radio-button label="left">居左</el-radio-button>
                  <el-radio-button label="center">居中</el-radio-button>
                  <el-radio-button label="right">居右</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
            <template v-else-if="formDef.attrs.styles.headerType === 'carousel'">
              <el-form-item label="图片">
                <!-- 上传图片 -->
                <ibps-attachment
                  v-model="formDef.attrs.styles.headerCarousel"
                  :placeholder="attachment.placeholder"
                  :download="attachment.download"
                  :limit="attachment.limit"
                  :accept="imagesAccept"
                  :multiple="attachment.multiple"
                  :upload-type="attachment.uploadType"
                  :store="attachment.store"
                  :media-type="attachment.mediaType"
                  :style="{width:width}"
                />
                <div
                  :class="className.descName"
                  v-html="carousel"
                />
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="文字内容">
                <el-input
                  v-model="formDef.attrs.styles.headerText"
                  placeholder="请输入文字内容"
                />
              </el-form-item>
              <el-form-item label="样式">
                <el-row :justify="style.justify">
                  <el-col :span="10">
                    <el-select v-model="formDef.attrs.styles.headerTypeface" placeholder="请选择" :class="className.mr">
                      <el-option
                        v-for="item in options.typeface"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <div
                      :class="className.descName"
                      v-html="desc.typeface"
                    />
                  </el-col>
                  <el-col :span="8">
                    <el-select v-model="formDef.attrs.styles.headerFontSize" placeholder="请选择" :class="className.mr">
                      <el-option
                        v-for="item in options.fontSize"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <div
                      :class="className.descName"
                      v-html="desc.fontSize"
                    />
                  </el-col>
                  <el-col :span="3">
                    <div
                      class="text-bold mg-up_down "
                      :class="className.mr+(isBold('headerBold')?' text-bold_active':'')"
                      @click="toggle('headerBold')"
                    ><i :class="className.boldIcon" /></div>
                    <div
                      :class="className.descName"
                      v-html="desc.bold"
                    />
                  </el-col>
                  <el-col :span="3">
                    <div class="mg-up_down color-select">
                      <el-color-picker
                        v-model="formDef.attrs.styles.headerColor"
                        show-alpha
                      />
                    </div>
                    <div
                      :class="className.descName"
                      v-html="desc.color"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="对齐方式">
                <el-radio-group v-model="formDef.attrs.styles.headerAlignment">
                  <el-radio-button label="left"><i class="ibps-icon-align-left" /></el-radio-button>
                  <el-radio-button label="center"><i class="ibps-icon-align-center" /></el-radio-button>
                  <el-radio-button label="right"><i class="ibps-icon-align-right" /></el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
            <el-form-item label="底色">
              <div class="mg-up_down color-select">
                <el-color-picker
                  v-model="formDef.attrs.styles.headerBgColor"
                  show-alpha
                />
              </div>
            </el-form-item>
          </template>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">表单标题和表单描述</div>
        <div class="panel-body">
          <el-form-item label="标题样式">
            <el-row :justify="style.justify">
              <el-col :span="10">
                <el-select v-model="formDef.attrs.styles.titleTypeface" placeholder="请选择" :class="className.mr">
                  <el-option
                    v-for="item in options.typeface"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div
                  :class="className.descName"
                  v-html="desc.typeface"
                />
              </el-col>
              <el-col :span="8">
                <el-select v-model="formDef.attrs.styles.titleFontSize" placeholder="请选择" :class="className.mr">
                  <el-option
                    v-for="item in options.fontSize"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div
                  :class="className.descName"
                  v-html="desc.fontSize"
                />
              </el-col>
              <el-col :span="3">
                <div
                  class="text-bold mg-up_down "
                  :class="className.mr+(isBold('titleBold')?' text-bold_active':'')"
                  @click="toggle('titleBold')"
                ><i :class="className.boldIcon" /></div>
                <div
                  :class="className.descName"
                  v-html="desc.bold"
                />
              </el-col>
              <el-col :span="3">
                <div class="mg-up_down color-select">
                  <el-color-picker
                    v-model="formDef.attrs.styles.titleColor"
                    show-alpha
                  />
                </div>
                <div
                  :class="className.descName"
                  v-html="desc.color"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="标题布局">
            <el-radio-group v-model="formDef.attrs.styles.titleAlignment">
              <el-radio-button label="left"><i class="ibps-icon-align-left" /></el-radio-button>
              <el-radio-button label="center"><i class="ibps-icon-align-center" /></el-radio-button>
              <el-radio-button label="right"><i class="ibps-icon-align-right" /></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-checkbox v-model="formDef.attrs.styles.isFold" label="表单描述较长时折叠展示" />
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading">字段</div>
        <div class="panel-body">
          <el-form-item label="字段标签">
            <el-row :justify="style.justify">
              <el-col :span="10">
                <el-select v-model="formDef.attrs.styles.labelTypeface" placeholder="请选择" :class="className.mr">
                  <el-option
                    v-for="item in options.typeface"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div
                  :class="className.descName"
                  v-html="desc.typeface"
                />
              </el-col>
              <el-col :span="8">
                <el-select v-model="formDef.attrs.styles.labelFontSize" placeholder="请选择" :class="className.mr">
                  <el-option
                    v-for="item in options.fontSize"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div
                  :class="className.descName"
                  v-html="desc.fontSize"
                />
              </el-col>
              <el-col :span="3">
                <div
                  class="text-bold mg-up_down "
                  :class="className.mr+(isBold('labelBold')?' text-bold_active':'')"
                  @click="toggle('labelBold')"
                ><i :class="className.boldIcon" /></div>
                <div
                  :class="className.descName"
                  v-html="desc.bold"
                />
              </el-col>
              <el-col :span="3">
                <div class="mg-up_down color-select">
                  <el-color-picker
                    v-model="formDef.attrs.styles.labelColor"
                    show-alpha
                  />
                </div>
                <div
                  :class="className.descName"
                  v-html="desc.color"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <template slot="label">字段选项<help-tip prop="formOption" /></template>
            <el-row :justify="style.justify">
              <el-col :span="10">
                <el-select v-model="formDef.attrs.styles.valTypeface" placeholder="请选择" :class="className.mr">
                  <el-option
                    v-for="item in options.typeface"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div
                  :class="className.descName"
                  v-html="desc.typeface"
                />
              </el-col>
              <el-col :span="8">
                <el-select v-model="formDef.attrs.styles.valFontSize" placeholder="请选择" :class="className.mr">
                  <el-option
                    v-for="item in options.fontSize"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <div
                  :class="className.descName"
                  v-html="desc.fontSize"
                />
              </el-col>
              <el-col :span="3">
                <div
                  class="text-bold mg-up_down "
                  :class="className.mr+(isBold('valBold')?' text-bold_active':'')"
                  @click="toggle('valBold')"
                ><i :class="className.boldIcon" /></div>
                <div
                  :class="className.descName"
                  v-html="desc.bold"
                />
              </el-col>
              <el-col :span="3">
                <div class="mg-up_down color-select">
                  <el-color-picker
                    v-model="formDef.attrs.styles.valColor"
                    show-alpha
                  />
                </div>
                <div
                  :class="className.descName"
                  v-html="desc.color"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
/**
 * 表单全局样式
 */
import { accept as ACCEPT } from '@platform/business/platform/file/constants/fileTypes'
import IbpsImage from '@platform/business/platform/file/image'
import IbpsAttachment from '@platform/business/platform/file/attachment/selector'
export default {
  name: 'GlobalStyle',
  components: {
    IbpsImage,
    IbpsAttachment
  },
  props: {
    data: {
      type: Object
    },
    id: String,
    boData: {
      type: Array
    }
  },
  data() {
    return {
      options: { // 选择器的选项
        repeat: [{
          value: 'noRepeat',
          label: '不重复'
        }, {
          value: 'repeat',
          label: '重复'
        }],
        width: [{
          value: 'full',
          label: '全屏'
        }, {
          value: 'narrow',
          label: '较窄'
        }, {
          value: 'normal',
          label: '正常'
        }, {
          value: 'wide',
          label: '较宽'
        }],
        isOpen: [{
          value: 'Y',
          label: '开启'
        }, {
          value: 'N',
          label: '关闭'
        }],
        borderSize: [{
          value: '0',
          label: '无'
        }, {
          value: '1',
          label: '1'
        }, {
          value: '2',
          label: '2'
        }, {
          value: '3',
          label: '3'
        }, {
          value: '4',
          label: '4'
        }, {
          value: '5',
          label: '5'
        }],
        fontSize: [{
          value: 'default',
          label: '默认'
        }, {
          value: '12',
          label: '12'
        }, {
          value: '14',
          label: '14'
        }, {
          value: '16',
          label: '16'
        }, {
          value: '18',
          label: '18'
        }, {
          value: '20',
          label: '20'
        }, {
          value: '22',
          label: '22'
        }],
        typeface: [{
          value: 'default',
          label: '默认'
        }, {
          value: 'Tahoma',
          label: 'Tahoma'
        }, {
          value: 'Helvetica',
          label: 'Helvetica'
        }, {
          value: 'Verdana',
          label: 'Verdana'
        }, {
          value: 'Georgia',
          label: 'Georgia'
        }, {
          value: 'heiti',
          label: '黑体'
        }, {
          value: 'kaiti',
          label: '楷体'
        }, {
          value: 'songti',
          label: '宋体'
        }],
        spacing: [{
          value: 'ordinary',
          label: '普通'
        }, {
          value: 'compact',
          label: '紧凑'
        }, {
          value: 'loose',
          label: '宽松'
        }]
      },
      attachment: {
        placeholder: '请选择',
        download: true,
        limit: 5,
        multiple: true,
        uploadType: 'attachment',
        store: 'json',
        mediaType: 'images'
      },
      desc: { // 描述
        PCWidth: '仅在电脑浏览器上生效',
        phoneWidth: '仅用于手机浏览器',
        typeface: '选择字体',
        fontSize: '字号',
        bold: '加粗',
        color: '颜色'
      },
      style: { // 样式
        fullWidth: '100%',
        appointWidth: '120px',
        justify: 'center',
        picHeight: '100',
        picWidth: '100'
      },
      className: { // 类名
        mr: 'ibps-mr-5',
        descName: 'ibps-help-block',
        boldIcon: 'ibps-icon-bold'
      },
      nameAndVal: [{
        name: 'pageBackground',
        value: 'bgColor'
      }, {
        name: 'isRepeat',
        value: 'noRepeat'
      }, {
        name: 'PCWidth',
        value: 'full'
      }, {
        name: 'isRepeat',
        value: 'noRepeat'
      }, {
        name: 'shadow',
        value: 'N'
      }, {
        name: 'borderSize',
        value: '0'
      }, {
        name: 'isDivider',
        value: 'N'
      }, {
        name: 'headerDisplay',
        value: 'hidden'
      }, {
        name: 'headerType',
        value: 'text'
      }, {
        name: 'headerLayout',
        value: 'left'
      }, {
        name: 'headerTypeface',
        value: 'default'
      }, {
        name: 'headerFontSize',
        value: 'default'
      }, {
        name: 'headerAlignment',
        value: 'left'
      }, {
        name: 'titleTypeface',
        value: 'default'
      }, {
        name: 'titleFontSize',
        value: 'default'
      }, {
        name: 'titleBold',
        value: true
      }, {
        name: 'labelTypeface',
        value: 'default'
      }, {
        name: 'labelFontSize',
        value: 'default'
      }, {
        name: 'valTypeface',
        value: 'default'
      }, {
        name: 'valFontSize',
        value: 'default'
      // }, {
      //   name: 'fieldSpacing',
      //   value: 'ordinary'
      }],
      width: '',
      formDef: {
        name: '',
        key: '',
        typeId: '',
        desc: '',
        attrs: {
          styles: {}
        }
      }
    }
  },
  computed: {
    imagesAccept() {
      return ACCEPT['images']
    },
    limit() {
      return this.attachment.limit
    },
    carousel() {
      return `图片最多上传${this.attachment.limit}张，轮播顺序为图片预览从上到下的顺序`
    }
  },
  watch: {
    data: {
      handler: function(val, oldVal) {
        this.formDef = val
        this.init()
      },
      immediate: true,
      deep: true
    },
    formDef: {
      handler: function(val, oldVal) {
        this.$emit('update', val)
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    this.options = null
    this.attachment = null
    this.desc = null
    this.style = null
    this.className = null
    this.nameAndVal = null
    this.formDef = null
  },
  methods: {
    remove() {
      this.formDef.attrs.styles.backgroundImage = ''
    },
    init() { // 初始化
      let _data = {}
      if (this.formDef && this.formDef.attrs && this.$utils.isNotEmpty(this.formDef.attrs.styles)) {
        _data = this.formDef.attrs.styles
      }
      this.nameAndVal.forEach(el => {
        _data = this.initByName(_data, el.name, el.value)
      })
      if (this.formDef && this.formDef.attrs) {
        this.$set(this.formDef.attrs, 'styles', _data)
      }
    },
    initByName(data, name, val) { // 通过指定属性进行初始化，val为默认初始值，如果已存在数据，则不需要赋值为默认值
      const _temp = JSON.parse(JSON.stringify(val))
      if (this.$utils.isEmpty(data)) {
        const temp = {}
        temp[name] = _temp
        return temp
      }
      if (this.$utils.isEmpty(data[name])) {
        data[name] = _temp
      }
      return data
    },
    isBold(name) { // 通过name判断是否有加粗
      if (!this.$utils.isEmpty(this.formDef.attrs.styles) &&
        !this.$utils.isEmpty(this.formDef.attrs.styles[name]) &&
        this.formDef.attrs.styles[name]) {
        return true
      }
      return false
    },
    toggle(name) { // 通过name修改指定的数据
      if (this.$utils.isEmpty(this.formDef.attrs.styles)) {
        const temp = {}
        temp[name] = true
        this.$set(this.formDef.attrs, 'styles', temp)
      } else if (this.$utils.isEmpty(this.formDef.attrs.styles[name])) {
        this.$set(this.formDef.attrs.styles, name, true)
      } else {
        this.formDef.attrs.styles[name] = !this.formDef.attrs.styles[name]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.global-style{
  .text-bold{
    height: 26px;
    text-align: center;
    border: 1px solid #dfdfdf;
    border-radius: 2px;
  }
  .text-bold_active{
    background: #999999;
    color: #fff;
    border-color: #999999;
  }
  .color-select{
    height: 28px;
  }
  .mg-up_down{
    margin-top: 1px;
    margin-bottom: 1px;
  }
}
</style>
