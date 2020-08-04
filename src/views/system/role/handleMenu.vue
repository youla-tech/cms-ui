<template>
  <a-modal title="分配菜单" :width="400" :visible="visible" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" style="max-height: 450px;overflow-y: auto;">
      <a-tree
        checkable
        @expand="onExpand"
        @select="onSelect"
        @check="onCheck"
        :defaultExpandAll="defaultExpandAll"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        v-model="checkedKeys"
        :selectedKeys="selectedKeys"
        :treeData="treeData"
      />
    </a-spin>
  </a-modal>
</template>
<script>
import {
  queryAssignMenu,
  saveAssignMenu
} from '@/api/system/role'
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
        roleId: ''
      },
      treeData: [],
      visible: false,
      checkStrictly: true,
      confirmLoading: false,
      isHandle: false
    }
  },
  created() {},
  methods: {
    assignMenu(record) {
      this.allCkKeys.roleId = record.id
      this.isHandle = false
      queryAssignMenu({ roleId: record.id }).then(response => {
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
        if (that.allCkKeys.onCheckKeys.length == 0) {
          this.$confirm({
            title: '操作提醒',
            content: '确定清除所有权限?',
            onOk() {
              that.allCkKeys.onCheckKeys = ['-1']
              that.saveMyAssignMenu()
            },
            onCancel() {}
          })
        }
        that.saveMyAssignMenu()
      } else {
        that.handleCancel()
      }
    },
    saveMyAssignMenu() {
      this.confirmLoading = true
      saveAssignMenu(this.allCkKeys).then(response => {
        if (response.code === 0) {
          this.$message.info(response.msg)
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
