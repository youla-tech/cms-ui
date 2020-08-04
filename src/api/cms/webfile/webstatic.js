/* eslint-disable no-mixed-spaces-and-tabs */
import { axios } from '@/utils/request'
const webstaticApi = '/webstatic'
const api = {
  page: webstaticApi + '/page',
  deleteFile: webstaticApi+'/deleteFile',
  downZip: webstaticApi+'/downZip',
  uploadFile: webstaticApi+'/uploadFile',
  createFile:webstaticApi+'/createFile',

  save: webstaticApi + '/saveTemp',
  getById: webstaticApi + '/getByPk',
  update: webstaticApi + '/update',
  delByPk: webstaticApi + '/delete',
  treeTemps: webstaticApi+'/treeTemps',
  getFileContent: webstaticApi+'/getFileContent',
  setFileContent: webstaticApi+'/setFileContent',
 
 
}
export default api

export function page (parameter) {
  return axios({
    url: api.page,
    method: 'get',
    // headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    params: parameter
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

export function uploadFile (parameter) {
  return axios({
    url: api.uploadFile,
    method: 'post',
		headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
		},
    data: parameter
  })
}

export function createFile (parameter) {
  return axios({
    url: api.createFile,
    method: 'post',
		// headers: {
		//   'Content-Type': 'application/json;charset=UTF-8'
		// },
    params: parameter
  })
}



export function downZip (parameter) {
  return axios({
    url: api.downZip,
    method: 'post',
    // headers: {
		//   'Content-Type': 'application/json;charset=UTF-8'
    // },
    responseType: 'blob', 
    params: parameter
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
    method: 'put',
    params: parameter
  })
}

export function deleteFile (parameter) {
  return axios({
    url: api.deleteFile,
    method: 'delete',
    params: parameter
  })
}
