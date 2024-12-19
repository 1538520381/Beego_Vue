<template>
  <el-scrollbar id="messageContainer">
    <Message :userAvatar="userAvatar" :robotAvatar="robotAvatar" :role="'assistant'"
             :content="robotDescription" :toolBarFlag="toolBarFlag" :latexFlag="false"></Message>
    <Message v-for="(item,index) in messageList" :userAvatar="userAvatar" :robotAvatar="robotAvatar" :role="item.role"
             :content="item.content" :fileName="item.fileName"
             :fileType="item.fileType" :fileUrl="item.fileUrl"
             :toolBarFlag="toolBarFlag" :latexFlag="latexFlag" :removeFlag="false"></Message>
    <Message v-if="answeringFlag" :userAvatar="userAvatar" :robotAvatar="robotAvatar" :role="'assistant'"
             :content="answeringMessageContent"
             :toolBarFlag="false" :latexFlag="latexFlag"></Message>
    <div :id="'bottomDiv' + robotId"></div>

    <el-tooltip
        content="滚到底部"
        placement="top"
        effect="light"
    >
      <div class="scrollToButtom" v-if="scrollToButtomFlag" @click="scrollToBottom">
        <svg-icon class="bottomIcon" icon-class="bottom"></svg-icon>
      </div>
    </el-tooltip>
  </el-scrollbar>
</template>

<script>
import Message from "@/components/wechat/message/index.vue";

import {isEmpty, latexToMarkdown} from "@/utils/common";

import {getMessageList} from "@/apis/chat";

export default {
  name: 'MessageContainer',
  components: {Message},
  props: {
    robotId: Number,
    userAvatar: String,
    robotAvatar: String,
    robotDescription: String,

    scrollToButtomFlag: Boolean,

    answeringFlag: Boolean,
    answeringMessageContent: String,

    latexFlag: Boolean,
    toolBarFlag: Boolean,
    removeFlag: Boolean
  },
  data() {
    return {
      messageList: []
    }
  },
  methods: {
    getMessageList(sessionId) {
      getMessageList(sessionId).then((res) => {
        if (res.data.code === 200) {
          this.messageList = []
          if (!isEmpty(res.data.data)) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.messageList.push({
                id: res.data.data[i]["message_id"],
                role: res.data.data[i]["role"],
                content: this.latexFlag ? latexToMarkdown(res.data.data[i]["content"]) : res.data.data[i]["content"],
                fileType: res.data.data[i]["file_type"],
                fileName: res.data.data[i]["file_name"],
                fileUrl: res.data.data[i]["file_url"],
                createTime: res.data.data[i]["created_time"],
              })
            }
            this.messageList.sort((o1, o2) => {
              return o1.id - o2.id
            })
            this.scrollToBottom()
          }
        } else {
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },

    addMessage(message) {
      this.messageList.push(message)
    },

    scrollToBottom() {
      let bottomDiv = document.getElementById("bottomDiv" + this.robotId)
      if (bottomDiv) {
        this.$nextTick().then(() => {
          bottomDiv.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
        })
      }
    },
  }
}
</script>

<style scoped>
#messageContainer {
  width: 100%;
  height: 100%;
}

#messageContainer .scrollToButtom {
  position: absolute;

  right: 10px;
  bottom: 10px;

  width: 40px;
  height: 40px;

  background: #46A2FF;

  cursor: pointer;
}

#messageContainer .scrollToButtom .bottomIcon {
  width: 100%;
  height: 100%;
}
</style>