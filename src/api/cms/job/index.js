import { axios } from '@/utils/request'
const jobApi = '/job'
const api = {
  homePageGen: jobApi + '/homePageGen',
  reStaticWholeSite: jobApi + '/reStaticWholeSite',
  flushDB: jobApi + '/flushDB',
  reContentToSolrCore : jobApi +'/reContentToSolrCore',
  genFixedTemp: jobApi+'/genFixedTemp'
}
export default api

export function homePageGen(parameter) {
  return axios({
    url: api.homePageGen,
    method: 'get',
    params: parameter
  })
}

export function reStaticWholeSite(parameter) {
  return axios({
    url: api.reStaticWholeSite,
    method: 'get',
    params: parameter
  })
}

export function flushDB(parameter) {
  return axios({
    url: api.flushDB,
    method: 'put',
    params: parameter
  })
}

export function flushSolr(parameter) {
  return axios({
    url: api.reContentToSolrCore,
    method: 'put',
    params: parameter
  })
}

export function genFixedTemp(parameter) {
  return axios({
    url: api.genFixedTemp,
    method: 'put',
    params: parameter
  })
}



// export function saveContent (parameter) {
//   return axios({
//     url: api.saveContent,
//     method: 'post',
//     headers: {
// 		  'Content-Type': 'application/json;charset=UTF-8'
//     },
//     data: parameter
//   })
// }

