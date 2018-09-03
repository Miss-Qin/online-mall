<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/goods.html">购物商城</a> &gt;
                <a href="/goods/42/1.html">商品详情</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper clearfix">
                <div class="wrap-box">
                    <div class="left-925">
                        <div class="goods-box clearfix">
                            <div class="pic-box">
                                <ProductZoomer v-if="images.normal_size.length" :base-images="images" :base-zoomer-options="zoomerOptions" />
                            </div>
                            <div class="goods-spec">
                                <h1>{{goodsinfo.title}}</h1>
                                <p class="subtitle">{{goodsinfo.sub_title}}</p>
                                <div class="spec-box">
                                    <dl>
                                        <dt>货号</dt>
                                        <dd id="commodityGoodsNo">{{goodsinfo.goods_no}}</dd>
                                    </dl>
                                    <dl>
                                        <dt>市场价</dt>
                                        <dd>
                                            <s id="commodityMarketPrice">¥{{goodsinfo.market_price}}</s>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>销售价</dt>
                                        <dd>
                                            <em id="commoditySellPrice" class="price">¥{{goodsinfo.sell_price}}</em>
                                        </dd>
                                    </dl>
                                </div>
                                <div class="spec-box">
                                    <dl>
                                        <dt>购买数量</dt>
                                        <dd>
                                            <div class="stock-box">
                                                <el-input-number size="small" v-model="buyCount" @change="buyCountChange" :min="0" :max="goodsinfo.stock_quantity" label="描述文字"></el-input-number>
                                            </div>
                                            <span class="stock-txt">
                                                库存
                                                <em id="commodityStockNum">{{goodsinfo.stock_quantity}}</em>件
                                            </span>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dd>
                                            <div id="buyButton" class="btn-buy">
                                                <button onclick="cartAdd(this,'/',1,'/shopping.html');" class="buy">立即购买</button>
                                                <button @click="cartAdd(this,'/',0,'/cart.html');" class="add">加入购物车</button>
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div id="goodsTabs" class="goods-tab bg-wrap">
                            <Affix>
                                <div id="tabHead" class="tab-head" style="position: static; top: 517px; width: 925px;">
                                    <ul>
                                        <li>
                                            <a href="javascript:;" @click="showClass=false" :class="{selected:!showClass}">商品介绍</a>
                                        </li>
                                        <li>
                                            <a href="javascript:;" @click="showClass=true" :class="{selected:showClass}">商品评论</a>
                                        </li>
                                    </ul>
                                </div>
                            </Affix>
                            <div class="tab-content entry" style="display: block;" v-show="!showClass" v-html="goodsinfo.content">
                            </div>
                            <div class="tab-content" style="display: block;" v-show="showClass">
                                <div class="comment-box">
                                    <div id="commentForm" name="commentForm" class="form-box">
                                        <div class="avatar-box">
                                            <i class="iconfont icon-user-full"></i>
                                        </div>
                                        <div class="conn-box">
                                            <div class="editor">
                                                <textarea id="txtContent" name="txtContent" v-model.trim="commentInfo" sucmsg=" " datatype="*10-1000" nullmsg="请填写评论内容！"></textarea>
                                                <span class="Validform_checktip"></span>
                                            </div>
                                            <div class="subcon">
                                                <input id="btnSubmit" name="submit" @click="submitComment" type="submit" value="提交评论" class="submit">
                                                <span class="Validform_checktip"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul id="commentList" class="list-box">
                                        <p v-show="commments.message == undefined" style="margin: 5px 0px 15px 69px; line-height: 42px; text-align: center; border: 1px solid rgb(247, 247, 247);">暂无评论，快来抢沙发吧！</p>
                                        <li v-for="item in commments.message" :key="item.id">
                                            <div class="avatar-box">
                                                <i class="iconfont icon-user-full"></i>
                                            </div>
                                            <div class="inner-box">
                                                <div class="info">
                                                    <span>{{item.user_name}}</span>
                                                    <span>{{item.add_time}}</span>
                                                </div>
                                                <p>{{item.content}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="page-box" style="margin: 5px 0px 0px 62px;">
                                        <Page :total="totalCount" show-sizer show-elevator :page-size-opts="[5, 6,10, 13, 26]" placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="left-220">
                        <div class="bg-wrap nobg">
                            <div class="sidebar-box">
                                <h4>推荐商品</h4>
                                <ul class="side-img-list">
                                    <li v-for="item in hotgoodslist" :key="item.id">
                                        <div class="img-box">
                                            <!-- <a :href="'/#/detail/'+item.id" class=""> -->
                                            <router-link :to="'/detail/'+item.id">
                                                <img :src="item.img_url">
                                            </router-link>
                                            <!-- </a> -->
                                        </div>
                                        <div class="txt-box">
                                            <router-link :to="'/detail/'+item.id">{{item.title}}</router-link>
                                            <span>{{item.add_time | capitalize}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <BackTop></BackTop>
        <!-- 移动的小图片 -->
        <img v-if="imglist.length!=0" class="moveImg" style="display:none" :src="imglist[0].original_path" alt="">
    </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      buyCount: 0,
      showClass: false,
      productId: undefined,
      goodsinfo: {},
      hotgoodslist: [],
      imglist: [],

      images: { normal_size: [] },
      zoomerOptions: {
        zoomFactor: 4,
        pane: "container",
        hoverDelay: 300,
        namespace: "container-zoomer",
        move_by_click: true,
        scroll_items: 4,
        choosed_thumb_border_color: "#ff3d00"
      },

      pageNum: 1, //页码
      pageSize: 10, //页容量
      totalCount: 0, //数据总条数
      commments: {}, //存储获取的评论
      commentInfo: "" //发表的评论
    };
  },
  methods: {
    buyCountChange() {
      // console.log(this.buyCount)
    },
    // 获取所有评论信息
    getComments() {
      this.$axios
        .get(
          `/site/comment/getbypage/goods/${this.productId}?pageIndex=${
            this.pageNum
          }&pageSize=${this.pageSize}`
        )
        .then(response => {
          this.commments = response.data;
          this.totalCount = response.data.totalcount;
        });
    },
    getgoodsinfo() {
      this.productId = this.$route.params.id;
      this.$axios
        .get(`/site/goods/getgoodsinfo/${this.productId}`)
        .then(response => {
          this.hotgoodslist = response.data.message.hotgoodslist;
          this.goodsinfo = response.data.message.goodsinfo;
          this.imglist = response.data.message.imglist;
          this.imglist.forEach(v => {
            this.images.normal_size.push({
              id: v.id,
              url: v.original_path
            });
          });
        });
    },
    //页码改变
    pageChange(num) {
      this.pageNum = num;
      this.getComments();
    },
    // 页容量改变
    pageSizeChange(size) {
      this.pageSize = size;
      this.getComments();
    },
    //提交评论
    submitComment() {
      if (!this.commentInfo) {
        this.$Message.error("哥们,写点东西吧");
        return;
      }
      this.$axios
        .post(`/site/validate/comment/post/goods/${this.productId}`, {
          commenttxt: this.commentInfo
        })
        .then(response => {
          this.$Message.success(response.data.message);
          this.getComments();
          this.commentInfo = "";
        });
    },
    cartAdd() {
      if (!this.buyCount) {
        this.$Message.error("请选择商品数量");
        return;
      }
      let cartOffset = $(".add").offset();
      let targetOffset = $(".icon-cart").offset();
      $(".moveImg")
        .stop()
        .show()
        .addClass("move")
        .css(cartOffset)
        .animate(targetOffset, 1000, function() {
          $(this)
            .hide()
            .removeClass("move");
        });

      // 直接修改购物车商品数据
      this.$store.commit("addGoods", {
        goodId: this.productId,
        goodNum: this.buyCount
      });
    }
  },
  created() {
    this.getgoodsinfo();
    this.getComments();
  },
  watch: {
    $route(val, oldVal) {
      this.buyCount = 0;
      this.images.normal_size = [];
      this.getgoodsinfo();
    }
  }
};
</script>

<style lang="less">
.tab-content img {
  width: 100%;
  /* 去除图片底部的 间隙 */
  display: block;
}
.pic-box {
  width: 395px;
  .control-box .thumb-list {
    display: flex;
    justify-content: center;
    img {
      width: 80px;
      height: 80px;
      margin: 2px;
    }
  }
  .control {
    //   text-align:center;
    display: flex;
    // 主轴
    justify-content: center;
    // 纵轴 副轴 侧轴
    align-items: center;
  }
}

.moveImg {
  position: absolute;
  width: 50px;
}
.moveImg.move {
  transition: transform 1s, opacity 1s;
  opacity: 0.5;
  transform: scale(0.2) rotate(7200deg);
}
</style>


