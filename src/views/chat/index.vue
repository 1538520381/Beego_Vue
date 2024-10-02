<template>
  <div id="chat">
    <el-menu class="robotMenu" default-active="0" @select="selectRobotMenu">
      <el-scrollbar class="robotMenuScrollbar">
        <el-menu-item class="robotMenuItem" v-for="(item,value) in robots" :index="String(value)">
          <div class="robotMenuItemContainer">
            <el-image class="robotMenuItemImage" :src="item.avatar" fit="fill"/>
            <div class="robotMenuItemTitle">{{ item.name }}</div>
          </div>
        </el-menu-item>
      </el-scrollbar>
      <div class="logo">
        <el-image class="logoImage" :src="test" fit="fill"/>
        <div></div>
      </div>
    </el-menu>

    <el-menu class="sessionMenu" v-if="sessionMenuShow">
      <el-button class="addSessionButton" link>新增对话</el-button>
      <el-scrollbar class="sessionMenuScrollbar">

      </el-scrollbar>
      <div class="user">
        <el-image class="userAvatar" round :src="test"></el-image>
        <div class="userName">{{ user.userName }}</div>
      </div>
    </el-menu>

    <el-button class="sessionMenuControllerButton sessionMenuControllerButtonOpen" v-if="sessionMenuShow"
               @click="closeSessionMenu"
               :icon="ArrowLeftBold" circle/>
    <el-button class="sessionMenuControllerButton sessionMenuControllerButtonClose" v-else @click="openSessionMenu"
               :icon="ArrowRightBold" circle/>


    <div class="mainContainer" :class="{mainContainerShort:sessionMenuShow,mainContainerLong:!sessionMenuShow}">
      <div class="patterns" v-if="patternActive === 1">
        <div class="pattern2 pattern2unactive" @click="selectPattern(2)">
          工作台
        </div>
        <div class="pattern1 pattern1active" @click="selectPattern(1)">
          学习角
        </div>
      </div>
      <div class="patterns" v-else>
        <div class="pattern1 pattern1unactive" @click="selectPattern(1)">
          学习角
        </div>
        <div class="pattern2 pattern2active" @click="selectPattern(2)">
          工作台
        </div>
      </div>

      <el-scrollbar class="chatArea" ref="chatArea" label="chatArea" id="chatArea">
        <div class="chatAreaInner" ref="chatAreaInner">
          <div class="chatRow" v-for="(item,index) in chatMessages" v-if="initFlag">
            <div class="chatRobot" v-if="item.role === 'robot'">
              <el-image class="chatRobotAvatar" :src="robots[robotActive].avatar"></el-image>
              <div class="chatRobotMessage" v-html="markdownToHtml(item.message)"></div>
            </div>

            <div class="chatUser" v-if="item.role === 'user'">
              <div class="chatUserMessage" v-html="markdownToHtml(item.message)"></div>
              <el-image class="chatUserAvatar" :src="test"></el-image>
            </div>
          </div>
        </div>
      </el-scrollbar>

      <div class="inputArea">
        <el-button class="fileUploadButton" :icon="Folder" circle></el-button>
        <el-input
            class="chatInput"
            v-model="chatInput"
            :rows="2"
            :autosize="{minRows:2,maxRows:8}"
            type="textarea"
            resize="none"
            placeholder="开始创作你的提示词吧"
        />
        <el-button class="sendButton">
          <svg-icon class="sendButtonIcon" icon-class="send"></svg-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import test from '@/assets/pictures/test.jpg'

import {ref} from 'vue'
import {marked} from 'marked';

import {ArrowLeftBold, ArrowRightBold, Folder} from '@element-plus/icons-vue'

import {getRobotList} from "@/apis/chat";
import {isEmpty} from "@/utils/common";
import {getUserByToken} from "@/apis/user";
import SvgIcon from "@/components/svgIcon/index.vue";

