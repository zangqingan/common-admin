<template>
  <section
    class="app-main"
    :style="route.path === '/index' ? 'overflow: hidden' : ''">
    <router-view v-slot="{ Component, route }">
      <transition
        name="fade-transform"
        mode="out-in">
        <!-- <keep-alive :include="tagsViewStore.cachedViews"> -->
        <component
          v-if="!route.meta.link"
          :is="Component"
          :key="route.path" />
        <!-- </keep-alive> -->
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup>
import iframeToggle from './IframeToggle/index'
import useTagsViewStore from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
const route = useRoute()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.module.scss';
.app-main {
  /* 50= navbar  50  */
  height: calc(100vh - $base-navbar-height);
  width: 100%;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f1f3f5;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    height: calc(100vh - 40px - $base-navbar-height);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>
