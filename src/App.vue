<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {

  }
}
</script>
<style>
  #app {
    height: 100%;
  }

/*整体部分*/
::-webkit-scrollbar
{
	width: 10px;
	height: 10px;
}
/*滑动轨道*/
::-webkit-scrollbar-track
{
	border-radius: 0px;
	background: none;
}
/*滑块*/
::-webkit-scrollbar-thumb
{
	border-radius: 5px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
	background-color: rgba(255,255,255,.75)
}
/*滑块效果*/
::-webkit-scrollbar-thumb:hover
{
	border-radius: 5px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
	background-color: rgba(85, 85, 85, 0.4);
}


.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 10px 10px !important;
}
</style>
