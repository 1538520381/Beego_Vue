<template>
  <div id="userContainer" @click="toPersonalCenter">
    <el-image class="userAvatar" :src="userAvatar"></el-image>
    <div class="userInformation">
      <div class="userId">{{ userId }}</div>
      <div class="userName">{{ userName }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserContainer",
  props: {
    userId: Number,
    userAvatar: String,
    userName: String,
  },
  methods: {
    toPersonalCenter() {
      this.$router.push("/personalCenter");
    },
  }
}
</script>

<style scoped>
#userContainer {
  display: inline-flex;

  flex-flow: row;

  padding: 10px 10px 10px 10px;

  width: calc(100% - 10px * 2);

  cursor: pointer;
}

#userContainer .userAvatar {
  display: inline-block;

  width: 40%;

  border-radius: 50%;
}

#userContainer .userInformation {
  display: inline-block;

  flex: 1;

  padding: 0 0 0 10px;

  width: 0;
  height: 100%;

  text-align: left;
}

#userContainer .userInformation .userId {
  display: inline-block;

  width: 100%;
  height: 50%;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#userContainer .userInformation .userName {
  display: inline-block;

  width: 100%;
  height: 50%;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>