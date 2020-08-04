<template>
  <a-modal
    title="个人信息修改"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="原始密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="password" v-decorator="['initPass', {rules: [{required: true, min: 6, message: '请输入至少6个字符的规则描述！'}]}]" />
        </a-form-item>

        <a-form-item label="新密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="password" v-decorator="['newPass', {rules: [{required: true, min: 6, message: '请输入至少6个字符的规则描述！'}]}]" />
        </a-form-item>

        <a-form-item label="确认新密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input type="password" v-decorator="['newPassAgain', {rules: [{required: true, min: 6, message: '请输入至少6个字符的规则描述！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import {
  modifyPass
} from '@/api/system/user'
export default {
  data () {
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
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created () {},
  methods: {
    edit () {
      this.visible = true
      this.form.resetFields()
    },
    handleSubmit () {
      const {
        form: {
          validateFields
        }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          if (values.newPass !== values.newPassAgain) {
            this.$message.error('2次密码不一致!')
            return
          }
          if (values.newPass === values.initPass) {
            this.$message.error('新旧密码不能一样!')
            return
          }
          this.confirmLoading = true
          modifyPass(values).then(response => {
            this.confirmLoading = false
            if (response.code === 0) {
              this.$message.info(response.msg)
              this.$emit('ok')
              this.handleCancel()
            } else {
              this.$message.error(response.msg)
            }
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>
