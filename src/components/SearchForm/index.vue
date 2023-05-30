<!-- 搜索组件 -->
<template>
  <div ref="searchFormBoxRef">
    <el-form
      @submit.prevent
      ref="searchFormRef"
      :inline="true"
      :model="newFormData"
      :rules="rules"
      class="search-form"
      :class="{ collapse, normal: !needCollapse }">
      <div
        class="search-content"
        ref="searchContent"
        :style="{
          width: collapse ? searchContentWidth : 'auto'
        }">
        <template
          v-for="item in search"
          :key="item.prop">
          <!-- 数字范围组合 -->
          <el-form-item
            :label="item.name"
            class="number-range"
            v-if="
              (item.show === undefined || item.show) &&
              item.type === 'numberRange'
            ">
            <template #label="scope"
              ><span class="label-ellipsis">{{ scope.label }}</span
              >:</template
            >
            <el-form-item :prop="item.props[0]">
              <el-input
                v-model.number="newFormData[item.props[0]]"
                placeholder="请输入"
                v-bind="item.attributes[0]" />
            </el-form-item>
            <div class="range-symbol">~</div>
            <el-form-item :prop="item.props[1]">
              <el-input
                v-model.number="newFormData[item.props[1]]"
                placeholder="请输入"
                v-bind="item.attributes[1]" />
            </el-form-item>
          </el-form-item>
          <!-- 其他单个input -->
          <!-- <template v-if="item.show">
          </template> -->
          <el-form-item
            v-if="
              (item.show === undefined || item.show) &&
              item.type !== 'numberRange'
            "
            :label="item.name"
            :prop="item.props">
            <template
              v-if="!item.notShowEllipsis"
              #label="{ label }">
              <el-tooltip
                :content="label"
                :disabled="label.length < 6"
                ><span
                  class="label-ellipsis"
                  :title="label"
                  >{{ label }}</span
                ></el-tooltip
              >:</template
            >
            <slot :name="item.props">
              <!-- 文本输入框 -->
              <template v-if="item.type === 'input' || !item.type">
                <el-input
                  class="input-class"
                  clearable
                  v-model.trim="newFormData[item.props]"
                  :maxlength="item.maxlength ? item.maxlength : '100'"
                  :placeholder="'请输入' + item.name"
                  v-bind="item"
                  @input="getInput(item.props, item.inputType)">
                </el-input>
              </template>
              <!-- 日期选择器-->
              <template v-if="item.type === 'date'">
                <el-date-picker
                  :editable="false"
                  clearable
                  :disabled-date="item.disabledDate"
                  v-model="newFormData[item.props]"
                  align="right"
                  type="date"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :picker-options="item.pickerOptions || []"
                  placeholder="选择日期">
                </el-date-picker>
              </template>
              <!-- 日期范围选择器-->
              <template v-if="item.type === 'dateTimeRange'">
                <!-- <slot name="daterange"></slot> -->
                <el-date-picker
                  :editable="false"
                  clearable
                  class="dateTimeRange"
                  v-model="newFormData[item.props]"
                  align="right"
                  type="datetimerange"
                  range-separator="~"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
              </template>
              <!-- 日期范围选择器（不带时间）-->
              <template v-if="item.type === 'daterange'">
                <el-date-picker
                  :editable="false"
                  clearable
                  v-model="newFormData[item.props]"
                  align="right"
                  range-separator="~"
                  type="daterange"
                  value-format="YYYY-MM-DD"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </template>
              <!-- 年份选择器-->
              <template v-if="item.type === 'year'">
                <el-date-picker
                  :editable="false"
                  clearable
                  @change="value => selectChange(value, item.props)"
                  v-model="newFormData[item.props]"
                  align="right"
                  type="year"
                  value-format="YYYY"
                  placeholder="选择年份">
                </el-date-picker>
              </template>
              <!-- 季度选择器 -->
              <template v-if="item.type === 'quarter'">
                <annual-select v-model="newFormData[item.props]" />
              </template>
              <!-- 月份选择器-->
              <template v-if="item.type === 'month'">
                <el-date-picker
                  v-model="newFormData[item.props]"
                  align="right"
                  type="month"
                  value-format="YYYY-MM"
                  :clearable="item.isClearable"
                  :picker-options="item.pickerOptions || []"
                  placeholder="选择月份">
                </el-date-picker>
              </template>
              <!-- 月份范围选择器 -->
              <template v-if="item.type === 'monthrange'">
                <el-date-picker
                  v-model="newFormData[item.props]"
                  align="right"
                  type="monthrange"
                  value-format="YYYY-MM"
                  range-separator="~"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份">
                </el-date-picker>
              </template>
              <!-- 自定义选择项和远程获取选择项的优先级以远程获取优先级更高 -->
              <template v-if="item.type === 'select'">
                <template v-if="item.dict">
                  <!-- 选用自定义选择器 -->
                  <Selector
                    v-model="newFormData[item.props]"
                    :label="item.name"
                    :ref="el => setSelectDom(el, item.props)"
                    :dict="item.dict">
                  </Selector>
                </template>
                <template v-if="item.customDict">
                  <el-select
                    @change="value => selectChange(value, item.props)"
                    v-model="newFormData[item.props]"
                    clearable
                    :placeholder="'请选择' + item.name">
                    <el-option
                      v-for="(option, optionIndex) in item.customDict"
                      :key="optionIndex"
                      :label="option.label"
                      :value="option.value">
                    </el-option>
                  </el-select>
                </template>
              </template>
              <!-- 级联选择器 -->
              <template v-if="item.type === 'cascader'">
                <div>
                  <el-cascader
                    clearable
                    @change="value => selectChange(value, item.props)"
                    v-model="newFormData[item.props]"
                    :options="item.options"
                    :props="item.customProps" />
                </div>
              </template>
              <!-- 下拉树 -->
              <template v-if="item.type === 'treeselect'">
                <div>
                  <el-tree-select
                    :props="item.prop || pro"
                    @change="value => selectChange(value, item.props)"
                    v-model="newFormData[item.props]"
                    :data="item.options"
                    default-expand-all
                    clearable
                    check-strictly
                    :render-after-expand="false" />
                </div>
              </template>
            </slot>
          </el-form-item>
        </template>
      </div>
      <div class="search-actions">
        <el-button
          type="primary"
          @click="handleSearch"
          >搜索</el-button
        >
        <el-button
          v-if="isReset"
          @click="handleReset"
          >重置</el-button
        >
        <el-button
          v-if="needCollapse"
          text
          @click="handleCollapse"
          >{{ collapse ? '全部筛选' : '收缩筛选' }}
          <img
            class="search-collapse-icon"
            src="@/assets/icons/icon_collapse.png"
        /></el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import Selector from '@/components/Selector'
