<template>
  <div class="index__Box">
    <Login />
    <div class="search-box mt20 ml20 mr20">
      <div class="search" :class="{ seinput: !isSearch }">
        <van-field class="input-box" @focus="onFocus" @blur="onBlur" v-model="searchText" />
        <div class="search-btn fontSize24 color128" v-if="isSearch" @click="onSearch">搜索</div>
      </div>
    </div>
    <van-list v-model="loading" :finished="finished" finished-text=" " @load="loadMore">
      <div class="pro pl20 pr20 pb50">

        <div class="bgwhite mt20" v-for="(item, index) in list" :key="index">
          <div class="pro-image">
            <img :src="item.logo" />
          </div>
          <div class="p20 fontSize30 pingFang color51 ellipsis">{{ item.storeName }}</div>
          <div class="pl20 pr20 pb20 textcenter fontSize0">
            <button class="goto fontSize30 pingFang color128" @click="gotoh5share('/shop/' + item.storeId)">进店</button>
          </div>
        </div>

      </div>
    </van-list>

    <div class="holdpic" v-if="list&&list.length===0">
      <img src="../assets/images/bg04.png" />
      <p>暂无数据</p>
    </div>

    <div class="tabbar-box">
      <van-tabbar v-model="active" safe-area-inset-bottom @change="gotoTabbar('/my')">
        <van-tabbar-item>
          <img class="tabbar" src="../assets/images/tabbar01-active.png" />
          <span class="tabbar-txt" style="color:#1989fa;">首页</span>
        </van-tabbar-item>
        <van-tabbar-item>
          <img class="tabbar" src="../assets/images/tabbar02.png" />
          <span class="tabbar-txt" style="color:#7d7e80;">我的</span>
        </van-tabbar-item>
      </van-tabbar>
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
      active: 0,
      list: [],
      loading: false,
      finished: false,
      pager: {
        currentPage: 0,
        pageSize: 10,
        totalPage: 0
      },
      isSearch: false,
      searchText: ""
    };
  },
  created() {
    document.title = "慧云商城";
  },
  methods: {
    onFocus() {
      this.isSearch = true;
    },
    onBlur() {
      if (!this.searchText) {
        this.isSearch = false;
        this.getlist();
      }
    },
    onSearch() {
      this.getlist();
    },
    getlist() {
      let data = {
        currentPage: 1,
        pageSize: 10,
        searchText: this.searchText || ""
      };
      this.loading = true;
      api
        .ajax({
          data: data,
          method: "storeList"
        })
        .then(res => {
          const data = res.data.data;
          this.list = data.list;
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
    loadMore() {
      this.pager.currentPage += 1;
      let params = {
        ...this.pager,
        searchText: this.searchText || ""
      };
      this.loading = true;
      api
        .ajax({
          data: params,
          method: "storeList"
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
.index__Box {
  .tabbar-box {
    height: 50px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .tabbar {
      width: 20px;
    }
    .tabbar-txt {
      line-height: 19px;
      margin-left: 5px;
    }
  }

  .search-box {
    border-radius: 0.1rem;
    overflow: hidden;
    height: 1.06rem;
    background-color: #fff;
    text-align: center;
    .search {
      display: flex;
      .input-box {
        flex: 1;
      }
      .search-btn {
        flex: 0 0 1rem;
        line-height: 1.06rem;
      }
    }
    .seinput {
      flex: 1;
      input {
        background: url("../assets/images/icon09.png") no-repeat center center;
        background-size: 1.36rem 0.42rem;
      }
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
    .goto {
      box-sizing: border-box;
      width: 2rem;
      height: 0.8rem;
      border: 1px solid rgba(191, 191, 191, 0.5);
      border-radius: 0.36rem;
      text-align: center;
      background-color: #fff;
      outline: none;
    }
  }
}
</style>
