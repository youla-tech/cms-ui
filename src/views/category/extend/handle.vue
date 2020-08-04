<template>
  <a-modal
    :title="modalTitle"
    :width="1100"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" style="max-height: 500px;overflow-y: auto;overflow-x: hidden;">
        <a-form-item label="业务ID" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
          <a-input v-if="modalOpera==1" v-decorator="['id', {rules: [{required: true}]}]" />
        </a-form-item>

        <p>
          分类扩展名称
          <a-icon type="right" />
        </p>
        <a-row :gutter="6">
          <a-col :xl="{span: 8}" :lg="{span: 8}" :md="{span: 12}">
            <a-form-item label="扩展名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                v-decorator="['categoryExtendName', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则！'}]}]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-divider dashed />
        <input-type ref="inputType" />
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { save, getById, update } from "@/api/cms/category/extend";
import pick from "lodash.pick";
import InputType from "@/components/InputType/InputType.vue";
export default {
  components: {
    InputType
  },
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
      modalTitle: "",
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      moptions: [],
      form: this.$form.createForm(this)
    };
  },
  created() {},
  mounted() {},
  methods: {
    add() {
      this.modal("新建分类扩展", 0);
    },
    edit(record) {
      let that = this;
      this.modal("编辑分类扩展", 1);
      setTimeout(function() {
        that.getDetail(record);
      }, 100);
    },
    getDetail(record) {
      getById({
        id: record.id
      }).then(response => {
        const result = response.res;
        this.form.setFieldsValue(pick(result, "id", "categoryExtendName"));
        if (result.extendFieldList) {
          this.setDataSource(JSON.parse(result.extendFieldList));
        }
      });
    },
    modal(title, opera) {
      this.modalTitle = title;
      this.modalOpera = opera;
      this.visible = true;
      this.form.resetFields();
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this;
      validateFields((errors, values) => {
        this.confirmLoading = true;
        if (!errors) {
          const param = this.bulidData(values);
          this.confirmLoading = true;
          if (this.modalOpera === 0) {
            save(param).then(response => {
              if (response.code === 0) {
                this.$message.info(response.msg);
                this.$emit("ok");
                this.handleCancel();
              } else {
                this.$message.error(response.msg);
              }
            });
          } else if (this.modalOpera === 1) {
            update(param).then(response => {
              if (response.code === 0) {
                this.$message.info(response.msg);
                this.$emit("ok");
                this.handleCancel();
              } else {
                this.$message.error(response.msg);
              }
            });
          }
        }
        this.confirmLoading = false;
      });
    },
    bulidData(values) {
      const param = {
        id: values.id,
        categoryExtendName: values.categoryExtendName,
        extendFieldList: JSON.stringify(this.getDataSource())
      };
      return param;
    },
    handleCancel() {
      this.moptions = [];
      this.checkDefaultFields = [];
      this.visible = false;
      this.confirmLoading = false;
      this.clearDataSource();
    },
    setDataSource(data) {
      this.$refs.inputType.setDataSource(data);
    },
    getDataSource() {
      return this.$refs.inputType.getDataSource();
    },
    clearDataSource() {
      this.$refs.inputType.clearDataSource();
    }
  }
};
</script>
