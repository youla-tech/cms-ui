<template>
  <a-modal :title="modalTitle"
           :width="500"
           :visible="visible"
           :closable="false"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           @cancel="handleCancel">

      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" 
        @click="handleSubmit">
          确定
        </a-button>
      </template>
    <a-spin :spinning="confirmLoading">
      <a-row :gutter="24">
        <a-col :md="24">
           <a-input placeholder="请输入目录名称" v-model="fileName"/>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import {createFile } from '@/api/cms/webfile/webstatic'
export default {
  data() {
    return {
      modalTitle: '',
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      filePath:'',
      fileName:''
    }
  },
  created() {
  },
  methods: {
   open(filePath){
     this.filePath=filePath
     this.visible =true
   }, 
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
    },
    handleSubmit() {
        let params={
          filePath:this.filePath,
          fileName:this.fileName
        }
        createFile(params).then(response=>{
          if(response.code===0){
            this.$message.info(response.msg)
            this.$emit('ok')
            this.handleCancel()
          }else{
            this.$message.error(response.msg) 
          }
        })
       

    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.filePath=''
      this.fileName=''
    }
  }
}
</script>
