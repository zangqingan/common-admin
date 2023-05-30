import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'
import useAppStore from '@/store/modules/app'
// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')
let sidebarRoutersMap = {}
let sidebarRouterParentMap = {}
const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
    secondaryRoutes: []
  }),
  actions: {
    setRoutes(routes) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes
      // 组装两个map, 一个是sideMap 一个是第二级之后的所有路由为key, 第二级路由为value的map
      sidebarRoutersMap = buildSideBarRouterMap(this.sidebarRouters)
    },
    generateRoutes(roles) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const defaultData = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const defaultRoutes = filterAsyncRouter(defaultData)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          asyncRoutes.forEach(route => {
            router.addRoute(route)
          })
          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
          this.setDefaultRoutes(sidebarRoutes)
          this.setTopbarRoutes(defaultRoutes)
          resolve(rewriteRoutes)
        })
      })
    },
    setSecondaryRoutes(path, isSecond) {
      let secondaryRoutes
      if (isSecond) {
        secondaryRoutes = sidebarRoutersMap[path] || []
      } else {
        const parentPath = sidebarRouterParentMap[path]
        secondaryRoutes = sidebarRoutersMap[parentPath] || []
      }
      this.secondaryRoutes = secondaryRoutes.filter(item => {
        return (
          item.path !== '/index' && item.redirect !== '/index' && !item.hidden
        )
      })
      useAppStore().toggleSideBarHide(this.secondaryRoutes.length === 0)
    }
  }
})
function buildSideBarRouterMap(sidebarRouters) {
  const map = {}
  sidebarRouterParentMap = {}
  sidebarRouters.forEach(firstLevel => {
    const path = firstLevel.path
    map[path] = firstLevel.children || []
    if (firstLevel.children && firstLevel.children.length > 0) {
      // 获取key. key为父router的path 和 子router的path的组装
      buildParentMap(firstLevel.children, path, path)
    }
  })
  return map
}
function buildParentMap(list, path, pathRoot) {
  list.forEach(item => {
    const path1 = buildPath(path, item.path)
    item.fullPath = path1
    sidebarRouterParentMap[path1] = pathRoot
    if (item.children && item.children.length > 0) {
      buildParentMap(item.children, path1, pathRoot)
    }
  })
}
function buildPath(path1, path2) {
  // 如果path2 是/开头, 直接返回path2, 否则返回path1 + "/" + path2
  if (path2.startsWith('/')) {
    return path2
  }
  if (path1.startsWith('/')) {
    return `${path1}/${path2}`
  }
  return `/${path1}/${path2}`
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = view => {
  let res
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

export default usePermissionStore
