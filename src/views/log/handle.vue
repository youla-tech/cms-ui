<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
            <a-form-item label="业务ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
            <a-input v-if="modalOpera==1" v-decorator="['id', {rules: [{required: true}]}]" />
            </a-form-item>
                   <a-form-item label="日志类型：0:普通日志 1:异常日志" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['type', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
            </a-form-item>
           <a-form-item label="模块名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['module', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
            </a-form-item>
           <a-form-item label="登录名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['userNo', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
            </a-form-item>
           <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['username', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
            </a-form-item>
           <a-form-item label="用户操作" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['operation', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
            </a-form-item>
           <a-form-item label="响应时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['time', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
            </a-form-item>
           <a-form-item label="请求方法" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['method', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
            </a-form-item>
           <a-form-item label="请求参数" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['params', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
            </a-form-item>
           <a-form-item label="IP地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['ip', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
            </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { save, getById, update } from '@/api/log'
import pick from 'lodash.pick'
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      modalTitle: '',
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created() {
  },
  methods: {
    add() {
      this.modal('新建xx', 0)
    },
    edit(record) {
		   this.modal('编辑xx', 1)
			  getById({ id: record.id }).then(response => {
        this.form.setFieldsValue(pick(response.data[0], 'id', 'type', 'module', 'userNo', 'username', 'operation', 'time', 'method', 'params', 'ip',
			  ))
      })
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields()
    },
    handleSubmit() {
      const { form: { validateFields }} = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.modalOpera === 0) {
            save(values).then(response => {
              this.$message.info(response.message)
              this.$emit('ok')
              this.handleCancel()
            })
          } else if (this.modalOpera === 1) {
            update(values).then(response => {
              this.$message.info(response.message)
              this.$emit('ok')
              this.handleCancel()
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
