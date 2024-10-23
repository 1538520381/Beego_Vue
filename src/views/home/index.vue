<template>
  <div id='home' v-if="initFlag">
    <div class='header' :class="{'gaussianBlur':tabsDialogVis || personalInformationDialogVis}">
      <div class="leftHeader">
        <!--        <el-image class="bee" :src="bee" fit="contain"></el-image>-->
        <!--        <div class="slogan">B E E G O · 必 过</div>-->
        <el-image class="bee" :src="logo" fit="contain"></el-image>
      </div>
      <div class="rightHeader">
        <el-button class="loginButton button" @click="openTabsDialog('0')" v-if="isEmpty(token)">登录</el-button>
        <el-button class="registerButton button" @click="openTabsDialog('1')" v-if="isEmpty(token)">注册</el-button>
        <div class="welcome" v-if="!isEmpty(token)">{{
            "欢迎您," + (isEmpty(user.userName) ? user.email : user.userName)
          }}
        </div>
        <el-button class="logoutButton button" @click="logout" v-if="!isEmpty(token)">注销</el-button>
      </div>
    </div>
    <div class="main" :class="{'gaussianBlur':tabsDialogVis || personalInformationDialogVis}">
      <!--      <el-image class="logo" :src="logo" fit="contain"/>-->
      <!--      <br>-->
      <!--      <el-button class="experienceNow" @click="isEmpty(token) ? openTabsDialog('0') : toWorkBench() ">立即体验</el-button>-->
      <!--      <div class="example">-->
      <!--        <div class="example1">Beego 最懂你的AI学习助手</div>-->
      <!--        <div class="example2">{{ '我可以帮你' + chats[chatIndex].substring(0, chatLen) + '|' }}</div>-->
      <!--        &lt;!&ndash;        <svg-icon class="chatSvg" icon-class="chat"></svg-icon>&ndash;&gt;-->
      <!--        &lt;!&ndash;        <div class="chatText">{{ chats[chatIndex].substring(0, chatLen) }}</div>&ndash;&gt;-->
      <!--        &lt;!&ndash;        <div class="cursor">|</div>&ndash;&gt;-->
      <!--      </div>-->
      <div class="example">
        <div class="example2">{{ '我可以帮你' + chats[chatIndex].substring(0, chatLen) + '|' }}</div>
        <div class="example1">贴合高校使用场景，最懂大学生的AI学习软件</div>
      </div>
      <el-button class="experienceNow" @click="isEmpty(token) ? openTabsDialog('0') : toWorkBench() ">开始体验，Let's
        Beego!
      </el-button>
    </div>

    <el-dialog
        class="tabsDialog"
        width="350"
        v-model="tabsDialogVis"
        :showClose="false"
        :close-on-click-modal="false"
    >
      <template #header>
        <div class="header">
          <el-image class="logo" :src="logo" fit="contain"></el-image>
        </div>
      </template>
      <el-tabs class="tabs" v-model="tabsValue">
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
              <el-button class="verifyCodeButton" type="primary" link @click="sendEmailVerifyCode">
                {{
                  verifyCodeFlag ? "获取验证码" : verifyCodeTimer + "秒后重试"
                }}
              </el-button>
            </el-form-item>
            <!--            <el-form-item class="formItem" prop="userName">-->
            <!--              <el-input class="formInput" size="large" v-model="registerForm.userName"-->
            <!--                        placeholder="请输入用户名"></el-input>-->
            <!--            </el-form-item>-->
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

    <el-dialog class="personalInformationDialog" v-model="personalInformationDialogVis" title="个人信息完善"
               width="350" :show-close="false" :close-on-click-modal="false">
      <el-form class="form" :model="personalInformationForm" :rules="personalInformationRules">
        <el-form-item class="formItem" prop="userName">
          <el-input class="formInput" size="large" v-model="personalInformationForm.userName"
                    placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item class="formInput">
          <el-radio-group v-model="personalInformationForm.gender" style="padding: 0 0 0 10px">
            <el-radio :value="0" size="large">男</el-radio>
            <el-radio :value="1" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="formItem" prop="school">
          <el-select
              class="formInput"
              v-model="personalInformationForm.school"
              size="large"
              filterable
              placeholder="请选择学校"
              @change="getMajorBySchool"
          >
            <el-option
                v-for="(item,index) in schools"
                :key="index"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="formItem" prop="major" v-if="!isEmpty(personalInformationForm.school)">
          <el-select
              class="formInput"
              v-model="personalInformationForm.major"
              size="large"
              filterable
              placeholder="请选择专业"
          >
            <el-option
                v-for="(item,index) in majors"
                :key="index"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="formItem" prop="elseMajor" v-if="personalInformationForm.major === '其他'">
          <el-input class="formInput" size="large" v-model="personalInformationForm.elseMajor"
                    placeholder="请输入专业"></el-input>
        </el-form-item>
        <el-form-item class="formItem" prop="enterTime">
          <el-date-picker
              class="formInput" size="large" v-model="personalInformationForm.enterTime" type="year"
              placeholder="请选择入学年份"/>
        </el-form-item>
      </el-form>
      <div class="control">
        <el-button type="primary" @click="improvePersonalInformation">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import logo from '@/assets/pictures/logo.png'

