<template>
  <div id="learningCornerBook">
    <el-menu class="firstMenu" default-active="0">
      <div class="firstMenuTitle">大类</div>
      <div class="search">
        <svg-icon class="searchIcon" icon-class="search"></svg-icon>
        <input class="searchInput">
      </div>
      <el-scrollbar class="firstMenuScrollbar">
        <el-menu-item class="firstMenuItem" v-for="(item,index) in firstMenuItems" :index="String(index)">
          <div class="firstMenuItemName">{{ item.name }}</div>
        </el-menu-item>
      </el-scrollbar>
      <div class="slogan">
        Beego
        <br/>
        必过
      </div>
    </el-menu>

    <el-menu class="secondMenu" default-active="0" v-if="secondMenuShow">
      <div class="secondMenuTitle">收藏夹</div>
      <el-scrollbar class="secondMenuScrollbar">
        <el-menu-item class="secondMenuItem" v-for="(item,index) in secondMenuItems">
          <div class="secondMenuItemName">{{ item.bookName }}</div>
          <svg-icon class="secondMenuItemDelete" icon-class="delete" @click="uncollection(item.id)"></svg-icon>
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

    <el-button class="secondMenuControllerButton secondMenuControllerButtonOpen" v-if="secondMenuShow"
               @click="closeSecondMenu"
               :icon="ArrowLeftBold" circle/>
    <el-button class="secondMenuControllerButton secondMenuControllerButtonClose" v-else @click="openSecondMenu"
               :icon="ArrowRightBold" circle/>

    <div class="mainContainer" :class="{mainContainerShort:secondMenuShow,mainContainerLong:!secondMenuShow}">
      <div class="patterns">
        <div class="pattern2 pattern2unactive" @click="toWorkbench">
          工作台
        </div>
        <div class="pattern1 pattern1active">
          学习角
        </div>
        <svg-icon class="shareIcon" icon-class="share" @click="share"></svg-icon>
      </div>
      <el-scrollbar class="thirdMenu">
        <div class="thirdMenuItem" v-for="(item,index) in thirdMenuItems">
          <svg-icon class="bookIcon" icon-class="book" @click="toLearningCornerChat"></svg-icon>
          <div class="bookName" @click="toLearningCornerChat">{{ item.bookName }}</div>
          <svg-icon class="uncollectionIcon" icon-class="uncollection" v-if="secondMenuIds.indexOf(item.id) === -1"
                    @click="collection(item.id)"></svg-icon>
          <svg-icon class="uncollectionIcon" icon-class="collection" v-if="secondMenuIds.indexOf(item.id) !== -1"
                    @click="uncollection(item.id)"></svg-icon>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import test from '@/assets/pictures/test.jpg'

import {ArrowLeftBold, ArrowRightBold} from '@element-plus/icons-vue'

import {collection, getBookList, getCollectionBookList, uncollection} from "@/apis/book";

import {isEmpty} from "@/utils/common";
import {getUserByToken} from "@/apis/user";

