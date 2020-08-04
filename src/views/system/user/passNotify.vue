<template>
  <div>
    <a-modal
      title="密码更改"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <p>新密码为:  {{ password }}</p>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      password: '',
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    open(e) {
      this.visible = true
	    this.password = e.res
    },
    handleOk(e) {
      this.visible = false
      this.confirmLoading = false
    },
    handleCancel(e) {
      this.visible = false
    }
  }
}
</script>
