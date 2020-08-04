<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :md="5">
        <div class="table-operator">
          <a-button :disabled="fileItem.isLeaf" type="primary" icon="plus" v-has="{perm:'template:save'}" @click="$refs.formHandle.add(fileItem)">创建模板</a-button>
        </div>
      </a-col>
      <a-col :md="19">
        <div class="table-operator">
          <a-button :disabled="fileItem.isLeaf" type="primary" icon="plus" v-has="{perm:'template:save'}" @click="$refs.formHandle.addfolder(fileItem)">创建目录</a-button>

          <a-button :disabled="fileItem.isLeaf" type="primary" icon="plus" v-has="{perm:'template:import'}" @click="$refs.formHandle.add()">上传模板</a-button>

          <a-button type="primary" icon="plus" v-has="{perm:'templates:delete'}" @click="deleteFile">删除文件</a-button>

          <a-button v-if="fileItem.isLeaf" type="primary" icon="plus" v-has="{perm:'template:update'}" @click="setFileContent">保存修改</a-button>

          <a-button type="primary" icon="plus" v-has="{perm:'template:down'}" @click="downZip">全部打包下载</a-button>

          <a-button type="primary" icon="plus" v-has="{perm:'template:import'}" @click="importTemp(0)">模板导入</a-button>
        </div>
      </a-col>
    </a-row>

     <!-- <a-breadcrumb >
          <span slot="separator">></span>
          <a-breadcrumb-item  v-if="path"  v-for="(path,index) in fileItem.breadcrumb" :key="index">{{path}}</a-breadcrumb-item>
     </a-breadcrumb> -->

  <v-contextmenu ref="contextmenu">
        <v-contextmenu-submenu title="插入指定指令" @mouseenter="mouseenter('direct')">
          <div v-for="(direct,index) in directs" :key="index"><v-contextmenu-item @click="clickSubmenu(direct)">{{direct.name}}</v-contextmenu-item></div>
        </v-contextmenu-submenu>
        <v-contextmenu-item divider></v-contextmenu-item>
        <v-contextmenu-submenu title="插入页面片段">
          <v-contextmenu-item @mouseenter="selectTemp(1)">选择页面片段</v-contextmenu-item>
          <v-contextmenu-item @mouseenter="shutDownSelect" >取消页面片段</v-contextmenu-item>
        </v-contextmenu-submenu>
        <v-contextmenu-item divider></v-contextmenu-item>
        <v-contextmenu-submenu title="插入模板片段">
          <v-contextmenu-item @mouseenter="selectTemp(0)" >选择模板片段</v-contextmenu-item>
          <v-contextmenu-item @mouseenter="shutDownSelect" >取消模板片段</v-contextmenu-item>
        </v-contextmenu-submenu>
  </v-contextmenu>

    <div style="margin-bottom: 13px;"></div>
    <a-row :gutter="24">
      <a-col :md="5">
        <div class="codeTemp">
          <a-directory-tree multiple defaultExpandAll :treeData="treeData" @select="onSelect"> </a-directory-tree>
        </div>
      </a-col>
      <a-col :md="19">
        <div class="codeTemp" v-show="fileItem.isLeaf">
          <div v-contextmenu:contextmenu>
          <codemirror ref="myCm" v-model="fileItem.fileContent" :options="codeOptions" class="code"></codemirror>
          </div>
        </div>
        <form-handle ref="formHandle" @ok="handleOk" />
      </a-col>
    </a-row>
    <file-import ref="fileImport" @ok="handleOk" />
    <searchTemp ref="searchTemp" @ok="templateOk"/>
  </a-card>
</template>