export default {
  name: 'Chat',
  components: {SvgIcon},
  data() {
    return {
      test: test,

      token: null,
      user: {},

      ArrowLeftBold: ArrowLeftBold,
      ArrowRightBold: ArrowRightBold,
      Folder: Folder,

      robots: [],
      chatMessages: [
        {
          role: 'robot',
          message: "看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！"
        },
        {
          role: 'user',
          message: "看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！"
        },
        {
          role: 'robot',
          message: "看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！"
        },
        {
          role: 'user',
          message: "看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！"
        },
        {
          role: 'robot',
          message: "看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！"
        },
        {
          role: 'user',
          message: "看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！"
        },
        {
          role: 'robot',
          message: "看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！"
        },
        {
          role: 'user',
          message: "看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！"
        },
        {
          role: 'robot',
          message: "看起来你发送了一串数字。如果你有具体的问题或需要讨论的主题，请告诉我！"
        }
      ],

      chatInput: "",

      sessionMenuShow: true,
      patternActive: 2,
      robotActive: 0,

      initFlag: false
    }
  },
  setup() {
    const chatArea = ref(null);
    const chatAreaInner = ref(null);

    const scrollToBottom = () => {
      const bottom = chatAreaInner.value.clientHeight; // 获取内容总高度
      chatArea.value.setScrollTop(bottom); // 滚动到底部
    };

    return {
      chatAreaInner, chatArea, scrollToBottom
    }
  },
  async created() {
    this.token = localStorage.getItem("token");
    if (isEmpty(this.token)) {
      this.$router.push("/home");
      this.$message.error("请先登录")
    }

    await this.getUserByToken()
    await this.getRobotList()

    this.initFlag = true

    this.$nextTick(() => {
      this.scrollToBottom()
    })
  },
  methods: {
    getUserByToken() {
      return getUserByToken().then((res) => {
        if (res.data.code === 200) {
          this.user = {
            id: res.data.data['user_id'],
            email: res.data.data['email'],
            userName: res.data.data['user_name']
          }
          console.log(this.user)
        } else {
          this.$router.push("/home");
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },
    getRobotList() {
      return getRobotList().then((res) => {
        if (res.data.code === 200) {
          this.robots = []
          for (let robot in res.data.data) {
            this.robots.push({
              id: res.data.data[robot]['bot_id'],
              avatar: res.data.data[robot]['bot_avatar'],
              name: res.data.data[robot]['bot_name'],
              description: res.data.data[robot]['description'],
            })
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },

    closeSessionMenu() {
      this.sessionMenuShow = false
    },
    openSessionMenu() {
      this.sessionMenuShow = true
    },

    selectPattern(patternActive) {
      this.patternActive = patternActive
    },

    selectRobotMenu(index) {
      this.robotActive = parseInt(index);
    },

    markdownToHtml(text) {
      return marked(text);
    },
  },
}
</script>

<style>
#chat {
  width: 100%;
  height: 100%;
}

#chat .robotMenu {
  display: inline-block;

  vertical-align: top;

  width: 120px;
  height: 100%;

  border: 0;

  background: #E6E6E6;
}

#chat .robotMenu .robotMenuScrollbar {
  width: 100%;
  height: calc(100% - 120px);
}

#chat .robotMenu .robotMenuScrollbar .robotMenuItem {
  height: auto;

  padding: 5px 20px 5px 20px;
}

#chat .robotMenu .robotMenuScrollbar .robotMenuItem .robotMenuItemContainer .robotMenuItemImage {
  width: 80px;
  height: 80px;
}

#chat .robotMenu .robotMenuScrollbar .robotMenuItem .robotMenuItemContainer .robotMenuItemTitle {
  height: 30px;

  line-height: 30px;

  text-align: center;
}

#chat .robotMenu .logo {
  margin: 20px 0 20px 0;

  text-align: center;
}

#chat .robotMenu .logo .logoImage {
  width: 80px;
  height: 80px;
}

#chat .sessionMenu {
  display: inline-block;

  vertical-align: top;

  width: 200px;
  height: 100%;

  border: 0;

  text-align: center;

  background: #C9C9C9;
}

#chat .sessionMenu .sessionMenuScrollbar {
  width: 100%;
  height: calc(100% - 60px - 120px);
}

#chat .sessionMenu .addSessionButton {
  margin: 10px 0 0 0;

  width: 80%;
  height: 50px;

  border: 2px dotted #000000;

  font-size: 20px;
}

#chat .sessionMenuControllerButton {
  position: absolute;

  width: 30px;
  height: 30px;

  z-index: 1;
}

#chat .sessionMenuControllerButtonClose {
  top: calc(50% - 30px / 2);
  left: calc(120px - 30px / 2);
}

