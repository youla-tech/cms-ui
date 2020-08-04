<template>
  <a-modal title="选择标签"
           :width="900"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           @cancel="handleCancel">
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
             <a-col :md="8" :sm="24">
                      <a-form-item label="标签名称">
                        <a-input v-model="queryParam.dto.name" placeholder=""/>
                      </a-form-item>
               </a-col>
              <a-col :md="8" :sm="24">
                    <a-form-item label="标签分类">
                    <a-select placeholder="所属分类" v-model="queryParam.dto.typeId">
                    <a-select-option value="" key="">暂不分类</a-select-option>
                    <a-select-option v-for="(type,index) in tagTypes"
                    :value="type.id"
                    :key="index">{{ type.name }}</a-select-option>
                    </a-select>
                    </a-form-item>
               </a-col>
                         
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

     <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange:onSelectChange }"
      :data="loadData"
    >
	</s-table>
   
  </a-card>
    </a-modal>
</template>

<script>
import moment from 'moment'
import {page,listTagTypes} from '@/api/cms/tags'
import {tagsBelong} from '@/api/cms/tags/typeIndex.js'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable,
  },
  props: {
	  statusFilter: {
	    type: Function,
	    default: undefined
	  },
	},
  data () {
    return {
      mdl: {},
      advanced: false,
      selectedRowKeys: [],
      selectedRows: [],
       tagTypes:[],
      queryParam: {
            dto:{
              typeId:''
            }
      },
      typeId:null,
      visible: false,
      confirmLoading: false,
      columns: [
        {
         title: '名称',
         dataIndex: 'name'
        },
        {
         title: '所属标签',
         dataIndex: 'typeName'
        },
        {
         title: '创建时间',
         dataIndex: 'gmtCreate',
          customRender: text => {
            if (text) return moment(text).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      ],
      loadData: parameter => {
          return page(Object.assign(parameter, this.queryParam)).then(response => {
            return response.res
          })
      }
    }
  },
  created () {
    this.listAllTagTypes()
  },
  methods: {
    open(){
      this.visible =true
    },
    handleOk () {
      this.$refs.table.refresh();
    },
    resetSearchForm () {
      this.queryParam = {
        dto:{ }
      }
      this.selectedRowKeys = []
      this.selectedRows = []
      this.handleOk();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    listAllTagTypes(){
       listTagTypes({}).then(response=>{
           this.tagTypes=response.res
       })
    },
    handleSubmit(){
        if(this.selectedRows.length>0){
          let tags=[]
          this.selectedRows.forEach(function(item,index){
             if(item.name){
               tags.push(item.name)
             }
          })
          this.$emit('ok',tags)
          this.handleCancel()
        }else{
           this.$message.error('没有选中任何标签')
        }
    },
    handleCancel(){
        this.queryParam.dto={}
        this.selectedRowKeys = []
        this.selectedRows = []
        this.visible=false
        this.handleOk()
    }
}
}
</script>
