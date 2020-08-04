/* eslint-disable no-mixed-spaces-and-tabs */
import { axios } from '@/utils/request'
const serverName = '/cmsModel'
const api = {
  page: serverName + '/page',
  save: serverName + '/save',
  getById: serverName + '/getByPk',
  update: serverName + '/update',
  delByPk: serverName + '/delete',
  listDefaultField: serverName + '/listDefaultField',
  listAllModel: serverName + '/listAllModel'
}
export default api

export function page(parameter) {
  return axios({
    url: api.page,
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: parameter
  })
}

export function listAllModel(parameter) {
  return axios({
    url: api.listAllModel,
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: parameter
  })
}

export function save(parameter) {
  return axios({
    url: api.save,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function update(parameter) {
  return axios({
    url: api.update,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function getById(parameter) {
  return axios({
    url: api.getById,
    method: 'get',
    params: parameter
  })
}

export function delByPk(parameter) {
  return axios({
    url: api.delByPk,
    method: 'delete',
    params: parameter
  })
}

export function listDefaultField(parameter) {
  return axios({
    url: api.listDefaultField,
    method: 'get',
    params: parameter
  })
}

