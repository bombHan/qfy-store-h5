<template>
  <div class="ordersubmit__Box" v-if="!loading">
    <div class="buyer bgwhite p20 fontSize0">
      <img :src="detail.headimgurl" />
      <span class="fontSize30 ml20 pingFang color51">使用人：{{ detail.nickname }} {{ phone }}</span>
    </div>
    <div class="shop bgwhite mt20 pl20 pr20 pt30 fontSize0">
      <img :src="shop.logo" />
      <span class="fontSize30 ml20 pingFang color51">{{ shop.storeName }}</span>
    </div>

    <div class="pro bgwhite pl40 pr20 pt30 pb40">
      <div class="pro-image fl">
        <img :src="goods.mainPic" />
      </div>
      <div class="pro-content fontSize0">
        <div class="mt10">
          <span class="fontSize20 colorred">￥</span>
          <span class="fontSize30 colorred">{{ goods.realPrice }}</span>
          <span class="fontSize20 color128 ml20" style="text-decoration: line-through;" v-if="goods.originalPrice">￥{{ goods.originalPrice }}</span>
          <span class="fontSize20 color128 fr">x{{ num }}</span>
        </div>
        <div class="fontSize30 color51 mt35 fw ellipsis">
          {{ goods.goodsName }}
        </div>
        <div class="fontSize24 color128 mt10" v-if="goods.checkType==1">有效期：购买后{{goods.checkRelativeDay}}天内有效</div>
        <div class="fontSize24 color128 mt10" v-else>有效期：{{ goods.checkSellStartDate | showTime }}-{{ goods.checkSellEndDate | showTime }}</div>
      </div>
    </div>

    <div class="bgwhite pl20 pr20 mt20">
      <div class="pt40 pb20">
        <span class="fontSize24 color128">使用方式</span>
        <span class="fontSize24 color51 ml50">进店使用</span>
      </div>
      <div class="pt40 pb20">
        <span class="fontSize24 color128">店铺合计</span>
        <span class="fontSize24 color51 ml50">￥{{ (goods.realPrice * num) | showNum }}</span>
      </div>
      <div class="pt40 pb30">
        <span class="fontSize24 color128">买家留言</span>
        <input v-model="buyerRemark" :maxlength="120" class="enter fontSize24 color51 ml50" placeholder="有什么想对商家说的可以写在这里哦！" />
      </div>
    </div>

    <div class="btn-box fontSize0">
      <div>
        <div class="num pl20">
          <span class="color151 fontSize24">合计</span>
          <span class="colorred fontSize24">￥</span>
          <span class="colorred fontSize30">{{
            (goods.realPrice * num) | showNum
          }}</span>
        </div>
        <div class="total color151 fontSize24">共{{ num }}件商品</div>
        <div class="btn color255 fontSize30" @click="save">提交订单</div>
      </div>
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
      id: "",
      num: "",
      phone: "",
      loading: true,
      goods: {},
      shop: {},
      buyerRemark: "",
      detail: {}
    };
  },
  created() {
    document.title = "确认订单";
    this.goodsId = this.$route.params.id;
    this.num = this.$route.params.num;
    this.phone = this.$route.params.phone;
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.loading = true;
      api
        .ajax({
          data: {
            goodsId: this.goodsId,
            type: 0
          },
          method: "detailGoods"
        })
        .then(res => {
          const data = res.data.data;
          this.goods = data.goods;
          this.shop = data.store;
          this.loading = false;
        })
        .catch(error => {
          console.log("error", error);
        });

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
    },
    save() {
      api
        .ajax({
          data: {
            waresId: this.goodsId,
            waresCount: this.num,
            buyerRemark: this.buyerRemark,
            buyerPhone: this.phone,
            waresPictrueUrl: this.goods.mainPic
          },
          method: "saveOrder"
        })
        .then(res => {
          const data = res.data.data;
          wx.miniProgram.redirectTo({
            url: `/pages/pay/pay?id=${
              data.id
            }&token=${window.localStorage.getItem("token")}`
          });
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  },
  filters: {
    showNum(num) {
      return num.toFixed(2);
    }
  }
};
</script>
<style scope lang="less">
.ordersubmit__Box {
  .buyer {
    img {
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 5px;
    }
    span {
      line-height: 0.8rem;
    }
  }
  .shop {
    img {
      width: 0.533333rem;
      height: 0.533333rem;
      border-radius: 5px;
    }
    span {
      line-height: 0.533333rem;
    }
  }
  .pro {
    overflow: hidden;
    .pro-image {
      float: left;
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 5px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .pro-content {
      margin-left: 2.66667rem;
    }
  }
  .enter {
    border: none;
    width: 7rem;
  }

  .btn-box {
    height: 1.2rem;
    & > div {
      position: fixed;
      width: 100%;
      height: 1.2rem;
      bottom: 0;
      left: 0;
      background-color: #fff;
      display: flex;
      align-items: center;

      .num {
        flex: 1;
      }

      .total {
        flex: 0 0 1.7rem;
      }

      .btn {
        flex: 0 0 3.2rem;
        text-align: center;
        height: 1.2rem;
        line-height: 1.2rem;
        background: rgba(62, 123, 248, 1);
      }
    }
  }
}
</style>
