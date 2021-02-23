<template>
  <div v-if="token" class="none"></div>
  <div v-else class="login__Box" @click="login"></div>
</template>
<script>
import myMixin from "@/components/mixins";
import api from "@/api/index/index";
export default {
  mixins: [myMixin],
  data() {
    return {
      token: ""
    };
  },
  created() {
    this.token = window.localStorage.getItem("token");
    if (!this.token) {
      this.login();
    }
  },
  methods: {
    login() {
      let hash = window.location.hash.slice(1);
      let url = encodeURIComponent(
        `${window.location.origin}/static/code.html?uri=${hash}`
      );
      // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx555f82f8ecd04a51&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    }
  }
};
</script>
<style scope lang="less">
.none {
  display: none;
}
.login__Box {
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
