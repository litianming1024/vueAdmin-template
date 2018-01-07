import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

export function createData(data) {
  return request({
    url: '/authority',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/authority',
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: '/authority/' + id,
    method: 'delete'
  })
}
