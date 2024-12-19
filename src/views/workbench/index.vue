<template>
  <div id="workbench">
    <el-menu class="robotMenu" default-active="0" @select="selectRobotMenu">
      <el-scrollbar class="robotMenuScrollbar">
        <el-menu-item
            class="robotMenuItem"
            v-for="(item, value) in robots"
            :index="String(value)"
            :disabled="answeringFlag || imageAnalyzeFlag || sendQuestionFlag"
        >
          <div class="robotMenuItemContainer">
            <el-image
                class="robotMenuItemImage"
                :src="item.avatar"
                fit="contain"
            />
            <div class="robotMenuItemTitle">{{ item.name }}</div>
          </div>
        </el-menu-item>
      </el-scrollbar>
      <div class="logo">
        <div class="schoolName">{{ user.school + "版" }}</div>
        <el-image class="logoImage" :src="logo" fit="fill" @click="toHome"/>
      </div>
    </el-menu>

    <el-menu
        class="sessionMenu"
        :default-active="String(sessionActive)"
        v-if="
        sessionMenuShow && !isEmpty(robots) && robots[robotActive].frontFlag !== 1
      "
        @select="selectSessionMenu"
    >
      <el-button class="addSessionButton" link @click="addSession"
                 :disabled=" robots[robotActive].frontFlag === 3 && longRobotFlag"
      >新增对话
      </el-button
      >
      <el-scrollbar class="sessionMenuScrollbar">
        <el-menu-item
            class="sessionMenuItem"
            v-for="(item, value) in sessions"
            :index="String(value)"
            :disabled="answeringFlag || imageAnalyzeFlag || sendQuestionFlag"
        >
          <!--          <div class="sessionMenuItemTitle">{{ item.id }}</div>-->
          <div class="sessionMenuItemTitle">
            {{
              isEmpty(item.message) || isEmpty(item.message.content)
                  ? "new Chat"
                  : item.message.content
            }}
          </div>
          <el-tooltip
              content="删除会话"
              placement="right"
              effect="light"
          >
            <svg-icon
                class="sessionMenuDeleteIcon"
                icon-class="delete"
                @click="deleteSession(value)"
            ></svg-icon>
          </el-tooltip>
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
        class="sessionMenuControllerButton sessionMenuControllerButtonOpen"
        v-if="
        sessionMenuShow && !isEmpty(robots) && robots[robotActive].frontFlag !== 1
      "
        @click="closeSessionMenu"
        :icon="ArrowLeftBold"
        circle
    />
    <el-button
        class="sessionMenuControllerButton sessionMenuControllerButtonClose"
        v-else-if="!isEmpty(robots) && robots[robotActive].frontFlag !== 1 "
        @click="openSessionMenu"
        :icon="ArrowRightBold"
        circle
    />

    <div
        class="mainContainer"
        :class="{
        mainContainerShort:
          sessionMenuShow &&
          !isEmpty(robots) &&
          robots[robotActive].frontFlag !== 1,
        mainContainerLong: !(
          sessionMenuShow &&
          !isEmpty(robots) &&
          robots[robotActive].frontFlag !== 1
        ),
      }"
    >
      <div class="patterns">
        <el-image
            class="patternLeftRectangle patternRectangleUnactive"
            :src="F2F2F2_Square"
            @click="toLearningCornerBook"
        ></el-image>
        <el-image
            class="patternAngledTriangle patternBottomLeftAngledTriangleUnactive"
            :src="F2F2F2_BottomLeftAngledTriangle"
            @click="toLearningCornerBook"
        ></el-image>
        <div class="leftTitleUnactive" @click="toLearningCornerBook">
          期末必过角
        </div>
        <el-image
            class="patternRightRectangle patternRectangleActive"
            :src="C9C9C9_Square"
        ></el-image>
        <el-image
            class="patternAngledTriangle patternTopRightAngledTriangleActive"
            :src="C9C9C9_TopRightAngledTriangle"
        ></el-image>
        <div class="rightTitleActive">工作台</div>
        <!--        <div class="pattern1 pattern1unactive" @click="toLearningCornerBook">-->
        <!--          期末必过角-->
        <!--        </div>-->
        <!--        <div class="pattern2 pattern2active">-->
        <!--          工作台-->
        <!--        </div>-->
        <svg-icon
            class="shareIcon"
            icon-class="share"
            @click="share"
        ></svg-icon>
      </div>

      <el-scrollbar
          class="chatArea"
          ref="chatArea"
          label="chatArea"
          id="chatArea"
          v-if="!isEmpty(robots) && (robots[robotActive].frontFlag === 0 || robots[robotActive].frontFlag === 3)"
      >
        <div class="chatAreaInner" ref="chatAreaInner">
          <div class="chatRow" v-for="(item, index) in messages">
            <div class="chatRobot" v-if="item.role === 'assistant'">
              <el-image
                  class="chatRobotAvatar"
                  :src="robots[robotActive].avatar"
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
                      v-else-if="['xlsx', 'xls'].indexOf(item.fileType) !== -1"
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
                      v-else-if="['docx', 'doc'].indexOf(item.fileType) !== -1"
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
            <div class="chatRobot" v-if="answeringFlag && loadingTime !== 0">
              <el-image
                  class="chatRobotAvatar"
                  :src="robots[robotActive].avatar"
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
          <!--          <div class="chatRowLoading">-->
          <!--            <div-->
          <!--                class="chatRobot"-->
          <!--                v-if="answeringFlag && loadingFlag && answeringIndex === 0"-->
          <!--            >-->
          <!--              <el-image-->
          <!--                  class="chatRobotAvatar"-->
          <!--                  :src="robots[robotActive].avatar"-->
          <!--              ></el-image>-->
          <!--              <div class="chatRobotMessage">-->
          <!--                <v-md-preview-->
          <!--                    class="chatRobotMessageText chatMessageText"-->
          <!--                    text="快要生成出来了，请耐心等待"-->
          <!--                ></v-md-preview>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
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

      <div
          class="inputArea"
          v-if="!isEmpty(robots) && (robots[robotActive].frontFlag === 0)"
      >
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
            <el-button class="fileUploadButton" :icon="Folder" circle></el-button>
          </el-tooltip>
        </el-upload>
        <div class="input">
          <!--          <el-button v-for="robots[robotsActive].p></el-button>-->
          <div class="prompts">
            <el-button
                class="prompt"
                v-for="(item, value) in robots[robotActive].prompts"
                @click="chatPrompts(item)"
            >
              {{ item }}
            </el-button>
          </div>
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
                  fit="contain"
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
      <div
          class="inputArea1"
          v-if="!isEmpty(robots) && (robots[robotActive].frontFlag === 3 && !longRobotFlag)"
      >
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
            <el-button class="fileUploadButton" :icon="Folder" circle></el-button>
          </el-tooltip>
        </el-upload>
        <div class="input">
          <!--          <el-button v-for="robots[robotsActive].p></el-button>-->
          <div class="prompts">
            <el-button
                class="prompt"
                v-for="(item, value) in robots[robotActive].prompts"
                @click="chatPrompts(item)"
            >
              {{ item }}
            </el-button>
          </div>
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
                  fit="contain"
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
        <el-button class="toLongTextRobotButton" @click="toLongTextRobot" type="primary">
          <el-tooltip
              content="切换长文本AI"
              placement="top-start"
              effect="light"
          >
            <svg-icon class="sendButtonIcon" icon-class="longText"></svg-icon>
          </el-tooltip>
        </el-button>
      </div>
      <div
          class="inputArea1"
          v-if="!isEmpty(robots) && (robots[robotActive].frontFlag === 3 && longRobotFlag)"
      >
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
            <el-button class="fileUploadButton" :icon="Folder" circle></el-button>
          </el-tooltip>
        </el-upload>
        <div class="input">
          <!--          <el-button v-for="robots[robotsActive].p></el-button>-->
          <div class="prompts">
            <el-button
                class="prompt"
                v-for="(item, value) in robots[robotActive].prompts"
                @click="chatPrompts(item)"
            >
              {{ item }}
            </el-button>
          </div>
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
                  fit="contain"
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
              v-model="chatInput"
              :rows="2"
              :autosize="{ minRows: 2, maxRows: 8 }"
              type="textarea"
              resize="none"
              placeholder="开始你的提问吧"
              @keydown="chat"
              :disabled="messages.length > 1"
          />
        </div>
        <el-tooltip
            content="发送"
            placement="top-start"
            effect="light"
        >
          <el-button class="sendButton" @click="chatLong">
            <svg-icon class="sendButtonIcon" icon-class="send"></svg-icon>
          </el-button>
        </el-tooltip>
        <el-button class="toLongTextRobotButton" @click="toOutlineRobot" type="primary">
          <el-tooltip
              content="返回大纲AI"
              placement="top-start"
              effect="light"
          >
            <svg-icon class="sendButtonIcon" icon-class="outline"></svg-icon>
          </el-tooltip>
        </el-button>
      </div>
      <div v-if="!isEmpty(robots) && (robots[robotActive].frontFlag === 0 || robots[robotActive].frontFlag === 3)"
           style="width: 100%;height: 20px;"></div>

      <div
          class="mathematicalModel"
          v-else-if="!isEmpty(robots) && robots[robotActive].frontFlag === 1"
      >
        <div class="leftContainer">
          <div class="uploadFileContainer">
            <el-upload
                class="dragUpload"
                drag
                action="/api/file/uploadPicture?bucketType=1"
                :show-file-list="false"
                :on-success="fileUpload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">拖拽上传或<em>点击上传</em></div>
            </el-upload>
            <div class="pasteUpload" tabindex="-1" v-on:paste="handlePaste">
              <span>Ctrl+V粘贴至此</span>
            </div>
          </div>

          <el-image
              class="image"
              :src="file.fileUrl"
              v-if="!isEmpty(file)"
              fit="contain"
          ></el-image>
          <el-button
              class="imageAnalyze"
              v-if="!isEmpty(file)"
              @click="imageAnalyze"
              v-loading="false"
          >开始分析
          </el-button>
          <!--          <scrollbar class="latexContainer" ref="latexContainer"></scrollbar>-->
          <v-md-preview
              class="latexContainer"
              :text="imageQuestiuonText"
          ></v-md-preview>
          <el-input
              class="latexInput"
              v-model="imageQuestiuonText"
              :rows="2"
              :autosize="{ minRows: 2, maxRows: 8 }"
              type="textarea"
              resize="none"
              @input="renderLatex($refs.latexContainer, imageQuestiuonText)"
              v-loading="imageAnalyzeFlag"
              @keydown="sendQuestion"
          />
          <el-button class="sendQuestion" type="primary" @click="sendQuestion"
          >发送题目
          </el-button
          >
        </div>
        <el-scrollbar class="rightContainer">
          <div class="chatRow">
            <el-image
                class="chatRobotAvatar"
                :src="robots[robotActive].avatar"
            ></el-image>
            <!--              <div class="chatRobotMessage" v-html="markdownToHtml(item.content)"></div>-->
            <div class="chatRobotMessage">
              <v-md-preview
                  class="chatRobotMessageText chatMessageText"
                  :text="robots[robotActive].description"
              >
              </v-md-preview>
            </div>
          </div>
          <div
              class="chatRow"
              v-if="!isEmpty(sendQuestionMessage) || sendQuestionFlag"
          >
            <el-image
                class="chatRobotAvatar"
                :src="robots[robotActive].avatar"
            ></el-image>
            <!--              <div class="chatRobotMessage" v-html="markdownToHtml(item.content)"></div>-->
            <div class="chatRobotMessage">
              <v-md-preview
                  class="chatRobotMessageText chatMessageText"
                  :text="
                        sendQuestionIndex === 0
                          ? loadingTime % 3 === 0
                            ? '正在分析中.'
                            : loadingTime % 3 === 1
                            ? '正在分析中. .'
                            : '正在分析中. . .'
                          : sendQuestionMessage.substring(0, sendQuestionIndex)
                      "
                  v-if="sendQuestionFlag"
              >
              </v-md-preview>
              <v-md-preview
                  class="chatRobotMessageText chatMessageText latexMessageText"
                  ref="chatRobotMessageText"
                  v-else
                  :text="sendQuestionMessage"
              ></v-md-preview>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <!--      <el-scrollbar-->
      <!--          class="chatArea"-->
      <!--          ref="chatArea"-->
      <!--          label="chatArea"-->
      <!--          id="chatArea"-->
      <!--          v-if="!isEmpty(robots) && robots[robotActive].frontFlag === 3"-->
      <!--      >-->
      <!--        <div class="chatAreaInner" ref="chatAreaInner">-->
      <!--          <div class="chatRow" v-for="(item, index) in messages">-->
      <!--            <div class="chatRobot" v-if="item.role === 'assistant'">-->
      <!--              <el-image-->
      <!--                  class="chatRobotAvatar"-->
      <!--                  :src="robots[robotActive].avatar"-->
      <!--              ></el-image>-->
      <!--              &lt;!&ndash;              <div class="chatRobotMessage" v-html="markdownToHtml(item.content)"></div>&ndash;&gt;-->
      <!--              <div class="chatRobotMessage">-->
      <!--                <v-md-preview-->
      <!--                    class="chatRobotMessageText chatMessageText"-->
      <!--                    :text="item.content"-->
      <!--                ></v-md-preview>-->
      <!--              </div>-->
      <!--            </div>-->

      <!--            <div class="chatUser" v-if="item.role === 'user'">-->
      <!--              <div class="chatUserMessage">-->
      <!--                <el-tooltip-->
      <!--                    :content="item.fileName + '.' + item.fileType"-->
      <!--                    placement="top"-->
      <!--                    effect="light"-->
      <!--                    v-if="!isEmpty(item.fileType)"-->
      <!--                >-->
      <!--                  <el-image-->
      <!--                      class="chatUserFilePicture"-->
      <!--                      :src="item.fileUrl"-->
      <!--                      fit="fill"-->
      <!--                      v-if="['jpg', 'png'].indexOf(item.fileType) !== -1"-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></el-image>-->
      <!--                  <svg-icon-->
      <!--                      class="chatUserFileSvg"-->
      <!--                      icon-class="csv"-->
      <!--                      v-else-if="['csv'].indexOf(item.fileType) !== -1"-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></svg-icon>-->
      <!--                  <svg-icon-->
      <!--                      class="chatUserFileSvg"-->
      <!--                      icon-class="excel"-->
      <!--                      v-else-if="['xlsx', 'xls'].indexOf(item.fileType) !== -1"-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></svg-icon>-->
      <!--                  <svg-icon-->
      <!--                      class="chatUserFileSvg"-->
      <!--                      icon-class="mp4"-->
      <!--                      v-else-if="['mp4'].indexOf(item.fileType) !== -1"-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></svg-icon>-->
      <!--                  <svg-icon-->
      <!--                      class="chatUserFileSvg"-->
      <!--                      icon-class="pdf"-->
      <!--                      v-else-if="['pdf'].indexOf(item.fileType) !== -1"-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></svg-icon>-->
      <!--                  <svg-icon-->
      <!--                      class="chatUserFileSvg"-->
      <!--                      icon-class="ppt"-->
      <!--                      v-else-if="['ppt'].indexOf(item.fileType) !== -1"-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></svg-icon>-->
      <!--                  <svg-icon-->
      <!--                      class="chatUserFileSvg"-->
      <!--                      icon-class="rar"-->
      <!--                      v-else-if="['rar'].indexOf(item.fileType) !== -1"-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></svg-icon>-->
      <!--                  <svg-icon-->
      <!--                      class="chatUserFileSvg"-->
      <!--                      icon-class="txt"-->
      <!--                      v-else-if="['txt'].indexOf(item.fileType) !== -1"-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></svg-icon>-->
      <!--                  <svg-icon-->
      <!--                      class="chatUserFileSvg"-->
      <!--                      icon-class="word"-->
      <!--                      v-else-if="['docx', 'doc'].indexOf(item.fileType) !== -1"-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></svg-icon>-->
      <!--                  <svg-icon-->
      <!--                      class="chatUserFileSvg"-->
      <!--                      icon-class="zip"-->
      <!--                      v-else-if="['zip'].indexOf(item.fileType) !== -1"-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></svg-icon>-->
      <!--                  <svg-icon-->
      <!--                      class="chatUserFileSvg"-->
      <!--                      icon-class="unknownFile"-->
      <!--                      v-else-->
      <!--                      @click="-->
      <!--                            downloadFile(-->
      <!--                              item.fileUrl,-->
      <!--                              item.fileName + '.' + item.fileType-->
      <!--                            )-->
      <!--                          "-->
      <!--                  ></svg-icon>-->
      <!--                </el-tooltip>-->
      <!--                &lt;!&ndash;              <div class="chatUserMessage" v-html="markdownToHtml(item.content)"></div>&ndash;&gt;-->
      <!--                <v-md-preview-->
      <!--                    class="chatUserMessageText chatMessageText"-->
      <!--                    :text="item.content"-->
      <!--                    v-if="!isEmpty(item.content)"-->
      <!--                ></v-md-preview>-->
      <!--              </div>-->
      <!--              <el-image-->
      <!--                  class="chatUserAvatar"-->
      <!--                  :src="-->
      <!--                        isEmpty(user.avatarUrl)-->
      <!--                          ? user.gender === 0 || isEmpty(user.gender)-->
      <!--                            ? BoyAvatar-->
      <!--                            : GirlAvatar-->
      <!--                          : user.avatarUrl-->
      <!--                      "-->
      <!--              ></el-image>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="chatRowLoading">-->
      <!--            <div class="chatRobot" v-if="isGenerating()">-->
      <!--              <el-image-->
      <!--                  class="chatRobotAvatar"-->
      <!--                  :src="robots[robotActive].avatar"-->
      <!--              ></el-image>-->
      <!--              <div class="chatRobotMessage">-->
      <!--                <v-md-preview-->
      <!--                    class="chatRobotMessageText chatMessageText"-->
      <!--                    :text="-->
      <!--                          loadingTime % 3 === 0-->
      <!--                            ? '正在分析中.'-->
      <!--                            : loadingTime % 3 === 1-->
      <!--                            ? '正在分析中. .'-->
      <!--                            : '正在分析中. . .'-->
      <!--                        "-->
      <!--                >-->
      <!--                </v-md-preview>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <el-tooltip-->
      <!--            content="回到底部"-->
      <!--            placement="top-start"-->
      <!--            effect="light"-->
      <!--        >-->
      <!--          <el-button-->
      <!--              class="scrollToBottomButton"-->
      <!--              :icon="ArrowDownBold"-->
      <!--              circle-->
      <!--              @click="scrollToBottom"-->
      <!--          ></el-button>-->
      <!--        </el-tooltip>-->
      <!--      </el-scrollbar>-->

      <!--      <div-->
      <!--          class="inputArea1"-->
      <!--          v-if="!isEmpty(robots) && robots[robotActive].frontFlag === 3"-->
      <!--      >-->
      <!--        <el-upload-->
      <!--            class="upload-demo"-->
      <!--            action="/api/file/uploadPicture?bucketType=1"-->
      <!--            :show-file-list="false"-->
      <!--            :on-remove="removeFile"-->
      <!--            :on-success="fileUpload"-->
      <!--        >-->
      <!--          <el-tooltip-->
      <!--              content="上传附件"-->
      <!--              placement="top-start"-->
      <!--              effect="light"-->
      <!--          >-->
      <!--            <el-button class="fileUploadButton" :icon="Folder" circle></el-button>-->
      <!--          </el-tooltip>-->
      <!--        </el-upload>-->
      <!--        <div class="input">-->
      <!--          &lt;!&ndash;          <el-button v-for="robots[robotsActive].p></el-button>&ndash;&gt;-->
      <!--          <div class="prompts">-->
      <!--            <el-button-->
      <!--                class="prompt"-->
      <!--                v-for="(item, value) in robots[robotActive].prompts"-->
      <!--                @click="chatPrompts(item)"-->
      <!--            >-->
      <!--              {{ item }}-->
      <!--            </el-button>-->
      <!--          </div>-->
      <!--          <el-tooltip-->
      <!--              :content="file.fileName + '.' + file.fileType"-->
      <!--              placement="top"-->
      <!--              effect="light"-->
      <!--              v-if="!isEmpty(file)"-->
      <!--          >-->
      <!--            <div class="file">-->
      <!--              <el-image-->
      <!--                  class="picture"-->
      <!--                  :src="file.fileUrl"-->
      <!--                  fit="contain"-->
      <!--                  v-if="['jpg', 'png'].indexOf(file.fileType) !== -1"-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></el-image>-->
      <!--              <svg-icon-->
      <!--                  class="fileSvg"-->
      <!--                  icon-class="csv"-->
      <!--                  v-else-if="['csv'].indexOf(file.fileType) !== -1"-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></svg-icon>-->
      <!--              <svg-icon-->
      <!--                  class="fileSvg"-->
      <!--                  icon-class="excel"-->
      <!--                  v-else-if="['xlsx', 'xls'].indexOf(file.fileType) !== -1"-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></svg-icon>-->
      <!--              <svg-icon-->
      <!--                  class="fileSvg"-->
      <!--                  icon-class="mp4"-->
      <!--                  v-else-if="['mp4'].indexOf(file.fileType) !== -1"-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></svg-icon>-->
      <!--              <svg-icon-->
      <!--                  class="fileSvg"-->
      <!--                  icon-class="pdf"-->
      <!--                  v-else-if="['pdf'].indexOf(file.fileType) !== -1"-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></svg-icon>-->
      <!--              <svg-icon-->
      <!--                  class="fileSvg"-->
      <!--                  icon-class="ppt"-->
      <!--                  v-else-if="['ppt'].indexOf(file.fileType) !== -1"-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></svg-icon>-->
      <!--              <svg-icon-->
      <!--                  class="fileSvg"-->
      <!--                  icon-class="rar"-->
      <!--                  v-else-if="['rar'].indexOf(file.fileType) !== -1"-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></svg-icon>-->
      <!--              <svg-icon-->
      <!--                  class="fileSvg"-->
      <!--                  icon-class="txt"-->
      <!--                  v-else-if="['txt'].indexOf(file.fileType) !== -1"-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></svg-icon>-->
      <!--              <svg-icon-->
      <!--                  class="fileSvg"-->
      <!--                  icon-class="word"-->
      <!--                  v-else-if="['docx', 'doc'].indexOf(file.fileType) !== -1"-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></svg-icon>-->
      <!--              <svg-icon-->
      <!--                  class="fileSvg"-->
      <!--                  icon-class="zip"-->
      <!--                  v-else-if="['zip'].indexOf(file.fileType) !== -1"-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></svg-icon>-->
      <!--              <svg-icon-->
      <!--                  class="fileSvg"-->
      <!--                  icon-class="unknownFile"-->
      <!--                  v-else-->
      <!--                  @click="-->
      <!--                        downloadFile(-->
      <!--                          file.fileUrl,-->
      <!--                          file.fileName + '.' + file.fileType-->
      <!--                        )-->
      <!--                      "-->
      <!--              ></svg-icon>-->
      <!--              <svg-icon-->
      <!--                  class="deleteFile"-->
      <!--                  icon-class="fork"-->
      <!--                  @click="removeFile"-->
      <!--              ></svg-icon>-->
      <!--            </div>-->
      <!--          </el-tooltip>-->
      <!--          <el-input-->
      <!--              class="chatInput"-->
      <!--              v-model="chatInput"-->
      <!--              :rows="2"-->
      <!--              :autosize="{ minRows: 2, maxRows: 8 }"-->
      <!--              type="textarea"-->
      <!--              resize="none"-->
      <!--              placeholder="开始你的提问吧"-->
      <!--              @keydown="longTextDialogueSubmit"-->
      <!--          />-->
      <!--        </div>-->
      <!--        <el-button class="sendButton" @click="longTextDialogueSubmit">-->
      <!--          <el-tooltip-->
      <!--              content="发送"-->
      <!--              placement="top-start"-->
      <!--              effect="light"-->
      <!--          >-->
      <!--            <svg-icon class="sendButtonIcon" icon-class="send"></svg-icon>-->
      <!--          </el-tooltip>-->
      <!--        </el-button>-->
      <!--      </div>-->
      <!--      <div v-if="!isEmpty(robots) && robots[robotActive].frontFlag === 3"-->
      <!--           style="width: 100%;height: 20px;"></div>-->
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
import logo from "@/assets/pictures/logo.png";
import F2F2F2_Square from "@/assets/pictures/F2F2F2_Square.png";
import C9C9C9_Square from "@/assets/pictures/C9C9C9_Square.png";
import F2F2F2_BottomLeftAngledTriangle from "@/assets/pictures/F2F2F2_BottomLeftAngledTriangle.png";
import C9C9C9_TopRightAngledTriangle from "@/assets/pictures/C9C9C9_TopRightAngledTriangle.png";

