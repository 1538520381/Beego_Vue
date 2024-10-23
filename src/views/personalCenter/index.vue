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
          <div class="key">昵称：</div>
          <div class="value">{{ user.userName }}</div>
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
      </div>
    </div>
  </div>
</template>

<script>
import BoyAvatar from '@/assets/pictures/boyAvatar.png';
import GirlAvatar from '@/assets/pictures/girlAvatar.png';

import SvgIcon from "@/components/svgIcon/index.vue";

import {getUserByToken} from "@/apis/user";
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
    }
  },
  async created() {
    this.token = localStorage.getItem("token");
    if (isEmpty(this.token)) {
      this.$router.push("/home");
      this.$message.error("请先登录")
    }

    await this.getUserByToken()
  },
  methods: {
    getUserByToken() {
      return getUserByToken().then((res) => {
        if (res.data.code === 200) {
          this.user = {
            id: res.data.data['user_id'],
            email: res.data.data['email'],
            userName: res.data.data['user_name'],
            major: res.data.data['major'],
            // phone: res.data.data['phone'],
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

    avatarUpload(res, file, fileList) {
      if (res.code === 200) {
        this.$message.success("上传成功")
        this.getUserByToken()
      } else {
        this.$message.error(res.message)
      }
    },

    back() {
      this.$router.go(-1);
    },

    isEmpty(field) {
      return isEmpty(field)
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

  width: 100px;
  height: calc(100px + 25px + 25px);

  text-align: center;
}

#personalCenter .mainContainer .avatarContainer .mainContainer .avatar {
  width: 100px;
  height: 100px;

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
  height: 50px;
}

#personalCenter .mainContainer .informationContainer .item .key {
  display: inline-block;

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
</style>