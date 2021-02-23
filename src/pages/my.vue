<template>
  <div class="my__Box">
    <Login />
    <div class="top">
      <img class="head" :src="detail.headimgurl" />
      <span>{{ detail.nickname }}</span>
    </div>

    <div>
      <div class="bgwhite pl20 pr20 pt40 pb20 fontSize30 color51">我的订单</div>
      <van-cell-group :border="false">
        <van-cell title="全部" value="" icon="icon04" value-class="color51" label-class="color51" :border="false" is-link @click="goto('/orderlist/0')" />
        <van-cell title="待付款" value="" icon="icon05" value-class="color51" label-class="color51" :border="false" is-link @click="goto('/orderlist/1')" />
        <van-cell title="待使用" value="" icon="icon06" value-class="color51" label-class="color51" :border="false" is-link @click="goto('/orderlist/2')" />
        <van-cell title="已完成" value="" icon="icon07" value-class="color51" label-class="color51" :border="false" is-link @click="goto('/orderlist/3')" />
      </van-cell-group>
    </div>

    <div class="tabbar-box">
      <van-tabbar v-model="active" safe-area-inset-bottom @change="gotoTabbar('/index')">
        <van-tabbar-item>
          <img class="tabbar" src="../assets/images/tabbar01.png" />
          <span class="tabbar-txt" style="color:#7d7e80;">首页</span>
        </van-tabbar-item>
        <van-tabbar-item>
          <img class="tabbar" src="../assets/images/tabbar02-active.png" />
          <span class="tabbar-txt" style="color:#1989fa;">我的</span>
        </van-tabbar-item>
      </van-tabbar>
    </div>

  </div>
</template>
<script>
import api from "@/api/index/index";
import myMixin from "@/components/mixins";
import Login from "@/components/login.vue";
export default {
  mixins: [myMixin],
  components: { Login },
  data() {
    return {
      active: 1,
      detail: {}
    };
  },
  created() {
    document.title = "我的";
    this.getDetail();
  },
  methods: {
    getDetail() {
      api
        .ajax({
          data: {},
          method: "myInfo"
        })
        .then(res => {
          const data = res.data.data;
          this.detail = data;
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>
<style scope lang="less">
.my__Box {
  .tabbar-box {
    height: 50px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .tabbar {
      width: 20px;
    }
    .tabbar-txt {
      line-height: 19px;
      margin-left: 5px;
    }
  }
  .top {
    height: 4.08rem;
    background: url("../assets/images/bg02.png") no-repeat left bottom;
    background-size: 100%;
    position: relative;
    .head {
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
      position: absolute;
      bottom: 0.36rem;
      left: 0.28rem;
    }
    span {
      position: absolute;
      bottom: 0.85rem;
      left: 2.28rem;
      color: #fff;
      font-size: 0.48rem;
    }
  }
}
</style>
<style lang="less">
.my__Box {
  .van-icon-icon04 {
    background: url("../assets/images/icon04.png") no-repeat center;
    background-size: 100%;
  }
  .van-icon-icon05 {
    background: url("../assets/images/icon05.png") no-repeat center;
    background-size: 100%;
  }
  .van-icon-icon06 {
    background: url("../assets/images/icon06.png") no-repeat center;
    background-size: 100%;
  }
  .van-icon-icon07 {
    background: url("../assets/images/icon07.png") no-repeat center;
    background-size: 100%;
  }
}
</style>
