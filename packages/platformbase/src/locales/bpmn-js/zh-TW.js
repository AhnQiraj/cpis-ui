export default {
  // Labels
  'Append {type}': '添加{type}',
  'Add Lane above': '在上方添加泳道',
  'Divide into two Lanes': '拆分為二泳道',
  'Divide into three Lanes': '拆分為三泳道',
  'Add Lane below': '在下方添加泳道',
  'Append compensation activity': '添加活動',
  'Change type': '改變類型',
  'Connect using Association': '連接使用',
  'Connect using Sequence/MessageFlow or Association': '連接',
  'Connect using DataInputAssociation': '連接',
  'TextAnnotation': '描述',
  'Remove': '刪除',
  'Activate the hand tool': '抓手工具(H)',
  'Activate the lasso tool': '套索工具(L)',
  'Activate the create/remove space tool': '坐標工具(S)',
  'Activate the global connect tool': '連接工具(C)',
  'Create IntermediateThrowEvent/BoundaryEvent': '創建異常/邊界事件',
  'Create expanded SubProcess': '創建內嵌子流程',
  'Create Pool/Participant': '創建泳道',
  'Parallel Multi Instance': '並行多實例',
  'Sequential Multi Instance': '串行多實例',
  'Loop': '迴轉',
  'Ad-hoc': '點對點',
  'Create {type}': '創建{type}',
  'Task': '任務',
  'Send Task': '發送消息任務',
  'SendTask': '發送消息任務',
  'Receive Task': '消息任務',
  'ReceiveTask': '消息任務', // '接收消息任務',
  'User Task': '用戶任務',
  'UserTask': '用戶任務',
  'Manual Task': '手動任務',
  'ManualTask​​': '手動任務',
  'Business Rule Task': '業務規則任務',
  'BusinessRuleTask': '業務規則任務',
  'Service Task': '服務任務',
  'ServiceTask': '服務任務',
  'Script Task': '腳本任務',
  'ScriptTask': '腳本任務',
  'CallActivity': '外部子流程',
  'Call Activity': '外部子流程',
  'Sub Process (collapsed)': '內嵌子流程',
  'Sub Process (expanded)': '內嵌子流程',
  'Process': '流程定義',
  'Start Event': '開始',
  'StartEvent': '開始',
  'Intermediate Throw Event': '異常事件',
  'IntermediateThrowEvent': '異常事件',
  'End Event': '結束',
  'EndEvent': '結束',
  'Message Start Event': '消息開始',
  'Timer Start Event': '定時器啟動',
  'Conditional Start Event': '條件開始',
  'Signal Start Event': '開始信號',
  'Error Start Event': '錯誤開始',
  'Escalation Start Event': '升級開始',
  'Compensation Start Event': '補償啟動',
  'Message Start Event (non-interrupting)': '消息啟動（不中斷）',
  'Timer Start Event (non-interrupting)': '消息開始（不中斷）',
  'Conditional Start Event (non-interrupting)': '條件開始（不中斷）',
  'Signal Start Event (non-interrupting)': '開始信號（不中斷）',
  'Escalation Start Event (non-interrupting)': '升級開始（不中斷）',
  'Message Intermediate Catch Event': '消息中捕獲事件',
  'Message Intermediate Throw Event': '消息中拋出事件',
  'Timer Intermediate Catch Event': '定時器中捕獲事件',
  'Escalation Intermediate Throw Event': '升級中拋出事件',
  'Conditional Intermediate Catch Event': '條件中捕獲事件',
  'Link Intermediate Catch Event': '鏈接中捕獲事件',
  'Link Intermediate Throw Event': '鏈接中拋出事件',
  'Compensation Intermediate Throw Event': '信號中捕獲事件',
  'Signal Intermediate Catch Event': '信號中捕獲事件',
  'Signal Intermediate Throw Event': '信號中投擲事件',
  'Message End Event': '消息結束',
  'Escalation End Event': '升級結束',
  'Error End Event': '錯誤結束',
  'Cancel End Event': '取消結束',
  'Compensation End Event': '補償結束',
  'Signal End Event': '信號結束',
  'Terminate End Event': '終止結束',
  'Message Boundary Event': '消息邊界',
  'Message Boundary Event (non-interrupting)': '消息邊界（不中斷）',
  'Timer Boundary Event': '定時器邊界',
  'Timer Boundary Event (non-interrupting)': '定時器邊界（不中斷）',
  'Escalation Boundary Event': '升級邊界',
  'Escalation Boundary Event (non-interrupting)': '升級邊界（不中斷）',
  'Conditional Boundary Event': '有條件的邊界',
  'Conditional Boundary Event (non-interrupting)': '有條件的邊界（不中斷）',
  'Error Boundary Event': '錯誤邊界',
  'Cancel Boundary Event': '取消邊界',
  'Signal Boundary Event': '信號邊界',
  'Signal Boundary Event (non-interrupting)': '信號邊界（不中斷）',
  'Compensation Boundary Event': '補償邊界（不中斷）',
  'Exclusive Gateway': '分支網關',
  'ExclusiveGateway': '分支網關',
  'Parallel Gateway': '同步網關',
  'ParallelGateway': '同步網關',
  'Inclusive Gateway': '條件同步網關',
  'InclusiveGateway': '條件同步網關',
  'Complex Gateway': '複雜網關',
  'Event based Gateway': '基於事件網關',
  'Transaction': '事務',
  'Sub Process': '子流程',
  'Event Sub Process': '事件子流程',
  'Collapsed Pool': '泳道（不帶標題欄）',
  'Expanded Pool': '泳道（帶標題欄）',
  // Errors
  'no parent for {element} in {parent}': '{parent}中的{element}沒有父類',
  'no shape type specified': '沒有指定形狀類型',
  'flow elements must be children of pools/participants': '流動元素必須是泳道/參與者的子類',
  'out of bounds release': '釋放外邊界',
  'more than {count} child lanes': '超過 {count} 子通道',
  'element required': '必填',
  'diagram not part of bpmn:Definitions': '流程圖不屬於BPMN定義',
  'no diagram to display': '不能顯示流程圖',
  'no process or collaboration to display': '沒有流程可顯示',
  'element {element} referenced by {referenced}#{property} not yet drawn': '元素{element}被{referenced}#{property}引用，但沒有被繪製',
  'already rendered {element}': '已渲染元素{element}',
  'failed to import {element}': '未能導入{element}',
  // properties-panel
  'General': '屬性',
  'Id': '業務主鍵',
  'Name': '名稱',
  'Details': '明細',
  'CallActivity Type': '外部子流程類型',
  'Called Element': '外部子流程',
  'Select': '選擇',
  'Element must have an unique id.': '必須具有唯一的業務主鍵。 ',
  'Must provide a value': '必填',
  'Open minimap': '打開小地圖',
  'Close minimap': '關閉小地圖',
  'Colorize': '顏色',
  'None': '無樣式',
  'Blue': '藍',
  'Orange': '橙',
  'Green': '綠',
  'Red': '紅',
  'Purple': '紫'
}
