<template>
</template>

<script>
import {getWorkbenchRobotList} from "@/apis/chat";

export default {
  name: 'Workbench',
  data() {
    return {
      robotList: [],
      robotListFlag: false,
    }
  },
  created() {
    this.getRobotList()
  },
  methods: {
    async getRobotList() {
      this.robotListFlag = false;
      getWorkbenchRobotList().then((res) => {
        if(res.data.code === 200){
          this.robotList = []
          if(this.robotList.el)
          res.data.data.sort((o1,o2) => {
            return o1.sort - o2.sort;
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>