import schoolCategoryMajor from '@/jsons/schoolCategoryMajor.json'

import {isEmpty, sleep} from "@/utils/common";
import {isEmail, isPassword} from "@/utils/validate";
import {getUserByToken, improvePersonalInformation, login, logout, register, sendEmailVerifyCode} from "@/apis/user";

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
      // bee: bee,
      logo: logo,

      token: null,
      user: {},

      schools: [],
      categorys: [],
      majors: [],

      loginForm: {},
      registerForm: {},
      personalInformationForm: {},

      tabsDialogVis: false,
      personalInformationDialogVis: false,

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
      personalInformationRules: {
        userName: [{
          required: true,
          trigger: 'blur',
          message: '用户名不能为空'
        }],
        school: [{
          required: true,
          trigger: 'blur',
          message: '所在学校不能为空'
        }],
        major: [{
          required: true,
          trigger: 'blur',
          message: '专业不能为空'
        }],
        elseMajor: [{
          required: true,
          trigger: 'blur',
          message: '专业不能为空'
        }],
        enterTime: [{
          required: true,
          trigger: 'blur',
          message: '入学年份不能为空'
        }]
      },

      tabsValue: '0',

      chats: [
        "查询常见的机器学习算法",
        "解释第一类错误是什么意思",
        "写一篇以文化多元化为主题的调研报告"
      ],
      chatIndex: 0,
      chatLen: 0,
      chatClock: null,

      verifyCodeFlag: true,
      verifyCodeTimer: 60,
      verifyCodeClock: null,

      initFlag: false
    }
  },
  async created() {
    this.token = localStorage.getItem("token");

    if (!isEmpty(this.token)) {
      await this.getUserByToken()
    }

    this.initConstant()
    this.initLoginForm()
    this.initRegisterForm()
    this.initPersonalInformationForm()

    this.createChatClock1();

    this.initFlag = true
  },
  unmounted() {
    clearInterval(this.chatClock);
  },
  methods: {
    initConstant() {
      this.schools = Object.keys(schoolCategoryMajor)
    },
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
    initPersonalInformationForm() {
      this.personalInformationForm = {
        userName: "",
        gender: 0,
        school: "",
        major: "",
        elseMajor: "",
        enterTime: "",
      }
    },

    getUserByToken() {
      console.log(this.token)
      return getUserByToken().then((res) => {
        if (res.data.code === 200) {
          this.user = {
            id: res.data.data['user_id'],
            email: res.data.data['email'],
            gender: res.data.data['gender'],
            userName: res.data.data['user_name']
          }
        } else if (res.data.code === 201) {
          this.initPersonalInformationForm()
          this.personalInformationDialogVis = true
        } else {
          this.token = null
          this.user = {}
          localStorage.removeItem("token");
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
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
            this.token = res.data.data.token
            localStorage.setItem("token", res.data.data.token)
            this.getUserByToken()
            this.tabsDialogVis = false
            this.toWorkBench()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((err) => {
          console.log(err)
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
        }).catch((err) => {
          console.log(err)
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
          }).catch((err) => {
            console.log(err)
            this.$message.error('系统异常，请联系管理员')
          })
        }
      }
    },
    logout() {
      logout().then((res) => {
        if (res.data.code === 200) {
          this.token = null
          this.user = {}
          localStorage.removeItem("token");
          this.$message.success("注销成功");
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },
    improvePersonalInformation() {
      if (isEmpty(this.personalInformationForm.userName)) {
        this.$message.error("请输入昵称")
      } else if (isEmpty(this.personalInformationForm.school)) {
        this.$message.error("请选择学校")
      } else if (isEmpty(this.personalInformationForm.major)) {
        this.$message.error("请选择专业")
      } else if (this.personalInformationForm.major === '其他' && isEmpty(this.personalInformationForm.elseMajor)) {
        this.$message.error("请输入专业")
      } else if (isEmpty(this.personalInformationForm.enterTime)) {
        this.$message.error("请选择入学年份")
      } else {
        improvePersonalInformation({
          userName: this.personalInformationForm.userName,
          gender: this.personalInformationForm.gender,
          school: this.personalInformationForm.school,
          major: this.personalInformationForm.major === '其他' ? this.personalInformationForm.elseMajor : this.personalInformationForm.major,
          enterTime: this.personalInformationForm.enterTime.getFullYear(),
        }).then((res) => {
          if (res.data.code === 200) {
            this.personalInformationDialogVis = false
            this.getUserByToken()
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('系统异常，请联系管理员')
        })
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

    toWorkBench() {
      this.$router.push("/workBench");
    },

    getMajorBySchool() {
      this.personalInformationForm.major = null
      this.categorys = Object.keys(schoolCategoryMajor[this.personalInformationForm.school])
      this.majors = []
      for (let i in this.categorys) {
        let majors = schoolCategoryMajor[this.personalInformationForm.school][this.categorys[i]]
        for (let j in majors) {
          this.majors.push(majors[j])
        }
      }
    },

    isEmpty(field) {
      return isEmpty(field)
    }
  }
}
</script>

<style scoped>
#home {
  width: 100%;
  height: 100%;

  //background: #F3F5FA;
}

#home .header {
  display: flex;

  justify-content: space-between;

  padding: 5px 10px 0 10px;

  height: 50px;

  text-align: right;
}

#home .header .leftHeader .bee {
  display: inline-block;

  //width: 100px;
  height: 100px;
}

#home .header .leftHeader .slogan {
  display: inline-block;

  vertical-align: top;

  height: 100%;

  line-height: 50px;

  font-size: 20px;
}

#home .header .rightHeader .button {
  vertical-align: top;

  margin: 5px 10px 5px 10px;
  padding: 0 0 0 0;

  width: 80px;
  height: calc(100% - 5px * 2);

  border-radius: 20px;

  outline: none;

  font-size: 20px;
}

#home .header .rightHeader .welcome {
  display: inline-block;

  height: 100%;

  line-height: 50px;

  font-size: 20px;
}

