<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        v-has="{perm:'license:import'}"
        @click="open"
      >导入授权文件</a-button>
    </div>
    <s-table ref="table" size="default" rowKey="signaturer" :columns="columns" :data="loadData">
      <span slot="licenseStatus" slot-scope="text, record">
        <template>
          <a-tag color="green" v-if="text==='正常'">正常</a-tag>
          <a-tag color="red" v-else>{{text}}</a-tag>
        </template>
      </span>
    </s-table>

    <a-modal title="授权认证"
    :visible="visible"
    :width="650"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">
      <a-upload
        name="file"
        :multiple="false"
        :action="uploadUrl"
        :fileList="fileList"
        :headers="headers"
        @change="handleChange"
      >
      <a-button> <a-icon type="upload" /> 上传授权文件 </a-button>
      </a-upload>
    </a-modal>
  </a-card>
</template>

<script>
import moment from 'moment'
import { page, importLicense } from '@/api/system/license'
import { STable } from '@/components'
import store from '@/store'
import { ApiUrl } from '@/utils/request.js'
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
  data () {
    return {
      headers: {
        Authorization: 'bearer  ' + store.getters.token
      },
      fileList:[],
      uploadUrl: ApiUrl + '/license/importLicense',
      confirmLoading:false,
      visible:false,
      // 查询参数
      queryParam: {
        dto: {}
      },
      // 表头
      columns: [
        {
          title: '版权方',
          dataIndex: 'copyrightOwner'
        },
        {
          title: '授权类型',
          dataIndex: 'authorizeDesc'
        },
        {
          title: '授权版本',
          dataIndex: 'version'
        },
        {
          title: '授权组织',
          dataIndex: 'organization'
        },
        {
          title: '授权域名',
          dataIndex: 'domain'
        },
        {
          title: '授权起止日期',
          dataIndex: 'startStopTime'
        },
        {
          title: '授权状态',
          dataIndex:'status',
          scopedSlots: {
          customRender: 'licenseStatus'
          }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(
          response => {
            return response.res
          }
        )
      },
      optionAlertShow: false
    }
  },
  created () {
  },
  methods: {
    handleOk () {
      this.$refs.table.refresh()
      this.visible=false;
    },
    handleCancel(){
      this.visible=false;
      this.fileList=[]
    },
    open(){
      this.fileList=[]
      this.visible=true;
    },
    handleChange(info) {
        this.fileList=info.fileList
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if(info.file.response.code===0){
             this.$message.success(`${info.file.name} 上传成功`);
             this.handleOk()
          }else{
            this.fileList=[]
             this.$message.error(`${info.file.name}`+info.file.response.msg);
          }
         
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败.`);
        }
    }
  }
}
</script>
