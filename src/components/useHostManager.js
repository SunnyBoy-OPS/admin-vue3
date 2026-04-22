import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { collectHostSpec, testHostConnection } from '@/api/host.js'

export function useHostManager() {
  const hosts = ref([])

  const keyword = ref('')
  const statusFilter = ref('all')
  const groupFilter = ref('all')

  const showCreateDialog = ref(false)
  const testingConnection = ref(false)
  const savingHost = ref(false)
  const connectionOk = ref(false)
  const connectMessage = ref('')
  const createForm = ref(defaultCreateForm())

  const onlineCount = computed(() => hosts.value.filter((h) => h.status === 'online').length)
  const offlineCount = computed(() => hosts.value.filter((h) => h.status === 'offline').length)
  const warningCount = computed(
    () => hosts.value.filter((h) => h.cpuCores >= 16 || h.memoryTotalGB >= 64 || h.diskTotalGB >= 1000).length
  )

  const filteredHosts = computed(() => {
    return hosts.value.filter((host) => {
      const keywordOk = !keyword.value
        || host.name.toLowerCase().includes(keyword.value.toLowerCase())
        || host.ip.includes(keyword.value)

      const statusOk = statusFilter.value === 'all' || host.status === statusFilter.value
      const groupOk = groupFilter.value === 'all' || host.group === groupFilter.value

      return keywordOk && statusOk && groupOk
    })
  })

  watch(
    () => [createForm.value.ip, createForm.value.port, createForm.value.username, createForm.value.password],
    () => {
      connectionOk.value = false
      connectMessage.value = ''
    }
  )

  function defaultCreateForm() {
    return {
      name: '',
      ip: '',
      port: 22,
      group: '生产',
      os: 'Linux',
      username: '',
      password: ''
    }
  }

  function resetFilter() {
    keyword.value = ''
    statusFilter.value = 'all'
    groupFilter.value = 'all'
  }

  function refreshData() {
    hosts.value = hosts.value.map((item) => {
      if (item.status === 'offline') return item
      return {
        ...item,
        heartbeat: formatNow()
      }
    })
  }

  function openCreateDialog() {
    showCreateDialog.value = true
    createForm.value = defaultCreateForm()
    connectionOk.value = false
    connectMessage.value = ''
  }

  function closeCreateDialog() {
    showCreateDialog.value = false
    createForm.value.password = ''
    connectionOk.value = false
    connectMessage.value = ''
  }

  function validateCreateForm() {
    if (!createForm.value.name) return '请输入主机名称'
    if (!createForm.value.ip) return '请输入主机 IP'
    if (!createForm.value.port || createForm.value.port < 1 || createForm.value.port > 65535) return '请输入有效端口'
    if (!createForm.value.username) return '请输入登录账号'
    if (!createForm.value.password) return '请输入登录密码'
    return ''
  }

  async function runConnectionTest() {
    const error = validateCreateForm()
    if (error) {
      ElMessage.warning(error)
      return
    }

    testingConnection.value = true
    connectionOk.value = false
    connectMessage.value = ''

    try {
      const resp = await testHostConnection({
        host: createForm.value.ip,
        port: createForm.value.port,
        username: createForm.value.username,
        password: createForm.value.password,
        auth_type: 'password'
      })

      const body = resp?.data ?? {}
      const ok = body.code === 0 || body.code === 200 || body.success === true || body.ok === true

      if (ok) {
        connectionOk.value = true
        connectMessage.value = body.msg || '连接成功，可保存主机'
        ElMessage.success(connectMessage.value)
      } else {
        connectionOk.value = false
        connectMessage.value = body.msg || '连接失败，请检查账号密码或网络'
        ElMessage.error(connectMessage.value)
      }
    } catch (error) {
      connectionOk.value = false
      connectMessage.value = '连接接口调用失败，请检查后端接口'
      ElMessage.error(connectMessage.value)
    } finally {
      testingConnection.value = false
    }
  }

  async function saveHost() {
    const error = validateCreateForm()
    if (error) {
      ElMessage.warning(error)
      return
    }

    if (!connectionOk.value) {
      ElMessage.warning('请先测试连接成功后再保存主机')
      return
    }

    if (hosts.value.some((h) => h.ip === createForm.value.ip && h.port === createForm.value.port)) {
      ElMessage.warning('该主机 IP + 端口已存在')
      return
    }

    savingHost.value = true
    try {
      const collectResp = await collectHostSpec({
        host: createForm.value.ip,
        port: createForm.value.port,
        username: createForm.value.username,
        password: createForm.value.password,
        auth_type: 'password'
      })

      const spec = extractHostSpec(collectResp?.data ?? {})
      if (!spec) {
        ElMessage.error('主机配置采集失败，请检查采集接口返回')
        return
      }

      hosts.value.unshift({
        id: `h-${Date.now()}`,
        name: createForm.value.name,
        ip: createForm.value.ip,
        port: createForm.value.port,
        group: createForm.value.group,
        status: 'online',
        os: createForm.value.os || 'Linux',
        username: createForm.value.username,
        cpuCores: spec.cpuCores,
        memoryTotalGB: spec.memoryTotalGB,
        diskTotalGB: spec.diskTotalGB,
        heartbeat: formatNow()
      })
    } catch (err) {
      ElMessage.error('采集接口调用失败，请检查后端 /api/total-metric')
      return
    } finally {
      savingHost.value = false
    }

    ElMessage.success('主机新增成功')
    closeCreateDialog()
  }

  return {
    hosts,
    keyword,
    statusFilter,
    groupFilter,
    showCreateDialog,
    testingConnection,
    savingHost,
    connectionOk,
    connectMessage,
    createForm,
    onlineCount,
    offlineCount,
    warningCount,
    filteredHosts,
    resetFilter,
    refreshData,
    openCreateDialog,
    closeCreateDialog,
    runConnectionTest,
    saveHost
  }
}

function extractHostSpec(body) {
  const data = body?.data || body

  const cpuCores = Number(data.cpuCores ?? data.CpuCore ?? data.cpu_core_count)
  const memoryGBRaw = Number(data.memoryTotalGB ?? data.MemTotal)
  const diskGBRaw = Number(data.diskTotalGB ?? data.DiskTotal)
  const memoryTotalGB = Number.isFinite(memoryGBRaw) && memoryGBRaw > 0 ? memoryGBRaw : NaN
  const diskTotalGB = Number.isFinite(diskGBRaw) && diskGBRaw > 0 ? diskGBRaw : NaN

  if (!(cpuCores > 0 && memoryTotalGB > 0 && diskTotalGB > 0)) return null
  return { cpuCores, memoryTotalGB, diskTotalGB }
}

function formatNow() {
  const d = new Date()
  const pad = (v) => String(v).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
