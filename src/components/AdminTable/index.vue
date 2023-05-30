<template>
  <div class="admin-table-box">
    <slot name="tab"></slot>
    <el-table
      class="admin-table-list"
      :data="tableData"
      v-loading="loading"
      :border="isBorder"
      :row-key="rowKey"
      :default-expand-all="isExpandAll"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      ref="adminTable"
      v-bind="$attrs"
      :tree-props="{ children: children, hasChildren: hasChildren }">
      <!-- :sortable="item.sortable"
        :sortable="item === 'pageView'?'custom':''"
        :sort-method="(obj1,obj2)=>sortByDate(obj1,obj2,item.prop)" -->
      <el-table-column
        v-for="item in columns"
        v-bind="item"
        :sortable="item.sortable"
        :key="item.prop"
        :fixed="item.fixed"
        :reserve-selection="item.reserveSelection"
        :show-overflow-tooltip="item.showOverflow !== 'hide'">
        <template
          #default="{ row, column, $index }"
          v-if="slots[item.prop]">
          <slot
            v-bind="{ row, column, $index }"
            :name="item.prop" />
        </template>
        <template v-if="item.child">
          <el-table-column
            v-for="items in item.child"
            v-bind="items"
            :key="items.prop"
            :fixed="items.fixed"
            :show-overflow-tooltip="items.showOverflow !== 'hide'">
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <div class="admin-pagination">
      <slot name="total"></slot>
      <pagination
        :layout="layout"
        v-show="total > 0"
        :total="total"
        v-model:page="currentPage"
        v-model:limit="pageSize"
        @pagination="pageChange">
      </pagination>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  columns: {
    required: true,
    type: Array
  },
  loading: {
    type: Boolean,
    default: false
  },
  isBorder: {
    type: Boolean,
    default: false
  },
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
  children: {
    type: String,
    default: 'children'
  },
  hasChildren: {
    type: String,
    default: 'hasChildren'
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  isExpandAll: {
    type: Boolean,
    default: true
  },
  layout: {
    type: String,
    default: 'prev, pager, next, jumper, ->, total'
  }
})

const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
const sortByDate = (obj1, obj2, prop) => {
  console.log('sortByDate')
  const a1 = obj1[prop]
  const b1 = obj2[prop]
  return a1 - b1
}
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})
const slots = useSlots()

const emit = defineEmits([
  'pageChange',
  'update:page',
  'update:limit',
  'selectionChange',
  'sortChange'
])

const pageChange = data => {
  console.log('pageChange', data)
  emit('pageChange', data)
}
const handleSelectionChange = e => {
  emit('selectionChange', e)
}
const handleSortChange = e => {
  console.log(e)
  emit('sortChange', e)
}
// ref
const adminTable = ref()
const toggleRowSelection = (row, isSelected) => {
  adminTable.value.toggleRowSelection(row, isSelected)
}
const clearSelection = () => {
  adminTable.value.clearSelection()
}
defineExpose({
  toggleRowSelection,
  clearSelection
})
// const height = ref('200')
</script>

<style lang="scss" scoped>
.admin-table {
  &-box {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 16px;
    box-sizing: border-box;
    background-color: #ffffff;
  }
  &-list {
    flex: 1;
  }
}

:deep(.el-table) {
  .el-table__fixed-header-wrapper th {
    height: 40px;
    background: #f1f2f5 !important;
  }

  .el-table__cell {
    // position: unset !important;
  }
}
// 修改表格show-overflow-tooltip提示框的宽度
:global(.el-popper) {
  max-width: 50%;
}
</style>