import { cloneDeep } from 'lodash'
import { useThrottleFn } from '@vueuse/core'
import AnnualSelect from '@/components/Annual-select'
const searchContent = ref()
const props = defineProps({
  // 表单数据
  formData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  // 默认type是input
  // select需要传dict或customDict, customDict: [{label: '123', value: 123}]
  search: {
    type: Array,
    default: () => {
      return []
    },
    validator: value => {
      // name, props,是必须的,dict或者customDict为非必须的
      const propsTotal = value.length * 2
      let propsNum = 0
      for (const item of value) {
        for (const prop of Object.keys(item)) {
          if (['name', 'props'].includes(prop)) {
            propsNum++
          }
        }
      }
      return propsTotal === propsNum
    }
  },
  // 表单验证
  rules: {
    type: Object,
    default: () => {
      return {}
    }
  },
  isReset: {
    type: Boolean,
    default: true
  }
})
// 拷贝筛选条件点击搜索改变传参
const newFormData = ref(cloneDeep(props.formData))
const searchFormBoxRef = ref()
const searchFormRef = ref()
const searchContentWidth = ref('auto')
const pro = {
  label: 'label',
  children: 'children'
}
const needCollapse = ref(false) // 是否需要显示收缩
const collapse = ref(false) // 收缩状态

const emits = defineEmits(['on-search', 'on-reset', 'on-select'])
// 搜索
const handleSearch = () => {
  if (searchFormRef.value) {
    searchFormRef.value.validate()
  }
  setSearchForm()
  emits('on-search')
}
// 重置
const handleReset = () => {
  if (searchFormRef.value) {
    searchFormRef.value.resetFields()
    const isReset = ref(true)
    props.search.forEach(i => {
      if (i.isClearable === false && i.props === 'month') {
        isReset.value = false
      }
    })
  }
  setSearchForm()
  emits('on-reset')
}

// 设置筛选框数据
const setSearchForm = () => {
  Object.keys(props.formData).forEach(f => {
    props.formData[f] = newFormData.value[f]
  })
}
const handleCollapse = () => {
  collapse.value = !collapse.value
}

// 数字类型输入
const getInput = (val, type) => {
  switch (type) {
    case 'int':
      // props.formData[val] = props.formData[val]
      newFormData.value[val] = newFormData.value[val]
        .replace(/[^0-9]/g, '')
        .replace(/^[0]+/, '')
      break
    case 'float':
      // props.formData[val] = props.formData[val]
      newFormData.value[val] = newFormData.value[val]
        .replace(/^\./g, '')
        .replace(/[^\d.]/g, '')
        .replace(/\.{2,}/g, '.')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      break
    default:
      break
  }
}

