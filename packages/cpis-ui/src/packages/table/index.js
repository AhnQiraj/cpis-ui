import CpisTable from './src/table.vue';

/* istanbul ignore next */
CpisTable.install = function(Vue) {
  Vue.component(CpisTable.name, CpisTable);
};

export default CpisTable;