<template>
  <a-modal :title="modalTitle"
           :width="500"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           @cancel="handleCancel">

      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消上传</a-button>
        <a-button key="submit" type="primary" :disabled="fileList.length === 0"
      :loading="uploading" @click="handleSubmit">
          确定上传
        </a-button>
      </template>
    <a-spin :spinning="confirmLoading">
        <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload" :multiple="true">
        <a-button> <a-icon type="upload" /> 选择文件 </a-button>
        </a-upload>
    </a-spin>
  </a-modal>
</template>

<script>
import {uploadFile } from '@/api/cms/webfile/webstatic'
export default {
  data() {
    return {
      modalTitle: '',
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      filePath:'',
      fileList: [],
      uploading: false,
    }
  },
  created() {
  },
  methods: {
   open(filePath){
     this.filePath=filePath
     this.visible =true
   }, 
   handleChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
    },
    handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
    },
    beforeUpload(file) {
      let contin = true
      if (file.size >= 104857600) {
        contin = false
        this.fileList=[]
        this.$message.error('文件大小超过最大限制 100M')
      }else{
        this.fileList = [...this.fileList, file];
      }
      return contin;
    },
    handleSubmit() {
        const { fileList } = this;
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('files[]', file);
        });
         formData.append('filePath', this.filePath);
        this.uploading = true;
        uploadFile(formData).then(response=>{
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
      this.uploading = false
      this.fileList=[]
    }
  }
}
</script>
