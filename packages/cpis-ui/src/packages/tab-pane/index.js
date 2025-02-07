import CpisTabPane from '../tabs/src/tab-pane.vue';

/* istanbul ignore next */
CpisTabPane.install = function(Vue) {
  Vue.component(CpisTabPane.name, CpisTabPane);
};

export default CpisTabPane;
