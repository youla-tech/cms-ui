<template>
  <a-card :bordered="false">
  

    <div class="table-operator">
      <a-button
        type="primary"
        icon="plus"
        v-has="{perm:'site:file:save'}"
        @click="createFile('')"
      >新建目录</a-button>
    </div>

    <a-table ref="table" size="default" rowKey="fileName" :columns="columns" :dataSource="data">
      <span slot="action" slot-scope="text, record">
        <template>
          <a-tag  v-if="record.fileName!=='返回上一级'" color="red" @click="handleDelete(record)" v-has="{perm:'site:file:delete'}">删除</a-tag> 
          <a-tag  v-if="record.fileName!=='返回上一级'&& record.directory" color="orange" v-has="{perm:'site:file:down'}" @click="downZip(record)" >压缩下载</a-tag> 
          <a-tag  v-if="record.fileName!=='返回上一级'&& record.directory" color="green" @click="uploadFile(record)" v-has="{perm:'site:file:upload'}">上传文件</a-tag>
          <a-tag  v-if="record.fileName!=='返回上一级'&& record.directory" color="#f50" @click="createFile(record.relativePath)" v-has="{perm:'site:file:save'}">创建子目录</a-tag>
        </template>
      </span>

      <span slot="fileName" slot-scope="text, record">
        <template>
           <a v-if="record.directory  && record.fileName!=='返回上一级'" href="javascript:;" @click="loadChildFolder(record)"><a-icon type="folder" />  {{text}}</a>
           <a v-if="!record.directory && record.fileName!=='返回上一级'" href="javascript:;"><a-icon type="file" />  {{text}}</a>
           <a v-if="record.fileName==='返回上一级'" @click="loadChildFolder(record)" href="javascript:;"> <a-icon type="enter" />  {{text}}</a>
          
        </template>
      </span>
    </a-table>

    <handle-file ref="handleFile" @ok='handleOk'/>
    
    <handle-create-file ref="handleCreateFile" @ok='handleOk'/>
    
  </a-card>
</template>

<script>
import moment from 'moment'
import { page, deleteFile,downZip } from '@/api/cms/webfile/webstatic'
import handleFile  from './handleFile'
import handleCreateFile  from './handleCreateFile'
export default {
  name: 'TableList',
  components: {
    handleFile,
    handleCreateFile
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
       path:''
      },
      data:[],
      // 表头
      columns: [
        {
          title: '文件名称',
          dataIndex: 'fileName',
          scopedSlots: { customRender: 'fileName' }
        },
        {
          title: '创建时间',
          dataIndex: 'creationTime',
          sorter: true,
          needTotal: false,
          customRender: text => {
            if (text) return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '修改时间',
          dataIndex: 'lastModifiedTime',
          sorter: true,
          needTotal: false,
          customRender: text => {
            if (text) return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '350px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(
          response => {
            console.log(response)
            this.data=response.res
          }
        )
      },
      optionAlertShow: false
    }
  },
  created () {
    this.loadData(this.queryParam)
  },
  methods: {
    loadChildFolder(record){
      this.queryParam.path=record.relativePath
      this.queryParam.parentPath=record.parentRelativePath
      this.loadData(this.queryParam)
    },
    handleDelete (record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk () {
          deleteFile({ path: record.relativePath })
            .then(response => {
              if(response.code===0){
                that.$message.info('操作成功!')
                that.handleOk()
              }
              else{
               that.$message.error(response.msg)
              }
            })
            .catch(response => {
              that.$message.warn(response.data.msg)
            })
        },
        onCancel () {}
      })
    },
    downZip(record) {
	  downZip({path: record.relativePath}).then(response => {
      console.log(response)
        const blob = new Blob([response.data])
        const linkNode = document.createElement('a')
        linkNode.download = response.headers.filename // a标签的download属性规定下载文件的名称
        linkNode.style.display = 'none'
        linkNode.href = URL.createObjectURL(blob) // 生成一个Blob URL
        document.body.appendChild(linkNode)
        linkNode.click() // 模拟在按钮上的一次鼠标单击
        URL.revokeObjectURL(linkNode.href) // 释放URL 对象
        document.body.removeChild(linkNode)
	  })
    },
    uploadFile(record){
      this.$refs.handleFile.open(record.relativePath)
    },
    createFile(path){
      this.$refs.handleCreateFile.open(path)
    },
    handleEdit (record) {
      this.$refs.formHandle.edit(record)
    },
    handleMenu (record) {
      this.$refs.formHandleMenu.assignMenu(record)
    },
    handleOk () {
       this.loadData(this.queryParam)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        dto: {}
      }
      this.handleOk()
    }
  }
}
</script>
