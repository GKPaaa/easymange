<template>
  <div class="login-bg h-100per">
    <!-- 登录框 -->
    <div class="df pr">
      <!-- <div class="login-name">
        <img src="@/assets/logo.png">
        <div class="box">
          <div class="name">员工常见问题问答</div>
          <div class="tip">tao bao ren wu guan li hou tai</div>
        </div>
      </div> -->
      <div class="w-680 h-680 bc-f2fa df ai-ct jc-ct">
        <img src="@/assets/login/loginImg.png" class="w-548">
      </div>
      <div class="login-box bc-f pt-100 pb-80 df ai-ct jc-ct self-defined-classname" id="self_defined_element">
        <!-- <div class="login-label cl-3978" @click="logininto">点击扫码登录</div> -->
        <!-- <a :href="loginhref" v-if="loginhref" class="fs-30 fw-6 "> 点击扫码登录 </a> -->
        <!-- <div style="margin: 76px 56px 0" class="df ai-ct fd-col"> -->
        <!-- <a-input class="login-input fs-16 lh-24 br-4 w-368" v-model:value="username" placeholder="请输入账号" />
          <a-input class="login-input fs-16 lh-24 br-4 mt-24 w-368" v-model:value="password" placeholder="请输入登录密码"
            type="password" />
          <div class="mt-16 w-368">
            <a-checkbox v-model:checked="remember">记住密码</a-checkbox>
          </div> -->
        <!-- 
          <a-button :loading="loading" :disabled="disabled" type="primary" html-type="submit"
            class="w-368 h-40 br-4 mt-24" @click="login">
            登 录
          </a-button> -->
        <!-- </div> -->
      </div>
    </div>

  </div>
</template>
<script setup>
import { onBeforeMount, ref, onMounted } from "vue";
const loginhref = ref(null)
// 接口引入
import { login, islogin, logincode } from "@/apis/get";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
const router = useRouter()
onBeforeMount(() => {
  if (router.currentRoute.value.query.loginfailed == 1) {
    message.error('当前用户暂无权限，请联系管理员开通后登录')
  }
  // islogin()
  logincode().then(res => {
    if (res.success) {
      loginhref.value = res.data.url
    }
  }).catch(error => {
    // console.log(error);
  })
});
onMounted(() => {
  let url;
  if (process.env.NODE_ENV === "development") {

    url = "https://dingbot-test.bookuu.com/robot";
  } else {
    url =
      window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port +
      "/robot";
  }
  // STEP3：在需要的时候，调用 window.DTFrameLogin 方法构造登录二维码，并处理登录成功或失败的回调。
  window.DTFrameLogin(
    {
      id: 'self_defined_element',
      width: 500,
      height: 500,
    },
    {
      // redirect_uri: encodeURIComponent('http://test.xiaosache.com/login'),
      redirect_uri: encodeURIComponent(url + '/user/login'),


      // redirect_uri: 'http%3A%2F%2Flocalhost%2Flogin',
      client_id: 'dingbujreqm19wnfnkqo',
      scope: 'openid',
      response_type: 'code',
      state: 'pc',
      prompt: 'consent',
    },
    (loginResult) => {
      const { redirectUrl, authCode, state } = loginResult;
      // 这里可以直接进行重定向
      window.location.href = redirectUrl;
      // 也可以在不跳转页面的情况下，使用code进行授权
    },


    (errorMsg) => {
      // 这里一般需要展示登录失败的具体原因
      alert(`Login Error: ${errorMsg}`);
    },

  );
})

