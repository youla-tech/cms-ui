/* eslint-disable no-mixed-spaces-and-tabs */
import { axios } from '@/utils/request'

const serverName = '/resource'
const api = {
  page: serverName + '/backupsPage',
  saveStaticFile: serverName + '/saveStaticFile',
  recoverBackups: serverName + '/recoverBackups',
  delByPk: serverName + '/deleteByPk',
  recoverStaticFile: serverName + '/recoverBackups'
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

export function delByPk (parameter) {
  return axios({
    url: api.delByPk,
    method: 'delete',
    params: parameter
  })
}

export function saveStaticFile () {
  return axios({
    url: api.saveStaticFile,
    method: 'get'
  })
}

export function recoverBackups (parameter) {
  return axios({
    url: api.recoverBackups,
    method: 'get',
    params: parameter
  })
}

export function recoverStaticFile (parameter) {
  return axios({
    url: api.recoverStaticFile,
    method: 'get',
    params: parameter
  })
}
