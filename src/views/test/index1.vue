<template>
  <div class="margin-box" v-loading="loading">
    <div class="document-directory">
      <span class="directory-title"> 目录 </span>
      <div class="directory-tree">
        <!-- 目录渲染 -->
        <el-tree
            :data="treeData.outline"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :props="treeData.defaultProps" @node-click="data=>navigateTo(data.dest)">
        </el-tree>
      </div>
    </div>
    <div class="PDF-content pdf-container" ref="pdfContainer">
    </div>
  </div>
</template>

<script>
import * as PdfJs from "pdfjs-dist/legacy/build/pdf.js";
import {getDocument} from "pdfjs-dist";

PdfJs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");

async function getPdf(src) {
  const loadingTask = getDocument({
    url: src,
    disableFontFace: true,   //禁用文本抗锯齿 ,提高渲染性能
  });
  const pdf = await loadingTask.promise;
  return pdf;
}

let pdf1 = "";

export default {
  name: "PdfViewer",
  props: {
    src: String,
  },
  data() {
    return {
      pdf: null,
      numPages: 0,
      treeData: {
        outline: [],
        defaultProps: {
          children: 'items',
          label: 'title'
        }
      },
      loading: false,
      fragment: document.createDocumentFragment()
    };
  },
  mounted() {
    this.loadPdf("http://54.222.173.61:9000/userchat/20241202_1733107667_628.pdf");
  },
  methods: {
    async loadPdf(src) {
      this.loading = true

      // 注意，此处接受的src必须是浏览器可以直接访问pdf的路径
      pdf1 = await getPdf(src);

      // 获取pdf的也页数
      this.numPages = pdf1.numPages;
      this.renderAllPages();
      this.renderOutline(pdf1);
    },
    //渲染整个pdf
    async renderAllPages() {
      for (let i = 1; i <= this.numPages; i++) {
        // 通过文档碎片统一渲染提高性能

        // 插入每一页的pdf渲
        this.fragment.appendChild(await this.renderPage(i));
        // let btn = document.createElement("input")
        // btn.id = "btn"
        // btn.type = "button"
        // btn.value = "按钮"
        // btn.style.display = "absolute"
        // btn.style.width = "10px"
        // btn.style.height = "20px"
        // btn.style.top = "10px"
        // btn.style.right = "10px"
        // btn.onclick = function () {
        //   console.log(i)
        // }
        // this.fragment.appendChild(btn)

      }
      this.$refs.pdfContainer.appendChild(this.fragment);

      this.loading = false

    },
    // 获取目录树
    async renderOutline(pdf) {
      const outline = await pdf.getOutline();
      this.treeData.outline = outline
    },
    // 渲染某页页pdf
    async renderPage(pageNumber) {
      if (!pdf1) {
        return;
      }


      const dd = document.createElement("div")

      dd.style.position = "relative"
      let btn = document.createElement("input")
      btn.id = "btn"
      btn.type = "button"
      btn.value = "按钮"
      btn.style.position = "absolute"
      btn.style.width = "10px"
      btn.style.height = "20px"
      btn.style.top = "10px"
      btn.style.right = "10px"
      btn.onclick = function () {
        console.log(pageNumber)
      }
      dd.appendChild(btn)
      const canvas = document.createElement("canvas");
      pdf1.getPage(pageNumber).then((page) => {
        const viewport = page.getViewport({scale: 3});


        canvas.id = `page-${pageNumber}`;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        console.log(canvas.width)
        dd.style.width = canvas.width + "px"
        dd.style.height = canvas.height + "px"
        const ctx = canvas.getContext("2d");
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        dd.appendChild(canvas)
        page.render(renderContext).promise.then(() => {
          let objmsg = {
            canvas: canvas,
            fontText: "张三-2023-01-01",
            fontSize: 20,
            fontFamily: "microsoft yahei",
            fontcolor: "#dadbdc", //字体颜色   默认 #dadbdc
            rotate: 25, //旋转角度   数字类型
            textAlign: "left", //水印文字居中方式:left center right  默认 left
          };
          this.createWaterMark(objmsg);
          // this.drawWaterMark(canvas);
          console.log(canvas.width)
        });
      })
      return dd
    },
    createWaterMark({
                      canvas,
                      fontText,
                      fontFamily = "microsoft yahei",
                      fontSize = 30,
                      fontcolor = "#dadbdc",
                      rotate = 30,
                      textAlign = "left"
                    }) {
      let ctx = canvas.getContext("2d");
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.rotate((-rotate * Math.PI) / 180);
      ctx.fillStyle = fontcolor;
      ctx.textAlign = textAlign;
      ctx.textBaseline = "Middle";
      for (let i = 1; i <= 6; i++) {
        ctx.fillText(fontText, -canvas.width / 6 * 3, canvas.height / 6 * i);
        ctx.fillText(fontText, -canvas.width / 6, canvas.height / 6 * i);
        ctx.fillText(fontText, canvas.width / 6, canvas.height / 6 * i);
        ctx.fillText(fontText, canvas.width / 6 * 3, canvas.height / 6 * i);
      }
    },
    drawWaterMark(ele) {
      let div = document.createElement("div");
      div.style.pointerEvents = "none";
      div.style.top = "0";
      div.style.left = "0px";
      div.style.position = "absolute";
      div.style.background = "url(" + ele.toDataURL("image/png") + ") left top repeat";
      let width = document.getElementById("pdfBox").clientWidth || 700;
      let height = document.getElementById("pdfBox").clientHeight || 700;
      div.style.width = width + "px";
      div.style.height = height + "px";
      document.getElementById("myIframe").appendChild(div);
    },
    // 点击跳转到某页
    async navigateTo(dest) {
      if (!pdf1 || !dest) {
        return;
      }

      // 获取目标页面的页码
      const pageNumber = (await pdf1.getPageIndex(dest[0])) + 1;

      // 滚动到目标页面
      const pageElement = document.getElementById(`page-${pageNumber}`);
      if (pageElement) {
        pageElement.scrollIntoView({behavior: "smooth"});
      }
    },
  },
};
</script>

<style scoped>
.margin-box {
  box-sizing: border-box;
  margin: 10px;
  height: 95%;
  display: flex;
}

.document-directory {
  width: 400px;
  background-color: #fff;
  height: 100%;
  padding: 20px;
  overflow: auto;
}

.directory-title {
  display: inline-block;
  font-size: 18px;
  margin-bottom: 20px;
}

.PDF-content {
  flex: 1;
  height: 100%;
  overflow: auto;
  background: #eff;
  display: flex;
  flex-direction: column;
  margin: 0 10px;
}

/deep/ .el-tree-node.is-current > .el-tree-node__content {
  color: #cc2722 !important;
  font-weight: 600;
}

/deep/ .el-tree-node:focus > .el-tree-node__content {
  background-color: #fff !important;
}

/deep/ .el-tree-node__content:hover {
  background-color: #fff !important;
}

/deep/ .el-icon-caret-right:before {
  content: "";
}

/deep/ .el-tree-node__content {
  height: 40px;
}

/deep/ .el-tree-node__label {
  line-height: 40px;
}
</style>

