<template>
  <a-card :bordered="false">
    <a-row :gutter="24">
      <a-col :md="5">
        <div class="table-operator">
          <a-button :disabled="fileItem.isLeaf" type="primary" icon="plus" v-has="{perm:'fragment:save'}" @click="$refs.formHandle.add(fileItem)">创建片段</a-button>
          <a-button type="primary" icon="plus" v-has="{perm:'fragment:delete'}" @click="deleteFile">删除文件</a-button>
        </div>
      </a-col>
      <a-col :md="19">
        <div class="table-operator">
          <a-button :disabled="fileItem.isLeaf" type="primary" icon="plus" v-has="{perm:'fragment:save:directory'}" @click="$refs.handleDirectory.addDirectory(fileItem)">创建目录</a-button>
          <a-button :disabled="!fileItem.isLeaf" type="primary" icon="plus" v-has="{perm:'fragment:update'}" @click="setFileContent">保存修改</a-button>
          <a-button :disabled="!fileItem.isLeaf" type="primary" icon="plus" v-has="{perm:'fragment:design'}" @click="showDrawer">设计片段</a-button>
          <a-button :disabled="!fileItem.isLeaf" type="primary" icon="plus" v-has="{perm:'fragment:data'}" @click="showDesignDataDrawer">片段数据</a-button>
          <a-button type="primary" icon="plus" v-has="{perm:'fragment:down'}" @click="downZip">全部打包下载</a-button>
		  <a-button type="primary" icon="plus" v-has="{perm:'fragment:import'}" @click="importTemp(1)">模板片段导入</a-button>
        </div>
      </a-col>
    </a-row>
    <!-- <a-divider /> -->
    <a-row :gutter="24">
      <a-col :md="5">
        <div class="codeTemp">
          <a-directory-tree multiple defaultExpandAll :treeData="treeData" @select="onSelect"> </a-directory-tree>
        </div>
      </a-col>
      <a-col :md="19">
        <div class="codeTemp" v-show="fileItem.isLeaf">
          <codemirror ref="myCm" v-model="fileItem.fileContent" :options="codeOptions" class="code"></codemirror>
        </div>

        <a-drawer
          title="页面片段设计"
          placement="right"
          :closable="false"
          @close="onClose"
          :visible="designVisible"
          width="1000"
        >
          <handle-design ref="handleDesign" @ok="onClose" :fileKey="fileItem.fileKey" />
          <div
            :style="{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'left',
            }"
          >
            <a-button :style="{marginRight: '8px'}" @click="onClose">
              取消
            </a-button>
            <a-button @click="$refs.handleDesign.handleSubmit()" type="primary">保存</a-button>
          </div>
        </a-drawer>

        <a-drawer
          title="页面片段数据"
          placement="right"
          :closable="false"
          @close="onCloseDesignData"
          :visible="designDataVisible"
          width="1000"
        >
          <handle-design-data ref="handleDesignData" @ok="onCloseDesignData" :fileKey="fileItem.fileKey" @open="openDesignData" />
          <div
            :style="{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'left',
            }"
          >
            <a-button :style="{marginRight: '8px'}" @click="onCloseDesignData">
              取消
            </a-button>

            <a-button :style="{marginRight: '8px'}" @click="submitDesignData" :disabled="designDataSubmitState">
              确定
            </a-button>
          </div>
        </a-drawer>

        <form-handle ref="formHandle" @ok="handleOk" />
        <handle-directory ref="handleDirectory" @ok="handleOk" />
		 <file-import ref="fileImport" @ok="handleOk" />
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
// import moment from 'moment'
// 编辑的主题文件
import 'codemirror/theme/base16-light.css'
// 编辑器代码高亮css文件
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/lib/codemirror.css' // css，必要
import 'codemirror/addon/fold/foldgutter.css'
import formHandle from './handle'
import handleDirectory from './handleDirectory'
import handleDesign from './handleDesign'
import handleDesignData from './handleDesignData'
import { codemirror } from 'vue-codemirror'
import { page, delByPk, listTreeFragmentFiles, getFileContent, setFileContent, deleteFile, downZip } from '@/api/cms/webfile/fragment.js'
import { STable } from '@/components'
require('codemirror/mode/python/python.js')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/comment-fold.js')
require('codemirror/mode/htmlmixed/htmlmixed.js')
require('codemirror/addon/selection/active-line.js')
// 代码折叠文件
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/html-hint.js')
import fileImport from '@/views/webfile/template/fileImport.vue'
export default {
  name: 'TableList',
  components: {
    STable,
    codemirror,
    formHandle,
    handleDirectory,
    handleDesign,
    handleDesignData,
	fileImport
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
	  fileItem: {
		  fileContent: '',
		  filePath: null,
		  isLeaf: false,
		  fileKey: null
	  },
	  codeOptions: {
		  lineNumbers: true,
		  smartIndent: true,
		  mode: 'text/html',
		  foldGutter: true,
		  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
		  extraKeys: { 'Ctrl': 'autocomplete' },
		  theme: 'base16-light'// 编辑器主题
	  },
      advanced: false,
	  designVisible: false,
	  designDataVisible: false,
	  treeData: [],
	  designDataSubmitState: false,
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
  created () {
    this.listTreeFragments()
  },
  methods: {
    handleDelete (record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk () {
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
        onCancel () {}
      })
    },
    listTreeFragments () {
      listTreeFragmentFiles().then(response => {
		  const treeDataArr = []
		  if (response.res) { treeDataArr.push(response.res) }
		  this.treeData = treeDataArr
      })
    },
    handleEdit (record) {
      this.$refs.formHandle.edit(record)
    },
    handleOk () {
	 this.listTreeFragments()
    },
    onSelect (keys, e) {
      console.log(e)
      if (e.node.isLeaf && e.node.dataRef.relativePath) {
        this.fileItem.fileKey = e.node.dataRef.key
        this.getFileContent(e.node.dataRef.relativePath)
      }
	  this.fileItem.filePath = e.node.dataRef.relativePath
	  this.fileItem.isLeaf = e.node.isLeaf
    },
    getFileContent (path) {
      getFileContent({ path: path }).then(response => {
		  this.fileItem.fileContent = response.res
      })
    },
    setFileContent () {
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
    deleteFile () {
     const path = this.fileItem.filePath
	 const that = this
	 this.$confirm({
	   title: '操作提醒',
	   content: '确定要删除吗?',
	   onOk () {
	    deleteFile({ path: path }).then(response => {
	      if (response.code === 0) {
			  that.handleOk()
			  that.fileItem.fileContent = ''
			  that.$message.info('删除成功!')
	      } else {
	    	  that.$message.error(response.msg)
	      }
	    }).catch(() => console.log('Oops errors!'))
	   },
	   onCancel () {}
	 })
    },
    submitDesignData () {
		 this.$refs.handleDesignData.handleSubmit()
    },
    showDrawer () {
      const that = this
	     this.designVisible = true
		 setTimeout(function () {
		 		 that.$refs.handleDesign.init(that.fileItem)
		 }, 500)
    },
    showDesignDataDrawer () {
      const that = this
	     this.designDataVisible = true
		 setTimeout(function () {
		 		 that.$refs.handleDesignData.init(that.fileItem)
		 }, 500)
    },
    openDesignData (key) {
      console.log(key)
	   if (key === '2') {
		   this.designDataSubmitState = false
	   } else {
		   this.designDataSubmitState = true
	   }
    },
    onClose () {
		 this.$refs.handleDesign.initFields()
	     this.designVisible = false
    },
    onCloseDesignData () {
	     this.designDataVisible = false
		 this.$refs.handleDesignData.initFields()
    },
    resetSearchForm () {
      this.queryParam = {
        dto: {}
      }
      this.handleOk()
    },
    downZip () {
      downZip({}).then(response => {
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
	importTemp(type){
		this.$refs.fileImport.open(type)
	}
  }
}
</script>

<style type="text/css">
	.CodeMirror {
		height: 600px !important;
	}
  .codeTemp{
    border:1px dashed #e8e8e8;border-radius:6px
  }
</style>
