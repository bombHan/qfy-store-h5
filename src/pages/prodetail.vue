<template>
  <div class="prodetail__Box" v-if="!loading">
    <Login v-if="!ispc" />
    <div class="top-image">
      <van-swipe :show-indicators="false" :loop="false" :autoplay="90000000" @change="onChange">
        <van-swipe-item v-for="(item, index) in pics" :key="index">
          <div class="topimg" :style="{backgroundImage: 'url('+item+')'}" @click="preview(item)">
            <span>{{index+1}}/{{pics.length}}</span>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="bgwhite pt30 pl20">
      <span class="colorred">
        <span class="fontSize20">￥</span>
        <span class="fontSize30">{{ goods.realPrice | _formatNum }}</span>
        <span class="fontSize20">{{ goods.realPrice | _formatNumPoint }}</span>
      </span>
      <span class="fontSize20 color128 linethrou ml30" v-if="goods.originalPrice">￥{{ goods.originalPrice }}</span>
      <!-- <div class="fr share">
        <img src="../assets/images/icon02.png" />
        <span class="color128 fontSize20">分享</span>
      </div> -->
    </div>
    <div class="bgwhite pt30 pl20 pr20 fontSize30 color51">
      {{ goods.goodsName }}
    </div>
    <div class="bgwhite pt20 pl20 pr20 pb30 fontSize24 color128" v-if="goods.showRemainStock == 1">
      剩余数量{{ goods.stock }}
    </div>
    <div class="shop bgwhite mt20 pl20 pr20">
      <div class="pt30 pb30">
        <span class="fl fontSize24 color128">店铺</span>
        <div class="fontSize24 color51">{{ shop.storeName }}</div>
      </div>
      <div class="pt20 pb30">
        <span class="fl fontSize24 color128">地址</span>
        <div class="fontSize24 color51">
          {{ shop.address }}
          <img class="fr adress" src="../assets/images/icon03.png" @click="gotoMap" />
        </div>
      </div>
    </div>
    <div class="bgwhite mt20 pl20 pr20 pt30 pb30">
      <div class="fontSize30 color51 pb10">购买须知</div>
      <div class="pt30">
        <span class="fontSize24 color128">有效期</span>
        <div v-if="goods.checkType==1" class="pt20 fontSize24 color51">购买后{{goods.checkRelativeDay}}天内有效</div>
        <div v-else class="pt20 fontSize24 color51">{{goods.checkSellStartDate | showTime}}至{{goods.checkSellEndDate | showTime}}</div>
      </div>
      <div class="pt30" v-if="goods.ruleTip">
        <span class="fontSize24 color128">规则提醒</span>
        <div class="pt20 fontSize24 color51 space">{{ goods.ruleTip }}</div>
      </div>
      <div class="pt30">
        <span class="fontSize24 color128" v-if="goods.warmTip">温馨提示</span>
        <div class="pt20 fontSize24 color51 space" style="line-height:0.48rem;">{{ goods.warmTip }}</div>
      </div>
    </div>
    <div class="bgwhite mt20 pl20 pr20 pt30 pb30" v-if="goods.detailPic && goods.detailPic.length">
      <div class="fontSize30 color51 pb10">产品详情</div>
      <img class="detail-img" v-for="(itm, idx) in goods.detailPic" :key="idx" :src="itm" />
    </div>

    <div class="status" v-if="goods.status==1">
      <div class="fontSize30 color255">店铺已打烊</div>
    </div>

    <div class="status status23" v-else-if="goods.status==3">
      <div class="fontSize30 color255 ss">商品已下架</div>
      <div class="fontSize30 color255 ss ss2" @click="gotoShop">查看店铺其他商品</div>
    </div>

    <div class="status" v-else-if="goods.status==2">
      <div class="fontSize30 color255">商品已售罄</div>
    </div>

    <div class="status" v-else-if="goods.ifExpire==0">
      <div class="fontSize30 color255">商品已无效</div>
    </div>

    <div class="status" v-else-if="goods.status===0">
      <div class="fontSize30 color255 bgcolorblue" @click="openShow">立即购买</div>
    </div>

    <van-popup v-model="showPopup" position="bottom">
      <div>
        <div class="sku pt30 pb40 pl20 pr20">
          <img class="fl" :src="goods.mainPic" />
          <div>
            <p class="fontSize30 color51 mt10 fw mb20 wi">{{ goods.goodsName }}</p>
            <span class="fontSize20 colorred">￥</span>
            <span class="fontSize30 colorred">{{ goods.realPrice | _formatNum }}</span>
            <span class="fontSize20 colorred">{{ goods.realPrice | _formatNumPoint }}</span>
          </div>
        </div>

        <div class="bgwhite pl20 pr20 pt20 pb30 car">
          <div class="color51 overflow">
            <span class="fontSize24 fl label">购买数量</span>
            <div class="fontSize0 fl ml20">
              <span v-if="num<=1" class="color128 btnnum border-right hh">－</span>
              <span v-else class="color128 btnnum border-right" @click="reduce">－</span>
              <input type="tel" maxlength="10" class="color51 btninput" v-model="num" ref="num" @blur="onblue" />
              <span v-if="goods.stock>num" class="color128 btnnum border-left" @click="add">＋</span>
              <span v-else class="color128 btnnum border-left hh" @click="add">＋</span>
            </div>
            <span class="fontSize24 fl ml20" v-if="goods.showRemainStock == 1">剩余{{ goods.stock }}件</span>
          </div>
          <div class="color51 overflow pt20 pb10">
            <span class="fontSize24 fl label"> 手机号</span>
            <div class="fontSize0 fl ml20">
              <input class="enter color51" type="tel" :maxlength="11" v-model="phone" />
            </div>
          </div>
        </div>

      </div>
      <button class="btn-next" @click="buy">下一步</button>
    </van-popup>
  </div>
