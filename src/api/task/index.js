import { axios } from '@/utils/request'
const serverName = '/sysJob'
const api = {
  page: serverName + '/page',
  save: serverName + '/save',
  update: serverName + '/update',
  delByPk: serverName + '/deleteByPk',
  getById: serverName + '/getByPk',
  taskAction: serverName+'/taskAction'
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


export function taskAction (parameter) {
  return axios({
    url: api.taskAction,
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

export function delByPk (parameter) {
  return axios({
    url: api.delByPk,
    method: 'delete',
    params: parameter
  })
}
