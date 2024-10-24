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
        <el-image class="userAvatar" round
                  :src="isEmpty(user.avatarUrl) ? ((user.gender === 0 || isEmpty(user.gender))? BoyAvatar : GirlAvatar) : user.avatarUrl"></el-image>
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
                <v-md-preview class="markdown" :text="node.data.outline.outline_content"></v-md-preview>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="resize"></div>
        <div class="chatContainer">
          <el-scrollbar class="chatArea" ref="chatArea" label="chatArea" id="chatArea">
            <div class="chatAreaInner" ref="chatAreaInner">
              <div class="chatRow" v-for="(item,index) in messages">
                <div class="chatRobot" v-if="item.role === 'assistant'">
                  <el-image class="chatRobotAvatar" :src="robots[robotActive].avatar"></el-image>
                  <!--              <div class="chatRobotMessage" v-html="markdownToHtml(item.content)"></div>-->
                  <div class="chatRobotMessage">
                    <v-md-preview class="chatRobotMessageText chatMessageText" :text="item.content"></v-md-preview>
                  </div>
                </div>

                <div class="chatUser" v-if="item.role === 'user'">
                  <div class="chatUserMessage">
                    <el-tooltip :content="item.fileName + '.' +item.fileType" placement="top" effect="light"
                                v-if="!isEmpty(item.fileType)">
                      <el-image class="chatUserFilePicture" :src="item.fileUrl" fit="fill"
                                v-if="['jpg','png'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></el-image>
                      <svg-icon class="chatUserFileSvg" icon-class="csv"
                                v-else-if="['csv'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                      <svg-icon class="chatUserFileSvg" icon-class="excel"
                                v-else-if="['xlsx','xls'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                      <svg-icon class="chatUserFileSvg" icon-class="mp4"
                                v-else-if="['mp4'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                      <svg-icon class="chatUserFileSvg" icon-class="pdf"
                                v-else-if="['pdf'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                      <svg-icon class="chatUserFileSvg" icon-class="ppt"
                                v-else-if="['ppt'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                      <svg-icon class="chatUserFileSvg" icon-class="rar"
                                v-else-if="['rar'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                      <svg-icon class="chatUserFileSvg" icon-class="txt"
                                v-else-if="['txt'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                      <svg-icon class="chatUserFileSvg" icon-class="word"
                                v-else-if="['word'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                      <svg-icon class="chatUserFileSvg" icon-class="word"
                                v-else-if="['docx','doc'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                      <svg-icon class="chatUserFileSvg" icon-class="zip"
                                v-else-if="['zip'].indexOf(item.fileType) !== -1"
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                      <svg-icon class="chatUserFileSvg" icon-class="unknownFile" v-else
                                @click="downloadFile(item.fileUrl,item.fileName + '.' +item.fileType)"></svg-icon>
                    </el-tooltip>
                    <!--              <div class="chatUserMessage" v-html="markdownToHtml(item.content)"></div>-->
                    <v-md-preview class="chatUserMessageText chatMessageText" :text="item.content"
                                  v-if="!isEmpty(item.content)"></v-md-preview>
                  </div>
                  <el-image class="chatUserAvatar"
                            :src="isEmpty(user.avatarUrl) ? ((user.gender === 0 || isEmpty(user.gender))? BoyAvatar : GirlAvatar) : user.avatarUrl"></el-image>
                </div>
              </div>
              <div class="chatRowLoading">
                <div class="chatRobot" v-if="answeringFlag">
                  <el-image class="chatRobotAvatar" :src="robots[robotActive].avatar"></el-image>
                  <!--              <div class="chatRobotMessage chatMessage" v-html="markdownToHtml(answeringMessage)"></div>-->
                  <div class="chatRobotMessage">
                    <v-md-preview class="chatRobotMessageText chatMessageText"
                                  :text="answeringIndex === 0 ? '正在分析中...' :  answeringMessage.substring(0,answeringIndex)"></v-md-preview>
                  </div>
                </div>
              </div>
            </div>
            <el-button class="scrollToBottomButton" :icon="ArrowDownBold" circle @click="scrollToBottom"></el-button>
          </el-scrollbar>

          <div class="inputArea">
            <el-upload
                class="upload-demo"
                action="/api/file/uploadPicture"
                :show-file-list="false"
                :on-remove="removeFile"
                :on-success="fileUpload"
                :file-list="fileList"
            >
              <el-button class="fileUploadButton" :icon="Folder" circle></el-button>
            </el-upload>
            <div class="input">
              <el-tooltip :content="file.fileName + '.' + file.fileType" placement="top" effect="light"
                          v-if="!isEmpty(file)">
                <div class="file">
                  <el-image class="picture" :src="file.fileUrl" fit="fill"
                            v-if="['jpg','png'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></el-image>
                  <svg-icon class="fileSvg" icon-class="csv"
                            v-else-if="['csv'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="fileSvg" icon-class="excel"
                            v-else-if="['xlsx','xls'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="fileSvg" icon-class="mp4"
                            v-else-if="['mp4'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="fileSvg" icon-class="pdf"
                            v-else-if="['pdf'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="fileSvg" icon-class="ppt"
                            v-else-if="['ppt'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="fileSvg" icon-class="rar"
                            v-else-if="['rar'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="fileSvg" icon-class="txt"
                            v-else-if="['txt'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="fileSvg" icon-class="word"
                            v-else-if="['word'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="fileSvg" icon-class="word"
                            v-else-if="['docx','doc'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="fileSvg" icon-class="zip"
                            v-else-if="['zip'].indexOf(file.fileType) !== -1"
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="fileSvg" icon-class="unknownFile" v-else
                            @click="downloadFile(file.fileUrl,file.fileName + '.' +file.fileType)"></svg-icon>
                  <svg-icon class="deleteFile" icon-class="fork" @click="removeFile"></svg-icon>
                </div>
              </el-tooltip>
              <el-input
                  class="chatInput"
                  v-model="chatInput"
                  :rows="2"
                  :autosize="{minRows:2,maxRows:8}"
                  type="textarea"
                  resize="none"
                  placeholder="开始创作你的提示词吧"
              />
            </div>
            <el-button class="sendButton" @click="chat">
              <svg-icon class="sendButtonIcon" icon-class="send"></svg-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <input type="text" id="copyVal" value="假装有分享链接" style="opacity:0; position:absolute;top: 0;left: 0"/>
  </div>
