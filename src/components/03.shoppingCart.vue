<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/cart.html">购物车</a>
            </div>
        </div>

        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <!--购物车头部-->
                    <div class="cart-head clearfix">
                        <h2>
                            <i class="iconfont icon-cart"></i>我的购物车</h2>
                        <div class="cart-setp">
                            <ul>
                                <li class="first active">
                                    <div class="progress">
                                        <span>1</span>
                                        放进购物车
                                    </div>
                                </li>
                                <li>
                                    <div class="progress">
                                        <span>2</span>
                                        填写订单信息
                                    </div>
                                </li>
                                <li class="last">
                                    <div class="progress">
                                        <span>3</span>
                                        支付/确认订单
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--购物车头部-->
                    <!--商品列表-->
                    <div class="cart-box">
                        <input id="jsondata" name="jsondata" type="hidden">
                        <table width="100%" align="center" class="cart-table" border="0" cellspacing="0" cellpadding="8">
                            <tbody>
                                <tr>
                                    <th width="48" align="center">
                                        <a>选择</a>
                                    </th>
                                    <th align="left" colspan="2">商品信息</th>
                                    <th width="84" align="left">单价</th>
                                    <th width="104" align="center">数量</th>
                                    <th width="104" align="left">金额(元)</th>
                                    <th width="54" align="center">操作</th>
                                </tr>
                                <tr v-show="!productList.length">
                                    <td colspan="10">
                                        <div class="msg-tips">
                                            <div class="icon warning">
                                                <i class="iconfont icon-tip"></i>
                                            </div>
                                            <div class="info">
                                                <strong>购物车没有商品！</strong>
                                                <p>您的购物车为空，
                                                    <a href="/index.html">马上去购物</a>吧！</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-for="item in productList" :key="item.id">
                                    <td>
                                        <el-switch v-model="item.selected" active-color="#13ce66" inactive-color="#ff4949">
                                        </el-switch>
                                    </td>
                                    <td>
                                        <img :src="item.img_url" alt="" width="60px">
                                    </td>
                                    <td>{{item.title}}</td>
                                    <td>{{item.sell_price}}</td>
                                    <td>
                                        <el-input-number v-model="item.buycount" @change="numChange(item.id,$event)" :min="1" :max="item.max" size="mini"></el-input-number>
                                    </td>
                                    <td>{{item.sell_price*item.buycount}}</td>
                                    <td><el-button size="mini" type="danger" @click="doDelete(item.id)" icon="el-icon-delete" circle></el-button></td>
                                </tr>
                                <tr>
                                    <th align="right" colspan="8">
                                        已选择商品
                                        <b class="red" id="totalQuantity">{{totalCount}}</b> 件 &nbsp;&nbsp;&nbsp; 商品总金额（不含运费）：
                                        <span class="red">￥</span>
                                        <b class="red" id="totalAmount">{{totalPrice}}</b>元
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--/商品列表-->
                    <!--购物车底部-->
                    <div class="cart-foot clearfix">
                        <div class="right-box">
                            <router-link to="/index">
                                <button class="button" onclick="javascript:location.href='/index.html';">继续购物</button>
                            </router-link>
                            <button class="submit" @click="loginAndSubmit">立即结算</button>
                        </div>
                    </div>
                    <!--购物车底部-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "shoppingCart",
  data() {
    return {
      productList: []
    };
  },
  created() {
    let idArr = [];
    let cartDate = this.$store.state.cartDate;
    for (var key in cartDate) {
      idArr.push(key);
    }
    let idStr = idArr.join(",");
    this.$axios.get(`/site/comment/getshopcargoods/${idStr}`).then(response => {
      response.data.message.forEach(v => {
        v.buycount = cartDate[v.id];
        v.selected = true;
        // 获取最大的库存,并保存在v.max变量中
        this.$axios.get(`/site/goods/getgoodsinfo/${v.id}`).then(response => {
          v.max = response.data.message.goodsinfo.stock_quantity;
        });
      });
      this.productList = response.data.message;
    });
  },
  methods: {
    numChange(id, num) {
      // 判断买家选择的数量是否大于库存
      this.productList.forEach(v => {
        if (v.id == id) {
          if (v.max < num) {
            num = v.max;
          }
        }
      });
      this.$store.commit("updateGoods", {
        goodId: id,
        goodNum: num
      });
    },
    doDelete(id) {
      this.$store.commit("deleteGoods", id);
      this.productList.forEach((v, i) => {
        if (v.id == id) {
          this.productList.splice(i, 1);
        }
      });
    },
    loginAndSubmit() {
      if (!this.totalPrice) {
        this.$message.error("请挑选购买商品");
        return;
      }
      let ids = [];
      this.productList.forEach(v => {
        if (v.selected) {
          ids.push(v.id);
        }
      });
      ids = ids.join(",");
      this.$router.push(`/order/${ids}`);
    }
  },
  computed: {
    totalPrice() {
      let totalPrice = 0;
      this.productList.forEach(v => {
        if (v.selected == true) {
          totalPrice += v.buycount * v.sell_price;
        }
      });
      return totalPrice;
    },
    totalCount() {
      let totalCount = 0;
      this.productList.forEach(v => {
        if (v.selected == true) {
          totalCount += parseInt(v.buycount);
        }
      });
      return totalCount;
    }
  }
};
</script>

<style>
</style>


