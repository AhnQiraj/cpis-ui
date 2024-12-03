import CpisPageContainer from './src/page-container.vue';

/* istanbul ignore next */
CpisPageContainer.install = function(Vue) {
  Vue.component(CpisPageContainer.name, CpisPageContainer);
};

export default CpisPageContainer;