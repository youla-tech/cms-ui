<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
                     <a-col :md="6">
        <div class="table-operator">
          <a-button type="primary"
                    v-has="{perm:'content:deleteBatch'}"
                    @click="handleDeletes('2')">
            <a-icon type="delete" />彻底删除</a-button>
          <a-button type="primary"
                    v-has="{perm:'content:auditBatch'}"
                    @click="handleDeletes('0')">
            <a-icon type="rollback" />批量恢复</a-button>
        </div>
      </a-col>
          <a-col :md="4"
                 :sm="24">
            <a-form-item label="标题">
              <a-input v-model="queryParam.dto.title"
                       placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="4"
                 :sm="10">
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
                slot-scope="text, record">
            <template>
              <span v-html="($options.filters['substr'](text,8))"></span>
            </template>
          </span>

         <span slot="expiryDate"
                slot-scope="text, record">
            <template>
              <span v-if="text"> <a-icon type='clock-circle' />{{formaterDate(text)}} </span>
              <span v-if="!text"> <a-icon type="close-circle" /> </span>
            </template>
          </span>

          <!-- <span slot="action"
                slot-scope="text, record">
            <template>
               <a-tag color="green"
                     @click="handleDelete(record)"
                     v-has="{perm:'content:delete'}">恢复</a-tag>
              <a-tag color="red"
                     @click="handleDelete(record)"
                     v-has="{perm:'content:delete'}">彻底删除</a-tag>
            </template>
          </span> -->
        </s-table>
      </a-col>
    </a-row>
    <form-handle ref="formHandle"
                 @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import formHandle from './handle'
import { treeCategoryAuth } from '@/api/cms/category'
import { pageRecycler, delByPksfinalDoIt } from '@/api/cms/content'
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
      fileItem: {
        fileContent: '',
        filePath: null,
        isLeaf: false
      },
      codeOptions: {
        lineNumbers: true,
        smartIndent: true,
        theme: 'ambiance'
      },
      advanced: false,
      allowContribute: true,
      singlePage: false,
      resRowNum: 0,
      treeData: [],
      selectedRowKeys: [],
      selectedRows: [],
      defaultSelectedKeys: ['0'],
      selectTreObj: {},
      queryParam: {
        dto: { categoryId: '0', status: '2' }
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
          title: '创建日期',
          dataIndex: 'gmtCreate',
          customRender: data => {
            if (data) return moment(data).format('YYYY-MM-DD HH:mm:ss')
          }
        }
        // ,{
        //   title: '操作',
        //   dataIndex: 'action',
        //   width: '250px',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      loadData: parameter => {
        return pageRecycler(Object.assign(parameter, this.queryParam)).then(
          response => {
            this.resRowNum = response.res.total
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
    formaterDate(date) {
      return moment(date).format('YY-MM-DD HH:mm:ss')
    },
    handleDeletes(status) {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择要操作的记录')
        return
      }
      const that = this
      this.$confirm({
        title: '操作提醒',
        content: '确定要执行该操作吗?',
        onOk() {
          delByPksfinalDoIt({ ids: that.selectedRowKeys, status: status })
            .then(response => {
              that.$message.info(response.msg)
              that.handleOk()
            })
            .catch(response => {
              that.$message.warn(response.msg)
            })
        },
        onCancel() { }
      })
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
        this.singlePage = e.node.dataRef.attributes.singlePage
      }
    },
    resetSearchForm() {
      this.queryParam = {
        dto: { categoryId: '0', status: '2' }
      }
      this.selectTreObj = {}
      this.handleOk()
    }
  }
}
</script>
