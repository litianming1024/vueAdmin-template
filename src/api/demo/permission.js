import request from '@/utils/request'

const resUrl = '/authority'

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
