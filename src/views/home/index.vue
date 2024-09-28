<template>
  <div id='home'>
    <div class='header'>
      <el-button class="login linkButton" link @click="openTabsDialog('0')">登录</el-button>
      <el-button class="register linkButton" link @click="openTabsDialog('1')">注册</el-button>
    </div>
    <div class="main">
      <el-image class="logo" :src="logo" fit="contain"/>
      <div class="example">
        <svg-icon class="chatSvg" icon-class="chat"></svg-icon>
        <div class="chatText">{{ chats[chatIndex].substring(0, chatLen) }}</div>
        <div class="cursor">|</div>
      </div>
    </div>

    <el-dialog
        class="tabsDialog"
        width="350"
        v-model="tabsDialogVis"
        :showClose="false"
        :close-on-click-modal="false"
    >
      <el-tabs class="tabs" type="border-card" v-model="tabsValue">
        <el-tab-pane class="tabPane" label="登录">
          <el-form class="form" :model="loginForm" :rules="loginRules">
            <el-form-item class="formItem" prop="email">
              <el-input class="formInput" size="large" v-model="loginForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item class="formItem" prop="password">
              <el-input class="formInput" size="large" type="password" show-password
                        v-model="loginForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-form>
          <div class="control">
            <el-button @click="closeTabsDialog">取消</el-button>
            <el-button type="primary" @click="login">登录</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane class="tabPane" label="注册">
          <el-form class="form" :model="registerForm" :rules="registerRules">
            <el-form-item class="formItem" prop="email">
              <el-input class="formInput" size="large" v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item class="formItem" prop="verifyCode">
              <el-input class="verifyCodeInput" size="large" v-model="registerForm.verifyCode"
                        placeholder="请输入验证码">
              </el-input>
              <el-button class="verifyCodeButton" type="primary" link @click="sendEmailVerifyCode">{{
                  verifyCodeFlag ? "获取验证码" : verifyCodeTimer + "秒后重试"
                }}
              </el-button>
            </el-form-item>
            <el-form-item class="formItem" prop="userName">
              <el-input class="formInput" size="large" v-model="registerForm.userName"
                        placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item class="formItem" prop="password">
              <el-input class="formInput" size="large" type="password" show-password
                        v-model="registerForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item class="formItem" prop="passwordAgain">
              <el-input class="formInput" size="large" type="password" show-password
                        v-model="registerForm.passwordAgain" placeholder="请再次输入密码"></el-input>
            </el-form-item>
          </el-form>
          <div class="control">
            <el-button @click="closeTabsDialog">取消</el-button>
            <el-button type="primary" @click="register">注册</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import logo from '@/assets/pictures/logo.png'
import {isEmpty, sleep} from "@/utils/common";
import {isEmail, isPassword} from "@/utils/validate";
import {login, register, sendEmailVerifyCode} from "@/apis/loginRegister";

