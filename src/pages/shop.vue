<template>
  <div class="shop__Box">
    <Login />

    <div class="status" v-if="storeDetail.manageStatus==1">
      <div class="fontSize30 color255">店铺已打烊</div>
    </div>

    <div class="shop bgwhite pt40 pr40 pb50 pl40 fontSize0">
      <img class="logo" :src="storeDetail.logo" />
      <span class="name fontSize30 color00 pingFang ml20 ellipsis">{{ storeDetail.storeName }}</span>
      <div class="goto fr fontSize30 pingFang">
        <a class="color128" :href="'tel:'+storeDetail.waiterPhone">联系商家</a>
      </div>
    </div>

    <van-list v-model="loading" :finished="finished" finished-text=" " @load="loadMore">
      <div class="pro pl20 pr20 pb50">
        <div class="bgwhite mt20" v-for="(item, index) in list" :key="index" @click="_stop(item.goodsId)">
          <div class="pro-image">
            <img :src="item.mainPic" />
          </div>
          <div class="p20 fontSize30 pingFang color51 ellipsis">{{ item.goodsName }}</div>
          <div class="pl20 pr20 pb20 fontSize0">
            <span class="fontSize20 colorred">￥</span>
            <span class="fontSize28 colorred">{{ item.realPrice }}</span>
            <span class="fr fontSize24 color128" v-if="storeDetail.salesDisplay==1&&item.salesVolume">{{ item.salesVolume }}人购买</span>
          </div>
        </div>
      </div>
    </van-list>

    <div class="holdpic" v-if="list&&list.length===0">
      <img src="../assets/images/bg04.png" />
      <p>暂无数据</p>
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
      storeId: "",
      list: [],
      loading: false,
      finished: false,
      pager: {
        currentPage: 0,
        pageSize: 10,
        totalPage: 0
      },
      storeDetail: {}
    };
  },
  created() {
    document.title = "慧云商城";
    this.storeId = this.$route.params.id;
    this.getDetail();
  },
  methods: {
    _stop(id) {
      this.gotoh5share("/prodetail/" + id);
      // if (this.storeDetail.manageStatus == 1) {
      //   return;
      // } else {

      // }
    },
    getDetail(params) {
      api
        .ajax({
          data: { storeId: this.storeId },
          method: "storeDetail"
        })
        .then(res => {
          const data = res.data.data;
          this.storeDetail = data;
          document.title = data.storeName;
          if (window.__wxjs_environment === "miniprogram") {
            let origin = window.location.origin + "/#/shop/" + data.storeId;
            origin = encodeURIComponent(origin);
            console.log(origin, "向小程序传数据");
            wx.miniProgram.postMessage({
              data: {
                type: "share",
                sahre_title: data.storeName,
                sahre_pic: data.picture,
                sahre_url: "/pages/h5share/h5share?url=" + origin
              }
            });
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    loadMore() {
      this.pager.currentPage += 1;
      this.loading = true;
      api
        .ajax({
          data: {
            ...this.pager,
            storeId: this.storeId
          },
          method: "listGoods"
        })
        .then(res => {
          const data = res.data.data;
          this.list = this.list.concat(data.list);
          this.pager.currentPage = data.currentPage;
          this.pager.totalPage = data.totalPage;
          this.loading = false;
          if (data.totalPage <= data.currentPage) {
            this.finished = true;
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
.shop__Box {
  .status {
    height: 1.17rem;
    position: relative;
    & > div {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 1.17rem;
      line-height: 1.17rem;
      text-align: center;
      background: rgba(210, 210, 210, 1);
    }
  }

  .shop {
    .logo {
      width: 0.8rem;
      height: 0.8rem;
    }
    .name {
      line-height: 0.8rem;
      width: 5rem;
      display: inline-block;
      vertical-align: top;
    }
    .goto {
      box-sizing: border-box;
      width: 2rem;
      height: 0.8rem;
      line-height: 0.78rem;
      border: 1px solid rgba(191, 191, 191, 0.5);
      border-radius: 0.36rem;
      text-align: center;
    }
  }
  .pro {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    & > div {
      flex: 0 0 4.56rem;
      width: 4.56rem;
      border-radius: 0.13rem;
      .pro-image {
        width: 4.56rem;
        height: 4.53rem;
        border-top-left-radius: 0.133333rem;
        border-top-right-radius: 0.133333rem;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
