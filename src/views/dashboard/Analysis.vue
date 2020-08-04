<template>
  <div class="page-header-index-wide">
      <a-spin :spinning="confirmLoading">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总内存" :total="hardWareInfo.memory_total">
          <a-tooltip title="实时显示内存使用情况如下" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">内存使用率</span>
              {{hardWareInfo.memory_use_rate}}
            </trend>
             <mini-progress color="rgb(19, 194, 194)" :target="100" :percentage="memoryUse" height="8px" />
          </div>
          <template slot="footer">

            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">使用</span>
             {{ hardWareInfo.memory_use_total | NumberFormat }}
            </trend>

            <trend flag="up">
              <span slot="term">剩余</span>
             {{ hardWareInfo.memory_surplus_total | NumberFormat }}
            </trend>

          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="CPU核数" :total="hardWareInfo.cpu_core_total | NumberFormat">
          <a-tooltip title="实时显示CPU使用情况如下" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
             <!-- <mini-bar ref="cpu"/> -->
            <!-- <mini-area /> -->
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">CPU使用率</span>
              {{hardWareInfo.cpu_use}}
            </trend>

             <mini-progress color="rgb(19, 194, 194)" :target="100" :percentage="cpuUse" height="8px" />
          </div>
          <template slot="footer">
           <trend flag="down" style="margin-right: 16px;">
              <span slot="term">系统</span>
             {{ hardWareInfo.cpu_sys_use | NumberFormat }}
            </trend>
            <trend flag="up">
              <span slot="term">用户</span>
             {{ hardWareInfo.cpu_usr_use | NumberFormat }}
            </trend>

          </template>
        </chart-card>
      </a-col>

 <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="JVM总内存" :total="hardWareInfo.jvm_total">
          <a-tooltip title="实时显示JVM内存使用情况如下" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">JVM使用率</span>
              {{hardWareInfo.jvm_use_rate}}
            </trend>
             <mini-progress color="rgb(19, 194, 194)" :target="100" :percentage="jvmUse" height="8px" />
          </div>
          <template slot="footer">

            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">使用</span>
             {{ hardWareInfo.jvm_use_total | NumberFormat }}
            </trend>

            <trend flag="up">
              <span slot="term">剩余</span>
             {{ hardWareInfo.jvm_surplus_total | NumberFormat }}
            </trend>

          </template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="运行环境" :total="hardWareInfo.os_name">
          <a-tooltip title="系统信息概览" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up1" style="margin-right: 16px;">
              <span slot="term">系统架构</span>
              {{hardWareInfo.os_arch}}
            </trend>

            <trend flag="up1" style="margin-right: 16px;">
              <span slot="term">JDK版本</span>
              {{hardWareInfo.java_version}}
            </trend>

          </div>
          <template slot="footer">
            <trend flag="down1" style="margin-right: 16px;">
              <span slot="term">JDK:</span>
              {{hardWareInfo.java_home}}
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>
</a-spin>
    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="isDesktop() ? 'desktop' : ''">
      <a-row :gutter="24">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" :title="'系统线程('+hardWareInfo.threads.length+')'"   :style="{ marginTop: '24px', minHeight: '500px' }">
            <a-row :gutter="68">
              <a-col :xs="24" :sm="12" :style="{ marginBottom: ' 24px'}">
                <!-- miniChart -->

              </a-col>

            </a-row>
            <div class="ant-table-wrapper">
              <a-table
                row-key="index"
                size="small"
                :columns="threadColumns"
                :dataSource="threadData"
                :pagination="{ pageSize: 5 }"
              >
                <span slot="range" slot-scope="text, record">
                  <trend :flag="record.status === 0 ? 'up' : 'down'">
                    {{ text }}%
                  </trend>
                </span>
              </a-table>
            </div>
          </a-card>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" :title="'硬盘占比( 总容量:'+hardWareInfo.hardDrive_total+')'" :style="{ marginTop: '24px', minHeight: '500px' }">
            <div slot="extra" style="height: inherit;">
              <!-- style="bottom: 12px;display: inline-block;" -->
            </div>
            <div>
              <!-- style="width: calc(100% - 240px);" -->
              <div>
                <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="item*percent" />
                  <v-axis />
                  <!-- position="right" :offsetX="-140" -->
                  <v-legend dataKey="item"/>
                  <v-pie position="percent" color="item" :vStyle="pieStyle" />
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                </v-chart>
              </div>

            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-row>
          <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="实时任务监控" :style="{ marginTop: '24px', minHeight: '200px' }">

            <div>
             <a-list itemLayout="horizontal" :dataSource="jobData">
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <a-list-item-meta :description="item.action">
                    <a slot="title" href="#">{{item.code}} 创建日期:{{ formater(item.gmt_create)}}</a>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>

