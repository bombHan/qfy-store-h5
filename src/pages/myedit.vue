<template>
  <div class="myedit__Box pt30">
    <van-cell-group>
      <van-field v-model="value" placeholder="请输入用户名" clearable />
    </van-cell-group>
    <div class="p50">
      <button class="fontSize30 color255 pt20 pb20">保存</button>
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
  }
};
</script>
<style scope lang="less">
.myedit__Box {
  button {
    background-color: #21a9ff;
    width: 100%;
    outline: none;
    border: none;
    border-radius: 5px;
  }
}
</style>