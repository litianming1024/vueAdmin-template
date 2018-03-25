import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  },
  {
    path: '/recruitment',
    component: Layout,
    redirect: 'noredirect',
    name: 'recruitment',
    children: [
      {
        path: 'recruitment',
        // name: 'recruitment',
        component: _import('recruitment/recruitment'),
        meta: { title: '职位管理' }
      }
    ]
  },
  {
    path: '/resume',
    component: Layout,
    redirect: 'noredirect',
    // name: 'resume',
    children: [
      {
        path: 'resume',
        name: 'resume',
        component: _import('resume/resume'),
        meta: { title: '简历管理' }
      }
    ]
  },
  {
    path: '/apply',
    component: Layout,
    redirect: 'noredirect',
    name: 'apply',
    children: [
      {
        path: 'apply',
        name: 'apply',
        component: _import('apply/apply'),
        meta: { title: '投递记录管理' }
      }
    ]
  },
  {
    path: '/filter',
    component: Layout,
    redirect: 'noredirect',
    name: 'filter',
    children: [
      {
        path: 'filter',
        name: 'filter',
        component: _import('filter/filter'),
        meta: { title: '简历筛选' }
      }
    ]
  },
  {
    path: '/weixin',
    component: Layout,
    redirect: 'noredirect',
    name: 'weixin',
    meta: {
      title: '微信管理',
      icon: 'form'
    },
    children: [
      {
        path: 'menu',
        name: 'menu',
        component: _import('weixin/menu'),
        meta: { title: '菜单管理' }
      },
      {
        path: 'qrcode',
        name: 'qrcode',
        component: _import('weixin/QRcode'),
        meta: { title: '二维码管理' }
      }
    ]
  },
  {
    path: '/appointment',
    component: Layout,
    redirect: 'noredirect',
    name: 'appointment',
    meta: {
      title: '面试管理',
      icon: 'lock'
    },
    children: [
      // {
      //   path: 'index',
      //   name: 'index',
      //   component: _import('system/index'),
      //   meta: { title: 'Form' }
      // },
      {
        path: 'schedule',
        name: 'schedule',
        component: _import('schedule/schedule'),
        meta: { title: '面试安排' }
      },
      {
        path: 'firstAppointment',
        name: 'firstAppointment',
        component: _import('appointment/firstAppointment'),
        meta: { title: '初试管理' }
      },
      {
        path: 'retestAppointment',
        name: 'retestAppointment',
        component: _import('appointment/retestAppointment'),
        meta: { title: '复试管理' }
      },
      {
        path: 'HRAppointment',
        name: 'HRAppointment',
        component: _import('appointment/HRAppointment'),
        meta: { title: 'HR面试管理' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: 'noredirect',
    name: 'system',
    meta: {
      title: '系统设置',
      icon: 'form'
    },
    children: [
      // {
      //   path: 'index',
      //   name: 'index',
      //   component: _import('system/index'),
      //   meta: { title: 'Form' }
      // },
      {
        path: 'user',
        name: 'user',
        component: _import('system/user'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role',
        name: 'role',
        component: _import('system/role'),
        meta: { title: '角色管理' }
      },
      {
        path: 'permission',
        name: 'permission',
        component: _import('system/permission'),
        meta: { title: '权限管理' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

