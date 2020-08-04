<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6"
                 :sm="24">
            <a-form-item label="模型名称">
              <a-input v-model="queryParam.dto.name"
                       placeholder />
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
                v-has="{perm:'model:save'}"
                @click="$refs.formHandle.add()">创建模型</a-button>
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
                 v-has="{perm:'model:update'}">编辑</a-tag>
          <a-tag color="red"
                 v-has="{perm:'model:delete'}"
                 @click="handleDelete(record)">删除</a-tag>
        </template>
      </span>
      <span slot="hasImages"
            slot-scope="text">
        <template>
          <a-tag color="green"
                 v-if="text">是</a-tag>
          <a-tag color="red"
                 v-if="!text">否</a-tag>
        </template>
      </span>
      <span slot="hasFiles"
            slot-scope="text">
        <template>
          <a-tag color="green"
                 v-if="text">是</a-tag>
          <a-tag color="red"
                 v-if="!text">否</a-tag>
        </template>
      </span>
      <span slot="hasChild"
            slot-scope="text">
        <template>
          <a-tag color="green"
                 v-if="text">是</a-tag>
          <a-tag color="red"
                 v-if="!text">否</a-tag>
        </template>
      </span>
    </s-table>
    <form-handle ref="formHandle"
                 @ok="handleOk" />
  </a-card>
</template>

<script>
import formHandle from './handle'
import { page, delByPk } from '@/api/cms/model'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable,
    formHandle
  },
  props: {
    statusFilter: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      mdl: {},
      advanced: false,
      queryParam: {
        dto: {}
      },
      columns: [
        {
          title: '模型名称',
          dataIndex: 'name'
        },
        // {
        //  title: '静态化模板地址',
        //  dataIndex: 'templatePath'
        // },
        // {
        //  title: '',
        //  dataIndex: 'hasChild'
        // },
        {
          title: '是否有用图片',
          dataIndex: 'hasImages',
          scopedSlots: { customRender: 'hasImages' }
        },
        {
          title: '是否拥有文件',
          dataIndex: 'hasFiles',
          scopedSlots: { customRender: 'hasFiles' }
        },
        {
          title: '链接地址',
          dataIndex: 'isUrl'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '250px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return page(Object.assign(parameter, this.queryParam)).then(
          response => {
            return response.res
          }
        )
      }
    }
  },
  created() {
    this.loadData(this.queryParam)
  },
  methods: {
    handleDelete(record) {
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要删除吗?',
        onOk() {
          delByPk({ id: record.id })
            .then(response => {
              if(response.code===0){
                  that.$message.info(response.msg)
                  that.$refs.table.refresh()
              }else{
                  that.$message.error(response.msg)
              }
            
            })
            .catch(response => {
              that.$message.warn(response.msg)
            })
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
