<template>
  <div id="modeBar">
    <el-image class="modeLeftRectangle"
              :class="{'modeUnactive': mode !== 1, 'modeRectangleUnactive': mode !== 1 ,'modeRectangleActive': mode === 1}"
              :src="assets.F2F2F2_Square" @click="toLearningCornerBook"></el-image>
    <el-image
        class="modeAngledTriangle"
        :class="{'modeUnactive': mode !== 1,'modeLeftAngledTriangleUnactive':mode!== 1,'modeLeftAngledTriangleActive':mode ===1}"
        :src="assets.F2F2F2_BottomLeftAngledTriangle"
        @click="toLearningCornerBook"
    ></el-image>
    <el-image
        class="modeAngledTriangle"
        :class="{'modeUnactive': mode !== 2,'modeRightAngledTriangleUnactive':mode !== 2,'modeRightAngledTriangleActive':mode === 2}"
        :src="assets.C9C9C9_TopRightAngledTriangle"
        @click="toWorkbench"
    ></el-image>
    <el-image
        class="modeRightRectangle"
        :class="{'modeUnactive': mode !== 2, 'modeRectangleUnactive': mode !== 2 ,'modeRectangleActive': mode === 2}"
        :src="assets.C9C9C9_Square" @click="toWorkbench"
    ></el-image>
    <div class="modeName modeLeftName"
         :class="{'modeUnactive': mode !== 1,'modeNameUnactive': mode !== 1, 'modeNameActive': mode === 1}"
         @click="toLearningCornerBook">
      期末必过角
    </div>
    <div class="modeName modeRightName"
         :class="{'modeUnactive': mode !== 2,'modeNameUnactive': mode !== 2, 'modeNameActive': mode === 2}"
         @click="toWorkbench">工作台
    </div>

    <svg-icon id="shareIcon" class="shareIcon" icon-class="share" @click="share"
              data-clipboard-text="http://54.222.173.61:81/home"></svg-icon>

    <input type="text" id="shareLink" class="shareLink" value="http://54.222.173.61:81/home">
  </div>
</template>

<script>
import F2F2F2_Square from "@/assets/pictures/F2F2F2_Square.png";
import C9C9C9_Square from "@/assets/pictures/C9C9C9_Square.png";
import F2F2F2_BottomLeftAngledTriangle from "@/assets/pictures/F2F2F2_BottomLeftAngledTriangle.png";
import C9C9C9_TopRightAngledTriangle from "@/assets/pictures/C9C9C9_TopRightAngledTriangle.png";
import SvgIcon from "@/components/svgIcon/index.vue";
import clipboard from "clipboard";

export default {
  name: 'ModeBar',
  components: {SvgIcon},
  props: {
    mode: Number
  },
  data() {
    return {
      assets: {
        F2F2F2_Square: F2F2F2_Square,
        C9C9C9_Square: C9C9C9_Square,
        F2F2F2_BottomLeftAngledTriangle: F2F2F2_BottomLeftAngledTriangle,
        C9C9C9_TopRightAngledTriangle: C9C9C9_TopRightAngledTriangle
      }
    }
  },
  methods: {
    share() {
      let clipboard0 = new clipboard("#shareIcon");

      clipboard0.on("success", (e) => {
        this.$message({
          message: "分享链接已复制到剪切板",
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

    toLearningCornerBook() {
      if (window.location.href.indexOf("/learningCornerBook") === -1) {
        this.$router.push("/learningCornerBook");
      }
    },
    toWorkbench() {
      if (window.location.href.indexOf("/workbench") === -1) {
        this.$router.push("/workbench");
      }
    }
  }
}
</script>

<style scoped>
#modeBar {
  position: relative;

  height: 60px;
}

#modeBar .modeLeftRectangle {
  position: absolute;

  top: 0;
  left: 0;

  height: 100%;
}

#modeBar .modeRightRectangle {
  position: absolute;

  top: 0;
  right: 0;

  height: 100%;
}

#modeBar .modeRectangleUnactive {
  width: calc(25% - 60px / 2);
}

#modeBar .modeRectangleActive {
  width: calc(75% - 60px / 2);
}

#modeBar .modeAngledTriangle {
  position: absolute;

  top: 0;

  width: 60px;
  height: 100%;
}

#modeBar .modeLeftAngledTriangleUnactive {
  left: calc(25% - 60px / 2);
}

#modeBar .modeLeftAngledTriangleActive {
  left: calc(75% - 60px / 2);
}

#modeBar .modeRightAngledTriangleUnactive {
  right: calc(25% - 60px / 2);
}

#modeBar .modeRightAngledTriangleActive {
  right: calc(75% - 60px / 2);
}

#modeBar .modeName {
  position: absolute;

  top: 0;

  text-align: center;

  font-size: 20px;

  line-height: 60px;

  user-select: none;
}

#modeBar .modeLeftName {
  left: 0;
}

#modeBar .modeRightName {
  right: 0;
}

#modeBar .modeNameUnactive {
  width: calc(25% - 60px / 2);
}

#modeBar .modeNameActive {
  width: calc(75% - 60px / 2);
}

#modeBar .modeUnactive {
  cursor: pointer;
}

#modeBar .shareIcon {
  position: absolute;

  top: 5px;
  right: 5px;

  width: 50px;
  height: 50px;

  cursor: pointer;
}

#modeBar .shareLink {
  position: absolute;

  top: 0;
  left: 0;

  opacity: 0;
}
</style>