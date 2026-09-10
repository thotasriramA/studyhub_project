import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function ResetPassword() {
  const { uidb64, token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/password-reset-confirm/', {
        uidb64,
        token,
        password,
      })
      navigate('/login')
    } catch (err) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.password?.[0] ||
        'The reset link is invalid or has expired.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-insta-bg px-4">
      <div className="w-full max-w-sm rounded-lg border border-insta-border bg-white px-10 py-12">
        <h1 className="mb-3 text-center font-logo text-5xl text-gray-800">StudyHub</h1>
        <p className="mb-6 text-center text-xs text-gray-500">Create a new password for your account.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />

          {error && <p className="text-center text-xs text-insta-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded bg-insta-blue py-1.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Updating password...' : 'Reset Password'}
          </button>
        </form>
      </div>

      <div className="mt-4 w-full max-w-sm rounded-lg border border-insta-border bg-white py-4 text-center text-sm">
        <Link to="/login" className="font-semibold text-insta-blue">
          Back to Log In
        </Link>
      </div>
    </div>
  )
}