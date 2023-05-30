<!-- top-header -->
<template>
  <div class="top-header-box">
    <div class="top-header-title">
      <div class="top-header-title-left">
        <img
          class="top-header-title-icon"
          src="@/assets/images/page-title-icon.png" />
        <span class="title">{{ titleText }}</span>
      </div>

      <div class="right-action">
        <div
          class="right-action-buttons"
          v-if="$slots['action']">
          <slot name="action" />
        </div>
        <!-- <el-divider
          v-if="refresh && $slots['action']"
          class="action-divider"
          direction="vertical" />
        <template v-if="refresh">
          <el-button
            class="action-refresh"
            :icon="RefreshRight"
            @click="handleRefresh"
        /></template> -->
      </div>
    </div>
    <div v-if="$slots['content']">
      <slot name="content"></slot>
    </div>
    <div v-if="$slots['search']">
      <slot name="search"></slot>
    </div>
  </div>
</template>

<script setup>
import { RefreshRight } from '@element-plus/icons-vue'
import { computed } from 'vue'
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  refresh: {
    type: Boolean,
    default: true
  }
})
const route = useRoute()
const emits = defineEmits(['refresh'])
const titleText = computed(() => (props.title ? props.title : route.meta.title))
const handleRefresh = () => {
  emits('refresh')
}
</script>

<style lang="scss" scoped>
.top-header {
  &-box {
    background-color: #ffffff;
    border-radius: 2px;
    margin-bottom: 16px;
  }
  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
    height: 64px;

    &-left {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-icon {
      width: 24px;
      height: 24px;
      display: block;
      margin-right: 8px;
    }

    .title {
      font-size: 20px;
      font-family: SourceHanSansCN-Bold, SourceHanSansCN;
      font-weight: bold;
      color: #14376e;
      line-height: 1;
    }
  }
}
.right-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .action-divider {
    height: 24px;
    display: block;
    margin-left: 16px;
    margin-right: 16px;
  }

  .action-refresh {
    padding-left: 5px;
    padding-right: 5px;
    font-size: 20px;
  }
}
</style>
