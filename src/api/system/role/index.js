import { axios } from '@/utils/request'
import apindex from './index'
const serverName="/role";
const api = {
  page: serverName+'/page',
  save: serverName+'/save',
	getById:serverName+'/getByPk',
	update: serverName+'/update',
	delByPk:serverName+'/delete',
	selectRoles:serverName+'/selectAllRoles',
	batch:serverName+'/batch',
	queryAssignMenu:'/role/roleMenu/selectTreeMenuByRole',
	saveAssignMenu:'/role/roleMenu/assignMenu',
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

export function queryAssignMenu(parameter) {
  return axios({
    url: api.queryAssignMenu,
    method: 'get',
    params: parameter
  })
}

export function saveAssignMenu(parameter) {
  return axios({
    url: api.saveAssignMenu,
    method: 'post',
		headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
		},
    data: parameter
  })
}



export function delByPk(parameter) {
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
