/* eslint-disable no-mixed-spaces-and-tabs */
import { axios } from '@/utils/request'

const serverName = '/dict'
const api = {
  page: serverName + '/page',
  save: serverName + '/save',
  getById: serverName + '/getByPk',
  update: serverName + '/update',
  delByPk: serverName + '/delByPk',
  listType: serverName + '/listType',
  listByType: serverName + '/listByType'
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

export function listByType (parameter) {
  return axios({
    url: api.listByType,
    method: 'get',
    params: parameter
  })
}

export function listType (parameter) {
  return axios({
    url: api.listType,
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
    method: 'put',
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

export function delByPk (parameter) {
  return axios({
    url: api.delByPk,
    method: 'delete',
    params: parameter
  })
}