const searchActionNormalWidth = 132 // 搜索+重置宽度
const searchActionCollapseWidth = 258 // 搜索+重置+筛选宽度
const calculateCollapse = () => {
  /**
   * 1. 获取搜索栏的总宽度：searchBoxWidth；搜索+重置宽度：searchActionNormalWidth；搜索+重置+筛选宽度：searchActionCollapseWidth
   * 2. 通过搜索项目的个数计算占用宽度 searchItemTotalWidth
   * 3. searchItemTotalWidth + searchActionNormalWidth > searchBoxWidth 宽度超出，需要开启展开/收缩；否则不需要
   * 4. 计算搜索项目显示宽度
   * resize时，重新计算。不需要collapse->不需要collapse；不需要collapse->需要collapse；需要collapse->需要collapse；需要collapse->不需要collapse
   */
  const formItems = searchContent.value.querySelectorAll('.el-form-item')
  let searchItemTotalWidth = 0 // 搜索项目总宽度
  formItems.forEach(item => {
    searchItemTotalWidth += item.clientWidth + 20
  })
  const searchBoxWidth = searchFormBoxRef.value.clientWidth - 40 // 搜索栏的总宽度

  if (searchItemTotalWidth + searchActionNormalWidth < searchBoxWidth) {
    // 所有输入框总宽度+搜索+重置宽度 < 总宽度，则无需collapse
    needCollapse.value = false

    collapse.value = false
  } else {
    // 需要collapse
    const beforeNeedCollapse = needCollapse.value
    needCollapse.value = true
    if (!beforeNeedCollapse) {
      // 如果之前是不需要collapse的，则collapse收起
      collapse.value = true
    }
    const restFormWidth = searchBoxWidth - searchActionCollapseWidth // 能够显示formitem的剩余宽度
    let restWidth = 0
    for (let i = 0; i < formItems.length; i++) {
      restWidth += formItems[i].clientWidth + 20
      if (restWidth > restFormWidth) {
        restWidth = restWidth - formItems[i].clientWidth
        break
      }
    }
    searchContentWidth.value = `${restWidth}px`
  }
}
const throttledFn = useThrottleFn(() => {
  calculateCollapse()
}, 1000)
onMounted(() => {
  calculateCollapse()
  window.addEventListener('resize', throttledFn)
})

onUnmounted(() => {
  window.removeEventListener('resize', throttledFn)
})
const setCustomDict = (prop, data) => {
  const filterSelection = props.search.filter(item => item.props === prop)
  if (filterSelection[0]?.type === 'select' && filterSelection[0]?.customDict) {
    filterSelection[0].customDict = data || []
  }
}

const selectChange = (value, prop) => {
  emits('on-select', value, prop)
}

// 选择器dom元素map
const selectMap = {}
const setSelectDom = (el, prop) => {
  selectMap[prop] = el
}
const getPropDict = prop => {
  const filterSelection = props.search.filter(item => item.props === prop)
  let dicts = []
  if (filterSelection[0]?.type === 'select') {
    dicts = selectMap[prop].getDict()
  }
  return dicts
}

const setPropDict = (prop, dicts) => {
  selectMap[prop]?.setDict(dicts)
}
const resetPropValue = prop => {
  newFormData.value[prop] = undefined
}

const getPropValue = prop => {
  return newFormData.value[prop]
}

const setPropValue = (prop, data) => {
  newFormData.value[prop] = data
}
defineExpose({
  setCustomDict,
  getPropDict,
  setPropDict,
  resetPropValue,
  getPropValue,
  setPropValue,
  calculateCollapse
})
</script>

<style lang="scss" scoped>
.search-form {
  border-top: 1px solid #e8e8e8;
  padding: 16px 20px;
  :deep(.el-form-item__label) {
    min-width: 116px;
  }
  .input-class {
    width: 216px;
  }
  :deep(.el-select) {
    width: 216px;
  }
  :deep(.el-form-item) {
    margin-right: 20px;
  }
  :deep(.el-form-item__label) {
    padding-right: 0;
    margin-right: 8px;
  }
  .label-ellipsis {
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  }
  .number-range {
    :deep(.el-form-item__content) {
      display: flex;
    }
    .range-symbol {
      width: 16px;
      text-align: center;
    }
    :deep(.el-form-item) {
      margin-right: 0;
      .el-form-item__content {
        width: 100px;
      }
    }
  }
  .el-button.is-text:not(.is-disabled):focus,
  .el-button.is-text:not(.is-disabled):hover {
    background: none;
  }
  &.normal {
    display: flex;
    padding-bottom: 0;
  }
  &.collapse {
    display: flex;
    .search-content {
      height: 50px;
      overflow: hidden;
    }
    .search-actions {
      flex: 1;
      justify-content: flex-start;
    }
    .search-collapse-icon {
      transform: rotate(0);
    }
  }
}
.search-content {
  height: auto;
}
.search-actions {
  display: flex;
  justify-content: flex-end;
}
.search-collapse-icon {
  width: 20px;
  height: 20px;
  margin-left: 8px;
  transform: rotate(180deg);
  transition: all 0.1s ease-in-out;
}
</style>
