<!-- el-dialog的二次封装 -->
<template>
  <el-dialog
    v-model="visible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    align-center
    v-bind="$attrs">
    <template
      #header="{ close, titleId, titleClass }"
      v-if="slots['header']">
      <slot
        v-bind="{ close, titleId, titleClass }"
        name="header">
      </slot>
    </template>
    <slot />
    <template
      #footer
      v-if="slots['footer']">
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
const slots = useSlots()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
})
</script>

<style lang="scss" scoped></style>