</template>

<script>
import BoyAvatar from '@/assets/pictures/boyAvatar.png';
import GirlAvatar from '@/assets/pictures/girlAvatar.png';
import F2F2F2_Square from '@/assets/pictures/F2F2F2_Square.png'
import C9C9C9_Square from '@/assets/pictures/C9C9C9_Square.png'
import F2F2F2_BottomLeftAngledTriangle from '@/assets/pictures/F2F2F2_BottomLeftAngledTriangle.png'
import C9C9C9_TopRightAngledTriangle from '@/assets/pictures/C9C9C9_TopRightAngledTriangle.png'

import {ArrowDownBold, ArrowLeftBold, ArrowRightBold, Folder} from '@element-plus/icons-vue'

import SvgIcon from "@/components/svgIcon/index.vue";

import {collection, getBookCategoryList, getCatalogueByBookId, getCollectionBookList, uncollection} from "@/apis/book";
import {getUserByToken} from "@/apis/user";

import {isEmpty} from "@/utils/common";

export default {
  name: 'LearningCornerChat',
  components: {SvgIcon},
  data() {
    return {
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
      ArrowDownBold: ArrowDownBold,
      Folder: Folder,

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

    await this.getUserByToken()
    await this.getCollectionBookList()

    if (this.collectionBookIdList.indexOf(this.book.id) !== -1) {
      this.bookActive = this.collectionBookIdList.indexOf(this.book.id)
    } else {
      this.bookMenuItems.push(this.book)
      this.bookActive = this.bookMenuItems.length - 1
    }

    await this.getCatalogueByBookId()

    this.initFlag = true
  },
  mounted() {
    this.dragControllerDiv();
  },
  methods: {
    getUserByToken() {
      return getUserByToken().then((res) => {
        if (res.data.code === 200) {
          this.user = {
            id: res.data.data['user_id'],
            email: res.data.data['email'],
            gender: res.data.data['gender'],
            userName: res.data.data['user_name'],
            avatarUrl: res.data.data['avatar_url'],
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
    getBookCategoryList() {
      return getBookCategoryList().then((res) => {
        if (res.data.code === 200) {
          if (!isEmpty(res.data.data)) {
            for (let i in res.data.data) {
              this.firstMenuItems.push({
                id: res.data.data[i]['lib_id'],
                name: res.data.data[i]['lib_name']
              })
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

    getCollectionBookList() {
      return getCollectionBookList().then((res) => {
        if (res.data.code === 200) {
          this.collectionBookIdList = []
          if (!isEmpty(res.data.data)) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (!this.initFlag) {
                this.bookMenuItems.push({
                  id: res.data.data[i]['book_id'],
                  bookName: res.data.data[i]['book_name'],
                  bookOutlineUrl: res.data.data[i]['book_outline_url'],
                  book_url: res.data.data[i]['book_url']
                })
              }
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
      var copyVal = document.getElementById("copyVal");
      copyVal.select();
      document.execCommand('copy')
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
    },

    dragControllerDiv() {
      var resize = document.getElementsByClassName("resize")[0];
      var left = document.getElementsByClassName("catalogueContainer");
      var mid = document.getElementsByClassName("chatContainer");
      var box = document.getElementsByClassName("studyContainer")[0];

      // 鼠标按下事件
      resize.onmousedown = function (e) {
        //颜色改变提醒
        resize.style.background = "#818181";
        var startX = e.clientX;
        resize.left = resize.offsetLeft;
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          var endX = e.clientX;
          var moveLen = resize.left + (endX - startX); // （endx-startx）=移动的距离。resize.left+移动的距离=左边区域最后的宽度
          var maxT = box.clientWidth - resize.offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度

          if (moveLen < 20) moveLen = 20; // 左边区域的最小宽度为32px
          if (moveLen > maxT - 20) moveLen = maxT - 20; //右边区域最小宽度为150px

          resize.style.left = moveLen; // 设置左侧区域的宽度

          for (let j = 0; j < left.length; j++) {
            left[j].style.width = moveLen - 1 + "px";
            mid[j].style.width = box.clientWidth - moveLen - 10 - 1 + "px";
          }
        };
        // 鼠标松开事件
        document.onmouseup = function () {
          //颜色恢复
          resize.style.background = "#d6d6d6";
          document.onmousemove = null;
          document.onmouseup = null;
          resize.releaseCapture && resize.releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
        };
        resize.setCapture && resize.setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
        return false;
      };
    },

    isEmpty(field) {
      return isEmpty(field)
    },
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
  margin: 30px 20px 30px 20px;

  width: calc(100% - 20px * 2);
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

  margin: 0 0 0 10px;

  width: calc(100% - 70px);
  height: 60px;
}

#learningCornerChat .bookMenu .user .userInformation .userId {
  width: 100%;
  height: 30px;

  line-height: 30px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

#learningCornerChat .bookMenu .user .userInformation .userName {
  width: 100%;
  height: 30px;

  line-height: 30px;


  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
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

  width: calc(50% - 6px);
  height: 100%;

  border-right: 1px solid #F2F2F2;
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

#learningCornerChat .mainContainer .studyContainer .catalogueContainer .catalogueScrollbar /deep/ .el-tree-node {
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

#learningCornerChat .mainContainer .studyContainer .resize {
  display: inline-block;

  vertical-align: top;

  position: relative;

  top: calc(50% - 50px / 2);

  width: 10px;
  height: 50px;

  background-color: #d6d6d6;
  background-size: cover;
  background-position: center;

  border-radius: 5px;

  font-size: 32px;

  color: white;

  cursor: col-resize;
}

#learningCornerChat .mainContainer .studyContainer .resize:hover {
  color: #444444;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer {
  display: inline-flex;
  flex-flow: column;

  vertical-align: top;

  width: calc(50% - 6px);
  height: 100%;

  border-left: 1px solid #F2F2F2;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea {
  flex: 1;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .scrollToBottomButton {
  position: absolute;

  bottom: 0;
  left: 50%;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow {
  padding: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow .chatRobot {
  text-align: left;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow .chatRobot .chatRobotAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow .chatRobot .chatRobotMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 10px;

  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  background: #F2F2F2;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow .chatRobot .chatRobotMessage .chatRobotMessageText {

}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow .chatUser {
  text-align: right;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 10px 0 0;

  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  text-align: left;

  background: #F2F2F2;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserMessage .chatUserFilePicture {
  margin: 10px 10px 10px 10px;

  width: 50px;
  max-width: 100px;
  max-height: 100px;

  cursor: pointer;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserMessage .chatUserFileSvg {
  margin: 10px 10px 10px 10px;

  width: 50px;

  height: 50px;

  outline: none;

  cursor: pointer;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserMessage .chatUserMessageText {

}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRow .chatUser .chatUserAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRowLoading {
  padding: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRowLoading .chatRobot {
  text-align: left;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRowLoading .chatRobot .chatRobotAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .chatArea .chatAreaInner .chatRowLoading .chatRobot .chatRobotMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 10px;

  min-width: 30px;
  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  background: #F2F2F2;
}

#learningCornerChat /deep/ .chatMessageText .github-markdown-body {
  padding: 16px 32px 16px 32px;
}


#learningCornerChat /deep/ .chatMessageText .github-markdown-body p {
  margin-bottom: 0 !important;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea {
  position: relative;

  padding: 10px 0 10px 0;

  width: 100%;
  height: auto;
  max-height: 200px;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .upload-demo {
  position: absolute;

  left: 0;
  bottom: 0;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .upload-demo /deep/ .el-upload-list {
  position: absolute;

  bottom: 70px;
  left: 10px;

  width: 90px;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .fileUploadButton {
  position: absolute;

  bottom: 20px;
  left: 40px;

  width: 40px;
  height: 40px;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .input {
  margin: 0 0 0 100px;

  width: calc(100% - 100px - 120px);
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .input .file {
  display: inline-block;

  position: relative;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .input .file .picture {
  max-width: 100px;
  max-height: 100px;

  cursor: pointer;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .input .file .fileSvg {
  width: 50px;

  height: 50px;

  outline: none;

  cursor: pointer;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .input .file .deleteFile {
  position: absolute;

  top: -6px;
  right: -6px;

  width: 12px;
  height: 12px;

  border-radius: 50%;

  background: #C9C9C9;

  cursor: pointer;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .input .chatInput {
  width: 100%;

  font-size: 16px;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .sendButton {
  position: absolute;

  right: 40px;
  bottom: 20px;

  padding: 0 0 0 0;

  width: 60px;
  height: 40px;

  text-align: center;
}

#learningCornerChat .mainContainer .studyContainer .chatContainer .inputArea .sendButton .sendButtonIcon {
  width: 24px;
  height: 24px;
}

#learningCornerChat /deep/ .markdown .github-markdown-body {
  padding: 0 0 0 0;
}

#learningCornerChat /deep/ .markdown .github-markdown-body p {
  margin-bottom: 0 !important;
}
</style>