</script>
<!-- <script>
import { defineComponent, reactive, computed, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import JSEncrypt from "jsencrypt";

// base64加密
import { Base64 } from "js-base64";
// 接口引入
import { login, islogin } from "@/apis/get";


export default defineComponent({
  setup() {
    const router = useRouter();
    const vuex = useStore();

    /*--定义data--*/
    const state = reactive({
      username: "", //账户
      password: "", //密码
      remember: false, //记住密码
      loading: false, // 登录状态
    });

    /*--处理computed--*/
    // 按钮禁用态
    const computeds = {
      disabled: computed(() => {
        return !(state.username && state.password);
      }),
    };

    /* ------------------------------处理生命周期 ------------------------------*/
    onMounted(() => {
      methods.getCookie(); //读取Cookie初始化用户和密码
    });

    /*--定义methods--*/
    const methods = {
      // 登录
      login: function () {
        login()
        // const res = req({
        //   url: '/user/getDingTalkQrCode',
        //   methods: 'GET'
        // })
        // // router.push("/home");
        // let data = {
        //   url: '/user/getDingTalkQrCode'
        //   // method: '/user/getDingTalkQrCode'
        // }
        // HTTP_GET(data).then((res) => {
        //   console.log(res);
        // })
        // let data = {
        //   method: "passport.login",
        //   data: JSON.stringify({
        //     username: state.username,
        //     password: state.password,
        //   }),
        // };
        // state.loading = true;
        // HTTP_POST(data).then((res) => {
        //   if (res && res.status == 1) {
        //     message.success(res.message, 2, function () {
        //       router.push("/home");
        //     });
        //     // localStorage存储
        //     localStorage.setItem("userId", res.info.user_id);
        //     localStorage.setItem("realname", res.info.realname);
        //     localStorage.setItem("loginState", "1");

        //     // 设置cookie值记住密码
        //     if (state.remember) {
        //       methods.setCookie(
        //         state.username,
        //         Base64.encode(state.password),
        //         7
        //       );
        //     } else {
        //       methods.setCookie("", "", -1); // 修改2值都为空，天数为负1天就好了
        //     }
        //   } else {
        //     if (res && res.message) {
        //       message.error(res.message);
        //     }
        //     state.loading = false;
        //   }
        // }).catch((res) => {
        //   state.loading = false;
        // });
      },

      // 设置cookie
      setCookie(userName, password, days) {
        let date = new Date(); // 获取时间
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days); // 保存的天数
        // 字符串拼接cookie
        window.document.cookie =
          "userName" + "=" + userName + ";path=/;expires=" + date.toGMTString();
        window.document.cookie =
          "password" + "=" + password + ";path=/;expires=" + date.toGMTString();
      },
      // 读取cookie 将用户名和密码回显到input框中
      getCookie() {
        if (document.cookie.length > 0) {
          //分割成一个个独立的“key=value”的形式
          let arr = document.cookie.split("; ");
          for (let i = 0; i < arr.length; i++) {
            // 再次切割，arr2[0]为key值，arr2[1]为对应的value
            let arr2 = arr[i].split("=");
            if (arr2[0] === "userName") {
              state.username = arr2[1];
            } else if (arr2[0] === "password") {
              state.password = Base64.decode(arr2[1]); // base64解密
              state.remember = true;
            }
          }
        }
      },
    };

    /*--返回数据--*/
    // Object.assign 可以简化返回值，但不知道原因->ES6语法
    return Object.assign({ ...toRefs(state) }, computeds, methods);
  },
});
</script> -->
<style lang="less" scoped>
.pl-140 {
  padding-left: 140px;
}

.login-bg {
  background: url("@/assets/login/loginbg.png");
  background-size: 100% 100%;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-name {
  position: absolute;
  left: 0;
  top: -100px;
  display: flex;
  align-items: center;

  img {
    width: 70px;
    height: 70px;
  }

  .box {
    display: flex;
    flex-direction: column;
    margin-left: 8px;

    .name {
      font-size: 32px;
      font-weight: 600;
      line-height: 46px;
      color: #fff;
    }

    .tip {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      margin-top: 2px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.login-icon {
  width: 298px;
}

.login-img {
  width: 62.5%;
  max-width: calc(100vh / 2 / 0.57);
  margin-top: 165px;
}

.login-box {
  width: 720px;
  position: relative;
}

.login-label {
  font-weight: 500;
  font-size: 48px;
  line-height: 68px;
  text-align: center;
  letter-spacing: 0.375px;
}

.login-input {
  padding: 12px;
}
</style>
<style>
#app {
  min-width: 1200px;
}
</style>