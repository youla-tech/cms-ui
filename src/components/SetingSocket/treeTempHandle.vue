<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" style="max-height: 500px;overflow-y: auto;overflow-x: hidden;">
      <a-row :gutter="24">
            <a-col :md="8">
              <div style="border:1px dashed #e8e8e8">
                <a-directory-tree multiple defaultExpandAll :treeData="treeData" :checkable="true" :checkStrictly="true"
                 @check="onCheck"> </a-directory-tree>
              </div>
            </a-col>
            <a-col :md="15">
            <div v-for="(item,index) in checkedKeys" :key="index">
               <a-form-item :label="checkedKeysTitle[index]" :labelCol="labelCol" :wrapperCol="wrapperCol">
                 <a-input v-decorator="[`${item}`, {rules: [{required: true,  message: '请输入！'}]}]" placeholder="生成位置 根目录:thinkicms:siteStaticFileRootPath 参数配置/"/>
               </a-form-item>
            </div>  
            </a-col>
          </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { genFixedTemp } from '@/api/cms/job'
import { treeTemps} from '@/api/cms/webfile'
export default {
  data() {
    return {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 7
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 13
        }
      },
      treeData: [],
      modalTitle: '',
      checkedKeys:[],
      checkedKeysTitle:[],
	  fileItem: {
		  filePath: '/',
		  isLeaf: false
	  },
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
    this.listTreeTemps()
  },
  methods: {
    open(fileItem) {
      this.modal('生成指定模板', 0)
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields()
    },
    listTreeTemps() {
      treeTemps().then(response => {
		  const treeDataArr = []
		  if (response.res) { treeDataArr.push(response.res) }
		  this.treeData = treeDataArr
      })
    },
    onCheck(keys, e) {
     console.log(e)
     if(e.checked){
       if(e.node.dataRef.isLeaf){
         this.checkedKeys.push(e.node.dataRef.relativePath)
         this.checkedKeysTitle.push(e.node.dataRef.title)
       }
     }else{
       if(e.node.dataRef.isLeaf){
          var index = this.checkedKeys.indexOf(e.node.dataRef.relativePath); 
          if (index > -1) { 
          this.checkedKeys.splice(index, 1);
          this.checkedKeysTitle.splice(index,1) 
          } 
       }
     }
    },
    handleSubmit() {
      const {
        form: {
          validateFields
        }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          if (this.modalOpera === 0) {
            genFixedTemp(values).then(response => {
              if(response.code===0){
                this.$emit('ok')
                this.handleCancel()
              }else{
                this.$message.error(response.msg)
              }
            })
          }
        }
        this.confirmLoading = false
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>
