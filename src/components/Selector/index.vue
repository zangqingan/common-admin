<!--
 * @Author: qiuaiping 1576993405@qq.com
 * @Date: 2022-10-19 16:21:14
 * @LastEditors: qiuaiping 1576993405@qq.com
 * @LastEditTime: 2022-10-24 09:48:38
 * @FilePath: \yuxin-admin\src\components\Selector\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- 自定义选择器 -->
<template>
  <el-select
    v-model="selectedValue"
    clearable
    :placeholder="'请选择' + props.label">
    <el-option
      v-for="(option, index) in list"
      :key="index"
      :disabled="option.disabled"
      :label="option.dictLabel"
      :value="option.dictValue">
    </el-option>
  </el-select>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { getDicts } from '@/api/system/dict/data.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  dict: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])
const selectedValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})
const mockRequest = () => {
  const data = []
  return new Promise(resolve => {
    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        data.push({
          id: i.toString()
        })
      }
      resolve([
        {
          dictLabel: 'dd',
          dictValue: 'dd'
        }
      ])
    }, 1000)
  })
}
// 获取select的字典集合
const getMockOptions = async dict => {
  const data = await mockRequest()
  list.value = data || []
}
const list = ref([])
const getSelectOptions = async () => {
  const { data } = await getDicts(props.dict)
  list.value = data || []
}

onBeforeMount(() => {
  getSelectOptions()
  // getMockOptions()
})

const getDict = () => {
  return list.value
}

const setDict = dicts => {
  list.value = dicts
}
defineExpose({
  getDict,
  setDict
})
</script>

<style lang="scss" scoped></style>
