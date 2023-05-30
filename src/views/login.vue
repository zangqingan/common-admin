<template>
  <div class="login">
    <div class="login-title">青安科技有限责任公司</div>
    <el-form
      ref="loginRef"
      label-position="top"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      hide-required-asterisk>
      <h3 class="title">Hi，欢迎登录！</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          text
          size="large"
          autocomplete="off"
          placeholder="用户名">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :type="[flag ? 'text' : 'password']"
          size="large"
          autocomplete="new-password"
          placeholder="密码"
          @keyup.enter="handleLogin">
          <template #suffix>
            <i
              :class="[flag ? 'el-icon-minus' : 'el-icon-view']"
              autocomplete="auto"
              @click="flag = !flag"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin-bottom: 40px"
        >记住密码</el-checkbox
      >
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          class="login-btn"
          @click.prevent="handleLogin">
          <span v-if="!loading">登录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div
          style="float: right"
          v-if="register">
          <router-link
            class="link-type"
            :to="'/register'"
            >立即注册</router-link
          >
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span> © Copyright Reserved 青安科技有限责任公司版权所有</span>
    </div>
  </div>
</template>

<script setup>
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const router = useRouter()
const { proxy } = getCurrentInstance()
const flag = ref(false)
const loginForm = ref({
  username: 'admin',
  password: 'admin123',
  rememberMe: false,
  code: '',
  uuid: ''
})

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
}

const codeUrl = ref('')
const loading = ref(false)
// 验证码开关
const captchaEnabled = ref(true)
// 注册开关
const register = ref(false)
const redirect = ref(undefined)

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set('username', loginForm.value.username, { expires: 30 })
        Cookies.set('password', encrypt(loginForm.value.password), {
          expires: 30
        })
        Cookies.set('rememberMe', loginForm.value.rememberMe, { expires: 30 })
      } else {
        // 否则移除
        Cookies.remove('username')
        Cookies.remove('password')
        Cookies.remove('rememberMe')
      }
      // 调用action的登录方法
      userStore
        .login(loginForm.value)
        .then(() => {
          router.push({ path: redirect.value || '/' })
        })
        .catch(() => {
          loading.value = false
          // 重新获取验证码
          if (captchaEnabled.value) {
            getCode()
          }
        })
    }
  })
}

function getCode() {
  getCodeImg().then(res => {
    captchaEnabled.value =
      res.captchaEnabled === undefined ? true : res.captchaEnabled
    if (captchaEnabled.value) {
      codeUrl.value = 'data:image/gif;base64,' + res.img
      loginForm.value.uuid = res.uuid
    }
  })
}

function getCookie() {
  const username = Cookies.get('username')
  const password = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  }
}

// getCode();
getCookie()
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  background-image: url('@/assets/images/login/login-bg.jpg');
  background-size: cover;
  position: relative;
}
.login-title {
  position: absolute;
  top: 80px;
  left: 100px;
  color: #fff;
  font-size: 32px;
}
.title {
  margin: 0px auto 48px auto;
  text-align: left;
  font-size: 24px;
  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
  font-weight: bold;
  color: #2d2f30;
}

.login-form {
  border-radius: 8px;
  background: #ffffff;
  width: 420px;
  margin-right: 180px;
  padding: 48px 32px 18px 32px;
  .el-input {
    height: 48px;
    :deep(.el-input__inner) {
      height: 48px;
    }
    :deep(.el-input__suffix) {
      align-items: center;
    }
    :deep(.el-form-item.is-error, .el-input__inner) {
      box-shadow: 0 0 0 1px #f66a4c inset;
    }
  }
  :deep(.el-form-item--default) {
    margin-bottom: 20px;
  }
  :deep(.el-form-item__error) {
    line-height: 18px;
    color: #f66a4c;
  }

  .el-icon-minus {
    width: 24px;
    height: 24px;
    background: url('@/assets/images/login/password2.png') no-repeat center
      center;
    cursor: pointer;
  }
  .el-icon-view {
    width: 24px;
    height: 24px;
    background: url('@/assets/images/login/password1.png') no-repeat center
      center;
    cursor: pointer;
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-btn {
  width: 100%;
  background-color: #428aff;
  height: 56px;
}
.el-login-footer {
  width: 100%;
  height: 16px;
  font-size: 16px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  line-height: 24px;
  position: fixed;
  bottom: 48px;
  text-align: center;
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
