<template>
  <div class="offlogin__Box bgwhite">
    <div class="pb20 fontSize20 color128">手机号</div>
    <div class="label-content mb50">
      <input v-model.trim="phone" type="tel" maxlength="11" />
    </div>
    <div class="pb20 fontSize20 color128">验证码</div>
    <div class="label-content mb50">
      <input v-model.trim="code" maxlength="6" />
      <div>
        <span class="pl20 pr20 wid" @click="getcode" v-if="is_show"
          >获取验证码</span
        >
        <span class="pl20 pr20 wid wid1" v-else>{{ num }}s</span>
      </div>
    </div>
    <div>
      <button class="fontSize30 color255" @click="save">确定</button>
    </div>
  </div>
</template>
<script>
import api from "@/api/index/index";
import myMixin from "@/components/mixins";
export default {
  mixins: [myMixin],
  data() {
    return {
      phone: "",
      code: "",
      codeId: "",
      num: 60,
      is_show: true,
      timer: null,

      isClick: false,
      verificationCode: "",
      isFormat: false,
      confirm: false,
      interval: null
    };
  },
  created() {},
  methods: {
    getcode() {
      if (!this.phone) {
        return this.$toast("请输入手机号~");
      } else if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        return this.$toast("请输入正确的手机号~");
      }
      api
        .ajax({
          data: { phone: this.phone },
          method: "sendCheckCode",
          type: "check"
        })
        .then(res => {
          const data = res.data.data;
          this.code = data.checkCode;
          this.codeId = data.codeId;
          this.is_show = false;
          this.timer && clearInterval(this.timer);
          this.timer = setInterval(() => {
            if (this.num <= 0) {
              this.is_show = true;
              this.num = 60;
              this.timer && clearInterval(this.timer);
            } else {
              this.num--;
            }
          }, 1000);
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    save() {
      if (!this.phone) {
        return this.$toast("请输入手机号~");
      } else if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        return this.$toast("请输入正确的手机号~");
      }
      if (!this.code) {
        return this.$toast("请输入验证码~");
      }
      api
        .ajax({
          data: {
            phone: this.phone,
            codeId: this.codeId,
            checkCode: this.code
          },
          method: "checkerLogin",
          type: "check"
        })
        .then(res => {
          const data = res.data.data;
          window.localStorage.setItem("checkUser", JSON.stringify(data));
          if (this.$route.query.id) {
            this.$router.push({
              path: `/off/${this.$route.query.id}`
            });
          } else {
            this.$toast("登录成功~");
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>
<style scope lang="less">
.offlogin__Box {
  width: 100%;
  height: 100vh;
  padding: 1rem 1rem 0 1rem;
  box-sizing: border-box;
  .label-content {
    height: 1.17rem;
    line-height: 1.17rem;
    display: flex;
    border: 1px solid rgba(217, 217, 217, 1);
    input {
      padding: 0 0.3rem;
      flex: 1;
      height: 100%;
      box-sizing: border-box;
      margin: 0;
      border: none;
      outline: none;
    }
    span {
      color: #3e7bf8;
      border-left: 1px solid #3e7bf8;
    }
    .wid {
      display: inline-block;
      vertical-align: top;
      line-height: 0.45rem;
      width: 1.9rem;
      height: 0.4rem;
      margin-top: 0.4rem;
      text-align: center;
    }
    .wid1.wid {
      line-height: 0.42rem;
    }
  }
  button {
    width: 100%;
    height: 1.174rem;
    border: none;
    outline: none;
    background: rgba(62, 123, 248, 1);
  }
}
</style>