export default {
  name: "Home",
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('请输入合法的邮箱地址'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!isPassword(value)) {
        callback(new Error('请输入包含英文字母和数字的8-30位密码'))
      } else {
        callback()
      }
    }
    const validatePasswordAgain = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不同'))
      } else {
        callback()
      }
    }

    return {
      logo: logo,

      loginForm: {
        email: "",
        password: ""
      },
      registerForm: {
        email: "",
        userName: "",
        password: "",
        passwordAgain: "",
        verifyCode: "",
      },

      tabsDialogVis: false,

      loginRules: {
        email: [{
          required: true,
          trigger: 'blur',
          validator: validateEmail,
        }],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '密码不能为空',
          }
        ]
      },
      registerRules: {
        email: [{
          required: true,
          trigger: 'blur',
          validator: validateEmail
        }],
        userName: [{
          required: true,
          trigger: 'blur',
          message: '用户名不能为空'
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }],
        passwordAgain: [{
          require: true,
          trigger: 'blur',
          validator: validatePasswordAgain
        }],
        verifyCode: [{
          required: true,
          trigger: 'blur',
          message: '验证码不能为空'
        }]
      },

      tabsValue: '0',

      chats: [
        "有哪些常见的机器学习算法？",
        "假设检验中，第一类错误是什么意思？",
        "你可以帮我写一篇以文化多元化为主题的调研报告吗？"
      ],
      chatIndex: 0,
      chatLen: 0,
      chatClock: null,

      verifyCodeFlag: true,
      verifyCodeTimer: 60,
      verifyCodeClock: null,
    }
  },
  created() {
    this.createChatClock1();
  },

  methods: {
    initLoginForm() {
      this.loginForm = {
        email: "",
        password: ""
      }
    },
    initRegisterForm() {
      this.registerForm = {
        email: "",
        userName: "",
        password: "",
        passwordAgain: "",
        verifyCode: "",
      }
    },

    openTabsDialog(tabsValue) {
      this.initLoginForm();
      this.initRegisterForm();
      this.tabsValue = tabsValue;
      this.tabsDialogVis = true;
    },
    closeTabsDialog() {
      this.tabsDialogVis = false;
    },

    login() {
      if (isEmpty(this.loginForm.email)) {
        this.$message.error("请输入邮箱")
      } else if (!isEmail(this.loginForm.email)) {
        this.$message.error('请输入合法的邮箱地址')
      } else if (isEmpty(this.loginForm.password)) {
        this.$message.error('请输入密码')
      } else {
        login(this.loginForm).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            localStorage.setItem('token', res.data.data.token)
            this.$router.push('/chat')
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('系统异常，请联系管理员')
        })
      }
    },
    register() {
      if (isEmpty(this.registerForm.email)) {
        this.$message.error("请输入邮箱")
      } else if (!isEmail(this.registerForm.email)) {
        this.$message.error('请输入合法的邮箱地址')
      } else if (isEmpty(this.registerForm.verifyCode)) {
        this.$message.error('请输入验证码')
      } else if (isEmpty(this.registerForm.userName)) {
        this.$message.error('请输入用户名')
      } else if (isEmpty(this.registerForm.password)) {
        this.$message.error('请输入密码')
      } else if (!isPassword(this.registerForm.password)) {
        this.$message.error('请输入包含英文字母和数字的8-30位密码')
      } else if (isEmpty(this.registerForm.passwordAgain)) {
        this.$message.error('请再次输入密码')
      } else {
        register(this.registerForm).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message);
            this.initLoginForm();
            this.tabsValue = '0';
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(() => {
          this.$message.error('系统异常，请联系管理员')
        })
      }
    },
    sendEmailVerifyCode() {
      if (this.verifyCodeFlag) {
        if (isEmpty(this.registerForm.email)) {
          this.$message.error("请输入邮箱")
        } else if (!isEmail(this.registerForm.email)) {
          this.$message.error('请输入正确的邮箱地址')
        } else {
          sendEmailVerifyCode(this.registerForm.email).then((res) => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              this.verifyCodeFlag = false
              this.verifyCodeTimer = 60
              this.verifyCodeClock = setInterval(() => {
                this.verifyCodeTimer--;
                if (this.verifyCodeTimer === 0) {
                  clearInterval(this.verifyCodeTimer)
                  this.verifyCodeFlag = true
                }
              }, 1000)
            } else {
              this.$message.error(res.data.message)
            }
          }).catch(() => {
            this.$message.error('系统异常，请联系管理员')
          })
        }
      }
    },

    createChatClock1() {
      this.chatClock = setInterval(async () => {
        this.chatLen++;
        if (this.chatLen > this.chats[this.chatIndex].length) {
          clearInterval(this.chatClock);
          await sleep(800);
          this.createChatClock2();
        }
      }, 100)
    },
    createChatClock2() {
      this.chatClock = setInterval(async () => {
        this.chatLen--;
        if (this.chatLen === 0) {
          clearInterval(this.chatClock);
          this.chatIndex = (this.chatIndex + 1) % this.chats.length;
          this.createChatClock1();
        }
      }, 100)
    },
  }
}
</script>

<style scoped>
#home {
  width: 100%;
  height: 100%;

  background: #F3F5FA;
}

#home .header {
  padding: 5px 10px 0 10px;

  text-align: right;
}

#home .header .linkButton {
  margin: 5px 10px 5px 10px;

  outline: none;

  font-size: 20px;
}

#home .header .linkButton:hover {
  color: #46A2FF;
}

#home .main {
  text-align: center;
}

#home .main .logo {
  margin: 130px 0 0 0;

  height: 300px;
}

#home .main .example {
  margin: 10px auto 0 auto;

  width: 500px;
  height: 42px;

  background: #FFFFFF;

  border: 1px solid #D1D1D1;
  border-radius: 15px;

  line-height: 40px;

  text-align: left;
}

#home .main .example .chatSvg {
  vertical-align: middle;

  margin: 0 10px 0 10px;

  width: 25px;
  height: 100%;
}

#home .main .example .chatText {
  vertical-align: middle;
  display: inline-block;

  font-size: 18px;

  user-select: none;
}

#home .main .example .cursor {
  vertical-align: middle;
  display: inline-block;

  font-size: 20px;

  color: #CCCCCC;

  user-select: none;
}

#home /deep/ .tabsDialog {
  padding: 0;
}

#home /deep/ .tabsDialog .el-dialog__header {
  display: none;
}

#home .tabsDialog .tabs .tabPane .form .formItem .formInput {
  width: 100%;
}

#home .tabsDialog .tabs .tabPane .control {
  text-align: right;
}

#home .tabsDialog .tabs .tabPane .form .formItem .verifyCodeInput {
  width: 70%;
}

#home .tabsDialog .tabs .tabPane .form .formItem .verifyCodeButton {
  margin: 0 0 0 10px;
}
</style>