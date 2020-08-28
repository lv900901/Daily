// umi routes: https://umijs.org/docs/routing
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/daily',
    name: 'daily',
    icon: 'smile',
    component: './Daily',
    routes: [
      {
        path: '/daily/20200824',
        name: 'fontShow',
        component: './200824CanvasFont/async'
      },
      {
        path: '/daily/20200828',
        name: 'ellipsisText',
        component: './200828EllipsisText'
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './ListTableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
]