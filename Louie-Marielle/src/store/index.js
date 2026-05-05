import { createStore } from 'vuex'

const INVITES_URL =
  'https://weddinginvitation-2b6df-default-rtdb.asia-southeast1.firebasedatabase.app/invites.json'
const EMAIL_VALIDATION_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function fetchNextInviteId() {
  const res = await fetch(INVITES_URL)
  if (!res.ok) {
    throw new Error('Could not load existing invites.')
  }
  const data = await res.json()
  if (data == null || typeof data !== 'object') {
    return 1
  }
  let max = 0
  for (const entry of Object.values(data)) {
    if (!entry || typeof entry !== 'object') continue
    const raw = entry.id
    const n = typeof raw === 'number' ? raw : Number(raw)
    if (Number.isFinite(n) && n > max) {
      max = n
    }
  }
  return max + 1
}

export default createStore({
  state: () => ({
    rsvpSubmitting: false,
    rsvpError: null,
  }),
  mutations: {
    setRsvpSubmitting(state, value) {
      state.rsvpSubmitting = value
    },
    setRsvpError(state, message) {
      state.rsvpError = message
    },
  },
  actions: {
    async submitRsvp({ commit }, { fullName, email, attendance, message }) {
      commit('setRsvpError', null)
      const sanitizedFullName = (fullName ?? '').trim()
      const sanitizedEmail = (email ?? '').trim()
      const sanitizedAttendance = (attendance ?? '').trim()
      if (!sanitizedFullName || !sanitizedEmail || !sanitizedAttendance) {
        const validationMessage = 'Full name, email, and attendance are required.'
        commit('setRsvpError', validationMessage)
        throw new Error(validationMessage)
      }
      if (!EMAIL_VALIDATION_PATTERN.test(sanitizedEmail)) {
        const validationMessage = 'Please enter a valid email address.'
        commit('setRsvpError', validationMessage)
        throw new Error(validationMessage)
      }

      commit('setRsvpSubmitting', true)
      try {
        const id = await fetchNextInviteId()
        const rsvpValue = sanitizedAttendance === 'yes' ? 'accept' : 'reject'
        const payload = {
          id,
          full_name: sanitizedFullName,
          email_address: sanitizedEmail,
          rsvp: rsvpValue,
          dietary_note: (message ?? '').trim(),
        }
        const res = await fetch(INVITES_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `RSVP request failed (${res.status})`)
        }
        return res.json()
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Could not send RSVP.'
        commit('setRsvpError', msg)
        throw err
      } finally {
        commit('setRsvpSubmitting', false)
      }
    },
  },
})
