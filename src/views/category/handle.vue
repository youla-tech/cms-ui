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
        <a-tabs v-model="tabActiveKey" @change="changeTabs">
          <a-tab-pane key="1">
            <span slot="tab">
              <a-icon type="database" />基础信息
            </span>
            <a-row :gutter="12">
              <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}" v-show="false">
                <a-form-item label="id" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input
                    v-decorator="['id', {rules: [{required: ( modalOpera===1), message: '请输入！'}]}]"
                  />
                </a-form-item>

                <a-form-item
                  label="父分类"
                  :labelCol="labelCol"
                  :wrapperCol="wrapperCol"
                  v-show="false"
                >
                  <a-input
                    v-decorator="['parentId', {rules: [{required: true, message: '请输入！'}]}]"
                  />
                </a-form-item>
              </a-col>

              <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}">
                <a-form-item label="父分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input
                    v-decorator="['parentName', {rules: [{required: true, message: '请输入！'}]}]"
                    disabled
                  />
                </a-form-item>
              </a-col>
              <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 24}">
                <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input
                    v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则！'}]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="12">
              <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}">
                <a-form-item label="编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input
                    v-decorator="['code', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则！'}]}]"
                    @change="codeChange"
                  />
                </a-form-item>
              </a-col>
			  
			  <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}">
			    <a-form-item label="分类访问路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
			      <a-input
			        :disabled="true"
			        v-decorator="['contentPath', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则！'}]}]"
			      />
			    </a-form-item>
			  </a-col>
			  
             
            </a-row>
            <a-row :gutter="12" v-if="!editRes.ishref">
				
             <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 24}">
               <a-form-item label="分类模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
                 <a-input-search
                   v-decorator="['templatePath', {rules: [{required: true, min: 2, message: '请输入至少二个字符的规则！'}]}]"
                   @search="onSearch"
                   disabled
                 />
               </a-form-item>
             </a-col>
			 
			 <a-col :xl="{span: 12}" :lg="{span: 6}" :md="{span:6}">
			   <a-form-item label="每页条数" :labelCol="labelCol" :wrapperCol="wrapperCol">
			     <a-input-number
			       :min="2"
			       :max="50"
			       style="width: 100%;"
			       v-decorator="['pageSize', {rules: [{required: true, message: '请输入'}],initialValue:10}]"
			     />
			   </a-form-item>
			 </a-col>
            </a-row>
			
            <a-row :gutter="24">
				
              <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 24}">
                <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input-number
                    style="width: 100%;"
                    v-decorator="['sort', {rules: [{required: true, message: '请输入'}],initialValue:0}]"
                  />
                </a-form-item>
              </a-col>

              <a-col :xl="{span: 12}" :lg="{span: 12}" :md="{span: 12}">
                <a-form-item label="扩展分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-select
                    placeholder="扩展分类"
                    @change="categoryExtendChange"
                    v-decorator="['categoryExtendId', {rules: [{required: false, message: '请选择'}], initialValue:''}]"
                  >
                    <a-select-option value key>不扩展</a-select-option>
                    <a-select-option
                      v-for="(ext ,index) in categoryExtends"
                      :value="ext.id"
                      :key="index"
                    >{{ ext.categoryExtendName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row :gutter="12">
              <a-col :xl="{span: 6}" :lg="{span:8}" :md="{span:12}">
                <a-form-item label="允许投稿" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-switch
                    v-decorator="['allowContribute', {rules: [{required: false, message: '请输入'}],initialValue:true}]"
                    size="small"
                    v-model="editRes.allowContribute"
                  />
                </a-form-item>
              </a-col>

              <a-col :xl="{span: 6}" :lg="{span:8}" :md="{span:12}">
                <a-form-item label="前台显示" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-tooltip placement="topLeft" title="开启后将在网站首页显示该栏目">
                    <a-switch
                      v-decorator="['hidden', {rules: [{required: false, message: '请输入'}],initialValue:true}]"
                      size="small"
                      v-model="editRes.hidden"
                    />
                  </a-tooltip>
                </a-form-item>
              </a-col>

              <a-col :xl="{span: 6}" :lg="{span:8}" :md="{span:12}">
                <a-form-item label="是否单页" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-tooltip placement="topLeft" title="单页栏目只能发布一篇文章">
                    <a-switch
                      v-decorator="['singlePage', {rules: [{required: false, message: '请输入'}],initialValue:false}]"
                      size="small"
                      v-model="editRes.singlePage"
                    />
                  </a-tooltip>
                </a-form-item>
              </a-col>

               <!-- <a-col :xl="{span: 6}" :lg="{span:8}" :md="{span:12}">
                <a-form-item label="超链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-tooltip placement="topLeft" title="超链接分类不需要静态模板">
                    <a-switch
                      v-decorator="['ishref', {rules: [{required: false, message: '请输入'}],initialValue:false}]"
                      size="small"
                      v-model="editRes.ishref"
                    />
                  </a-tooltip>
                </a-form-item>
              </a-col> -->

              <a-col :xl="{span: 6}" :lg="{span: 8}" :md="{span:12}">
                <a-form-item label="定时时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-tooltip placement="topLeft" title="当需要从新生成分类列表页时的默认触发时间单位(秒)">
                    <a-input-number
                      :min="10"
                      :max="10000"
                      v-decorator="['afterGenSecond', {rules: [{required: true, message: '请输入'}],initialValue:10}]"
                    />
                  </a-tooltip>
                </a-form-item>
              </a-col>

              <!-- <a-col :xl="{span: 6}" :lg="{span:8}" :md="{span:12}">
                <a-form-item label="静态化" :labelCol="labelCol" :wrapperCol="wrapperCol">
					 <a-tooltip placement="topLeft" title="开启后实时静态化页面,当数据量超 2000条后不建议开启">
                     <a-switch v-decorator="['autoGenStatic', {rules: [{required: false, message: '请输入'}],initialValue:false}]" size="small" v-model="editRes.autoGenStatic"/>
                     </a-tooltip>
				</a-form-item>
              </a-col>

              <a-col :xl="{span: 6}" :lg="{span: 6}" :md="{span:6}"  v-show="editRes.autoGenStatic">
                <a-form-item label="最大页码" :labelCol="labelCol" :wrapperCol="wrapperCol">
			      <a-tooltip placement="topLeft" title="实时静态化页面的最大页数">
                  <a-input-number :min="10" :max="50"  v-decorator="['maxStaticPage', {rules: [{required: true, message: '请输入'}],initialValue:10}]" />
                  </a-tooltip>
				</a-form-item>
              </a-col>-->
              <!-- <a-col :xl="{span: 8}" :lg="{span:8}" :md="{span:12}">
                <a-form-item label="含子类内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-switch v-decorator="['containChild', {rules: [{required: false, message: '请输入'}],initialValue:true}]" size="small" v-model="editRes.containChild"/>
                </a-form-item>
              </a-col>-->
            </a-row>
            <div v-show="extend">
              <a-divider dashed />
              <a-collapse :bordered="false" :activeKey="activeCollapseKey">
                <a-collapse-panel header="扩展分类" key="1">
                  <p style="text-align: center;" v-if="categoryExtends.length===0">~暂无扩展分类,请先创建分类扩展~</p>
                  <dynamic-field ref="dynamicField" :form="form" v-if="extend"></dynamic-field>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab">
              <a-icon type="line-chart" />搜索引擎优化
            </span>
            <a-row :gutter="12">
              <a-col :xl="{span: 20}" :lg="{span:20}" :md="{span: 24}">
                <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input
                    v-decorator="['title', {rules: [{required: false, min: 2, message: '请输入至少二个字符的规则！'}]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="12">
              <a-col :xl="{span: 20}" :lg="{span: 20}" :md="{span: 24}">
                <a-form-item label="关键字" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input
                    v-decorator="['keywords', {rules: [{required: false, min: 2, message: '请输入至少二个字符的规则！'}]}]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="12">
              <a-col :xl="{span: 20}" :lg="{span: 20}" :md="{span: 24}">
                <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-textarea
                    v-decorator="['description', {rules: [{required: false, max: 200, message: '请输入至少二个字符的规则！'}]}]"
                  ></a-textarea>
                </a-form-item>
              </a-col>
            </a-row>
          </a-tab-pane>

          <a-tab-pane key="3">
            <span slot="tab">
              <a-icon type="bars" />选择内容模型
            </span>
            <a-row :gutter="24" v-for="(model,index) in categoryModels" :key="index">
              <a-col :xl="{span:3}" :lg="{span: 7}" :md="{span: 24}">
                <a-form-item :labelCol="labelCol" :wrapperCol="{xs: {span: 10},sm:{ span: 6}}">
                  <a-radio-group
                    v-decorator="['modelId', {rules: [{required: true, message: '必选'}],initialValue:editRes.containChild}]"
                  >
                    <a-radio :value="model.id">{{ model.name }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>

              <a-col :xl="{span: 17}" :lg="{span: 17}" :md="{span: 24}">
                <a-form-item label="内容静态模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-input-search v-model="model.templatePath" disabled  @search="searcChangeTemp(model)"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-form>
      <search-temp ref="searchTemp" @ok="confirm" :searchTempActive="searchTempActive"></search-temp>
    </a-spin>
  </a-modal>
</template>

<script>
import { listAllModel } from '@/api/cms/model'
import { save, update, getById } from '@/api/cms/category'
import {
  listAllExtends,
  getExtendFieldById
} from '@/api/cms/category/extend.js'
import { formatExtendFields } from '@/components/ExtendsField'
import DynamicField from '@/components/DynamicField/DynamicField.vue'
import pick from 'lodash.pick'
import searchTemp from './searchTemp'
export default {
  components: {
    DynamicField,
    searchTemp
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
      modelRadioVal: '',
      tabActiveKey: '1',
      selectTreObj: {},
      searchTempActive: 0,
      editRes: {
        allowContribute: true,
        hidden: true,
        autoGenStatic: true,
        singlePage: false,
		ishref: false
      },
      categoryExtends: [],
      activeCollapseKey: '0',
      categoryModels: [],
      modalTitle: '',
      modalOpera: 0, // 0：新增 1：编辑
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      extend: false
    }
  },
  created() {
    listAllExtends({}).then(response => {
      this.categoryExtends = response.res
    })
    // this.loadModels();
  },
  methods: {
    add(selectTreObj) {
      this.selectTreObj = selectTreObj
      const that = this
      this.modal('新建分类', 0)
      setTimeout(function() {
        if (!selectTreObj.id) selectTreObj.id = 0
        if (!selectTreObj.title) selectTreObj.title = '父分类'
        that.form.setFieldsValue({
          parentId: selectTreObj.id
        })
        that.form.setFieldsValue({
          parentName: selectTreObj.title
        })
      }, 500)
    },
    loadModels(categoryId) {
      listAllModel({ categoryId: categoryId }).then(response => {
        this.categoryModels = response.res
      })
    },
    edit(record) {
      this.modal('编辑分类', 1)
      const that = this
      getById({
        id: record.id
      }).then(response => {
        const result = response.res
        this.editRes = result
        this.form.setFieldsValue(
          pick(
            result,
            'id',
            'parentId',
            'name',
            'templatePath',
            'code',
            'contentPath',
            'parentName',
            'sort',
            'pageSize',
            'categoryExtendId',
            'hidden',
            'singlePage',
            'allowContribute',
            'afterGenSecond'
          )
        )
        if (result.categoryExtendId && result.extendFieldList) {
          this.activeCollapseKey = '1'
          this.extend = true
          setTimeout(function() {
            that.$refs.dynamicField.setDynamicFields(result.extendFieldList)
          }, 500)
        } else {
          this.activeCollapseKey = '0'
          this.extend = false
        }
      })
    },
    codeChange(e) {
      if (e.target.value) {
        this.form.setFieldsValue({
          contentPath: '/' + e.target.value + '/index.html'
        })
      } else {
        this.form.setFieldsValue({ contentPath: '' })
      }
    },
    confirm(path, searchTempActive, param) {
      if (searchTempActive === 0) {
        this.form.setFieldsValue({ templatePath: path })
      } else if (searchTempActive === 1) {
        param.templatePath = path
      }
    },
    changeTabs(key) {
      const that = this
      if (key === '2') {
        setTimeout(function() {
          that.form.setFieldsValue(
            pick(that.editRes, 'title', 'keywords', 'description')
          )
        }, 300)
      } else if (key === '3') {
        this.loadModels(that.editRes.id)
        setTimeout(function() {
          that.form.setFieldsValue(pick(that.editRes, 'modelId'))
        }, 300)
      }
    },
    getModelTemplate(params) {
      if (params.modelId && this.categoryModels.length > 0) {
        this.categoryModels.forEach(function(item, index) {
          if (params.modelId === item.id) {
            params.modelTemplate = item.templatePath
          }
        })
      }
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
      validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true
          let params = values
          if (this.$refs.dynamicField) {
            params = this.$refs.dynamicField.getParams()
          }
          this.getModelTemplate(params)
          if (this.modalOpera === 0) {
            save(params).then(response => {
              if (response.code === 0) {
                this.$message.info(response.msg)
                this.$emit('ok')
                this.handleCancel()
              } else {
                this.$message.error(response.msg)
              }
            })
          } else if (this.modalOpera === 1) {
            update(params).then(response => {
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
    categoryExtendChange(id) {
      let extendsJson = []
      const that = this
      if (id) {
        getExtendFieldById({ id: id }).then(response => {
          if (response.code === 0 && response.extendField.length > 0) {
            that.activeCollapseKey = '1'
            extendsJson = response.extendField
            setTimeout(function() {
              that.$refs.dynamicField.setDynamicFields(extendsJson)
            }, 500)
          }
        })
        this.extend = true
      } else {
        that.activeCollapseKey = '0'
        this.extend = false
      }
    },
    onSearch(value) {
      this.searchTempActive = 0
      this.$refs.searchTemp.selectTemp()
    },
    searcChangeTemp(model) {
      this.searchTempActive = 1
      this.$refs.searchTemp.selectTemp(model)
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.editRes = {
        allowContribute: true,
        hidden: true,
        containChild: true
      }
      this.tabActiveKey = '1'
      if (this.activeCollapseKey === '1') {
        this.$refs.dynamicField.resetDynamicFields()
      }
      this.activeCollapseKey = '0'
    }
  }
}
</script>
