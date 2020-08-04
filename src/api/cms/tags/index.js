import { axios } from '@/utils/request'
const cmsTagsApi="/cmsTags";
const cmsTagsTypeApi="/cmsTagsType";
const api = {
    page: cmsTagsApi+'/page',
    save: cmsTagsApi+'/save',
	  getById:cmsTagsApi+'/getByPk',
	  update: cmsTagsApi+'/update',
    delByPk:cmsTagsApi+'/deleteByPk',
    listTagTypes:cmsTagsTypeApi+'/list'

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

export function listTagTypes (parameter) {
  return axios({
    url: api.listTagTypes,
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


export function delByPk(parameter) {
  return axios({
    url: api.delByPk,
    method: 'delete',
    params: parameter
  })
}



