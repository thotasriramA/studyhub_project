import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/password-reset/', { email })
      setMessage(res.data.detail)
    } catch (err) {
      setError(err.response?.data?.email?.[0] || 'Unable to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-insta-bg px-4">
      <div className="w-full max-w-sm rounded-lg border border-insta-border bg-white px-10 py-12">
        <h1 className="mb-3 text-center font-logo text-5xl text-gray-800">StudyHub</h1>
        <p className="mb-6 text-center text-xs text-gray-500">
          Enter your registered email address and we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />

          {message && <p className="text-center text-xs text-green-600">{message}</p>}
          {error && <p className="text-center text-xs text-insta-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded bg-insta-blue py-1.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>
      </div>

      <div className="mt-4 w-full max-w-sm rounded-lg border border-insta-border bg-white py-4 text-center text-sm">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-insta-blue">
          Log In
        </Link>
      </div>
    </div>
  )
}