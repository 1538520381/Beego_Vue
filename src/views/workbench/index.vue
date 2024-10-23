<template>
  <div id="workbench">
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
        <el-image class="logoImage" :src="logo" fit="fill"/>
      </div>
    </el-menu>

    <el-menu class="sessionMenu" default-active="0" v-if="sessionMenuShow" @select="selectSessionMenu">
      <el-button class="addSessionButton" link @click="addSession">新增对话</el-button>
      <el-scrollbar class="sessionMenuScrollbar">
        <el-menu-item class="sessionMenuItem" v-for="(item,value) in sessions" :index="String(value)">
          <!--          <div class="sessionMenuItemTitle">{{ item.id }}</div>-->
          <div class="sessionMenuItemTitle">{{
              isEmpty(item.message) || isEmpty(item.message.content) ? "new Chat" : item.message.content
            }}
          </div>
          <svg-icon class="sessionMenuDeleteIcon" icon-class="delete" @click="deleteSession(value)"></svg-icon>
        </el-menu-item>
      </el-scrollbar>
      <div class="user" @click="toPersonalCenter">
        <el-image class="userAvatar" round :src="test"></el-image>
        <div class="userInformation">
          <div class="userId">{{ user.id }}</div>
          <div class="userName">{{ user.userName }}</div>
        </div>
      </div>
    </el-menu>

    <el-button class="sessionMenuControllerButton sessionMenuControllerButtonOpen" v-if="sessionMenuShow"
               @click="closeSessionMenu"
               :icon="ArrowLeftBold" circle/>
    <el-button class="sessionMenuControllerButton sessionMenuControllerButtonClose" v-else @click="openSessionMenu"
               :icon="ArrowRightBold" circle/>


    <div class="mainContainer" :class="{mainContainerShort:sessionMenuShow,mainContainerLong:!sessionMenuShow}">
      <div class="patterns">
        <el-image class="patternLeftRectangle patternRectangleUnactive" :src="F2F2F2_Square"
                  @click="toLearningCornerBook"></el-image>
        <el-image class="patternAngledTriangle patternBottomLeftAngledTriangleUnactive"
                  :src="F2F2F2_BottomLeftAngledTriangle" @click="toLearningCornerBook"></el-image>
        <div class="leftTitleUnactive" @click="toLearningCornerBook">学习角</div>
        <el-image class="patternRightRectangle patternRectangleActive" :src="C9C9C9_Square"></el-image>
        <el-image class="patternAngledTriangle patternTopRightAngledTriangleActive"
                  :src="C9C9C9_TopRightAngledTriangle"></el-image>
        <div class="rightTitleActive">工作台</div>
        <!--        <div class="pattern1 pattern1unactive" @click="toLearningCornerBook">-->
        <!--          学习角-->
        <!--        </div>-->
        <!--        <div class="pattern2 pattern2active">-->
        <!--          工作台-->
        <!--        </div>-->
        <svg-icon class="shareIcon" icon-class="share" @click="share"></svg-icon>
      </div>

      <el-scrollbar class="chatArea" ref="chatArea" label="chatArea" id="chatArea">
        <div class="chatAreaInner" ref="chatAreaInner">
          <div class="chatRow" v-for="(item,index) in messages">
            <div class="chatRobot" v-if="item.role === 'assistant'">
              <el-image class="chatRobotAvatar" :src="robots[robotActive].avatar"></el-image>
              <!--              <div class="chatRobotMessage" v-html="markdownToHtml(item.content)"></div>-->
              <div class="chatRobotMessage">
                <v-md-preview class="chatRobotMessageText chatMessageText" :text="item.content"></v-md-preview>
              </div>
            </div>

            <div class="chatUser" v-if="item.role === 'user'">
              <div class="chatUserMessage">
                <el-image class="chatUserFilePicture" :src="item.fileUrl" fit="fill"
                          v-if="['jpg','png'].indexOf(item.fileType) !== -1"></el-image>
                <svg-icon class="chatUserFileSvg" icon-class="csv"
                          v-else-if="['csv'].indexOf(item.fileType) !== -1"></svg-icon>
                <svg-icon class="chatUserFileSvg" icon-class="excel"
                          v-else-if="['xlsx','xls'].indexOf(item.fileType) !== -1"></svg-icon>
                <svg-icon class="chatUserFileSvg" icon-class="mp4"
                          v-else-if="['mp4'].indexOf(item.fileType) !== -1"></svg-icon>
                <svg-icon class="chatUserFileSvg" icon-class="pdf"
                          v-else-if="['pdf'].indexOf(item.fileType) !== -1"></svg-icon>
                <svg-icon class="chatUserFileSvg" icon-class="ppt"
                          v-else-if="['ppt'].indexOf(item.fileType) !== -1"></svg-icon>
                <svg-icon class="chatUserFileSvg" icon-class="rar"
                          v-else-if="['rar'].indexOf(item.fileType) !== -1"></svg-icon>
                <svg-icon class="chatUserFileSvg" icon-class="txt"
                          v-else-if="['txt'].indexOf(item.fileType) !== -1"></svg-icon>
                <svg-icon class="chatUserFileSvg" icon-class="word"
                          v-else-if="['word'].indexOf(item.fileType) !== -1"></svg-icon>
                <svg-icon class="chatUserFileSvg" icon-class="word"
                          v-else-if="['docx','doc'].indexOf(item.fileType) !== -1"></svg-icon>
                <svg-icon class="chatUserFileSvg" icon-class="zip"
                          v-else-if="['zip'].indexOf(item.fileType) !== -1"></svg-icon>
                <svg-icon class="chatUserFileSvg" icon-class="unknownFile" v-else></svg-icon>
                <!--              <div class="chatUserMessage" v-html="markdownToHtml(item.content)"></div>-->
                <v-md-preview class="chatUserMessageText chatMessageText" :text="item.content"
                              v-if="!isEmpty(item.content)"></v-md-preview>
              </div>
              <el-image class="chatUserAvatar" :src="test"></el-image>
            </div>
          </div>
          <div class="chatRowLoading">
            <div class="chatRobot" v-if="answeringFlag">
              <el-image class="chatRobotAvatar" :src="robots[robotActive].avatar"></el-image>
              <!--              <div class="chatRobotMessage chatMessage" v-html="markdownToHtml(answeringMessage)"></div>-->
              <v-md-preview class="chatRobotMessageText chatMessageText"
                            :text="answeringMessage.substring(0,answeringIndex)"></v-md-preview>
            </div>
          </div>
        </div>
        <el-button class="scrollToBottomButton" :icon="ArrowDownBold" circle @click="scrollToBottom"></el-button>
      </el-scrollbar>

      <div class="inputArea">
        <el-upload
            class="upload-demo"
            action="/api/file/uploadPicture"
            :on-remove="removeFile"
            :on-success="fileUpload"
            :file-list="fileList"
        >
          <el-button class="fileUploadButton" :icon="Folder" circle></el-button>
        </el-upload>
        <el-input
            class="chatInput"
            v-model="chatInput"
            :rows="2"
            :autosize="{minRows:2,maxRows:8}"
            type="textarea"
            resize="none"
            placeholder="开始创作你的提示词吧"
        />
        <el-button class="sendButton" @click="chat">
          <svg-icon class="sendButtonIcon" icon-class="send"></svg-icon>
        </el-button>
      </div>
    </div>
    <input type="text" id="copyVal" value="假装有分享链接" style="opacity:0; position:absolute;top: 0;left: 0"/>
  </div>
