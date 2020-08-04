<template>
  <a-card :bordered="false">
    <p>
      页面数据
      <a-icon type="right"></a-icon>
    </p>
    <a-row v-if="dynamicFields.length === 0">
      <p style="text-align: center;">~暂无设计字段~</p>
    </a-row>
    <a-row :gutter="12">
      <div v-for="(dynamic, index) in dynamicFields" :key="index"  v-if="(dynamic.inputType) && (textInputs.indexOf(dynamic.inputType.toLowerCase())>=0)">
        <a-col
          :xl="{ span: 12 }"
          :lg="{ span: 12 }"
          :md="{ span: 12 }"
          :key="index"
          v-if="notShowThis(dynamic)"
        >
          <a-form-item
            :label="
              dynamic.reFieldNote ? dynamic.reFieldNote : dynamic.fieldNote
            "
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                `${dynamic.extendPrefix}${dynamic.fieldName}`,
                {
                  rules: [
                    {
                      required: dynamic.initSwitch,
                      message:
                        '请输入' +
                        (dynamic.reFieldNote
                          ? dynamic.reFieldNote
                          : dynamic.fieldNote)
                    }
                  ],
                  initialValue: dynamic.defaultValue
                }
              ]"
              v-if="dynamic.inputType.toLowerCase() === 'text' && dynamic.fieldName.indexOf('url')!==0 "
            />
                        <a-input-search
                         @search="onSearch(dynamic.extendPrefix+dynamic.fieldName)"
              v-decorator="[
                `${dynamic.extendPrefix}${dynamic.fieldName}`,
                {
                  rules: [
                    {
                      required: dynamic.initSwitch,
                      message:
                        '请输入' +
                        (dynamic.reFieldNote
                          ? dynamic.reFieldNote
                          : dynamic.fieldNote)
                    }
                  ],
                  initialValue: dynamic.defaultValue
                }
              ]"
              v-if="dynamic.inputType.toLowerCase() === 'text' && dynamic.fieldName.indexOf('url')===0 "
            />

            <a-input-number
              style="width: 100%;"
              v-decorator="[
                `${dynamic.extendPrefix}${dynamic.fieldName}`,
                {
                  rules: [
                    {
                      required: dynamic.initSwitch,
                      message:
                        '请输入' +
                        (dynamic.reFieldNote
                          ? dynamic.reFieldNote
                          : dynamic.fieldNote)
                    }
                  ],
                  initialValue: dynamic.defaultValue
                }
              ]"
              v-if="dynamic.inputType.toLowerCase() === 'number'"
            />
            <a-date-picker
              style="width: 100%;"
              v-decorator="[
                `${dynamic.extendPrefix}${dynamic.fieldName}`,
                {
                  rules: [
                    {
                      required: dynamic.initSwitch,
                      message:
                        '请输入' +
                        (dynamic.reFieldNote
                          ? dynamic.reFieldNote
                          : dynamic.fieldNote)
                    }
                  ],
                  initialValue: formater(dynamic.defaultValue)
                }
              ]"
              v-if="dynamic.inputType.toLowerCase() === 'date'"
            />
            <a-switch
              v-decorator="[
                `${dynamic.extendPrefix}${dynamic.fieldName}`,
                {
                  rules: [
                    {
                      required: dynamic.initSwitch,
                      message:
                        '请输入' +
                        (dynamic.reFieldNote
                          ? dynamic.reFieldNote
                          : dynamic.fieldNote)
                    }
                  ],
                  initialValue: switchVal(dynamic.defaultValue),
                  valuePropName: 'checked'
                }
              ]"
              v-if="dynamic.inputType.toLowerCase() === 'boolean'"
            />
          </a-form-item>
        </a-col>
      </div>
    </a-row>

    <!-- ||++++++++++++++++++++++++++++||-tags START SET TAGS SINGLE++++++++++++++++++++++++++++|||| -->
    <div v-if="tagFields.length>0">
      <a-divider dashed />
      <tag ref="mytag"></tag>
    </div>
    <!-- ||++++++++++++++++++++++++++++||-tags END++++++++++++++++++++++++++++|||| -->

    <!-- ||++++++++++++++++++++++++++++||-textAreaFields START++++++++++++++++++++++++++++|||| -->
    <div v-if="textAreaFields.length > 0">
      <a-divider dashed />
      <a-row :gutter="12">
        <a-col
          :xl="{ span: 24 }"
          :lg="{ span: 24 }"
          :md="{ span: 24 }"
          v-for="(dynamic, index) in textAreaFields"
          :key="index"
        >
          <a-form-item
            :label="
              dynamic.reFieldNote ? dynamic.reFieldNote : dynamic.fieldNote
            "
            :labelCol="{ xs: { span: 24 }, sm: { span: 0 } }"
            :wrapperCol="{ xs: { span: 24 }, sm: { span: 24 } }"
          >
            <a-textarea
              :rows="3"
              :placeholder="
                '请输入' +
                  (dynamic.reFieldNote
                    ? dynamic.reFieldNote
                    : dynamic.fieldNote)
              "
              v-decorator="[
                `${dynamic.extendPrefix}${dynamic.fieldName}`,
                {
                  rules: [
                    {
                      required: dynamic.initSwitch,
                      message:
                        '请输入' +
                        (dynamic.reFieldNote
                          ? dynamic.reFieldNote
                          : dynamic.fieldNote)
                    }
                  ],
                  initialValue: dynamic.defaultValue
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <!-- ||++++++++++++++++textAreaFields  END++++++++++++++++++++++++++++|| -->

    <!-- ||++++++++++++++++++++++++++++||-pictureFields  START++++++++++++++++++++++++++++|||| -->
    <div v-if="pictureFields.length > 0">
      <a-divider dashed />
      <p>
        图片上传
        <a-icon type="right" />
      </p>
      <a-row :gutter="12">
        <a-col
          :xl="{ span: 4 }"
          :lg="{ span: 12 }"
          :md="{ span: 12 }"
          v-for="(pictureField, index) in pictureFields"
          :key="index"
        >
          <div class="clearfix">
            <a-upload
              :action="uploadUrl"
              listType="picture-card"
              :beforeUpload="beforeUpload"
              :fileList="
                pictureObjField[
                  pictureField.extendPrefix + pictureField.fieldName
                ].fileList
              "
              :headers="headers"
              :remove="removeFile"
              @preview="
                handlePreview(
                  $event,
                  pictureField.extendPrefix + pictureField.fieldName
                )
              "
              @change="
                handleChange(
                  $event,
                  pictureField.extendPrefix + pictureField.fieldName
                )
              "
            >
              <div
                v-if="
                  pictureObjField[
                    pictureField.extendPrefix + pictureField.fieldName
                  ].fileList.length < 1
                "
              >
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  {{
                  pictureField.reFieldNote
                  ? pictureField.reFieldNote
                  : pictureField.fieldNote
                  }}
                </div>
              </div>
            </a-upload>
            <a-modal
              :visible="
                pictureObjField[
                  pictureField.extendPrefix + pictureField.fieldName
                ].previewVisible
              "
              :footer="null"
              @cancel="
                handleCancel(pictureField.extendPrefix + pictureField.fieldName)
              "
            >
              <img
                alt="example"
                style="width: 100%"
                :src="
                  pictureObjField[
                    pictureField.extendPrefix + pictureField.fieldName
                  ].previewImage
                "
              />
            </a-modal>
          </div>
        </a-col>
      </a-row>
    </div>
    <!-- ||++++++++++++++++++++++++++++||-pictureFields END++++++++++++++++++++++++++++|||| -->

    <!-- ||++++++++++++++++++++++++++++||fileFields START++++++++++++++++++++++++++++|||| -->
    <div v-if="fileFields.length > 0">
      <a-divider dashed />
      <p>
        文件上传
        <a-icon type="right" />
      </p>
      <a-row :gutter="12" v-for="(fileField, index) in fileFields" :key="index">
          <a-col :xl="{ span: 24 }" :lg="{ span: 12 }" :md="{ span: 12 }">
            <file-upload-list :ref="(fileField.extendPrefix + fileField.fieldName)" :fieldName="(fileField.extendPrefix + fileField.fieldName)" :singleFile="true" :uploadBtnText="(fileField.reFieldNote
                  ? fileField.reFieldNote
                  : fileField.fieldNote)" @ok="uploadFileOk"/>
            <!-- <div class="clearfix">
              <a-upload
                :action="uploadUrl"
                :fileList="
                  fileObjField[fileField.extendPrefix + fileField.fieldName]
                    .fileList
                "
                :remove="removeFile"
                :headers="headers"
                :beforeUpload="beforeUpload"
                @change="
                  handleFileChange(
                    $event,
                    fileField.extendPrefix + fileField.fieldName
                  )
                "
              >
                <a-button
                  style="margin-top: 15px;"
                  :disabled="
                    fileObjField[fileField.extendPrefix + fileField.fieldName]
                      .fileList.length > 0
                  "
                >
                  <a-icon type="upload" />
                  {{
                  fileField.reFieldNote
                  ? fileField.reFieldNote
                  : fileField.fieldNote
                  }}
                </a-button>
              </a-upload>
            </div> -->
          </a-col>
           <a-divider dashed />
      </a-row>
    </div>
    <!-- ||++++++++++++++++++++++++++++||fileFields END++++++++++++++++++++++++++++|||| -->

    <!-- ||++++++++++++++++++++++++++++||fileFields 支持多文件上傳 START++++++++++++++++++++++++++++|||| -->
    <div v-if="hasFiles">
      <a-divider dashed />
      <a-row :gutter="12">
          <file-upload-list ref="fileUploadList" uploadBtnText="附件上传" />
      </a-row>
    </div>
    <!-- ||++++++++++++++++++++++++++++||fileFields 支持多文件上傳 END++++++++++++++++++++++++++++|||| -->

    <!-- ||++++++++++++++++++++++++++++||editorFields START++++++++++++++++++++++++++++|||| -->
    <div v-show="editorFields.length > 0">
      <a-divider dashed />
      <a-row :gutter="12" v-for="(editorField, index) in editorFields" :key="index + 200">
        <div style="width: 106%;margin-left: -27px;">
          <tinymce :ref="'tinymce' + editorField.extendPrefix + editorField.fieldName"></tinymce>
        </div>
      </a-row>
    </div>
    <!-- ||++++++++++++++++++++++++++++||editorFields END++++++++++++++++++++++++++++|||| -->
    <content-chose ref="contentChose" @ok="contentChoseOk" :single="true"/>

  </a-card>
