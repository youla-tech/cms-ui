<template>
  <a-modal
    :title="modalTitle"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" style="max-height: 500px;overflow-y: auto;overflow-x: hidden;">
        <a-form-item label="业务ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
          <a-input v-if="modalOpera==1" v-decorator="['id', {rules: [{required: true}]}]" />
        </a-form-item>

        <p>
          创建模板
          <a-icon type="right" />
        </p>
        <a-row :gutter="6">
          <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}">
            <a-form-item label="所在目录" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['filePath', {rules: [{required: false, message: '请输入！'}],initialValue:'\\'}]" disabled />
            </a-form-item>
          </a-col>

          <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}">
            <a-form-item label="文件名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['fileName', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则！'}]}]" />
            </a-form-item>
          </a-col>

		  <a-col :xl="{span: 11}" :lg="{span: 8}" :md="{span: 12}" v-show="false">
		    <a-form-item label="文件类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
		      <a-input v-decorator="['isDirectory', {rules: [{required: false, message: '请输入！'}],initialValue:0}]" disabled />
		    </a-form-item>
		  </a-col>

        </a-row>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  save
} from '@/api/cms/webfile/index.js'
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
      modalTitle: '',
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
  created() {},
  methods: {
    add(fileItem) {
	  const that = this
	  this.fileItem = fileItem
      this.modal('新建模板', 0)
	  setTimeout(function() {
	      that.form.setFieldsValue({ 'filePath': fileItem.filePath ? fileItem.filePath : '\\' })
		  that.form.setFieldsValue({ 'isDirectory': 0 })
	  }, 500)
    },
    addfolder(fileItem) {
	  const that = this
	  this.fileItem = fileItem
	  this.modal('新建目录', 0)
	  setTimeout(function() {
	      that.form.setFieldsValue({ 'filePath': fileItem.filePath ? fileItem.filePath : '\\' })
		  that.form.setFieldsValue({ 'isDirectory': 1 })
	  }, 500)
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields()
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
            save(values).then(response => {
              if(response.code===0){
                this.$message.info(response.msg)
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
