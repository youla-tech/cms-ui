<template>
    <a-modal title="文件上传"
    :visible="visible"
    :width="850"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">
    <a-spin tip="MD5解码中.." :spinning="confirmLoading">
	  <uploader 
        :options="options" 
        :file-status-text="statusText" 
        :autoStart="false" 
        @file-success="fileSuccess" 
        @file-added="onFileAdded" 
        @file-progress="onFileProgress"
        ref="uploader" 
        class="uploader-example">
		    <uploader-unsupport></uploader-unsupport>
		    <uploader-drop>
		      <p>拖拽文件到此处 PS:支持续传、秒传</p>
		      <uploader-btn :attrs="attrs">选择文件</uploader-btn>
		    </uploader-drop>
		    <uploader-list></uploader-list>
	  </uploader>
     </a-spin>
    </a-modal>
</template>

<script>
  import { ApiUrl } from '@/utils/request.js'
  import store from '@/store'
  import SparkMD5 from 'spark-md5';
  export default {
    data () {
      return {
        visible: false,
        confirmLoading: false,
        options: {
          target: ApiUrl + '/upload/keepUploadFile',
          fileParameterName: 'file',
          simultaneousUploads:1, 
          chunkSize: '1024000',   //分块大小
          testChunks: true,
          singleFile:false, 
          // 服务器分片校验函数，秒传及断点续传基础
          checkChunkUploadedByResponse: function (chunk, message) {
              let objMessage = JSON.parse(message);
              if (objMessage.res.skip) {
                  return true;
              }else{
                let uploadChunks=objMessage.res.uploadChunk
                 if(uploadChunks){
                    return (uploadChunks || []).indexOf(chunk.offset + 1) >= 0
                 }else{
                    return false
                 }
              }
          },
          headers:{
               Authorization: 'bearer  ' + store.getters.token
          }
        },
        attrs: {
          accept: '/*'
        },
        statusText: {
          success: '上传成功',
          error: '上传出错',
          uploading: '上传中',
          paused: '准备就绪',
          waiting: '等待中'
        },
      }
    },
    created() {
    },
    mounted () {
    	const _this = this
      this.$nextTick(() => {
      })
    },
    computed: {
      //Uploader实例
      uploader() {
          return this.$refs.uploader.uploader;
      }
    },
    methods: {
      openUpload(accept){
        this.visible=true;
        if(accept){
        this.attrs.accept=accept
        }
      },
      handleOk(e) {
        this.$refs.uploader.uploader.cancel()
        this.visible = false
      },
      handleCancel(e) {
        this.$refs.uploader.uploader.cancel()
        this.visible = false
      },
      fileSuccess(rootFile, file, message, chunk){
        let objMessage = JSON.parse(message);
        this.$emit('uploadOk',objMessage)
       
      },
      onFileAdded(file){//添加文件后执行
        let isGtMax=file.size >= (104857600*5)
        if(isGtMax){
          file.ignored = true
          this.$message.error('文件大小最大500M')
        }else{
          this.confirmLoading=true
          this.computeMD5(file);
        }
      },
      onFileProgress(rootFile, file, chunk){

      },
      computeMD5(file) {
        let fileReader = new FileReader();
        let time = new Date().getTime();
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        let currentChunk = 0;
        const chunkSize = 10 * 1024 * 1000;
        let chunks = Math.ceil(file.size / chunkSize);
        let spark = new SparkMD5.ArrayBuffer();
        // 文件状态设为"计算MD5"
        //this.statusSet(file.id, 'md5');
        file.pause();
        loadNext();
        fileReader.onload = (e => {
            spark.append(e.target.result);
            if (currentChunk < chunks) {
                currentChunk++;
                loadNext();
                // 实时展示MD5的计算进度
                this.$nextTick(() => {
                  console.log('校验MD5 '+ ((currentChunk/chunks)*100).toFixed(0)+'%')
                    //$(`.myStatus_${file.id}`).text('校验MD5 '+ ((currentChunk/chunks)*100).toFixed(0)+'%')
                })
            } else {
                let md5 = spark.end();
                this.computeMD5Success(md5, file);
                console.log('MD5计算完毕')
            }
        });
        fileReader.onerror = function () {
            console.log('文件读取出错')
            file.cancel();
        };
      function loadNext() {
          let start = currentChunk * chunkSize;
          let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },
    computeMD5Success(md5, file) {
        // 将自定义参数直接加载uploader实例的opts上
        Object.assign(this.uploader.opts, {
            query: {
                ...this.params,
            }
        })
        file.uniqueIdentifier = md5;
        this.confirmLoading=false
    },
    }
  }
</script>

<style>
  .uploader-example {
    width: 100%;
    height:400px;
    margin: 0 auto;
    font-size: 12px;
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 400px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>