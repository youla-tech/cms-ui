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
                   <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['name', {rules: [{required: true, min: 3, message: '请输入至少三个字符的规则！'}]}]" />
            </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import {save,getById,update,selectRoles} from '@/api/cms/tags/typeIndex.js'
import pick from 'lodash.pick'
export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
     modalTitle:'',
     modalOpera:0,//0：新增 1：编辑
     visible: false,
     confirmLoading: false,
     form: this.$form.createForm(this)
    }
  },
	created () {
	},
  methods: {
        add () {
           this.modal('新建标签分类',0);
        },
		edit (record) {
		   this.modal('编辑标签分类',1);
			  getById({id:record.id}).then(response=>{
				this.form.setFieldsValue(pick(response.res,'id','name','count','createId','modifiedId','gmtCreate','gmtModified'
			  ));
			})
		},
		modal(title,opera){
			this.modalTitle=title;
			this.modalOpera=opera;
			this.visible = true;
			this.form.resetFields();
		},
        handleSubmit () {
          const { form: { validateFields } } = this;
          this.confirmLoading = true
          validateFields((errors, values) => {
            if (!errors) {
                  if(this.modalOpera===0){
                         save(values).then(response =>{
                             if(response.code===0){
                                this.$message.info(response.msg)
                                this.$emit('ok');
                                this.handleCancel();
                             }else{
                               this.$message.error(response.msg)
                             }
                         })
                    }else if(this.modalOpera===1){
                         update(values).then(response =>{
                         if(response.code===0){
                                this.$message.info(response.msg)
                                this.$emit('ok');
                                this.handleCancel();
                             }else{
                               this.$message.error(response.msg)
                          }
                        })
                    }
            }
            this.confirmLoading = false
          })
        },
        handleCancel () {
            this.visible = false
            this.confirmLoading = false
        }
  }
}
</script>
