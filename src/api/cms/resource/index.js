import { axios } from '@/utils/request'
const serverName="/resource";
const uploadApi="/upload";
const api = {
    page: serverName+'/page',
    save: serverName+'/save',
	getById:serverName+'/get',
	update: serverName+'/update',
	delByPk:serverName+'/delete',
	uploadFile: uploadApi+'/uploadFile',
	deleteFile: uploadApi+'/deleteFile'
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


export function delByPk(parameter) {
  return axios({
    url: api.delByPk,
    method: 'delete',
    params: parameter
  })
}

export function deleteFile(parameter) {
  return axios({
    url: api.deleteFile,
    method: 'delete',
    params: parameter
  })
}


