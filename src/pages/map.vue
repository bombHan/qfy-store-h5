<template>
  <div class="map__Box">
    <div id="container"></div>
  </div>
</template>
<script>
import api from "@/api/index/index";
import myMixin from "@/components/mixins";
export default {
  mixins: [myMixin],
  data() {
    return {
      lat: "",
      lon: ""
    };
  },
  created() {
    document.title = "慧云商城";
    this.lat = this.$route.params.lat;
    this.lon = this.$route.params.lon;
  },
  mounted() {
    var map = new AMap.Map("container", {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 14, //初始化地图层级
      center: [this.lon, this.lat] //初始化地图中心点
    });
    var marker = new AMap.Marker({
      position: [this.lon, this.lat]
    });
    map.add(marker);
  },
  methods: {}
};
</script>
<style scope lang="less">
.map__Box {
  #container {
    width: 100%;
    height: 100vh;
  }
}
</style>
