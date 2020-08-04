import { axios } from '@/utils/request'
const serverName = '/log'
const api = {
  page: serverName + '/page',
  save: serverName + '/save',
  getById: serverName + '/get',
  update: serverName + '/update',
  delByPk: serverName + '/delete',
  loadSql: serverName + '/sqlLog'
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

export function loadSql(parameter) {
  return axios({
    url: api.loadSql,
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
