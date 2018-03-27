import request from '@/utils/request'

const resUrl = '/appointment'

export function fetchList(query) {
  return request({
    url: resUrl,
    method: 'get',
    params: query
  })
}

export function createData(data) {
  return request({
    url: resUrl,
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: resUrl + '/' + id,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: resUrl + '/' + id,
    method: 'delete'
  })
}

export function fetchByApplyStatus(query) {
  return request({
    url: resUrl + '/applyStatus',
    method: 'get',
    params: query
  })
}

export function applyAndInterview(applyId, interviewType) {
  return request({
    url: resUrl + '/applyAndInterview?applyId=' + applyId + '&interviewType=' + interviewType,
    method: 'get'
  })
}

export function needToInterview(query, interviewType, status) {
  return request({
    url: resUrl + '/needToInterview',
    method: 'get',
    params: {
      interviewType: interviewType,
      status: status,
      query
    }
  })
}
