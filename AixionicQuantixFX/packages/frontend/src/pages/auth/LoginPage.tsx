import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { apiClient } from '../services/api'
import { useAuthStore } from '../store/auth.store'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  totp: z.string().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const mutation = useMutation({
    mutationFn: (data: LoginForm) => apiClient.post('/auth/login', data),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data
      login(user, accessToken, refreshToken)
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Login to QuantixFX</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 w-full rounded-md border p-2"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 w-full rounded-md border p-2"
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">2FA Code (optional)</label>
            <input
              {...register('totp')}
              type="text"
              className="mt-1 w-full rounded-md border p-2"
              placeholder="123456"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </p>

        <p className="mt-2 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  )
}