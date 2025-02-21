/**
 * # Icon 图标
 *
 * CPIS Design 提供了一套常用的图标集合。
 *
 * ## 使用方法
 *
 * ### 基础用法
 * ```html
 * <i class="cpis-icon-aq01"></i>
 * // 同时可以调整图标的大小
 * <i class="cpis-icon-aq01 text-2xl"></i>
 * // 也可以调整颜色
 * <i class="cpis-icon-aq01 text-blue-500"></i>
 * ```

 *
 * ## 注意事项
 *
 * 1. 图标均以 `cpis-icon-` 为前缀
 * 2. 图标支持所有 CSS 属性的自定义样式
 */

/**
 */
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: '原子组件/Icon',
  tags: ['autodocs']
}

export const IconDisplay = {
  parameters: {
    layout: 'centered'
  },
  render: () => ({
    template: `
      <div class="icon-container">
        <div v-for="(group, groupName) in iconGroups" :key="groupName" class="icon-group">
          <h3 class="group-title">{{ groupName }}</h3>
          <div class="icon-grid">
            <div v-for="icon in group" :key="icon" class="icon-item">
              <i :class="icon" class="icon"></i>
              <span class="icon-name">{{ icon }}</span>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        iconGroups: {
          MR: ['cpis-icon-mr01'],
          SB: [
            'cpis-icon-sb01',
            'cpis-icon-sb02',
            'cpis-icon-sb03',
            'cpis-icon-sb04',
            'cpis-icon-sb05',
            'cpis-icon-sb06'
          ],
          YX: [
            'cpis-icon-yx01',
            'cpis-icon-yx02',
            'cpis-icon-yx03',
            'cpis-icon-yx04',
            'cpis-icon-yx05',
            'cpis-icon-yx06'
          ],
          JX: ['cpis-icon-jx01', 'cpis-icon-jx02', 'cpis-icon-jx03', 'cpis-icon-jx04'],
          LP: ['cpis-icon-lp01', 'cpis-icon-lp02', 'cpis-icon-lp03', 'cpis-icon-lp04'],
          AQ: [
            'cpis-icon-aq01',
            'cpis-icon-aq02',
            'cpis-icon-aq03',
            'cpis-icon-aq04',
            'cpis-icon-aq05',
            'cpis-icon-aq06',
            'cpis-icon-aq07',
            'cpis-icon-aq08',
            'cpis-icon-aq09',
            'cpis-icon-aq10',
            'cpis-icon-aq11',
            'cpis-icon-aq12',
            'cpis-icon-aq13',
            'cpis-icon-aq14',
            'cpis-icon-aq15',
            'cpis-icon-aq16',
            'cpis-icon-aq17',
            'cpis-icon-aq18',
            'cpis-icon-aq19',
            'cpis-icon-aq20',
            'cpis-icon-aq21',
            'cpis-icon-aq22'
          ],
          IOT: [
            'cpis-icon-iot01',
            'cpis-icon-iot02',
            'cpis-icon-iot03',
            'cpis-icon-iot04',
            'cpis-icon-iot05',
            'cpis-icon-iot06',
            'cpis-icon-iot07',
            'cpis-icon-iot08'
          ]
          // 可以继续添加其他系列...
        }
      }
    }
  }),
  styles: `
    <style>
      .icon-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
      }
      
      .icon-group {
        margin-bottom: 32px;
      }

      .group-title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 16px;
        color: #333;
        border-bottom: 2px solid #eaeaea;
        padding-bottom: 8px;
      }
      
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
        padding: 8px;
      }
      
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 16px 8px;
        border: 1px solid #eaeaea;
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
        min-height: 100px;
      }
      
      .icon-item:hover {
        background-color: #f5f7fa;
        transform: translateY(-2px);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
      
      .icon {
        font-size: 32px;
        margin-bottom: 12px;
        color: #409EFF;
      }
      
      .icon-name {
        font-size: 13px;
        color: #606266;
        text-align: center;
        word-break: break-all;
        padding: 0 4px;
      }
    </style>
  `
}