#home .header .rightHeader .button:hover {
  color: #46A2FF;
}

#home .main {
  position: absolute;

  margin: auto;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  height: calc(80px + 45px + 40px + 40px + 40px);

  text-align: center;
}

#home .main .logo {
  height: 300px;
}


#home .main .example2 {
  height: 80px;

  font-size: 50px;
  font-family: "Noto Sans SC";
}

#home .main .example1 {
  height: 45px;

  font-size: 30px;
  font-weight: bold;
  font-family: "Noto Sans SC";
}

#home .main .experienceNow {
  margin: 40px 0 0 0;

  height: 40px;

  border-radius: 20px;

  background: #E7E6E6;

  font-size: 16px;

  color: #000000;
}

/*
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
*/

/*
#home /deep/ .tabsDialog {
  padding: 0;
}
 */

/*
#home /deep/ .tabsDialog .el-dialog__header {
  display: none;
}
 */

#home .tabsDialog .header {
  padding: 0 0 0 0;

  width: 100%;
  height: 100px;
}

#home .tabsDialog .header .logo {
  height: 100%;

  margin: 0 auto;
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

#home .personalInformationDialog .control {
  text-align: right;
}

#home .personalInformationDialog .form .formItem /deep/ .formInput {
  width: 100%;
}

#home .gaussianBlur {
  filter: blur(10px);
}
</style>