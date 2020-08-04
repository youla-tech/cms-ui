<template>
  <a-card :bordered="false">
    <a-row :gutter="12">
      <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}" v-for="(extendJ, index) in extendsJson" :key="index">
        <a-form-item :label="extendJ.name" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[`extend_field_${extendJ.code}`, {rules: [{required: extendJ.isRequired, message: '请输入'+extendJ.name}],initialValue:extendJ.defaultValue}]" v-if="extendJ.inputType==='text' "/>
          <a-input-number style="width: 100%;" v-decorator="[`extend_field_${extendJ.code}`, {rules: [{required: extendJ.isRequired, message: '请输入'+extendJ.name}],initialValue:extendJ.defaultValue}]" v-if="extendJ.inputType==='number' "/>
          <a-date-picker style="width: 100%;" v-decorator="[`extend_field_${extendJ.code}`, {rules: [{required: extendJ.isRequired, message: '请输入'+extendJ.name}],initialValue:formater(extendJ.defaultValue)}]" v-if="extendJ.inputType==='date' "/>
          <a-upload
            v-if="extendJ.inputType==='picture' || extendJ.inputType==='file'"
            name="file"
            :multiple="false"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :headers="headers"
          >
            <a-button> <a-icon type="upload" />上传</a-button>
          </a-upload>
        </a-form-item>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ExtendsJson',
  components: {
  },
  props: {

  },
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
      extendsJson: [],
	  headers: {
	            authorization: 'authorization-text'
	          }
    }
  },
  created () {
  },
  methods: {
    moment,
    setExtendsJson (extendsJson) {
      this.extendsJson = extendsJson
	  console.log(this.extendsJson)
    },
    formater (date) {
      return moment(date)
    }
  }
}
</script>