#chat .sessionMenuControllerButtonOpen {
  top: calc(50% - 30px / 2);
  left: calc(120px + 200px - 30px / 2);
}

#chat .sessionMenu .user {
  margin: 30px 0 30px 0;

  width: 100%;
  height: 60px;
}

#chat .sessionMenu .user .userAvatar {
  display: inline-block;

  vertical-align: top;

  width: 60px;
  height: 60px;

  border-radius: 50%;
}

#chat .sessionMenu .userName {
  display: inline-block;

  vertical-align: top;

  padding: 0 10px 0 10px;

  height: 60px;

  font-size: 20px;

  line-height: 60px;
}

#chat .mainContainer {
  display: inline-flex;
  flex-flow: column;

  position: relative;

  vertical-align: top;

  height: 100%;
}

#chat .mainContainerShort {
  width: calc(100% - 120px - 200px);
}

#chat .mainContainerLong {
  width: calc(100% - 120px);
}

#chat .mainContainer .patterns {
  position: relative;

  width: 100%;
  height: 60px;
}

#chat .mainContainer .patterns .pattern1 {
  position: absolute;

  top: -1px;
  left: 0;

  height: 60px;

  font-size: 24px;

  line-height: 60px;
}

#chat .mainContainer .patterns .pattern1:before {
  content: '';

  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: #F2F2F2;

  transform: perspective(10px) rotateX(0.5deg);
  transform-origin: left;
}

#chat .mainContainer .patterns .pattern1unactive {
  padding: 0 0 0 12%;

  width: calc(70% - 12%);
}

#chat .mainContainer .patterns .pattern1active {
  padding: 0 0 0 30%;

  width: calc(70% - 30%);
}

#chat .mainContainer .patterns .pattern1unactive:before {
  z-index: -2;
}

#chat .mainContainer .patterns .pattern1active:before {
  z-index: -1;
}

#chat .mainContainer .patterns .pattern2 {
  position: absolute;

  top: 1px;
  right: 0;

  height: 60px;

  font-size: 24px;

  line-height: 60px;

  cursor: pointer;
}

#chat .mainContainer .patterns .pattern2:before {
  content: '';

  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: #C9C9C9;

  transform: perspective(10px) rotateX(-0.5deg);
  transform-origin: right;
}

#chat .mainContainer .patterns .pattern2unactive {
  padding: 0 0 0 52%;

  width: calc(70% - 52%);
}

#chat .mainContainer .patterns .pattern2active {
  padding: 0 0 0 35%;

  width: calc(70% - 35%);
}

#chat .mainContainer .patterns .pattern2unactive:before {
  z-index: -2;
}

#chat .mainContainer .patterns .pattern2active:before {
  z-index: -1;
}

#chat .mainContainer .chatArea {
  flex: 1;
}

#chat .mainContainer .chatArea .chatAreaInner .chatRow {
  padding: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#chat .mainContainer .chatArea .chatAreaInner .chatRow .chatRobot {
  text-align: left;
}

#chat .mainContainer .chatArea .chatAreaInner .chatRow .chatRobot .chatRobotAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#chat .mainContainer .chatArea .chatAreaInner .chatRow .chatRobot .chatRobotMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 10px;
  padding: 0 20px 0 20px;

  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  background: #F2F2F2;
}

#chat .mainContainer .chatArea .chatAreaInner .chatRow .chatUser {
  text-align: right;
}

#chat .mainContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#chat .mainContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 10px;
  padding: 0 20px 0 20px;

  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  background: #F2F2F2;
}

#chat .mainContainer .inputArea {
  position: relative;

  padding: 10px 0 10px 0;

  width: 100%;
  height: auto;
  max-height: 200px;

  background: red;
}

#chat .mainContainer .inputArea .fileUploadButton {
  position: absolute;

  bottom: 20px;
  left: 40px;

  width: 40px;
  height: 40px;
}

#chat .mainContainer .inputArea .chatInput {
  margin: 0 0 0 100px;

  width: calc(100% - 100px - 120px);

  font-size: 16px;
}

#chat .mainContainer .inputArea .sendButton {
  position: absolute;

  right: 40px;
  bottom: 20px;

  padding: 0 0 0 0;

  width: 60px;
  height: 40px;

  text-align: center;
}

#chat .mainContainer .inputArea .sendButton .sendButtonIcon {
  width: 24px;
  height: 24px;
}
</style>