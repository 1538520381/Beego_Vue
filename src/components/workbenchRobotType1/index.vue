<template>
  <div id="workbenchRobotType1">
    <WorkbenchSessionMenu class="sessionMenu" ref="sessionMenu" :robotId="robot.id" :userId="userId"
                          :userAvatar="userAvatar"
                          :userName="userName" :addSessionButtonFlag="true"
                          :enabledFlag="true"
                          @getMessageList="getMessageList"></WorkbenchSessionMenu>
    <div class="rightContainer">
      <ModeBar class="modeBar" :mode="2"></ModeBar>
      <el-scrollbar class="mainContainer">
        <div class="imageRecognition">
          <div class="uploadFileContainer">
            <el-upload
                class="dragUpload"
                drag
                action="/api/file/uploadPicture?bucketType=1"
                :show-file-list="false"
                :on-success="fileUploadSuccess"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">拖拽上传或<em>点击上传</em></div>
            </el-upload>
            <div class="pasteUpload" tabindex="-1" v-on:paste="pasteImage">
              <span>Ctrl+V粘贴至此</span>
            </div>
          </div>
          <el-image class="image" :src="file.fileUrl" v-if="!isEmpty(file)" fit="contain"></el-image>
          <el-button class="imageRecognitionButton" v-if="!isEmpty(file)" v-loading="false"
                     @click="imageRecognition(file)">
            开始识别
          </el-button>
          <el-scrollbar class="markdownQuestion" v-highlight
                        v-html="md.render(markdownSpecialCharacterReplace(question))" v-if="md != null"></el-scrollbar>
          <el-input class="questionInput" type="textarea" resize="none" v-model="question" :rows="1"
                    :autosize="{ minRows: 1, maxRows: 8 }" :disabled="imageRecognitionFlag || answeringFlag"
                    v-loading="imageRecognitionFlag"/>
          <el-button class="problemSolveButton" type="primary" @click="problemSolve(question)">开始求解</el-button>
        </div>
        <MessageContainer class="messageContainer" ref="messageContainer" :robotId="robot.id" :userAvatar="userAvatar"
                          :robotAvatar="robot.avatar"
                          :robotDescription="robot.description"
                          :scrollToButtomFlag="false"
                          :answeringFlag="answeringFlag"
                          :answeringMessageContent="latexToMarkdown(answeringMessageContent)"
                          :latexFlag="true" :toolBarFlag="false" :removeFlag="true"></MessageContainer>
        <div style="width: 100%;height: 80px;"></div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
import {fetchEventSource} from "@microsoft/fetch-event-source";

import WorkbenchSessionMenu from "@/components/workbenchSessionMenu/index.vue";
import MessageContainer from "@/components/messageContainer/index.vue";

import {isEmpty, latexToMarkdown, markdownSpecialCharacterReplace} from "@/utils/common";
import ModeBar from "@/components/modeBar/index.vue";

