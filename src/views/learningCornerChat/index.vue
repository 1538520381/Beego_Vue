<template>
  <div id="learningCornerChat">
    <el-menu
        class="bookMenu"
        :default-active="String(bookActive)"
        v-if="bookMenuShow"
        @select="selectBookMenu"
    >
      <div class="returnButton" @click="toLearningCornerBook">返回</div>
      <div class="bookMenuTitle">课程</div>
      <el-scrollbar class="bookMenuScrollbar">
        <el-menu-item
            class="bookMenuItem"
            v-for="(item, index) in bookMenuItems"
            :index="String(index)"
            :disabled="answeringFlag"
        >
          <div class="bookMenuItemName">{{ item.bookName }}</div>
          <svg-icon
              class="collectionIcon"
              icon-class="collection"
              v-if="collectionBookIdList.indexOf(item.id) !== -1"
              @click="uncollection(item.id)"
          ></svg-icon>
          <svg-icon
              class="collectionIcon"
              icon-class="uncollection"
              v-else
              @click="collection(item.id)"
          ></svg-icon>
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
        class="bookMenuControllerButton bookMenuControllerButtonOpen"
        v-if="bookMenuShow"
        @click="closeBookMenu"
        :icon="ArrowLeftBold"
        circle
    />
    <el-button
        class="bookMenuControllerButton bookMenuControllerButtonClose"
        v-else
        @click="openBookMenu"
        :icon="ArrowRightBold"
        circle
    />

    <el-menu
        class="resourceMenu"
        :default-active="String(resourceActive)"
        @select="selectResourceMenu"
    >
      <div class="resourceMenuTitle">资源</div>
      <el-scrollbar class="resourceMenuScrollbar">
        <el-menu-item
            class="resourceMenuItem"
            v-for="(item, index) in resourceMenuItems"
            :index="String(index)"
            :disabled="answeringFlag"
        >
          <div class="resourceMenuItemName">{{ item.name }}</div>
        </el-menu-item>
      </el-scrollbar>
    </el-menu>

    <div
        class="mainContainer"
        :class="{
        mainContainerShort: bookMenuShow,
        mainContainerLong: !bookMenuShow,
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
      <div class="studyContainer">
        <div class="catalogueContainer" v-if="initFlag">
          <PdfReader ref="pdfReader" :user="user"></PdfReader>
          <!--          <div class="bookTitle">{{ bookMenuItems[bookActive].bookName }}</div>-->
          <!--          <el-scrollbar class="catalogueScrollbar">-->
          <!--            <el-tree-->
          <!--                class="catalogue"-->
          <!--                :data="catalogue"-->
          <!--                :props="{-->
          <!--                label: 'outline',-->
          <!--                children: 'outline_child_list',-->
          <!--              }"-->
          <!--            >-->
          <!--              <template v-slot="{ node }">-->
          <!--                <v-md-preview-->
          <!--                    class="markdown"-->
          <!--                    :text="node.data.outline.outline_content"-->
          <!--                ></v-md-preview>-->
          <!--              </template>-->
          <!--            </el-tree>-->
          <!--          </el-scrollbar>-->
        </div>
        <div>
          <!--          <div class="resize"></div>-->
          <!--          <div class="chatContainer">-->
          <!--            <el-scrollbar-->
          <!--                class="chatArea"-->
          <!--                ref="chatArea"-->
          <!--                label="chatArea"-->
          <!--                id="chatArea"-->
          <!--            >-->
          <!--              <div class="chatAreaInner" ref="chatAreaInner">-->
          <!--                <div class="chatRow" v-for="(item, index) in messages">-->
          <!--                  <div class="chatRobot" v-if="item.role === 'assistant'">-->
          <!--                    <el-image-->
          <!--                        class="chatRobotAvatar"-->
          <!--                        :src="-->
          <!--                      robotIdToRobot[-->
          <!--                        categoryIdToRobotId[-->
          <!--                          bookMenuItems[bookActive].categoryId-->
          <!--                        ]-->
          <!--                      ].avatar-->
          <!--                    "-->
          <!--                    ></el-image>-->
          <!--                    &lt;!&ndash;              <div class="chatRobotMessage" v-html="markdownToHtml(item.content)"></div>&ndash;&gt;-->
          <!--                    <div class="chatRobotMessage">-->
          <!--                      <v-md-preview-->
          <!--                          class="chatRobotMessageText chatMessageText"-->
          <!--                          :text="item.content"-->
          <!--                      ></v-md-preview>-->
          <!--                    </div>-->
          <!--                  </div>-->

          <!--                  <div class="chatUser" v-if="item.role === 'user'">-->
          <!--                    <div class="chatUserMessage">-->
          <!--                      <el-tooltip-->
          <!--                          :content="item.fileName + '.' + item.fileType"-->
          <!--                          placement="top"-->
          <!--                          effect="light"-->
          <!--                          v-if="!isEmpty(item.fileType)"-->
          <!--                      >-->
          <!--                        <el-image-->
          <!--                            class="chatUserFilePicture"-->
          <!--                            :src="item.fileUrl"-->
          <!--                            fit="fill"-->
          <!--                            v-if="['jpg', 'png'].indexOf(item.fileType) !== -1"-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></el-image>-->
          <!--                        <svg-icon-->
          <!--                            class="chatUserFileSvg"-->
          <!--                            icon-class="csv"-->
          <!--                            v-else-if="['csv'].indexOf(item.fileType) !== -1"-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></svg-icon>-->
          <!--                        <svg-icon-->
          <!--                            class="chatUserFileSvg"-->
          <!--                            icon-class="excel"-->
          <!--                            v-else-if="-->
          <!--                          ['xlsx', 'xls'].indexOf(item.fileType) !== -1-->
          <!--                        "-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></svg-icon>-->
          <!--                        <svg-icon-->
          <!--                            class="chatUserFileSvg"-->
          <!--                            icon-class="mp4"-->
          <!--                            v-else-if="['mp4'].indexOf(item.fileType) !== -1"-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></svg-icon>-->
          <!--                        <svg-icon-->
          <!--                            class="chatUserFileSvg"-->
          <!--                            icon-class="pdf"-->
          <!--                            v-else-if="['pdf'].indexOf(item.fileType) !== -1"-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></svg-icon>-->
          <!--                        <svg-icon-->
          <!--                            class="chatUserFileSvg"-->
          <!--                            icon-class="ppt"-->
          <!--                            v-else-if="['ppt'].indexOf(item.fileType) !== -1"-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></svg-icon>-->
          <!--                        <svg-icon-->
          <!--                            class="chatUserFileSvg"-->
          <!--                            icon-class="rar"-->
          <!--                            v-else-if="['rar'].indexOf(item.fileType) !== -1"-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></svg-icon>-->
          <!--                        <svg-icon-->
          <!--                            class="chatUserFileSvg"-->
          <!--                            icon-class="txt"-->
          <!--                            v-else-if="['txt'].indexOf(item.fileType) !== -1"-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></svg-icon>-->
          <!--                        <svg-icon-->
          <!--                            class="chatUserFileSvg"-->
          <!--                            icon-class="word"-->
          <!--                            v-else-if="-->
          <!--                          ['docx', 'doc'].indexOf(item.fileType) !== -1-->
          <!--                        "-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></svg-icon>-->
          <!--                        <svg-icon-->
          <!--                            class="chatUserFileSvg"-->
          <!--                            icon-class="zip"-->
          <!--                            v-else-if="['zip'].indexOf(item.fileType) !== -1"-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></svg-icon>-->
          <!--                        <svg-icon-->
          <!--                            class="chatUserFileSvg"-->
          <!--                            icon-class="unknownFile"-->
          <!--                            v-else-->
          <!--                            @click="-->
          <!--                          downloadFile(-->
          <!--                            item.fileUrl,-->
          <!--                            item.fileName + '.' + item.fileType-->
          <!--                          )-->
          <!--                        "-->
          <!--                        ></svg-icon>-->
          <!--                      </el-tooltip>-->
          <!--                      &lt;!&ndash;              <div class="chatUserMessage" v-html="markdownToHtml(item.content)"></div>&ndash;&gt;-->
          <!--                      <v-md-preview-->
          <!--                          class="chatUserMessageText chatMessageText"-->
          <!--                          :text="item.content"-->
          <!--                          v-if="!isEmpty(item.content)"-->
          <!--                      ></v-md-preview>-->
          <!--                    </div>-->
          <!--                    <el-image-->
          <!--                        class="chatUserAvatar"-->
          <!--                        :src="-->
          <!--                      isEmpty(user.avatarUrl)-->
          <!--                        ? user.gender === 0 || isEmpty(user.gender)-->
          <!--                          ? BoyAvatar-->
          <!--                          : GirlAvatar-->
          <!--                        : user.avatarUrl-->
          <!--                    "-->
          <!--                    ></el-image>-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--                <div class="chatRowLoading">-->
          <!--                  <div-->
          <!--                      class="chatRobot"-->
          <!--                      v-if="answeringFlag && loadingTime !== 0"-->
          <!--                  >-->
          <!--                    <el-image-->
          <!--                        class="chatRobotAvatar"-->
          <!--                        :src="-->
          <!--                      robotIdToRobot[-->
          <!--                        categoryIdToRobotId[-->
          <!--                          bookMenuItems[bookActive].categoryId-->
          <!--                        ]-->
          <!--                      ].avatar-->
          <!--                    "-->
          <!--                    ></el-image>-->
          <!--                    <div class="chatRobotMessage">-->
          <!--                      <v-md-preview-->
          <!--                          class="chatRobotMessageText chatMessageText"-->
          <!--                          :text="-->
          <!--                        answeringIndex === 0-->
          <!--                          ? loadingTime % 3 === 0-->
          <!--                            ? '正在分析中.'-->
          <!--                            : loadingTime % 3 === 1-->
          <!--                            ? '正在分析中. .'-->
          <!--                            : '正在分析中. . .'-->
          <!--                          : answeringMessage.substring(0, answeringIndex)-->
          <!--                      "-->
          <!--                      >-->
          <!--                      </v-md-preview>-->
          <!--                    </div>-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--                <div class="chatRowLoading">-->
          <!--                  <div class="chatRobot" v-if="answeringFlag && loadingFlag">-->
          <!--                    <el-image-->
          <!--                        class="chatRobotAvatar"-->
          <!--                        :src="-->
          <!--                      robotIdToRobot[-->
          <!--                        categoryIdToRobotId[-->
          <!--                          bookMenuItems[bookActive].categoryId-->
          <!--                        ]-->
          <!--                      ].avatar-->
          <!--                    "-->
          <!--                    ></el-image>-->
          <!--                    <div class="chatRobotMessage">-->
          <!--                      <v-md-preview-->
          <!--                          class="chatRobotMessageText chatMessageText"-->
          <!--                          text="快要生成出来了，请耐心等待"-->
          <!--                      ></v-md-preview>-->
          <!--                    </div>-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--              <el-button-->
          <!--                  class="scrollToBottomButton"-->
          <!--                  :icon="ArrowDownBold"-->
          <!--                  circle-->
          <!--                  @click="scrollToBottom"-->
          <!--              ></el-button>-->
          <!--            </el-scrollbar>-->

          <!--            <div class="inputArea">-->
          <!--              <el-button-->
          <!--                  class="clearSessionButton"-->
          <!--                  :icon="DeleteFilled"-->
          <!--                  circle-->
          <!--                  @click="refreshSession"-->
          <!--              ></el-button>-->
          <!--              <el-upload-->
          <!--                  class="upload-demo"-->
          <!--                  action="/api/file/uploadPicture?bucketType=1"-->
          <!--                  :show-file-list="false"-->
          <!--                  :on-remove="removeFile"-->
          <!--                  :on-success="fileUpload"-->
          <!--              >-->
          <!--                <el-button-->
          <!--                    class="fileUploadButton"-->
          <!--                    :icon="Folder"-->
          <!--                    circle-->
          <!--                ></el-button>-->
          <!--              </el-upload>-->
          <!--              <div class="input">-->
          <!--                <el-tooltip-->
          <!--                    :content="file.fileName + '.' + file.fileType"-->
          <!--                    placement="top"-->
          <!--                    effect="light"-->
          <!--                    v-if="!isEmpty(file)"-->
          <!--                >-->
          <!--                  <div class="file">-->
          <!--                    <el-image-->
          <!--                        class="picture"-->
          <!--                        :src="file.fileUrl"-->
          <!--                        fit="fill"-->
          <!--                        v-if="['jpg', 'png'].indexOf(file.fileType) !== -1"-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></el-image>-->
          <!--                    <svg-icon-->
          <!--                        class="fileSvg"-->
          <!--                        icon-class="csv"-->
          <!--                        v-else-if="['csv'].indexOf(file.fileType) !== -1"-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></svg-icon>-->
          <!--                    <svg-icon-->
          <!--                        class="fileSvg"-->
          <!--                        icon-class="excel"-->
          <!--                        v-else-if="['xlsx', 'xls'].indexOf(file.fileType) !== -1"-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></svg-icon>-->
          <!--                    <svg-icon-->
          <!--                        class="fileSvg"-->
          <!--                        icon-class="mp4"-->
          <!--                        v-else-if="['mp4'].indexOf(file.fileType) !== -1"-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></svg-icon>-->
          <!--                    <svg-icon-->
          <!--                        class="fileSvg"-->
          <!--                        icon-class="pdf"-->
          <!--                        v-else-if="['pdf'].indexOf(file.fileType) !== -1"-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></svg-icon>-->
          <!--                    <svg-icon-->
          <!--                        class="fileSvg"-->
          <!--                        icon-class="ppt"-->
          <!--                        v-else-if="['ppt'].indexOf(file.fileType) !== -1"-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></svg-icon>-->
          <!--                    <svg-icon-->
          <!--                        class="fileSvg"-->
          <!--                        icon-class="rar"-->
          <!--                        v-else-if="['rar'].indexOf(file.fileType) !== -1"-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></svg-icon>-->
          <!--                    <svg-icon-->
          <!--                        class="fileSvg"-->
          <!--                        icon-class="txt"-->
          <!--                        v-else-if="['txt'].indexOf(file.fileType) !== -1"-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></svg-icon>-->
          <!--                    <svg-icon-->
          <!--                        class="fileSvg"-->
          <!--                        icon-class="word"-->
          <!--                        v-else-if="['docx', 'doc'].indexOf(file.fileType) !== -1"-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></svg-icon>-->
          <!--                    <svg-icon-->
          <!--                        class="fileSvg"-->
          <!--                        icon-class="zip"-->
          <!--                        v-else-if="['zip'].indexOf(file.fileType) !== -1"-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></svg-icon>-->
          <!--                    <svg-icon-->
          <!--                        class="fileSvg"-->
          <!--                        icon-class="unknownFile"-->
          <!--                        v-else-->
          <!--                        @click="-->
          <!--                      downloadFile(-->
          <!--                        file.fileUrl,-->
          <!--                        file.fileName + '.' + file.fileType-->
          <!--                      )-->
          <!--                    "-->
          <!--                    ></svg-icon>-->
          <!--                    <svg-icon-->
          <!--                        class="deleteFile"-->
          <!--                        icon-class="fork"-->
          <!--                        @click="removeFile"-->
          <!--                    ></svg-icon>-->
          <!--                  </div>-->
          <!--                </el-tooltip>-->
          <!--                <el-input-->
          <!--                    class="chatInput"-->
          <!--                    v-model="chatInput"-->
          <!--                    :rows="2"-->
          <!--                    :autosize="{ minRows: 2, maxRows: 8 }"-->
          <!--                    type="textarea"-->
          <!--                    resize="none"-->
          <!--                    placeholder="开始你的提问吧"-->
          <!--                />-->
          <!--              </div>-->
          <!--              <el-button class="sendButton" @click="chat">-->
          <!--                <svg-icon class="sendButtonIcon" icon-class="send"></svg-icon>-->
          <!--              </el-button>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>

    <div class="robotContainer" :class="robotContainerFlag ? 'openRobotContainer' : 'closeRobotContainer'">
      <el-tooltip
          content="AI助手"
          placement="top-start"
          effect="light"
          v-if="!robotContainerFlag && !robotContainerLoadingFlag"
      >
        <svg-icon class="robotIcon" icon-class="robot"
                  @click="openRobotContainer"></svg-icon>
      </el-tooltip>
      <div class="chatContainer" v-if="robotContainerFlag">
        <div class="header">
          <svg-icon class="closeIcon" icon-class="fork" @click="closeRobotContainer"></svg-icon>
        </div>

        <el-scrollbar
            class="chatArea"
            ref="chatArea"
            label="chatArea"
            id="chatArea"
        >
          <div class="chatAreaInner" ref="chatAreaInner">
            <div class="chatRow" v-for="(item, index) in messages">
              <div class="chatRobot" v-if="item.role === 'assistant'">
                <el-image
                    class="chatRobotAvatar"
                    :src="
                            robotIdToRobot[
                              categoryIdToRobotId[
                                bookMenuItems[bookActive].categoryId
                              ]
                            ].avatar
                          "
                ></el-image>
                <!--              <div class="chatRobotMessage" v-html="markdownToHtml(item.content)"></div>-->
                <div class="chatRobotMessage">
                  <v-md-preview
                      class="chatRobotMessageText chatMessageText"
                      :text="item.content"
                  ></v-md-preview>
                </div>
              </div>

              <div class="chatUser" v-if="item.role === 'user'">
                <div class="chatUserMessage">
                  <el-tooltip
                      :content="item.fileName + '.' + item.fileType"
                      placement="top"
                      effect="light"
                      v-if="!isEmpty(item.fileType)"
                  >
                    <el-image
                        class="chatUserFilePicture"
                        :src="item.fileUrl"
                        fit="fill"
                        v-if="['jpg', 'png'].indexOf(item.fileType) !== -1"
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></el-image>
                    <svg-icon
                        class="chatUserFileSvg"
                        icon-class="csv"
                        v-else-if="['csv'].indexOf(item.fileType) !== -1"
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></svg-icon>
                    <svg-icon
                        class="chatUserFileSvg"
                        icon-class="excel"
                        v-else-if="
                                ['xlsx', 'xls'].indexOf(item.fileType) !== -1
                              "
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></svg-icon>
                    <svg-icon
                        class="chatUserFileSvg"
                        icon-class="mp4"
                        v-else-if="['mp4'].indexOf(item.fileType) !== -1"
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></svg-icon>
                    <svg-icon
                        class="chatUserFileSvg"
                        icon-class="pdf"
                        v-else-if="['pdf'].indexOf(item.fileType) !== -1"
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></svg-icon>
                    <svg-icon
                        class="chatUserFileSvg"
                        icon-class="ppt"
                        v-else-if="['ppt'].indexOf(item.fileType) !== -1"
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></svg-icon>
                    <svg-icon
                        class="chatUserFileSvg"
                        icon-class="rar"
                        v-else-if="['rar'].indexOf(item.fileType) !== -1"
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></svg-icon>
                    <svg-icon
                        class="chatUserFileSvg"
                        icon-class="txt"
                        v-else-if="['txt'].indexOf(item.fileType) !== -1"
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></svg-icon>
                    <svg-icon
                        class="chatUserFileSvg"
                        icon-class="word"
                        v-else-if="
                                ['docx', 'doc'].indexOf(item.fileType) !== -1
                              "
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></svg-icon>
                    <svg-icon
                        class="chatUserFileSvg"
                        icon-class="zip"
                        v-else-if="['zip'].indexOf(item.fileType) !== -1"
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></svg-icon>
                    <svg-icon
                        class="chatUserFileSvg"
                        icon-class="unknownFile"
                        v-else
                        @click="
                                downloadFile(
                                  item.fileUrl,
                                  item.fileName + '.' + item.fileType
                                )
                              "
                    ></svg-icon>
                  </el-tooltip>
                  <!--              <div class="chatUserMessage" v-html="markdownToHtml(item.content)"></div>-->
                  <v-md-preview
                      class="chatUserMessageText chatMessageText"
                      :text="item.content"
                      v-if="!isEmpty(item.content)"
                  ></v-md-preview>
                </div>
                <el-image
                    class="chatUserAvatar"
                    :src="
                            isEmpty(user.avatarUrl)
                              ? user.gender === 0 || isEmpty(user.gender)
                                ? BoyAvatar
                                : GirlAvatar
                              : user.avatarUrl
                          "
                ></el-image>
              </div>
            </div>
            <div class="chatRowLoading">
              <div
                  class="chatRobot"
                  v-if="answeringFlag && loadingTime !== 0"
              >
                <el-image
                    class="chatRobotAvatar"
                    :src="
                            robotIdToRobot[
                              categoryIdToRobotId[
                                bookMenuItems[bookActive].categoryId
                              ]
                            ].avatar
                          "
                ></el-image>
                <div class="chatRobotMessage">
                  <v-md-preview
                      class="chatRobotMessageText chatMessageText"
                      :text="
                              answeringIndex === 0
                                ? loadingTime % 3 === 0
                                  ? '正在分析中.'
                                  : loadingTime % 3 === 1
                                  ? '正在分析中. .'
                                  : '正在分析中. . .'
                                : answeringMessage.substring(0, answeringIndex)
                            "
                  >
                  </v-md-preview>
                </div>
              </div>
            </div>
