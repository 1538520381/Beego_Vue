<template>
  <div id="personalCenter">
    <svg-icon class="backIcon" icon-class="back" @click="back"></svg-icon>
    <div class="mainContainer">
      <div class="avatarContainer">
        <div class="mainContainer">
          <el-image class="avatar"
                    :src="isEmpty(user.avatarUrl) ? ((user.gender === 0 || isEmpty(user.gender))? BoyAvatar : GirlAvatar) : user.avatarUrl"></el-image>
          <el-upload
              class="upload-demo"
              action="/api/user/avatar"
              :on-success="avatarUpload"
              :show-file-list="false"
              :headers="{
                'Authorization':token
              }"
          >
            <el-button class="avatarUploadButton">上传头像</el-button>
          </el-upload>
        </div>
      </div>
      <div class="informationContainer">
        <div class="item">
          <div class="key">账号ID：</div>
          <div class="value">{{ user.id }}</div>
        </div>
        <div class="item">
          <div class="key">昵称：</div>
          <div class="value">{{ user.userName }}</div>
        </div>
        <div class="item">
          <div class="key">性别：</div>
          <div class="value">{{ user.gender === 0 ? '男' : '女' }}</div>
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
        <el-button type="primary">意见反馈</el-button>
        <el-button type="danger" @click="logout">退出登录</el-button>
      </div>
    </div>

    <el-dialog class="personalInformationDialog" v-model="personalInformationDialogVis" title="个人信息修改"
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
import BoyAvatar from '@/assets/pictures/boyAvatar.png';
import GirlAvatar from '@/assets/pictures/girlAvatar.png';

import SvgIcon from "@/components/svgIcon/index.vue";

import schoolCategoryMajor from '@/jsons/schoolCategoryMajor.json'

import {getUserByToken, improvePersonalInformation, logout} from "@/apis/user";
import {isEmpty} from "@/utils/common";

export default {
  name: "PersonalCenter",
  components: {SvgIcon},
  data() {
    return {
      BoyAvatar: BoyAvatar,
      GirlAvatar: GirlAvatar,

      token: null,
      user: {},

      schools: [],
      categorys: [],
      majors: [],

      personalInformationForm: {},

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

      personalInformationDialogVis: false
    }
  },
  async created() {
    this.token = localStorage.getItem("token");
    if (isEmpty(this.token)) {
      this.$router.push("/home");
      this.$message.error("请先登录")
    }

    await this.getUserByToken()

    this.initConstant()
    this.initPersonalInformationForm()
  },
  methods: {
    initConstant() {
      this.schools = Object.keys(schoolCategoryMajor)
    },
    initPersonalInformationForm() {
      this.personalInformationForm = {
        userName: this.user.userName,
        gender: this.user.gender,
        school: this.user.school,
        major: this.user.major,
        elseMajor: this.user.elseMajor,
        enterTime: new Date().setFullYear(this.user.enterTime),
      }
    },


    getUserByToken() {
      return getUserByToken().then((res) => {
        if (res.data.code === 200) {
          this.user = {
            id: res.data.data['user_id'],
            email: res.data.data['email'],
            gender: res.data.data['gender'],
            userName: res.data.data['user_name'],
            major: res.data.data['major'],
            school: res.data.data['school'],
            avatarUrl: res.data.data['avatar_url'],
            enterTime: res.data.data['enter_time'],
          }
        } else {
          this.$router.push("/home");
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
          enterTime: new Date(this.personalInformationForm.enterTime).getFullYear(),
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
    logout() {
      logout().then((res) => {
        if (res.data.code === 200) {
          this.token = null
          this.user = {}
          this.$router.push("/home")
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


    avatarUpload(res, file, fileList) {
      if (res.code === 200) {
        this.$message.success("上传成功")
        this.getUserByToken()
      } else {
        this.$message.error(res.message)
      }
    },

    openPersonalInformationDialog() {
      this.initPersonalInformationForm()
      this.personalInformationDialogVis = true
    },

    back() {
      this.$router.go(-1);
    },

    isEmpty(field) {
      return isEmpty(field)
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
  }
}
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

  background: #F2F2F2;
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

#personalCenter .mainContainer .avatarContainer .mainContainer .avatarUploadButton {
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

  background: #C9C9C9;
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
}

#personalCenter .personalInformationDialog .control {
  text-align: right;
}

#personalCenter .personalInformationDialog .form .formItem /deep/ .formInput {
  width: 100%;
}
</style>