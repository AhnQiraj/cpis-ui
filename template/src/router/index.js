const defaults = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: () => import('@/views/home.vue') },
]
export default [...defaults]
