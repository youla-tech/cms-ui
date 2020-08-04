<template>
  <div class="user-wrapper">
    <div class="content-box">
     <!-- <a href="https://pro.loacg.com/docs/getting-started" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a> -->
      <seting-socket class="action"/>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <!-- <a-avatar class="avatar" size="small" :src="avatar()"/> -->
          <span>{{ nickname() }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">

          <a-menu-item key="1">
            <router-link :to="{ name: 'account' }">
              <a-icon type="setting"/>
              <span>个人信息</span>
            </router-link>
          </a-menu-item>

          <a-menu-item key="4">
			<a href="javascript:;" @click="handleToSite">
			  <a-icon type="arrow-right" />
			  <span>前往门户</span>
			</a>
          </a-menu-item>


        <a-menu-divider/>
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
// import NoticeIcon from '@/components/NoticeIcon'
import SetingSocket from '@/components/SetingSocket'
import { mapActions, mapGetters } from 'vuex'
import { domainUrl } from '@/utils/request.js'
export default {
  name: 'UserMenu',
  components: {
    SetingSocket
  },
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar']),
    handleLogout() {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that.Logout({}).then(() => {
            window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel() {
        }
      })
    },
    handleToSite() {
      window.open(domainUrl, '_blank')
    }
  }
}
</script>
