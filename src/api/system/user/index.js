/* eslint-disable no-mixed-spaces-and-tabs */
import { axios } from '@/utils/request'

const serverName = '/user'
const api = {
  page: serverName + '/page',
  save: serverName + '/save',
  getById: serverName + '/getById',
  update: serverName + '/update',
  delByPk: serverName + '/delete',
  selectRoles: '/role/selectAllRoles',
  batch: serverName + '/batch',
  getUserInfo: serverName + '/info',
  updateUserInfo: serverName + '/updateUserInfo',
  modifyPass: serverName + '/modifyPass',
  resetPass: serverName+'/resetPass'
}
export default api

export function page (parameter) {
  return axios({
    url: api.page,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function modifyPass (parameter) {
  return axios({
    url: api.modifyPass,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function save (parameter) {
  return axios({
    url: api.save,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function updateUserInfo (parameter) {
  return axios({
    url: api.updateUserInfo,
    method: 'put',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function update (parameter) {
  return axios({
    url: api.update,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function batch (parameter) {
  return axios({
    url: api.batch,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function getById (parameter) {
  return axios({
    url: api.getById,
    method: 'get',
    params: parameter
  })
}

export function getUserInfo (parameter) {
  return axios({
    url: api.getUserInfo,
    method: 'get',
    params: parameter
  })
}

export function resetPass (parameter) {
  return axios({
    url: api.resetPass,
    method: 'put',
    params: parameter
  })
}



export function delByPk (parameter) {
  return axios({
    url: api.delByPk,
    method: 'delete',
    params: parameter
  })
}

export function selectRoles (parameter) {
  return axios({
    url: api.selectRoles,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
