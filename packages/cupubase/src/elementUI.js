import {Transfer,Header,Footer,Timeline,Collapse,Carousel,Steps,Step,Rate,Badge ,Progress,Icon,Slider,Tabs,Popover,Autocomplete,Link, Cascader, Card, Upload, Alert, Tree, Dropdown, Pagination, Button, Select, Switch, Menu, MenuItem, Submenu, Aside, Container, Main, Tooltip, Form, FormItem, Input, Divider, Table, TableColumn, DatePicker, Checkbox, CheckboxButton, CheckboxGroup, TimePicker, Radio, RadioButton, RadioGroup, Option, OptionGroup, Col, Row, Dialog, MessageBox, Message } from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Dialog)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(OptionGroup)
    Vue.use(Option)
    Vue.use(RadioGroup)
    Vue.use(RadioButton)
    Vue.use(Radio)
    Vue.use(TimePicker)
    Vue.use(CheckboxGroup)
    Vue.use(CheckboxButton)
    Vue.use(Checkbox)
    Vue.use(Button)
    Vue.use(Switch)
    Vue.use(Select)
    Vue.use(Menu)
    Vue.use(MenuItem)
    Vue.use(Submenu)
    Vue.use(Container)
    Vue.use(Aside)
    Vue.use(Main)
    Vue.use(Tooltip)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Input)
    Vue.use(Divider)
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(DatePicker)
    Vue.use(Pagination)
    Vue.use(Dropdown)
    Vue.use(Tree)
    Vue.use(Alert)
    Vue.use(Upload)
    Vue.use(Card)
    Vue.use(Cascader)
    Vue.use(Link)
    Vue.use(Pagination)
    Vue.use(Autocomplete)
    Vue.use(Popover)
    Vue.use(Tabs)
    Vue.use(Slider)
    Vue.use(Icon)
    Vue.use(Progress)
    Vue.use(Badge)
    Vue.use(Rate)
    Vue.use(Steps)
    Vue.use(Step)
    Vue.use(Carousel)
    Vue.use(Collapse)
    Vue.use(Transfer)
    Vue.use(Header)
    Vue.use(Footer)
    Vue.use(Timeline)
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$message = Message
  }
}
export default element
