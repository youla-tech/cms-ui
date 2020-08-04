<template>
  <a-card :bordered="false">
    <a-row :gutter="3">
      <a-col :md="3">
        <div class="table-operator">
          <a-button
            type="primary"
            size="small"
            v-has="{perm:'content:deleteBatch'}"
            @click="handleAddRelated"
          >
            <a-icon type="delete" />添加推荐
          </a-button>
        </div>
      </a-col>
      <a-col :md="3">
        <div class="table-operator">
          <a-button
            type="primary"
            size="small"
            v-has="{perm:'content:deleteBatch'}"
            @click="handleDeletes"
          >
            <a-icon type="delete" />批量移除
          </a-button>
        </div>
      </a-col>
    </a-row>
    <a-divider dashed />
    <a-row :gutter="24">
      <a-col :md="24">
        <a-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :dataSource="loadDatas"
          :locale="{emptyText: '暂无内容'}"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange:onSelectChange }"
        >
          >
          <span slot="status" slot-scope="state, record">
            <template>
              <a-tag
                color="orange"
                v-if="state == '0' "
              >草稿 {{ record.checkUserName ? '/' +record.checkUserName:'' }}</a-tag>
              <a-tag
                color="red"
                v-if="state == '1' "
              >已发布{{ record.checkUserName ? '/' +record.checkUserName:'' }}</a-tag>
            </template>
          </span>

          <span slot="titleData" slot-scope="text">
            <template>
              <span v-html="($options.filters['substr'](text,8))"></span>
            </template>
          </span>

          <span slot="action" slot-scope="text, record">
            <template>
              <a-popconfirm
                title="确定要删除该明细吗？"
                @confirm="handleDelete(record)"
                okText="确认"
                cancelText="取消"
              >
                <a-tag color="red" v-has="{perm:'content:delete'}">移除推荐</a-tag>
              </a-popconfirm>

              <!-- <a-tag color="green"
                     @click="handleTop(record)"
              v-has="{perm:'content:delete'}">置顶推荐</a-tag>-->
            </template>
          </span>
        </a-table>
      </a-col>
    </a-row>
    <related-chose ref="relatedChose" @ok="relatedChoseOk" />
    <top-handle ref="topHandle" @ok="handleOk" />
  </a-card>
</template>

<script>
import relatedChose from './relatedChose'
import topHandle from './topHandle'
import { pageContentRelated } from '@/api/cms/content'
export default {
  name: 'TableList',
  components: {
    topHandle,
    relatedChose
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
      selectedRowKeys: [],
      selectedRows: [],
      loadDatas: [],
      queryParam: {
        dto: {}
      },
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          width: 160,
          scopedSlots: { customRender: 'titleData' }
        },
        {
          title: '分类',
          dataIndex: 'categoryName'
        },
        {
          title: '置顶级别',
          dataIndex: 'sort'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '250px',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {},
  methods: {
    handleAddRelated() {
      this.$refs.relatedChose.open()
    },
    relatedChoseOk(rows) {
      const that = this
      if (rows.length > 0) {
        if (this.loadDatas.length === 0) {
          this.loadDatas = rows
        } else {
          rows.forEach(function(item, index) {
            let contain = false
            that.loadDatas.forEach(function(data, index) {
              if (data.id === item.id) {
                contain = true
              }
            })
            if (!contain) {
              that.loadDatas.push(item)
            }
          })
        }
      }
    },
    loadRelated(contentId) {
      this.queryParam.dto.contentId = contentId
      this.loadData()
      
    },
    handleDeletes() {
      const rows = this.selectedRows
      const that = this
      if (rows.length === 0) {
        this.$message.error('请选择要删除的记录！')
        return
      }
      rows.forEach(function(item, index) {
        that.handleDelete(item)
      })
    },
    handleDelete(record) {
      let i = -1
      this.loadDatas.forEach(function(item, index) {
        if (item.id === record.id) {
          i = index
        }
      })
      if (i !== -1) {
        this.loadDatas.splice(i, 1)
      }
    },
    loadData() {
      pageContentRelated(this.queryParam).then(response => {
        this.loadDatas = response.res.rows
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk() {
      this.$refs.table.refresh()
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    onExpand(expandedKeys) {
      // this.expandedKeys = expandedKeys;
      // this.autoExpandParent = false;
    },
    handleTop(record) {
      this.$refs.topHandle.top(record)
    },
    getRelatedRows() {
      return this.loadDatas
    },
    clearRelatedRows() {
      this.loadDatas = []
    },
    resetSearchForm() {
      this.handleOk()
    }
  }
}
</script>
