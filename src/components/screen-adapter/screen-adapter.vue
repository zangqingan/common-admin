<template>
  <div class="screen-adapter">
    <div
      class="screen-content-wrap"
      id="screen-wrap"
      :style="style">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = {
  w: 1920, // 设计图宽度px
  h: 1030, // 设计图高度px
  delay: 500 // 防抖延时ms
}

const style = reactive({
  width: `${props.w}px`,
  height: `${props.h}px`,
  transform: 'scale(1) translate(-50%, -50%)' // 默认不缩放，垂直水平居中
})

const onResize = () => {
  let timer = null
  window.addEventListener('resize', function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      setScale()
    }, props.delay)
  })
}

// 获取缩放比例
const getScale = () => {
  const w = window.innerWidth / props.w
  const h = window.innerHeight / props.h
  return w < h ? w : h
}

// // 获取缩放比例X
// const getScaleX = () => {
//   const w = window.innerWidth / props.w
//   return w
// }
// // 获取缩放比例Y
// const getScaleY = () => {
//   const h = window.innerHeight / props.h
//   return h
// }

// 设置缩放比例
const setScale = () => {
  style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}

onMounted(() => {
  setScale()
  onResize()
})

onBeforeMount(() => {
  window.removeEventListener('resize', setScale)
})
provide('scale', getScale())
</script>

<style lang="scss" scoped>
.screen-adapter {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: overlay;
  position: relative;

  // background: url("../../assets/charts/icon-bg.png") no-repeat;
  // background-size: 100% 100%;
  .screen-content-wrap {
    transform-origin: 0 0;
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    transition: 0.3s;
    // background-color: #cccccc;
  }
}
</style>
