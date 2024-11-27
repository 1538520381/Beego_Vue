<template>
  <div id="personalCenter">
    <svg-icon class="backIcon" icon-class="back" @click="back"></svg-icon>
    <div class="mainContainer">
      <div class="avatarContainer">
        <div class="mainContainer">
          <el-image
              class="avatar"
              :src="
              isEmpty(user.avatarUrl)
                ? user.gender === 0 || isEmpty(user.gender)
                  ? BoyAvatar
                  : GirlAvatar
                : user.avatarUrl
            "
          ></el-image>
          <el-upload
              class="upload-demo"
              action="/api/user/avatar"
              :on-success="avatarUpload"
              :show-file-list="false"
              :headers="{
              Authorization: token,
            }"
          >
            <el-button class="avatarUploadButton">上传头像</el-button>
          </el-upload>
        </div>
      </div>
      <div class="informationContainer">
        <div class="item">
          <div class="key">账号ID：</div>
          <div class="value">
            {{
              user.id +
              "  " +
              "『" +
              (user.tag === "0"
                  ? "开发者"
                  : user.tag === "1"
                      ? "内测用户"
                      : user.tag === "2"
                          ? "普通用户"
                          : "会员") +
              "』"
            }}
          </div>
        </div>
        <div class="item">
          <div class="key">昵称：</div>
          <div class="value">{{ user.userName }}</div>
        </div>
        <div class="item">
          <div class="key">性别：</div>
          <div class="value">{{ user.gender === 0 ? "男" : "女" }}</div>
        </div>
        <div class="item">
          <div class="key">邮箱：</div>
          <div class="value">{{ user.email }}</div>
        </div>
        <!--        <div class="item">-->
        <!--          <div class="key">联系方式：</div>-->
        <!--          <div class="value">{{ user.phone }}</div>-->
        <!--        </div>-->
        <div class="item">
          <div class="key">所在学校：</div>
          <div class="value">{{ user.school }}</div>
        </div>
        <div class="item">
          <div class="key">所在专业：</div>
          <div class="value">{{ user.major }}</div>
        </div>
        <div class="item">
          <div class="key">入学年份：</div>
          <div class="value">{{ user.enterTime }}</div>
        </div>
        <el-button type="primary" @click="openPersonalInformationDialog">修改信息</el-button>
        <el-button type="primary" @click="openChangePasswordDialog">修改密码</el-button>
        <el-button type="danger" @click="logout">退出登录</el-button>
      </div>
    </div>

    <el-dialog
        class="personalInformationDialog"
        v-model="personalInformationDialogVis"
        title="个人信息修改"
        width="350"
        :show-close="false"
        :close-on-click-modal="false"
    >
      <el-form
          class="form"
          :model="personalInformationForm"
          :rules="personalInformationRules"
      >
        <el-form-item class="formItem" prop="userName">
          <el-input
              class="formInput"
              size="large"
              v-model="personalInformationForm.userName"
              placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item class="formInput">
          <el-radio-group
              v-model="personalInformationForm.gender"
              style="padding: 0 0 0 10px"
          >
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
                v-for="(item, index) in schools"
                :key="index"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
            class="formItem"
            prop="major"
            v-if="!isEmpty(personalInformationForm.school)"
        >
          <el-select
              class="formInput"
              v-model="personalInformationForm.major"
              size="large"
              filterable
              placeholder="请选择专业"
          >
            <el-option
                v-for="(item, index) in majors"
                :key="index"
                :label="item"
                :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
            class="formItem"
            prop="elseMajor"
            v-if="personalInformationForm.major === '其他'"
        >
          <el-input
              class="formInput"
              size="large"
              v-model="personalInformationForm.elseMajor"
              placeholder="请输入专业"
          ></el-input>
        </el-form-item>
        <el-form-item class="formItem" prop="enterTime">
          <el-date-picker
              class="formInput"
              size="large"
              v-model="personalInformationForm.enterTime"
              type="year"
              :disabled-date="disabledDate"
              placeholder="请选择入学年份"
          />
        </el-form-item>
      </el-form>
      <div class="control">
        <el-button @click="closePersonalInformationDialog">取消</el-button>
        <el-button type="primary" @click="improvePersonalInformation"
        >确定
        </el-button
        >
      </div>
    </el-dialog>
    <el-dialog class="changePasswordDialog" v-model="changePasswordDialogVis" title="修改密码" width="350"
               :show-close="false" :close-on-click-modal="false">
      <el-form class="changePasswordForm" :rules="changePasswordRules" :model="changePasswordForm">
        <el-form-item class="formItem" prop="email">
          <el-input class="formInput" size="large" v-model="changePasswordForm.email"
                    placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item class="formItem" prop="verifyCode">
          <el-input class="verifyCodeInput" size="large" v-model="changePasswordForm.verifyCode"
                    placeholder="请输入验证码">
          </el-input>
          <el-button class="verifyCodeButton" type="primary" link @click="sendEmailVerifyCode">
            {{
              verifyCodeFlag ? "获取验证码" : verifyCodeTimer + "秒后重试"
            }}
          </el-button>
        </el-form-item>
        <el-form-item class="formItem" prop="password">
          <el-input class="formInput" size="large" type="password" show-password
                    v-model="changePasswordForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="formItem" prop="passwordAgain">
          <el-input class="formInput" size="large" type="password" show-password
                    v-model="changePasswordForm.passwordAgain" placeholder="请再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="control">
        <el-button @click="closeChangePasswordDialog">取消</el-button>
        <el-button type="primary" @click="changePassword">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BoyAvatar from "@/assets/pictures/boyAvatar.png";
