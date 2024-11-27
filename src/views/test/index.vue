<template>
  <div id="test">
    <!-- 按钮，点击后触发事件 -->
    <button @click="toggleSize">点击改变大小</button>

    <!-- 方块，使用过渡动画 -->
    <transition name="size-change" @before-enter="beforeEnter" @after-enter="afterEnter">
      <div :class="flag ? 'box1':'box2'">
        <!-- 方块内的字符，只有在宽高变化到10px后才显示 -->
        <span v-if="isVisible">1</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Test",
  data() {
    return {
      size: 5, // 方块初始大小
      isVisible: true, // 控制方块的显示与隐藏
      flag: false
    };
  },
  methods: {
    // 切换方块的大小
    toggleSize() {
      this.flag = !this.flag;
      if (this.flag) {
        this.isVisible = false;
      } else {
        this.$nextTick(() => {
          this.isVisible = true; // 显示方块
        });
      }
    },
  },
};
</script>

<style scoped>
/* 初始方块样式 */
.box1 {
  width: 50px;
  height: 50px;
  background-color: #3498db;
  transition: all 10s;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.box2 {
  width: 300px;
  height: 300px;
  background-color: #3498db;
  transition: all 10s;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.size-change-enter-active, .size-change-leave-active {
  transition: all 0.5s;
}

.size-change-enter, .size-change-leave-to {
  transform: scale(1);
}

span {
  font-size: 14px;
  color: white;
}
</style>