import {ref} from "vue";
import {fetchEventSource} from "@microsoft/fetch-event-source";

import {
  ArrowLeftBold,
  ArrowRightBold,
  ArrowDownBold,
  Folder,
} from "@element-plus/icons-vue";
import {parse, HtmlGenerator} from "latex.js";

import {
  addSession,
  deleteSession,
  getMessageList,
  getWorkbenchRobotList,
  getSessionList,
  longTextDialogueSubmit,
  longTextDialogueQuery,
  uploadFile, getRobotInformationById
} from "@/apis/chat";
import {contactUs, getUserByToken} from "@/apis/user";

import {isEmpty} from "@/utils/common";

import SvgIcon from "@/components/svgIcon/index.vue";
import SuspendedBall from "@/components/suspendedBall";
import axios from "axios";

export default {
  name: "Workbench",
  components: {SvgIcon, SuspendedBall},
  data() {
    return {
      BoyAvatar: BoyAvatar,
      GirlAvatar: GirlAvatar,
      logo: logo,
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

      robots: [],
      sessions: [],
      messages: [],

      chatInput: "",
      imageQuestiuonText: "",
      file: null,

      contactUsForm: {},

      contactUsDialogVis: false,

      answeringFlag: false,
      answeringMessage: "",
      answeringIndex: 0,
      answeringClock: null,

      imageAnalyzeFlag: false,

      sendQuestionFlag: false,
      sendQuestionMessage: "",
      sendQuestionIndex: 0,
      sendQuestionClock: null,

      longTextDialogueExecuteEntitys: [],

      loadingTime: 0,
      loadingClock: null,
      loadingFlag: false,

      sessionMenuShow: true,

      robotActive: 0,
      sessionActive: 0,

      initFlag: false,

      longRobotFlag: false,
      longRobot: {}
    };
  },
  setup() {
    const chatArea = ref(null);
    const chatAreaInner = ref(null);

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
      scrollToBottom,
    };
  },
  async created() {
    // this.token = localStorage.getItem("token");
    // if (isEmpty(this.token)) {
    //   this.$router.push("/home");
    //   this.$message.error("请先登录");
    // }

    this.longTextDialogueExecuteEntitys =
        this.$store.state.longTextDialogueExecuteEntitys;
    setInterval(() => {
      this.longTextDialogueQuery();
    }, 1000 * 60);

    await this.getUserByToken();
    await this.getRobotList();

    this.initContactUsForm();

    this.loadingTime = 0;
    this.loadingFlag = false;
    this.loadingClock = setInterval(() => {
      this.loadingTime = this.loadingTime + 1;
      if (this.loadingTime / 2 > Math.random() * 5 + 15) {
        this.loadingFlag = true;
      }
    }, 500);

    this.initFlag = true;
  },
  mounted() {
    // this.loadLatexJS().then(() => {
    // });
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
      addSession(this.robots[this.robotActive].id)
          .then((res) => {
            if (res.data.code === 200) {
              this.sessionActive = 0;
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
    deleteSession(index) {
      deleteSession(this.sessions[index].id)
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
    getRobotList() {
      this.answeringFlag = true;
      return getWorkbenchRobotList()
          .then((res) => {
            if (res.data.code === 200) {
              res.data.data.sort((o1, o2) => {
                return o1.sort - o2.sort;
              });
              this.robots = [];
              for (let robot in res.data.data) {
                this.robots.push({
                  id: res.data.data[robot]["bot_id"],
                  avatar: res.data.data[robot]["bot_avatar"],
                  name: res.data.data[robot]["bot_name"],
                  description: res.data.data[robot]["description"],
                  handle: res.data.data[robot]["bot_handle"],
                  type: res.data.data[robot]["bot_type"],
                  prompts: res.data.data[robot]["prompts"],
                  attachRobotId: res.data.data[robot]["attach_bot_id"],
                  frontFlag: res.data.data[robot]["bot_front_flag"]
                });
              }
              this.answeringFlag = false;
              this.getSessionList();
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
    getSessionList() {
      this.answeringFlag = true;
      return getSessionList(this.robots[this.robotActive].id)
          .then((res) => {
            if (res.data.code === 200) {
              if (isEmpty(res.data.data)) {
                this.answeringFlag = false;
                this.addSession();
              } else {
                this.sessions = [];
                for (let i in res.data.data) {
                  this.sessions.push({
                    id: res.data.data[i]["session_id"],
                    botId: res.data.data[i]["bot_id"],
                    userId: res.data.data[i]["user_id"],
                    createTime: res.data.data[i]["created_time"],
                    updateTime: res.data.data[i]["updated_time"],
                    message: isEmpty(res.data.data[i]["message"])
                        ? null
                        : {
                          id: res.data.data[i]["message"]["message_id"],
                          sessionId: res.data.data[i]["message"]["session_id"],
                          role: res.data.data[i]["message"]["role"],
                          content: res.data.data[i]["message"]["content"],
                          fileType: res.data.data[i]["message"]["file_type"],
                          fileName: res.data.data[i]["message"]["file_name"],
                          fileUrl: res.data.data[i]["message"]["file_url"],
                          createTime: res.data.data[i]["message"]["created_time"],
                        },
                  });
                }
                this.sessions.sort((o1, o2) => {
                  return new Date(o2.createTime) - new Date(o1.createTime);
                });
                this.answeringFlag = false;
                this.sessionActive = Math.min(
                    this.sessions.length - 1,
                    this.sessionActive
                );
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
      return getMessageList(this.sessions[this.sessionActive].id)
          .then((res) => {
            if (res.data.code === 200) {
              if (this.longRobotFlag) {
                this.messages = [
                  {
                    role: "assistant",
                    contentType: "text",
                    content: this.longRobot.description,
                  },
                ];
              } else {
                this.messages = [
                  {
                    role: "assistant",
                    contentType: "text",
                    content: this.robots[this.robotActive].description,
                  },
                ];
              }

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
              console.log(this.messages[this.messages.length - 1].content)
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
    chat(e) {
      if (isEmpty(e.keyCode) || (!e.shiftKey && e.keyCode === 13)) {
        e.cancelBubble = true;
        e.stopPropagation();
        e.preventDefault();
      } else {
        return;
      }

      if (this.answeringFlag) {
        return;
      }

      if (isEmpty(this.file) && isEmpty(this.chatInput)) {
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
          bot_id: this.robots[this.robotActive].id,
          session_id: this.sessions[this.sessionActive].id,
          bot_handle: this.robots[this.robotActive].handle,
          content: this.chatInput,
          file_type: isEmpty(this.file) ? null : this.file.fileType,
          file_name: isEmpty(this.file) ? null : this.file.fileName,
          file_url: isEmpty(this.file) ? null : this.file.fileUrl,
        }),
        signal: ctrl.signal,
        openWhenHidden: true,
        onmessage: (message) => {
          if (message.event === "conversation") {
            this.answeringMessage += message.data;
          } else if (message.event === "done") {
          } else if (message.event === "all") {
            this.answeringFlag = false;
            clearInterval(this.answeringClock);
            this.messages.push({
              role: "assistant",
              contentType: "text",
              content: message.data.replaceAll("\\n", "\n")
                  .replaceAll("\\\\", "\\")
                  .replaceAll('\\"', '\"')
                  .replace(/\\u([0-9A-Fa-f]{4})/g, function (match, group) {
                    return String.fromCharCode(parseInt(group, 16));
                  })
            });
          }
        },
        onclose: () => {
          this.answeringFlag = false;
          clearInterval(this.answeringClock);
        },
        onerror: (err) => {
          this.answeringFlag = false;
          clearInterval(this.answeringClock);
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
    chatLong(e) {
      if (isEmpty(e.keyCode) || (!e.shiftKey && e.keyCode === 13)) {
        e.cancelBubble = true;
        e.stopPropagation();
        e.preventDefault();
      } else {
        return;
      }

      if (this.answeringFlag) {
        return;
      }

      if (isEmpty(this.file) && isEmpty(this.chatInput)) {
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
          bot_id: this.robots[this.robotActive].attachRobotId,
          session_id: this.sessions[this.sessionActive].id,
          bot_handle: 2,
          content: this.chatInput,
          file_type: isEmpty(this.file) ? null : this.file.fileType,
          file_name: isEmpty(this.file) ? null : this.file.fileName,
          file_url: isEmpty(this.file) ? null : this.file.fileUrl,
        }),
        signal: ctrl.signal,
        openWhenHidden: true,
        onmessage: (message) => {
          if (message.event === "conversation") {
            this.answeringMessage += message.data;
          } else if (message.event === "done") {
          } else if (message.event === "all") {
            this.answeringFlag = false;
            clearInterval(this.answeringClock);
            this.messages.push({
              role: "assistant",
              contentType: "text",
              content: message.data.replaceAll("\\n", "\n")
                  .replaceAll("\\\\", "\\")
                  .replaceAll('\\"', '\"')
                  .replaceAll("#", "\\#").replace(/\\u([0-9A-Fa-f]{4})/g, function (match, group) {
                    return String.fromCharCode(parseInt(group, 16));
                  })
            });
          }
        },
        onclose: () => {
          this.answeringFlag = false;
          clearInterval(this.answeringClock);
        },
        onerror: (err) => {
          this.answeringFlag = false;
          clearInterval(this.answeringClock);
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
    // chatPrompts(prompt) {
    //   if (this.answeringFlag) {
    //     return
    //   }
    //
    //   this.answeringFlag = true
    //   this.answeringMessage = ""
    //   this.answeringIndex = 0
    //   this.answeringClock = setInterval(() => {
    //     this.answeringIndex = Math.min(this.answeringIndex + 1, this.answeringMessage.length)
    //   }, 20)
    //
    //   this.loadingTime = 0
    //   this.loadingFlag = false
    //   this.loadingClock = setInterval(() => {
    //     this.loadingTime = this.loadingTime + 1;
    //     if (this.loadingTime / 2 > Math.random() * 5 + 15) {
    //       this.loadingFlag = true
    //     }
    //   }, 500)
    //
    //   this.messages.push({
    //     role: "user",
    //     content: prompt,
    //   })
    //
    //   this.$nextTick(() => {
    //     this.scrollToBottom()
    //   })
    //
    //   const ctrl = new AbortController();
    //   fetchEventSource('/api/chat/agent', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': localStorage.getItem("token")
    //     },
    //     body: JSON.stringify({
    //       bot_id: this.robots[this.robotActive].id,
    //       session_id: this.sessions[this.sessionActive].id,
    //       bot_handle: this.robots[this.robotActive].handle,
    //       content: prompt,
    //     }),
    //     signal: ctrl.signal,
    //     openWhenHidden: true,
    //     onmessage: (message) => {
    //       if (message.event === 'conversation') {
    //         this.answeringMessage += isEmpty(message.data) ? '' : message.data
    //       } else if (message.event === "done") {
    //       } else if (message.event === 'all') {
    //         this.answeringFlag = false
    //         clearInterval(this.answeringClock)
    //         this.loadingTime = 0
    //         this.loadingFlag = false
    //         clearInterval(this.loadingClock)
    //         this.messages.push({
    //           role: "assistant",
    //           contentType: 'text',
    //           content: message.data.replaceAll("\\n", "\n")
    //         })
    //       }
    //     },
    //     onclose: () => {
    //       this.answeringFlag = false
    //       clearInterval(this.answeringClock)
    //       this.loadingTime = 0
    //       this.loadingFlag = false
    //       clearInterval(this.loadingClock)
    //     },
    //     onerror: (err) => {
    //       this.answeringFlag = false
    //       clearInterval(this.answeringClock)
    //       this.loadingTime = 0
    //       this.loadingFlag = false
    //       clearInterval(this.loadingClock)
    //       this.messages.push({
    //         role: "assistant",
    //         contentType: 'text',
    //         content: '系统异常，请联系管理员'
    //       })
    //       console.log(err)
    //       this.$message.error('系统异常，请联系管理员')
    //       throw err
    //     }
    //   });
    // },
    chatPrompts(prompt) {
      this.chatInput = prompt;
    },
    imageAnalyze() {
      this.imageAnalyzeFlag = true;
      this.imageQuestiuonText = "";
      const ctrl = new AbortController();
      fetchEventSource("/api/chat/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          bot_id: this.robots[this.robotActive].id,
          session_id: this.sessions[this.sessionActive].id,
          bot_handle: 1,
          file_type: isEmpty(this.file) ? null : this.file.fileType,
          file_name: isEmpty(this.file) ? null : this.file.fileName,
          file_url: isEmpty(this.file) ? null : this.file.fileUrl,
        }),
        signal: ctrl.signal,
        openWhenHidden: true,
        onmessage: (message) => {
          console.log(message);
          if (message.event === "conversation") {
            this.imageQuestiuonText += message.data;
          } else if (message.event === "done") {
          } else if (message.event === "all") {
            this.imageQuestiuonText = message.data
                .replaceAll("\\n", "\n")
                .replaceAll("\\\\", "\\")
                .replaceAll("#", "\\#");
            this.imageAnalyzeFlag = false;
          }
        },
        onclose: () => {
          this.imageAnalyzeFlag = false;
        },
        onerror: (err) => {
          this.imageAnalyzeFlag = false;
          console.log(err);
          this.$message.error("系统异常，请联系管理员");
          throw err;
        },
      });
    },
    sendQuestion(e) {
      if (isEmpty(e.keyCode) || (!e.shiftKey && e.keyCode === 13)) {
        e.cancelBubble = true;
        e.stopPropagation();
        e.preventDefault();
      } else {
        return;
      }

      if (
          this.answeringFlag ||
          this.sendQuestionFlag ||
          this.imageAnalyzeFlag
      ) {
        return;
      }

      if (isEmpty(this.imageQuestiuonText) || this.imageQuestiuonText === '\n') {
        this.$message.success("题目不能为空");
        this.imageQuestiuonText = ""
        return;
      }
      let sendQuestionMessageTemp = ""
      this.sendQuestionFlag = true;
      this.sendQuestionMessage = "";
      this.sendQuestionIndex = 0;
      this.sendQuestionClock = setInterval(() => {
        this.sendQuestionIndex = Math.min(
            this.sendQuestionIndex + 1,
            this.sendQuestionMessage.length
        );
      }, 20);

      const ctrl = new AbortController();
      fetchEventSource("/api/chat/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          bot_id: this.robots[this.robotActive].id,
          session_id: this.sessions[this.sessionActive].id,
          bot_handle: 1,
          content: this.imageQuestiuonText,
        }),
        signal: ctrl.signal,
        openWhenHidden: true,
        onmessage: (message) => {
          if (message.event === "conversation") {
            sendQuestionMessageTemp += isEmpty(message.data)
                ? ""
                : message.data;
            this.sendQuestionMessage = this.latexToMarkdown1(sendQuestionMessageTemp)
          } else if (message.event === "done") {
          } else if (message.event === "all") {
            this.sendQuestionFlag = false;
            clearInterval(this.sendQuestionClock);
            sendQuestionMessageTemp = message.data.substring(1, message.data.length - 1)
                .replaceAll("\\n", "\n")
                .replaceAll("\\\\", "\\")
                .replaceAll("#", "\\#");
            this.sendQuestionMessage = this.latexToMarkdown(sendQuestionMessageTemp)
            // this.$nextTick().then(() => {
            //   this.renderLatex(
            //       this.$refs.chatRobotMessageText,
            //       this.sendQuestionMessage
            //   );
            // });
          }
        },
        onclose: () => {
          this.sendQuestionFlag = false;
          clearInterval(this.sendQuestionClock);
        },
        onerror: (err) => {
          this.sendQuestionFlag = false;
          clearInterval(this.sendQuestionClock);
          this.loadingTime = 0;
          this.loadingFlag = false;
          console.log(err);
          this.$message.error("系统异常，请联系管理员");
          throw err;
        },
      });
    },
    latexToMarkdown1(text) {
      console.log(text)
      // 匹配行内公式 \( ... \)
      const inlineLatex = /\\\((.*?)\\\)/gs;
      // 匹配块级公式 \[ ... \]
      const blockLatex = /\\\[(.*?)\\\]/gs;
      // 替换行内公式为 Markdown 格式
      text = text.replace(inlineLatex, (match, p1) => `$${p1}$`);
      console.log(text)
      // 替换块级公式为 Markdown 格式
      text = text.replace(blockLatex, (match, p1) => `\n$$\n${p1}\n$$\n`);
      console.log(text)

      // 替换 LaTeX 中的特殊符号，去掉多余的转义符
      text = text.replace(/\\,/g, '');  // 删除 LaTeX 的空格符号
      text = text.replace(/\\/g, '');   // 移除反斜杠

      // 替换常见数学函数符号，确保其符合 LaTeX 格式
      const commonSymbols = {
        'sin': '\\sin ',
        'cos': '\\cos ',
        'tan': '\\tan ',
        'log': '\\log ',
        'ln': '\\ln ',
        'exp': '\\exp ',
        'sqrt': '\\sqrt ',
        'frac': '\\frac ',
        'sum': '\\sum ',
        'prod': '\\prod ',
        'int': '\\int ',
        'cdot': '\\cdot ',
        'quad': '\\quad ',
        "left": '',
        "right": '',
        "approx": '\\approx ',
        "to": '\\to ',
        "boxed": '\\boxed ',
        "limlimits": '\\lim\\limits'
      };
      for (const [key, value] of Object.entries(commonSymbols)) {
        const regex = new RegExp(`${key}`, 'g');
        text = text.replace(regex, value);
      }
      text = text.replace(/(\$\$?)([^$]+?)\1/g, (match, delimiter, content) => {
        // 如果是单个 $ 包裹的内容，进行 trim()
        if (delimiter === "$$") {
          return delimiter + content + delimiter; // 不做修改，保留 $$ 包裹
        } else {
          return delimiter + content.trim() + delimiter; // 对 $ 包裹的内容进行 trim()
        }
      });
      return text;
    },
    latexToMarkdown(text) {
      console.log(text)
      // 匹配行内公式 \( ... \)
      const inlineLatex = /\\\((.*?)\\\)/gs;
      // 匹配块级公式 \[ ... \]
      const blockLatex = /\\\[(.*?)\\\]/gs;
      // 替换行内公式为 Markdown 格式
      text = text.replace(inlineLatex, (match, p1) => `$${p1}$`);
      console.log(text)
      // 替换块级公式为 Markdown 格式
      text = text.replace(blockLatex, (match, p1) => `$$${p1}$$`);
      console.log(text)

      // 替换 LaTeX 中的特殊符号，去掉多余的转义符
      text = text.replace(/\\,/g, '');  // 删除 LaTeX 的空格符号
      text = text.replace(/\\/g, '');   // 移除反斜杠

      // 替换常见数学函数符号，确保其符合 LaTeX 格式
      const commonSymbols = {
        'sin': '\\sin',
        'cos': '\\cos',
        'tan': '\\tan',
        'log': '\\log',
        'ln': '\\ln',
        'exp': '\\exp',
        'sqrt': '\\sqrt',
        'frac': '\\frac',
        'sum': '\\sum',
        'prod': '\\prod',
        'int': '\\int',
        'cdot': '\\cdot',
        'quad': '\\quad',
        "left": '',
        "right": '',
        "approx": '\\approx',
        "to": '\\to',
        "boxed": '\\boxed',
        "limlimits": '\\lim\\limits'
      };
      for (const [key, value] of Object.entries(commonSymbols)) {
        const regex = new RegExp(`${key}`, 'g');
        text = text.replace(regex, value);
      }
      text = text.replace(/(\$\$?)([^$]+?)\1/g, (match, delimiter, content) => {
        // 如果是单个 $ 包裹的内容，进行 trim()
        if (delimiter === "$$") {
          return delimiter + content + delimiter; // 不做修改，保留 $$ 包裹
        } else {
          return delimiter + content.trim() + delimiter; // 对 $ 包裹的内容进行 trim()
        }
      });
      return text;
    },
    longTextDialogueSubmit(e) {
      if (!this.isGenerating()) {
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

        this.messages.push({
          role: "user",
          content: this.chatInput,
          fileType: isEmpty(this.file) ? null : this.file.fileType,
          fileName: isEmpty(this.file) ? null : this.file.fileName,
          fileUrl: isEmpty(this.file) ? null : this.file.fileUrl,
        });
        longTextDialogueSubmit(
            this.robots[this.robotActive].id,
            this.sessions[this.sessionActive].id,
            this.robots[this.robotActive].handle,
            this.chatInput,
            isEmpty(this.file) ? null : this.fileType,
            isEmpty(this.file) ? null : this.file.fileName,
            isEmpty(this.file) ? null : this.file.fileUrl
        )
            .then((res) => {
              if (res.data.code === 200) {
                this.longTextDialogueExecuteEntitys.push({
                  robotId: this.robots[this.robotActive].id,
                  sessionId: this.sessions[this.sessionActive].id,
                  executeId: res.data.data["execute_id"],
                  count: 0,
                });
                this.$store.commit(
                    "setLongTextDialogueExecuteEntitys",
                    this.longTextDialogueExecuteEntitys
                );
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("系统异常，请联系管理员");
            });
        this.chatInput = ""
        this.scrollToBottom()
      }
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
                if (
                    this.sessions[this.sessionActive].id ===
                    this.longTextDialogueExecuteEntitys[i].sessionId
                ) {
                  this.getMessageList();
                }
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
    toLongTextRobot() {
      if (this.messages.length % 2 === 1) {
        let tempInput = this.messages.length !== 1 ? this.messages[this.messages.length - 1].content : ''
        this.answeringFlag = true;
        getRobotInformationById(this.robots[this.robotActive].attachRobotId).then((res1) => {
          this.longRobot = res1.data.data
          addSession(this.robots[this.robotActive].attachRobotId)
              .then((res) => {
                if (res.data.code === 200) {
                  this.sessionActive = 0;
                  console.log(this.sessionActive)
                  getSessionList(this.robots[this.robotActive].attachRobotId)
                      .then((res) => {
                        if (res.data.code === 200) {
                          if (isEmpty(res.data.data)) {
                            this.answeringFlag = false;
                            this.addSession();
                          } else {
                            this.sessions = [];
                            for (let i in res.data.data) {
                              this.sessions.push({
                                id: res.data.data[i]["session_id"],
                                botId: res.data.data[i]["bot_id"],
                                userId: res.data.data[i]["user_id"],
                                createTime: res.data.data[i]["created_time"],
                                updateTime: res.data.data[i]["updated_time"],
                                message: isEmpty(res.data.data[i]["message"])
                                    ? null
                                    : {
                                      id: res.data.data[i]["message"]["message_id"],
                                      sessionId: res.data.data[i]["message"]["session_id"],
                                      role: res.data.data[i]["message"]["role"],
                                      content: res.data.data[i]["message"]["content"],
                                      fileType: res.data.data[i]["message"]["file_type"],
                                      fileName: res.data.data[i]["message"]["file_name"],
                                      fileUrl: res.data.data[i]["message"]["file_url"],
                                      createTime: res.data.data[i]["message"]["created_time"],
                                    },
                              });
                            }
                            this.sessions.sort((o1, o2) => {
                              return new Date(o2.createTime) - new Date(o1.createTime);
                            });
                            this.answeringFlag = false;
                            this.sessionActive = Math.min(
                                this.sessions.length - 1,
                                this.sessionActive
                            );
                            this.answeringFlag = true;
                            getMessageList(this.sessions[this.sessionActive].id)
                                .then((res) => {
                                  if (res.data.code === 200) {

                                    this.messages = [
                                      {
                                        role: "assistant",
                                        contentType: "text",
                                        content: this.longRobot.description,
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
                                    console.log(this.messages[this.messages.length - 1].content)
                                    this.answeringFlag = false;
                                    this.longRobotFlag = true;
                                    this.$nextTick(() => {
                                      this.scrollToBottom();
                                    });
                                    this.chatInput = tempInput
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
                } else {
                  this.$message.error(res.data.message);
                }
              })
              .catch((err) => {
                console.log(err);
                this.$message.error("系统异常，请联系管理员");
              });
        })
      }
    },
    toOutlineRobot() {
      this.longRobotFlag = false
      this.getSessionList()
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

    share() {
      var copyVal = document.getElementById("copyVal");
      copyVal.select();
      document.execCommand("copy");
      this.$message.success("分享链接已复制到剪切板");
    },

    isGenerating() {
      for (let i = 0; i < this.longTextDialogueExecuteEntitys.length; i++) {
        if (
            this.longTextDialogueExecuteEntitys[i].sessionId ===
            this.sessions[this.sessionActive].id
        ) {
          return true;
        }
      }
      return false;
    },

    closeSessionMenu() {
      this.sessionMenuShow = false;
    },
    openSessionMenu() {
      this.sessionMenuShow = true;
    },

    toHome() {
      this.$router.push("/home");
    },
    toLearningCornerBook() {
      this.$router.push("/learningCornerBook");
    },
    toPersonalCenter() {
      this.$router.push("/personalCenter");
    },

    selectRobotMenu(index) {

      this.robotActive = parseInt(index);
      this.sessionActive = 0;
      this.chatInput = "";
      this.file = null;
      this.getSessionList();
    },
    selectSessionMenu(index) {
      this.sessionActive = parseInt(index);
      this.getMessageList();
      this.answeringFlag = false;
      this.answeringMessage = "";
      this.sendQuestionFlag = false;
      this.sendQuestionMessage = "";
      this.imageAnalyzeFlag = false;
      this.imageQuestiuonText = "";
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

    loadLatexJS() {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "./latex.js/dist/latex.js";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    },
    renderLatex(html, content) {
      try {
        console.log(content);
        html.innerHTML = "";
        const generator = new HtmlGenerator({hyphenate: false});
        const document = parse(content, {generator});
        html.appendChild(generator.domFragment());
      } catch (e) {
        console.log(e);
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

    isEmpty(field) {
      return isEmpty(field);
    },

    handlePaste(event) {
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;

      if (!items || items.length === 0) {
        this.$message.error("当前浏览器不支持");
        return;
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        this.$message.error("粘贴内容非图片");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      axios.post('/api/file/uploadPicture?bucketType=1', formData).then((res) => {
        this.fileUpload(res.data, null, null)
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      })
    },
  },
};
</script>

<style scoped>
#workbench {
  width: 100%;
  height: 100%;
}

#workbench .robotMenu {
  display: inline-block;

  vertical-align: top;

  width: 120px;
  height: 100%;

  border: 0;

  background: #e6e6e6;
}

#workbench .robotMenu .robotMenuScrollbar {
  width: 100%;
  height: calc(100% - 100px - 40px);
}

#workbench .robotMenu .robotMenuScrollbar .robotMenuItem {
  height: auto;

  padding: 5px 20px 5px 20px;
}

#workbench
.robotMenu
.robotMenuScrollbar
.robotMenuItem
.robotMenuItemContainer
.robotMenuItemImage {
  width: 80px;
  height: 80px;
}

#workbench
.robotMenu
.robotMenuScrollbar
.robotMenuItem
.robotMenuItemContainer
.robotMenuItemTitle {
  width: 100%;

  line-height: 20px;

  font-size: 12px;

  text-align: center;

  white-space: normal;
  word-break: break-all;
  overflow: hidden;
}

#workbench .robotMenu .logo {
  margin: 20px 0 20px 0;

  text-align: center;
}

#workbench .robotMenu .logo .schoolName {
  font-size: 14px;
  font-weight: bold;

  line-height: 20px;
}

#workbench .robotMenu .logo .logoImage {
  width: 80px;
  height: 60px;

  cursor: pointer;
}

#workbench .sessionMenu {
  display: inline-block;

  vertical-align: top;

  width: 200px;
  height: 100%;

  border: 0;

  text-align: center;

  background: #c9c9c9;
}

#workbench .sessionMenu .sessionMenuScrollbar {
  width: 100%;
  height: calc(100% - 60px - 120px);
}

#workbench .sessionMenu .sessionMenuScrollbar .sessionMenuItem {
  display: flex;

  justify-content: space-between;
}

#workbench
.sessionMenu
.sessionMenuScrollbar
.sessionMenuItem
.sessionMenuItemTitle {
  width: calc(100% - 30px);

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 18px;
}

#workbench
.sessionMenu
.sessionMenuScrollbar
.sessionMenuItem
.sessionMenuDeleteIcon {
  width: 20px;
  height: 20px;
}

#workbench .sessionMenu .addSessionButton {
  margin: 10px 0 0 0;

  width: 80%;
  height: 50px;

  border: 2px dotted #000000;

  font-size: 20px;
  font-family: "Source Han Serif" !important;
}

#workbench .sessionMenuControllerButton {
  position: absolute;

  width: 40px;
  height: 40px;

  z-index: 1;
}

#workbench .sessionMenuControllerButtonClose {
  top: calc(50% - 40px / 2);
  left: calc(120px - 40px / 2);
}

#workbench .sessionMenuControllerButtonOpen {
  top: calc(50% - 40px / 2);
  left: calc(120px + 200px - 40px / 2);
}

#workbench .sessionMenu .user {
  margin: 30px 20px 30px 20px;

  width: calc(100% - 20px * 2);
  height: 60px;

  text-align: left;

  cursor: pointer;
}

#workbench .sessionMenu .user .userAvatar {
  display: inline-block;

  vertical-align: top;

  width: 60px;
  height: 60px;

  border-radius: 50%;
}

#workbench .sessionMenu .user .userInformation {
  display: inline-block;

  margin: 0 0 0 10px;

  vertical-align: top;

  width: calc(100% - 70px);

  height: 60px;
}

#workbench .sessionMenu .user .userInformation .userId {
  width: 100%;
  height: 30px;

  line-height: 30px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

#workbench .sessionMenu .user .userInformation .userName {
  width: 100%;
  height: 30px;

  line-height: 30px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

#workbench .mainContainer {
  display: inline-flex;
  flex-flow: column;

  position: relative;

  vertical-align: top;

  height: 100%;
}

#workbench .mainContainerShort {
  width: calc(100% - 120px - 200px);
}

#workbench .mainContainerLong {
  width: calc(100% - 120px);
}

#workbench .mainContainer .patterns {
  position: relative;

  width: 100%;
  height: 60px;
}

#workbench .mainContainer .patterns .patternLeftRectangle {
  position: absolute;

  top: 0;
  left: 0;
}

#workbench .mainContainer .patterns .patternRightRectangle {
  position: absolute;

  top: 0;
  right: 0;
}

#workbench .mainContainer .patterns .patternRectangleUnactive {
  width: calc(25% - 60px / 2);
  height: 100%;

  cursor: pointer;
}

#workbench .mainContainer .patterns .patternRectangleActive {
  width: calc(75% - 60px / 2);
  height: 100%;
}

#workbench .mainContainer .patterns .patternAngledTriangle {
  position: absolute;

  top: 0;

  width: 60px;
  height: 60px;
}

#workbench .mainContainer .patterns .patternBottomLeftAngledTriangleUnactive {
  left: calc(25% - 60px / 2);

  cursor: pointer;
}

