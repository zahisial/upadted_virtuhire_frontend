const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers })

  if (res.status === 401) {
    // Try refresh token
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getToken()}`
      const retry = await fetch(`${API_URL}${endpoint}`, { ...options, headers })
      if (!retry.ok) {
        const err = await retry.json().catch(() => ({ detail: 'Request failed' }))
        throw err
      }
      return retry.status === 204 ? null : retry.json()
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    throw { detail: 'Session expired' }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw err
  }
  return res.status === 204 ? null : res.json()
}

async function tryRefreshToken(): Promise<boolean> {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) return false
  try {
    const res = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) return false
    const data = await res.json()
    localStorage.setItem('access_token', data.access)
    if (data.refresh) localStorage.setItem('refresh_token', data.refresh)
    return true
  } catch { return false }
}

// ─── Auth API ───
export const authAPI = {
  register: (data: any) => request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  login: (email: string, password: string) => request('/auth/login/', { method: 'POST', body: JSON.stringify({ email, password }) }),
  requestOTP: (email: string) => request('/auth/request-otp/', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOTP: (email: string, otp: string) => request('/auth/verify-otp/', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  me: () => request('/auth/me/'),
  updateProfile: (data: FormData) => request('/auth/profile/', { method: 'PATCH', body: data }),
  signContract: (signature: string) => request('/auth/sign-contract/', { method: 'POST', body: JSON.stringify({ signature }) }),
}

// ─── Candidates API ───
export const candidatesAPI = {
  browse: (params?: { category?: string; work_preference?: string; page?: number }) => {
    const q = new URLSearchParams()
    if (params?.category) q.set('category', params.category)
    if (params?.work_preference) q.set('work_preference', params.work_preference)
    if (params?.page) q.set('page', String(params.page))
    return request(`/candidates/browse/?${q.toString()}`)
  },
  detail: (id: number) => request(`/candidates/${id}/`),
  apply: (data: FormData) => request('/candidates/apply/', { method: 'POST', body: data }),
  myApplication: () => request('/candidates/my-application/'),
}

// ─── Hiring API ───
export const hiringAPI = {
  createRequest: (data: any) => request('/hiring/requests/', { method: 'POST', body: JSON.stringify(data) }),
  getRequests: () => request('/hiring/requests/'),
  shortlist: (hrId: number, candidateId: number) => request(`/hiring/requests/${hrId}/shortlist/`, { method: 'POST', body: JSON.stringify({ candidate: candidateId }) }),
  removeShortlist: (hrId: number, candidateId: number) => request(`/hiring/requests/${hrId}/shortlist/${candidateId}/`, { method: 'DELETE' }),
  requestInterview: (hrId: number, candidateId: number, notes?: string) => request(`/hiring/requests/${hrId}/interview/`, { method: 'POST', body: JSON.stringify({ candidate: candidateId, notes: notes || '' }) }),
  confirmHire: (hrId: number, candidateId: number) => request(`/hiring/requests/${hrId}/confirm/`, { method: 'POST', body: JSON.stringify({ candidate_id: candidateId }) }),
  getEmployees: () => request('/hiring/employees/'),
  replaceEmployee: (empId: number) => request(`/hiring/employees/${empId}/replace/`, { method: 'POST' }),
}

// ─── Billing API ───
export const billingAPI = {
  getInvoices: () => request('/billing/invoices/'),
  getPayments: () => request('/billing/payments/'),
  createPaymentIntent: (amount: number, type: string) => request('/billing/create-payment-intent/', { method: 'POST', body: JSON.stringify({ amount, payment_type: type }) }),
  saveCard: (paymentMethodId: string) => request('/billing/save-card/', { method: 'POST', body: JSON.stringify({ payment_method_id: paymentMethodId }) }),
}

// ─── Contracts API ───
export const contractsAPI = {
  list: () => request('/contracts/'),
  sign: (language: string, signature: string) => request('/contracts/sign/', { method: 'POST', body: JSON.stringify({ language, signature }) }),
  detail: (id: number) => request(`/contracts/${id}/`),
}

// ─── Support API ───
export const supportAPI = {
  getTickets: () => request('/support/tickets/'),
  createTicket: (data: any) => request('/support/tickets/', { method: 'POST', body: JSON.stringify(data) }),
  replyTicket: (id: number, message: string) => request(`/support/tickets/${id}/reply/`, { method: 'POST', body: JSON.stringify({ message }) }),
  resolveTicket: (id: number) => request(`/support/tickets/${id}/resolve/`, { method: 'POST' }),
}

// ─── Notifications API ───
export const notificationsAPI = {
  list: () => request('/notifications/'),
  markAllRead: () => request('/notifications/mark-all-read/', { method: 'POST' }),
  unreadCount: () => request('/notifications/unread-count/'),
  markRead: (id: number) => request(`/notifications/${id}/`, { method: 'PATCH', body: JSON.stringify({ read: true }) }),
}