<script>
// import moment from 'moment'
import formHandle from './handle'
import fileImport from './fileImport'
import searchTemp from './searchTemp.vue'
import { codemirror } from 'vue-codemirror'
import { page, delByPk, treeTemps, getFileContent, setFileContent, deleteFile, downZip, getDirects } from '@/api/cms/webfile'
import { STable } from '@/components'
import 'codemirror/lib/codemirror.css' // css，必要
// 编辑的主题文件
import 'codemirror/theme/base16-light.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/addon/fold/foldgutter.css'
// 编辑器代码高亮css文件
import 'codemirror/addon/hint/show-hint.css'
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')
require('codemirror/mode/htmlmixed/htmlmixed.js')
require('codemirror/addon/hint/html-hint.js')
export default {
  name: 'TableList',
  components: {
    STable,
    codemirror,
    formHandle,
    fileImport,
    searchTemp
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
    directs:[],
	  fileItem: {
		  fileContent: '',
		  filePath: null,
      isLeaf: false,
      breadcrumb:[]
	  },
	  codeOptions: {
		  lineNumbers: true,
		  smartIndent: true,
		  mode: 'text/html',
		  foldGutter: true,
		  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
		  extraKeys: { 'Tab': 'autocomplete' },
		  theme: 'eclipse'// 编辑器主题
	  },
      advanced: false,
	  treeData: [],
      queryParam: {
        dto: {}
      },
      columns: [
        {
          title: '模型名称',
          dataIndex: 'name'
        },
        {
          title: '是否有用图片',
          dataIndex: 'hasImages',
		      scopedSlots: { customRender: 'hasImages' }
        },
        {
          title: '是否拥有文件',
          dataIndex: 'hasFiles',
		      scopedSlots: { customRender: 'hasFiles' }
        },
        {
          title: '链接地址',
          dataIndex: 'isUrl'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '250px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(
          response => {
            return response.res
          }
        )
      }
    }
  },
  created() {
    this.listTreeTemps()
  },
  methods: {
    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({ id: record.id })
            .then(response => {
              if(response.code===0){
                 that.$message.info(response.msg)
                 that.$refs.table.refresh()
              }else{
                 that.$message.error(response.msg)
              }
             
            })
            .catch(response => {
              that.$message.warn(response.message)
            })
        },
        onCancel() {}
      })
    },
    listTreeTemps() {
      treeTemps().then(response => {
		  const treeDataArr = []
		  if (response.res) { treeDataArr.push(response.res) }
		  this.treeData = treeDataArr
      })
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record)
    },
    handleOk() {
      this.listTreeTemps()
    },
    onSelect(keys, e) {
      if (e.node.isLeaf && e.node.dataRef.relativePath) {
        this.getFileContent(e.node.dataRef.relativePath)
      }
	  this.fileItem.filePath = e.node.dataRef.relativePath
    this.fileItem.isLeaf = e.node.isLeaf
    if(this.fileItem.filePath){
       this.fileItem.breadcrumb=this.fileItem.filePath.split('\\')
    }
    },
    getFileContent(path) {
      getFileContent({ path: path }).then(response => {
		  this.fileItem.fileContent = response.res
      })
    },
    setFileContent() {
	  const param = {
        filePath: this.fileItem.filePath,
        fileContent: encodeURIComponent(this.fileItem.fileContent)
	  }
	  setFileContent(param).then(response => {
		  if (response.code === 0) {
			  this.$message.info('保存成功!')
		  } else {
			  this.$message.error(response.msg)
		  }
	  })
    },
    deleteFile() {
      const path = this.fileItem.filePath
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          deleteFile({ path: path }).then(response => {
            if (response.code === 0) {
              that.listTreeTemps()
              that.fileItem.fileContent = ''
              that.$message.info('删除成功!')
            } else {
              that.$message.error(response.msg)
            }
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {}
	    })
    },
    mouseenter(type){
      if(type==='direct'){
        getDirects().then(response=>{
          if(response.code===0){
            this.directs=response.res
          }
        })
      }
    },
    selectTemp(type){
      this.$refs.searchTemp.selectTemp(type)
    },
    shutDownSelect(){
       this.$refs.searchTemp.handleCancel()
    },
    templateOk(path,type,code){
      let include=''
      if(type===0){
          include='<#include "'+path+'"/>'
      }else{
        if(code){
          include="<#include _m_fragment_import('"+code+"')/>"
        }
      }
      this.$refs.myCm.codemirror.replaceSelection(include)
    },
    clickSubmenu(direct){
       if(direct.example)
       this.$refs.myCm.codemirror.replaceSelection(direct.example)
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {}
      }
      this.handleOk()
    },
    downZip() {
	  downZip({}).then(response => {
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
    importTemp(type) {
      this.$refs.fileImport.open(type)
    }
  }
}
</script>

<style type="text/css">
	.CodeMirror {
		height: 600px !important;
    width: 100%!important;
    /* background-color: rgb(230, 225, 218) */
	}
  .codeTemp{
    border:1px dashed #e8e8e8;border-radius:6px;
   
  }
.v-contextmenu .v-contextmenu-submenu > .v-contextmenu.right {
   max-height: 300px;
   overflow-y: auto;
}
</style>
