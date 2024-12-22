<template>
  <div id="workbenchRobotType3">
    <WorkbenchRobotType0 :userId="userId" :userAvatar="userAvatar"
                         :userName="userName" :robot="robot" v-show="!linkRobotFlag"
                         @selectRobot="selectRobot"></WorkbenchRobotType0>
    <WorkbenchRobotType0 ref="linkRobot" :userId="userId" :userAvatar="userAvatar"
                         :userName="userName" :robot="linkRobot" v-show="linkRobotFlag"
                         @selectRobot="selectRobot" v-if="!isEmpty(linkRobot)"></WorkbenchRobotType0>
  </div>
</template>

<script>
import WorkbenchRobotType0 from "@/components/workbenchRobotType0/index.vue";

import {isEmpty} from "@/utils/common";

import {getRobotById} from "@/apis/chat";
import WorkbenchSessionMenu from "@/components/workbenchSessionMenu/index.vue";

export default {
  name: "WorkbenchRobotType3",
  components: {
    WorkbenchSessionMenu,
    WorkbenchRobotType0,
  },
  props: {
    userId: Number,
    userAvatar: String,
    userName: String,
    robot: Object
  },
  data() {
    return {
      linkRobot: null,
      linkRobotFlag: false,
    }
  },
  created() {
    this.getRobotById(this.robot.linkRobotId)
  },
  methods: {
    isEmpty,
    getRobotById(robotId) {
      getRobotById(robotId).then((res) => {
        if (res.data.code === 200) {
          this.linkRobot = {
            id: res.data.data["bot_id"],
            name: res.data.data["bot_name"],
            avatar: res.data.data["bot_avatar"],
            description: res.data.data["description"],
            handle: res.data.data["bot_handle"],
            prompts: res.data.data["prompts"],
            type: res.data.data["bot_front_flag"],
            linkRobotId: res.data.data["attach_bot_id"],
            sort: res.data.data["sort"],
          }
        } else {
          this.$message.error(res.data.message);
        }
      }).catch((err) => {
        console.log(err);
        this.$message.error("系统异常，请联系管理员");
      });
    },

    selectRobot(input) {
      this.linkRobotFlag = !this.linkRobotFlag
      if (this.linkRobotFlag) {
        this.$refs.linkRobot.setInput(input)
      }
    }
  },
}
</script>


<style scoped>
#workbenchRobotType3 {
  width: 100%;
  height: 100%;
}
</style>