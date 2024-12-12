<template>

</template>

<script>
import {getUserByToken} from "@/apis/user";

export default {
  name: 'Home',
  data() {
    return {
      user: {}
    }
  },
  created() {
    this.getUserByToken()
  },
  methods: {
    getUserByToken() {
      getUserByToken().then((res) => {
        if (res.data.code === 200) {
          this.user = {
            id: res.data.data['user_id'],
            name: res.data.data['user_name'],
            email: res.data.data['email']
          }
        } else {
          this.user = {}
          localStorage.removeItem("token")
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('系统异常，请联系管理员')
      })
    }
  }
}
</script>