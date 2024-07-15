<!--扩展的选择器-->
<!--iKey是绑定主键-->
<template>
  <el-select
    v-model="innerKey"
    :disabled="disabled"
    :multiple="limit>1"
    :multiple-limit="limit"
    :collapse-tags="collapseTags"
    :filter-method="initShowList"
    :placeholder="$t('baseCommon.message.pleaseSelect', { title: '' })"
    filterable
    :clearable="clearable"
    @change="changeSelected">
    <!--展示的项-->
    <el-option v-for="item in showList" :key="item[iKey]" :label="item[iLabels[0]]" :value="item[iKey]" :disabled="item.disabled">
      <span>{{ getLabel(item) }}</span>
    </el-option>
    <!--隐藏的项 -->
    <el-option v-for="item in hideList" v-show="false" :key="item[iKey]" :label="item[iLabels[0]]" :value="item[iKey]" :disabled="item.disabled">
      <span>{{ getLabel(item) }}</span>
    </el-option>
  </el-select>
</template>
<script>
export default {
	/**
	 * 双向绑定入口:
	 * todombb 但好像不太符合官方的语法,最好同步.
	 * 官方的使用方式是:
	 * v-model 等价于 :value+@input
	 * 所以prop的值应该为value而不是keys,事件应该是input而不是innerChange
	 * 使用官方的推荐方式,可以免去model:{}对象的额外维护工作.
	 * 官方文档连接如下,可以对照修改
	 * https://cn.vuejs.org/v2/guide/components.html#%E5%9C%A8%E7%BB%84%E4%BB%B6%E4%B8%8A%E4%BD%BF%E7%94%A8-v-model
	 * https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model
	 * @author mbb
	 */
  name: 'CpSelect',
	model: {
		prop: "keys",
		event: "innerChange",
	},
	props: {
        splitFlag: {
          type: String,
          default: ":",
        },
		// 业务主键:双向绑定
		keys: String,
		// 业务数据:即主键对应的展示值
		values: [String, Array],
		// 业务主键的属性名
		iKey: {
			type: String,
			default: "id",
		},
		// 列表展示值
		iLabels: {
			type: Array,
			default: () => {
				return ["name"]
			},
		},
		// 数据源
		dataList: {
			type: Array,
			default: () => {
				return []
			},
		},
		// 可选数量
		limit: {
			type: Number,
			default: 1,
		},
		// 禁止的业务主键
		disabledOptions: [String, Array],
		// 是否禁用
		disabled: {
			type: Boolean,
			default: false,
		},
		// 开启缩写
		collapseTags: {
			type: Boolean,
			default: false,
		},
        clearable: {
          type: Boolean,
          default: true,
        },
        isShowAll: {
          type: Boolean,
          default: false,
        },
		// 选项丢失时的默认展示值
		missShow: {
			type: String,
			default() {
        return this.$t('baseCommon.component.optionMiss')
      }
		},
	},
	data() {
		return {
			showList: [],// 展示的列表
			hideList: [],// 隐藏的项(用于处理回显时,数据不存在数据源中,无法正常显示.补充此隐藏项后,即可正常显示,但需要在更改变动时,移除)
			innerKey: [],// 选中的业务主键(不直接绑定的业务主键,是因为Select组件不支持逗号分隔的字符串)
			innerDataList: [],// 数据源(内部拷贝的,不直接使用数据源,是因为有禁用设置,会污染源数据)
		}
	},
	watch: {
		keys: {
			immediate: true,
			handler: function(keys) {
				if (this.limit === 1) {
					this.innerKey = keys
				} else {
					this.innerKey = keys ? keys.split(",") : []
				}
				// 初始化展示列表
				this.initShowList("")
				// 补充隐藏数据
				this.createHideList()
			},
		},
		dataList: {
			immediate: true,
			deep: true,
			handler: function(datalist) {
				// 深拷贝数据源
				this.innerDataList = JSON.parse(JSON.stringify(datalist))
				// 设置禁用项
				this.setDisabled()
				// 初始化展示列表
				this.initShowList("")
				// 补充隐藏数据
				this.createHideList()
			},
		},
		disabledOptions: {
			immediate: true,
			deep: true,
			handler: function() {
				// 设置禁用项
				this.setDisabled()
			},
		},
	},
	methods: {
		/**
		 * 为不存在的业务主键,创建隐藏数据
		 * 		以[{ikey:业务主键,ivalue:业务数据}]
		 * @author mbb
		 */
		createHideList() {
			this.hideList = []
			let tempList = []
			// 单选
			if (this.limit === 1) {
				if (this.innerKey) {
					let hasOne = this.innerDataList.some(data => this.innerKey === data[this.iKey])
					if (!hasOne) {
						let obj = {}
						obj[this.iKey] = this.innerKey
						obj[this.iLabels[0]] = this.values ? this.values : this.missShow
						tempList.push(obj)
					}
				}
			}
			// 多选
			else {
				let values = []
				if (typeof this.values === "string") {
					values = this.values.split(",") || []
				} else {
					values = this.values || []
				}
				this.innerKey.forEach((key, index) => {
					let hasOne = this.innerDataList.some(data => key === data[this.iKey])
					if (!hasOne) {
						let obj = {}
						obj[this.iKey] = key
						obj[this.iLabels[0]] = this.innerKey.length === values.length ? values[index] : this.missShow
						tempList.push(obj)
					}
				})
			}
			this.hideList.push(...tempList)
		},
		/**
		 * 数据改变:
		 * 先内部变化,再通知外部,
		 * 否则:外部先处理,内部后处理,内部会冲刷掉外部的优先级
		 * @author mbb
		 */
		changeSelected() {
			// 单选
			if (this.limit === 1) {
				this.radioChange()
			}
			// 多选
			else {
				this.multiChange()
			}
		},
		/**
		 * 单选改变
		 * @author mbb
		 */
		radioChange() {
			// 获取所选值
			let selected = this.innerDataList.find(data => this.innerKey === data[this.iKey]) || {}
			// 内部通知,双向绑定
			this.$emit("innerChange", selected[this.iKey])
			// 外部通知,交付实体
			setTimeout(() => {
				this.$emit("change", selected)
			}, 100)
		},
		/**
		 * 多选改变
		 * @author mbb
		 */
		multiChange() {
			// 获取所选值
			let selectedArr = []
			this.innerKey.forEach(key => {
				let one = this.innerDataList.find(data => key === data[this.iKey])
				if (one) {
					selectedArr.push(one)
				}
			})
			// 内部通知,双向绑定
			this.$emit("innerChange", selectedArr.map(one => one[this.iKey]).join(","))
			// 外部通知,交付实体
			setTimeout(() => {
				this.$emit("change", selectedArr)
			}, 100)
		},
		/**
		 * 设置禁用项
		 * @author mbb
		 */
		setDisabled() {
			// 禁用的索引
			let disabledOptionArr = []
			if (typeof this.disabledOptions === "string") {
				let arr = this.disabledOptions.split(",")
				disabledOptionArr.push(...arr)
			} else if (typeof this.disabledOptions === "object" && this.disabledOptions instanceof Array) {
				disabledOptionArr.push(...this.disabledOptions)
			}
			// 设置禁用标识符
			this.innerDataList.forEach(data => {
				data.disabled = disabledOptionArr.includes(data[this.iKey])
			})
		},
		/**
		 * 初始化展示列表
		 * @author mbb
		 */
		initShowList(searchStr) {
			let showList = []// 要展示的列表
			let selectedArr = []// 已经选择的
			let unSelectedArr = []// 未选择的
			if (this.limit === 1) {
				selectedArr = this.innerDataList.filter(data => this.innerKey === data[this.iKey])
				unSelectedArr = this.innerDataList.filter(data => this.innerKey !== data[this.iKey])
			} else {
				selectedArr = this.innerDataList.filter(data => this.innerKey.includes(data[this.iKey]))
				unSelectedArr = this.innerDataList.filter(data => !this.innerKey.includes(data[this.iKey]))
			}
			// 1.放入已选择
			showList.push(...selectedArr)
			// 2.如果没有搜索,填充到不少于10条
            if (searchStr.length === 0) {
              if (this.isShowAll) {
                showList.push(...unSelectedArr)
              } else {
                if (showList.length < 50) {// 不足10条,从未选中,拿取补足
                  showList.push(...unSelectedArr)
                  showList = showList.slice(0, 50)
                }
              }
            }
			// 3.如果搜索了,放入搜索结果
			else {
				let searchResult = unSelectedArr.filter(item => {
					for (let index in this.iLabels) {
						if (item[this.iLabels[index]].indexOf(searchStr) >= 0) {
							return true
						}
					}
					return false
				})
				showList.push(...searchResult)
			}
			this.showList = showList
		},
		/**
		 * 获取列表展示样式
		 * @author mbb
		 */
		getLabel(item) {
			let showLabel = []
			this.iLabels.forEach(label => {
				showLabel.push(item[label])
			})
			return showLabel.join(this.splitFlag)
		},
	},
}
</script>
