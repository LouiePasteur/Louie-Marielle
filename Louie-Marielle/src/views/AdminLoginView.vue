<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createAndStoreToken, validateCredentials } from '@/utils/adminAuth'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const validationError = ref('')

function clearValidationError() {
  validationError.value = ''
}

watch([username, password], clearValidationError)

function onSubmit() {
  if (!validateCredentials(username.value.trim(), password.value)) {
    validationError.value = 'Invalid username or password.'
    return
  }

  createAndStoreToken(username.value.trim())
  router.push('/dashboard')
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <main class="admin-login-page">
    <section class="admin-login-card">
      <h1>Admin Login</h1>
      <form @submit.prevent="onSubmit">
        <label for="admin-username">Username</label>
        <input id="admin-username" v-model="username" type="text" autocomplete="username" />

        <label for="admin-password">Password</label>
        <div class="password-field">
          <input
            id="admin-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="toggle-password-btn"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="togglePasswordVisibility"
          >
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.78 21.78 0 0 1 5.08-6.29" />
              <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.7 21.7 0 0 1-3.17 4.52" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>

        <p v-if="validationError" class="error-message">{{ validationError }}</p>

        <button type="submit">Login</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f5f7fb;
  padding: 24px;
}

.admin-login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

h1 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #172233;
}

form {
  display: grid;
  gap: 10px;
}

label {
  font-size: 14px;
  color: #334155;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 44px;
}

.error-message {
  margin: 0;
  color: #dc2626;
  font-size: 13px;
}

button {
  margin-top: 6px;
  border: 0;
  border-radius: 8px;
  padding: 11px 14px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}

.toggle-password-btn {
  margin-top: 0;
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  display: grid;
  place-items: center;
}

.toggle-password-btn:hover {
  background: #e2e8f0;
  color: #334155;
}

.toggle-password-btn svg {
  width: 18px;
  height: 18px;
}
</style>
