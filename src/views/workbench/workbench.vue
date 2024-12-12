<template>
</template>

<script>
import {getWorkbenchRobotList} from "@/apis/chat";
import {isEmpty} from "@/utils/common";

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
    getRobotList() {
      this.robotListFlag = false;
      getWorkbenchRobotList().then((res) => {
        if (res.data.code === 200) {
          this.robotList = []
          if (isEmpty(res.data.data.length))
            res.data.data.sort((o1, o2) => {
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