export default {
  name: 'LearningCornerBook',
  data() {
    return {
      test: test,

      token: null,
      user: {},

      ArrowLeftBold: ArrowLeftBold,
      ArrowRightBold: ArrowRightBold,

      firstMenuItems: [
        {name: "理学"}, {name: "管理学"}, {name: "理学"}, {name: "管理学"}, {name: "理学"}, {name: "管理学"},
        {name: "理学"}, {name: "管理学"}, {name: "理学"}, {name: "管理学"}, {name: "理学"}, {name: "管理学"},
        {name: "理学"}, {name: "管理学"}, {name: "理学"}, {name: "管理学"}, {name: "理学"}, {name: "管理学"},
      ],
      secondMenuItems: [],
      secondMenuIds: [],
      thirdMenuItems: [],

      secondMenuShow: true,
    }
  },
  async created() {
    this.token = localStorage.getItem("token");
    if (isEmpty(this.token)) {
      this.$router.push("/home");
      this.$message.error("请先登录")
    }

    await this.getUserByToken()
    await this.getCollectionBookList()
    await this.getBookList()
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
    getBookList() {
      return getBookList().then((res) => {
        if (res.data.code === 200) {
          this.thirdMenuItems = []
          for (let i = 0; i < res.data.data.length; i++) {
            this.thirdMenuItems.push({
              id: res.data.data[i]['book_id'],
              bookName: res.data.data[i]['book_name'],
              bookUrl: res.data.data[i]['book_url'],
            })
          }
        } else {
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
          this.secondMenuItems = []
          this.secondMenuIds = []
          if (!isEmpty(res.data.data)) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.secondMenuItems.push({
                id: res.data.data[i]['book_id'],
                bookName: res.data.data[i]['book_name'],
                bookOutlineUrl: res.data.data[i]['book_outline_url'],
                book_url: res.data.data[i]['book_url']
              })
              this.secondMenuIds.push(res.data.data[i]['book_id'])
            }
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    },
    collection(id) {
      collection(id).then((res) => {
        if (res.data.code === 200) {
          this.getCollectionBookList()
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
          this.getCollectionBookList()
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

    closeSecondMenu() {
      this.secondMenuShow = false
    },
    openSecondMenu() {
      this.secondMenuShow = true
    },

    toWorkbench() {
      this.$router.push('/workbench')
    },
    toLearningCornerChat() {
      this.$router.push('/learningCornerChat')
    },
    toPersonalCenter() {
      this.$router.push('/personalCenter')
    }
  }
}
</script>

<style scoped>
#learningCornerBook {
  width: 100%;
  height: 100%;
}

#learningCornerBook .firstMenu {
  display: inline-block;

  vertical-align: top;

  width: 180px;
  height: 100%;

  border: 0;

  background: #E6E6E6;
}

#learningCornerBook .firstMenu .firstMenuTitle {
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

#learningCornerBook .firstMenu .search {
  margin: 10px 10px 0 10px;

  width: calc(100% - 10px * 2);
  height: 40px;

  border-radius: 10px;

  background: #CBCBCB;
}

#learningCornerBook .firstMenu .search .searchIcon {
  display: inline-block;

  vertical-align: top;

  margin: 5px 0 5px 5px;

  width: 30px;
  height: 30px;
}

#learningCornerBook .firstMenu .search .searchInput {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 5px;
  padding: 0 0 0 0;

  width: calc(100% - 30px - 5px - 5px - 5px);
  height: 100%;

  border: 0;
  outline: none;

  font-size: 15px;

  background: #CBCBCB;
}

#learningCornerBook .firstMenu .firstMenuScrollbar {
  width: 100%;
  height: calc(100% - 120px - 10px - 40px - 10px - 40px - 8px);
}

#learningCornerBook .firstMenu .firstMenuScrollbar .firstMenuItem .firstMenuItemName {
  width: 100%;
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: center;

  line-height: 40px;

  background: #CBCBCB;

  font-size: 20px;
}

#learningCornerBook .firstMenu .slogan {
  padding: 20px 0 0 0;

  height: calc(120px - 20px);

  text-align: center;

  font-size: 30px;
  font-weight: bold;
}

#learningCornerBook .secondMenu {
  display: inline-block;

  vertical-align: top;

  width: 180px;
  height: 100%;

  border: 0;

  background: #CBCBCB;
}

#learningCornerBook .secondMenu .secondMenuTitle {
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

#learningCornerBook .secondMenu .secondMenuScrollbar {
  width: 100%;
  height: calc(100% - 120px - 10px - 40px - 8px);
}

#learningCornerBook .secondMenu .secondMenuScrollbar .secondMenuItem .secondMenuItemName {
  padding: 0 10px 0 10px;

  width: calc(100% - 10px * 2 - 25px);
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: left;

  line-height: 40px;

  background: #E7E6E6;

  font-size: 15px;

  overflow: hidden;

  text-overflow: ellipsis;
}

#learningCornerBook .secondMenu .secondMenuScrollbar .secondMenuItem .secondMenuItemDelete {
  margin: 0 0 0 5px;

  width: 20px;
  height: 20px;
}

