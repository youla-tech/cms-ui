/* eslint-disable no-mixed-spaces-and-tabs */
import { axios } from '@/utils/request'
const templatesApi = '/templates'
const api = {
  page: templatesApi + '/page',
  save: templatesApi + '/saveTemp',
  getById: templatesApi + '/getByPk',
  update: templatesApi + '/update',
  delByPk: templatesApi + '/delete',
  treeTemps: templatesApi+'/treeTemps',
  getFileContent: templatesApi+'/getFileContent',
  setFileContent: templatesApi+'/setFileContent',
  deleteFile: templatesApi+'/deleteFile',
  downZip: templatesApi+'/downZip',
  getDirects: templatesApi+'/getDirects'
}
export default api

export function page (parameter) {
  return axios({
    url: api.page,
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
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

export function downZip (parameter) {
  return axios({
    url: api.downZip,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'blob', 
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
export function getDirects (parameter) {
  return axios({
    url: api.getDirects,
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

export function treeTemps (parameter) {
  return axios({
    url: api.treeTemps,
    method: 'get',
    params: parameter
  })
}

export function getFileContent (parameter) {
  return axios({
    url: api.getFileContent,
    method: 'get',
    params: parameter
  })
}

export function setFileContent (parameter) {
  return axios({
    url: api.setFileContent,
    method: 'post',
    data: parameter
  })
}

export function deleteFile (parameter) {
  return axios({
    url: api.deleteFile,
    method: 'delete',
    params: parameter
  })
}
