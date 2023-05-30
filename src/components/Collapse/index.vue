<!--
 * @Descripttion:
 * @version:
 * @Author: lirioing
 * @Date: 2022-07-04 14:54:09
 * @LastEditors: qiuaiping 1576993405@qq.com
 * @LastEditTime: 2022-10-21 09:17:25
-->
<template>
  <div class="collapse">
    <el-collapse
      v-model="activeNames"
      @change="handleChange">
      <el-collapse-item
        name="basicInfo"
        @click="show_collapse">
        <template #title>
          <el-icon
            :class="[{ active: isActive }, 'arrow-icon']"
            :size="16"
            color="#3183E2"
            ><CaretBottom
          /></el-icon>
          <div class="content">
            <el-tooltip
              v-if="isTip"
              class="box-item"
              effect="dark"
              :content="title"
              placement="top">
              <div class="content-title">{{ title }}</div>
            </el-tooltip>
            <div
              v-else
              class="content-title">
              {{ title }}
            </div>
            <div class="btn">
              <slot name="button" />
            </div>
          </div>
        </template>
        <slot />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'

const { proxy } = getCurrentInstance()
const isActive = ref(false)
// const activeNames = reactive(['basicInfo'])

const activeNames = ref([])
watch(
  () => props.active,
  () => {
    activeNames.value = props.active ? ['basicInfo'] : []
    isActive.value = !props.active
  },
  {
    immediate: true
  }
)
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  isTip: {
    type: Boolean,
    default: false
  }
})

function show_collapse() {}
function handleChange() {
  isActive.value = !isActive.value
  proxy.$forceUpdate()
}
</script>

<style lang="scss" scoped>
.arrow-icon {
  transition: all 0.3s;
}
.active {
  transform: rotate(-90deg);
}
:deep(.el-collapse-item__arrow) {
  display: none;
}
:deep(.el-collapse-item__header) {
  width: 100%;
  border-bottom: none;
}
.content {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.content-title {
  font-size: 18px;
  font-weight: 500;
  color: #6a7697;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  margin-left: 5px;
  color: #333333;
  font-size: 16px;
}
</style>
