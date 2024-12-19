<template>
  <div id="learningCornerBook">
    <el-menu class="collectionBookMenu" v-if="collectionBookMenuVis">
      <div class="collectionBookMenuTitle">收藏夹</div>
      <el-scrollbar class="collectionBookMenuScrollbar">
        <el-menu-item
            class="collectionBookMenuItem"
            v-for="(item, index) in collectionBookList"
        >
          <div class="collectionBookMenuItemName" @click="toLearningCornerChat(item)">
            {{ item.bookName }}
          </div>
          <svg-icon class="collectionBookMenuItemDelete" icon-class="delete" @click="uncollection(item.id)"></svg-icon>
        </el-menu-item>
      </el-scrollbar>
      <!--      <div class="logoContainer">-->
      <!--        <div class="school">{{ user.school + '版' }}</div>-->
      <!--        <el-image class="logo" :src="assets.logo"></el-image>-->
      <!--      </div>-->
    </el-menu>

    <el-button
        class="collectionBookMenuControllerButton collectionBookMenuControllerButtonOpen"
        v-if="collectionBookMenuVis"
        @click="closeCollectionBookMenu"
        :icon="assets.ArrowLeftBold"
        circle
    />
    <el-button
        class="collectionBookMenuControllerButton collectionBookMenuControllerButtonClose"
        v-else
        @click="openCollectionBookMenu"
        :icon="assets.ArrowRightBold"
        circle
    />

    <el-menu class="categoryMenu" :default-active="String(categoryActive)">
      <div class="categoryMenuTitle">大类</div>
      <el-scrollbar class="categoryMenuScrollbar">
        <el-menu-item class="categoryMenuItem" v-for="(item, index) in categoryList" :index="String(index)"
                      @click="selectCategoryMenu(index)">
          <div class="categoryMenuItemName">{{ item.name }}</div>
        </el-menu-item>
      </el-scrollbar>
      <!--      <UserContainer :userId="user.id" :userAvatar="user.avatar" :userName="user.name"></UserContainer>-->
    </el-menu>

    <div class="mainContainer">
      <el-scrollbar class="bookMenu">
        <div class="bookMenuItem" v-for="(item, index) in bookList">
          <svg-icon class="bookIcon" icon-class="book"></svg-icon>
          <div class="bookName" @click="toLearningCornerChat(item)">
            {{ item.bookName }}
          </div>
          <svg-icon class="collectionIcon" icon-class="uncollection" v-if="!isCollection(item.id)"
                    @click="collection(item.id)"></svg-icon>
          <svg-icon class="collectionIcon" icon-class="collection" v-if="isCollection(item.id)"
                    @click="uncollection(item.id)"></svg-icon>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/pictures/logo.png'

import {getQueryString, isEmpty} from "@/utils/common";

import {getUserByToken} from "@/apis/user";
import {collection, getBookCategoryList, getBookList, getCollectionBookList, uncollection} from "@/apis/book";
import UserContainer from "@/components/userContainer/index.vue";
import ModeBar from "@/components/modeBar/index.vue";
import {ArrowLeftBold, ArrowRightBold} from "@element-plus/icons-vue";

