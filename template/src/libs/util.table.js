import moment from 'moment';
/**
 * 表格组件默认选项
 *
 * @author 管超
 */
export const options = {
  /**
   * 表格的尺寸
   */
  size: 'small',
  /**
   * 是否带有纵向边框
   */
  border: true
};
/**
 * 表格索引列默认选项
 *
 * @author 管超
 */
export const indexRow = {
  /**
   * 标题
   */
  title: '序号',
  /**
   * 宽度
   */
  width: '60px',
  /**
   * 是否固定
   */
  fixed: 'left'
};
/**
 * 表格分页默认选项
 *
 * @author 管超
 */
export const pagination = {
  /**
   * 当前页数
   */
  currentPage: 1,
  /**
   * 总条目数
   */
  total: 0,
  /**
   * 每页显示条目个数
   */
  pageSize: 10,
  /**
   * 每页显示个数选择器的选项设置
   */
  pageSizes: [10, 20, 30, 40, 50, 100],
  /**
   * 组件布局，子组件名用逗号分隔
   */
  layout: 'total, ->, prev, pager, next, sizes, jumper'
};
/**
 * 表格单元格格式化器
 *
 * @param {Object} context - 环境上下文
 * @param {Object} row - 表格行
 * @param {Object} column - 表格列
 * @param {any} cellValue - 值
 * @param {number} index - 索引号
 * @author 管超
 */
export function cellFormatter(context, row, column, cellValue, index) {
  const { page, dict } = context;
  const { property } = column;
  const defaultValue = context.defaultValue ? context.defaultValue : '--';
  let ret = null;
  if (!cellValue) {
    return defaultValue;
  }
  if (page === 'chder-config-equipment-property') {
    switch (property) {
      case 'unit':
        ret = dict.unit[cellValue];
        break;
      case 'state':
        ret = dict.state[cellValue];
        break;
      case 'dataTypeCode':
        ret = dict.equipmentPropertyType[cellValue];
        break;
      default:
        break;
    }
  } else if (page === 'chder-config-equipment' || page === 'plant-config-equipment') {
    switch (property) {
      case 'state':
        ret = dict.state[cellValue];
        break;
      case 'nodeType':
        ret = dict.equipmentNodeType[cellValue];
        break;
      case 'deviceTypeId':
        ret = dict.equipmentProto[cellValue];
        break;
      default:
        break;
    }
  } else if (page === 'chder-supervision-overhaul-plan-comment') {
    switch (property) {
      case 'planStartTime':
        ret = moment(cellValue).format('YYYY-MM-DD');
        break;
      case 'planEndTime':
        ret = moment(cellValue).format('YYYY-MM-DD');
        break;
      case 'suggestionState':
        ret = dict.suggestionState[cellValue];
        break;
      case 'specialtyCode':
        ret = dict.specialty[cellValue];
        break;
      case 'checkLevel':
        ret = dict.checkLevel[cellValue];
        break;
      default:
        break;
    }
  } else if (page === 'chder-supervision-overhaul-execute-comment') {
    switch (property) {
      case 'areaName':
        ret = `${row.areaName}/${row.stationName}`;
        break;
      case 'planStartTime':
        ret = `${moment(row.planStartTime).format('YYYY-MM-DD')} ~ ${moment(row.planEndTime).format('YYYY-MM-DD')}`;
        break;
      case 'suggestionState':
        ret = dict.suggestionState[cellValue];
        break;
      case 'specialtyCode':
        ret = dict.specialty[cellValue];
        break;
      case 'checkLevel':
        ret = dict.checkLevel[cellValue];
        break;
      default:
        break;
    }
  }
  return ret || defaultValue;
}
