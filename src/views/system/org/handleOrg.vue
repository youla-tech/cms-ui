<template>
  <a-modal title="分配栏目"
           :width="400"
           :visible="visible"
           @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading"
            style="max-height: 450px;overflow-y: auto;">
      <a-tree checkable
              @expand="onExpand"
              @select="onSelect"
              @check="onCheck"
              :defaultExpandAll="defaultExpandAll"
              :expandedKeys="expandedKeys"
              :autoExpandParent="autoExpandParent"
              v-model="checkedKeys"
              :selectedKeys="selectedKeys"
              :treeData="treeData" />
    </a-spin>
  </a-modal>
</template>
<script>
import { treeCategoryByOrg, saveAssignColumn } from '@/api/cms/category'
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      expandedKeys: [],
      autoExpandParent: true,
      defaultExpandAll: true,
      checkedKeys: [],
      selectedKeys: [],
      allCkKeys: {
        onCheckKeys: [],
        halfCheckedKeys: [],
        orgId: ''
      },
      treeData: [],
      visible: false,
      checkStrictly: true,
      confirmLoading: false,
      isHandle: false
    }
  },
  created() { },
  methods: {
    assignColumn(record) {
      this.allCkKeys.orgId = record.id
      this.isHandle = false
      treeCategoryByOrg({ orgId: record.id }).then(response => {
        this.visible = true
        this.treeData = response.res.children
        this.checkedKeys = response.res.attributes.checkerKeys
      })
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys, enent) {
      const halfCheckedKeys = enent.halfCheckedKeys
      this.checkedKeys = checkedKeys
      this.allCkKeys.halfCheckedKeys = halfCheckedKeys // 半选中
      this.allCkKeys.onCheckKeys = this.checkedKeys // 全选中
      this.isHandle = true
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    handleSubmit() {
      const that = this
      if (that.isHandle) {
        that.confirmLoading = true
        that.saveMyAssignMenu()
      } else {
        that.handleCancel()
      }
    },
    saveMyAssignMenu() {
      this.confirmLoading = true
      saveAssignColumn(this.allCkKeys).then(response => {
        if (response.code === 0) {
          this.$message.info('栏目分配成功！')
          this.$emit('ok')
          this.handleCancel()
        }else{
          this.$message.error(response.msg)
        }
        this.confirmLoading = false
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.checkedKeys = []
      this.selectedKeys = []
      this.expandedKeys = []
      this.treeData = []
    }
  }
}
</script>
