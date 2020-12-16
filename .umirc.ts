import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history: {
    type: 'hash',
  },
  hash: true,
  routes: [
    { path: '/', redirect: '/toy/worktime' },
    { path: '/toy', redirect: '/toy/worktime' },
    {
      path: '/toy',
      component: '@/pages/index',
      routes: [{ path: '/toy/worktime', component: '@/pages/worktime/index' }],
    },
    {
      path: '/useful',
      component: '@/pages/index',
      routes: [
        { path: '/useful', redirect: '/useful/varificationCode' },
        { path: '/useful/varificationCode', component: '@/pages/varificationCode/index' },
      ],
    },
  ],
});
