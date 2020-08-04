import { axios } from '@/utils/request'
const categoryApi = '/cmsCategory'
const orgCategoryApi = '/sysOrgCategory'
const api = {
  page: categoryApi + '/page',
  save: categoryApi + '/save',
  getById: categoryApi + '/getInfoById',
  reStaticFileByCid: categoryApi + '/reStaticFileByCid',
  update: categoryApi + '/update',
  delByPk: categoryApi + '/delete',
  treeCategory: categoryApi + '/selectTreeCategory',
  treeCategoryAuth: categoryApi + '/selectTreeCategoryAuth',
  deleteByCategoryId: categoryApi + '/deleteByCategoryId',
  updateContentModel: categoryApi + '/updateContentModel',
  treeCategoryByOrg: orgCategoryApi + '/selectTreeCategoryByOrg',
  saveAssignColumn: orgCategoryApi + '/saveOrgCategory'
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

export function reStaticFileByCid(parameter) {
  return axios({
    url: api.reStaticFileByCid,
    method: 'get',
    params: parameter
  })
}

export function updateContentModel(parameter) {
  return axios({
    url: api.updateContentModel,
    method: 'put',
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

export function deleteByCategoryId(parameter) {
  return axios({
    url: api.deleteByCategoryId,
    method: 'delete',
    params: parameter
  })
}

export function treeCategory(parameter) {
  return axios({
    url: api.treeCategory,
    method: 'get',
    params: parameter
  })
}

export function treeCategoryAuth(parameter) {
  return axios({
    url: api.treeCategoryAuth,
    method: 'get',
    params: parameter
  })
}

export function treeCategoryByOrg(parameter) {
  return axios({
    url: api.treeCategoryByOrg,
    method: 'get',
    params: parameter
  })
}

export function saveAssignColumn(parameter) {
  return axios({
    url: api.saveAssignColumn,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: parameter
  })
}
