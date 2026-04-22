<template>
  <div class="host-manager">
    <header class="top-bar card">
      <div>
        <h2>主机管理</h2>
        <p>统一管理主机在线状态、资源负载与分组标签</p>
      </div>
      <div class="bar-actions">
        <button class="btn" @click="refreshData">刷新状态</button>
        <button class="btn primary" @click="openCreateDialog">新增主机</button>
      </div>
    </header>

    <section class="summary-grid">
      <article class="card stat">
        <p>主机总数</p>
        <strong>{{ hosts.length }}</strong>
      </article>
      <article class="card stat online">
        <p>在线主机</p>
        <strong>{{ onlineCount }}</strong>
      </article>
      <article class="card stat offline">
        <p>离线主机</p>
        <strong>{{ offlineCount }}</strong>
      </article>
      <article class="card stat warning">
        <p>高配主机</p>
        <strong>{{ warningCount }}</strong>
      </article>
    </section>

    <section class="card filter-bar">
      <input
        v-model.trim="keyword"
        type="text"
        placeholder="按主机名/IP搜索"
      />
      <select v-model="statusFilter">
        <option value="all">全部状态</option>
        <option value="online">在线</option>
        <option value="offline">离线</option>
      </select>
      <select v-model="groupFilter">
        <option value="all">全部分组</option>
        <option value="生产">生产</option>
        <option value="预发">预发</option>
        <option value="测试">测试</option>
      </select>
      <button class="btn" @click="resetFilter">重置</button>
    </section>

    <section class="card host-table-wrap">
      <table class="host-table">
        <thead>
          <tr>
            <th>主机名</th>
            <th>IP 地址</th>
            <th>分组</th>
            <th>状态</th>
            <th>CPU核数</th>
            <th>内存总数</th>
            <th>磁盘总数</th>
            <th>登录账号</th>
            <th>最后心跳</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="host in filteredHosts" :key="host.id">
            <td>
              <div class="host-name-cell">
                <strong>{{ host.name }}</strong>
                <small>{{ host.os }}</small>
              </div>
            </td>
            <td>{{ host.ip }}:{{ host.port }}</td>
            <td>
              <span class="tag">{{ host.group }}</span>
            </td>
            <td>
              <span class="status" :class="host.status">{{ host.status === 'online' ? '在线' : '离线' }}</span>
            </td>
            <td>
              {{ host.cpuCores }} 核
            </td>
            <td>
              {{ host.memoryTotalGB }} GB
            </td>
            <td>
              {{ host.diskTotalGB }} GB
            </td>
            <td>{{ host.username || '-' }}</td>
            <td>{{ host.heartbeat }}</td>
            <td>
              <div class="table-actions">
                <button class="btn mini">详情</button>
                <button class="btn mini" :disabled="host.status === 'offline'">远程</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filteredHosts.length">
            <td colspan="10" class="empty">暂无符合条件的主机</td>
          </tr>
        </tbody>
      </table>
    </section>

    <HostCreateDialog
      :visible="showCreateDialog"
      :form="createForm"
      :testing-connection="testingConnection"
      :saving-host="savingHost"
      :connection-ok="connectionOk"
      :connect-message="connectMessage"
      @close="closeCreateDialog"
      @test="runConnectionTest"
      @save="saveHost"
    />
  </div>
</template>

<script setup>
import HostCreateDialog from '@/components/HostCreateDialog.vue'
import { useHostManager } from '@/components/useHostManager.js'

const {
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
} = useHostManager()
</script>

<style scoped>
.host-manager {
  min-height: 100%;
  padding: 18px;
  background: #f5f7fb;
}

.card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e7edf6;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
}

.top-bar {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.top-bar h2 {
  margin: 0;
  color: #0f172a;
}

.top-bar p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}

.bar-actions {
  display: flex;
  gap: 8px;
}

.summary-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.stat {
  padding: 14px;
}

.stat p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.stat strong {
  display: block;
  margin-top: 8px;
  font-size: 24px;
  color: #0f172a;
}

.stat.online strong {
  color: #047857;
}

.stat.offline strong {
  color: #b91c1c;
}

.stat.warning strong {
  color: #b45309;
}

.filter-bar {
  margin-top: 12px;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 120px 120px 72px;
  gap: 8px;
}

.filter-bar input,
.filter-bar select {
  height: 34px;
  border: 1px solid #d6deea;
  border-radius: 6px;
  padding: 0 10px;
  box-sizing: border-box;
}

.host-table-wrap {
  margin-top: 12px;
  padding: 8px 12px;
}

.host-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.host-table th,
.host-table td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef2f8;
  color: #334155;
}

.host-table th {
  color: #64748b;
  font-weight: 600;
}

.host-name-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.host-name-cell small {
  color: #94a3b8;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eaf2ff;
  color: #1d4ed8;
}

.status {
  display: inline-block;
  border-radius: 999px;
  padding: 2px 9px;
  color: #fff;
  font-size: 12px;
}

.status.online {
  background: #10b981;
}

.status.offline {
  background: #94a3b8;
}

.metric.good {
  color: #16a34a;
}

.metric.warn {
  color: #d97706;
}

.metric.danger {
  color: #dc2626;
  font-weight: 600;
}

.table-actions {
  display: flex;
  gap: 6px;
}

.btn {
  height: 32px;
  border: 1px solid #d3dbea;
  background: #fff;
  color: #334155;
  border-radius: 6px;
  padding: 0 10px;
  cursor: pointer;
}

.btn.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.btn.mini {
  height: 26px;
  font-size: 12px;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.empty {
  text-align: center;
  color: #94a3b8;
  padding: 18px 0;
}

@media (max-width: 1150px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-bar {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-grid,
  .filter-bar {
    grid-template-columns: 1fr;
  }

  .host-table-wrap {
    overflow-x: auto;
  }

  .host-table {
    min-width: 980px;
  }
}
</style>
