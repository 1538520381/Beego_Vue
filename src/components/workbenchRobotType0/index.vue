<template>
  <div id="workbenchRobotType0">
    <WorkbenchSessionMenu class="sessionMenu" ref="sessionMenu" :userId="userId" :userAvatar="userAvatar"
                          :userName="userName" :robotId="robot.id" :addSessionButtonFlag="true"
                          :enabledFlag="!answeringFlag"
                          @getMessageList="getMessageList"></WorkbenchSessionMenu>
    <div class="rightContainer">
      <ModeBar class="modeBar" :mode="2"></ModeBar>
      <MessageContainer class="messageContainer" ref="messageContainer" :robotId="robot.id" :userAvatar="userAvatar"
                        :robotAvatar="robot.avatar"
                        :robotDescription="robot.description"
                        :scrollToButtomFlag="true"
                        :answeringFlag="answeringFlag"
                        :answeringMessageContent="answeringMessageContent" :latexFlag="false" :toolBarFlag="true"
                        :removeFlag="true"></MessageContainer>
      <RobotInputContainer :robotType="robot.type" :robotPrompts="robot.prompts" :refreshSessionFlag="false" @chat="chat"
                           @selectRobot="selectRobot"></RobotInputContainer>
    </div>
  </div>
</template>

<script>
import WorkbenchSessionMenu from "@/components/workbenchSessionMenu";
import ModeBar from "@/components/modeBar/index.vue";
import MessageContainer from "@/components/messageContainer/index.vue";
import RobotInputContainer from "@/components/robotInputContainer/index.vue";

import {fetchEventSource} from "@microsoft/fetch-event-source";

import {isEmpty} from "@/utils/common";

export default {
  name: "WorkbenchRobotType0",
  components: {
    WorkbenchSessionMenu,
    ModeBar,
    MessageContainer,
    RobotInputContainer,
  },
  props: {
    userId: Number,
    userAvatar: String,
    userName: String,
    robot: Object
  },
  data() {
    return {
      answeringFlag: false,
      answeringMessageContent: null
    }
  },
  created() {
  },
  methods: {
    chat(content, file) {
      this.answeringFlag = true
      this.answeringMessageContent = ""

      this.$refs.messageContainer.addMessage({
        role: 'user',
        content: content,
       fileType: isEmpty(file) ? null : file.type,
        fileName: isEmpty(file) ? null : file.name,
        fileUrl: isEmpty(file) ? null : file.url,
      })
      this.$refs.messageContainer.scrollToBottom()

      const ctrl = new AbortController();
      fetchEventSource("/api/chat/agent", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          bot_id: this.robot.id,
          session_id: this.$refs.sessionMenu.sessionList[this.$refs.sessionMenu.sessionActive].id,
          bot_handle: this.robot.handle,
          content: content,
          file_name: isEmpty(file) ? null : file.name,
          file_type: isEmpty(file) ? null : file.type,
          file_url: isEmpty(file) ? null : file.url
        }),
        signal: ctrl.signal,
        openWhenHidden: true,
        onopen: (res) => {
        },
        onmessage: (msg) => {
          if (msg.event === 'conversation') {
            this.answeringMessageContent += msg.data
            this.answeringMessageContent = this.answeringMessageContent.replaceAll("&#92n", "\n").replaceAll("&#32;", " ")
          } else if (msg.event === 'all') {
          } else if (msg.event === 'done') {
            this.answeringFlag = false
            this.$refs.messageContainer.addMessage({
              role: 'assistant',
              content: this.answeringMessageContent
            })
            this.$refs.messageContainer.scrollToBottom()
          }
        },
        onclose: () => {
          this.answeringFlag = false
        },
        onerror: (err) => {
          this.answeringFlag = false
          console.log(err)
          this.$message.error("系统异常，请联系管理员");
          throw err
        }
      })
    },

    getMessageList(sessionId) {
      this.$refs.messageContainer.getMessageList(sessionId)
    },

    selectRobot() {
      this.$emit('selectRobot')
    }
  }
}
</script>

<style scoped>
#workbenchRobotType0 {
  display: inline-flex;

  flex-flow: row;

  width: 100%;
  height: 100%;
}

#workbenchRobotType0 .sessionMenu {
  display: inline-block;

  position: relative;
}

#workbenchRobotType0 .rightContainer {
  display: inline-flex;

  flex-flow: column;

  flex: 1;

  position: relative;

  vertical-align: top;

  width: 0;
  height: 100%;
}

#workbenchRobotType0 .rightContainer .modeBar {
  position: relative;

  width: 100%;
  height: 60px;
}

#workbenchRobotType0 .rightContainer .messageContainer {
  flex: 1;

  width: 100%;
}
</style>