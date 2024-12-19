<template>
  <div id="workbenchSessionMenuContainer">
    <div class="sessionMenuContainer" v-show="sessionMenuShow">
      <el-button class="addSessionButton" link v-if="addSessionButtonFlag" @click="addSession" :disabled="!enabledFlag">
        新增对话
      </el-button>
      <el-menu class="sessionMenu" :default-active="String(sessionActive)" @select="selectSessionMenu">
        <el-scrollbar class="sessionMenuScrollbar">
          <el-menu-item class="sessionMenuItem" v-for="(item, index) in sessionList" :index="String(index)"
                        :disabled="!enabledFlag">
            <div class="sessionMenuItemMessage">
              {{
                (isEmpty(item.message) || isEmpty(item.message.content)) ? "new Chat" : item.message.content
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
                  @click="deleteSession(item.id)"
              ></svg-icon>
            </el-tooltip>
          </el-menu-item>
        </el-scrollbar>
      </el-menu>
      <UserContainer :userId="userId" :userAvatar="userAvatar" :userName="userName"></UserContainer>
    </div>
    <el-button class="sessionMenuShowButton sessionMenuShowButtonClose" :icon="assets.ArrowLeftBold"
               v-if="sessionMenuShow" @click="closeSessionMenu"></el-button>
    <el-button class="sessionMenuShowButton sessionMenuShowButtonOpen" :icon="assets.ArrowRightBold"
               v-if="!sessionMenuShow"
               @click="openSessionMenu"></el-button>
  </div>
</template>

<script>
import {isEmpty} from "@/utils/common";

import {addSession, deleteSession, getSessionList} from "@/apis/chat";
import {ArrowLeftBold, ArrowRightBold} from "@element-plus/icons-vue";
import UserContainer from "@/components/userContainer/index.vue";

export default {
  name: 'WorkbenchSessionMenuContainer',
  components: {UserContainer},
  props: {
    robotId: Number,

    userId: Number,
    userAvatar: String,
    userName: String,

    addSessionButtonFlag: Boolean,
    enabledFlag: Boolean
  },
  data() {
    return {
      assets: {
        ArrowLeftBold: ArrowLeftBold, ArrowRightBold: ArrowRightBold
      },

      sessionList: [],
      sessionActive: 0,
      sessionMenuShow: true
    }
  },
  created() {
    this.getSessionList()
  },
  methods: {
    addSession() {
      addSession(this.robotId).then((res) => {
        if (res.data.code === 200) {
          this.getSessionList()
          this.sessionActive = 0
        } else {
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },

    deleteSession(sessionId) {
      deleteSession(sessionId).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("删除成功")
          this.getSessionList()
        } else {
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },

    getSessionList() {
      getSessionList(this.robotId).then((res) => {
        if (res.data.code === 200) {
          this.sessionList = []
          if (!isEmpty(res.data.data)) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.sessionList.push({
                id: res.data.data[i]["session_id"],
                createTime: res.data.data[i]["created_time"],
                message: isEmpty(res.data.data[i]["message"])
                    ? null
                    : {
                      id: res.data.data[i]["message"]["message_id"],
                      content: res.data.data[i]["message"]["content"],
                    },
              })
            }
            this.sessionList.sort((o1, o2) => {
              return new Date(o2.createTime) - new Date(o1.createTime);
            })
          } else {
            this.addSession()
          }
          this.sessionActive = Math.min(this.sessionActive, this.sessionList.length)
          this.$emit('getMessageList', this.sessionList[this.sessionActive].id)
        } else {
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },

    selectSessionMenu(index) {
      this.sessionActive = parseInt(index)
      this.$emit('getMessageList', this.sessionList[this.sessionActive].id)
    },
    closeSessionMenu() {
      this.sessionMenuShow = false
    },
    openSessionMenu() {
      this.sessionMenuShow = true
    },

    isEmpty(field) {
      return isEmpty(field)
    },
  }
}
</script>

<style scoped>
#workbenchSessionMenuContainer {
  position: relative;

  height: 100%;
}

#workbenchSessionMenuContainer .sessionMenuContainer {
  display: inline-flex;

  flex-flow: column;

  width: 200px;
  height: 100%;

  text-align: center;

  background: #C9C9C9;
}

#workbenchSessionMenuContainer .sessionMenuContainer .addSessionButton {
  margin: 10px auto 0 auto;

  width: 80%;
  height: 50px;

  border: 2px dotted #000000;

  font-size: 20px;
}

#workbenchSessionMenuContainer .sessionMenuContainer .sessionMenu {
  flex: 1;

  width: 100%;
  height: 0;

  background: none;
}

#workbenchSessionMenuContainer .sessionMenuContainer .sessionMenu .sessionMenuScrollbar {
  width: 100%;
  height: 100%;
}

#workbenchSessionMenuContainer .sessionMenuContainer .sessionMenu .sessionMenuScrollbar .sessionMenuItem {
  display: flex;

  justify-content: space-between;
}

#workbenchSessionMenuContainer .sessionMenuContainer .sessionMenu .sessionMenuScrollbar .sessionMenuItem .sessionMenuItemMessage {
  width: calc(100% - 30px);

  text-align: left;

  font-size: 16px;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#workbenchSessionMenuContainer .sessionMenuContainer .sessionMenu .sessionMenuScrollbar .sessionMenuItem .sessionMenuDeleteIcon {
  width: 20px;
  height: 20px;

  outline: none;
}

#workbenchSessionMenuContainer .sessionMenuShowButton {
  position: absolute;

  top: calc(50% - 40px / 2);

  width: 40px;
  height: 40px;

  border-radius: 50%;

  z-index: 1;
}

#workbenchSessionMenuContainer .sessionMenuShowButtonClose {
  right: calc(-40px / 2);
}

#workbenchSessionMenuContainer .sessionMenuShowButtonOpen {
  left: calc(-40px / 2);
}
</style>