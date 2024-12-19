<template>
  <div id="learningCornerChat">
    <el-menu class="bookMenu" :default-active="String(bookActive)" v-if="bookMenuVis">
      <div class="toLearningCornerBookButton" @click="toLearningCornerBook">返回</div>
      <div class="bookMenuTitle">课程</div>
      <el-scrollbar class="bookMenuScrollbar">
        <el-menu-item class="bookMenuItem" v-for="(item, index) in bookList" :index="String(index)"
                      @click="selectBookMenu(index)">
          <div class="bookMenuItemName">{{ item.bookName }}</div>
        </el-menu-item>
      </el-scrollbar>
      <UserContainer :userId="user.id" :userName="user.name" :userAvatar="user.avatar"></UserContainer>
    </el-menu>

    <el-button
        class="bookMenuControllerButton bookMenuControllerButtonOpen"
        v-if="bookMenuVis"
        @click="closeBookMenu"
        :icon="assets.ArrowLeftBold"
        circle
    />
    <el-button
        class="bookMenuControllerButton bookMenuControllerButtonClose"
        v-else
        @click="openBookMenu"
        :icon="assets.ArrowRightBold"
        circle
    />

    <el-menu
        class="resourceMenu"
        :default-active="String(resourceActive)"
    >
      <div class="resourceMenuTitle">资源</div>
      <el-scrollbar class="resourceMenuScrollbar">
        <el-menu-item class="resourceMenuItem" v-for="(item, index) in resourceList" :index="String(index)"
                      @click="selectResourceMenu(index)">
          <div class="resourceMenuItemName">{{ item.name }}</div>
        </el-menu-item>
      </el-scrollbar>
    </el-menu>

    <div class="rightContainer">
      <ModeBar :mode="1"></ModeBar>
      <PdfReader ref="pdfReader" :user="user"></PdfReader>
    </div>

    <div class="robotContainer" :class="robotContainerVis ? 'openRobotContainer' : 'closeRobotContainer'"
         v-if="!isEmpty(bookList[bookActive]) && !isEmpty(categoryIdToRobotId[bookList[bookActive].categoryId])">
      <el-tooltip
          content="AI助手"
          placement="top-start"
          effect="light"
          v-if="!robotContainerVis"
      >
        <svg-icon class="robotIcon" icon-class="robot"
                  @click="openRobotContainer"></svg-icon>
      </el-tooltip>
      <div class="chatContainer" v-show="robotContainerVis">
        <div class="header">
          <svg-icon class="closeIcon" icon-class="fork" @click="closeRobotContainer"></svg-icon>
        </div>
        <div class="mainContainer" v-for="(item,index) in robotIdToRobot"
             v-show="item.id === categoryIdToRobotId[bookList[bookActive].categoryId]">
          <LearningCornerChatRobotType0 class="learningCornerChatRobot"
                                        :userAvatar="user.avatar" :robotId="item.id"
                                        :robotAvatar="item.avatar"
                                        :robotDescription="item.description"
                                        :robotType="item.type"
                                        :robotPrompts="item.prompts"
                                        :robotHandle="item.handle"></LearningCornerChatRobotType0>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getUserByToken} from "@/apis/user";
import {getBookCategoryList, getCollectionBookList, getFileByResourceId, getResourceByBookId} from "@/apis/book";
import {isEmpty, sleep} from "@/utils/common";
import UserContainer from "@/components/userContainer/index.vue";
import {ArrowLeftBold, ArrowRightBold} from "@element-plus/icons-vue";
import ModeBar from "@/components/modeBar/index.vue";
import PdfReader from "@/components/pdfReader/index.vue";
import {addSession, getLearningCornerRobotList, getSessionList} from "@/apis/chat";
import LearningCornerChatRobotType0 from "@/components/learningCornerChatRobotType0/index.vue";

