<template>
  <div id="fileContainer">
    <el-image class="image" fit="contain" :src="fileUrl" v-if="constants.imageType.indexOf(fileType) !== -1"
              @click="downloadFile(fileUrl,fileName + '.' + fileType)"></el-image>
    <div class="file" @click="downloadFile(fileUrl,fileName + '.' + fileType)" v-else>
      <svg-icon class="fileIcon" :icon-class="constants.fileTypeIconDict[fileType]"
                v-if="!isEmpty(constants.fileTypeIconDict[fileType])"></svg-icon>
      <svg-icon class="fileIcon" icon-class="unknownFile" v-else></svg-icon>
      <div class="fileName">{{ fileName + "." + fileType }}</div>
    </div>
    <div class="removeFileButton" @click="removeFile" v-if="removeFlag">
      <svg-icon class-name="minusIcon" icon-class="minus"></svg-icon>
    </div>
  </div>
</template>

<script>
import {isEmpty} from "@/utils/common";

export default {
  name: "FileContainer",
  props: {
    fileName: String,
    fileType: String,
    fileUrl: String,
    removeFlag: Boolean
  },
  data() {
    return {
      constants: {
        imageType: ['jpg', 'png'],
        fileTypeIconDict: {
          'pdf': 'pdf',
          'doc': 'word',
          'docx': 'word',
          'txt': 'txt',
        }
      }
    }
  },
  methods: {
    downloadFile(url, name) {
      const xhr = new XMLHttpRequest();
      xhr.open("get", url);
      xhr.responseType = "blob";
      xhr.onload = (e) => {
        if (xhr.status === 200) {
          const response = xhr.response;
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(response, name);
          } else {
            const href = URL.createObjectURL(response);
            let ele = document.createElement("a");
            ele.target = "_blank";
            ele.href = href;
            ele.download = name;
            ele.click();
            ele = null;
            URL.revokeObjectURL(href);
          }
        } else {
          this.$message.error("下载失败");
        }
      };
      xhr.send(null);
    },
    removeFile() {
      this.$emit('removeFile')
    },

    isEmpty
  },
}
</script>

<style scoped>

#fileContainer {
  margin: 5px 0 5px 0;
}

#fileContainer .image {
  width: 50px;
  height: 50px;

  border: 1px solid #DCDCDC;
  border-radius: 8px;

  cursor: pointer;
}

#fileContainer .file {
  display: inline-flex;

  flex-flow: row;

  width: 180px;
  height: 50px;

  border: 1px solid #DCDCDC;
  border-radius: 8px;

  cursor: pointer;
}

#fileContainer .fileIcon {
  margin: 5px 0 5px 5px;

  width: 40px;
  height: 40px;
}

#fileContainer .fileName {
  flex: 1;

  line-height: 50px;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#fileContainer .removeFileButton {
  display: inline-block;

  vertical-align: bottom;

  margin: 0 0 0 5px;

  width: 14px;
  height: 14px;

  border-radius: 50%;

  background: red;

  cursor: pointer;
}

#fileContainer .removeFileButton .minusIcon {
  vertical-align: top;

  width: 100%;
  height: 100%;
}
</style>