import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-insta-bg px-4">
      <div className="w-full max-w-sm rounded-lg border border-insta-border bg-white px-10 py-12">
        <h1 className="mb-8 text-center font-logo text-5xl text-gray-800">StudyHub</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />

          {error && <p className="text-center text-xs text-insta-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded bg-insta-blue py-1.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>

      <div className="mt-4 w-full max-w-sm rounded-lg border border-insta-border bg-white py-4 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-insta-blue">
          Sign up
        </Link>
      </div>
    </div>
  )
}
