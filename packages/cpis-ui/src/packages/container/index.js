import CpisContainer from './src/container.vue';

/* istanbul ignore next */
CpisContainer.install = function(Vue) {
  Vue.component(CpisContainer.name, CpisContainer);
};

export default CpisContainer;