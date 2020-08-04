<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container" :class="'container_'+loginImg" >
      <route-view></route-view>

      <div class="footer">
        <div class="copyright"><a style="color: unset" target="_blank" href="http://www.thinkitcms.com">Copyright &copy;ThinkItCMS  {{license}}</a></div>
      </div>
    </div>
  </div>
</template>

<script>
import { searchLicense } from "@/api/login";
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'
import Vue from 'vue'
import { DEFAULT_LOGIN_IMG } from '@/store/mutation-types'
export default {
  name: 'UserLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {
      loginImg:'login_bg',
      license:''
    }
  },
  mounted () {
    document.body.classList.add('userLayout')
    this.setDefaultImgOfLogin()
  },
  created(){
    this.getLicense()
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  },
  methods: {
    setDefaultImgOfLogin(){
      const loginImg=Vue.ls.get(DEFAULT_LOGIN_IMG);
      if(loginImg){
        this.loginImg=loginImg
      }
    },
    getLicense(){
       searchLicense().then(response=>{
         if(response.code===0){
           this.license=response.authorizeDesc
         }
       })
    }
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 400px;
        background: hsla(0, 0%, 100%, 0)!important;
        left: 53%;
        width: 100%;
        text-align: center;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    max-height: 80%;
    background-size: 100%;
    padding: 170px 0 144px;
    position: relative;
    .main {
      position:absolute;
      top:50%;
      left:50%;
      margin:-200px 0 0 -200px;
      vertical-align: middle;
      min-width: 260px;
      width:400px;
      height:370px;
      background: #f5f5f5bf;
      border-radius: 5px;
    }
    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;
      .copyright {
        color: rgba(255, 255, 255, 1);
        font-size: 14px;
      }
    }
  }
  .container_login_bg{
  background: rgba(0, 0, 0, 0.5) url(~@/assets/icons/login_bg.jpg) no-repeat
    50%;
     .main {
      background: hsla(0, 18%, 86%, 0.44) !important;
    }
  }
  .container_login_bg_1{
  background: rgba(0, 0, 0, 0.5) url(~@/assets/icons/login_bg_1.jpg) no-repeat
    50%;
     .footer {
      .copyright {
        color: rgb(49, 48, 48)!important;
      }
    }
  }
  .container_login_bg_2{
  background: rgba(0, 0, 0, 0.5) url(~@/assets/icons/login_bg_2.jpg) no-repeat
    50%;
     .main {
      background: #769fd163 !important;
    }
    
  }
  .container_login_bg_3{
  background: rgba(0, 0, 0, 0.5) url(~@/assets/icons/login_bg_3.jpg) no-repeat
    50%;
     .main {
      background: #df9af14a !important;
    }
  }
  .container_login_bg_4{
  background: rgba(0, 0, 0, 0.5) url(~@/assets/icons/login_bg_4.jpg) no-repeat
    50%;
    .footer {
      .copyright {
        color: rgb(49, 48, 48)!important;
      }
    }
  }   
    
  .container_login_bg_5{
  background: rgba(0, 0, 0, 0.5) url(~@/assets/icons/login_bg_5.jpg) no-repeat
    50%;
     .main {
      background: #e2e9ef4a !important;
      margin-right: 200px !important;

    }
    
  }   
}
</style>