export default {
  name: 'LearningCornerChat',
  components: {LearningCornerChatRobotType0, PdfReader, ModeBar, UserContainer},
  data() {
    return {
      assets: {
        ArrowRightBold, ArrowLeftBold
      },

      user: {},

      categoryIdToRobotId: {},
      robotIdToRobot: {},
      robotIdToSessionId: {},

      bookList: [],
      bookActive: -1,
      bookMenuVis: true,

      resourceList: [],
      resourceActive: 0,

      robotContainerVis: false,
    }
  },
  async created() {
    await this.getUserByToken()

    if (isEmpty(this.$store.state.book)) {
      this.toLearningCornerBook();
      return
    }

    this.getCollectionBookList()
    this.getBookCategoryList()
    this.getRobotList()

    this.robotContainerVis = true
  },
  methods: {
    isEmpty,
    getUserByToken() {
      return getUserByToken().then((res) => {
        if (res.data.code === 200) {
          this.user = {
            id: res.data.data["user_id"],
            name: res.data.data["user_name"],
            school: res.data.data["school"],
            avatar: res.data.data["avatar_url"]
          }
        } else {
          this.$router.push("/home")
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },

    getCollectionBookList() {
      getCollectionBookList()
          .then((res) => {
            if (res.data.code === 200) {
              this.bookList = []
              if (!isEmpty(res.data.data)) {
                for (let i = 0; i < res.data.data.length; i++) {
                  this.bookList.push({
                    id: res.data.data[i]["book_id"],
                    bookName: res.data.data[i]["book_name"],
                    categoryId: res.data.data[i]["lib_id"],
                  });

                  if (this.$store.state.book.id === res.data.data[i]["book_id"]) {
                    this.bookActive = i
                  }
                }
              }
              if (this.bookActive === -1) {
                this.bookList.push(this.$store.state.book)
                this.bookActive = this.bookList.length - 1
              }
              this.getResourceByBookId(this.bookList[this.bookActive].id)
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },

    getResourceByBookId(bookId) {
      getResourceByBookId(bookId).then((res) => {
        if (res.data.code === 200) {
          this.resourceList = []
          this.resourceActive = 0
          if (!isEmpty(res.data.data)) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.resourceList.push({
                id: res.data.data[i]["resource_id"],
                bookId: res.data.data[i]["book_id"],
                fileId: res.data.data[i]["file_id"],
                name: res.data.data[i]["resource_name"]
              })
            }
            this.getFileByResourceId(this.resourceList[this.resourceActive].fileId)
          } else {
            this.$refs.pdfReader.removePdf()
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

    getFileByResourceId(resourceId) {
      getFileByResourceId(resourceId).then((res) => {
        if (res.data.code === 200) {
          this.$refs.pdfReader.loadPdf(res.data.data)
        } else {
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },

    getBookCategoryList() {
      getBookCategoryList()
          .then((res) => {
            if (res.data.code === 200) {
              if (!isEmpty(res.data.data)) {
                this.categoryIdToRobotId = {};
                for (let i = 0; i < res.data.data.length; i++) {
                  this.categoryIdToRobotId[res.data.data[i]["lib_id"]] =
                      res.data.data[i]["bot_id"];
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

    getRobotList() {
      getLearningCornerRobotList()
          .then((res) => {
            if (res.data.code === 200) {
              this.robotIdToRobot = {};
              for (let i = 0; i < res.data.data.length; i++) {
                this.robotIdToRobot[res.data.data[i]["bot_id"]] = {
                  id: res.data.data[i]["bot_id"],
                  name: res.data.data[i]["bot_name"],
                  avatar: res.data.data[i]["bot_avatar"],
                  description: res.data.data[i]["description"],
                  handle: res.data.data[i]["bot_handle"],
                  prompts: res.data.data[i]["prompts"],
                  type: res.data.data[i]["bot_front_flag"],
                  linkRobotId: res.data.data[i]["attach_bot_id"],
                  sort: res.data.data[i]["sort"],
                };
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

    closeBookMenu() {
      this.bookMenuVis = false;
    },
    openBookMenu() {
      this.bookMenuVis = true;
    },
    selectBookMenu(index) {
      this.bookActive = index
      this.getResourceByBookId(this.bookList[this.bookActive].id)
    },

    selectResourceMenu(index) {
      this.resourceActive = parseInt(index)
      this.getFileByResourceId(this.resourceList[this.resourceActive].fileId)
    },

    openRobotContainer() {
      this.robotContainerVis = true
    },
    closeRobotContainer() {
      this.robotContainerVis = false
    },

    toLearningCornerBook() {
      this.$router.push("/learningCornerBook");
    },
  }
}
</script>

<style scoped>
#learningCornerChat {
  display: inline-flex;

  flex-flow: row;

  width: 100%;
  height: 100%;
}

#learningCornerChat .bookMenu {
  display: inline-flex;

  flex-flow: column;

  vertical-align: top;

  width: 200px;
  height: 100%;

  border: 0;

  background: #CBCBCB;
}

#learningCornerChat .bookMenu .toLearningCornerBookButton {
  margin: 10px 10px 0 10px;

  width: calc(100% - 10px * 2 - 4px * 2);
  height: 40px;

  border: 4px solid #E6E6E6;
  border-radius: 10px;

  background: #E6E6E6;

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

  background: #E6E6E6;

  text-align: center;

  font-size: 20px;

  line-height: 40px;
}

#learningCornerChat .bookMenu .bookMenuScrollbar {
  flex: 1;

  width: 100%;
  height: 0;
}

#learningCornerChat .bookMenu .bookMenuScrollbar .bookMenuItem {
  padding: 0 10px 0 10px;
}

#learningCornerChat .bookMenu .bookMenuScrollbar .bookMenuItem .bookMenuItemName {
  width: calc(100%);
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: center;

  line-height: 40px;

  background: #E6E6E6;

  font-size: 16px;
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
  left: calc(200px - 40px / 2);
}

#learningCornerChat .resourceMenu {
  display: inline-block;

  vertical-align: top;

  width: 180px;
  height: 100%;

  border: 0;

  background: #E6E6E6;
}

#learningCornerChat .resourceMenu .resourceMenuTitle {
  margin: 10px 10px 0 10px;

  width: calc(100% - 10px * 2 - 4px * 2);
  height: 40px;

  border: 4px dotted #000000;
  border-radius: 10px;

  background: #E6E6E6;

  text-align: center;

  font-size: 20px;

  line-height: 40px;
}

#learningCornerChat .resourceMenu .resourceMenuScrollbar {
  width: 100%;
  height: calc(100% - 10px - 40px);
}

#learningCornerChat .resourceMenu .resourceMenuScrollbar .resourceMenuItem {
  padding: 0 10px 0 10px;
}

#learningCornerChat .resourceMenu .resourceMenuScrollbar .resourceMenuItem .resourceMenuItemName {
  padding: 0 5px 0 5px;

  width: calc(100% - 5px * 2);
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: center;

  line-height: 40px;

  background: #CBCBCB;

  font-size: 16px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

#learningCornerChat .rightContainer {
  flex: 1;

  width: 0;
  height: 100%;
}

#learningCornerChat .robotContainer {
  position: absolute;

  right: 30px;
  bottom: 30px;

  transition: all 0.6s;

  z-index: 2;

  background: white;
}

#learningCornerChat .closeRobotContainer {
  width: 60px;
  height: 60px;

  border-radius: 0;

  cursor: pointer;
}

#learningCornerChat .openRobotContainer {
  width: 800px;
  height: calc(100% - 30px * 2);

  border-radius: 30px;

  box-shadow: 0 0 5px 1px #999
}

#learningCornerChat .robotContainer .robotIcon {
  width: 100%;
  height: 100%;
}

#learningCornerChat .robotContainer .chatContainer {
  display: inline-flex;

  flex-flow: column;

  position: absolute;

  top: 0;
  right: 0;

  vertical-align: top;

  width: 100%;
  height: 100%;

  border-left: 1px solid #f2f2f2;
}

#learningCornerChat .robotContainer .chatContainer .header {
  text-align: right;
}

#learningCornerChat .robotContainer .chatContainer .header .closeIcon {
  margin: 10px 10px 0 0;

  width: 20px;
  height: 20px;

  cursor: pointer;
}

#learningCornerChat .robotContainer .chatContainer .mainContainer {
  flex: 1;

  width: 100%;
  height: 0;
}

#learningCornerChat .robotContainer .chatContainer .mainContainer .learningCornerChatRobot {
  width: 100%;
  height: 100%;
}
</style>