export default {
  name: "WorkbenchRobotType1",
  components: {ModeBar, MessageContainer, WorkbenchSessionMenu},
  props: {
    userAvatar: String,
    robot: Object
  },
  data() {
    return {
      md: null,

      userId: Number,
      userAvatar: String,
      userName: String,

      file: null,
      question: null,
      answeringMessageContent: null,

      imageRecognitionFlag: false,
      answeringFlag: false
    }
  },
  created() {
    this.md = new MarkdownIt()
    this.md.use(MarkdownItKatex);
  },
  methods: {
    imageRecognition(file) {
      if (isEmpty(file)) {
        return
      }

      this.imageRecognitionFlag = true
      this.question = ""

      const ctrl = new AbortController();
      fetchEventSource("/api/chat/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          bot_id: this.robot.id,
          session_id: null,
          bot_handle: this.robot.handle,
          content: null,
          file_type: file.fileType,
          file_name: file.fileName,
          file_url: file.fileUrl,
        }),
        signal: ctrl.signal,
        openWhenHidden: true,
        onopen: (res) => {
        },
        onmessage: (msg) => {
          if (msg.event === 'conversation') {
            this.question += msg.data
            this.question = latexToMarkdown(this.question.replaceAll("&#92n", "\n").replaceAll("&#32;", " "))
          } else if (msg.event === 'all') {
          } else if (msg.event === 'done') {
            this.imageRecognitionFlag = false
          }
        },
        onclose: () => {
          this.imageRecognitionFlag = false
        },
        onerror: (err) => {
          this.imageRecognitionFlag = false
          console.log(err)
          this.$message.error("系统异常，请联系管理员");
          throw err
        }
      })
    },
    problemSolve(question) {
      if (this.imageRecognitionFlag || this.answeringFlag || isEmpty(question)) {
        return
      }

      this.answeringFlag = true
      this.answeringMessageContent = ""

      this.$refs.messageContainer.addMessage({
        role: 'user',
        content: latexToMarkdown(question)
      })

      const ctrl = new AbortController();
      fetchEventSource("/api/chat/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          bot_id: this.robot.id,
          session_id: this.$refs.sessionMenu.sessionList[this.$refs.sessionMenu.sessionActive].id,
          bot_handle: this.robot.handle,
          content: question,
          file_type: null,
          file_name: null,
          file_url: null,
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
            this.$refs.messageContainer.addMessage({
              role: 'assistant',
              content: latexToMarkdown(this.answeringMessageContent)
            })
            console.log(latexToMarkdown(this.answeringMessageContent))
            this.answeringFlag = false
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

    fileUploadSuccess(res) {
      if (res.code === 200) {
        this.file = {
          id: res.data["file_id"],
          fileName: res.data["file_name"],
          fileType: res.data["file_type"],
          fileUrl: res.data["file_url"],
        };
      } else {
        this.$message.error(res.message);
      }
    },
    pasteImage(event) {
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;

      if (!items || items.length === 0) {
        this.$message.error("当前浏览器不支持");
        return;
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        this.$message.error("粘贴内容非图片");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      axios.post('/api/file/uploadPicture?bucketType=1', formData).then((res) => {
        this.fileUploadSuccess(res.data)
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      })
    },

    isEmpty,
    markdownSpecialCharacterReplace,
    latexToMarkdown,
  }
}
</script>

<style scoped>
#workbenchRobotType1 {
  display: inline-flex;

  flex-flow: row;

  width: 100%;
  height: 100%;
}

#workbenchRobotType1 .sessionMenu {
  display: inline-block;

  position: relative;
}

#workbenchRobotType1 .rightContainer {
  flex: 1;

  position: relative;

  vertical-align: top;

  width: 0;
  height: 100%;
}

#workbenchRobotType1 .rightContainer .modeBar {
  position: relative;

  width: 100%;
  height: 60px;
}


#workbenchRobotType1 .rightContainer .mainContainer {
  width: 100%;
  height: 100%;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition {
  padding: 0 5% 0 5%;

  width: 90%;

  text-align: right;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition .uploadFileContainer {
  margin: 10px auto 0 auto;

  width: 100%;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition .uploadFileContainer .dragUpload {
  display: inline-block;
  position: relative;

  width: 60%;
  height: 100px;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition .uploadFileContainer .pasteUpload {
  display: inline-block;

  vertical-align: top;

  position: relative;

  width: calc(40% - 2px);
  height: 100px;

  border: 1px dashed #DCDFE6;
  border-radius: 6px;

  text-align: center;

  color: #606266;

  font-size: 14px;

  line-height: 100px;

  cursor: pointer;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition .uploadFileContainer .pasteUpload:hover {
  border-color: #409EFF;
}


#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition.uploadFileContainer .pasteUpload:focus {
  border-color: #409EFF;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition .image {
  display: block;

  margin: 20px auto 0 auto;

  width: 80%;
  height: 100px;

  border: 1px solid #DCDCDC;
  border-radius: 8px;

  cursor: pointer;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition .imageRecognitionButton {
  display: block;

  margin: 10px auto 0 auto;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition .markdownQuestion {
  flex: 1;

  margin: 10px auto 10px auto;

  width: 100%;

  text-align: left;

  overflow-y: scroll;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition .questionInput {
  position: relative;

  margin: 10px auto 10px auto;

  width: 100%;

  font-size: 20px;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition .questionInput /deep/ .el-textarea__inner {
  border-radius: 15px;
}

#workbenchRobotType1 .rightContainer .mainContainer .imageRecognition .problemSolveButton {
  margin: 0 0 0 auto;

  width: 100px;
}

#workbenchRobotType1 .rightContainer .mainContainer .messageContainer {
  width: 100%;
}
</style>