import GirlAvatar from "@/assets/pictures/girlAvatar.png";

import SvgIcon from "@/components/svgIcon/index.vue";

import schoolCategoryMajor from "@/jsons/schoolCategoryMajor.json";

import {
  getUserByToken,
  logout,
  sendEmailVerifyCode,
  updateInformation,
  changePassword
} from "@/apis/user";
import {isEmpty} from "@/utils/common";
import {isEmail, isPassword} from "@/utils/validate";

export default {
  name: "PersonalCenter",
  components: {SvgIcon},
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
      if (value !== this.changePasswordForm.password) {
        callback(new Error('两次输入的密码不同'))
      } else {
        callback()
      }
    }
    return {
      BoyAvatar: BoyAvatar,
      GirlAvatar: GirlAvatar,

      token: null,
      user: {},

      schools: [],
      categorys: [],
      majors: [],

      verifyCodeFlag: true,
      verifyCodeTimer: 60,
      verifyCodeClock: null,

      personalInformationForm: {},
      changePasswordForm: {},

      personalInformationRules: {
        userName: [
          {
            required: true,
            trigger: "blur",
            message: "用户名不能为空",
          },
        ],
        school: [
          {
            required: true,
            trigger: "blur",
            message: "所在学校不能为空",
          },
        ],
        major: [
          {
            required: true,
            trigger: "blur",
            message: "专业不能为空",
          },
        ],
        elseMajor: [
          {
            required: true,
            trigger: "blur",
            message: "专业不能为空",
          },
        ],
        enterTime: [
          {
            required: true,
            trigger: "blur",
            message: "入学年份不能为空",
          },
        ],
      },
      changePasswordRules: {
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

      personalInformationDialogVis: false,
      changePasswordDialogVis: false,

      longTextDialogueExecuteEntitys: [],
    };
  },
  async created() {
    this.token = localStorage.getItem("token");
    if (isEmpty(this.token)) {
      this.$router.push("/home");
      this.$message.error("请先登录");
    }

    await this.getUserByToken();

    // this.longTextDialogueExecuteEntitys =
    //   this.$store.state.longTextDialogueExecuteEntitys;
    // setInterval(() => {
    //   this.longTextDialogueQuery();
    // }, 1000 * 60);

    this.initConstant();
    this.initPersonalInformationForm();
    this.initChangePasswordInformationForm();
  },
  methods: {
    initConstant() {
      this.schools = Object.keys(schoolCategoryMajor);
    },
    initPersonalInformationForm() {
      this.personalInformationForm = {
        userName: this.user.userName,
        gender: this.user.gender,
        school: this.user.school,
        major: this.user.major,
        elseMajor: this.user.elseMajor,
        enterTime: new Date().setFullYear(this.user.enterTime),
      };
    },
    initChangePasswordInformationForm() {
      this.changePasswordForm = {
        email: null,
        verifyCode: null,
        password: null,
        passwordAgain: null
      }
    },

    getUserByToken() {
      return getUserByToken()
          .then((res) => {
            if (res.data.code === 200) {
              this.user = {
                id: res.data.data["user_id"],
                email: res.data.data["email"],
                gender: res.data.data["gender"],
                userName: res.data.data["user_name"],
                major: res.data.data["major"],
                school: res.data.data["school"],
                avatarUrl: res.data.data["avatar_url"],
                enterTime: res.data.data["enter_time"],
                tag: res.data.data["tag"],
              };
            } else {
              this.$router.push("/home");
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },
    improvePersonalInformation() {
      if (isEmpty(this.personalInformationForm.userName)) {
        this.$message.error("请输入昵称");
      } else if (isEmpty(this.personalInformationForm.school)) {
        this.$message.error("请选择学校");
      } else if (isEmpty(this.personalInformationForm.major)) {
        this.$message.error("请选择专业");
      } else if (
          this.personalInformationForm.major === "其他" &&
          isEmpty(this.personalInformationForm.elseMajor)
      ) {
        this.$message.error("请输入专业");
      } else if (isEmpty(this.personalInformationForm.enterTime)) {
        this.$message.error("请选择入学年份");
      } else {
        updateInformation({
          userName: this.personalInformationForm.userName,
          gender: this.personalInformationForm.gender,
          school: this.personalInformationForm.school,
          major:
              this.personalInformationForm.major === "其他"
                  ? this.personalInformationForm.elseMajor
                  : this.personalInformationForm.major,
          enterTime: new Date(
              this.personalInformationForm.enterTime
          ).getFullYear(),
        })
            .then((res) => {
              if (res.data.code === 200) {
                this.personalInformationDialogVis = false;
                this.getUserByToken();
                this.$message.success(res.data.message);
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("系统异常，请联系管理员");
            });
      }
    },
    logout() {
      logout()
          .then((res) => {
            if (res.data.code === 200) {
              this.token = null;
              this.user = {};
              this.$router.push("/home");
              localStorage.removeItem("token");
              this.$message.success("注销成功");
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },
    sendEmailVerifyCode() {
      console.log(this.changePasswordForm.email)
      if (this.verifyCodeFlag) {
        if (isEmpty(this.changePasswordForm.email)) {
          this.$message.error("请输入邮箱")
        } else if (!isEmail(this.changePasswordForm.email)) {
          this.$message.error('请输入正确的邮箱地址')
        } else {
          sendEmailVerifyCode(this.changePasswordForm.email).then((res) => {
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
    changePassword() {
      if (isEmpty(this.changePasswordForm.email)) {
        this.$message.error("请输入邮箱")
      } else if (!isEmail(this.changePasswordForm.email)) {
        this.$message.error('请输入合法的邮箱地址')
      } else if (isEmpty(this.changePasswordForm.verifyCode)) {
        this.$message.error('请输入验证码')
      } else if (isEmpty(this.changePasswordForm.password)) {
        this.$message.error('请输入密码')
      } else if (!isPassword(this.changePasswordForm.password)) {
        this.$message.error('请输入包含英文字母和数字的8-30位密码')
      } else if (isEmpty(this.changePasswordForm.passwordAgain)) {
        this.$message.error('请再次输入密码')
      } else if (this.changePasswordForm.password !== this.changePasswordForm.passwordAgain) {
        this.$message.error("两次输入的密码不一致")
      } else {
        changePassword({
          email: this.changePasswordForm.email,
          verifyCode: this.changePasswordForm.verifyCode,
          password: this.changePasswordForm.password
        }).then((res) => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.closeChangePasswordDialog()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('系统异常，请联系管理员')
        })
      }
    },

    avatarUpload(res, file, fileList) {
      if (res.code === 200) {
        this.$message.success("上传成功");
        this.getUserByToken();
      } else {
        this.$message.error(res.message);
      }
    },

    disabledDate(date) {
      return (
          date.getFullYear() < 2010 ||
          date.getFullYear() > new Date().getFullYear()
      );
    },

    openPersonalInformationDialog() {
      this.initPersonalInformationForm();
      this.personalInformationDialogVis = true;
    },
    openChangePasswordDialog() {
      this.initChangePasswordInformationForm();
      this.changePasswordDialogVis = true;
    },
    closePersonalInformationDialog() {
      this.personalInformationDialogVis = false
    },
    closeChangePasswordDialog() {
      this.changePasswordDialogVis = false;
    },

    back() {
      this.$router.go(-1);
    },

    isEmpty(field) {
      return isEmpty(field);
    },

    getMajorBySchool() {
      this.personalInformationForm.major = null;
      this.categorys = Object.keys(
          schoolCategoryMajor[this.personalInformationForm.school]
      );
      this.majors = [];
      for (let i in this.categorys) {
        let majors =
            schoolCategoryMajor[this.personalInformationForm.school][
                this.categorys[i]
                ];
        for (let j in majors) {
          this.majors.push(majors[j]);
        }
      }
    },
  },
};
</script>

<style scoped>
#personalCenter {
  position: relative;

  width: 100%;
  height: 100%;
}

#personalCenter .backIcon {
  position: absolute;

  top: 10px;
  left: 10px;

  width: 40px;
  height: 40px;

  cursor: pointer;
}

#personalCenter .mainContainer {
  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  margin: auto;

  width: 900px;
  height: 600px;

  border-radius: 30px;

  background: #f2f2f2;
}

#personalCenter .mainContainer .avatarContainer {
  display: inline-block;

  position: relative;

  width: 50%;
  height: 100%;
}

#personalCenter .mainContainer .avatarContainer .mainContainer {
  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  margin: auto;

  width: 140px;
  height: calc(140px + 25px + 25px);

  text-align: center;
}

#personalCenter .mainContainer .avatarContainer .mainContainer .avatar {
  width: 140px;
  height: 140px;

  border-radius: 50%;
}

#personalCenter
.mainContainer
.avatarContainer
.mainContainer
.avatarUploadButton {
  width: 80%;
  height: 25px;
}

#personalCenter .mainContainer .informationContainer {
  display: inline-block;

  position: relative;

  vertical-align: top;

  padding: 40px 30px 40px 30px;

  width: calc(50% - 30px * 2);
  height: calc(100% - 40px * 2);

  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;

  background: #c9c9c9;
}

#personalCenter .mainContainer .informationContainer .item {
  width: 100%;
  height: 60px;
}

#personalCenter .mainContainer .informationContainer .item .key {
  display: inline-block;

  vertical-align: top;

  width: 100px;
  height: 50px;

  line-height: 50px;

  font-size: 20px;
  font-weight: bold;
}

#personalCenter .mainContainer .informationContainer .item .value {
  display: inline-block;

  width: calc(100% - 100px);
  height: 50px;

  line-height: 50px;

  font-size: 18px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

#personalCenter .personalInformationDialog .control {
  text-align: right;
}

#personalCenter .personalInformationDialog .form .formItem /deep/ .formInput {
  width: 100%;
}

#personalCenter .changePasswordDialog .changePasswordForm .formItem .verifyCodeInput {
  width: 70%;
}

#personalCenter .changePasswordDialog .changePasswordForm .formItem .verifyCodeButton {
  margin: 0 0 0 10px;
}

#personalCenter .changePasswordDialog .control {
  text-align: right;
}

</style>