export default {
  name: 'LearningCornerBook',
  components: {ModeBar, UserContainer},
  data() {
    return {
      assets: {
        logo: logo,

        ArrowLeftBold: ArrowLeftBold,
        ArrowRightBold: ArrowRightBold,
      },

      token: null,
      user: {},

      collectionBookList: [],
      collectionBookMenuVis: true,

      categoryList: [],
      categoryActive: 0,

      bookList: [],
    }
  },
  async created() {
    this.token = getQueryString("token")

    await this.getUserByToken()

    this.getCollectionBookList()

    await this.getCategoryList()
    await this.getBookList(this.categoryList[this.categoryActive].id)
  },
  methods: {
    getUserByToken() {
      return getUserByToken()
          .then((res) => {
            if (res.data.code === 200) {
              this.user = {
                id: res.data.data["user_id"],
                name: res.data.data["user_name"],
                avatar: res.data.data["avatar_url"],
                school: res.data.data["school"],
              };
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },

    getCollectionBookList() {
      getCollectionBookList()
          .then((res) => {
            if (res.data.code === 200) {
              this.collectionBookList = []
              if (!isEmpty(res.data.data)) {
                for (let i = 0; i < res.data.data.length; i++) {
                  this.collectionBookList.push({
                    id: res.data.data[i]["book_id"],
                    bookName: res.data.data[i]["book_name"],
                    categoryId: res.data.data[i]["lib_id"],
                  });
                }
              }
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },

    getCategoryList() {
      return getBookCategoryList()
          .then((res) => {
            if (res.data.code === 200) {
              this.categoryList = [];
              this.categoryActive = 0
              if (!isEmpty(res.data.data)) {
                for (let i = 0; i < res.data.data.length; i++) {
                  this.categoryList.push({
                    id: res.data.data[i]["lib_id"],
                    name: res.data.data[i]["lib_name"],
                    sort: res.data.data[i]["sort"],
                  });
                }
                this.categoryList.sort((o1, o2) => {
                  return o1.sort - o2.sort;
                });
              }
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },
    selectCategoryMenu(index) {
      this.categoryActive = index
      this.getBookList(this.categoryList[this.categoryActive].id)
    },

    getBookList(categoryId) {
      return getBookList(categoryId)
          .then((res) => {
            if (res.data.code === 200) {
              this.bookList = [];
              if (!isEmpty(res.data.data)) {
                for (let i = 0; i < res.data.data.length; i++) {
                  this.bookList.push({
                    id: res.data.data[i]["book_id"],
                    bookName: res.data.data[i]["book_name"],
                    categoryId: res.data.data[i]["lib_id"],
                  });
                }
              }
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },

    collection(id) {
      collection(id)
          .then((res) => {
            if (res.data.code === 200) {
              this.getCollectionBookList();
              this.$message.success(res.data.message);
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },
    uncollection(id) {
      uncollection(id)
          .then((res) => {
            if (res.data.code === 200) {
              this.getCollectionBookList();
              this.$message.success(res.data.message);
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },

    closeCollectionBookMenu() {
      this.collectionBookMenuVis = false;
    },
    openCollectionBookMenu() {
      this.collectionBookMenuVis = true;
    },

    toLearningCornerChat(book) {
      this.$store.commit('setBook', book);
      this.$router.push('/wechat/learningCornerChat?token=' + this.token)
    },

    isCollection(bookId) {
      for (let i = 0; i < this.collectionBookList.length; i++) {
        if (this.collectionBookList[i].id === bookId) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style scoped>
#learningCornerBook {
  display: inline-flex;

  flex-flow: row;

  width: 100%;
  height: 100%;
}

#learningCornerBook .collectionBookMenu {
  display: inline-flex;

  flex-flow: column;

  vertical-align: top;

  width: 30%;
  height: 100%;

  border: 0;

  background: #cbcbcb;
}

#learningCornerBook .collectionBookMenu .collectionBookMenuTitle {
  margin: 10px 10px 0 10px;

  padding-left: 0;
  padding-right: 0;

  width: calc(100% - 10px * 2 - 4px * 2);
  height: 20px;

  border: 4px dotted #000000;
  border-radius: 10px;

  background: #cbcbcb;

  text-align: center;

  font-size: 10px;

  line-height: 20px;
}

#learningCornerBook .collectionBookMenu .collectionBookMenuScrollbar {
  flex: 1;

  width: 100%;
  height: calc(100% - 100px - 10px - 40px - 20px * 2 - 4px * 2);
}

#learningCornerBook .collectionBookMenu .collectionBookMenuScrollbar .collectionBookMenuItem .collectionBookMenuItemName {
  width: calc(100% - 25px);
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: center;

  line-height: 40px;

  background: #e7e6e6;

  font-size: 10px;

  overflow: hidden;

  text-overflow: ellipsis;
}

#learningCornerBook .collectionBookMenu .collectionBookMenuScrollbar .collectionBookMenuItem .collectionBookMenuItemDelete {
  margin: 0 0 0 5px;

  width: 20px;
  height: 20px;
}

#learningCornerBook .collectionBookMenu .logoContainer {
  margin: 10px 0 0 0;

  width: 100%;

  text-align: center;
}

#learningCornerBook .collectionBookMenu .logoContainer .school {
  margin: 0 auto 0 auto;

  width: 90%;

  font-size: 10px;
  font-weight: bold;

  line-height: 20px;
}

#learningCornerBook .collectionBookMenu .logoContainer .logo {
  width: 100px;
  max-width: 80%;
}

#learningCornerBook .collectionBookMenuControllerButton {
  position: absolute;

  width: 40px;
  height: 40px;

  z-index: 1;
}

#learningCornerBook .collectionBookMenuControllerButtonClose {
  top: calc(50% - 40px / 2);
  left: calc(-40px / 2);
}

#learningCornerBook .collectionBookMenuControllerButtonOpen {
  top: calc(50% - 40px / 2);
  left: calc(-40px / 2 + 220px);
}

#learningCornerBook .categoryMenu {
  display: inline-flex;

  flex-flow: column;

  vertical-align: top;

  width: 20%;
  height: 100%;

  border: 0;

  background: #e6e6e6;
}

#learningCornerBook .categoryMenu .categoryMenuTitle {
  margin: 10px 10px 0 10px;

  width: calc(100% - 10px * 2 - 4px * 2);
  height: 20px;

  border: 4px dotted #000000;
  border-radius: 10px;

  background: #cbcbcb;

  text-align: center;

  font-size: 10px;

  line-height: 20px;
}

#learningCornerBook .categoryMenu .categoryMenuScrollbar {
  flex: 1;

  width: 100%;
  height: 0;
}

#learningCornerBook .categoryMenu .categoryMenuScrollbar .categoryMenuItem .categoryMenuItemName {
  width: 100%;
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: center;

  line-height: 40px;

  background: #cbcbcb;

  font-size: 10px;
}

#learningCornerBook .mainContainer {
  display: inline-flex;

  flex-flow: column;

  flex: 1;

  width: 0;
  height: 100%;
}

#learningCornerBook .mainContainer .bookMenu {
  flex: 1;

  width: 100%;
  height: 0;
}


#learningCornerBook .mainContainer .bookMenu {
  width: 100%;
  height: calc(100% - 60px);
}

#learningCornerBook .mainContainer .bookMenu .bookMenuItem {
  display: inline-block;

  margin: 10px 10px 10px 10px;
  padding: 10px 10px 10px 10px;

  width: 240px;
  height: 50px;

  cursor: pointer;
}

#learningCornerBook .mainContainer .bookMenu .bookMenuItem .bookIcon {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;
}

#learningCornerBook .mainContainer .bookMenu .bookMenuItem .bookName {
  display: inline-block;

  vertical-align: top;

  width: calc(100% - 50px - 10px * 2 - 30px);
  height: calc(100% - 10px * 2);

  border-radius: 10px;

  background: #f3f4f3;

  line-height: 30px;

  font-size: 10px;
  font-weight: bold;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#learningCornerBook .mainContainer .bookMenu .bookMenuItem .collectionIcon {
  margin: 13px 0 13px 0;

  width: 24px;
  height: 24px;
}
</style>