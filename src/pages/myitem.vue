<template>
  <div class="myitem__Box">
    <div class="pl20 pr20 pt30 pb30 fontSize30 color51">基本信息</div>
    <div class="bgwhite pt30 pb30">
      <van-cell-group :border="false">
        <van-cell title="头像" value="" value-class="color128" label-class="color51" :border="false" is-link>
          <img class="head" src="../assets/images/default-logo.png" />
        </van-cell>
        <van-cell title="姓名" value="请填写" value-class="color128" label-class="color51" :border="false" is-link />
        <van-cell title="手机号" value="15890765543" value-class="color128" label-class="color51" :border="false" is-link />
        <van-cell title="性别" value="男" value-class="color128" label-class="color51" :border="false" is-link />
        <van-cell title="生日" value="请选择" value-class="color128" label-class="color51" :border="false" is-link />
        <van-cell title="地区" value="请选择" value-class="color128" label-class="color51" :border="false" is-link />
        <van-cell title="微信号" value="请填写" value-class="color128" label-class="color51" :border="false" is-link />
      </van-cell-group>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 1
    };
  },
  created() {
    document.title = "慧云商城";
  },
  methods: {
    tabbarChange(e) {
      console.log(e);
    }
  }
};
</script>
<style lang="less">
.myitem__Box {
  .head {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .van-cell {
    line-height: 30px;
  }
  .van-cell__right-icon {
    margin-top: 3px;
  }
}
</style>