<!--            <div class="chatRowLoading">-->
<!--              <div class="chatRobot" v-if="answeringFlag && loadingFlag">-->
<!--                <el-image-->
<!--                    class="chatRobotAvatar"-->
<!--                    :src="-->
<!--                            robotIdToRobot[-->
<!--                              categoryIdToRobotId[-->
<!--                                bookMenuItems[bookActive].categoryId-->
<!--                              ]-->
<!--                            ].avatar-->
<!--                          "-->
<!--                ></el-image>-->
<!--                <div class="chatRobotMessage">-->
<!--                  <v-md-preview-->
<!--                      class="chatRobotMessageText chatMessageText"-->
<!--                      text="快要生成出来了，请耐心等待"-->
<!--                  ></v-md-preview>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
          </div>
          <el-tooltip
              content="回到底部"
              placement="top-start"
              effect="light"
          >
            <el-button
                class="scrollToBottomButton"
                :icon="ArrowDownBold"
                circle
                @click="scrollToBottom"
            ></el-button>
          </el-tooltip>
        </el-scrollbar>

        <div class="inputArea">
          <el-tooltip
              content="清空会话"
              placement="top-start"
              effect="light"
          >
            <el-button
                class="clearSessionButton"
                :icon="DeleteFilled"
                circle
                @click="refreshSession"
            ></el-button>
          </el-tooltip>
          <el-upload
              class="upload-demo"
              action="/api/file/uploadPicture?bucketType=1"
              :show-file-list="false"
              :on-remove="removeFile"
              :on-success="fileUpload"
          >
            <el-tooltip
                content="上传附件"
                placement="top-start"
                effect="light"
            >
              <el-button
                  class="fileUploadButton"
                  :icon="Folder"
                  circle
              ></el-button>
            </el-tooltip>
          </el-upload>
          <div class="input">
            <el-tooltip
                :content="file.fileName + '.' + file.fileType"
                placement="top"
                effect="light"
                v-if="!isEmpty(file)"
            >
              <div class="file">
                <el-image
                    class="picture"
                    :src="file.fileUrl"
                    fit="fill"
                    v-if="['jpg', 'png'].indexOf(file.fileType) !== -1"
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></el-image>
                <svg-icon
                    class="fileSvg"
                    icon-class="csv"
                    v-else-if="['csv'].indexOf(file.fileType) !== -1"
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></svg-icon>
                <svg-icon
                    class="fileSvg"
                    icon-class="excel"
                    v-else-if="['xlsx', 'xls'].indexOf(file.fileType) !== -1"
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></svg-icon>
                <svg-icon
                    class="fileSvg"
                    icon-class="mp4"
                    v-else-if="['mp4'].indexOf(file.fileType) !== -1"
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></svg-icon>
                <svg-icon
                    class="fileSvg"
                    icon-class="pdf"
                    v-else-if="['pdf'].indexOf(file.fileType) !== -1"
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></svg-icon>
                <svg-icon
                    class="fileSvg"
                    icon-class="ppt"
                    v-else-if="['ppt'].indexOf(file.fileType) !== -1"
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></svg-icon>
                <svg-icon
                    class="fileSvg"
                    icon-class="rar"
                    v-else-if="['rar'].indexOf(file.fileType) !== -1"
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></svg-icon>
                <svg-icon
                    class="fileSvg"
                    icon-class="txt"
                    v-else-if="['txt'].indexOf(file.fileType) !== -1"
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></svg-icon>
                <svg-icon
                    class="fileSvg"
                    icon-class="word"
                    v-else-if="['docx', 'doc'].indexOf(file.fileType) !== -1"
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></svg-icon>
                <svg-icon
                    class="fileSvg"
                    icon-class="zip"
                    v-else-if="['zip'].indexOf(file.fileType) !== -1"
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></svg-icon>
                <svg-icon
                    class="fileSvg"
                    icon-class="unknownFile"
                    v-else
                    @click="
                            downloadFile(
                              file.fileUrl,
                              file.fileName + '.' + file.fileType
                            )
                          "
                ></svg-icon>
                <svg-icon
                    class="deleteFile"
                    icon-class="fork"
                    @click="removeFile"
                ></svg-icon>
              </div>
            </el-tooltip>
            <el-input
                class="chatInput"
                ref="chatInput"
                v-model="chatInput"
                :rows="2"
                :autosize="{ minRows: 2, maxRows: 8 }"
                type="textarea"
                resize="none"
                placeholder="开始你的提问吧"
                @keydown="chat"
            />
          </div>
          <el-tooltip
              content="发送"
              placement="top-start"
              effect="light"
          >
            <el-button class="sendButton" @click="chat">
              <svg-icon class="sendButtonIcon" icon-class="send"></svg-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
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
          >取消
          </el-button
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
import BoyAvatar from "@/assets/pictures/boyAvatar.png";
import GirlAvatar from "@/assets/pictures/girlAvatar.png";
import F2F2F2_Square from "@/assets/pictures/F2F2F2_Square.png";
import C9C9C9_Square from "@/assets/pictures/C9C9C9_Square.png";
import F2F2F2_BottomLeftAngledTriangle from "@/assets/pictures/F2F2F2_BottomLeftAngledTriangle.png";
import C9C9C9_TopRightAngledTriangle from "@/assets/pictures/C9C9C9_TopRightAngledTriangle.png";

