
// 微服务名称
const cloudServer = {
  system: 'system-web',
  auth: 'auth'
}

const api = {
  Login: '/oauth/token',
  Logout: '/auth/logout',
  license: '/api/license/search',
  ForgePassword: '/forge-password',
  Register: '/register',
  twoStepCode: '/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  UserInfo: '/user/info'
}

export default api