</template>

<script>
import moment from 'moment'
import tinymce from '@/components/Tinymce/Tinymce.vue'
import contentChose from '@/components/ContentComp/ContentChose.vue'
import { ApiUrl } from '@/utils/request.js'
import { deleteFile } from '@/api/cms/resource/index'
import store from '@/store'
import tag from '@/components/tags'
import FileUploadList from './FileUploadList.vue'
export default {
  name: 'ExtendsJson',
  components: {
    tinymce,
    tag,
    contentChose,
    FileUploadList
  },
  props: {
    form: {}
  },
  data() {
    return {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 3
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 20
        }
      },
      uploadUrl: ApiUrl + '/upload/uploadFile',
      dynamicFields: [],
      textInputs: ['text', 'number', 'boolean', 'date'],
      textAreaFields: [],
      tagFields: [],
      pictureFields: [],
      pictureObjField: {},
      fileFields: [],
      fileObjField: {},
      editorFields: [],
      editorObjField: {},
      hasFiles: false,
      headers: {
        Authorization: 'bearer  ' + store.getters.token
      }
    }
  },
  created() {},
  methods: {
    moment,
    setDynamicFields(dynamicFields, hasFiles) {
      this.pictureFields = []
      this.fileFields = []
      this.editorFields = []
      this.textAreaFields = []
      const that = this
      this.dynamicFields = dynamicFields
      if (dynamicFields.length > 0) {
        dynamicFields.forEach(function(item, index) {
          if (item.inputType.toLowerCase() === 'picture') {
            const obj = {
              previewImage: '',
              previewVisible: false,
              fileObj: {},
              fileList: []
            }
            if (item.defaultObjValue) {
              that.setFileInit(item.defaultObjValue, obj)
            }
            that.$set(
              that.pictureObjField,
              item.extendPrefix + item.fieldName,
              obj
            )
            that.pictureFields.push(item)
          }
          if (item.inputType.toLowerCase() === 'textarea') {
            that.textAreaFields.push(item)
          }
          if (item.inputType.toLowerCase() === 'tags') {
            that.tagFields.push(item)
          }
          if (item.inputType.toLowerCase() === 'file') {
            const obj = {
              fileObj: {},
              fileList: []
            }
            if (item.defaultObjValue) {
              that.setFileInit(item.defaultObjValue, obj)
            }
            that.$set(
              that.fileObjField,
              item.extendPrefix + item.fieldName,
              obj
            )
            that.fileFields.push(item)
            setTimeout(() => {
              that.$refs[item.extendPrefix + item.fieldName][0].setFiles(item.defaultObjValue)
            }, 600)
          }
          if (item.inputType.toLowerCase() === 'editor') {
            that.editorFields.push(item)
            setTimeout(function() {
              that.$refs[
                'tinymce' + item.extendPrefix + item.fieldName
              ][0].setContent(item.defaultValue)
            }, 500)
            // that.$set(that.editorObjField, (item.extendPrefix + item.fieldName), {
            //   content: ''
            // })
          }
        })
        console.log(this.pictureObjField)
      }
      if (hasFiles) {
        that.hasFiles = hasFiles
      }
    },
    setDynamicAttachFiles(attachFiles) {
      const that = this
      if (attachFiles && attachFiles.length > 0) {
        setTimeout(() => {
          that.$refs.fileUploadList.setFiles(attachFiles)
        }, 600)
      }
    },
    setTags(tags) {
      if (tags) {
        if (typeof tags === 'string') {
          this.$refs.mytag.setTags(tags)
        } else if (tags instanceof Array) {
          this.$refs.mytag.setTagArr(tags)
        }
      }
    },
    setFileInit(initData, obj) {
      if (initData.length > 0) {
        const filePre = []
        initData.forEach(function(item, index) {
          filePre.push({
            uid: item.id,
            name: item.fileName,
            status: 'done',
            url: item.fileFullPath,
            response: {
              res: item
            }
          })
        })
        obj.fileList = filePre
        obj.fileObj = initData[0]
      }
    },
    cleanFileInit(obj) {
      if (obj) {
        this.$set(obj, 'fileList', [])
        obj.fileList = []
        obj.fileObj = {}
      }
    },
    resetDynamicFields() {
      this.form.resetFields()
      this.clearTinymce()
      const arrs = [
        this.pictureObjField,
        this.fileObjField,
        this.editorObjField
      ]
      if (this.hasFiles) {
        this.clearAttachFile()
      }
      this.clearFieldObjs(arrs)
      this.clearTags()
    },
    clearAttachFile() {
      this.$refs.fileUploadList.clearFiles()
      this.hasFiles = false
    },
    clearTags() {
      if (this.tagFields.length > 0) {
        this.$refs.mytag.clearTags()
        this.tagFields = []
      }
    },
    clearFieldObjs(arrs) {
      if (arrs.length > 0) {
        arrs.forEach(function(item, index) {
          const fieldObjKeys = Object.keys(item)
          if (fieldObjKeys.length > 0) {
            fieldObjKeys.forEach(function(fieldObjKey, index) {
              const obj = item[fieldObjKey]
              if (obj) {
                if (obj.hasOwnProperty('fileList')) {
                  obj['fileList'] = []
                }
                if (obj.hasOwnProperty('fileObj')) {
                  obj['fileObj'] = {}
                }
              }
            })
          }
        })
      }
    },
    clearTinymce() {
      const that = this
      if (this.editorFields.length > 0) {
        this.editorFields.forEach(function(item, index) {
		  const tinymceObj = that.$refs[
            'tinymce' + item.extendPrefix + item.fieldName
          ][0]
          tinymceObj.setContent('')
		  tinymceObj.hiddenToolbar()
        })
      }
    },
    formater(date) {
      return moment(date)
    },
    notShowThis(dynamic) {
      const notShowField = ['picture', 'file', 'editor', 'textarea', 'tags']
      return notShowField.indexOf(dynamic.inputType.toLowerCase()) < 0
    },
    handlePreview(file, fieldName) {
      this.pictureObjField[fieldName].previewImage = file.url || file.thumbUrl
      this.pictureObjField[fieldName].previewVisible = true
    },
    handleChange(e, fieldName) {
      this.pictureObjField[fieldName].fileList = e.fileList
      if (e.file.status === 'done' && e.file.response.code === 0) {
        this.pictureObjField[fieldName].fileObj = e.file.response.res
      }
    },
    uploadFileOk(res) {
      const fieldName = res.fieldName
      const file = res.file
      this.fileObjField[fieldName].fileObj = file
    },
    handleCancel(fieldName) {
      this.pictureObjField[fieldName].previewVisible = false
    },
    getParams() {
      const extendFieldKey = 'extend_field_'
      const newParam = {
        extendParam: {}
      }
      this.form.validateFields((errors, values) => {
        const formParamKeys = Object.keys(values)
        if (formParamKeys.length > 0) {
          formParamKeys.forEach(function(item, index) {
            if (item.indexOf(extendFieldKey) === 0) {
              const reItemName = item.replace(extendFieldKey, '')
              newParam.extendParam[reItemName] = values[item]
              delete values[item]
            } else {
              newParam[item] = values[item]
            }
          })
        }
      })
      const pictureObjField = this.pictureObjField
      const fileObjField = this.fileObjField
      const editorFields = this.editorFields
      const picAttrbute = Object.keys(pictureObjField)
      const fileAttrbute = Object.keys(fileObjField)
      const that = this
      if (picAttrbute.length > 0) {
        picAttrbute.forEach(function(item, index) {
          if (pictureObjField[item].fileList.length > 0) {
            if (item.indexOf(extendFieldKey) === 0) {
              const reItemName = item.replace(extendFieldKey, '')
				        newParam.extendParam[reItemName] = pictureObjField[item].fileObj
			      } else {
              if (item === 'cover') {
                newParam[item] = pictureObjField[item].fileObj.id
              } else {
                newParam[item] = pictureObjField[item].fileObj
              }
            }
          }
        })
      }
      if (fileAttrbute.length > 0) {
        fileAttrbute.forEach(function(item, index) {
          if (item.indexOf(extendFieldKey) === 0) {
            const reItemName = item.replace(extendFieldKey, '')
				        newParam.extendParam[reItemName] = that.$refs[item][0].getSingleFiles()
			      } else {
            newParam[item] = that.$refs[item][0].getSingleFiles()
          }
        })
      }
      if (editorFields.length > 0) {
        editorFields.forEach(function(item, index) {
          const editorContent = that.$refs[
            'tinymce' + item.extendPrefix + item.fieldName
          ][0].getContent()
          newParam[item.extendPrefix + item.fieldName] = editorContent
        })
      }

      if (this.hasFiles) {
        const attachFiles = this.$refs.fileUploadList.getFiles()
        if (attachFiles.length > 0) {
          const attachs = []
          attachFiles.forEach(function(item, index) {
            if (item.id) {
              const attach = Object.assign({
                sysResourceId: item.id
              }, item)
              attachs.push(attach)
            }
          })
          newParam.attachFiles = attachs
        }
      }

      if (this.tagFields.length > 0) {
        const tags = this.$refs.mytag.getTagArr()
        if (tags.length > 0) {
          newParam.tags = tags
        }
      }
      return newParam
    },
    removeFile(file) {
      if (file && !file.error && file.response && file.response.res.fileUid) {
        deleteFile({
          fileUid: file.response.res.fileUid
        }).then(response => {
          if (response.code === 0) {
            console.log('delete file success')
          }
        })
      }
    },
    beforeUpload(file, fileList) {
      let contin = true
      if (file.size >= 104857600) {
        contin = false
        this.$message.error('文件大小超过最大限制 100M')
      }
      return contin
    },
    switchVal(defaultValue) {
      if (defaultValue != null) {
        if (defaultValue === 'true') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    changeSwitchVal(calVal) {
      console.log(calVal)
    },
    onSearch(e) {
      this.$refs.contentChose.open(e)
    },
    contentChoseOk(rows, e) {
      if (rows.length > 0 && e) {
        this.form.setFieldsValue({ [e]: rows[0].url })
      }
    }
  }
}
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.file_div {
  margin-bottom: 15px;
  border: solid rgb(208, 208, 208) 1px;
  min-height: 100px;
  overflow: auto;
  border-radius: 5px;
}

.has-error .ant-form-explain, .has-error .ant-form-split {
    color: #f5222d;
    line-height: 20px
}
</style>
