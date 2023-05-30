<template>
  <!-- 富文本编辑器 -->
  <Toolbar
    style="border-bottom: 1px solid #ccc"
    :editor="editorRef"
    :defaultConfig="toolbarConfig" />
  <Editor
    style="height: 300px; overflow-y: hidden; width: 100%"
    v-model="valueHtml"
    :defaultConfig="editorConfig"
    @onCreated="handleCreated" />
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 editor css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { onBeforeUnmount } from 'vue'
import { getToken } from '@/utils/auth'
const fileUrl = import.meta.env.VITE_APP_FILE_API
const { proxy } = getCurrentInstance()
// 编辑器相关
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
  MENU_CONF: {
    uploadImage: {}
  },
  placeholder: '请输入内容...'
}

editorConfig.MENU_CONF.uploadImage = {
  // 其他配置...
  server: import.meta.env.VITE_APP_BASE_API + '/common/upload', // 文件上传的地址
  headers: {
    Authorization: 'Bearer ' + getToken()
  },
  fieldName: 'file',
  // 自定义插入图片
  customInsert(res, insertFn) {
    // res 即服务端的返回结果
    // 从 res 中找到 url alt href ，然后插图图片
    insertFn(import.meta.env.VITE_APP_FILE_API + res?.fileName)
  }
}
const handleCreated = editor => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const getHtml = () => {
  return valueHtml.value
}

const setHtml = html => {
  valueHtml.value = html
}

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:modelValue'])
watch(
  () => props.disabled,
  val => {
    if (val) {
      proxy.$nextTick(() => {
        editorRef.value.disable()
      })
    }
  },
  {
    immediate: true
  }
)
const valueHtml = computed({
  get() {
    return props.modelValue || ''
  },
  set(value) {
    emits('update:modelValue', value)
  }
})
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
defineExpose({
  getHtml,
  setHtml
})
</script>

<style scoped></style>