</template>

<script>
import test from '@/assets/pictures/test.jpg'
import logo from '@/assets/pictures/logo.png'
import F2F2F2_Square from '@/assets/pictures/F2F2F2_Square.png'
import C9C9C9_Square from '@/assets/pictures/C9C9C9_Square.png'
import F2F2F2_BottomLeftAngledTriangle from '@/assets/pictures/F2F2F2_BottomLeftAngledTriangle.png'
import C9C9C9_TopRightAngledTriangle from '@/assets/pictures/C9C9C9_TopRightAngledTriangle.png'


import {ref} from 'vue'
import {fetchEventSource} from "@microsoft/fetch-event-source";

import {ArrowLeftBold, ArrowRightBold, ArrowDownBold, Folder} from '@element-plus/icons-vue'

import {addSession, deleteSession, getMessageList, getRobotList, getSessionList} from "@/apis/chat";
import {isEmpty} from "@/utils/common";
import {getUserByToken} from "@/apis/user";

import SvgIcon from "@/components/svgIcon/index.vue";

export default {
  name: 'Workbench',
  components: {SvgIcon},
  data() {
    return {
      test: test,
      logo: logo,
      F2F2F2_Square: F2F2F2_Square,
      C9C9C9_Square: C9C9C9_Square,
      F2F2F2_BottomLeftAngledTriangle: F2F2F2_BottomLeftAngledTriangle,
      C9C9C9_TopRightAngledTriangle: C9C9C9_TopRightAngledTriangle,

      token: null,
      user: {},

      ArrowLeftBold: ArrowLeftBold,
      ArrowRightBold: ArrowRightBold,
      ArrowDownBold: ArrowDownBold,
      Folder: Folder,

      robots: [],
      sessions: [],
      messages: [],

      chatInput: "",
      file: null,

      fileList: [],

      answeringFlag: false,
      answeringMessage: "",
      answeringIndex: 0,
      answeringClock: null,

      sessionMenuShow: true,

      robotActive: 0,
      sessionActive: 0,

      initFlag: false,
    }
  },
  setup() {
    const chatArea = ref(null);
    const chatAreaInner = ref(null);

    const scrollToBottom = () => {
      try {
        const bottom = chatAreaInner.value.clientHeight;
        chatArea.value.setScrollTop(bottom);
      } catch (err) {
        console.log(err)
      }
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
  },
  methods: {
    addSession() {
      addSession(this.robots[this.robotActive].id).then((res) => {
        if (res.data.code === 200) {
          this.sessionActive = 0
          this.getSessionList()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },
    deleteSession(index) {
      deleteSession(this.sessions[index].id).then((res) => {
        if (res.data.code === 200) {
          this.getSessionList();
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },
    getUserByToken() {
      return getUserByToken().then((res) => {
        if (res.data.code === 200) {
          this.user = {
            id: res.data.data['user_id'],
            email: res.data.data['email'],
            userName: res.data.data['user_name']
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
          this.getSessionList()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },
    getSessionList() {
      return getSessionList(this.robots[this.robotActive].id).then((res) => {
        if (res.data.code === 200) {
          if (isEmpty(res.data.data)) {
            this.addSession()
          } else {
            this.sessions = []
            for (let i in res.data.data) {
              this.sessions.push({
                id: res.data.data[i]['session_id'],
                botId: res.data.data[i]['bot_id'],
                userId: res.data.data[i]["user_id"],
                createTime: res.data.data[i]['created_time'],
                updateTime: res.data.data[i]['updated_time'],
                message: isEmpty(res.data.data[i]["message"]) ? null : {
                  id: res.data.data[i]["message"]["message_id"],
                  sessionId: res.data.data[i]["message"]["session_id"],
                  role: res.data.data[i]["message"]["role"],
                  content: res.data.data[i]["message"]["content"],
                  fileType: res.data.data[i]["message"]["file_type"],
                  fileName: res.data.data[i]["message"]["file_name"],
                  fileUrl: res.data.data[i]["message"]["file_url"],
                  createTime: res.data.data[i]["message"]["created_time"],
                }
              })
            }
            this.sessions.sort((o1, o2) => {
              return new Date(o2.createTime) - new Date(o1.createTime)
            })
            this.getMessageList()
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },
    getMessageList() {
      return getMessageList(this.sessions[this.sessionActive].id).then((res) => {
        if (res.data.code === 200) {
          this.messages = []
          for (let i in res.data.data) {
            this.messages.push({
              id: res.data.data[i]['message_id'],
              sessionId: res.data.data[i]['session_id'],
              role: res.data.data[i]['role'],
              content: res.data.data[i]['content'],
              fileType: res.data.data[i]['file_type'],
              fileName: res.data.data[i]['file_name'],
              fileUrl: res.data.data[i]['file_url'],
              createTime: res.data.data[i]['created_time']
            })
          }
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },
    chat() {
      if (this.answeringFlag) {
        return
      }

      this.answeringFlag = true
      this.answeringMessage = ""
      this.answeringIndex = 0
      this.answeringClock = setInterval(() => {
        this.answeringIndex = Math.min(this.answeringIndex + 1, this.answeringMessage.length)
      }, 100)

      this.messages.push({
        role: "user",
        content: this.chatInput,
        fileType: isEmpty(this.file) ? null : this.file.type,
        fileName: isEmpty(this.file) ? null : this.file.name,
        fileUrl: isEmpty(this.file) ? null : this.file.url,
      })
      console.log(this.messages)
      this.$nextTick(() => {
        this.scrollToBottom()
      })

      const ctrl = new AbortController();
      fetchEventSource('/api/chat/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        },
        body: JSON.stringify({
          bot_id: this.robots[this.robotActive].id,
          session_id: this.sessions[this.sessionActive].id,
          content: this.chatInput,
          file_name: isEmpty(this.file) ? null : this.file.name,
          file_type: isEmpty(this.file) ? null : this.file.type,
          file_url: isEmpty(this.file) ? null : this.file.url,
        }),
        signal: ctrl.signal,
        onmessage: (message) => {
          if (message.event === 'conversation') {
            this.answeringMessage += isEmpty(message.data) ? '' : message.data
          } else if (message.event === "done") {
          } else if (message.event === 'all') {
            this.answeringFlag = false
            clearInterval(this.answeringClock)
            this.messages.push({
              role: "assistant",
              contentType: 'text',
              content: message.data.replaceAll("\\n", "\n")
            })
          }
        },
        onclose: () => {
        },
        onerror: (err) => {
          this.answeringFlag = false
          clearInterval(this.answeringClock)
          console.log(err)
          this.$message.error('系统异常，请联系管理员')
        }
      });

      this.chatInput = ""
      this.file = {}
      this.fileList = []
    },

    removeFile(file, fileList) {
      console.log(1)
      this.file = null
    },
    fileUpload(res, file, fileList) {
      if (res.code === 200) {
        this.file = {
          id: res.data["file_id"],
          name: res.data["file_name"],
          type: res.data["file_type"],
          url: res.data['file_url'],
          createTime: res.data["create_time"],
        }
        console.log(this.file)
      } else {
        this.fileList = []
        this.$message.error(res.message)
      }
    },

    share() {
      var copyVal = document.getElementById("copyVal");
      copyVal.select();
      document.execCommand('copy')
      this.$message.success("分享链接已复制到剪切板")
    },

    closeSessionMenu() {
      this.sessionMenuShow = false
    },
    openSessionMenu() {
      this.sessionMenuShow = true
    },

    toLearningCornerBook() {
      this.$router.push("/learningCornerBook")
    },
    toPersonalCenter() {
      this.$router.push('/personalCenter')
    },

    selectRobotMenu(index) {
      this.robotActive = parseInt(index);
      this.getSessionList()
    },
    selectSessionMenu(index) {
      this.sessionActive = parseInt(index);
      this.getMessageList()
      this.answeringFlag = false
      this.answeringMessage = ""
    },

    // markdownToHtml(text) {
    //   const md = new MarkdownIt();
    //   md.use(mk);
    //   return md.render(text)
    // },

    isEmpty(field) {
      return isEmpty(field)
    },
  },
}
</script>

<style scoped>
#workbench {
  width: 100%;
  height: 100%;
}

#workbench .robotMenu {
  display: inline-block;

  vertical-align: top;

  width: 120px;
  height: 100%;

  border: 0;

  background: #E6E6E6;
}

#workbench .robotMenu .robotMenuScrollbar {
  width: 100%;
  height: calc(100% - 120px);
}

#workbench .robotMenu .robotMenuScrollbar .robotMenuItem {
  height: auto;

  padding: 5px 20px 5px 20px;
}

#workbench .robotMenu .robotMenuScrollbar .robotMenuItem .robotMenuItemContainer .robotMenuItemImage {
  width: 80px;
  height: 80px;
}

#workbench .robotMenu .robotMenuScrollbar .robotMenuItem .robotMenuItemContainer .robotMenuItemTitle {
  width: 100%;

  line-height: 20px;

  font-size: 12px;

  text-align: center;

  white-space: normal;
  word-break: break-all;
  overflow: hidden;
}

#workbench .robotMenu .logo {
  margin: 20px 0 20px 0;

  text-align: center;
}

#workbench .robotMenu .logo .logoImage {
  width: 80px;
}

#workbench .sessionMenu {
  display: inline-block;

  vertical-align: top;

  width: 200px;
  height: 100%;

  border: 0;

  text-align: center;

  background: #C9C9C9;
}

#workbench .sessionMenu .sessionMenuScrollbar {
  width: 100%;
  height: calc(100% - 60px - 120px);
}

#workbench .sessionMenu .sessionMenuScrollbar .sessionMenuItem {
  display: flex;

  justify-content: space-between;
}

#workbench .sessionMenu .sessionMenuScrollbar .sessionMenuItem .sessionMenuItemTitle {
  width: calc(100% - 30px);

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 18px;
}

#workbench .sessionMenu .sessionMenuScrollbar .sessionMenuItem .sessionMenuDeleteIcon {
  width: 20px;
  height: 20px;
}


#workbench .sessionMenu .addSessionButton {
  margin: 10px 0 0 0;

  width: 80%;
  height: 50px;

  border: 2px dotted #000000;

  font-size: 20px;
}

#workbench .sessionMenuControllerButton {
  position: absolute;

  width: 40px;
  height: 40px;

  z-index: 1;
}

#workbench .sessionMenuControllerButtonClose {
  top: calc(50% - 40px / 2);
  left: calc(120px - 40px / 2);
}

#workbench .sessionMenuControllerButtonOpen {
  top: calc(50% - 40px / 2);
  left: calc(120px + 200px - 40px / 2);
}

