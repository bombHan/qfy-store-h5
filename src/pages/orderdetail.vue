<template>
  <div class="orderdetail__Box" v-if="!pageLoading">
    <div class="top">
      <div class="tag-state fontSize30 color255 pl30" v-if="orderDetail.state == 3">
        交易完成
      </div>
      <div class="tag-state fontSize30 color255 pl30" v-if="orderDetail.state == 2">
        等待使用
      </div>
      <div class="tag-state fontSize30 color255 pl30" v-if="orderDetail.state == 4">
        交易关闭
        <div class="fontSize24 mt10">{{ orderDetail.closeReason }}</div>
      </div>
      <div class="tag-state fontSize30 color255 pl30" v-if="orderDetail.state == 1">
        等待买家付款
        <div class="fontSize24 mt10">
          <van-count-down class="fontSize24 mt10 color255" :time="time" format="请于mm分ss秒内付款，超时订单将自动关闭" @finish="finished" />
        </div>
      </div>
    </div>

    <div class="bgwhite mt20 pl20 pr20 pb30">
      <div class="pt40 fontSize24 color51">
        购买人： {{ orderDetail.buyerName }} | {{ orderDetail.buyerPhone }}
      </div>
      <div class="pt40 fontSize24 color128">
        创建时间：{{ orderDetail.inputTime }}
      </div>
      <div class="pt40 fontSize24 color128" v-if="orderDetail.payTime">
        付款时间： {{ orderDetail.payTime }}
      </div>
    </div>

    <div class="pro bgwhite pl20 pr20 pt30 pb40 mt20" @click="gotoh5share('/prodetail/' + orderDetail.waresId)">
      <div class="pro-image fl">
        <img :src="orderDetail.waresPictrueUrl" />
      </div>
      <div class="pro-content fontSize0 fl">
        <div class="name fontSize30 color51 mt10 fw">
          {{ orderDetail.waresName }}
        </div>
        <div class="mt10 fontSize20 color128">
          x{{ orderDetail.waresCount }}
        </div>
      </div>
      <div class="pro-content2 fontSize0 fr">
        <div class="mt10 fontSize30 color51 fw">
          ￥{{ orderDetail.waresPrice }}
        </div>
      </div>
    </div>
    <div class="bgwhite pl20 pr20">
      <div class="pb30 fontSize24 color128">
        <span>商品总价： </span><span class="fr">￥{{ orderDetail.totalPrice }}</span>
      </div>
      <div class="pb30 fontSize24 color128">
        <span>订单总价： </span><span class="fr">￥{{ orderDetail.totalPrice }}</span>
      </div>
      <div class="pb30 fontSize24 color128" v-if="orderDetail.totalPrice > orderDetail.practicalDealPrice">
        <span>商家改价： </span><span class="fr">-￥{{ (orderDetail.totalPrice - orderDetail.practicalDealPrice).toFixed(2)}}</span>
      </div>
      <div class="pb30 fontSize24 color128" v-if="orderDetail.totalPrice < orderDetail.practicalDealPrice">
        <span>商家改价： </span><span class="fr">+￥{{ (orderDetail.practicalDealPrice - orderDetail.totalPrice).toFixed(2)}}</span>
      </div>
      <div class="pb30 fontSize24 color128 pt20" style="border-top:1px solid rgba(230,230,230,0.3);">
        <span>实付金额： </span><span class="fr colorred">￥{{ orderDetail.practicalDealPrice }}</span>
      </div>
    </div>

    <div class="bgwhite pl20 pr20 mt20">
      <div class="pt40 pb20">
        <span class="fontSize24 color128">使用方式</span>
        <span class="fontSize24 color51 ml30">进店使用</span>
      </div>
      <div class="pt40 pb20">
        <span class="fontSize24 color128">店铺合计</span>
        <span class="fontSize24 color51 ml30">￥{{ orderDetail.practicalDealPrice }}</span>
      </div>
      <div class="pt40 pb30" style="overflow:hidden">
        <span class="fontSize24 color128 fl">买家留言</span>
        <span class="fontSize24 color51" style="margin-left:1.7rem;display: block;line-height:0.4rem;">{{ orderDetail.buyerRemark }}</span>
      </div>
    </div>

    <div class="bgwhite mt20 p30" v-if="orderDetail.checks&&orderDetail.checks.length">
      <div class="qr-box">
        <span class="fis fontSize24" v-if="!now&&show">
          <img src="../assets/images/icon222.png">
        </span>
        <span class="fis fontSize24" v-if="!now&&!show">
          <img src="../assets/images/icon111.png">
        </span>
        <img class="code-box-bg" mode="widthFix" src="../assets/images/bg01.png" />
        <div class="order-code fontSize24 color51">
          订单号：{{ orderDetail.orderNum }}
        </div>
        <div class="txt fontSize24 color51" style="top:0.69rem;" @click="gotoh5share('/shop/' + orderDetail.storeId)">
          {{ orderDetail.storeName }}
        </div>
        <!-- <div class="txt fontSize24 color51" style="top:1.56rem;">
          店铺名称： {{ orderDetail.storeName }}
        </div> -->
        <div class="txt fontSize24 color51" style="top:2.12rem;">
          有效期： {{ orderDetail.validStartTime | showTime }} - {{ orderDetail.validEndTime | showTime }}
        </div>
        <div class="txt txt1 fontSize24 colorred" style="top:3.9rem;">
          请将此码出示给商家进行核销
        </div>
        <div class="code-qr">
          <img :src="qr" :class="!now&&'op'" />
        </div>
      </div>
      <div class="list bgwhite mt20 pt30 pl40 pr40 pb30 fontSize24" v-if="orderDetail.checks&&orderDetail.checks.length">
        <div class="color51">核销码：</div>
        <div class="color51 pt20" v-for="(itm, idx) in orderDetail.checks" :key="idx">
          {{ itm.checkCode }}
          <span class="fr" :class="{ color128: itm.state != 1 }">{{
            itm.state == 1
              ? "待核销"
              : itm.state == 2
              ? "已核销"
              : itm.state == 3
              ? "已失效"
              : ""
          }}</span>
        </div>
      </div>

    </div>

    <div class="price p20" v-if="orderDetail.state == 1">
      <button class="cancel " @click="cancelOrder">取消</button>
      <button class="cancel pay" @click.stop="pay">付款</button>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode";