</template>
<script>
import api from "@/api/index/index";
import myMixin from "@/components/mixins";
import Login from "@/components/login.vue";
export default {
  mixins: [myMixin],
  components: {
    Login
  },
  data() {
    return {
      showPopup: false,
      goodsId: "",
      shop: {},
      goods: {},
      pics: [],
      loading: true,
      num: 1,
      phone: "",
      ispc: false,
      index: 0
    };
  },
  created() {
    document.title = "产品详情";
    this.goodsId = this.$route.params.id;
    this.ispc = this.$route.query.pc;
    this.getDetail();
  },
  methods: {
    preview(item) {
      wx.previewImage({
        current: item,
        urls: this.pics
      });
    },
    onChange(index) {
      this.index = index;
    },
    getDetail() {
      this.loading = true;
      api
        .ajax({
          data: {
            goodsId: this.goodsId,
            type: this.ispc ? 0 : 1
          },
          method: "detailGoods"
        })
        .then(res => {
          const data = res.data.data;
          this.goods = data.goods;
          this.shop = data.store;
          this.pics = [data.goods.mainPic];
          this.pics = this.pics.concat(data.goods.noMainPicList);
          this.loading = false;
          document.title = data.goods.goodsName;
          if (window.__wxjs_environment === "miniprogram") {
            let origin =
              window.location.origin + "/#/prodetail/" + this.goodsId;
            origin = encodeURIComponent(origin);
            console.log(origin, "向小程序传数据");
            wx.miniProgram.postMessage({
              data: {
                type: "share",
                sahre_title: data.goods.shareDesc,
                sahre_pic: data.goods.mainPic,
                sahre_url: "/pages/h5share/h5share?url=" + origin
              }
            });
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    gotoMap() {
      if (this.shop.latitude && this.shop.longitude) {
        this.goto(`/map/${this.shop.latitude}/${this.shop.longitude}`);
      }
    },
    openShow() {
      if (this.ispc) {
        return;
      }
      this.showPopup = true;
    },
    add() {
      if (this.num >= this.goods.stock) {
        this.$toast("库存不足~");
        return;
      }
      this.num++;
    },
    onblue(e) {
      console.log(this.$refs.num.value);
      if (this.$refs.num.value) {
        let num = parseInt(this.$refs.num.value);
        if (num > this.goods.stock) {
          this.$toast("库存不足~");
          this.num = this.goods.stock;
        } else if (num < 1) {
          this.$toast("数量至少为1件");
          this.num = 1;
        }
      } else {
        this.num = 1;
      }
    },
    reduce() {
      if (this.num <= 1) {
        return this.$toast("数量至少为1件");
      }
      this.num--;
    },
    buy() {
      if (!this.phone) {
        return this.$toast("请输入手机号");
      } else {
        let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (!reg.test(this.phone)) {
          return this.$toast("请输入正确的手机号");
        }
      }
      if (!this.num) {
        return this.$toast("数量至少为1件");
      }
      this.goto(`/ordersubmit/${this.goodsId}/${this.num}/${this.phone}`);
    },
    gotoShop() {
      if (this.ispc) {
        return;
      }
      this.gotoh5share("/shop/" + this.shop.storeId);
    }
  }
};
</script>
<style scope lang="less">
.prodetail__Box {
  .space {
    white-space: pre-wrap;
  }
  .share {
    width: 1.5rem;
    height: 0.54rem;
    line-height: 0.54rem;
    text-align: center;
    background: rgba(244, 244, 244, 1);
    border-top-left-radius: 0.27rem;
    border-bottom-left-radius: 0.27rem;
    overflow: hidden;
    img {
      width: 0.28rem;
      height: 0.28rem;
      margin-top: 0.11rem;
    }
  }
  .shop {
    & > div {
      div {
        margin-left: 1.5rem;
      }
      .adress {
        padding: 0.15rem;
        margin-top: -0.1rem;
        width: 0.33333rem;
        height: 0.33333rem;
      }
    }
  }
  .detail-img {
    width: 100%;
  }
  .status {
    height: 1.17rem;
    position: relative;
    & > div {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1.17rem;
      line-height: 1.17rem;
      text-align: center;
      background: rgba(210, 210, 210, 1);
    }
    .bgcolorblue {
      background-color: rgba(62, 123, 248, 1);
    }
  }
  .status23 {
    height: 2.34rem;
    position: relative;
    .ss {
      position: fixed;
      bottom: 1.17rem;
      left: 0;
      width: 100%;
      height: 1.17rem;
      line-height: 1.17rem;
      text-align: center;
      background: rgba(210, 210, 210, 1);
    }
    .ss2 {
      bottom: 0;
      background-color: #ff9933;
    }
  }

  .btn-next {
    border: none;
    outline: none;
    height: 1.174rem;
    width: 100%;
    margin: 0;
    padding: 0;
    color: #fff;
    font-size: 0.4rem;
    background: rgba(62, 123, 248, 1);
  }
  .car {
    line-height: 1.08rem;
    padding-bottom: 2.2rem;

    .label {
      display: inline-block;
      vertical-align: top;
    }
    .btnnum {
      display: inline-block;
      vertical-align: top;
      border: 1px solid rgba(222, 222, 222, 1);
      height: 1.08rem;
      width: 1.08rem;
      background-color: #fff;
      text-align: center;
      font-size: 0.5rem;
      box-sizing: border-box;
    }
    .border-right {
      border-right: 0;
    }
    .border-left {
      border-left: 0;
    }
    .enter {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      box-shadow: none;
      -webkit-appearance: none;
      outline: none;
      border: 1px solid rgba(222, 222, 222, 1);
      background-color: #fff;
      text-align: left;
      height: 1.08rem;
      line-height: 1.06rem;
      padding: 0 10px;
      margin: 0;
      box-sizing: border-box;
      width: 5rem;
      font-size: 0.5rem;
      vertical-align: top;
    }
    .btninput {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      box-shadow: none;
      -webkit-appearance: none;
      outline: none;
      border: 1px solid rgba(222, 222, 222, 1);
      background-color: #fff;
      text-align: center;
      height: 1.08rem;
      line-height: 1.06rem;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      width: 1.3rem;
      font-size: 0.5rem;
      vertical-align: top;
      border-radius: 0;
    }
    .hh {
      border-color: rgba(234, 234, 234, 1);
      color: rgba(199, 199, 199, 0.8);
    }
  }

  .sku {
    display: flex;
    border-bottom: 1px solid rgba(222, 222, 222, 0.8);
    & > img {
      flex: 0 0 1.6rem;
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 5px;
    }
    & > div {
      margin-left: 0.3rem;
      flex: 0 0 7.6rem;
      width: 7.6rem;
    }
  }
}
</style>
<style lang="less">
.prodetail__Box {
  .top-image {
    width: 100%;
    height: 8.666667rem;
    overflow: hidden;
  }
  .van-swipe {
    height: 8.666667rem;
    .topimg {
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      span {
        position: absolute;
        right: 10px;
        bottom: 10px;
        background-color: rgba(0, 0, 0, 0.5);
        width: 30px;
        height: 18px;
        border-radius: 9px;
        line-height: 18px;
        color: #fff;
        text-align: center;
      }
    }
  }
}
</style>