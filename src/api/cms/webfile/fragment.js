/* eslint-disable no-mixed-spaces-and-tabs */
import { axios } from '@/utils/request'
const fragmentFileModelApi = '/fragmentFileModel'
const fragmentApi = '/fragment'
const api = {
  page: fragmentApi + '/page',
  save: fragmentFileModelApi + '/saveFragmentFile',
  saveFragment: fragmentApi+'/saveFragment',
  updateFragment: fragmentApi+'/updateFragment',
  getInfoByPk: fragmentApi + '/getInfoByPk',
  getDesignById: fragmentFileModelApi+'/getByPk',
  getFragmentDesignByPk: fragmentFileModelApi+'/getFragmentDesignByPk',
  update: fragmentFileModelApi + '/update',
  delByPk: fragmentFileModelApi + '/delete',
  listTreeFragments: fragmentFileModelApi+'/treeFragmentFiles',
  getFileContent: fragmentFileModelApi+'/getFileContent',
  setFileContent: fragmentFileModelApi+'/setFileContent',
  deleteFile: fragmentFileModelApi+'/deleteFile',
  saveFragmentDirectory: fragmentFileModelApi+'/saveFragmentDirectory',
  updateFragmentDesignFile: fragmentFileModelApi+'/updateFragmentDesignFile',
  delFragmentByPk: fragmentApi + '/deleteFragmentByPk',
  downZip: fragmentFileModelApi+'/downZip',
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

export function saveFragment (parameter) {
  return axios({
    url: api.saveFragment,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}


export function updateFragment (parameter) {
  return axios({
    url: api.updateFragment,
    method: 'put',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}


export function saveFragmentDirectory (parameter) {
  return axios({
    url: api.saveFragmentDirectory,
    method: 'post',
    headers: {
		  'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function updateFragmentDesignFile (parameter) {
  return axios({
    url: api.updateFragmentDesignFile,
    method: 'post',
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

export function getInfoByPk (parameter) {
  return axios({
    url: api.getInfoByPk,
    method: 'get',
    params: parameter
  })
}
export function getDesignById (parameter) {
  return axios({
    url: api.getDesignById,
    method: 'get',
    params: parameter
  })
}


export function getFragmentDesignByPk (parameter) {
  return axios({
    url: api.getFragmentDesignByPk,
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

export function delFragmentByPk (parameter) {
  return axios({
    url: api.delFragmentByPk,
    method: 'delete',
    params: parameter
  })
}




export function listTreeFragmentFiles (parameter) {
  return axios({
    url: api.listTreeFragments,
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