import {
  ArrowDownBold,
  ArrowLeftBold,
  ArrowRightBold,
  DeleteFilled,
  Folder,
} from "@element-plus/icons-vue";

import {ref} from "vue";
import {fetchEventSource} from "@microsoft/fetch-event-source";

import {
  collection,
  getBookCategoryList,
  getCatalogueByBookId,
  getCollectionBookList, getFileByResourceId, getResourceByBookId,
  uncollection,
} from "@/apis/book";
import {contactUs, getUserByToken} from "@/apis/user";
import {
  addSession,
  deleteSession,
  getLearningCornerRobotList,
  getMessageList,
  getSessionList,
} from "@/apis/chat";

import {isEmpty, sleep} from "@/utils/common";

import SuspendedBall from "@/components/suspendedBall";
import PdfReader from '@/components/pdfReader'

export default {
  name: "LearningCornerChat",
  components: {SuspendedBall, PdfReader},
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
      DeleteFilled: DeleteFilled,
      Folder: Folder,

      categoryIdToRobotId: {},
      robotIdToRobot: {},

      contactUsForm: {},

      collectionBookIdList: [],
      bookMenuItems: [],
      book: {},
      resourceMenuItems: [],
      fileUrl: null,
      catalogue: [],
      session: null,
      messages: [],

      chatInput: "",
      file: null,

      contactUsDialogVis: false,

      robotContainerFlag: false,
      robotContainerLoadingFlag: false,

      answeringFlag: false,
      answeringMessage: "",
      answeringIndex: 0,
      answeringClock: null,

      loadingTime: 0,
      loadingClock: null,
      loadingFlag: false,

      bookActive: 0,
      resourceActive: 0,

      bookMenuShow: true,

      longTextDialogueExecuteEntitys: [],

      initFlag: false,
    };
  },
  setup() {
    const chatArea = ref(null);
    const chatAreaInner = ref(null);
    const pdfReader = ref(null)

    const scrollToBottom = () => {
      try {
        const bottom = chatAreaInner.value.clientHeight;
        chatArea.value.setScrollTop(bottom);
      } catch (err) {
        console.log(err);
      }
    };

    return {
      chatAreaInner,
      chatArea,
      pdfReader,
      scrollToBottom,
    };
  },
  async created() {
    if (isEmpty(this.$store.state.book)) {
      this.toLearningCornerBook();
      return;
    } else {
      this.book = this.$store.state.book;
    }

    await this.getUserByToken();

    // this.longTextDialogueExecuteEntitys =
    //   this.$store.state.longTextDialogueExecuteEntitys;
    // setInterval(() => {
    //   this.longTextDialogueQuery();
    // }, 1000 * 60);

    await this.getCollectionBookList();

    if (this.collectionBookIdList.indexOf(this.book.id) !== -1) {
      this.bookActive = this.collectionBookIdList.indexOf(this.book.id);
    } else {
      this.bookMenuItems.push(this.book);
      this.bookActive = this.bookMenuItems.length - 1;
    }

    await this.getResourceByBookId()
    await this.getBookCategoryList();
    await this.getRobotList();
    await this.getCatalogueByBookId();
    await this.getSessionList();

    this.initFlag = true;
  },
  mounted() {
    // this.dragControllerDiv();
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

    addSession() {
      addSession(
          this.categoryIdToRobotId[this.bookMenuItems[this.bookActive].categoryId]
      )
          .then((res) => {
            if (res.data.code === 200) {
              this.getSessionList();
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },
    refreshSession() {
      deleteSession(this.session.id)
          .then((res) => {
            if (res.data.code === 200) {
              this.addSession();
              this.$message.success("对话清除成功");
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
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
    getResourceByBookId() {
      getResourceByBookId(this.bookMenuItems[this.bookActive].id).then((res) => {
        if (res.data.code === 200) {
          if (!isEmpty(res.data.data)) {
            this.resourceMenuItems = []
            for (let i = 0; i < res.data.data.length; i++) {
              this.resourceMenuItems.push({
                id: res.data.data[i]["resource_id"],
                bookId: res.data.data[i]["book_id"],
                fileId: res.data.data[i]["file_id"],
                name: res.data.data[i]["resource_name"]
              })
              this.resourceActive = 0
              this.getFileByResourceId()
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
    getFileByResourceId() {
      getFileByResourceId(this.resourceMenuItems[this.resourceActive].fileId).then(async (res) =>  {
        if (res.data.code === 200) {
          while (isEmpty(this.pdfReader)){
            await sleep(10)
          }
          this.pdfReader.loadPdf(res.data.data)
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
      this.answeringFlag = true;
      return getLearningCornerRobotList()
          .then((res) => {
            if (res.data.code === 200) {
              this.robotIdToRobot = {};
              for (let i = 0; i < res.data.data.length; i++) {
                this.robotIdToRobot[res.data.data[i]["bot_id"]] = {
                  id: res.data.data[i]["bot_id"],
                  name: res.data.data[i]["bot_name"],
                  avatar: res.data.data[i]["bot_avatar"],
                  type: res.data.data[i]["bot_type"],
                  description: res.data.data[i]["description"],
                };
              }
              this.answeringFlag = false;
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
    getCatalogueByBookId() {
      return getCatalogueByBookId(this.bookMenuItems[this.bookActive].id)
          .then((res) => {
            if (res.data.code === 200) {
              this.catalogue = res.data.data["outline_child_list"];
            } else {
              this.catalogue = [];
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("系统异常，请联系管理员");
          });
    },
    getSessionList() {
      this.answeringFlag = true;
      return getSessionList(
          this.categoryIdToRobotId[this.bookMenuItems[this.bookActive].categoryId]
      )
          .then((res) => {
            if (res.data.code === 200) {
              if (isEmpty(res.data.data)) {
                this.answeringFlag = false;
                this.addSession();
              } else {
                this.session = {
                  id: res.data.data[0]["session_id"],
                  botId: res.data.data[0]["bot_id"],
                  userId: res.data.data[0]["user_id"],
                  createTime: res.data.data[0]["created_time"],
                  updateTime: res.data.data[0]["updated_time"],
                  message: isEmpty(res.data.data[0]["message"])
                      ? null
                      : {
                        id: res.data.data[0]["message"]["message_id"],
                        sessionId: res.data.data[0]["message"]["session_id"],
                        role: res.data.data[0]["message"]["role"],
                        content: res.data.data[0]["message"]["content"],
                        fileType: res.data.data[0]["message"]["file_type"],
                        fileName: res.data.data[0]["message"]["file_name"],
                        fileUrl: res.data.data[0]["message"]["file_url"],
                        createTime: res.data.data[0]["message"]["created_time"],
                      },
                };
                this.answeringFlag = false;
                this.getMessageList();
              }
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
    getMessageList() {
      this.answeringFlag = true;
      return getMessageList(this.session.id)
          .then((res) => {
            if (res.data.code === 200) {
              this.messages = [
                {
                  role: "assistant",
                  contentType: "text",
                  content:
                  this.robotIdToRobot[
                      this.categoryIdToRobotId[
                          this.bookMenuItems[this.bookActive].categoryId
                          ]
                      ].description,
                },
              ];
              for (let i in res.data.data) {
                this.messages.push({
                  id: res.data.data[i]["message_id"],
                  sessionId: res.data.data[i]["session_id"],
                  role: res.data.data[i]["role"],
                  content: res.data.data[i]["content"],
                  fileType: res.data.data[i]["file_type"],
                  fileName: res.data.data[i]["file_name"],
                  fileUrl: res.data.data[i]["file_url"],
                  createTime: res.data.data[i]["created_time"],
                });
              }
              this.answeringFlag = false;
              this.$nextTick(() => {
                this.scrollToBottom();
              });
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
    getCollectionBookList() {
      return getCollectionBookList()
          .then((res) => {
            if (res.data.code === 200) {
              this.collectionBookIdList = [];
              if (!isEmpty(res.data.data)) {
                for (let i = 0; i < res.data.data.length; i++) {
                  if (!this.initFlag) {
                    this.bookMenuItems.push({
                      id: res.data.data[i]["book_id"],
                      bookName: res.data.data[i]["book_name"],
                      categoryId: res.data.data[i]["lib_id"],
                    });
                  }
                  this.collectionBookIdList.push(res.data.data[i]["book_id"]);
                }
              }
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch((err) => {
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
    chat(e) {
      if (isEmpty(e.keyCode) || (!e.shiftKey && e.keyCode === 13)) {
        e.cancelBubble = true;
        e.stopPropagation();
        e.preventDefault();
      } else {
        return;
      }

      if (isEmpty(this.file) && isEmpty(this.chatInput)) {
        return;
      }

      if (this.answeringFlag) {
        return;
      }

      this.answeringFlag = true;
      this.answeringMessage = "";
      this.answeringIndex = 0;
      this.answeringClock = setInterval(() => {
        this.answeringIndex = Math.min(
            this.answeringIndex + 1,
            this.answeringMessage.length
        );
      }, 20);

      this.loadingTime = 0;
      this.loadingFlag = false;
      this.loadingClock = setInterval(() => {
        this.loadingTime = this.loadingTime + 1;
        if (this.loadingTime > Math.random() * 5 + 15) {
          this.loadingFlag = true;
        }
      }, 1000);

      this.messages.push({
        role: "user",
        content: this.chatInput,
        fileType: isEmpty(this.file) ? null : this.file.fileType,
        fileName: isEmpty(this.file) ? null : this.file.fileName,
        fileUrl: isEmpty(this.file) ? null : this.file.fileUrl,
      });

      this.$nextTick(() => {
        this.scrollToBottom();
      });

      const ctrl = new AbortController();
      fetchEventSource("/api/chat/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          bot_id:
              this.categoryIdToRobotId[
                  this.bookMenuItems[this.bookActive].categoryId
                  ],
          session_id: this.session.id,
          bot_handle: 0,
          content: this.chatInput,
          file_type: isEmpty(this.file) ? null : this.file.fileType,
          file_name: isEmpty(this.file) ? null : this.file.fileName,
          file_url: isEmpty(this.file) ? null : this.file.fileUrl,
        }),
        signal: ctrl.signal,
        onmessage: (message) => {
          if (message.event === "conversation") {
            this.answeringMessage += isEmpty(message.data) ? "" : message.data;
          } else if (message.event === "done") {
          } else if (message.event === "all") {
            this.answeringFlag = false;
            clearInterval(this.answeringClock);
            this.loadingTime = 0;
            this.loadingFlag = false;
            clearInterval(this.loadingClock);
            this.messages.push({
              role: "assistant",
              contentType: "text",
              content: message.data.replaceAll("\\n", "\n"),
            });
          }
        },
        onclose: () => {
          this.answeringFlag = false;
          clearInterval(this.answeringClock);
          this.loadingTime = 0;
          this.loadingFlag = false;
          clearInterval(this.loadingClock);
        },
        onerror: (err) => {
          this.answeringFlag = false;
          clearInterval(this.answeringClock);
          this.loadingTime = 0;
          this.loadingFlag = false;
          clearInterval(this.loadingClock);
          this.messages.push({
            role: "assistant",
            contentType: "text",
            content: "系统异常，请联系管理员",
          });
          console.log(err);
          this.$message.error("系统异常，请联系管理员");
          throw err;
        },
      });

      this.chatInput = "";
      this.removeFile();
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

    removeFile(file, fileList) {
      this.file = null;
    },
    fileUpload(res, file, fileList) {
      if (res.code === 200) {
        this.file = {
          id: res.data["file_id"],
          fileName: res.data["file_name"],
          fileType: res.data["file_type"],
          fileUrl: res.data["file_url"],
          createTime: res.data["create_time"],
        };
        console.log(this.file);
      } else {
        this.$message.error(res.message);
      }
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

    openRobotContainer() {
      if (!this.robotContainerFlag) {
        this.robotContainerFlag = true
        this.chatInput = " "
        this.scrollToBottom()
        sleep(600).then(() => {
          this.chatInput = ""
        })
      }
    },
    closeRobotContainer() {
      this.robotContainerFlag = false
      this.robotContainerLoadingFlag = true
      sleep(600).then(() => {
        this.robotContainerLoadingFlag = false
      })
    },

    share() {
      var copyVal = document.getElementById("copyVal");
      copyVal.select();
      document.execCommand("copy");
      this.$message.success("分享链接已复制到剪切板");
    },

    selectBookMenu(index) {
      this.bookActive = parseInt(index);
      this.$store.commit("setBook", this.bookMenuItems[this.bookActive]);
      // this.getCatalogueByBookId();
      this.getResourceByBookId()
      this.getSessionList();
    },
    selectResourceMenu(index) {
      this.resourceActive = parseInt(index)
      this.getFileByResourceId()

    },

    downloadFile(url, name) {
      const xhr = new XMLHttpRequest();
      xhr.open("get", url);
      xhr.responseType = "blob";
      xhr.onload = (e) => {
        if (xhr.status === 200) {
          const response = xhr.response;
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(response, name);
          } else {
            const href = URL.createObjectURL(response);
            let ele = document.createElement("a");
            ele.target = "_blank";
            ele.href = href;
            ele.download = name;
            ele.click();
            ele = null;
            URL.revokeObjectURL(href);
          }
        } else {
          this.$message.error("下载失败");
        }
      };
      xhr.send(null);
    },

    closeBookMenu() {
      this.bookMenuShow = false;
    },
    openBookMenu() {
      this.bookMenuShow = true;
    },

    toWorkbench() {
      this.$router.push("/workbench");
    },
    toLearningCornerBook() {
      this.$router.push("/learningCornerBook");
    },
    toPersonalCenter() {
      this.$router.push("/personalCenter");
    },

    dragControllerDiv() {
      var resize = document.getElementsByClassName("resize")[0];
      var left = document.getElementsByClassName("catalogueContainer");
      var mid = document.getElementsByClassName("chatContainer");
      var box = document.getElementsByClassName("studyContainer")[0];

      resize.onmousedown = function (e) {
        resize.style.background = "#818181";
        var startX = e.clientX;
        resize.left = resize.offsetLeft;

        document.onmousemove = function (e) {
          var endX = e.clientX;
          var moveLen = resize.left + (endX - startX);
          var maxT = box.clientWidth - resize.offsetWidth;

          if (moveLen < 20) moveLen = 20;
          if (moveLen > maxT - 20) moveLen = maxT - 20;

          resize.style.left = moveLen;

          for (let j = 0; j < left.length; j++) {
            left[j].style.width = moveLen + "px";
            mid[j].style.width = box.clientWidth - moveLen - 12 + "px";
          }
        };

        document.onmouseup = function () {
          resize.style.background = "#d6d6d6";
          document.onmousemove = null;
          document.onmouseup = null;
          resize.releaseCapture && resize.releaseCapture();
        };
        resize.setCapture && resize.setCapture();
        return false;
      };
    },

    isEmpty(field) {
      return isEmpty(field);
    },
  },
};
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

  background: #CBCBCB;
}

#learningCornerChat .bookMenu .returnButton {
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
  width: 100%;
  height: calc(100% - 120px - 10px - 40px - 10px - 40px - 8px);
}

#learningCornerChat .bookMenu .bookMenuScrollbar .bookMenuItem {
  padding: 0 10px 0 10px;
}

#learningCornerChat
.bookMenu
.bookMenuScrollbar
.bookMenuItem
.bookMenuItemName {
  width: calc(100% - 30px);
  height: 40px;

  border: none;
  border-radius: 10px;

  text-align: center;

  line-height: 40px;

  background: #E6E6E6;

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

  cursor: pointer;
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

#learningCornerChat
.resourceMenu
.resourceMenuScrollbar
.resourceMenuItem
.resourceMenuItemName {
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

#learningCornerChat .resourceMenu .resourceMenuScrollbar .resourceMenuItem .collectionIcon {
  margin: 0 3px 0 3px;

  width: 24px;
  height: 24px;
}


#learningCornerChat .mainContainer {
  display: inline-flex;
  flex-flow: column;

  position: relative;

  vertical-align: top;

  height: 100%;
}

#learningCornerChat .mainContainerShort {
  width: calc(100% - 220px - 180px);
}

#learningCornerChat .mainContainerLong {
  width: calc(100% - 180px);
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

#learningCornerChat
.mainContainer
.patterns
.patternBottomLeftAngledTriangleActive {
  left: calc(75% - 60px / 2);
}

#learningCornerChat
.mainContainer
.patterns
.patternTopRightAngledTriangleUnactive {
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
  position: relative;

  width: 100%;
  height: calc(100% - 64px);
}

#learningCornerChat .mainContainer .studyContainer .catalogueContainer {
  display: inline-block;

  width: 100%;
  height: 100%;

  border-right: 1px solid #f2f2f2;
}

#learningCornerChat
.mainContainer
.studyContainer
.catalogueContainer
.bookTitle {
  margin: 20px 0 0 0;

  width: 100%;
  height: 50px;

  text-align: center;

  font-size: 30px;
}

#learningCornerChat
.mainContainer
.studyContainer
.catalogueContainer
.catalogueScrollbar {
  width: 100%;
  height: calc(100% - 50px - 20px);
}

#learningCornerChat
.mainContainer
.studyContainer
.catalogueContainer
.catalogueScrollbar
.catalogue {
  margin: 0 auto 0 auto;

  width: 90%;
  height: 100%;

  font-size: 20px;
}

#learningCornerChat
.mainContainer
.studyContainer
.catalogueContainer
.catalogueScrollbar
/deep/
.el-tree-node {
  white-space: normal;
}

#learningCornerChat
.mainContainer
.studyContainer
.catalogueContainer
.catalogueScrollbar
/deep/
.el-tree-node.is-expanded
> .el-tree-node__children {
  display: inline;
}

#learningCornerChat
.mainContainer
.studyContainer
.catalogueContainer
.catalogueScrollbar
.catalogue
/deep/
.el-tree-node__content {
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

#learningCornerChat .robotContainer .chatContainer .chatArea {
  flex: 1;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.scrollToBottomButton {
  position: absolute;

  bottom: 0;
  left: 50%;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow {
  padding: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow
.chatRobot {
  text-align: left;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow
.chatRobot
.chatRobotAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow
.chatRobot
.chatRobotMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 10px;

  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  background: #f2f2f2;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow
.chatRobot
.chatRobotMessage
.chatRobotMessageText {
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow
.chatUser {
  text-align: right;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow
.chatUser
.chatUserMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 10px 0 0;

  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  text-align: left;

  background: #f2f2f2;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow
.chatUser
.chatUserMessage
.chatUserFilePicture {
  margin: 10px 10px 10px 10px;

  width: 50px;
  max-width: 100px;
  max-height: 100px;

  cursor: pointer;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow
.chatUser
.chatUserMessage
.chatUserFileSvg {
  margin: 10px 10px 10px 10px;

  width: 50px;

  height: 50px;

  outline: none;

  cursor: pointer;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow
.chatUser
.chatUserMessage
.chatUserMessageText {
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRow
.chatUser
.chatUserAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRowLoading {
  padding: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRowLoading
.chatRobot {
  text-align: left;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRowLoading
.chatRobot
.chatRobotAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#learningCornerChat .robotContainer .chatContainer
.chatArea
.chatAreaInner
.chatRowLoading
.chatRobot
.chatRobotMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 10px;

  min-width: 30px;
  max-width: calc(80% - 40px - 50px);

  border-radius: 20px;

  background: #f2f2f2;
}

#learningCornerChat /deep/ .chatMessageText .github-markdown-body {
  padding: 16px 32px 16px 32px;

  font-family: "Source Han Serif" !important;
}

#learningCornerChat /deep/ .chatMessageText .github-markdown-body p {
  margin-bottom: 0 !important;

  font-family: "Source Han Serif" !important;
}

#learningCornerChat .robotContainer .chatContainer .inputArea {
  position: relative;

  padding: 10px 0 10px 0;

  width: 100%;
  height: auto;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.upload-demo {
  position: absolute;

  left: 0;
  bottom: 0;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.upload-demo
/deep/
.el-upload-list {
  position: absolute;

  bottom: 70px;
  left: 10px;

  width: 90px;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.clearSessionButton {
  position: absolute;

  bottom: 20px;
  left: 10px;

  width: 40px;
  height: 40px;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.fileUploadButton {
  position: absolute;

  bottom: 20px;
  left: 60px;

  width: 40px;
  height: 40px;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.input {
  margin: 0 0 0 110px;

  width: calc(100% - 110px - 120px);
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.input
.file {
  display: inline-block;

  position: relative;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.input
.file
.picture {
  max-width: 100px;
  max-height: 100px;

  cursor: pointer;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.input
.file
.fileSvg {
  width: 50px;

  height: 50px;

  outline: none;

  cursor: pointer;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.input
.file
.deleteFile {
  position: absolute;

  top: -6px;
  right: -6px;

  width: 12px;
  height: 12px;

  border-radius: 50%;

  background: #c9c9c9;

  cursor: pointer;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.input
.chatInput {
  width: 100%;

  font-size: 16px;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.sendButton {
  position: absolute;

  right: 40px;
  bottom: 20px;

  padding: 0 0 0 0;

  width: 60px;
  height: 40px;

  text-align: center;
}

#learningCornerChat .robotContainer .chatContainer
.inputArea
.sendButton
.sendButtonIcon {
  width: 24px;
  height: 24px;
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

#learningCornerChat /deep/ .markdown .github-markdown-body {
  padding: 0 0 0 0;

  font-family: "Source Han Serif" !important;
}

#learningCornerChat /deep/ .markdown .github-markdown-body p {
  margin-bottom: 0 !important;

  line-height: 30px;

  font-family: "Source Han Serif" !important;
}

#learningCornerChat .el-menu-item.is-disabled {
  opacity: 1;
}
</style>