import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', redirect: '/toy/worktime' },
    { path: '/toy', redirect: '/toy/worktime' },
    {
      path: '/toy', component: '@/pages/index',
      routes: [
        { path: '/toy/worktime', component: '@/pages/worktime/index' },
      ]

    },
  ],
});
