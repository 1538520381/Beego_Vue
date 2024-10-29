<template>
  <div
      ref="floatDrag"
      class="float-position"
      :style="{ left: left + 'px', top: top + 'px', zIndex: zIndex }"
      @touchmove.prevent
      @mousemove.prevent
      @mousedown="mouseDown"
      @mouseup="mouseUp"
  >
    <svg-icon icon-class="contactUs"></svg-icon>
<!--    <svg-->
<!--        t="1630029318602"-->
<!--        class="icon"-->
<!--        viewBox="0 0 1024 1024"-->
<!--        version="1.1"-->
<!--        xmlns="http://www.w3.org/2000/svg"-->
<!--        p-id="1244"-->
<!--        width="200"-->
<!--        height="200"-->
<!--    >-->
<!--      <path-->
<!--          d="M554.376075 850.102995l0.208185 87.874926 170.711774-0.14573v85.355887l-209.038649 0.187367c-1.39484 0.124911-2.727225 0.41637-4.163702 0.41637s-2.706406-0.291459-4.163702-0.41637l-208.997011 0.187366v-85.230975l170.33704-0.14573-0.208185-88.041474A383.643483 383.643483 0 0 1 128.200378 469.061825h84.772969a298.37087 298.37087 0 0 0 294.769268 297.704678c1.290748-0.124911 2.539858-0.395552 3.872243-0.395551s2.498221 0.270641 3.76815 0.374733a298.350052 298.350052 0 0 0 294.60272-297.704678h85.751438a383.664302 383.664302 0 0 1-341.361091 381.061988z m-42.240755-168.047005A213.160713 213.160713 0 0 1 298.93297 468.936914h0.458007l-0.374733-255.65129a213.160713 213.160713 0 0 1 426.300608-1.936121c0 0.374733 0.124911 0.728648 0.124911 1.124199l0.374733 256.463212a42.782036 42.782036 0 0 1-0.791103 7.890215 213.035802 213.035802 0 0 1-212.890073 205.228861z m128.32529-213.223168l-0.374734-255.65129h-0.333096a127.721552 127.721552 0 0 0-255.422286 0h-0.166548l0.374733 255.65129v1.061744a127.659097 127.659097 0 0 0 255.318194-0.957652h0.624555a0.895196 0.895196 0 0 0-0.124911-0.104092z m-129.366215-42.532214h2.081851H510.990302z"-->
<!--          fill="#fff"-->
<!--          p-id="1245"-->
<!--      ></path>-->
<!--    </svg>-->
  </div>
</template>

<script>
import SvgIcon from "@/components/svgIcon/index.vue";

