<template>
  <div>
    <a-modal title="文件上传" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <a-upload
        name="file"
        :multiple="true"
        :action="uploadUrl"
        :headers="headers"
        :data="param"
        @change="handleChange">
        <a-button>
          <a-icon type="upload" /> 选择模板文件</a-button>
      </a-upload>
    </a-modal>
  </div>
</template>
<script>
import store from '@/store'
import {
  ApiUrl
} from '@/utils/request.js'
export default {
  data() {
    return {
      password: '',
      uploadUrl: ApiUrl + '/templates/importFile',
      visible: false,
      confirmLoading: false,
      param: {},
      headers: {
        Authorization: 'bearer  ' + store.getters.token
      }
    }
  },
  methods: {
    open(type) {
      this.visible = true
      this.param.type = type
    },
    handleOk(e) {
      this.visible = false
      this.confirmLoading = false
    },
    handleCancel(e) {
      this.visible = false
    },
    handleChange(info) {
      if (info.file.response) {
        if (info.file.response.code === 0) {
          this.$message.success(`${info.file.name} 上传完成`)
		      this.handleCancel()
		      this.$emit('ok')
        } else {
          this.$message.error(info.file.response.msg)
        }
      }
    }
  }
}
</script>