import api from "@/api/index/index";
import myMixin from "@/components/mixins";
export default {
  mixins: [myMixin],
  data() {
    return {
      orderId: "",
      orderDetail: {},
      pageLoading: true,
      time: 0,
      qr: "",
      show: false,
      now: false
    };
  },
  created() {
    document.title = "订单详情";
    this.orderId = this.$route.params.id;
    this.getDetail();
    QRCode.toDataURL(window.location.origin + "/#/off/" + this.orderId)
      .then(url => {
        this.qr = url;
      })
      .catch(err => {
        console.error(err);
      });
  },
  methods: {
    getDetail(params) {
      api
        .ajax({
          data: {
            id: this.orderId
          },
          method: "buyerInfoOrder"
        })
        .then(res => {
          this.pageLoading = false;
          const data = res.data.data;
          this.orderDetail = data;
          for (let i = 0; data.checks && i < data.checks.length; i++) {
            if (data.checks[i].state == 1) {
              this.now = true; //正常
            } else if (data.checks[i].state == 2) {
              this.show = true;
            }
          }
          if (data.state == 1 && res.data.surplusTime > 0) {
            this.time = res.data.surplusTime * 1000;
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    finished() {
      this.getDetail();
    },
    cancelOrder() {
      api
        .ajax({
          data: {
            id: this.orderId
          },
          method: "buyerCancelOrder"
        })
        .then(res => {
          this.$toast.success(res.data.message);
          this.getDetail();
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    pay(id) {
      console.log("去支付");
      api
        .ajax({
          data: {
            id: this.orderId
          },
          method: "isEditPrice"
        })
        .then(res => {
          if (res.data.payPrice) {
            this.$dialog
              .confirm({
                title: "改价提醒",
                message: `商家已将交易金额修改为${res.data.payPrice}元，是否继续支付？`,
                confirmButtonText: "继续支付"
              })
              .then(() => {
                wx.miniProgram.redirectTo({
                  url: `/pages/pay/pay?id=${
                    this.orderId
                  }&token=${window.localStorage.getItem("token")}`
                });
              });
          } else {
            wx.miniProgram.redirectTo({
              url: `/pages/pay/pay?id=${
                this.orderId
              }&token=${window.localStorage.getItem("token")}`
            });
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
.orderdetail__Box {
  .top {
    height: 4.08rem;
    background: url("../assets/images/bg02.png") no-repeat left bottom;
    background-size: 100%;
    .tag-state {
      padding-top: 2.2rem;
    }
    .color255 {
      color: #fff;
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
      margin-left: 0.266667rem;
      width: 4.5rem;
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .pro-content2 {
      text-align: right;
    }
  }
  .enter {
    border: none;
    width: 7rem;
  }
  .qr-box {
    position: relative;
    & > img {
      width: 100%;
    }
    .order-code {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      height: 0.9rem;
      line-height: 0.9rem;
    }
    .txt {
      position: absolute;
      left: 2.12rem;
    }
    .txt1 {
      left: 0;
      width: 100%;
      text-align: center;
    }
    .code-qr {
      position: absolute;
      top: 4.5rem;
      left: 0;
      width: 100%;
      text-align: center;
      img {
        width: 2.9rem;
        height: 2.9rem;
      }
    }
  }
  .op {
    opacity: 0.5;
  }
  .list {
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 10px;
  }
  .fis {
    position: absolute;
    right: 0.5rem;
    top: 1rem;
    height: 1.2rem;
    width: 1.2rem;
    img {
      width: 1.2rem;
    }
  }
  .price {
    text-align: right;
    background-color: #fff;
    border-top: 1px solid rgba(222, 222, 222, 0.5);
    .cancel {
      width: 1.73rem;
      height: 0.64rem;
      border: 1px solid rgba(222, 222, 222, 0.5);
      border-radius: 0.32rem;
      background-color: #fff;
      outline: none;
      padding: 0;
      margin: 0;
      margin-left: 0.26rem;
    }
    .cancel.pay {
      color: rgba(255, 255, 255, 1);
      background: rgba(62, 123, 248, 1);
      border: 1px solid rgba(62, 123, 248, 1);
    }
  }
}
</style>
