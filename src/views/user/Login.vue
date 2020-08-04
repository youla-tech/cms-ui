<template>
  <div class="main">
    <a-row type="flex" justify="center" align="top">
      <a-col :span="17">
        <a-form
          id="formLogin"
          ref="formLogin"
          :form="form"
          @submit="handleSubmit"
          class="user-layout-login"
        >
          <a-form-item>
            <h2 class="login_text">欢迎登录</h2>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="请输入用户名"
              v-decorator="[
                        'username',
                        {rules: [{ required: true, message: '请输入用户名' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
                      ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="请输入密码"
              v-decorator="[
                        'password',
                        {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
                      ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item style="margin-top:24px">
            <a-button
              size="large"
              type="primary"
              htmlType="submit"
              class="login-button"
              :loading="state.loginBtn"
              :disabled="state.loginBtn"
            >登陆</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import md5 from "md5";
import TwoStepCaptcha from "@/components/tools/TwoStepCaptcha";
import { mapActions } from "vuex";
import { timeFix } from "@/utils/util";
import { getSmsCaptcha, get2step } from "@/api/login";

export default {
  components: {
    TwoStepCaptcha
  },
  data() {
    return {
      customActiveKey: "tab1",
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    };
  },
  created() {

  },
  methods: {
    ...mapActions(["Login", "Logout"]),
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this;
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (regex.test(value)) {
        state.loginType = 0;
      } else {
        state.loginType = 1;
      }
      callback();
    },
    handleSubmit(e) {
      e.preventDefault();
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this;

     
      const validateFieldsKey =
        customActiveKey === "tab1"
          ? ["username", "password"]
          : ["mobile", "captcha"];
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          state.loginBtn = true;
          const loginParams = { ...values };
          loginParams[!state.loginType ? "email" : "username"] =
            values.username;
          Login(loginParams)
            .then(result => this.loginSuccess(result))
            .catch(err => {})
            .finally(() => {
              state.loginBtn = false;
            });
        } else {
          setTimeout(() => {
            state.loginBtn = false;
          }, 600);
        }
      });
    },
    loginSuccess(res) {
      this.$router.push({ name: "dashboard" });
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: "欢迎",
          description: `${timeFix()}，欢迎回来`
        });
      }, 1000);
    },
    requestFailed(err) {
      this.$notification["error"]({
        message: "错误",
        description:
          ((err.response || {}).data || {}).message ||
          "请求出现错误，请稍后再试",
        duration: 4
      });
    }
  }
};
</script>

<style lang="less" scoped>
.user-layout-login {
  width: 100%;
  height: 400px;
  padding: 40px;

  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
