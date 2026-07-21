import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.accessToken
  if (user) {
    config.headers.Authorization = `Bearer ${user}`
  }
  return config
})

export const apiClient = {
  get: <T>(url: string) => api.get<T>(url),
  post: <T>(url: string, data?: unknown) => api.post<T>(url, data),
  put: <T>(url: string, data?: unknown) => api.put<T>(url, data),
  delete: <T>(url: string) => api.delete<T>(url),
}