export default {
  name: "DragBall",
  components: {SvgIcon},
  props: {
    distanceRight: {
      type: Number,
      default: 0
    },
    distanceBottom: {
      type: Number,
      default: 100
    },
    isScrollHidden: {
      type: Boolean,
      default: false
    },
    isCanDraggable: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 50
    },
    value: {
      type: String,
      default: "悬浮球！"
    }
  },

  //data 域
  data() {
    return {
      clientWidth: null,
      clientHeight: null,
      left: 0,
      top: 0,
      timer: null,
      currentTop: 0,
      mousedownX: 0,
      mousedownY: 0
    };
  },
  created() {
    this.clientWidth = document.documentElement.clientWidth;
    this.clientHeight = document.documentElement.clientHeight;
  },
  mounted() {
    this.isCanDraggable &&
    this.$nextTick(() => {
      this.floatDrag = this.$refs.floatDrag;
      // 获取元素位置属性
      this.floatDragDom = this.floatDrag.getBoundingClientRect();
      // 设置初始位置
      this.left =
          this.clientWidth - this.floatDragDom.width - this.distanceRight;
      this.top =
          this.clientHeight - this.floatDragDom.height - this.distanceBottom;
      this.initDraggable();
    });
    this.isScrollHidden && window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    /**
     * 设置滚动监听
     * 设置滚动时隐藏悬浮按钮，停止时显示
     */
    handleScroll() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.handleScrollEnd();
      }, 200);
      this.currentTop =
          document.documentElement.scrollTop || document.body.scrollTop;
      if (this.left > this.clientWidth / 2) {
        // 判断元素位置再左侧还是右侧
        this.left = this.clientWidth + this.floatDragDom.width;
      } else {
        this.left = -this.floatDragDom.width;
      }
    },
    /**
     * 滚动结束
     */
    handleScrollEnd() {
      let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop === this.currentTop) {
        console.log(this.left);
        if (this.left > this.clientWidth / 2) {
          // 判断元素位置再左侧还是右侧
          this.left = this.clientWidth - this.floatDragDom.width;
        } else {
          this.left = 0;
        }
        clearTimeout(this.timer);
      }
    },
    /**
     * 窗口resize监听
     */
    handleResize() {
      this.clientWidth = document.documentElement.clientWidth;
      this.clientHeight = document.documentElement.clientHeight;
      this.checkDraggablePosition();
    },
    /**
     * 初始化draggable
     */
    initDraggable() {
      this.floatDrag.addEventListener("touchstart", this.toucheStart);
      this.floatDrag.addEventListener("touchmove", e => this.touchMove(e));
      this.floatDrag.addEventListener("touchend", this.touchEnd);
    },
    mouseDown(e) {
      const event = e || window.event;
      this.mousedownX = event.screenX;
      this.mousedownY = event.screenY;
      const that = this;
      let floatDragWidth = this.floatDragDom.width / 2;
      let floatDragHeight = this.floatDragDom.height / 2;
      if (event.preventDefault) {
        event.preventDefault();
      }
      this.canClick = false;
      this.floatDrag.style.transition = "none";
      document.onmousemove = function (e) {
        var event = e || window.event;
        that.left = event.clientX - floatDragWidth;
        that.top = event.clientY - floatDragHeight;
        if (that.left < 0) that.left = 0;
        if (that.top < 0) that.top = 0;
        if (that.left >= that.clientWidth - floatDragWidth * 2) {
          that.left = that.clientWidth - floatDragWidth * 2;
        }
        if (that.top >= that.clientHeight - floatDragHeight * 2) {
          that.top = that.clientHeight - floatDragHeight * 2;
        }
      };
    },
    mouseUp(e) {
      const event = e || window.event;
      //判断只是单纯的点击，没有拖拽
      if (
          this.mousedownY == event.screenY &&
          this.mousedownX == event.screenX
      ) {
        this.$emit("handlepaly");
      }
      document.onmousemove = null;
      this.checkDraggablePosition();
      this.floatDrag.style.transition = "all 0.3s";
    },
    toucheStart() {
      this.canClick = false;
      this.floatDrag.style.transition = "none";
    },
    touchMove(e) {
      this.canClick = true;
      if (e.targetTouches.length === 1) {
        // 单指拖动
        let touch = event.targetTouches[0];
        this.left = touch.clientX - this.floatDragDom.width / 2;
        this.top = touch.clientY - this.floatDragDom.height / 2;
      }
    },
    touchEnd() {
      if (!this.canClick) return; // 解决点击事件和touch事件冲突的问题
      this.floatDrag.style.transition = "all 0.3s";
      this.checkDraggablePosition();
    },
    /**
     * 判断元素显示位置
     * 在窗口改变和move end时调用
     */
    checkDraggablePosition() {
      if (this.left + this.floatDragDom.width / 2 >= this.clientWidth / 2) {
        // 判断位置是往左往右滑动
        this.left = this.clientWidth - this.floatDragDom.width;
      } else {
        this.left = 0;
      }
      if (this.top < 0) {
        // 判断是否超出屏幕上沿
        this.top = 0;
      }
      if (this.top + this.floatDragDom.height >= this.clientHeight) {
        // 判断是否超出屏幕下沿
        this.top = this.clientHeight - this.floatDragDom.height;
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>
<style>
html,
body {
  overflow: hidden;
}
</style>
<style scoped lang="less">
.float-position {
  position: absolute;
  z-index: 10003;
  right: 0;
  top: 70%;
  width: 20px;
  height: 20px;
  background: deepskyblue;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0px 0px 10px 2px skyblue;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8em;
  user-select: none;
}

.cart {
  border-radius: 50%;
  width: 5em;
  height: 5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }

  .notice-badge {
    color: inherit;

    .header-notice-icon {
      font-size: 16px;
      padding: 4px;
    }
  }
}

.drag-ball .drag-content {
  overflow-wrap: break-word;
  font-size: 14px;
  color: #fff;
  letter-spacing: 2px;
}
</style>

