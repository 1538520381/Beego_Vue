<template>
  <div id="pdfReader">
    <div class="catalogueContainer">
      <div class="title">目录</div>
      <el-tree class="catalogue" :data="catalogue" :props="{
        children: 'items',
        label: 'title'
      }" @node-click="item=>navigateTo(item.dest)">
      </el-tree>
    </div>
    <div class="pdfContainer" ref="pdfContainer">
    </div>
  </div>
</template>

<script>
import * as PdfJs from "pdfjs-dist/legacy/build/pdf.js";
import {getDocument} from "pdfjs-dist";
import {isEmpty} from "@/utils/common";

PdfJs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");

let pdf = null
export default {
  name: 'PdfReader',
  props: {
    user: Object,
  },
  data() {
    return {
      catalogue: null,

      documentFragment: null,
    }
  },
  created() {
  },
  methods: {
    async loadPdf(url) {
      if(!isEmpty(this.documentFragment)){
        console.log(1)
        this.$refs.pdfContainer.removeChild(this.documentFragment)
        console.log(2)
      }

      if(isEmpty(url)){
        return
      }

      pdf = await getDocument({
        url: url,
        disableFontFace: true,
      }).promise

      this.catalogue = await pdf.getOutline()

      let pageNum = pdf.numPages
      this.documentFragment = document.createDocumentFragment()
      for (let i = 1; i <= pageNum; i++) {
        let container = document.createElement('div')
        container.style.position = 'relative'

        let collectionButton = document.createElement("input")
        collectionButton.type = 'button'
        collectionButton.value = '收藏'
        collectionButton.style.position = 'absolute'
        collectionButton.style.top = "0px"
        collectionButton.style.right = "0px"
        collectionButton.onclick = function () {
          console.log(i)
        }
        container.appendChild(collectionButton)

        let canvas = document.createElement("canvas");
        pdf.getPage(i).then((page) => {
          let originalViewport = page.getViewport({scale: 1});
          let zoomViewPort = page.getViewport({
            scale: this.$refs.pdfContainer.offsetWidth / originalViewport.width
          })
          canvas.id = `page${i}`
          canvas.width = zoomViewPort.width;
          canvas.height = zoomViewPort.height;

          let ctx = canvas.getContext("2d")
          let renderContext = {
            canvasContext: ctx,
            viewport: zoomViewPort,
          };
          page.render(renderContext).promise.then(() => {
            ctx.font = `10px Source Han Serif`
            ctx.rotate((-30 * Math.PI) / 180);
            ctx.fillStyle = "#dadbdc";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";

            let text = this.user.id + " " + this.user.userName
            for (let i = 1; i <= 6; i++) {
              ctx.fillText(text, -canvas.width / 6 * 3, canvas.height / 6 * i);
              ctx.fillText(text, -canvas.width / 6, canvas.height / 6 * i);
              ctx.fillText(text, canvas.width / 6, canvas.height / 6 * i);
              ctx.fillText(text, canvas.width / 6 * 3, canvas.height / 6 * i);
            }
          });
        })

        this.documentFragment.appendChild(container)
        this.documentFragment.appendChild(canvas)
      }
      this.$refs.pdfContainer.appendChild(this.documentFragment)
    },
    async navigateTo(dest) {
      let pageIndex = (await pdf.getPageIndex(dest[0])) + 1
      const pageElement = document.getElementById(`page${pageIndex}`);
      if (pageElement) {
        pageElement.scrollIntoView({behavior: "smooth"});
      }
    },
  }
}
</script>

<style scoped>
#pdfReader {
  width: 100%;
  height: 100%;
}

#pdfReader .catalogueContainer {
  display: inline-block;

  vertical-align: top;

  width: 30%;
  height: 100%;
}

#pdfReader .catalogueContainer .title {
  margin: 10px 0 0 0;

  width: 100%;

  font-size: 20px;
  font-weight: bold;

  text-align: center;
}

#pdfReader .catalogueContainer .catalogue {
  font-size: 18px;

  line-height: 40px;
}

#pdfReader .catalogueContainer .catalogue /deep/ .el-tree-node__content {
  height: 40px;
}

#pdfReader .pdfContainer {
  display: inline-block;

  vertical-align: top;

  margin: 10px 10px 0 10px;

  width: calc(70% - 20px);
  height: 100%;

  overflow-y: auto;
}

#pdfReader .pdfContainer::-webkit-scrollbar {
  width: 0;
}
</style>