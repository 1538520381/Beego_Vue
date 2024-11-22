<template>
  <div id="learningCornerBook">
    <el-menu class="secondMenu" default-active="0" v-if="secondMenuShow">
      <div class="secondMenuTitle">收藏夹</div>
      <el-scrollbar class="secondMenuScrollbar">
        <el-menu-item
          class="secondMenuItem"
          v-for="(item, index) in secondMenuItems"
        >
          <div
            class="secondMenuItemName"
            @click="toLearningCornerChat(2, item)"
          >
            {{ item.bookName }}
          </div>
          <svg-icon
            class="secondMenuItemDelete"
            icon-class="delete"
            @click="uncollection(item.id)"
          ></svg-icon>
        </el-menu-item>
      </el-scrollbar>

      <div class="slogan">
        <!--        Beego-->
        <!--        <br/>-->
        <!--        必过-->
        <div class="schoolName">{{ user.school + "版" }}</div>
        <el-image class="logoImage" :src="logo" fit="contain" @click="toHome" />
      </div>
    </el-menu>

    <el-menu class="firstMenu" default-active="0" @select="selectFirstMenu">
      <div class="firstMenuTitle">大类</div>
      <!--      <div class="search">-->
      <!--        <svg-icon class="searchIcon" icon-class="search"></svg-icon>-->
      <!--        <input class="searchInput">-->
      <!--      </div>-->
      <el-scrollbar class="firstMenuScrollbar">
        <el-menu-item
          class="firstMenuItem"
          v-for="(item, index) in firstMenuItems"
          :index="String(index)"
          :disabled="flags.indexOf(item.name) === -1"
        >
          <div class="firstMenuItemName">{{ item.name }}</div>
        </el-menu-item>
      </el-scrollbar>
      <div class="user" @click="toPersonalCenter">
        <el-image
          class="userAvatar"
          round
          :src="
            isEmpty(user.avatarUrl)
              ? user.gender === 0 || isEmpty(user.gender)
                ? BoyAvatar
                : GirlAvatar
              : user.avatarUrl
          "
        ></el-image>
        <div class="userInformation">
          <div class="userId">{{ user.id }}</div>
          <div class="userName">{{ user.userName }}</div>
        </div>
      </div>
    </el-menu>

    <el-button
      class="secondMenuControllerButton secondMenuControllerButtonOpen"
      v-if="secondMenuShow"
      @click="closeSecondMenu"
      :icon="ArrowLeftBold"
      circle
    />
    <el-button
      class="secondMenuControllerButton secondMenuControllerButtonClose"
      v-else
      @click="openSecondMenu"
      :icon="ArrowRightBold"
      circle
    />

    <div
      class="mainContainer"
      :class="{
        mainContainerShort: secondMenuShow,
        mainContainerLong: !secondMenuShow,
      }"
    >
      <div class="patterns">
        <el-image
          class="patternLeftRectangle patternRectangleActive"
          :src="F2F2F2_Square"
        ></el-image>
        <el-image
          class="patternAngledTriangle patternBottomLeftAngledTriangleActive"
          :src="F2F2F2_BottomLeftAngledTriangle"
        ></el-image>
        <div class="leftTitleActive">学习角</div>
        <el-image
          class="patternRightRectangle patternRectangleUnactive"
          :src="C9C9C9_Square"
          @click="toWorkbench"
        ></el-image>
        <el-image
          class="patternAngledTriangle patternTopRightAngledTriangleUnactive"
          :src="C9C9C9_TopRightAngledTriangle"
          @click="toWorkbench"
        ></el-image>
        <div class="rightTitleUnactive" @click="toWorkbench">工作台</div>
        <!--        <div class="pattern2 pattern2unactive" @click="toWorkbench">-->
        <!--          工作台-->
        <!--        </div>-->
        <!--        <div class="pattern1 pattern1active">-->
        <!--          学习角-->
        <!--        </div>-->
        <svg-icon
          class="shareIcon"
          icon-class="share"
          @click="share"
        ></svg-icon>
      </div>
      <el-scrollbar class="thirdMenu">
        <div class="thirdMenuItem" v-for="(item, index) in thirdMenuItems">
          <svg-icon
            class="bookIcon"
            icon-class="book"
            @click="toLearningCornerChat(3, item)"
          ></svg-icon>
          <div class="bookName" @click="toLearningCornerChat(3, item)">
            {{ item.bookName }}
          </div>
          <svg-icon
            class="uncollectionIcon"
            icon-class="uncollection"
            v-if="secondMenuIds.indexOf(item.id) === -1"
            @click="collection(item.id)"
          ></svg-icon>
          <svg-icon
            class="uncollectionIcon"
            icon-class="collection"
            v-if="secondMenuIds.indexOf(item.id) !== -1"
            @click="uncollection(item.id)"
          ></svg-icon>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog
      v-model="contactUsDialogVis"
      title="意见反馈"
      width="350"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-input
        v-model="contactUsForm.content"
        type="textarea"
        placeholder="请描述您需要的问题"
      ></el-input>
      <el-upload
        ref="contactUsUpload"
        action="/api/file/uploadPicture?bucketType=3"
        :on-success="contactUsFileUpload"
        :limit="1"
        style="margin: 3px 0 0 0"
      >
        <el-button type="primary">上传附件</el-button>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="closeContactUsDialog"
            >取消</el-button
          >
          <el-button type="primary" @click="contactUs">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <input
      type="text"
      id="copyVal"
      value="http://54.222.173.61:81/home"
      style="opacity: 0; position: absolute; top: 0; left: 0"
    />

    <SuspendedBall
      @handlepaly="openContactUsDialog"
      style="cursor: pointer"
    ></SuspendedBall>
  </div>