#workbench .mainContainer .patterns .patternBottomLeftAngledTriangleActive {
  left: calc(75% - 60px / 2);
}

#workbench .mainContainer .patterns .patternTopRightAngledTriangleUnactive {
  right: calc(25% - 60px / 2);
}

#workbench .mainContainer .patterns .patternTopRightAngledTriangleActive {
  right: calc(75% - 60px / 2);
}

#workbench .mainContainer .patterns .leftTitleUnactive {
  position: absolute;

  top: 0;
  left: 0;

  width: calc(25% - 60px / 2);
  height: 60px;

  font-size: 20px;

  line-height: 60px;

  text-align: center;

  cursor: pointer;
}

#workbench .mainContainer .patterns .rightTitleActive {
  position: absolute;

  top: 0;
  right: 0;

  width: calc(75% - 60px / 2);
  height: 60px;

  font-size: 20px;

  line-height: 60px;

  text-align: center;

  user-select: none;
}

#workbench .mainContainer .patterns .shareIcon {
  position: absolute;

  top: 5px;
  right: 5px;

  width: 50px;
  height: 50px;

  cursor: pointer;
}

#workbench .mainContainer .chatArea {
  flex: 1;
}

#workbench .mainContainer .chatArea .scrollToBottomButton {
  position: absolute;

  bottom: 0;
  left: 50%;
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow {
  padding: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatRobot {
  text-align: left;
}

#workbench
.mainContainer
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

#workbench
.mainContainer
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

#workbench
.mainContainer
.chatArea
.chatAreaInner
.chatRow
.chatRobot
.chatRobotMessage
.chatRobotMessageText {
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRow .chatUser {
  text-align: right;
}

#workbench
.mainContainer
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

#workbench
.mainContainer
.chatArea
.chatAreaInner
.chatRow
.chatUser
.chatUserMessage
.chatUserFilePicture {
  margin: 10px 10px 10px 10px;

  max-width: 300px;
  height: 100px;

  cursor: pointer;
}

#workbench
.mainContainer
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

#workbench
.mainContainer
.chatArea
.chatAreaInner
.chatRow
.chatUser
.chatUserMessage
.chatUserMessageText {
}

#workbench
.mainContainer
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

#workbench .mainContainer .chatArea .chatAreaInner .chatRowLoading {
  padding: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#workbench .mainContainer .chatArea .chatAreaInner .chatRowLoading .chatRobot {
  text-align: left;
}

#workbench
.mainContainer
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

#workbench
.mainContainer
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

#workbench /deep/ .chatMessageText .github-markdown-body {
  padding: 16px 32px 16px 32px;

  font-family: "Source Han Serif" !important;
}

