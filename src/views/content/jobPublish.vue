<template>
  <div>
    <a-modal title="定时发布"
             :visible="visible"
             @ok="handleOk"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel">
              <a-row>
       <a-date-picker
      showTime
      format="YYYY-MM-DD HH:mm:ss"
      placeholder="请选择发布时间"
      v-model="date"
      @change="onChange"
      @ok="onOk"
    />
</a-row>

    </a-modal>
  </div>
</template>
<script>
import { jobPublish } from '@/api/cms/content'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      date: null,
      ids: []
    }
  },
  methods: {
    job(ids) {
      this.visible = true
      this.ids = ids
    },
    handleOk(e) {
      const param = {
        ids: this.ids,
        expiryDate: this.date
      }
      console.log(param)
      jobPublish(param).then(response => {
        if (response.code === 0) {
          this.$emit('ok')
          this.handleCancel()
          this.$message.info(response.msg)
        }else{
          this.$message.error(response.msg)
        }
      })
    },
    handleCancel(e) {
      this.visible = false
    },
    onChange(value, dateString) {
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
    },
    onOk(value) {
      console.log('onOk: ', value)
    }
  }
}
</script>
