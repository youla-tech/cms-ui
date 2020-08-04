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
        <a-form-item label="id" v-show="false">
          <a-input
            v-decorator="['id']"
          />
        </a-form-item>
        <a-form-item label="任务名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['jobName', {rules: [{required: true}]}]" :disabled="disabled"
          />
        </a-form-item>

        <a-form-item label="任务组" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['jobGroup', {rules: [{required: true}]}]" :disabled="disabled"
          />
        </a-form-item>

		<a-form-item label="任务类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
		  <a-select
		    v-decorator="['jobClass', {rules: [{required: true}]}]" :disabled="disabled"
		  >
		    <a-select-option
		      v-for="tp in type"
		      :key="tp.value"
		      :value="tp.value"
		    >{{ tp.name }}</a-select-option>
		  </a-select>
		</a-form-item>

        <a-form-item label="执行时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['cronExpression', {rules: [{required: true}]}]"
          >
            <a-select-option
              v-for="ex in expression"
              :key="ex.value"
              :value="ex.value"
            >{{ ex.name }}</a-select-option>
          </a-select>
        </a-form-item>

		<a-form-item label="初始化参数" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-tooltip placement="topLeft">
        <template slot="title">
          <span>PS:任务类型为生成栏目列表页时,参数为指定栏目的CODE,其他情况可为空 </span>
        </template>
       <a-input v-decorator="['jobParam', {rules: [{required: false}]}]"/>
      </a-tooltip>
		</a-form-item>

        <a-form-item label="任务描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            v-decorator="['jobDesc', {rules: [{required: false}]}]"
          />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { save, getById, update } from '@/api/task'
import { listByType } from '@/api/system/dict'
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
      form: this.$form.createForm(this),
      modalTitle: '',
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      expression: [],
	  disabled: false,
      type: []
    }
  },
  created() {
  },
  methods: {
    add() {
	  this.disabled = false
      this.modal('新建任务', 0)
    },
    edit(record) {
      this.modal('编辑任务', 1)
	  this.disabled = true
      getById({ id: record.id }).then(response => {
        this.form.setFieldsValue(
          pick(
            response.res,
            'id',
            'jobName',
            'jobGroup',
            'cronExpression',
            'jobDesc',
            'jobClass',
            'jobParam'
          )
        )
      })
    },
    modal(title, opera) {
      this.modalTitle = title
      this.modalOpera = opera
      this.visible = true
      this.form.resetFields()
      this.listByType()
    },
    listByType() {
      listByType({ type: 'JOB_CLASS' }).then(response => {
        this.type = response.res
      })

      listByType({ type: 'JOB_TIME_CRON' }).then(response => {
        this.expression = response.res
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
                this.handleCancel()
              } else {
                this.$message.error(response.msg)
              }
            })
          } else if (this.modalOpera === 1) {
            update(values).then(response => {
              if (response.code === 0) {
                this.$message.info(response.msg)
                this.handleCancel()
              } else {
                this.$message.error(response.msg)
              }
            })
          }
          this.$emit('ok')
        }
        this.confirmLoading = false
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
	    this.disabled = false
      this.$emit('ok')
    }
  }
}
</script>
