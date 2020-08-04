<template>
  <a-spin :spinning="confirmLoading"
          style="max-height: 900px; overflow-y: hidden;">
    <iframe :src="loadUrl"
            frameborder="no"
            border="0"
            width="100%"
            :height="dyheigth"
            :style="{'min-height':dyheigth}"></iframe>
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
      loadUrl: ApiUrl + '/sqlMonitor/login.html'
    }
  },
  created() {
    this.dyheigth = window.innerHeight + 'px'
  },
  methods: {
  }
}
</script>
