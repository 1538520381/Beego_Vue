<template>
  <div id="learningCornerChat">
    <el-menu class="bookMenu" :default-active="String(bookActive)" v-if="bookMenuShow" @select="selectBookMenu">
      <div class="returnButton" @click="toLearningCornerBook">返回</div>
      <div class="bookMenuTitle">课程</div>
      <el-scrollbar class="bookMenuScrollbar">
        <el-menu-item class="bookMenuItem" v-for="(item,index) in bookMenuItems" :index="String(index)">
          <div class="bookMenuItemName">{{ item.bookName }}</div>
          <svg-icon class="collectionIcon" icon-class="collection"
                    v-if="collectionBookIdList.indexOf(item.id) !== -1" @click="uncollection(item.id)"></svg-icon>
          <svg-icon class="collectionIcon" icon-class="uncollection"
                    v-else @click="collection(item.id)"></svg-icon>
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
        <el-image class="patternLeftRectangle patternRectangleActive" :src="F2F2F2_Square"></el-image>
        <el-image class="patternAngledTriangle patternBottomLeftAngledTriangleActive"
                  :src="F2F2F2_BottomLeftAngledTriangle"></el-image>
        <div class="leftTitleActive">学习角</div>
        <el-image class="patternRightRectangle patternRectangleUnactive" :src="C9C9C9_Square"
                  @click="toWorkbench"></el-image>
        <el-image class="patternAngledTriangle patternTopRightAngledTriangleUnactive"
                  :src="C9C9C9_TopRightAngledTriangle" @click="toWorkbench"></el-image>
        <div class="rightTitleUnactive" @click="toWorkbench">工作台</div>
        <!--        <div class="pattern2 pattern2unactive" @click="toWorkbench">-->
        <!--          工作台-->
        <!--        </div>-->
        <!--        <div class="pattern1 pattern1active">-->
        <!--          学习角-->
        <!--        </div>-->
        <svg-icon class="shareIcon" icon-class="share" @click="share"></svg-icon>
      </div>
      <div class="studyContainer">
        <div class="catalogueContainer" v-if="initFlag">
          <div class="bookTitle">{{ bookMenuItems[bookActive].bookName }}</div>
          <el-scrollbar class="catalogueScrollbar">
            <el-tree class="catalogue" :data="catalogue" :props="{
            label: 'outline',
            children: 'outline_child_list',
          }">
              <template v-slot="{ node }">
                <span>{{ node.data.outline.outline_content }}</span>
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
import F2F2F2_Square from '@/assets/pictures/F2F2F2_Square.png'
import C9C9C9_Square from '@/assets/pictures/C9C9C9_Square.png'
import F2F2F2_BottomLeftAngledTriangle from '@/assets/pictures/F2F2F2_BottomLeftAngledTriangle.png'
import C9C9C9_TopRightAngledTriangle from '@/assets/pictures/C9C9C9_TopRightAngledTriangle.png'

import {ArrowLeftBold, ArrowRightBold} from '@element-plus/icons-vue'

import SvgIcon from "@/components/svgIcon/index.vue";
import {collection, getCatalogueByBookId, getCollectionBookList, uncollection} from "@/apis/book";
import {isEmpty} from "@/utils/common";
import {getUserByToken} from "@/apis/user";