#learningCornerBook .secondMenu .slogan {
  height: 120px;

  text-align: center;

  font-size: 30px;
  font-weight: bold;
}

#learningCornerBook .secondMenu .user {
  margin: 30px 0 30px 30px;

  width: 100%;
  height: 60px;

  text-align: left;
}

#learningCornerBook .secondMenu .user .userAvatar {
  display: inline-block;

  vertical-align: top;

  width: 60px;
  height: 60px;

  border-radius: 50%;
}

#learningCornerBook .secondMenu .user .userInformation {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 20px;

  height: 60px;
}

#learningCornerBook .secondMenu .user .userInformation .userId {
  width: 100%;
  height: 30px;

  line-height: 30px;
}

#learningCornerBook .secondMenu .user .userInformation .userName {
  width: 100%;
  height: 30px;

  line-height: 30px;
}

#learningCornerBook .secondMenuControllerButton {
  position: absolute;

  width: 30px;
  height: 30px;

  z-index: 1;
}

#learningCornerBook .secondMenuControllerButtonClose {
  top: calc(50% - 30px / 2);
  left: calc(180px - 30px / 2);
}

#learningCornerBook .secondMenuControllerButtonOpen {
  top: calc(50% - 30px / 2);
  left: calc(180px + 180px - 30px / 2);
}

#learningCornerBook .mainContainer {
  display: inline-flex;
  flex-flow: column;

  position: relative;

  vertical-align: top;

  height: 100%;
}

#learningCornerBook .mainContainerShort {
  width: calc(100% - 180px - 180px);
}

#learningCornerBook .mainContainerLong {
  width: calc(100% - 180px);
}

#learningCornerBook .mainContainer .patterns {
  position: relative;

  width: 100%;
  height: 60px;
}

#learningCornerBook .mainContainer .patterns .pattern1 {
  position: absolute;

  top: -1px;
  left: 0;

  height: 60px;

  font-size: 24px;

  line-height: 60px;

  cursor: pointer;
}

#learningCornerBook .mainContainer .patterns .pattern1:before {
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

#learningCornerBook .mainContainer .patterns .pattern1active {
  padding: 0 0 0 30%;

  width: calc(70% - 30%);
}

#learningCornerBook .mainContainer .patterns .pattern1active:before {
  z-index: -1;
}

#learningCornerBook .mainContainer .patterns .pattern2 {
  position: absolute;

  top: 1px;
  right: 0;

  height: 60px;

  font-size: 24px;

  line-height: 60px;

  cursor: pointer;
}

#learningCornerBook .mainContainer .patterns .pattern2:before {
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

#learningCornerBook .mainContainer .patterns .pattern2unactive {
  padding: 0 0 0 52%;

  width: calc(70% - 52%);
}

#learningCornerBook .mainContainer .patterns .pattern2unactive:before {
  z-index: -2;
}

#learningCornerBook .mainContainer .patterns .shareIcon {
  position: absolute;

  top: 5px;
  right: 5px;

  width: 50px;
  height: 50px;

  cursor: pointer;
}

#learningCornerBook .thirdMenu {
  width: 100%;
  height: calc(100% - 60px);
}

#learningCornerBook .thirdMenu .thirdMenuItem {
  display: inline-block;

  margin: 10px 10px 10px 10px;
  padding: 10px 10px 10px 10px;

  width: 240px;
  height: 50px;

  cursor: pointer;
}

#learningCornerBook .thirdMenu .thirdMenuItem .bookIcon {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;
}

#learningCornerBook .thirdMenu .thirdMenuItem .bookName {
  display: inline-block;

  vertical-align: top;

  margin: 10px 0 10px 0;
  padding: 0 10px 0 10px;

  width: calc(100% - 50px - 10px * 2 - 30px);
  height: calc(100% - 10px * 2);

  border-radius: 10px;

  background: #F3F4F3;

  line-height: 30px;

  font-size: 14px;
  font-weight: bold;
}

#learningCornerBook .thirdMenu .thirdMenuItem .uncollectionIcon {
  margin: 13px 0 13px 0;

  width: 24px;
  height: 24px;
}
</style>