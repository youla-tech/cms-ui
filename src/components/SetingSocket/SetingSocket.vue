<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '200px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-tabs>
          <a-tab-pane tab="站点优化" key="1">
            <a-list>
              <a-list-item>
                   <a-avatar icon="redo"  style="backgroundColor:#87d068"/> 
                   <a-button style="margin-left: 10px;" type="dashed"  @click="genHomePage">手动生成首页</a-button>
              </a-list-item>
             
              <a-list-item>
                   <a-avatar icon="redo"  style="backgroundColor:#87d068"/> 
                   <a-button style="margin-left: 10px;" type="dashed" @click="reStaticWholeSite">手动生成全站</a-button>
              </a-list-item>
             
              <a-list-item>
                   <a-avatar icon="redo"  style="backgroundColor:#87d068"/> 
                   <a-button style="margin-left: 10px;" type="dashed"  @click="flushDB">手动清除缓存</a-button>
              </a-list-item>
              
              <a-list-item>
                   <a-avatar icon="redo"  style="backgroundColor:#87d068"/> 
                   <a-button style="margin-left: 10px;" type="dashed"  @click="flushSolr">手动重置索引</a-button>
              </a-list-item>
              
              <a-list-item>
                    <a-avatar icon="redo"  style="backgroundColor:#87d068"/>
                    <a-tooltip>
                    <template slot='title'>
                      注:仅适用于固定模板生成(适用于没有模板变量的模板)
                    </template>
                    <a-button style="margin-left: 10px;" type="dashed" @click="genFixedTemp">手动生成模板</a-button>
                    </a-tooltip> 
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
      <tree-temp-handle ref="treeTempHandle" @ok="fixedTempOk"/>
      <notify-socket ref="NotifySocket" @notify="notifySuccess"></notify-socket>
    </template>
    <span @click="fetchNotice" class="header-notice">
      <a-badge>
        <a-icon style="font-size: 16px; padding: 4px" type="setting" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import { homePageGen, reStaticWholeSite, flushDB, flushSolr } from '@/api/cms/job'
import NotifySocket from '@/components/NotifySocket/NotifySocket.vue'
import treeTempHandle from './treeTempHandle'
export default {
  components: {
    NotifySocket,
    treeTempHandle
  },
  name: 'HeaderNotice',
  data () {
    return {
      percent: 0,
      loadding: false,
      visible: false
    }
  },
  methods: {
    fetchNotice () {
      this.visible = !this.visible
    },
    clearNotify(){
      this.$refs.NotifySocket.clear()
    },
     genHomePage() {
      this.clearNotify() 
      this.percent = 0
      const that = this
      homePageGen({}).then(response => {
        if (response.code === 0) {
          that.$message.info('请稍后~~')
          setTimeout(function() {
            that.$refs.NotifySocket.open()
          }, 100)
        } else {
          that.$message.warn(response.msg)
        }
      })
    },
    reStaticWholeSite() {
      this.clearNotify() 
      this.percent = 0
      const that = this
      reStaticWholeSite({}).then(response => {
        if (response.code === 0) {
          that.$message.info('请稍后~~')
          setTimeout(function() {
            that.$refs.NotifySocket.open()
          }, 300)
        } else {
          that.$message.warn(response.msg)
        }
      })
    },
    flushSolr() {
      this.clearNotify() 
      this.percent = 0
      const that = this
      flushSolr({}).then(response => {
        if (response.code === 0) {
          that.$message.info('请稍后~~')
          setTimeout(function() {
            that.$refs.NotifySocket.open()
          }, 500)
        } else {
          that.$message.error(response.msg)
        }
      })
    },
    flushDB() {
      this.percent = 0
      flushDB({}).then(response => {
        if (response.code === 0) {
          this.$message.info('清除成功!')
          this.percent = 100
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    genFixedTemp(){
      this.$refs.treeTempHandle.open()
    },
    fixedTempOk(){
      this.clearNotify() 
      this.$refs.NotifySocket.open()
    },
    notifySuccess(progress) {
      this.percent = progress
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
