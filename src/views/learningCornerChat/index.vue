<template>
  <div id="learningCornerChat">
    <el-menu class="bookMenu" :default-active="bookActive" v-if="bookMenuShow" @select="selectBookMenu">
      <div class="bookMenuTitle">课程</div>
      <el-scrollbar class="bookMenuScrollbar">
        <el-menu-item class="bookMenuItem" v-for="(item,index) in bookMenuItems" :index="String(index)">
          <div class="bookMenuItemName">{{ item.bookName }}</div>
        </el-menu-item>
      </el-scrollbar>
      <div class="user" @click="toPersonalCenter">
        <el-image class="userAvatar" round :src="test"></el-image>
        <div class="userInformation">
          <div class="userId">{{ user.id }}</div>
          <div class="userName">{{ user.userName }}</div>
        </div>
      </div>
    </el-menu>

    <el-button class="bookMenuControllerButton bookMenuControllerButtonOpen" v-if="bookMenuShow"
               @click="closeBookMenu"
               :icon="ArrowLeftBold" circle/>
    <el-button class="bookMenuControllerButton bookMenuControllerButtonClose" v-else @click="openBookMenu"
               :icon="ArrowRightBold" circle/>

    <div class="mainContainer" :class="{mainContainerShort:bookMenuShow,mainContainerLong:!bookMenuShow}">
      <div class="patterns">
        <div class="pattern2 pattern2unactive" @click="toWorkbench">
          工作台
        </div>
        <div class="pattern1 pattern1active">
          学习角
        </div>
        <svg-icon class="shareIcon" icon-class="share" @click="share"></svg-icon>
      </div>
      <div class="studyContainer">
        <div class="catalogueContainer" v-if="initFlag">
          <div class="bookTitle">{{ bookMenuItems[bookActive].bookName }}</div>
          <el-scrollbar class="catalogueScrollbar">
            <el-tree class="catalogue" :data="book" :props="{
            label: 'outline',
            children: 'outline_child_list',
          }">
              <template v-slot="{ node }">
                <span>{{ node.data.outline.outline_content }}</span> <!-- 自定义节点显示内容 -->
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="chatContainer">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import test from "@/assets/pictures/test.jpg";

import {ArrowLeftBold, ArrowRightBold} from '@element-plus/icons-vue'

import SvgIcon from "@/components/svgIcon/index.vue";
import {getCatalogueByBookId} from "@/apis/book";
import {isEmpty} from "@/utils/common";
import {getUserByToken} from "@/apis/user";

export default {
  name: 'LearningCornerChat',
  components: {SvgIcon},
  data() {
    return {
      test: test,

      token: null,
      user: {},

      ArrowLeftBold: ArrowLeftBold,
      ArrowRightBold: ArrowRightBold,

      bookMenuItems: [],
      book: [],

      bookActive: 0,

      bookMenuShow: true,

      initFlag: false
    }
  },
  async created() {
    this.bookMenuItems = this.$store.state.bookList
    if (isEmpty(this.bookMenuItems)) {
      this.toLearningCornerBook()
      return
    }
    for (let i in this.bookMenuItems) {
      if (this.bookMenuItems[i].id === this.$store.state.bookId) {
        this.bookActive = i
      }
    }

    await this.getUserByToken()
    await this.getCatalogueByBookId()

    this.initFlag = true
  },
  methods: {
    getUserByToken() {
      return getUserByToken().then((res) => {
        if (res.data.code === 200) {
          this.user = {
            id: res.data.data['user_id'],
            email: res.data.data['email'],
            userName: res.data.data['user_name']
          }
        } else {
          this.$router.push("/home");
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },
    getCatalogueByBookId() {
      getCatalogueByBookId(this.bookMenuItems[this.bookActive].id).then((res) => {
        if (res.data.code === 200) {
          this.book = [res.data.data]
        } else {
          this.book = []
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },

    share() {
      navigator.clipboard.writeText("假装这里有分享链接")
      this.$message.success("分享链接已复制到剪切板")
    },

    selectBookMenu(index) {
      this.bookActive = parseInt(index)
      this.getCatalogueByBookId()
    },

    closeBookMenu() {
      this.bookMenuShow = false
    },
    openBookMenu() {
      this.bookMenuShow = true
    },

    toWorkbench() {
      this.$router.push('/workbench')
    },
    toLearningCornerBook() {
      this.$router.push("/learningCornerBook")
    },
    toPersonalCenter() {
      this.$router.push('/personalCenter')
    }
  }
}
</script>

<style scoped>
#learningCornerChat {
  width: 100%;
  height: 100%;
}

#learningCornerChat .bookMenu {
  display: inline-block;

  vertical-align: top;

  width: 180px;
  height: 100%;

  border: 0;

  background: #E6E6E6;
}

#learningCornerChat .bookMenu .bookMenuTitle {
  margin: 10px 10px 0 10px;

  width: calc(100% - 10px * 2 - 4px * 2);
  height: 40px;

  border: 4px dotted #000000;
  border-radius: 10px;

  background: #CBCBCB;

  text-align: center;

  font-size: 20px;

  line-height: 40px;
}

#learningCornerChat .bookMenu .bookMenuScrollbar {
  width: 100%;
  height: calc(100% - 120px - 10px - 40px - 8px);
}

#learningCornerChat .bookMenu .bookMenuScrollbar .bookMenuItem .bookMenuItemName {
  width: 100%;
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: center;

  line-height: 40px;

  background: #CBCBCB;

  font-size: 16px;
}

#learningCornerChat .bookMenu .user {
  margin: 30px 0 30px 30px;

  width: 100%;
  height: 60px;

  text-align: left;
}

