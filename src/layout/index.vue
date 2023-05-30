<template>
  <div
    :class="classObj"
    class="app-wrapper"
    :style="{ '--current-color': theme }">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside" />
    <TopNavBar
      @setLayout="setLayout"
      @selectMenu="selectMenu" />
    <sidebar
      ref="sideBarRef"
      :style="{
        left: sidebar.hide || route.path === '/index' ? '-200px' : '0'
      }"
      class="sidebar-container" />
    <div
      :class="{
        hasTagsView: needTagsView,
        sidebarHide: sidebar.hide || route.path === '/index'
      }"
      class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <!-- <navbar @setLayout="setLayout" /> -->
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <settings ref="settingRef" />
    </div>
  </div>
</template>

<script setup>
import { useWindowSize, useEventListener } from '@vueuse/core'
import Sidebar from './components/Sidebar/index.vue'
import { AppMain, Navbar, Settings, TagsView, TopNavBar } from './components'
import defaultSettings from '@/settings'

import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()
const route = useRoute()
const theme = computed(() => settingsStore.theme)
const sideTheme = computed(() => settingsStore.sideTheme)
const sidebar = computed(() => useAppStore().sidebar)
const device = computed(() => useAppStore().device)
const needTagsView = computed(() => settingsStore.tagsView)
const fixedHeader = computed(() => settingsStore.fixedHeader)

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

const { width, height } = useWindowSize()
const WIDTH = 992 // refer to Bootstrap's responsive design

watchEffect(() => {
  // if (device.value === 'mobile' && sidebar.value.opened) {
  //   useAppStore().closeSideBar({ withoutAnimation: false })
  // }
  // if (width.value - 1 < WIDTH) {
  //   useAppStore().toggleDevice('mobile')
  //   useAppStore().closeSideBar({ withoutAnimation: true })
  // } else {
  //   useAppStore().toggleDevice('desktop')
  // }
})

function handleClickOutside() {
  useAppStore().closeSideBar({ withoutAnimation: false })
}

const settingRef = ref(null)
function setLayout() {
  settingRef.value.openSetting()
}
// 菜单选择
const selectMenu = data => {
  permissionStore.setSecondaryRoutes(data.key, true)
}
// 监听浏览器前进后退
useEventListener(window, 'popstate', evt => {
  // console.log('跳转', evt)
  permissionStore.setSecondaryRoutes(route.path)
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';
@import '@/assets/styles/variables.module.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