#workbench /deep/ .chatMessageText .github-markdown-body p {
  margin-bottom: 0 !important;

  font-family: "Source Han Serif" !important;
}

#workbench .mainContainer .inputArea {
  position: relative;

  padding: 10px 0 10px 0;

  width: 100%;
  height: auto;
}

#workbench .mainContainer .inputArea .upload-demo {
  position: absolute;

  left: 0;
  bottom: 0;
}

#workbench .mainContainer .inputArea .upload-demo /deep/ .el-upload-list {
  position: absolute;

  bottom: 70px;
  left: 10px;

  width: 90px;
}

#workbench .mainContainer .inputArea .fileUploadButton {
  position: absolute;

  bottom: 20px;
  left: 40px;

  width: 40px;
  height: 40px;
}

#workbench .mainContainer .inputArea .input {
  margin: 0 0 0 100px;

  width: calc(100% - 100px - 120px);
}

#workbench .mainContainer .inputArea .input .prompts .prompt {
  display: block;

  margin: 0 0 4px 0;
}

#workbench .mainContainer .inputArea .input .file {
  display: inline-block;

  position: relative;
}

#workbench .mainContainer .inputArea .input .file .picture {
  max-width: 200px;
  height: 100px;

  cursor: pointer;
}

#workbench .mainContainer .inputArea .input .file .fileSvg {
  width: 50px;

  height: 50px;

  outline: none;

  cursor: pointer;
}