#workbench .sessionMenu .user {
  margin: 30px 0 30px 30px;

  width: 100%;
  height: 60px;

  text-align: left;
}

#workbench .sessionMenu .user .userAvatar {
  display: inline-block;

  vertical-align: top;

  width: 60px;
  height: 60px;

  border-radius: 50%;
}

#workbench .sessionMenu .user .userInformation {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 20px;

  height: 60px;
}

#workbench .sessionMenu .user .userInformation .userId {
  width: 100%;
  height: 30px;

  line-height: 30px;
}

#workbench .sessionMenu .user .userInformation .userName {
  width: 100%;
  height: 30px;

  line-height: 30px;
}

#workbench .mainContainer {
  display: inline-flex;
  flex-flow: column;

  position: relative;

  vertical-align: top;

  height: 100%;
}

#workbench .mainContainerShort {
  width: calc(100% - 120px - 200px);
}

#workbench .mainContainerLong {
  width: calc(100% - 120px);
}

#workbench .mainContainer .patterns {
  position: relative;

  width: 100%;
  height: 60px;
}

#workbench .mainContainer .patterns .patternLeftRectangle {
  position: absolute;

  top: 0;
  left: 0;
}

#workbench .mainContainer .patterns .patternRightRectangle {
  position: absolute;

  top: 0;
  right: 0;
}

