<template>
  <!-- 	  <a-card :bordered="false">
<div style="position:absolute;right:0px;bottom:0px">
    <a-popconfirm
      placement="bottomRight"
      :visible="visible"
      okText="确定"
      cancelText="取消"
      @confirm="confirm"
      @visibleChange="handleVisibleChange">
      <template slot="title">
        <p>111</p>
      </template>
    </a-popconfirm>
    <a-row :gutter="12">
			<a-button @click="send('wwww')">发送消息</a-button>
				<a-button @click="sendPoint('wwww')">发送消息点对点</a-button>
		</a-row>
  </div>
  </a-card > -->
  <a-modal title="静态化结果通知"
           style="top: 220px;"
           :visible="visible"
           @ok="confirm"
           @cancel="cancel">

    <a-progress :percent="percent" status="active" />
    <div style="max-height: 200px;overflow-y: auto;overflow-x: hidden;"
         ref="box"
         id="box">
         <div :key="index"  v-for="(notify,index) in notifyMsg">
           <p style="color: #3cc37ed1" v-if="notifyMsg.length > 0"> {{ notify.staticFilePath }} ok!</p>
         </div>
         <p style="color: red;" v-show="errShow"> {{ errMsg }} error! </p>
    </div>
  </a-modal>
</template>

<script>
import moment from 'moment'
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import store from '@/store'
import { ApiUrl } from '@/utils/request.js'
export default {
  name: 'ExtendsJson',
  components: {},
  props: {

  },
  data() {
    return {
      stompClient: {},
      visible: false,
      notifyMsg: [],
      percent: 0,
      errMsg: '',
      errShow: false,
      token: '',
      box: null,
      headers: {
        authorization: 'authorization-text'
      }
    }
  },
  created() {
    this.token = store.getters.token
    this.initWebSocket()
  },
  watch: {
    notifyMsg(newVal, oldVal) {
	  const dom = document.getElementById('box')
	  if (dom) {
		  var scrollHeight = dom.scrollHeight
		  document.getElementById('box').scrollTop = scrollHeight
	  }
    }
  },
  methods: {
    moment,
    open() {
      if (!this.visible) {
        this.errShow = false
        this.visible = true
      }
    },
    clear() {
      this.notifyMsg = []
      this.percent = 0
    },
    confirm() {
      this.notifyMsg = []
      this.percent = 0
      this.visible = false
    },
    cancel() {
      this.notifyMsg = []
      this.percent = 0
      this.visible = false
      this.errShow = false
    },
    send(msg) {
      this.stompClient.send('/app/socket/send', {}, '广播内容')
    },
    sendPoint(s) {
      this.stompClient.send('/app/socket/sendChatMsgByOwn', {}, '广播内容')
    },
    initWebSocket() {
      this.connection()
      // 需要有一个失败重连得到问题
    },
    connection() {
      // 更换that指针
      const that = this
      const socket = new SockJS(ApiUrl + '/stomp?token=' + this.token)
      this.stompClient = Stomp.over(socket)
      this.stompClient.hasDebug = null
      // 建立连接，订阅主题
      this.stompClient.connect({}, (frame) => {
        this.stompClient.subscribe('/user/queue/msg', (val) => {
          const notifyRes = JSON.parse(val.body)
          if (notifyRes.code === 0) {
            that.notifyMsg.push(notifyRes)
            that.percent = notifyRes.progress
            that.$emit('notify', that.percent)
          } else {
            that.errShow = true
            that.errMsg = notifyRes.msg
          }
        })
        this.stompClient.subscribe('/topic/sub', function(response) {
          //  alert('socker 链接失败')
          // console.log(response)
        })
      })
      // 回调函数 3 end
    }
  }
}
</script>