#workbench .mainContainer .inputArea .input .file .deleteFile {
  position: absolute;

  top: -6px;
  right: -6px;

  width: 12px;
  height: 12px;

  border-radius: 50%;

  background: #c9c9c9;

  cursor: pointer;
}

#workbench .mainContainer .inputArea .input .chatInput {
  width: 100%;

  font-size: 16px;
}

#workbench .mainContainer .inputArea .sendButton {
  position: absolute;

  right: 40px;
  bottom: 20px;

  padding: 0 0 0 0;

  width: 60px;
  height: 40px;

  text-align: center;
}

#workbench .mainContainer .inputArea .sendButton .sendButtonIcon {
  width: 24px;
  height: 24px;
}

#workbench .mainContainer .mathematicalModel {
  width: 100%;
  height: calc(100% - 64px);
}

#workbench .mainContainer .mathematicalModel .leftContainer {
  display: inline-flex;

  flex-flow: column;

  position: relative;

  vertical-align: top;

  width: 50%;
  height: 100%;
}

#workbench .mainContainer .mathematicalModel .leftContainer .uploadFileContainer {
  margin: 10px auto 0 auto;

  width: 80%;
}

#workbench .mainContainer .mathematicalModel .leftContainer .uploadFileContainer .dragUpload {
  display: inline-block;
  position: relative;

  width: 60%;
  height: 100px;
}

