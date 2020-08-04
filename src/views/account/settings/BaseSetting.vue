<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical" :form="form">
          <a-form-item label="用户账号">
            <a-input disabled="disabled" v-decorator="['username', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'}]}]" />
          </a-form-item>

          <a-form-item label="用户姓名">
            <a-input v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则描述！'}]}]" />
          </a-form-item>

          <a-form-item label="用户邮箱">
            <a-input v-decorator="['email', {rules: [{required: true, min: 5, message: '请输入至少五个字符的规则描述！'},{type: 'email',message: '请输入正确的邮箱'}]}]" />
          </a-form-item>

          <a-form-item label="用户性别">
            <a-radio-group v-decorator="['sex', {rules: [{required: true, message: '请选择性别'}]}]">
              <a-radio :value="1">男</a-radio>
              <a-radio :value="2">女</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- <a-form-item label="用户生日">
            <a-date-picker style="width: 100%" v-decorator="['birth', {rules:[{required: true, message: '请选择时间'}]}]" />
          </a-form-item> -->

          <a-form-item label="用户手机">
            <a-input v-decorator="['mobile', {rules: [{required: true, min: 11,max:11, message: '请输入正确的手机号'}]}]" />
          </a-form-item>

          <a-form-item>
            <a-button @click="submitInfo">保存</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <!-- <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
          <a-icon type="cloud-upload-o" class="upload-icon" />
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img" />
        </div>
      </a-col> -->
    </a-row>

    <avatar-modal ref="modal"></avatar-modal>
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import moment from 'moment'
import {
  getUserInfo,
  updateUserInfo
} from '@/api/system/user'
import pick from 'lodash.pick'
export default {
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      form: this.$form.createForm(this),
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      }
    }
  },
  created () {
    this.userInfo()
  },
  methods: {
    userInfo () {
      getUserInfo().then(response => {
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
            'roleIds'
          )
        )
        this.form.setFieldsValue({
          birth: moment(response.res.brith)
        })
      })
    },
    submitInfo () {
      const {
        form: {
          validateFields
        }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log(errors)
          updateUserInfo(values).then(response => {
            if (response.code === 0) {
              this.$message.info(response.msg)
            }else{
              this.$message.error(response.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0, 0, 0, 0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img,
    .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
