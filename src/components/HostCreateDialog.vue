<template>
  <div v-if="visible" class="dialog-mask" @click.self="$emit('close')">
    <div class="dialog">
      <div class="dialog-head">
        <h3>新增主机</h3>
        <button class="btn mini" @click="$emit('close')">关闭</button>
      </div>

      <div class="dialog-form">
        <label>
          <span>主机名称</span>
          <input v-model.trim="form.name" type="text" placeholder="例如：prod-api-05" />
        </label>
        <label>
          <span>主机 IP</span>
          <input v-model.trim="form.ip" type="text" placeholder="例如：10.0.0.105" />
        </label>
        <label>
          <span>端口</span>
          <input v-model.number="form.port" type="number" min="1" max="65535" />
        </label>
        <label>
          <span>分组</span>
          <select v-model="form.group">
            <option value="生产">生产</option>
            <option value="预发">预发</option>
            <option value="测试">测试</option>
          </select>
        </label>
        <label>
          <span>系统</span>
          <input v-model.trim="form.os" type="text" placeholder="例如：Ubuntu 22.04" />
        </label>
        <label>
          <span>登录账号</span>
          <input v-model.trim="form.username" type="text" placeholder="例如：root" />
        </label>
        <label>
          <span>登录密码</span>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>
      </div>

      <p v-if="connectMessage" class="connect-message" :class="connectionOk ? 'ok' : 'err'">
        {{ connectMessage }}
      </p>

      <div class="dialog-actions">
        <button class="btn" :disabled="testingConnection || savingHost" @click="$emit('test')">
          {{ testingConnection ? '连接中...' : '测试连接' }}
        </button>
        <button class="btn primary" :disabled="savingHost" @click="$emit('save')">
          {{ savingHost ? '采集中...' : '保存主机' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    required: true
  },
  testingConnection: {
    type: Boolean,
    default: false
  },
  savingHost: {
    type: Boolean,
    default: false
  },
  connectionOk: {
    type: Boolean,
    default: false
  },
  connectMessage: {
    type: String,
    default: ''
  }
})

defineEmits(['close', 'test', 'save'])
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.36);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  width: min(680px, 94vw);
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e5ebf5;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.26);
  padding: 14px;
}

.dialog-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-head h3 {
  margin: 0;
  color: #0f172a;
}

.dialog-form {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.dialog-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialog-form span {
  color: #64748b;
  font-size: 12px;
}

.dialog-form input,
.dialog-form select {
  height: 34px;
  border: 1px solid #d6deea;
  border-radius: 6px;
  padding: 0 10px;
  box-sizing: border-box;
}

.dialog-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.connect-message {
  margin: 10px 0 0;
  font-size: 13px;
}

.connect-message.ok {
  color: #15803d;
}

.connect-message.err {
  color: #dc2626;
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

@media (max-width: 760px) {
  .dialog-form {
    grid-template-columns: 1fr;
  }
}
</style>
