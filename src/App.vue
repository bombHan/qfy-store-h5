<template>
  <div id="app">
    <!-- <img class="defalut-img" src="./assets/images/test.jpg" /> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
@import "./assets/css/index.less";
// .defalut-img{
//   width: 100%;
// }
</style>