#workbench .mainContainer .mathematicalModel .leftContainer .uploadFileContainer .pasteUpload {
  display: inline-block;
  position: relative;

  vertical-align: top;

  width: calc(40% - 2px);
  height: 100px;

  border: 1px dashed #DCDFE6;
  border-radius: 6px;

  font-size: 14px;

  color: #606266;

  line-height: 100px;

  text-align: center;

  cursor: pointer;
}

#workbench .mainContainer .mathematicalModel .leftContainer .uploadFileContainer .pasteUpload:hover {
  border-color: #409EFF;
}


#workbench .mainContainer .mathematicalModel .leftContainer .uploadFileContainer .pasteUpload:focus {
  border-color: #409EFF;
}


#workbench .mainContainer .mathematicalModel .leftContainer .image {
  display: block;

  position: relative;

  margin: 20px auto 0 auto;

  max-width: 80%;
  height: 100px;
}

#workbench .mainContainer .mathematicalModel .leftContainer .imageAnalyze {
  display: block;

  position: relative;

  margin: 10px auto 0 auto;
}

#workbench .mainContainer .mathematicalModel .leftContainer .latexContainer {
  flex: 1;

  margin: 10px auto 10px auto;

  width: 80%;
  height: 0;

  overflow-y: scroll;
}

