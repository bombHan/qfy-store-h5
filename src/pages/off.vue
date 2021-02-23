<template>
  <div class="off__Box">
    <div class="buyer bgwhite p20 fontSize0">
      <span class="fontSize30 ml20 pingFang color51">订单编号：{{orderObj.orderNum}}</span>
    </div>

    <div class="shop bgwhite mt20 pl20 pr20 pt30 fontSize0">
      <img src="../assets/images/ava.png" />
      <span class="fontSize30 ml20 pingFang color51">{{checkUser.name}}</span>
      <span class="fontSize30 ml20 pingFang color51 fr">{{checkUser.phoneNumber}}</span>
    </div>

    <div class="pro bgwhite pl40 pr20 pt30 pb40">
      <div class="pro-image fl">
        <img :src="orderObj.waresPictrueUrl" />
      </div>
      <div class="pro-content fontSize0">
        <div class="mt10">
          <span class="fontSize20 colorred">￥</span>
          <span class="fontSize30 colorred">{{orderObj.waresPrice}}</span>
          <span class="fontSize20 color128 fr">x{{orderObj.waresCount}}</span>
        </div>
        <div class="fontSize30 color51 mt35 fw ellipsis">{{orderObj.waresName}}</div>
      </div>
    </div>

    <div class="bgwhite pl20 pr20 pt30 pb30 mt20 color51 car">
      <span class="fontSize24">使用次数（剩余<span class="colorred">{{max}}</span>张)</span>
      <div class="fr fontSize0">
        <button class="color128" @click="reduce">－</button>
        <input disabled v-model="num" />
        <button class="color128" @click="add">＋</button>
      </div>
    </div>

    <div class="bgwhite pl20 pr20 mt20 color51">
      <div class="pt45 fontSize30">核销码</div>
      <div class="pt40 pb20" v-for="item in orderObj.checks" :key="item.id">
        <span class="fontSize24">{{item.checkCode}}</span>
        <span class="fontSize24 ml50 fr">{{
            item.state == 1
              ? "待核销"
              : item.state == 2
              ? "已核销"
              : item.state == 3
              ? "已失效"
              : ""
          }}</span>
      </div>
    </div>

    <div class="btn-box fontSize0">
      <div>
        <div class="num pl20">
          <span class="color151 fontSize24">合计</span>
          <span class="colorred fontSize24">￥</span>
          <span class="colorred fontSize30">{{orderObj.practicalDealPrice}}</span>
        </div>
        <div class="btn color255 fontSize30" @click="check" v-if="max">确定使用</div>
        <div class="btn color255 fontSize30" style="background: rgba(210, 210, 210, 1);" v-else-if="invalidNum">此订单已失效</div>
        <div class="btn color255 fontSize30" style="background: rgba(210, 210, 210, 1);" v-else>此订单已核销</div>
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
      orderObj: {},
      num: 1,
      max: 0,
      checkUser: {},
      invalidNum: 0,
      isclick: true
    };
  },
  created() {
    document.title = "慧云商城";
    let checkUser = window.localStorage.getItem("checkUser");
    checkUser = checkUser && JSON.parse(checkUser);
    if (checkUser && checkUser.token) {
      this.getDetail();
      this.checkUser = checkUser;
    } else {
      this.$router.push({
        path: "/offlogin?id=" + this.$route.params.id
      });
    }
  },
  methods: {
    getDetail() {
      this.max = 0;
      this.invalidNum = 0;
      api
        .ajax({
          data: { id: this.$route.params.id },
          method: "checkInfoOrder",
          type: "check"
        })
        .then(res => {
          if (res.data.code === 403) {
            this.$router.push(`/offlogin?id=${this.$route.params.id}`);
          } else {
            const data = res.data.data;
            this.orderObj = data;
            for (let i = 0; data.checks && i < data.checks.length; i++) {
              if (data.checks[i].state == 1) {
                this.max++;
              } else if (data.checks[i].state == 3) {
                this.invalidNum++;
              }
            }
          }
        })
        .catch(error => {
          console.log("error", error);
          if (error.data.code === 403) {
            this.$router.push(`/offlogin?id=${this.$route.params.id}`);
          }
        });
    },
    add() {
      if (this.num >= this.max) {
        this.$toast("剩余审核次数" + this.max + "~");
        return;
      }
      this.num++;
    },
    reduce() {
      if (this.num <= 1) {
        return;
      }
      this.num--;
    },
    check() {
      if (this.num <= 0) {
        return this.$toast("数量至少为1");
      }
      if (this.isclick) {
        this.isclick = false;
        api
          .ajax({
            data: { checkCount: this.num, orderId: this.$route.params.id },
            method: "checkBatch",
            type: "check"
          })
          .then(res => {
            this.$toast(res.data.message);
            this.num = 1;
            this.isclick = true;
            this.getDetail();
          })
          .catch(error => {
            this.isclick = true;
            console.log("error", error);
            if (error.data.code === 403) {
              this.$router.push(`/offlogin?id=${this.$route.params.id}`);
            }
          });
      }
    }
  }
};
</script>
<style scope lang="less">
.off__Box {
  .car {
    line-height: 1.08rem;
    span {
      display: inline-block;
      vertical-align: top;
    }
    input,
    button {
      height: 1.08rem;
      padding: 0;
      margin: 0;
      background-color: #fff;
      outline: none;
      border: none;
      width: 1.08rem;
      text-align: center;
      font-size: 0.5rem;
      border: 1px solid rgba(222, 222, 222, 1);
      box-sizing: border-box;
      vertical-align: top;
    }
    input {
      font-size: 0.4rem;
      border-right: none;
      border-left: none;
    }
  }
  .buyer {
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