</template>

<script>
import logo from "@/assets/pictures/logo.png";
import BoyAvatar from "@/assets/pictures/boyAvatar.png";
import GirlAvatar from "@/assets/pictures/girlAvatar.png";
import F2F2F2_Square from "@/assets/pictures/F2F2F2_Square.png";
import C9C9C9_Square from "@/assets/pictures/C9C9C9_Square.png";
import F2F2F2_BottomLeftAngledTriangle from "@/assets/pictures/F2F2F2_BottomLeftAngledTriangle.png";
import C9C9C9_TopRightAngledTriangle from "@/assets/pictures/C9C9C9_TopRightAngledTriangle.png";

import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";

import {
  collection,
  getBookCategoryList,
  getBookList,
  getCollectionBookList,
  uncollection,
} from "@/apis/book";
import { contactUs, getUserByToken } from "@/apis/user";
import { longTextDialogueQuery } from "@/apis/chat";

import { isEmpty } from "@/utils/common";
import SuspendedBall from "@/components/suspendedBall/index.vue";

export default {
  name: "LearningCornerBook",
  components: { SuspendedBall },
  data() {
    return {
      logo: logo,
      BoyAvatar: BoyAvatar,
      GirlAvatar: GirlAvatar,
      F2F2F2_Square: F2F2F2_Square,
      C9C9C9_Square: C9C9C9_Square,
      F2F2F2_BottomLeftAngledTriangle: F2F2F2_BottomLeftAngledTriangle,
      C9C9C9_TopRightAngledTriangle: C9C9C9_TopRightAngledTriangle,

      token: null,
      user: {},

      ArrowLeftBold: ArrowLeftBold,
      ArrowRightBold: ArrowRightBold,

      contactUsForm: {},

      firstMenuItems: [],
      secondMenuItems: [],
      secondMenuIds: [],
      thirdMenuItems: [],

      firstActive: 0,

      secondMenuShow: true,

      contactUsDialogVis: false,

      longTextDialogueExecuteEntitys: [],

      flags: ["全部", "通识文科", "通识理科"],
    };
  },
  async created() {
    this.token = localStorage.getItem("token");
    if (isEmpty(this.token)) {
      this.$router.push("/home");
      this.$message.error("请先登录");
    }

    await this.getUserByToken();

    // this.longTextDialogueExecuteEntitys =
    //   this.$store.state.longTextDialogueExecuteEntitys;
    // setInterval(() => {
    //   this.longTextDialogueQuery();
    // }, 1000 * 60);

    await this.getBookCategoryList();
    await this.getCollectionBookList();
    await this.getBookList();
  },
  methods: {
    initContactUsForm() {
      this.contactUsForm = {
        content: "",
        fileId: null,
        fileName: null,
        fileUrl: null,
        fileType: null,
      };
    },

    getUserByToken() {
      return getUserByToken()
        .then((res) => {
          if (res.data.code === 200) {
            this.user = {
              id: res.data.data["user_id"],
              email: res.data.data["email"],
              gender: res.data.data["gender"],
              userName: res.data.data["user_name"],
              avatarUrl: res.data.data["avatar_url"],
              school: res.data.data["school"],
            };
          } else {
            this.$router.push("/home");
            this.$message.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("系统异常，请联系管理员");
        });
    },
    getBookCategoryList() {
      return getBookCategoryList()
        .then((res) => {
          if (res.data.code === 200) {
            this.firstMenuItems = [];
            if (!isEmpty(res.data.data)) {
              for (let i in res.data.data) {
                this.firstMenuItems.push({
                  id: res.data.data[i]["lib_id"],
                  name: res.data.data[i]["lib_name"],
                  sort: res.data.data[i]["sort"],
                });
              }
              this.firstMenuItems.sort((o1, o2) => {
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
    getBookList() {
      return getBookList(this.firstMenuItems[this.firstActive].id)
        .then((res) => {
          if (res.data.code === 200) {
            this.thirdMenuItems = [];
            if (!isEmpty(res.data.data)) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.thirdMenuItems.push({
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
    getCollectionBookList() {
      getCollectionBookList()
        .then((res) => {
          if (res.data.code === 200) {
            this.secondMenuItems = [];
            this.secondMenuIds = [];
            if (!isEmpty(res.data.data)) {
              for (let i = 0; i < res.data.data.length; i++) {
                this.secondMenuItems.push({
                  id: res.data.data[i]["book_id"],
                  bookName: res.data.data[i]["book_name"],
                  categoryId: res.data.data[i]["lib_id"],
                });
                this.secondMenuIds.push(res.data.data[i]["book_id"]);
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
    contactUs() {
      contactUs(
        this.contactUsForm.content,
        this.contactUsForm.fileId,
        this.contactUsForm.fileName,
        this.contactUsForm.fileUrl,
        this.contactUsForm.fileType
      )
        .then((res) => {
          if (res.data.code === 200) {
            this.contactUsDialogVis = false;
            this.$message.success("反馈成功");
          } else {
            this.answeringFlag = false;
            this.$message.error(res.data.message);
          }
        })
        .catch((err) => {
          this.answeringFlag = false;
          console.log(err);
          this.$message.error("系统异常，请联系管理员");
        });
    },
    longTextDialogueQuery() {
      for (let i = 0; i < this.longTextDialogueExecuteEntitys.length; i++) {
        longTextDialogueQuery(
          this.longTextDialogueExecuteEntitys[i].robotId,
          this.longTextDialogueExecuteEntitys[i].sessionId,
          this.longTextDialogueExecuteEntitys[i].executeId
        )
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("长文本生成完成");
              this.longTextDialogueExecuteEntitys.splice(i, 1);
              i--;
            } else if (this.longTextDialogueExecuteEntitys[i].count >= 7) {
              // this.longTextDialogueExecuteEntitys.splice(i, 1);
              // i--;
            } else {
              this.longTextDialogueExecuteEntitys[i].count += 1;
            }
            this.$store.commit(
              "setLongTextDialogueExecuteEntitys",
              this.longTextDialogueExecuteEntitys
            );
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
      }
    },

    share() {
      var copyVal = document.getElementById("copyVal");
      copyVal.select();
      document.execCommand("copy");
      this.$message.success("分享链接已复制到剪切板");
    },

    contactUsFileUpload(res, file, fileList) {
      if (res.code === 200) {
        this.contactUsForm.fileId = res.data["file_id"];
        this.contactUsForm.fileName = res.data["file_name"];
        this.contactUsForm.fileType = res.data["file_type"];
        this.contactUsForm.fileUrl = res.data["file_url"];
      } else {
        this.$message.error(res.message);
      }
    },

    closeContactUsDialog() {
      this.$refs.contactUsUpload.clearFiles();
      this.contactUsDialogVis = false;
    },
    openContactUsDialog() {
      this.initContactUsForm();
      this.contactUsDialogVis = true;
      this.$nextTick(() => {
        this.$refs.contactUsUpload.clearFiles();
      });
    },

    closeSecondMenu() {
      this.secondMenuShow = false;
    },
    openSecondMenu() {
      this.secondMenuShow = true;
    },

    selectFirstMenu(index) {
      this.firstActive = parseInt(index);
      this.getBookList();
    },

    toHome() {
      this.$router.push("/home");
    },
    toWorkbench() {
      this.$router.push("/workbench");
    },
    toLearningCornerChat(index, book) {
      console.log(book);
      this.$store.commit("setBook", book);
      this.$store.commit(
        "setBookList",
        index === 2 ? this.secondMenuItems : this.thirdMenuItems
      );
      this.$router.push("/learningCornerChat");
    },
    toPersonalCenter() {
      this.$router.push("/personalCenter");
    },

    isEmpty(field) {
      return isEmpty(field);
    },
  },
};
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

  background: #e6e6e6;
}

#learningCornerBook .firstMenu .firstMenuTitle {
  margin: 10px 10px 0 10px;

  width: calc(100% - 10px * 2 - 4px * 2);
  height: 40px;

  border: 4px dotted #000000;
  border-radius: 10px;

  background: #cbcbcb;

  text-align: center;

  font-size: 20px;

  line-height: 40px;
}

#learningCornerBook .firstMenu .search {
  margin: 10px 10px 0 10px;

  width: calc(100% - 10px * 2);
  height: 40px;

  border-radius: 10px;

  background: #cbcbcb;
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

  background: #cbcbcb;
}

#learningCornerBook .firstMenu .firstMenuScrollbar {
  width: 100%;
  height: calc(100% - 100px - 10px - 40px - 8px);
}

#learningCornerBook
  .firstMenu
  .firstMenuScrollbar
  .firstMenuItem
  .firstMenuItemName {
  width: 100%;
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: center;

  line-height: 40px;

  background: #cbcbcb;

  font-size: 20px;
}

#learningCornerBook .firstMenu .user {
  margin: 20px 20px 20px 20px;

  width: calc(100% - 20px * 2);
  height: 60px;
}

#learningCornerBook .firstMenu .user .userAvatar {
  display: inline-block;

  vertical-align: top;

  width: 60px;
  height: 60px;

  border-radius: 50%;

  cursor: pointer;
}

#learningCornerBook .firstMenu .user .userInformation {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 10px;

  width: calc(100% - 70px);
  height: 60px;
}

#learningCornerBook .firstMenu .user .userInformation .userId {
  width: 100%;
  height: 30px;

  line-height: 30px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

#learningCornerBook .firstMenu .user .userInformation .userName {
  width: 100%;
  height: 30px;

  line-height: 30px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

#learningCornerBook .secondMenu {
  display: inline-block;

  vertical-align: top;

  width: 220px;
  height: 100%;

  border: 0;

  background: #cbcbcb;
}

#learningCornerBook .secondMenu .secondMenuTitle {
  margin: 10px 10px 0 10px;

  width: calc(100% - 10px * 2 - 4px * 2);
  height: 40px;

  border: 4px dotted #000000;
  border-radius: 10px;

  background: #cbcbcb;

  text-align: center;

  font-size: 20px;

  line-height: 40px;
}

#learningCornerBook .secondMenu .secondMenuScrollbar {
  width: 100%;
  height: calc(100% - 100px - 10px - 40px - 20px * 2 - 4px * 2);
}

#learningCornerBook
  .secondMenu
  .secondMenuScrollbar
  .secondMenuItem
  .secondMenuItemName {
  padding: 0 10px 0 10px;

  width: calc(100% - 10px * 2 - 25px);
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: left;

  line-height: 40px;

  background: #e7e6e6;

  font-size: 15px;

  overflow: hidden;

  text-overflow: ellipsis;
}

#learningCornerBook
  .secondMenu
  .secondMenuScrollbar
  .secondMenuItem
  .secondMenuItemDelete {
  margin: 0 0 0 5px;

  width: 20px;
  height: 20px;
}

#learningCornerBook .secondMenu .slogan {
  margin: 20px 0 20px 0;

  height: 100px;

  text-align: center;

  font-size: 30px;
  font-weight: bold;
}

#learningCornerBook .secondMenu .slogan .schoolName {
  height: 40px;

  font-size: 14px;
  font-weight: bold;

  line-height: 20px;
}

#learningCornerBook .secondMenu .slogan .logoImage {
  height: 60px;

  cursor: pointer;
}

#learningCornerBook .secondMenuControllerButton {
  position: absolute;

  width: 40px;
  height: 40px;

  z-index: 1;
}

#learningCornerBook .secondMenuControllerButtonClose {
  top: calc(50% - 40px / 2);
  left: calc(-40px / 2);
}

#learningCornerBook .secondMenuControllerButtonOpen {
  top: calc(50% - 40px / 2);
  left: calc(220px - 40px / 2);
}

#learningCornerBook .mainContainer {
  display: inline-flex;
  flex-flow: column;

  position: relative;

  vertical-align: top;

  height: 100%;
}

#learningCornerBook .mainContainerShort {
  width: calc(100% - 180px - 220px);
}

#learningCornerBook .mainContainerLong {
  width: calc(100% - 180px);
}

