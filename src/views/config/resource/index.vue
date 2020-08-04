<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6"
                 :sm="24">
            <a-form-item label="资源名称">
              <a-input v-model="queryParam.dto.fileName"
                       placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6"
                 :sm="24">
            <a-form-item label="创建人">
              <a-input v-model="queryParam.dto.createName"
                       placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6"
                 :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary"
                        @click="loadData">查询</a-button>
              <a-button style="margin-left: 8px"
                        @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

       <a-row >
       <a-col :md="6" :sm="24"  v-for="(data,index) in datas" :key="index">
        <a-card hoverable >
        <img
          v-if="!isVideo(data.fileType)"
          alt="example"
          :src="coverFileCover(data.fileFullPath,data.fileType)"
          style="width:100%;height:230px;object-fit: cover;overflow-y: hidden"
          slot="cover"
        />
        <video  style="width:100%;height:225px;object-fit: fill;overflow-y: hidden" loop="loop" autoplay="autoplay" :src="data.fileFullPath"   v-if="isVideo(data.fileType)"/>
        <template class="ant-card-actions" slot="actions">
           <a-popconfirm title="确定要删除该文件吗？"
                            @confirm="deleteFile(data.fileUid)"
                            okText="确认"
                            cancelText="取消">
                <span><a-icon type="delete" /></span>
            </a-popconfirm>
         
          <a-icon type="edit" />
          <a-icon type="ellipsis" />
        </template>
        <a-card-meta :title="data.fileName" :description="'大小:'+conver(data.fileSize)+' 日期:'+converDate(data.gmtCreate)">
        <!-- <a-avatar
            slot="avatar"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          /> -->
        </a-card-meta>
        </a-card>
        <a-divider type="horizontal" :dashed="true"/>
        </a-col>
       </a-row>
  <a-pagination :current="queryParam.pageNo" :pageSize="queryParam.pageSize" :total="total" @change="loadChange" v-if="datas.length>0"/>
  </a-card>
  
</template>

<script>
import moment from 'moment'
import { page,deleteFile } from '@/api/cms/resource'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      mdl: {},
      advanced: false,
      queryParam: {
        dto: {
        },
        pageNo:1,
        pageSize:12
      },
      datas:[],
      total:0,
      video:[]
    }
  },
  created() {
    this.loadData(this.queryParam)
  },
  methods: {
    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({ pk: record.id }).then(response => {
            if(response.code===0){
              that.$message.info(response.msg)
              that.$refs.table.refresh()
            }else{
              that.$message.error(response.msg)
            }
           
          }).catch((response) => { that.$message.warn(response.msg) })
        },
        onCancel() { }
      })
    },
    handleOk() {
      this.loadData()
    },
    loadChange(page, pageSize){
       this.queryParam.pageNo = page
       this.loadData()
    },
    loadData(){
      page(this.queryParam).then(response=>{
        if(response.code===0){
          this.total=response.res.total
          this.datas=response.res.rows
        }
      })
    },
    deleteFile(fileUid){
      deleteFile({fileUid:fileUid}).then(response=>{
        if(response.code===0){
           this.$message.info('删除成功!')
           this.loadData()
        }else{
          this.$message.error(response.msg)
        }
      })
    },
    coverFileCover(fileFullPath,fileType){
       let cover= '/default_file.png'
       if(fileFullPath&&fileType){
          let images=['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff','jfif']
          if(images.indexOf(fileType)>=0){
            cover=fileFullPath
          }
       }
       return cover
    },
    isVideo(fileType){
      if(fileType){
        let videos=['avi', 'rmvb', 'flv', 'mkv', 'mp4', '3gp', 'asf', 'f4v', 'qsv','hddvd','ogv']
        return videos.indexOf(fileType)>=0
      }else{
        return false
      }
       
    },
    converDate(date){
      return moment(date).format('YYYY-MM-DD')
    },
    conver(limit){
            if(!limit){
              return '未知'
            }
            var size = "";  
            if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B  
                size = limit.toFixed(2) + "B";    
            }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB  
                size = (limit / 1024).toFixed(2) + "KB";              
            }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB  
                size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
            }else{ //其他转化成GB  
                size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
            }  
              
            var sizestr = size + "";   
            var len = sizestr.indexOf("\.");  
            var dec = sizestr.substr(len + 1, 2);  
            if(dec == "00"){//当小数点后为00时 去掉小数部分  
                return sizestr.substring(0,len) + sizestr.substr(len + 3,2);  
            }  
            return sizestr;  
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {},
        pageNo:1,
        pageSize:12
      }
      this.handleOk()
    }
  }
}
</script>
