import { treeify } from '../util.tree';
// const tree = [
//   {
//     id: 1,
//     label: '一级 1',
//     value: '1',
//     children: [{
//       id: 11,
//       label: '二级 1-1',
//       value: '1-1',
//       children: [{
//         id: 111,
//         label: '三级 1-1',
//         value: '1-1-1'
//       }]
//     }]
//   },
//   {
//     id: 2,
//     label: '一级 2',
//     value: '2',
//     children: [{
//       id: 21,
//       label: '二级 2-1',
//       value: '2-1'
//     }, {
//       id: 22,
//       label: '二级 2-2',
//       value: '2-2'
//     }]
//   },
//   {
//     id: 3,
//     label: '一级 3',
//     value: '3',
//     children: [{
//       id: 31,
//       label: '二级 3-1',
//       value: '3-1'
//     }, {
//       id: 32,
//       label: '二级 3-2',
//       value: '3-2'
//     }]
//   }
// ];
const list = [
  {
    id: 1,
    label: '一级 1',
    value: '1',
    parentId: null
  },
  {
    id: 11,
    label: '二级 1-1',
    value: '1-1',
    parentId: 1
  },
  {
    id: 111,
    label: '三级 1-1',
    value: '1-1-1',
    parentId: 11
  },
  {
    id: 2,
    label: '一级 2',
    value: '2',
    parentId: null
  },
  {
    id: 21,
    label: '二级 2-1',
    value: '2-1',
    parentId: 2
  },
  {
    id: 22,
    label: '二级 2-2',
    value: '2-2',
    parentId: 2
  },
  {
    id: 3,
    label: '一级 3',
    value: '3',
    parentId: null
  },
  {
    id: 31,
    label: '二级 3-1',
    value: '3-1',
    parentId: 3
  },
  {
    id: 32,
    label: '二级 3-2',
    value: '3-2',
    parentId: 3
  }
];
describe('util.tree', () => {
  it('treeify', () => {
    expect(treeify(list, { id: 'id', parentId: 'parentId', children: 'children' })).toMatchSnapshot();
  });
});
