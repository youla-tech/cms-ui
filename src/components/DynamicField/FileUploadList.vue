<template>
  <div>
  <a-list size="small" bordered :dataSource="fileList">
              <div slot="header">
              <a-button :disabled="(singleFile && fileList.length>0)" @click="uploadFile" style="width:100%" type="dashed">{{uploadBtnText}}</a-button></div>
              <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
               <div style="width:90%">{{item.fileName}}</div>
               <div>  
                  <a-popconfirm title="确定要删除该文件吗？" @confirm="removeFileByUid(item.fileUid)" okText="确认" cancelText="取消">
                  <a href="#">删除</a>
                </a-popconfirm>
                  </div>
               </a-list-item>
  </a-list>
  <simple-vue-upload ref="uploader" @uploadOk="uploadOk" />
  </div>
</template>

<script>
import { deleteFile } from '@/api/cms/resource/index'
import store from '@/store'
import SimpleVueUpload from "@/components/SimpleVueUpload/SimpleVueUpload.vue";

export default {
  name: 'FileUploadList',
  components: {
    SimpleVueUpload
  },
  props: {
    uploadBtnText: {
      type: String,
      default: '文件上传'
    },
    fieldName: {
      type: String,
      default: ''
    },
    singleFile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      headers: {
        Authorization: 'bearer  ' + store.getters.token
      }
    }
  },
  created() {},
  methods: {
    uploadFile(){
       this.$refs.uploader.openUpload("/*");
    },
    uploadOk(response){
      if(response.code===0){
        this.fileList.push(response.res)
        this.$emit('ok', {file:response.res,fieldName:this.fieldName})
      }
    },
    removeFileByUid(fileUid){
        deleteFile({
          fileUid: fileUid
        }).then(response => {
          if (response.code === 0) {
            this.removeAttachFiles(fileUid)
            console.log('delete file success')
          }
        })
    },
    removeAttachFiles(fileUid){
      let that = this
      if(this.fileList.length>0){
        this.fileList.forEach(function(item,index){
          if(item.fileUid=== fileUid){
             that.fileList.splice(index, 1);
          }
        })
      }
    },
    getFiles(){
      return this.fileList || []
    },
    getSingleFiles(){
      let files= this.fileList || []
      if(files.length>0){
        return files[0]
      }else{
        return null
      }
    },
    setFiles(fileList){
      if(!fileList){
        fileList=[]
      }
      this.fileList=fileList
    },
    clearFiles(){
      this.fileList=[]
    }
  }
}
</script>

