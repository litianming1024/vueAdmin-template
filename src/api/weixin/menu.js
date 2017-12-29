import request from '@/utils/request'

export function fetchMenu() {
  return request({
    url: '/weixin/menu',
    method: 'get'
  })
}

export function postMenu(data) {
  return request({
    url: '/weixin/menu',
    method: 'post',
    data
  })
}

