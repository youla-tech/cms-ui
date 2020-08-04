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
        <a-form-item label="用户ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
          <a-input v-if="modalOpera==0" v-decorator="['id']" />
          <a-input v-if="modalOpera==1" v-decorator="['id', {rules: [{required: true}]}]" />
        </a-form-item>

        <a-form-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :disabled="modalOpera==1"
            v-decorator="['username', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]"
          />
        </a-form-item>

        <a-form-item label="用户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则描述！'}]}]"
          />
        </a-form-item>

        <a-form-item label="用户邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['email', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'},{type: 'email',message: '请输入正确的邮箱'}]}]"
          />
        </a-form-item>

        <a-form-item label="用户手机" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['mobile', {rules: [{required: true, min: 11,max:11, message: '请输入正确的手机号'}]}]"
          />
        </a-form-item>

        <a-form-item
          label="用户密码"
          v-if="modalOpera==0"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['password', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]"
          />
        </a-form-item>

        <a-form-item label="用户性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['sex', {rules: [{required: true, message: '请选择性别'}]}]">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="用户生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            style="width: 100%"
            v-decorator="['birth', {rules:[{required: true, message: '请选择时间'}]}]"
          />
        </a-form-item>

        <a-form-item label="用户角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            mode="multiple"
            placeholder="请选择角色"
            v-decorator="[
              'roleIds',
              {rules: [{ required: true, message: '请选择用户角色'}]}
            ]"
          >
            <a-select-option
              v-for="(role, index) in roles"
              :key="index"
              :value="role.id"
            >{{ role.roleName }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="用户部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree-select
            v-decorator="['orgId', {rules: [{required: true, message: '请选择部门'}]}]"
            :treeData="treeData"
            :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
            placeholder="请选择部门"
            allowClear
            treeDefaultExpandAll
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { save, getById, update, selectRoles } from '@/api/system/user'
import { page as pageOrg } from '@/api/system/org'
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
      roles: [],
      treeData: [],
      form: this.$form.createForm(this),
      org: ''
    }
  },
  created() {
    this.loadTreeData()
    this.getRoles({})
  },
  methods: {
    add() {
      this.modal('新建用户', 0)
    },
    edit(record) {
      this.modal('编辑用户', 1)
      getById({ id: record.id }).then(response => {
        this.form.setFieldsValue(
          pick(
            response.res,
            'id',
            'name',
            'username',
            'sex',
            'email',
            'mobile',
            'birth',
            'roleIds',
            'orgId'
          )
        )
        this.form.setFieldsValue({ birth: moment(response.res.brith) })
      })
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields()
    },
    getRoles(obj) {
      selectRoles().then(response => {
        this.roles = response.res
      })
    },
    loadTreeData() {
      pageOrg({}).then(response => {
        this.treeData = response.res.children
      })
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
              } else {
                this.$message.error(response.msg)
              }
            })
          } else if (this.modalOpera === 1) {
            update(values).then(response => {
              if (response.code === 0) {
                this.$message.info(response.msg)
                this.$emit('ok')
                this.handleCancel()
              } else {
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
