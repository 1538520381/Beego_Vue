<template>
  <div id="learningCornerChatRobotType0">
    <MessageContainer class="messageContainer" ref="messageContainer" :userAvatar="userAvatar" :robotId="robotId"
                      :robotAvatar="robotAvatar"
                      :robotDescription="robotDescription" :scrollToButtomFlag="true"
                      :answeringFlag="answeringFlag" :answeringMessageContent="answeringMessageContent"
                      :latexFlag="false" :toolBarFlag="true" :removeFlag="false"></MessageContainer>
    <RobotInputContainer class="robotInputContainer" :robotType="robotType" :robotPrompts="robotPrompts"
                         :refreshSessionFlag="true" @chat="chat" @refreshSession="refreshSession"></RobotInputContainer>
  </div>
</template>

<script>
import MessageContainer from "@/components/messageContainer/index.vue";
import RobotInputContainer from "@/components/robotInputContainer/index.vue";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {isEmpty} from "@/utils/common";
import {addSession, deleteSession, getSessionList} from "@/apis/chat";

export default {
  name: "LearningCornerChatRobotType0",
  components: {RobotInputContainer, MessageContainer},
  props: {
    userAvatar: String,

    robotId: Number,
    robotAvatar: String,
    robotDescription: String,
    robotType: Number,
    robotPrompts: Array,
    robotHandle: Number
  },
  data() {
    return {
      session: {},

      answeringFlag: false,
      answeringMessageContent: null,
    }
  },
  created() {
    this.getSessionList(this.robotId)
  },
  methods: {
    getSessionList(robotId) {
      return getSessionList(robotId).then((res) => {
        if (res.data.code === 200) {
          if (isEmpty(res.data.data)) {
            this.addSession();
          } else {
            this.session = {
              id: res.data.data[0]["session_id"],
              createTime: res.data.data[0]["created_time"],
              message: isEmpty(res.data.data[0]["message"])
                  ? null
                  : {
                    id: res.data.data[0]["message"]["message_id"],
                    content: res.data.data[0]["message"]["content"],
                  },
            };
            this.$refs.messageContainer.getMessageList(this.session.id);
          }
        } else {
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },
    addSession(robotId) {
      addSession(robotId).then((res) => {
        if (res.data.code === 200) {
          this.getSessionList(this.robotId);
        } else {
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },
    refreshSession() {
      if (this.answeringFlag) {
        return
      }

      deleteSession(this.session.id).then((res) => {
        if (res.data.code === 200) {
          this.addSession(this.robotId)
        } else {
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },

    chat(content, file) {
      if (isEmpty(this.session)) {
        return;
      }

      if (this.answeringFlag) {
        return;
      }

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
          bot_id: this.robotId,
          session_id: this.session.id,
          bot_handle: this.robotHandle,
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
  }
}
</script>

<style scoped>
#learningCornerChatRobotType0 {
  display: inline-flex;

  flex-flow: column;

  width: 100%;
  height: 100%;
}

#learningCornerChatRobotType0 .messageContainer {
  flex: 1;

  width: 100%;
  height: 0;
}
</style>