<template>
  <div
    :class="{ hidden: hidden }"
    class="pagination-box">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      @current-change="handleCurrentChange">
      <span class="el-pagination__sizes"
        >每页
        <el-select
          v-model="pageSize"
          @change="handleSizeChange"
          :suffixIcon="CaretBottom">
          <el-option
            v-for="size in pageSizes"
            :key="size"
            :label="size"
            :value="size" />
        </el-select>
        条</span
      >
      <span class="pagination-jump"
        >跳至<el-input
          class="el-pagination__editor el-input"
          v-model="jumpPage"
          type="number"
          @change="handleJumpPage" />页</span
      >
    </el-pagination>
  </div>
</template>

<script setup>
import { scrollTo } from '@/utils/scroll-to'
import { CaretBottom } from '@element-plus/icons-vue'
import { watch } from 'vue'

const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  layout: {
    type: String,
    default: 'total, prev, pager, next, slot'
  },
  background: {
    type: Boolean,
    default: false
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits()

const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})

// 自定义跳转页码
const jumpPage = ref(props.page)

const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})
function handleSizeChange(val) {
  currentPage.value = 1
  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
function handleCurrentChange(val) {
  emit('pagination', { page: val, limit: pageSize.value })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
watch(currentPage, val => {
  jumpPage.value = val
})
const max = computed(() => {
  return Math.ceil(props.total / props.limit)
})
const handleJumpPage = val => {
  let page = Math.ceil(val)
  if (page < 1) {
    page = 1
    jumpPage.value = 1
  }
  if (page > max.value) {
    page = max.value
  }
  emit('update:page', page)
  handleCurrentChange(page)
}
</script>

<style scoped lang="scss">
$text-color: #7d8592;
.pagination-box {
  background: #fff;
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  :deep(.el-pagination) {
    .el-pagination__total {
      color: $text-color;
    }
  }
}
.pagination-container.hidden {
  display: none;
}
.el-pagination__sizes {
  color: $text-color;
  :deep(.el-select) {
    margin-left: 8px;
    margin-right: 8px;
    .el-icon.el-select__caret.el-select__icon {
      width: 16px;
      height: 16px !important;
      background: url('@/assets/icons/tree-down-icon.png') no-repeat;
      background-position: center;
      background-size: 100% 100%;
    }
    .el-input__wrapper {
      padding-right: 4px;
    }
    .el-input {
      width: 60px;
    }
  }
}
.pagination-jump {
  color: $text-color;
}
</style>
