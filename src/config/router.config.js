// eslint-disable-next-line
import {
  UserLayout,
  BasicLayout,
  RouteView,
  BlankLayout,
  PageView
} from '@/layouts'
import {
  license,resource,time_job,tag_category,tag, site_manager, tongji, monitor_soft, monitor, system, org, role, menu, user, log, bxAnaalyse, recycler,
  sysBaseData, contentMananger, contentPublish, classMananger, classExtend, configManager, modelConfig, siteConfig, fileManager, templateConfig, PageFragments, siteFile, systemConfig, codeGenerate
} from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        component: RouteView,
        meta: {
          title: '首页概览',
          keepAlive: true,
          icon: bxAnaalyse
        },
        children: [{
          path: '/dashboard/analysis',
          name: 'Analysis',
          component: () => import('@/views/dashboard/Analysis'),
          meta: {
            title: '监控中心',
            keepAlive: true,
            icon: monitor_soft
          }
        },
        // 外部链接
        {
          // path: 'https://tongji.baidu.com/web/10000113397/overview/index?siteId=14214351/',
          path: '/tongji',
          name: 'tongji',
          component: () => import('@/views/log/tongji'),
          meta: {
            title: '百度统计',
            icon: tongji,
            keepAlive: false
          }
        }
          // {
          //   path: '/dashboard/workplace',
          //   name: 'Workplace',
          //   component: () => import('@/views/dashboard/Workplace'),
          //   meta: {
          //     title: '工作台',
          //     keepAlive: true,
          //     permission: ['role:role']
          //   }
          // }
        ]
      },

      // forms
      {
        path: '/systemManager',
        redirect: '/userManager/index',
        component: PageView,
        meta: { title: '系统管理', icon: system, permission: ['system:system'] },
        children: [{
          path: '/userManager/index',
          name: 'userManager',
          component: () => import('@/views/system/user'),
          meta: { title: '用户管理', icon: user, keepAlive: true, permission: ['user:user'] }
        },
        {
          path: '/menuManager/index',
          name: 'menuManager',
          component: () => import('@/views/system/menu'),
          meta: { title: '菜单管理', icon: menu, keepAlive: true, permission: ['menu:menu'] }
        },
        {
          path: '/roleManager/index',
          name: 'roleManager',
          component: () => import('@/views/system/role'),
          meta: { title: '角色管理', icon: role, keepAlive: true, permission: ['role:role'] }
        },
        {
          path: '/orgManager/index',
          name: 'orgManager',
          component: () => import('@/views/system/org'),
          meta: { title: '组织管理', icon: org, keepAlive: true, permission: ['org:org'] }
        },
        {
          path: '/dictManager/index',
          name: 'dictManager',
          component: () => import('@/views/system/dict'),
          meta: { title: '基础数据', icon: sysBaseData, keepAlive: true, permission: ['base:base'] }
        },
        {
          path: '/logManager/index',
          name: 'logManager',
          component: () => import('@/views/log/index.vue'),
          meta: { title: '系统日志', icon: log, keepAlive: true, permission: ['log:log'] }
        },
        {
          path: '/sqlManager/index',
          name: 'sqlManager',
          component: () => import('@/views/log/sql'),
          meta: { title: 'SQL监控', icon: monitor, keepAlive: true, permission: ['sqlmonitor:sqlmonitor'] }
        },
        {
          path: '/licenseManager/index',
          name: 'licenseManager',
          component: () => import('@/views/system/license'),
          meta: { title: '授权证书', icon: license, keepAlive: true, permission: ['license:license'] }
        }
        ]
      },
      {
        path: '/contentManager',
        redirect: '/contentManager/index',
        component: PageView,
        meta: { title: '内容管理', icon: contentMananger, keepAlive: true, permission: ['content:content'] },
        children: [{
          path: '/contentManager/index',
          name: 'contentManager',
          component: () => import('@/views/content/index'),
          meta: { title: '内容发布', icon: contentPublish, keepAlive: true, permission: ['publish:publish'] }
        },
        {
          path: '/recyclerManager/index',
          name: 'recyclerManager',
          component: () => import('@/views/content/recycler'),
          meta: { title: '回收站', icon: recycler, keepAlive: true, permission: ['recycler:recycler'] }
        }
        ]
      },
      {
        path: '/categorySetManager',
        redirect: '/categoryManager/index',
        component: PageView,
        meta: { title: '分类管理', icon: classMananger, keepAlive: true, permission: ['category:category'] },
        children: [{
          path: '/categoryManager/index',
          name: 'categoryManager',
          component: () => import('@/views/category'),
          meta: { title: '分类管理', icon: classMananger, keepAlive: true, permission: ['category:page'] }
        },
        {
          path: '/categoryExtendManager/index',
          name: 'categoryExtendManager',
          component: () => import('@/views/category/extend'),
          meta: { title: '分类扩展', icon: classExtend, keepAlive: true, permission: ['category:extend'] }
        }
        ]
      },
      {
        path: '/configManager',
        redirect: '/modelManager/index',
        component: PageView,
        meta: { title: '配置管理', icon: configManager, permission: ['config:config'] },
        children: [{
          path: '/modelManager/index',
          name: 'modelManager',
          component: () => import('@/views/config/model'),
          meta: { title: '模型配置', icon: modelConfig, keepAlive: true, permission: ['model:model'] }
        },
        {
          path: '/siteManager/index',
          name: 'siteManager',
          component: () => import('@/views/config/site'),
          meta: { title: '站点配置', icon: siteConfig, keepAlive: true, permission: ['site:site'] }
        }
        ]
      },

      {
        path: '/tagsManager',
        redirect: '/tagsManager/index',
        component: PageView,
        meta: { title: '标签管理', icon: tag, permission: ['tags:manager'] },
        children: [{
          path: '/tagsManager/index',
          name: 'tagsManager',
          component: () => import('@/views/tags'),
          meta: { title: '标签配置', icon: tag, keepAlive: true, permission: ['tags:tags'] }
        },
        {
          path: '/tagsTypeManager/index',
          name: 'tagsTypeManager',
          component: () => import('@/views/tags/type'),
          meta: { title: '标签分类', icon: tag_category, keepAlive: true, permission: ['tags:type'] }
        }
        ]
      },

      {
        path: '/filesManager',
        redirect: '/tempManager/index',
        component: PageView,
        meta: { title: '文件管理', icon: fileManager, permission: ['file:file'] },
        children: [{
          path: '/tempManager/index',
          name: 'tempManager',
          component: () => import('@/views/webfile/template'),
          meta: { title: '模板配置', icon: templateConfig, keepAlive: true, permission: ['template:template'] }
        },
        {
          path: '/fileFragmentManager/index',
          name: 'fileFragmentManager',
          component: () => import('@/views/webfile/fragment'),
          meta: { title: '页面片段', icon: PageFragments, keepAlive: true, permission: ['page:page'] }
        },
        {
          path: '/webSiteFile/index',
          name: 'webSiteFile',
          component: () => import('@/views/config/domain'),
          meta: { title: '站点文件', icon: siteFile, keepAlive: true, permission: ['siteFile:siteFile'] }
        },
        {
          path: '/webSiteResource/index',
          name: 'webSiteResource',
          component: () => import('@/views/config/resource'),
          meta: { title: '资源管理', icon: resource, keepAlive: true, permission: ['resource:resource'] }
        }
        ]
      },
      {
        path: '/system/config',
        redirect: '/online/index',
        component: PageView,
        meta: { title: '系统配置', icon: systemConfig, keepAlive: true, permission: ['systemConfig:systemConfig'] },
        children: [
          {
            path: '/online/index',
            name: 'online',
            component: () => import('@/views/online/index'),
            meta: { title: '代码生成', icon: codeGenerate, keepAlive: true, permission: ['code:code'] }
          }
        ]
      },
      {
        path: '/task/plan',
        redirect: '/task/autoPlan',
        component: PageView,
        meta: { title: '任务计划', icon: time_job, keepAlive: true, permission: ['taskPlan:taskPlan'] },
        children: [
          {
            path: '/task/autoPlan',
            name: 'autoPlan',
            component: () => import('@/views/task/index'),
            meta: { title: '定时计划', icon: time_job, keepAlive: true, permission: ['task:task'] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: {
          title: '异常页',
          icon: 'warning',
          permission: ['exception']
        },
        children: [{
          path: '/exception/403',
          name: 'Exception403',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
          meta: {
            title: '403',
            permission: ['exception']
          }
        },
        {
          path: '/exception/404',
          name: 'Exception404',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
          meta: {
            title: '404',
            permission: ['exception']
          }
        },
        {
          path: '/exception/500',
          name: 'Exception500',
          component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
          meta: {
            title: '500',
            permission: ['exception']
          }
        }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/settings',
        name: 'account',
        meta: {
          title: '账户设置',
          icon: 'user',
          keepAlive: true
        },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: {
              title: '个人设置',
              hideHeader: true
            },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [{
              path: '/account/settings/base',
              name: 'BaseSettings',
              component: () => import('@/views/account/settings/BaseSetting'),
              meta: {
                title: '基本设置',
                hidden: true
              }
            },
            {
              path: '/account/settings/security',
              name: 'SecuritySettings',
              component: () => import('@/views/account/settings/Security'),
              meta: {
                title: '安全设置',
                hidden: true,
                keepAlive: true
              }
            },
            {
              path: '/account/settings/binding',
              name: 'BindingSettings',
              component: () => import('@/views/account/settings/Binding'),
              meta: {
                title: '账户绑定',
                hidden: true,
                keepAlive: true
              }
            }
            ]
          }
        ]
      }

    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
  path: '/user',
  component: UserLayout,
  redirect: '/user/login',
  hidden: true,
  children: [{
    path: 'login',
    name: 'login',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  },
  {
    path: 'register',
    name: 'register',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
  },
  {
    path: 'register-result',
    name: 'registerResult',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
  }
  ]
},

{
  path: '/test',
  component: BlankLayout,
  redirect: '/test/home',
  children: [{
    path: 'home',
    name: 'TestHome',
    component: () => import('@/views/Home')
  }]
},

{
  path: '/404',
  component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
}

]