#learningCornerBook .mainContainer .patterns {
  position: relative;

  width: 100%;
  height: 60px;
}

#learningCornerBook .mainContainer .patterns .patternLeftRectangle {
  position: absolute;

  top: 0;
  left: 0;
}

#learningCornerBook .mainContainer .patterns .patternRightRectangle {
  position: absolute;

  top: 0;
  right: 0;
}

#learningCornerBook .mainContainer .patterns .patternRectangleUnactive {
  width: calc(25% - 60px / 2);
  height: 100%;

  cursor: pointer;
}

#learningCornerBook .mainContainer .patterns .patternRectangleActive {
  width: calc(75% - 60px / 2);
  height: 100%;
}

#learningCornerBook .mainContainer .patterns .patternAngledTriangle {
  position: absolute;

  top: 0;

  width: 60px;
  height: 60px;
}

#learningCornerBook
  .mainContainer
  .patterns
  .patternBottomLeftAngledTriangleActive {
  left: calc(75% - 60px / 2);
}

#learningCornerBook
  .mainContainer
  .patterns
  .patternTopRightAngledTriangleUnactive {
  right: calc(25% - 60px / 2);

  cursor: pointer;
}

#learningCornerBook .mainContainer .patterns .leftTitleActive {
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

#learningCornerBook .mainContainer .patterns .rightTitleUnactive {
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
*/

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

  background: #f3f4f3;

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