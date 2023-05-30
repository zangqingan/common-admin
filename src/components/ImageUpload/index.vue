<template>
  <div class="component-upload-image">
    <div
      class="el-upload__tip"
      v-if="showTip">
      请上传
      <template v-if="fileSize"> 大小不超过 {{ fileSize }}MB </template>
      <template v-if="fileType"> 格式为{{ fileType.join('/') }} </template>
      的文件
    </div>
    <el-upload
      multiple
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      ref="imageUpload"
      :before-remove="handleDelete"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      class="image-upload"
      :class="{ hide: fileList.length >= limit }">
      <!-- <el-icon class="avatar-uploader-icon"><plus /></el-icon> -->
      <slot name="default">
        <span class="upload-icon"></span>
      </slot>
    </el-upload>
    <!-- 上传提示 -->

    <el-image-viewer
      v-if="dialogVisible"
      :url-list="[dialogImageUrl]"
      infinite
      hide-on-click-modal
      @close="dialogVisible = false" />
  </div>
</template>

<script setup>
import { getToken } from '@/utils/auth'
const props = defineProps({
  modelValue: [String, Object, Array],
  // 图片数量限制
  limit: {
    type: Number,
    default: 5
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ['png', 'jpg', 'jpeg']
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  width: { type: String, default: '272px' }, // 宽度
  height: { type: String, default: '200px' } // 高度
})

const { proxy } = getCurrentInstance()
const emit = defineEmits()
const number = ref(0)
const uploadList = ref([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const baseUrl = import.meta.env.VITE_APP_BASE_API
const fileRemoteUrl = import.meta.env.VITE_APP_FILE_API
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + '/common/upload') // 上传的图片服务器地址
const headers = ref({ Authorization: 'Bearer ' + getToken() })
const fileList = ref([])
const showTip = computed(
  () => props.isShowTip && (props.fileType || props.fileSize)
)

watch(
  () => props.modelValue,
  val => {
    if (val) {
      // // 首先将值转为数组
      const list = Array.isArray(val) ? val : props.modelValue.split(',')
      // 然后将数组转为对象数组
      fileList.value = list.map(item => {
        if (!item) {
          return
        }
        if (typeof item === 'string') {
          if (item.indexOf(baseUrl) === -1) {
            item = { name: fileRemoteUrl + item, url: fileRemoteUrl + item }
          } else {
            item = { name: item, url: path }
          }
        } else {
          item.url = item.location?.includes(fileRemoteUrl)
            ? item.location
            : fileRemoteUrl + item.location
        }
        return item
      })
    } else {
      fileList.value = []
      return []
    }
  },
  { deep: true, immediate: true }
)
const fileTypeAll = computed(() => {
  return [...props.fileType, ...props.fileType.map(item => item.toUpperCase())]
})
// 上传前loading加载
function handleBeforeUpload(file) {
  // 检验文件名，包括含特殊字符的文件名不能上传
  const containSpecial =
    /[(\ )(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\+)(\=)(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\/)(\<)(\>)(\?)]+/

  if (containSpecial.test(file.name.slice(0, file.name.lastIndexOf('.')))) {
    proxy.$modal.msgError(
      `文件名不能包含!、@、#、$、空格等特殊字符，请重新上传!`
    )
    return false
  }
  let isImg = false
  if (fileTypeAll.value.length) {
    let fileExtension = ''
    if (file.name.lastIndexOf('.') > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
    }
    isImg = fileTypeAll.value.some(type => {
      if (file.type.indexOf(type) > -1) return true
      if (fileExtension && fileExtension.indexOf(type) > -1) return true
      return false
    })
  } else {
    isImg = file.type.indexOf('image') > -1
  }
  if (!isImg) {
    proxy.$modal.msgError(
      `文件格式不正确, 请上传${props.fileType.join('/')}图片格式文件!`
    )
    return false
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      proxy.$modal.msgError(`上传图片大小不能超过 ${props.fileSize} MB!`)
      return false
    }
  }
  proxy.$modal.loading('正在上传图片，请稍候...')
  number.value++
}

// 文件个数超出
function handleExceed() {
  proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传成功回调
function handleUploadSuccess(res, file) {
  if (res.code === 200) {
    // uploadList.value.push({ name: res.fileName, url: res.fileName })
    uploadList.value.push({
      name: res?.newFileName,
      url: res?.fileName,
      location: res?.fileName,
      type: 'image/jpeg'
    })
    uploadedSuccessfully()
  } else {
    number.value--
    proxy.$modal.closeLoading()
    proxy.$modal.msgError(res.msg)
    proxy.$refs.imageUpload.handleRemove(file)
    // uploadedSuccessfully()
  }
}

// 删除图片
function handleDelete(file) {
  const findex = fileList.value.map(f => f.name).indexOf(file.name)
  if (findex > -1 && uploadList.value.length === number.value) {
    fileList.value.splice(findex, 1)
    emit('update:modelValue', fileList.value)
    emit('updateDelete')
    return false
  }
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value
      .filter(f => f.url !== undefined)
      .concat(uploadList.value)
    uploadList.value = []
    number.value = 0
    // emit('update:modelValue', listToString(fileList.value))
    emit('update:modelValue', fileList.value)
    emit('updateSuccess')
    proxy.$modal.closeLoading()
  }
}

// 上传失败
function handleUploadError() {
  proxy.$modal.msgError('上传图片失败')
  proxy.$modal.closeLoading()
}

// 预览
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

// 对象转成指定字符串分隔
function listToString(list, separator) {
  let strs = ''
  separator = separator || ','
  for (const i in list) {
    if (undefined !== list[i].url && list[i].url.indexOf('blob:') !== 0) {
      strs += list[i].url.replace(baseUrl, '') + separator
    }
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : ''
}
</script>

<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
  display: none;
}
:deep(.el-upload__tip) {
  font-size: 14px;
  font-family: AlibabaPuHuiTi_2_55_Regular;
  color: #b2b5b9;
  line-height: initial;
  margin-top: 10px;
  margin-bottom: 16px;
}
.upload-icon {
  display: inline-block;
  width: 100px;
  height: 100px;
  background: url('@/assets/icons/upload-icon.png') no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.image-upload {
  :deep(.el-upload--picture-card) {
    width: v-bind(width);
    height: v-bind(height);
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
  }
  :deep(.el-upload-list__item.is-success) {
    width: v-bind(width);
    height: v-bind(height);
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
  }
}
</style>
