<!-- 季度选择器 -->
<template>
  <el-popover
    placement="bottom"
    popper-class="annual-popper"
    :visible="visible"
    :width="268"
    trigger="click">
    <template #reference>
      <div
        class="annual-select-wrap"
        :class="[warning ? 'waring-border' : '']"
        @mouseover="showDeleteIcon"
        @mouseout="hideDeleteIcon"
        @click.stop="visible = !visible">
        <span
          class="placeholder"
          v-if="!inputValue">
          {{ props.placeholder }}
        </span>
        <span
          class="input"
          v-else
          >{{ inputValue }}</span
        >
        <span
          class="annual-icon"
          v-if="!delIcon"></span>
        <span
          class="delete-icon"
          @click.stop="clearInput"
          v-else></span>
      </div>
    </template>
    <div class="drop-down-wrap">
      <div class="year-header">
        <el-icon @click.stop="changeYear(false)"><DArrowLeft /></el-icon>
        <span>{{ year }}年</span>
        <el-icon
          @click.stop="changeYear(true)"
          :class="[defaultYear === year ? 'is-disabled' : '']"
          ><DArrowRight
        /></el-icon>
      </div>
      <div class="annual-section">
        <span
          v-for="(item, index) in annualOptions"
          :key="index"
          class="select-option"
          @click.stop="selectOption(item)"
          >{{ item.label }}</span
        >
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'

const visible = ref(false)
const annualOptions = ref([
  {
    label: '第一季度',
    value: 1
  },
  {
    label: '第二季度',
    value: 2
  },
  {
    label: '第三季度',
    value: 3
  },
  {
    label: '第四季度',
    value: 4
  }
])
const props = defineProps({
  placeholder: {
    type: String,
    default: '请选择'
  },
  modelValue: {
    type: String,
    default: ''
  },
  warning: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['on-select', 'update:modelValue'])
const quarter = computed({
  get: () => {
    return props.modelValue
  },
  set: value => {
    emits('update:modelValue', value)
  }
})
const inputValue = ref('')

const year = ref(new Date().getFullYear())
const defaultYear = new Date().getFullYear()
const changeYear = (isAdd = true) => {
  if (year.value === defaultYear && isAdd) return
  if (isAdd) {
    year.value = year.value + 1
  } else {
    year.value = year.value - 1
  }
}

// 展示showDeleteIcon
const delIcon = ref(false)
const showDeleteIcon = () => {
  if (inputValue.value) {
    delIcon.value = true
  }
}
const hideDeleteIcon = () => {
  if (inputValue.value) {
    delIcon.value = false
  }
}
const clearInput = () => {
  inputValue.value = ''
  delIcon.value = false
}
// 选择季度
const selectOption = option => {
  visible.value = false
  inputValue.value = year.value + '年' + '第' + option.value + '季度'
  quarter.value = [year.value, option.value]
  emits('on-select', {
    year: year.value,
    quarter: option.value
  })
}

const registerClick = () => {
  document.addEventListener('click', () => {
    visible.value = false
  })
}
const registerEventListener = () => {
  registerClick()
}
onMounted(() => {
  registerEventListener()
})
// const dropShow = ref(false)
</script>

<style lang="scss">
.annual-popper.el-popover {
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  padding: 0;
  .el-popper__arrow {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.annual-select-wrap {
  width: 268px;
  height: 32px;
  background: #ffffff;
  border-radius: 2px;
  // border: 1px solid #dcdfe6;
  box-sizing: border-box;
  padding: 5px 12px;
  line-height: 20px;
  position: relative;
  display: flex;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color))
    inset;
  .placeholder {
    flex: 1;
    font-size: 14px;
    font-family: AlibabaPuHuiTi_2_55_Regular;
    color: #bfbfbf;
  }
  .annual-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    // background: url('@/assets/icons/annual-icon.png') no-repeat;
    background-position: center;
    background-size: 100% 100%;
    position: absolute;
    right: 8px;
    top: 8px;
    bottom: 8px;
    cursor: pointer;
  }
  .delete-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    // background: url('@/assets/icons/clear-icon.png') no-repeat;
    background-position: center;
    background-size: 100% 100%;
    position: absolute;
    right: 8px;
    top: 8px;
    bottom: 8px;
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid #d9d9d9;
  }
}
.drop-down-wrap {
  height: 152px;
  display: flex;
  flex-direction: column;
  .year-header {
    display: flex;
    height: 40px;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px;
    line-height: 24px;
    font-size: 14px;
    font-family: AlibabaPuHuiTi_2_55_Regular;
    color: #333333;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .annual-section {
    flex: 1;
    padding: 24px 20px;
    display: flex;
    flex-wrap: wrap;
    .select-option {
      flex: 0 1 56px;
      height: 20px;
      margin-right: 28px;
      font-size: 14px;
      font-family: AlibabaPuHuiTi_2_55_Regular;
      color: #333333;
      cursor: pointer;
      &:hover {
        color: #3183e2;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
.is-disabled {
  cursor: not-allowed;
}
.waring-border {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}
</style>
