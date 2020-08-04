import { axios } from '@/utils/request'
const contentApi = '/content'
const analysisApi = '/analysis'
const contentRelatedApi = '/contentRelated'
const api = {
  page: contentApi + '/page',
  pageRecycler: contentApi + '/pageRecycler',
  save: contentApi + '/save',
  saveContent: contentApi + '/saveContent',
  updateContent: contentApi + '/updateContent',
  getById: contentApi + '/getByPk',
  getCreateForm: contentApi + '/getCreateForm',
  update: contentApi + '/update',
  delByPk: contentApi + '/deleteByPk',
  delByPks: contentApi + '/deleteByIds',
  delByPksfinalDoIt: contentApi + '/delByPksfinalDoIt',
  publish: contentApi + '/publish',
  jobPublish: contentApi + '/jobPublish',
  top: contentApi + '/top',
  move: contentApi + '/move',
  analysis: analysisApi + '/index',
  pageContentRelated: contentRelatedApi + '/page',
  reStaticBatchGenCid: contentApi + '/reStaticBatchGenCid',
  getTopTag: contentApi+'/getTopTag'

}
export default api

export function page(parameter) {
  return axios({
    url: api.page,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function pageRecycler(parameter) {
  return axios({
    url: api.pageRecycler,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function pageContentRelated(parameter) {
  return axios({
    url: api.pageContentRelated,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
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

export function reStaticBatchGenCid(parameter) {
  return axios({
    url: api.reStaticBatchGenCid,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function saveContent(parameter) {
  return axios({
    url: api.saveContent,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function updateContent(parameter) {
  return axios({
    url: api.updateContent,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function top(parameter) {
  return axios({
    url: api.top,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function moveToCategory(parameter) {
  return axios({
    url: api.move,
    method: 'put',
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

export function publish(parameter) {
  return axios({
    url: api.publish,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}

export function jobPublish(parameter) {
  return axios({
    url: api.jobPublish,
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

export function analysis(parameter) {
  return axios({
    url: api.analysis,
    method: 'get',
    params: parameter
  })
}

export function getCreateForm(parameter) {
  return axios({
    url: api.getCreateForm,
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
export function delByPks(parameter) {
  return axios({
    url: api.delByPks,
    method: 'delete',
    data: parameter
  })
}

export function delByPksfinalDoIt(parameter) {
  return axios({
    url: api.delByPksfinalDoIt,
    method: 'delete',
    data: parameter
  })
}

export function getTopTag(parameter) {
  return axios({
    url: api.getTopTag,
    method: 'get',
    params: parameter
  })
}