#workbench .mainContainer .mathematicalModel .leftContainer .latexInput {
  position: relative;

  margin: 10px auto 10px auto;

  width: 80%;
}

#workbench .mainContainer .mathematicalModel .leftContainer .sendQuestion {
  width: 100px;

  margin: 0 10% 0 auto;
}

#workbench .mainContainer .mathematicalModel .rightContainer {
  display: inline-block;

  vertical-align: top;

  width: calc(50% - 10px * 2 - 2px);
  height: 100%;

  border-left: 2px solid darkgrey;
}

#workbench .mainContainer .mathematicalModel .rightContainer .chatRow {
  padding: 15px 20px 15px 20px;

  width: calc(100% - 20px * 2);
}

#workbench
.mainContainer
.mathematicalModel
.rightContainer
.chatRow
.chatRobotAvatar {
  display: inline-block;

  vertical-align: top;

  width: 50px;
  height: 50px;

  border-radius: 50%;
}

#workbench
.mainContainer
.mathematicalModel
.rightContainer
.chatRow
.chatRobotMessage {
  display: inline-block;

  vertical-align: top;

  margin: 0 0 0 10px;

  border-radius: 20px;

  background: #f2f2f2;
}

#workbench
.mainContainer
.mathematicalModel
.rightContainer
.chatRow
.chatRobotMessage
.chatRobotMessageText {
}

