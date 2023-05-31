<template>
  <div
    id="tags-view-container"
    class="tags-view-container">
    <div
      title="关闭全部"
      class="close-all"
      @click.stop="closeAllTags(selectedTag)">
      <img
        src="@/assets/icons/close-all.png"
        alt="" />
    </div>

    <div
      v-if="showArrow"
      class="tags-left"
      @click="clickArrowMove('left')">
      <img
        src="@/assets/icons/tags-left.png"
        alt="" />
    </div>
    <div
      v-if="showArrow"
      class="tags-right"
      @click="clickArrowMove('right')">
      <img
        src="@/assets/icons/tags-right.png"
        alt="" />
    </div>

    <scroll-pane
      ref="scrollPaneRef"
      class="tags-view-wrapper"
      :class="{ 'has-margin': showArrow }"
      @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :data-path="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{
          path: tag.path,
          query: tag.query,
          fullPath: tag.fullPath
        }"
        @click="switchRoute(tag.path)"
        class="tags-view-item"
        :style="activeStyle(tag)"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''">
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          @click.prevent.stop="closeSelectedTag(tag)">
          <close
            class="el-icon-close"
            style="width: 1em; height: 1em; vertical-align: middle" />
        </span>
      </router-link>
    </scroll-pane>
  </div>
</template>

<script setup>
import ScrollPane from './ScrollPane'
import { getNormalPath } from '@/utils/ruoyi'
import useTagsViewStore from '@/store/modules/tagsView'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

const selectedTag = ref({})
const affixTags = ref([])
const scrollPaneRef = ref(null)

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()
const visitedViews = computed(() => {
  // return useTagsViewStore().visitedViews
  const len = useTagsViewStore().visitedViews.length
  return useTagsViewStore().visitedViews.slice(len - 10 > 0 ? len - 10 : 0, len)
})

const showArrow = ref(false)

const routes = computed(() => usePermissionStore().routes)
const theme = computed(() => useSettingsStore().theme)

watch(route, () => {
  addTags()
  moveToCurrentTag()
})

onMounted(() => {
  initTags()
  addTags()
  judeHasSCroll()
  window.addEventListener('resize', judeHasSCroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', judeHasSCroll)
})
// 判断是否显示滚动条
function judeHasSCroll() {
  proxy.$nextTick(() => {
    const elementScroll = scrollPaneRef.value.scrollWrapper
    if (elementScroll) {
      showArrow.value = elementScroll.scrollWidth > elementScroll.clientWidth
    }
  })
}
const switchRoute = path => {
  const routeArr = route.path.split('/')
  routeArr.shift()
  const pathArr = path.split('/')
  pathArr.shift()
  if (
    path !== route.path &&
    routeArr[0] + routeArr[1] !== pathArr[0] + pathArr[1]
  ) {
    permissionStore.setSecondaryRoutes(path)
  }
}

function isActive(r) {
  return r.path === route.path
}
function activeStyle(tag) {
  if (!isActive(tag)) return {}
  return {
    'background-color': theme.value,
    'border-color': theme.value
  }
}
function isAffix(tag) {
  return tag.meta && tag.meta.affix
}

function filterAffixTags(routes, basePath = '') {
  let tags = []
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = getNormalPath(basePath + '/' + route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}
function initTags() {
  const res = filterAffixTags(routes.value)
  affixTags.value = res
  for (const tag of res) {
    // Must have tag name
    if (tag.name) {
      useTagsViewStore().addVisitedView(tag)
    }
  }
}
function addTags() {
  const { name } = route
  if (name) {
    useTagsViewStore().addView(route)
    if (route.meta.link) {
      useTagsViewStore().addIframeView(route)
    }
  }
  return false
}
function moveToCurrentTag() {
  nextTick(() => {
    for (const r of visitedViews.value) {
      if (r.path === route.path) {
        scrollPaneRef.value.moveToTarget(r)
        // when query is different then update
        if (r.fullPath !== route.fullPath) {
          useTagsViewStore().updateVisitedView(route)
        }
      }
    }
  })
}
function closeSelectedTag(view) {
  proxy.$tab.closePage(view).then(({ visitedViews }) => {
    judeHasSCroll()
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}
function closeAllTags(view) {
  proxy.$tab.closeAllPage().then(({ visitedViews }) => {
    judeHasSCroll()
    if (affixTags.value.some(tag => tag.path === route.path)) {
      return
    }
    toLastView(visitedViews, view)
  })
}
function toLastView(visitedViews, view) {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.fullPath)
    permissionStore.setSecondaryRoutes(latestView.fullPath)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}
function handleScroll() {
  showArrow.value = true
}
// 点击左右按钮，控制scrollLeft
function clickArrowMove(type) {
  scrollPaneRef.value.handleScrollMove(type)
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.module.scss';
.tags-view-container {
  height: $base-tags-height;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  position: relative;
  display: flex;
  align-items: center;
  .close-all {
    width: 40px;
    height: 100%;
    padding: 14px 10px 10px 10px;
    position: absolute;
    left: 0px;
    border-right: 1px solid #f1f3f5;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .tags-left {
    width: 40px;
    height: 100%;
    padding: 14px 10px 10px 10px;
    position: absolute;
    left: 40px;
    cursor: pointer;
    border-right: 1px solid #f1f3f5;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .tags-right {
    width: 40px;
    height: 100%;
    padding: 14px 10px 10px 10px;
    position: absolute;
    border-left: 1px solid #f1f3f5;
    right: 0;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .has-margin {
    margin-left: 80px !important;
    margin-right: 40px;
  }
  .tags-view-wrapper {
    margin-left: 40px;
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 48px;
      line-height: 48px;
      border-right: 1px solid #d8dce5;
      font-size: 15px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      background: #fff;
      padding: 0 8px;
      &.active {
        background: #dde6f8 !important;
        border-color: #dde6f8 !important;
        color: #1750a1;
      }

      .el-icon-close {
        width: 20px;
        height: 20px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;
        position: relative;
        color: #bfbfbf;
        top: -1px;
        &:before {
          transform: scale(0.6);
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
}
</style>