#workbench .mainContainer .patterns .patternRectangleUnactive {
  width: calc(25% - 60px / 2);
  height: 100%;

  cursor: pointer;
}

#workbench .mainContainer .patterns .patternRectangleActive {
  width: calc(75% - 60px / 2);
  height: 100%;
}

#workbench .mainContainer .patterns .patternAngledTriangle {
  position: absolute;

  top: 0;

  width: 60px;
  height: 60px;
}

#workbench .mainContainer .patterns .patternBottomLeftAngledTriangleUnactive {
  left: calc(25% - 60px / 2);

  cursor: pointer;
}

#workbench .mainContainer .patterns .patternBottomLeftAngledTriangleActive {
  left: calc(75% - 60px / 2);
}

#workbench .mainContainer .patterns .patternTopRightAngledTriangleUnactive {
  right: calc(25% - 60px / 2);
}

#workbench .mainContainer .patterns .patternTopRightAngledTriangleActive {
  right: calc(75% - 60px / 2);
}

#workbench .mainContainer .patterns .leftTitleUnactive {
  position: absolute;

  top: 0;
  left: 0;

  width: calc(25% - 60px / 2);
  height: 60px;

  font-size: 20px;

  line-height: 60px;

  text-align: center;

  cursor: pointer;
}

#workbench .mainContainer .patterns .rightTitleActive {
  position: absolute;

  top: 0;
  right: 0;

  width: calc(75% - 60px / 2);
  height: 60px;

  font-size: 20px;

  line-height: 60px;

  text-align: center;

  user-select: none;
}

