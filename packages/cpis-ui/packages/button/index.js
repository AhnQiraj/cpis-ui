import CpisButton from './src/button.vue';

/* istanbul ignore next */
CpisButton.install = function(Vue) {
  Vue.component(CpisButton.name, CpisButton);
};

export default CpisButton;