#workbench
.mainContainer
.mathematicalModel
.rightContainer
.chatRow
.chatRobotMessage
.latexMessageText {
  padding: 10px 20px 10px 20px;

  max-width: none;
}

#workbench .el-menu-item.is-disabled {
  opacity: 1;
}

#workbench .mainContainer .inputArea1 {
  position: relative;

  padding: 10px 0 10px 0;

  width: 100%;
  height: auto;
}

#workbench .mainContainer .inputArea1 .upload-demo {
  position: absolute;

  left: 0;
  bottom: 0;
}

#workbench .mainContainer .inputArea1 .upload-demo /deep/ .el-upload-list {
  position: absolute;

  bottom: 70px;
  left: 10px;

  width: 90px;
}

#workbench .mainContainer .inputArea1 .fileUploadButton {
  position: absolute;

  bottom: 20px;
  left: 40px;

  width: 40px;
  height: 40px;
}

#workbench .mainContainer .inputArea1 .input {
  margin: 0 0 0 100px;

  width: calc(100% - 100px - 200px);
}

#workbench .mainContainer .inputArea1 .input .prompts .prompt {
  display: block;

  margin: 0 0 4px 0;
}

#workbench .mainContainer .inputArea1 .input .file {
  display: inline-block;

  position: relative;
}

#workbench .mainContainer .inputArea1 .input .file .picture {
  max-width: 200px;
  height: 100px;

  cursor: pointer;
}

#workbench .mainContainer .inputArea1 .input .file .fileSvg {
  width: 50px;

  height: 50px;

  outline: none;

  cursor: pointer;
}

#workbench .mainContainer .inputArea1 .input .file .deleteFile {
  position: absolute;

  top: -6px;
  right: -6px;

  width: 12px;
  height: 12px;

  border-radius: 50%;

  background: #c9c9c9;

  cursor: pointer;
}

#workbench .mainContainer .inputArea1 .input .chatInput {
  width: 100%;

  font-size: 16px;
}

#workbench .mainContainer .inputArea1 .sendButton {
  position: absolute;

  right: 120px;
  bottom: 20px;

  padding: 0 0 0 0;

  width: 60px;
  height: 40px;

  text-align: center;
}

#workbench .mainContainer .inputArea1 .toLongTextRobotButton {
  position: absolute;

  right: 40px;
  bottom: 20px;

  padding: 0 0 0 0;

  width: 60px;
  height: 40px;

  text-align: center;
}

#workbench .mainContainer .inputArea1 .sendButton .sendButtonIcon {
  width: 24px;
  height: 24px;
}

#workbench .mainContainer .inputArea1 .toLongTextRobotButton .sendButtonIcon {
  width: 24px;
  height: 24px;
}
</style>