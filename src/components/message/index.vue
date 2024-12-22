<template>
  <div id="message">
    <div class="messageRow"
         :class="{'robotMessageRow': role === 'assistant','userMessageRow':role === 'user'}">
      <el-image class="avatar" :src="robotAvatar" v-if="role === 'assistant'"></el-image>
      <div class="messageContainer">
        <div class="contentContainer">
          <div class="content" v-highlight
               v-html="md.render(markdownSpecialCharacterReplace(content))"
               v-if="md != null && !isEmpty(content) && isEmpty(answer)"></div>
          <div class="content" v-highlight
               v-html="md.render(markdownSpecialCharacterReplace(latexContent))"
               v-if="md != null && !isEmpty(content)  && !isEmpty(answer)"></div>
          <!--          <div class="latexAnswer" v-html="md.render(markdownSpecialCharacterReplace(answer))"-->
          <!--               v-if="md != null && !isEmpty(content)  && !isEmpty(answer)"></div>-->
          <vue-latex :expression="html" display-mode/>
          <!--          <div v-html="html" />-->
          <div class="toolBar">
            <el-tooltip
                content="复制"
                placement="top"
                effect="light"
            >
              <svg-icon id="copyButton" class="toolIcon" icon-class="copy" @click="copy"
                        :data-clipboard-text="markdownSpecialCharacterReplace(content)"></svg-icon>
            </el-tooltip>
          </div>
        </div>
        <FileContainer v-if="!isEmpty(fileUrl)" :fileName="fileName" :fileType="fileType"
                       :fileUrl="fileUrl" :removeFlag="removeFlag"></FileContainer>
      </div>
      <el-image class="avatar" :src="userAvatar" v-if="role === 'user'"></el-image>
    </div>

    <input type="text" id="copy" class="copy" value="123">
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'
// import VueLatex from 'vatex'

import FileContainer from "@/components/fileContainer/index.vue";

import {isEmpty, latexToMarkdown, markdownSpecialCharacterReplace} from "@/utils/common";

import clipboard from 'clipboard';

export default {
  name: 'Message',
  components: {FileContainer},
  props: {
    userAvatar: String,
    robotAvatar: String,
    role: String,
    content: String,
    fileName: String,
    fileType: String,
    fileUrl: String,

    toolBarFlag: Boolean,
    latexFlag: Boolean,
    removeFlag: Boolean
  },
  data() {
    return {
      md: null,

      latexContent: null,
      answer: null,
      html: '',
    }
  },
  async created() {
    this.md = new MarkdownIt()
    this.md.use(MarkdownItKatex);

    if (this.latexFlag && !isEmpty(this.content)) {
      this.latexContent = this.content.trim()
      let regex = /\$\$\n\\boxed\{([\s\S]+)\}\.?\n\$\$/;
      let match = this.latexContent.match(regex);
      if (!isEmpty(match)) {
        this.html = '\\boxed{' + match[1] + '}'
        // this.html = katex.renderToString(this.html, {displayMode: true})
        this.latexContent = this.latexContent.substring(0, this.latexContent.length - match[0].length);
        this.answer = '$' + match[1] + '$'
      }

    }
  },
  methods: {
    latexToMarkdown,
    copy() {
      let clipboard0 = new clipboard("#copyButton");

      clipboard0.on("success", (e) => {
        this.$message({
          message: "复制成功!",
          type: "success",
          duration: 2000,
        });
        e.clearSelection();
        clipboard0.destroy();
      });
      clipboard0.on("error", (e) => {
        this.$message({
          message: "复制失败!",
          type: "error",
          duration: 2000,
        });
        e.clearSelection();
        clipboard0.destroy();
      });
    },

    isEmpty,
    markdownSpecialCharacterReplace,
  }
}
</script>

<style scoped>
#message {
  width: 100%;
}

#message .messageRow {
  margin: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#message .robotMessageRow {
  text-align: left;
}

#message .userMessageRow {
  text-align: right;
}

#message .messageRow .avatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#message .messageRow .messageContainer {
  display: inline-block;

  margin: 0 10px 0 10px;

  max-width: calc(80% - 20px * 2 - 50px - 10px);
}

#message .messageRow .messageContainer .contentContainer {
  display: inline-block;

  padding: 0 20px 0 20px;

  border-radius: 20px;


  text-align: center;

  background: #F2F2F2;
}

#message .messageRow .messageContainer .contentContainer .content {
  text-align: left;
}

#message .messageRow .messageContainer .contentContainer .latexAnswer {
  display: inline-block;

  margin: 0 auto 0 auto;

  border: 3px solid #000000;
}

#message .messageRow .messageContainer .contentContainer .toolBar {
  width: 100%;

  text-align: right;
}

#message .messageRow .messageContainer .contentContainer .toolBar .toolIcon {
  width: 25px;
  height: 25px;

  outline: none;

  cursor: pointer;
}

#message .messageRow .messageContainer .contentContainer .toolBar .toolIcon:hover {
  color: #40A4F3;
}

#message .copy {
  position: absolute;

  top: 0;
  left: 0;

  opacity: 0;
}
</style>