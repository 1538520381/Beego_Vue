<template>
  <div id="robotInputContainer">
    <div class="toolBar">
      <el-button
          class="toolButton"
          :icon="assets.DeleteFilled"
          circle
          @click="refreshSession"
          v-if="refreshSessionFlag"
      ></el-button>
      <el-upload
          accept=".pdf, .doc, .docx, .txt, .png, .jpg"
          action="/api/file/uploadPicture?bucketType=1"
          :show-file-list="false"
          :on-success="fileUploadSuccess"
          class="toolButton"
      >
        <el-tooltip
            content="上传附件"
            placement="top-start"
            effect="light"
        >
          <el-button class="toolButton" :icon="assets.Folder" circle></el-button>
        </el-tooltip>
      </el-upload>
    </div>

    <div class="inputContainer">
      <div class="prompts">
        <el-button
            class="prompt"
            v-for="(item, index) in robotPrompts"
            @click="selectPrompt(item)"
        >
          {{ item }}
        </el-button>
      </div>
      <FileContainer v-if="!isEmpty(file)" :fileName="file.name" :fileType="file.type"
                     :fileUrl="file.url" :removeFlag="true" @removeFile="removeFile"></FileContainer>
      <el-input class="input" type="textarea" resize="none" v-model="input" :rows="1"
                :autosize="{ minRows: 1, maxRows: 8 }"
                placeholder="开始你的提问吧"/>
    </div>

    <div class="controlBar">
      <el-tooltip
          content="发送"
          placement="top-start"
          effect="light"
      >
        <el-button class="controllerButton"
                   :class="{'controllerButtonUnactive':isEmpty(input) && isEmpty(file),'controllerButtonActive':!(isEmpty(input) && isEmpty(file))}"
                   @click="chat"
                   circle>
          <svg-icon class="controllerButtonIcon" icon-class="send"></svg-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip
          content="切换ai"
          placement="top-start"
          effect="light"
      >
        <el-button class="controllerButton controllerButtonActive" circle v-if="robotType === 3" @click="selectRobot">
          <svg-icon class="controllerButtonIcon" icon-class="longText"></svg-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import {DeleteFilled, Folder} from "@element-plus/icons-vue";

import FileContainer from "@/components/wechat/fileContainer/index.vue";

import {isEmpty} from "@/utils/common";

export default {
  name: "RobotInputContainer",
  components: {FileContainer},
  props: {
    robotType: Number,
    robotPrompts: Array,
    refreshSessionFlag: Boolean
  },
  data() {
    return {
      assets: {
        Folder,
        DeleteFilled,
      },

      input: null,
      file: null
    }
  },
  methods: {
    chat() {
      if (isEmpty(this.input) && isEmpty(this.file)) {
        return
      }
      this.$emit('chat', this.input, this.file)
      this.input = null
      this.file = null
    },

    refreshSession() {
      this.$emit('refreshSession')
    },

    selectPrompt(prompt) {
      this.input = prompt
    },

    fileUploadSuccess(res) {
      if (res.code === 200) {
        this.file = {
          id: res.data["file_id"],
          name: res.data["file_name"],
          type: res.data["file_type"],
          url: res.data["file_url"],
        }
        console.log(this.file)
      } else {
        this.$message.error(res.message);
      }
    },
    removeFile() {
      this.file = null
    },

    selectRobot() {
      this.$emit('selectRobot')
    },

    isEmpty
  },
}
</script>

<style scoped>
#robotInputContainer {
  display: inline-flex;

  flex-flow: row;

  position: relative;

  margin: 10px 20px 10px 20px;

  width: calc(100% - 20px * 2);
}

#robotInputContainer .toolBar {
  margin: auto 0 0 0;

  width: auto;
  height: 20px;
}

#robotInputContainer .toolBar .toolButton {
  display: inline-block;

  position: relative;

  vertical-align: top;

  margin: 0 5px 0 0;
  padding: 0;

  width: 25px;
  height: 25px;
}

#robotInputContainer .inputContainer {
  display: inline-block;

  flex: 1;

  padding: 0 5px 0 5px;

  width: 0;
}

#robotInputContainer .inputContainer .prompts .prompt {
  display: block;

  margin: 0 0 4px 0;

  max-width: 100%;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#robotInputContainer .inputContainer .input {
  font-size: 10px;
}

#robotInputContainer .inputContainer .input /deep/ .el-textarea__inner {
  border-radius: 20px;
}

#robotInputContainer .controlBar {
  margin: auto 0 0 0;

  height: 20px;
}


#robotInputContainer .controlBar .controllerButton {
  margin: 0 0 0 5px;

  width: 25px;
  height: 25px;
}

#robotInputContainer .controlBar .controllerButtonUnactive {
  background: #D6D5DE;
}

#robotInputContainer .controlBar .controllerButtonActive {
  background: #46A2FF;
}

#robotInputContainer .controlBar .controllerButtonIcon {
  width: 20px;
  height: 20px;
}
</style>