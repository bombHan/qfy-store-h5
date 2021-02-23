<template>
  <div class="paysuccess__Box" v-if="!pageLoading">
    <div class="bg-box">
      <img src="../assets/images/bg03.png" />
      <div class="txt1 fontSize24 color51" @click="gotoh5share('/shop/' + orderDetail.storeId)">
        {{ orderDetail.storeName }}
        <img src="../assets/images/icon01.png" />
      </div>
      <!-- <div class="txt1 txt2 fontSize24 color51">
        {{ orderDetail.storeName }}
      </div> -->
      <div class="txt1 txt3 fontSize24 color51">
        有效期：{{ orderDetail.validStartTime | showTime }}-{{ orderDetail.validEndTime | showTime }}
      </div>
      <img class="qr-code" :src="qr" />
      <div class="txt1 txt5 fontSize24 color51">
        订单号：{{ orderDetail.orderNum }}
      </div>
    </div>

    <div class="list">
      <div class="list-content pl40 pr40 pt30 pb30">
        <div class="color51">核销码：</div>
        <div class="color51 pt20" v-for="(itm, idx) in orderDetail.checks" :key="idx">
          {{ itm.checkCode }}
          <span class="fr">待核销</span>
        </div>
      </div>
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
      qr: ""
    };
  },
  created() {
    document.title = "支付成功";
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
          data: { id: this.orderId },
          method: "buyerInfoOrder"
        })
        .then(res => {
          this.pageLoading = false;
          const data = res.data.data;
          this.orderDetail = data;
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>
<style scope lang="less">
.paysuccess__Box {
  .bg-box {
    position: relative;
    & > img {
      width: 100%;
    }
    .txt1 {
      position: absolute;
      left: 2.65rem;
      width: 7rem;
      top: 4.3rem;
      line-height: 0.34rem;
      img {
        height: 0.34rem;
        vertical-align: top;
      }
    }
    .txt1.txt2 {
      top: 5.2rem;
    }
    .txt1.txt3 {
      top: 5.6rem;
    }
    .qr-code {
      position: absolute;
      top: 8.2rem;
      left: 3.44rem;
      width: 2.7rem;
      height: 2.7rem;
    }
    .txt1.txt5 {
      top: 11.2rem;
      text-align: center;
      left: 0;
      width: 100%;
      line-height: 0.95rem;
    }
  }
  .list {
    padding: 0.4rem 0.5rem 1rem;
    background-color: #1786f5;
    .list-content {
      background-color: #fff;
      border-radius: 0.2rem;
    }
  }
}
</style>