/*
#workbench .mainContainer .patterns .pattern1 {
  position: absolute;

  top: -1px;
  left: 0;

  height: 60px;

  font-size: 24px;

  line-height: 60px;

  cursor: pointer;
}

#workbench .mainContainer .patterns .pattern1:before {
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

#workbench .mainContainer .patterns .pattern1unactive {
  padding: 0 0 0 12%;

  width: calc(70% - 12%);
}

#workbench .mainContainer .patterns .pattern1unactive:before {
  z-index: -2;
}

#workbench .mainContainer .patterns .pattern2 {
  position: absolute;

  top: 1px;
  right: 0;

  height: 60px;

  font-size: 24px;

  line-height: 60px;

  cursor: pointer;
}

#workbench .mainContainer .patterns .pattern2:before {
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

#workbench .mainContainer .patterns .pattern2active {
  padding: 0 0 0 35%;

  width: calc(70% - 35%);
}

#workbench .mainContainer .patterns .pattern2active:before {
  z-index: -1;
}
*/

#workbench .mainContainer .patterns .shareIcon {
  position: absolute;

  top: 5px;
  right: 5px;

  width: 50px;
  height: 50px;

  cursor: pointer;
}

#workbench .mainContainer .chatArea {
  flex: 1;
}

#workbench .mainContainer .chatArea .scrollToBottomButton {
  position: absolute;

  bottom: 0;
  left: 50%;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow {
  padding: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatRobot {
  text-align: left;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatRobot .chatRobotAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatRobot .chatRobotMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 10px;

  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  background: #F2F2F2;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatRobot .chatRobotMessage .chatRobotMessageText {

}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatUser {
  text-align: right;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 10px 0 0;

  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  text-align: left;

  background: #F2F2F2;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserMessage .chatUserFilePicture {
  margin: 10px 10px 10px 10px;

  width: 50px;
  min-width: 50px;
  min-height: 50px;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserMessage .chatUserFileSvg {
  margin: 10px 10px 10px 10px;

  width: 50px;

  height: 50px;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserMessage .chatUserMessageText {

}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRowLoading {
  padding: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRowLoading .chatRobot {
  text-align: left;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRowLoading .chatRobot .chatRobotAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRowLoading .chatRobot .chatRobotMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 10px;

  min-width: 30px;
  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  background: #F2F2F2;
}

#workbench /deep/ .chatMessageText .github-markdown-body {
  padding: 16px 32px 16px 32px;
}


#workbench /deep/ .chatMessageText .github-markdown-body p {
  margin-bottom: 0 !important;
}

#workbench .mainContainer .inputArea {
  position: relative;

  padding: 10px 0 10px 0;

  width: 100%;
  height: auto;
  max-height: 200px;
}

#workbench .mainContainer .inputArea .upload-demo {
  position: absolute;

  left: 0;
  bottom: 0;
}

#workbench .mainContainer .inputArea .upload-demo /deep/ .el-upload-list {
  position: absolute;

  bottom: 70px;
  left: 10px;

  width: 90px;
}

#workbench .mainContainer .inputArea .fileUploadButton {
  position: absolute;

  bottom: 20px;
  left: 40px;

  width: 40px;
  height: 40px;
}

#workbench .mainContainer .inputArea .chatInput {
  margin: 0 0 0 100px;

  width: calc(100% - 100px - 120px);

  font-size: 16px;
}

#workbench .mainContainer .inputArea .sendButton {
  position: absolute;

  right: 40px;
  bottom: 20px;

  padding: 0 0 0 0;

  width: 60px;
  height: 40px;

  text-align: center;
}

#workbench .mainContainer .inputArea .sendButton .sendButtonIcon {
  width: 24px;
  height: 24px;
}
</style>