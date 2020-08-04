<template>
  <a-modal width="800px"
           :title="modalTitle"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="组织ID"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     v-show="false">
          <a-input v-if="modalOpera==0"
                   v-decorator="['id']" />
          <a-input v-if="modalOpera==1"
                   v-decorator="['id', {rules: [{required: true}]}]" />
        </a-form-item>

        <a-form-item label="父级组织"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input v-model="parentName"
                   :readOnly="true" />
        </a-form-item>

        <a-form-item label="父级组织"
                     :labelCol="labelCol"
                     v-show="false">
          <a-input v-decorator="['parentId']" />
        </a-form-item>

        <a-form-item label="组织类型"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['level',{rules: [{required: true, message: '请选择组织类型！'}],initialValue:'1'}]">
            <a-radio value="1">公司</a-radio>
            <a-radio value="2">部门</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="组织名称"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input v-decorator="['orgName', {rules: [{required: true, min: 3, message: '请输入至少三个字符的菜单名称！'}]}]" />
        </a-form-item>

        <a-form-item label="组织代码"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input v-decorator="['orgCode', {rules: [{required: true, min: 4, message: '请输入至少四个字符的规则描述！'}]}]" />
        </a-form-item>

        <a-form-item label="组织备注"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input type="textarea"
                   v-decorator="['comment', {rules: [{required: false, min: 3, message: '请输入至少五个字符的规则描述！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { save, getById, update } from '@/api/system/org'
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
      apivisible: false,
      confirmLoading: false,
      parentName: '根目录',
      form: this.$form.createForm(this)
    }
  },
  created() { },
  methods: {
    add(record) {
      this.modal('新建组织', 0)
      if (record) {
        this.parentName = record.name
        this.setVal(record.id, record.attributes.type + 1)
      } else {
        this.parentName = '根目录'
        this.setVal('0', 0)
      }
    },
    setVal(parentId, type) {
      setTimeout(() => {
        this.form.setFieldsValue({ parentId: parentId })
      }, 100)
    },
    edit(record) {
      const that = this
      this.modal('编辑组织', 1)
      getById({ id: record.id }).then(response => {
        const result = response.res
        this.parentName = result.parentName
        setTimeout(() => {
          this.form.setFieldsValue(
            pick(
              result,
              'id',
              'orgName',
              'orgCode',
              'comment',
              'parentId',
              'level'
            )
          )
        }, 100)
      })
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields()
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.modalOpera === 0) {
            save(values).then(response => {
              if (response.code === 0) {
                this.$message.info(response.msg)
                this.$emit('ok')
                this.handleCancel()
              }else{
                 this.$message.error(response.msg)
              }
            })
          } else if (this.modalOpera === 1) {
            update(values).then(response => {
              if (response.code === 0) {
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
