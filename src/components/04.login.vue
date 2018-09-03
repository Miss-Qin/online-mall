<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/login.html">会员登录</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <div class="nav-tit">
                        <a class="selected" href="javascript:;">账户登录</a>
                        <i>|</i>
                        <a href="/register.html">免费注册</a>
                    </div>

                    <div id="loginform" name="loginform" class="login-box">
                        <Input v-model="userName" placeholder="请输入用户名" size="large" />
                        <br>
                        <br>
                        <Input v-model="password" placeholder="请输入密码" size="large" type="password" />
                        <br>
                        <br>
                        <div class="btn-box">
                            <input id="btnSubmit" name="btnSubmit" type="submit" @click="doLogin" value="立即登录">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      userName: "",
      password: "",
      isShow: true
    };
  },
  methods: {
    doLogin() {
      this.$axios
        .post(`/site/account/login`, {
          user_name: this.userName,
          password: this.password
        })
        .then(response => {
          if (response.data.status == 0) {
            //   设置顶部通栏右盒子内容为'会员中心'和'退出'
            this.$store.commit("changeLoginStatus", true);
            // 登录成功后返回之前的页面
            this.$router.push(this.$store.state.fromPath);
          }
        });
    }
  }
};
</script>

<style>
</style>

