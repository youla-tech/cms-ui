<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6"
                 :sm="24">
            <a-form-item label="站点名称">
              <a-input v-model="queryParam.dto.siteName"
                       placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="6"
                 :sm="24">
            <a-form-item label="关键字">
              <a-input v-model="queryParam.dto.siteKeyWords"
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
                v-has="{perm:'site:save'}"
                @click="$refs.formHandle.add()">新建站点</a-button>
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
                 v-has="{perm:'site:update'}">编辑</a-tag>
          <a-tag color="red"
                 v-has="{perm:'site:delete'}"
                 @click="handleDelete(record)">删除</a-tag>

        </template>
      </span>

      <span slot="statisticalCode"
            slot-scope="text">
        <template>
          <span v-html="($options.filters['substr'](text,8))"></span>
        </template>
      </span>

      <span slot="shareCode"
            slot-scope="text">
        <template>
          <span v-html="($options.filters['substr'](text,8))"></span>
        </template>
      </span>

      <span slot="siteLogo"
            slot-scope="text">
        <template>
          <img style="width:30px;height:30px"
               v-if="text"
               :src="text" />
        </template>
      </span>
    </s-table>
    <form-handle ref="formHandle"
                 @ok="handleOk" />
  </a-card>
</template>

<script>
import formHandle from './handle'
import { page, delByPk } from '@/api/cms/site'
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
        dto: {
        }
      },
      columns: [
        {
          title: '站点名称',
          dataIndex: 'siteName'
        },
        {
          title: '关键字',
          dataIndex: 'siteKeyWords'
        },
        {
          title: '站点描述',
          dataIndex: 'siteDesc'
        },
        {
          title: 'logo',
          dataIndex: 'siteLogo',
          scopedSlots: { customRender: 'siteLogo' }
        },
        // {
        //   title: '统计代码',
        //   dataIndex: 'statisticalCode',
        //   scopedSlots: { customRender: 'statisticalCode' }
        // },
        // {
        //   title: '分享代码',
        //   dataIndex: 'shareCode',
        //   scopedSlots: { customRender: 'shareCode' }
        // },
        {
          title: '域名',
          dataIndex: 'domain'
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
    this.loadData(this.queryParam)
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
           
          }).catch((response) => { that.$message.warn(response.msg) })
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
