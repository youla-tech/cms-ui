<template>
  <a-spin :spinning="confirmLoading"
          style="max-height: 900px; overflow-y: hidden;">
    <div style="" class="content">
    <iframe :src="loadUrl"
            frameborder="no"
            id="ifra"
            border="0"
            width="100%"
            :height="dyheigth"
            :style="{'min-height':dyheigth}"></iframe>
    </div>
  </a-spin>
</template>
<script>
import { ApiUrl } from '@/utils/request'
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      page: '',
      dyheigth: '',
      visible: false,
      confirmLoading: false,
      loadUrl: ApiUrl + '/api/tongji/goToBaiDuTj'
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.path === '/tongji') {
        this.confirmLoading = true
      }
    }
  },
  created() {
    this.confirmLoading = true
    this.dyheigth = window.innerHeight + 'px'
  },
  beforeDestroy() {
  },
  mounted: function() {
    const that = this
    const iframe = document.querySelector('#ifra')
    // 处理兼容行问题
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', function() {
        // iframe加载完毕以后执行操作
        that.confirmLoading = false
      })
    } else {
      iframe.onload = function() {
        // iframe加载完毕以后执行操作
        that.confirmLoading = false
      }
    }
  },
  methods: {
  }
}
</script>
