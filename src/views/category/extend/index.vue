<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6"
                 :sm="24">
            <a-form-item label="分类扩展名称">
              <a-input v-model="queryParam.dto.categoryExtendName"
                       placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6"
                 :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary"
                        @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px"
                        @click="resetSearchForm()">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary"
                icon="plus"
                v-has="{perm:'category:extend:save'}"
                @click="$refs.formHandle.add()">新建扩展分类</a-button>
    </div>
    <s-table ref="table"
             size="default"
             rowKey="id"
             :columns="columns"
             :data="loadData">
      <span slot="action"
            slot-scope="text, record">
        <template>
          <a-tag color="orange"
                 @click="handleEdit(record)"
                 v-has="{perm:'category:extend:update'}">编辑</a-tag>
          <a-tag color="red"
                 v-has="{perm:'category:extend:del'}"
                 @click="handleDelete(record)">删除</a-tag>
        </template>
      </span>
    </s-table>
    <form-handle ref="formHandle"
                 @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import formHandle from './handle'
import { page, delByPk } from '@/api/cms/category/extend.js'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable,
    formHandle
  },
  props: {
  },
  data() {
    return {
      mdl: {},
      advanced: false,
      queryParam: {
        dto: {
        }
      },
      columns: [
        {
          title: '分类扩展名称',
          dataIndex: 'categoryExtendName'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '创建时间',
          dataIndex: 'gmtCreate',
          customRender: text => {
            if (text) return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '修改时间',
          dataIndex: 'gmtModified',
          customRender: text => {
            if (text) return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '250px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(response => {
          return response.res
        })
      }
    }
  },
  created() {
  },
  methods: {
    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({ pk: record.id }).then(response => {
            if(response.code===0){
               that.$message.info(response.msg)
               that.$refs.table.refresh()
            }else{
               that.$message.error(response.msg)
            }
           
          }).catch((response) => { that.$message.warn(response.message) })
        },
        onCancel() { }
      })
    },
    handleEdit(record) {
      this.$refs.formHandle.edit(record)
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    resetSearchForm() {
      this.queryParam = {
        dto: {}
      }
      this.handleOk()
    }
  }
}
</script>