</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import { ApiUrl } from '@/utils/request.js'
import store from '@/store'
import moment from 'moment'
import { ChartCard, MiniProgress, Trend } from '@/components'
import { mixinDevice } from '@/utils/mixin'
const DataSet = require('@antv/data-set')
const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%'
}]

export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    ChartCard,
    MiniProgress,
    Trend
  },
  data() {
    return {
      stompClient: {},
      token: '',
      hardWareInfo: {
        threads: [],
        hardDrive_total: '载入中'
      },
      cpuUse: 0,
      jvmUse: 0,
      memoryUse: 0,
      loading: true,
      confirmLoading: false,
      threadData: [],
      threadColumns: [
        {
          dataIndex: 'index',
          title: 'ID',
          width: 90
        },
        {
          dataIndex: 'name',
          title: '名称'
        },
        {
          dataIndex: 'alive',
          title: '是否存活',
          customRender: val => {
            return val ? '存活' : '未存活'
          }
        },
        {
          dataIndex: 'priority',
          title: '优先级'
        },
        {
          dataIndex: 'state',
          title: '状态'
        },
        {
          dataIndex: 'interrupted',
          title: '是否停止',
          customRender: val => {
            return val ? '已停止' : '未停止'
          }
        },
        {
          dataIndex: 'daemon',
          title: '线程类型',
          customRender: val => {
            return val ? '守护线程' : '普通线程'
          }
        }
      ],
      jobData: [

      ],
      pieScale,
      pieData: [],
      sourceData: [],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  created() {
    this.confirmLoading = true
    this.token = store.getters.token
    this.initWebSocket()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.showMessage()
  },
  watch: {
    hardWareInfo(to, from) {
      if (this.confirmLoading) {
        this.confirmLoading = false
      }
    }
  },
  methods: {
    initWebSocket() {
      this.connection()
      // 需要有一个失败重连得到问题
    },
    showMessage(){
        this.$notification.open({
          message: '骚年，你有新的消息',
          placement: 'bottomRight',
          duration: null,
          description:
            '骚年，敢不敢加个群聊吧,一起交流、一起学习、一起扯淡吧',
          btn: h => {
            return h(
              'a-button',
              {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                on: {
                  click: () => this.joinClub(),
                },
              },
              '确定加入',
            );
          },
        });
    },
    joinClub(){
     window.open('https://jq.qq.com/?_wv=1027&k=5QtXTll')
    },
    connection() {
      // 更换that指针
      const that = this
      const socket = new SockJS(ApiUrl + '/stomp?token=' + this.token)
      this.stompClient = Stomp.over(socket)
      this.stompClient.hasDebug = null
      // 建立连接，订阅主题
      this.stompClient.connect({}, (frame) => {
        this.stompClient.subscribe('/topic/hardWareMonitor', function(response) {
          //  alert('socker 链接失败')
          if (response.body) {
            that.hardWareInfo = JSON.parse(response.body)
          }
          that.setUseRate(that.hardWareInfo)
        })

        this.stompClient.subscribe('/topic/executeJob', function(response) {
          if (response.body) {
            const resJson = JSON.parse(response.body)
            that.jobData = [resJson]
          }
        })
      })
      // 回调函数 3 end
    },
    setUseRate(hardWareInfo) {
      this.cpuUse = this.getUseRate(hardWareInfo.cpu_use)
      this.jvmUse = this.getUseRate(hardWareInfo.jvm_use_rate)
      this.memoryUse = this.getUseRate(hardWareInfo.memory_use_rate)
      this.threadData = this.getthreadData(hardWareInfo.threads)
      if (this.pieData.length === 0) {
        this.setPie(hardWareInfo.hardDrive_rate_total)
      }
    },
    getUseRate(use) {
      if (use) {
        const usrRateStr = use.replace('%', '')
        return parseInt(usrRateStr)
      } else {
        return 0
      }
    },
    getthreadData(threads) {
      const searchData = []
      if (threads.length > 0) {
        for (let i = 0; i < threads.length; i += 1) {
          searchData.push({
            index: threads[i].id + 1,
            priority: threads[i].priority,
            name: threads[i].name,
            alive: threads[i].alive,
            state: threads[i].state,
            interrupted: threads[i].interrupted,
            daemon: threads[i].daemon
          })
        }
      }
      return searchData
    },
    setPie(hardDrives) {
      const sourceData = []
      if (hardDrives.length > 0) {
        hardDrives.forEach(function(item, index) {
          const objKeys = Object.keys(item)
          if (objKeys.length > 0) {
            objKeys.forEach(function(key, index) {
              sourceData.push({
                item: key,
                count: item[key]
              })
            })
          }
        })
      }
      // console.log(sourceData)
      const dv = new DataSet.View().source(sourceData)
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
      })
      this.pieData = dv.rows
    },
    formater(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;

    &.desktop div[class^=ant-col]:last-child {
      position: absolute;
      right: 0;
      height: 100%;
    }
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
