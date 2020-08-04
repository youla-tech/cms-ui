<template>
  <a-modal title="文章推荐"
           :width="1100"
           :height="500"
           :maskClosable="false"
           :visible="visible"
           :confirmLoading="confirmLoading"
           @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="6"
                     :sm="24">
                <a-form-item label="标题">
                  <a-input v-model="queryParam.dto.title"
                           placeholder />
                </a-form-item>
              </a-col>
              <!-- <a-col :md="6"
                     :sm="24">
                <a-form-item label="状态">
                  <a-select v-model="queryParam.dto.status"
                            placeholder="请选择"
                            default-value="">
                    <a-select-option value>全部</a-select-option>
                    <a-select-option value="0">未发布</a-select-option>
                    <a-select-option value="1">已发布</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->

              <a-col :md="6"
                     :sm="24">
                <span class="table-page-search-submitButtons"
                      :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                  <a-button type="primary"
                            @click="$refs.table.refresh(true)">
                    <a-icon type="search" />查询</a-button>
                  <a-button style="margin-left: 8px"
                            @click="resetSearchForm()">
                    <a-icon type="loading-3-quarters" />重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!-- <a-divider /> -->
        <a-row :gutter="24">
          <a-col :md="4">
            <div style="border:1px dashed #e8e8e8">
              <a-tree @expand="onExpand"
                      @select="onSelect"
                      showIcon
                      :treeData="treeData"
                      :defaultSelectedKeys="defaultSelectedKeys" />
            </div>
          </a-col>
          <a-col :md="19">
            <s-table ref="table"
                     size="default"
                     rowKey="id"
                     :scroll="{ x: '120%', y: 500 }"
                     :columns="columns"
                     :data="loadData"
                     :locale="{emptyText: '暂无内容'}"
                     :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange:onSelectChange }">
              >
              <span slot="status"
                    slot-scope="state, record">
                <template>
                  <a-tag color="orange"
                         v-if="state == '0' ">草稿 {{ record.checkUserName ? '/' +record.checkUserName:'' }}</a-tag>
                  <a-tag color="red"
                         v-if="state == '1' ">已发布{{ record.checkUserName ? '/' +record.checkUserName:'' }}</a-tag>
                  <a-tag color="red"
                         v-if="state == '2' ">已删除{{ record.checkUserName ? '/' +record.checkUserName:'' }}</a-tag>
                </template>
              </span>

              <span slot="titleData"
                    slot-scope="text">
                <template>
                  <span v-html="($options.filters['substr'](text,8))"></span>
                </template>
              </span>
            </s-table>
          </a-col>
        </a-row>
        <top-handle ref="topHandle"
                    @ok="handleOk" />

      </a-card>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import topHandle from './topHandle'
import { treeCategoryAuth } from '@/api/cms/category'
import { page } from '@/api/cms/content'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable,
    topHandle
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
      allowContribute: true,
      treeData: [],
      selectedRowKeys: [],
      selectedRows: [],
      defaultSelectedKeys: ['0'],
      selectTreObj: {},
      visible: false,
      confirmLoading: false,
      queryParam: {
        dto: { categoryId: '0' ,status:'1'}
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
          title: '模型',
          dataIndex: 'modelName'
        },
        {
          title: '状态/发布人',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '置顶级别',
          dataIndex: 'sort'
        },
        {
          title: '发布日期',
          dataIndex: 'publishDate',
          customRender: data => {
            if (data) return moment(data).format('YYYY-MM-DD HH:mm:ss')
          }
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
    this.treeCategory()
  },
  methods: {
    open() {
      this.visible = true
    },
    treeCategory() {
      treeCategoryAuth().then(response => {
        const treeDataArr = []
        if (response.res) { treeDataArr.push(response.res) }
        this.treeData = treeDataArr
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk() {
      //  this.treeCategory()
      this.$refs.table.refresh()
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    onExpand(expandedKeys) {
      // this.expandedKeys = expandedKeys;
      // this.autoExpandParent = false;
    },
    onSelect(selectedKeys, e) {
      this.selectTreObj = e.node.dataRef
      this.queryParam.dto.categoryId = e.node.dataRef.id
      this.handleOk()
      if (e.node.dataRef.attributes) {
        this.allowContribute = e.node.dataRef.attributes.allowContribute
      }
    },
    handleSubmit() {
      if (this.selectedRows.length === 0) {
        this.$message.error('没有选择任何推荐信息!')
        return
      }
      this.$emit('ok', this.selectedRows)
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    resetSearchForm() {
      this.queryParam = {
        dto: { categoryId: '0',status:'1' }
      }
      this.selectTreObj = {}
      this.handleOk()
    }
  }
}
</script>
