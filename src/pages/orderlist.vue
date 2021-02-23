<template>
  <div class="orderlist__Box">
    <div class="tab-bar">
      <van-tabs background="transparent" title-inactive-color="#333" title-active-color="#3E7BF8" v-model="activeName" @change="changeActiveName">
        <van-tab title="全部" :name="0"></van-tab>
        <van-tab title="待付款" :name="1"></van-tab>
        <van-tab title="待使用" :name="2"></van-tab>
        <van-tab title="已完成" :name="3"></van-tab>
      </van-tabs>
    </div>

    <van-list v-model="loading" :finished="finished" finished-text=" " @load="loadMore">

      <div v-for="(itm, idx) in list" :key="idx" class="radius30 bgwhite mt20 ml20 mr20" @click="goto('/orderdetail/' + itm.id)">
        <div class="shop pl20 pr20 pt30 fontSize0">
          <img :src="itm.storeLogo" @click.stop="gotoh5share('/shop/' + itm.storeId)" />
          <span class="fontSize30 ml20 pingFang color51" @click.stop="gotoh5share('/shop/' + itm.storeId)">
            {{ itm.storeName }}
          </span>
          <img class="arrow" src="../assets/images/icon01.png" @click.stop="gotoh5share('/shop/' + itm.storeId)" />
          <span class="fr fontSize30 tag">{{
          itm.state == 1
            ? "待付款"
            : itm.state == 2
            ? "待使用"
            : itm.state == 3
            ? "已完成"
            : itm.state == 4
            ? "已关闭"
            : ""
        }}</span>
        </div>

        <div class="pro pl20 pr20 pt40 pb40">
          <div class="pro-image fl">
            <img :src="itm.waresPictrueUrl" />
          </div>
          <div class="pro-content fontSize0">
            <div class="name-num mt10">
              <div class="fontSize30 color51 name fl">
                {{ itm.waresName }}
              </div>
              <div class="fontSize20 color128 fr">x{{ itm.waresCount }}</div>
            </div>
            <div class="fontSize24 color128 mt15">地址:{{ itm.storeArea }}</div>
            <div class="fontSize24 color128 mt15">
              有效期:
              {{ itm.validStartTime  | showTime }}-{{itm.validEndTime | showTime }}
            </div>
          </div>
        </div>
        <div class="price p20">
          共1件 合计￥<span class="fontSize30 color51">{{
          itm.practicalDealPrice | _formatNum
        }}</span>{{ itm.practicalDealPrice | _formatNumPoint }}
        </div>
        <div class="price p20" v-if="itm.state == 1">
          <button class="cancel" @click="cancelOrder(itm.id, idx)">取消</button>
          <button class="cancel pay" @click.stop="pay(itm.id)">付款</button>
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
export default {
  mixins: [myMixin],
  data() {
    return {
      activeName: 0,
      list: [],
      loading: false,
      finished: false,
      pager: {
        currentPage: 0,
        pageSize: 10,
        totalPage: 0
      }
    };
  },
  created() {
    document.title = "订单列表";
    this.activeName = parseInt(this.$route.params.type);
  },
  methods: {
    changeActiveName(e) {
      this.activeName = e;
      this.pager = {
        currentPage: 0,
        pageSize: 10,
        totalPage: 0
      };
      this.loadMore();
    },
    loadMore() {
      this.pager.currentPage += 1;
      this.loading = true;
      api
        .ajax({
          data: {
            ...this.pager,
            state: this.activeName || ""
          },
          method: "buyerListPageOrder"
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
    },
    cancelOrder(id, idx) {
      api
        .ajax({
          data: { id },
          method: "buyerCancelOrder"
        })
        .then(res => {
          this.$toast.success(res.data.message);
          this.list[idx].state = 4;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    pay(id) {
      api
        .ajax({
          data: { id },
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
                  url: `/pages/pay/pay?id=${id}&token=${window.localStorage.getItem(
                    "token"
                  )}`
                });
              });
          } else {
            wx.miniProgram.redirectTo({
              url: `/pages/pay/pay?id=${id}&token=${window.localStorage.getItem(
                "token"
              )}`
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
.orderlist__Box {
  padding-bottom: 30px;
  .shop {
    img {
      width: 0.533333rem;
      height: 0.533333rem;
      border-radius: 5px;
    }
    .arrow {
      width: 0.186666rem;
      height: 0.32rem;
      margin-top: 0.13rem;
    }
    span {
      line-height: 0.533333rem;
    }
    .tag {
      color: rgba(249, 153, 33, 1);
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
      margin-left: 2.666667rem;
      .name-num {
        overflow: hidden;
        .fr {
          line-height: 0.5rem;
        }
        .name {
          line-height: 0.5rem;
          width: 4.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

  .price {
    text-align: right;
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
<style lang="less">
.orderlist__Box {
  .tab-bar {
    .van-tabs__line {
      background-color: rgba(62, 123, 248, 1);
    }
  }
}
</style>