export default {
  name: 'LearningCornerChat',
  components: {SvgIcon},
  data() {
    return {
      test: test,
      F2F2F2_Square: F2F2F2_Square,
      C9C9C9_Square: C9C9C9_Square,
      F2F2F2_BottomLeftAngledTriangle: F2F2F2_BottomLeftAngledTriangle,
      C9C9C9_TopRightAngledTriangle: C9C9C9_TopRightAngledTriangle,

      token: null,
      user: {},

      ArrowLeftBold: ArrowLeftBold,
      ArrowRightBold: ArrowRightBold,

      collectionBookIdList: [],
      bookMenuItems: [],
      book: {},
      catalogue: [],

      bookActive: 0,

      bookMenuShow: true,

      initFlag: false
    }
  },
  async created() {
    if (isEmpty(this.$store.state.book)) {
      this.toLearningCornerBook()
    } else {
      this.book = this.$store.state.book
    }

    await this.getCollectionBookList()
    await this.getUserByToken()

    if (this.collectionBookIdList.indexOf(this.book.id) !== -1) {
      this.bookActive = this.collectionBookIdList.indexOf(this.book.id)
    } else {
      this.bookMenuItems.push(this.book)
      this.bookActive = this.bookMenuItems.length - 1
    }
    this.closeBookMenu()
    this.openBookMenu()
    console.log(this.bookMenuItems)
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
          this.catalogue = [res.data.data]
        } else {
          this.catalogue = []
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },

    getCollectionBookList() {
      getCollectionBookList().then((res) => {
        if (res.data.code === 200) {
          this.bookMenuItems = []
          this.collectionBookIdList = []
          if (!isEmpty(res.data.data)) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.bookMenuItems.push({
                id: res.data.data[i]['book_id'],
                bookName: res.data.data[i]['book_name'],
                bookOutlineUrl: res.data.data[i]['book_outline_url'],
                book_url: res.data.data[i]['book_url']
              })
              this.collectionBookIdList.push(res.data.data[i]['book_id'])
            }
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        this.$message.error('系统异常，请联系管理员')
      })
    },
    collection(id) {
      collection(id).then((res) => {
        if (res.data.code === 200) {
          this.collectionBookIdList.push(id)
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },
    uncollection(id) {
      uncollection(id).then((res) => {
        if (res.data.code === 200) {
          this.collectionBookIdList.splice(this.collectionBookIdList.indexOf(id, 1))
          this.$message.success(res.data.message)
        } else {
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

  width: 220px;
  height: 100%;

  border: 0;

  background: #E6E6E6;
}

#learningCornerChat .bookMenu .returnButton {
  margin: 10px 10px 0 10px;

  width: calc(100% - 10px * 2 - 4px * 2);
  height: 40px;

  border: 4px solid #CBCBCB;
  border-radius: 10px;

  background: #CBCBCB;

  text-align: center;

  font-size: 20px;

  line-height: 40px;

  cursor: pointer;
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
  height: calc(100% - 120px - 10px - 40px - 10px - 40px - 8px);
}

#learningCornerChat .bookMenu .bookMenuScrollbar .bookMenuItem {
  padding: 0 10px 0 10px;
}

#learningCornerChat .bookMenu .bookMenuScrollbar .bookMenuItem .bookMenuItemName {
  width: calc(100% - 30px);
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: center;

  line-height: 40px;

  background: #CBCBCB;

  font-size: 16px;
}

#learningCornerChat .bookMenu .bookMenuScrollbar .bookMenuItem .collectionIcon {
  margin: 0 3px 0 3px;

  width: 24px;
  height: 24px;
}

#learningCornerChat .bookMenu .user {
  margin: 30px 0 30px 10px;

  width: calc(100% - 10px);
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

  width: 40px;
  height: 40px;

  z-index: 1;
}

#learningCornerChat .bookMenuControllerButtonClose {
  top: calc(50% - 40px / 2);
  left: calc(0px - 40px / 2);
}

#learningCornerChat .bookMenuControllerButtonOpen {
  top: calc(50% - 40px / 2);
  left: calc(220px - 40px / 2);
}

#learningCornerChat .mainContainer {
  display: inline-flex;
  flex-flow: column;

  position: relative;

  vertical-align: top;

  height: 100%;
}

#learningCornerChat .mainContainerShort {
  width: calc(100% - 220px);
}

#learningCornerChat .mainContainerLong {
  width: calc(100%);
}

#learningCornerChat .mainContainer .patterns {
  position: relative;

  width: 100%;
  height: 60px;
}

#learningCornerChat .mainContainer .patterns .patternLeftRectangle {
  position: absolute;

  top: 0;
  left: 0;
}

#learningCornerChat .mainContainer .patterns .patternRightRectangle {
  position: absolute;

  top: 0;
  right: 0;
}

#learningCornerChat .mainContainer .patterns .patternRectangleUnactive {
  width: calc(25% - 60px / 2);
  height: 100%;

  cursor: pointer;
}

#learningCornerChat .mainContainer .patterns .patternRectangleActive {
  width: calc(75% - 60px / 2);
  height: 100%;
}

#learningCornerChat .mainContainer .patterns .patternAngledTriangle {
  position: absolute;

  top: 0;

  width: 60px;
  height: 60px;
}

#learningCornerChat .mainContainer .patterns .patternBottomLeftAngledTriangleActive {
  left: calc(75% - 60px / 2);
}

#learningCornerChat .mainContainer .patterns .patternTopRightAngledTriangleUnactive {
  right: calc(25% - 60px / 2);

  cursor: pointer;
}

#learningCornerChat .mainContainer .patterns .leftTitleActive {
  position: absolute;

  top: 0;
  left: 0;

  width: calc(75% - 60px / 2);
  height: 60px;

  font-size: 20px;

  line-height: 60px;

  text-align: center;

  user-select: none;
}

#learningCornerChat .mainContainer .patterns .rightTitleUnactive {
  position: absolute;

  top: 0;
  right: 0;

  width: calc(25% - 60px / 2);
  height: 60px;

  font-size: 20px;

  line-height: 60px;

  text-align: center;

  cursor: pointer;
}

/*
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
 */

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
  height: 100%;

  font-size: 20px;
}

#learningCornerChat .mainContainer .studyContainer .catalogueContainer .catalogueScrollbar /deep/ .el-tree-node{
  white-space: normal;
}

#learningCornerChat .mainContainer .studyContainer .catalogueContainer .catalogueScrollbar /deep/ .el-tree-node.is-expanded > .el-tree-node__children {
  display: inline;
}

#learningCornerChat .mainContainer .studyContainer .catalogueContainer .catalogueScrollbar .catalogue /deep/ .el-tree-node__content {
  padding: 10px 0 10px 0;

  height: 100%;
  align-items: start;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer {
  display: inline-block;

  vertical-align: top;

  width: calc(50% - 1px);
  height: 100%;

  border-left: 1px solid #F2F2F2;
}
</style>