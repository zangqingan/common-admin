<template>
  <div class="top-navbar">
    <Logo :collapse="isCollapse" />
    <el-menu
      v-if="showMenu"
      :default-active="activeMenu"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#2465B1"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect">
      <sidebar-item
        v-for="(route, index) in sidebarRouters"
        :key="route.path + index"
        :item="route"
        :isTopNav="true"
        :base-path="route.path" />
    </el-menu>
    <div class="right-menu">
      <!-- <template v-if="appStore.device !== 'mobile'">
        <header-search
          id="header-search"
          class="right-menu-item" />

        <screenfull
          id="screenfull"
          class="right-menu-item hover-effect" />

        <el-tooltip
          content="布局大小"
          effect="dark"
          placement="bottom">
          <size-select
            id="size-select"
            class="right-menu-item hover-effect" />
        </el-tooltip>
      </template> -->
      <div class="avatar-container">
        <el-dropdown
          @command="handleCommand"
          class="right-menu-item hover-effect"
          trigger="hover">
          <div class="avatar-wrapper">
            <img
              :src="userStore.avatar"
              class="user-avatar" />
            <!-- <el-icon><caret-bottom /></el-icon> -->

            <div class="user-name">{{ userStore.name }}</div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <!-- <el-dropdown-item command="setLayout">
                <span>布局设置</span>
              </el-dropdown-item> -->
              <el-dropdown-item
                divided
                command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="divider"></div>
      <router-link
        to="/"
        class="icon-home">
        <img
          src="@/assets/images/icon-home.png"
          alt="主页" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Logo from '../Sidebar/Logo.vue'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
import SidebarItem from '../Sidebar/SidebarItem'
// import HeaderSearch from '@/components/HeaderSearch'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import usePermissionStore from '@/store/modules/permission'
import { getRouteFirstPath } from '@/utils/index.js'

const props = defineProps({
  // 是否显示菜单
  showMenu: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['setLayout', 'selectMenu'])
const permissionStore = usePermissionStore()
const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const isCollapse = computed(() => !appStore.sidebar.opened)

const tempList = permissionStore.sidebarRouters

// 格式化路由，获取1级路由
const sidebarRouters = computed(() => {
  const list = tempList
    .filter(item => {
      return (
        item.path !== '/index' && item.redirect !== '/index' && !item.hidden
      )
    })
    .map(item => {
      const fullPath = findChildFirstRouteFullPath(item, item.path)
      return {
        ...item,
        path: fullPath,
        children: []
      }
    })
  return list
})

const activeMenu = computed(() => {
  const { meta, path } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return getRouteFirstPath(path, true)
})

const handleSelect = (key, keyPath) => {
  emits('selectMenu', { key, keyPath })
}

// 找到第一个路由中最后一个子路由的路径
function findChildFirstRouteFullPath(route, path) {
  if (route.children && route.children.length > 0) {
    path += `/${route.children[0].path}`
    return findChildFirstRouteFullPath(route.children[0], path)
  }
  return path
}

function handleCommand(command) {
  switch (command) {
    case 'setLayout':
      setLayout()
      break
    case 'logout':
      logout()
      break
    default:
      break
  }
}

function logout() {
  ElMessageBox.confirm('确定退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = '#/index'
      })
    })
    .catch(() => {})
}

function setLayout() {
  emits('setLayout')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.module.scss';
.top-navbar {
  height: $base-navbar-height;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #195aa4;
  z-index: 1001;
  :deep(.el-menu) {
    flex: 1;
    height: 100%;
  }
  :deep(.sidebar-logo-container) {
    width: 200px;
    height: 100%;
    padding-left: 20px;
    box-sizing: border-box;
    text-align: left;
    background-color: transparent !important;
    .sidebar-title {
      line-height: $base-navbar-height;
    }
    &.collapse {
      padding-left: 0;
      width: 54px;
      text-align: center;
    }
  }
  :deep(.el-menu--horizontal) {
    border-bottom: none;
    background-color: transparent;
    .el-sub-menu__title {
      background-color: transparent !important;
    }
    .el-sub-menu__title,
    .el-menu-item {
      line-height: $base-navbar-height;
      height: $base-navbar-height;
    }
    .el-sub-menu .el-sub-menu__icon-arrow {
      position: static;
      vertical-align: middle;
      margin-left: 8px;
      margin-top: -3px;
    }
  }
  .right-menu {
    height: 100%;
    line-height: $base-navbar-height;
    display: flex;
    align-items: center;
    color: #ffffff;
    margin-left: auto;

    &:focus {
      outline: none;
    }
    :deep(.el-dropdown) {
      color: #ffffff;
      vertical-align: baseline;
    }
    :deep(.el-dropdown--default) {
      height: 100%;
    }
    .right-menu-item {
      display: block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      height: 100%;

      .avatar-wrapper {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .user-name {
          font-size: 16px;
          font-family: SourceHanSansCN-Bold, SourceHanSansCN;
          font-weight: bold;
          color: #ffffff;
          line-height: 24px;
          margin-left: 8px;
        }
      }
    }
    .divider {
      width: 1px;
      height: 31px;
      background: rgba(255, 255, 255, 0.3);
      margin-left: 16px;
      margin-right: 16px;
    }
    .icon-home {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 16px;
      img {
        display: block;
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
