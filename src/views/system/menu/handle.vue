<template>
  <a-modal :title="modalTitle"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="菜单ID"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     v-show="false">
          <a-input v-if="modalOpera==0"
                   v-decorator="['id']" />
          <a-input v-if="modalOpera==1"
                   v-decorator="['id', {rules: [{required: true}]}]" />
        </a-form-item>

        <a-form-item label="菜单类型"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     v-show="false">
          <a-input v-decorator="['type',{rules: [{required: true, message: '请输入菜单类型！'}]}]" />
        </a-form-item>

        <a-form-item label="父级菜单"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input v-model="parentName"
                   readonly />
        </a-form-item>

        <a-form-item label="父级菜单ID"
                     :labelCol="labelCol"
                     v-show="false">
          <a-input v-decorator="['parentId']" />
        </a-form-item>

        <a-form-item label="菜单名称"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {rules: [{required: true, min: 3, message: '请输入至少三个字符的菜单名称！'}]}]" />
        </a-form-item>

        <a-form-item label="权限标识"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input v-decorator="['perms', {rules: [{required: true, min: 4, message: '请输入至少四个字符的规则描述！'}]}]" />
        </a-form-item>

        <a-form-item label="API接口"
                     v-if="apivisible"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input v-decorator="['url', {rules: [{required: true, min: 4, message: '请输入至少四个字符的规则描述！'}]}]" />
        </a-form-item>

        <a-form-item label="菜单顺序"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input-number style="width: 100%;"
                          :min="1"
                          :max="1000"
                          v-decorator="['orderNum',{rules: [{required: true, message: '请输入顺序'}],initialValue:1}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { save, getById, update } from '@/api/system/menu'
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
      this.modal('新建菜单', 0)
      if (record) {
        this.parentName = record.name
        this.apivisible = true
        this.setVal(record.id, record.attributes.type + 1)
      } else {
        this.parentName = '根目录'
        this.apivisible = false
        this.setVal('0', 0)
      }
    },
    setVal(parentId, type) {
      const that = this
      setTimeout(() => {
        that.form.setFieldsValue({ parentId: parentId })
        that.form.setFieldsValue({ type: type })
      }, 100)
    },
    edit(record) {
      this.modal('编辑菜单', 1)
      getById({ id: record.id }).then(response => {
        this.apivisible = response.res.type !== 0
        this.parentName = response.res.parentName
        const that = this
        setTimeout(() => {
          that.form.setFieldsValue(
            pick(
              response.res,
              'id',
              'name',
              'perms',
              'url',
              'orderNum',
              'parentId'
            )
          )
          that.form.setFieldsValue({ type: response.res.type })
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
              if(response.code===0){
              this.$message.info(response.msg)
              this.$emit('ok')
              this.handleCancel()
              }else{
                this.$message.error(response.msg)
              }
             
            })
          } else if (this.modalOpera === 1) {
            update(values).then(response => {
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
        console.log(errors)
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
