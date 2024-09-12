import CpisTag from './src/tag.jsx';

/* istanbul ignore next */
CpisTag.install = function(Vue) {
  Vue.component(CpisTag.name, CpisTag);
};

export default CpisTag;