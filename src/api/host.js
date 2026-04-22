import request from '@/utils/request.js'

const BASE = '/v1/hosts'
const CONNECT_TEST_ENDPOINT = '/connect-test-host'
const COLLECT_SPEC_ENDPOINT = '/total-metric'

// 查询主机
export function getHostList(params) {
  return request({
    url: BASE,
    method: 'get',
    data: params
  })
}

// 添加主机
export function createHost(data) {
  return request({
    url: BASE,
    method: 'post',
    data
  })
}

// 测试主机连通性
export function testHostConnection(data) {
  return request({
    url: CONNECT_TEST_ENDPOINT,
    method: 'post',
    data
  })
}

// 主机总配置采集（CPU核数/内存总数/磁盘总数）
export function collectHostSpec(data) {
  return request({
    url: '/total-metric',
    method: 'post',
    data
  })
}
