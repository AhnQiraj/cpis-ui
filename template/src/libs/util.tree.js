/**
 * 树形化列表数据
 *
 * @param {Array} list 元素列表
 * @param {Object} props 树关系属性
 * @author 管超
 */
export function treeify(list, props) {
  const { parentId } = props;
  const root = props.root ? props.root : null;
  // 找出所有根节点
  const roots = list
    .filter(i => i[parentId] === root)
    .map(i => ({ ...i }));
  // 从根节点开始，逐层查找子节点
  roots.forEach(i => {
    findChildren(i, list, props);
  });
  return roots;
}
/**
 * 迭代查找并追加子节点
 *
 * @param {Object} parent 父级节点
 * @param {Array} list 元素列表
 * @param {Object} props 树关系属性
 * @author 管超
 */
function findChildren(parent, list, props) {
  const { id, parentId, children } = props;
  // 查找当前节点的子节点
  parent[children] = list
    .filter(i => i[parentId] === parent[id])
    .map(i => ({ ...i }));
  // 迭代当前节点的子节点并重复查找子节点操作
  parent[children].forEach(i => {
    findChildren(i, list, props);
  });
}
/**
 * 查找树节点
 *
 * @param {Array} trees - 树列表
 * @param {Function} predicate - 条件过滤器
 * @param {string} children - 子节点属性名称
 */
export function findNode(trees, predicate, children = 'children') {
  let queue = [];
  let node = null;
  queue = queue.concat(trees);
  while (queue.length) {
    const item = queue.shift();
    if (predicate(item)) {
      node = item;
      break;
    }
    if (item[children]) {
      queue = queue.concat(item[children]);
    }
  }
  return node;
}
