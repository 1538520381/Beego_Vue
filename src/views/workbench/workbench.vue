<template>
  <div id="workbench">
    <div class="robotMenuContainer">
      <el-menu class="robotMenu" :default-active="String(robotActive)" @select="selectRobotMenu">
        <el-scrollbar class="robotMenuScrollbar">
          <el-menu-item class="robotMenuItem" v-for="(item,index) in robotList" :index="String(index)">
            <div class="robotMenuItemContainer">
              <el-image
                  class="robotMenuItemAvatar"
                  :src="item.avatar"
                  fit="contain"
              />
              <div class="robotMenuItemName">{{ item.name }}</div>
            </div>
          </el-menu-item>
        </el-scrollbar>
      </el-menu>
      <div class="logoContainer">
        <div class="school">{{ user.school + '版' }}</div>
        <el-image class="logo" :src="assets.logo"></el-image>
      </div>
    </div>
    <div class="robotContainer" v-for="(item,index) in robotList" v-show="index === robotActive">
      <WorkbenchRobotType0 v-if="item.type === 0" :userId="user.id" :userAvatar="user.avatar" :userName="user.name"
                           :robot="item"></WorkbenchRobotType0>
      <WorkbenchRobotType1 v-if="item.type === 1" :userId="user.id" :userAvatar="user.avatar" :userName="user.name"
                           :robot="item"></WorkbenchRobotType1>
      <WorkbenchRobotType3 v-if="item.type === 3" :userId="user.id" :userAvatar="user.avatar" :userName="user.name"
                           :robot="item"></WorkbenchRobotType3>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/pictures/logo.png'

import WorkbenchRobotType0 from "@/components/workbenchRobotType0"
import WorkbenchRobotType1 from "@/components/workbenchRobotType1";

import {isEmpty} from "@/utils/common";

import {getUserByToken} from "@/apis/user";
import {getWorkbenchRobotList} from "@/apis/chat";
import WorkbenchRobotType3 from "@/components/workbenchRobotType3/index.vue";

export default {
  name: 'Workbench',
  components: {
    WorkbenchRobotType3,
    WorkbenchRobotType0, WorkbenchRobotType1
  },
  data() {
    return {
      // 静态资源
      assets: {
        logo: logo
      },

      // 用户
      user: {},

      // robot
      robotList: [],
      robotActive: 0,
    }
  },
  async created() {
    await this.getUserByToken()

    this.getRobotList()
  },
  methods: {
    // 根据token获取用户信息
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

    // 获取robot列表
    getRobotList() {
      getWorkbenchRobotList().then((res) => {
        if (res.data.code === 200) {
          this.robotList = []
          if (!isEmpty(res.data.data)) {
            for (let i = 0; i < res.data.data.length; i++) {
              this.robotList.push({
                id: res.data.data[i]["bot_id"],
                name: res.data.data[i]["bot_name"],
                avatar: res.data.data[i]["bot_avatar"],
                description: res.data.data[i]["description"],
                handle: res.data.data[i]["bot_handle"],
                prompts: res.data.data[i]["prompts"],
                type: res.data.data[i]["bot_front_flag"],
                linkRobotId: res.data.data[i]["attach_bot_id"],
                sort: res.data.data[i]["sort"],
              })
            }
            this.robotList.sort((o1, o2) => {
              return o1.sort - o2.sort
            })
          }
          this.robotActive = 0
        } else {
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },

    selectRobotMenu(index) {
      this.robotActive = parseInt(index)
    }
  }
}
</script>

<style scoped>
#workbench {
  display: flex;

  flex-flow: row;

  width: 100%;
  height: 100%;
}

#workbench .robotMenuContainer {
  display: inline-flex;

  flex-flow: column;

  vertical-align: top;

  width: 120px;
  height: 100%;

  background: #e6e6e6;
}

#workbench .robotMenuContainer .robotMenu {
  flex: 1;

  width: 100%;

  background: none;
}

#workbench .robotMenuContainer .robotMenu .robotMenuScrollbar {
  width: 100%;
  height: 100%;
}

#workbench .robotMenuContainer .robotMenu .robotMenuScrollbar .robotMenuItem {
  height: auto;

  margin: 0 auto 0 auto;
}

#workbench .robotMenuContainer .robotMenu .robotMenuScrollbar .robotMenuItem .robotMenuItemAvatar {
  width: 80px;
  height: 80px;
}

#workbench .robotMenuContainer .robotMenu .robotMenuScrollbar .robotMenuItem .robotMenuItemName {
  width: 100%;

  text-align: center;

  font-size: 12px;

  line-height: 20px;

  white-space: normal;
  word-break: break-all;
  overflow: hidden;
}

#workbench .robotMenuContainer .logoContainer {
  width: 100%;

  text-align: center;
}

#workbench .robotMenuContainer .logoContainer .school {
  margin: 0 auto 0 auto;

  width: 90%;

  font-size: 15px;
  font-weight: bold;

  line-height: 20px;
}

#workbench .robotMenuContainer .logoContainer .logo {
  width: 80%;
}

#workbench .robotContainer {
  flex: 1;

  width: 0;
  height: 100%;
}
</style>