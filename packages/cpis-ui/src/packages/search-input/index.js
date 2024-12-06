import CpisSearchInput from './src/search-input.vue';

/* istanbul ignore next */
CpisSearchInput.install = function(Vue) {
  Vue.component(CpisSearchInput.name, CpisTag);
};

export default CpisSearchInput;