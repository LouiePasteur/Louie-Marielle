<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearAuthToken } from '@/utils/adminAuth'

const router = useRouter()
const invites = ref([])
const isLoading = ref(false)
const fetchError = ref('')

const INVITES_ENDPOINT =
  'https://weddinginvitation-2b6df-default-rtdb.asia-southeast1.firebasedatabase.app/invites.json'

const hasInvites = computed(() => invites.value.length > 0)

function readValue(entry, keys) {
  for (const key of keys) {
    if (entry?.[key] !== undefined && entry?.[key] !== null && `${entry[key]}`.trim() !== '') {
      return entry[key]
    }
  }
  return '-'
}

async function fetchInvites() {
  isLoading.value = true
  fetchError.value = ''

  try {
    const response = await fetch(INVITES_ENDPOINT, { method: 'GET' })
    if (!response.ok) {
      throw new Error('Failed to fetch invites.')
    }

    const data = await response.json()
    if (!data || typeof data !== 'object') {
      invites.value = []
      return
    }

    invites.value = Object.entries(data).map(([firebaseId, entry]) => ({
      rowKey: firebaseId,
      id: readValue(entry, ['id']),
      fullName: readValue(entry, ['full_name', 'fullName', 'fullname', 'name']),
      dietaryNote: readValue(entry, ['dietary_note', 'dietaryNote']),
      rsvp: readValue(entry, ['rsvp']),
    }))
  } catch (error) {
    invites.value = []
    fetchError.value =
      error instanceof Error ? error.message : 'Something went wrong while loading invites.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchInvites)

function logout() {
  clearAuthToken()
  router.push('/admin')
}
</script>

<template>
  <main class="dashboard-page">
    <section class="dashboard-card">
      <div class="header-row">
        <h1>Guest List Confirmation Table</h1>
        <button type="button" @click="logout">Logout</button>
      </div>

      <p v-if="isLoading" class="state-text">Loading invites...</p>
      <p v-else-if="fetchError" class="state-text error">{{ fetchError }}</p>
      <p v-else-if="!hasInvites" class="state-text">No invite records found.</p>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Dietary Note</th>
              <th>RSVP</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invite in invites" :key="invite.rowKey">
              <td>{{ invite.id }}</td>
              <td>{{ invite.fullName }}</td>
              <td>{{ invite.dietaryNote }}</td>
              <td>{{ invite.rsvp }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24px;
}

.dashboard-card {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

h1 {
  margin: 0;
  color: #0f172a;
}

.subtext {
  margin: 8px 0 16px;
  color: #334155;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 10px 14px;
  background: #0f172a;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

th {
  color: #0f172a;
  background: #f8fafc;
}

.state-text {
  margin: 8px 0 0;
  color: #475569;
}

.state-text.error {
  color: #dc2626;
}
</style>
