<template>
  <div id="personalCenter">
    <svg-icon class="backIcon" icon-class="back" @click="back"></svg-icon>
    <div class="mainContainer">
      <div class="avatarContainer">
        <el-image class="avatar" :src="test"></el-image>
      </div>
      <div class="informationContainer">
        <div class="item">
          <div class="key">昵称：</div>
          <div class="value">{{ user.userName }}</div>
        </div>
        <div class="item">
          <div class="key">联系方式：</div>
          <div class="value">{{ user.phone }}</div>
        </div>
        <div class="item">
          <div class="key">所在院校：</div>
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
import test from '@/assets/pictures/test.jpg'
import SvgIcon from "@/components/svgIcon/index.vue";

export default {
  name: "PersonalCenter",
  components: {SvgIcon},
  data() {
    return {
      test: test,

      token: null,
      user: {
        userName: 'Persolute',
        phone: '18811111111',
        school: '家里蹲大学',
        major: '计算机科学与技术',
        enterTime: '2022年6月'
      },
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
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

#personalCenter .mainContainer .avatarContainer .avatar {
  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  margin: auto;

  width: 100px;
  height: 100px;

  border-radius: 50%;
}

#personalCenter .mainContainer .informationContainer {
  display: inline-block;

  position: relative;

  vertical-align: top;

  padding: 40px 30px 40px 30px;

  width: calc(50% - 30px * 2);
  height: calc(100% - 40px * 2);

  border-radius: 30px;

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