#learningCornerChat .bookMenu .user .userAvatar {
  display: inline-block;

  vertical-align: top;

  width: 60px;
  height: 60px;

  border-radius: 50%;
}

#learningCornerChat .bookMenu .user .userInformation {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 20px;

  height: 60px;
}

#learningCornerChat .bookMenu .user .userInformation .userId {
  width: 100%;
  height: 30px;

  line-height: 30px;
}

#learningCornerChat .bookMenu .user .userInformation .userName {
  width: 100%;
  height: 30px;

  line-height: 30px;
}

#learningCornerChat .bookMenuControllerButton {
  position: absolute;

  width: 30px;
  height: 30px;

  z-index: 1;
}

#learningCornerChat .bookMenuControllerButtonClose {
  top: calc(50% - 30px / 2);
  left: calc(0px - 30px / 2);
}

#learningCornerChat .bookMenuControllerButtonOpen {
  top: calc(50% - 30px / 2);
  left: calc(180px - 30px / 2);
}

#learningCornerChat .mainContainer {
  display: inline-flex;
  flex-flow: column;

  position: relative;

  vertical-align: top;

  height: 100%;
}

#learningCornerChat .mainContainerShort {
  width: calc(100% - 180px);
}

#learningCornerChat .mainContainerLong {
  width: calc(100%);
}

#learningCornerChat .mainContainer .patterns {
  position: relative;

  width: 100%;
  height: 60px;
}

#learningCornerChat .mainContainer .patterns .pattern1 {
  position: absolute;

  top: -1px;
  left: 0;

  height: 60px;

  font-size: 24px;

  line-height: 60px;

  cursor: pointer;
}

#learningCornerChat .mainContainer .patterns .pattern1:before {
  content: '';

  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: #F2F2F2;

  transform: perspective(10px) rotateX(0.5deg);
  transform-origin: left;
}

#learningCornerChat .mainContainer .patterns .pattern1active {
  padding: 0 0 0 30%;

  width: calc(70% - 30%);
}

#learningCornerChat .mainContainer .patterns .pattern1active:before {
  z-index: -1;
}

#learningCornerChat .mainContainer .patterns .pattern2 {
  position: absolute;

  top: 1px;
  right: 0;

  height: 60px;

  font-size: 24px;

  line-height: 60px;

  cursor: pointer;
}

#learningCornerChat .mainContainer .patterns .pattern2:before {
  content: '';

  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: #C9C9C9;

  transform: perspective(10px) rotateX(-0.5deg);
  transform-origin: right;
}

#learningCornerChat .mainContainer .patterns .pattern2unactive {
  padding: 0 0 0 52%;

  width: calc(70% - 52%);
}

#learningCornerChat .mainContainer .patterns .pattern2unactive:before {
  z-index: -2;
}

#learningCornerChat .mainContainer .patterns .shareIcon {
  position: absolute;

  top: 5px;
  right: 5px;

  width: 50px;
  height: 50px;

  cursor: pointer;
}

#learningCornerChat .mainContainer .studyContainer {
  width: 100%;
  height: calc(100% - 64px);
}

#learningCornerChat .mainContainer .studyContainer .catalogueContainer {
  display: inline-block;

  position: relative;

  width: 50%;
  height: 100%;
}

#learningCornerChat .mainContainer .studyContainer .catalogueContainer .bookTitle {
  margin: 20px 0 0 0;

  width: 100%;
  height: 50px;

  text-align: center;

  font-size: 30px;
}

#learningCornerChat .mainContainer .studyContainer .catalogueContainer .catalogueScrollbar {
  width: 100%;
  height: calc(100% - 50px - 20px);
}

#learningCornerChat .mainContainer .studyContainer .catalogueContainer .catalogueScrollbar .catalogue {
  width: 100%;
  height: 100%;

  font-size: 20px;

  overflow: auto
}

#learningCornerChat .mainContainer .studyContainer .catalogueContainer .catalogueScrollbar /deep/ .el-tree-node.is-expanded > .el-tree-node__children {
  display: inline;
}

#learningCornerChat .mainContainer .studyContainer .catalogueContainer .catalogueScrollbar .catalogue /deep/ .el-tree-node__content {
  height: 60px;

  align-self: baseline;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer {
  display: inline-block;

  vertical-align: top;

  width: calc(50% - 1px);
  height: 100%;

  border-left: 1px solid #F2F2F2;
}
</style>