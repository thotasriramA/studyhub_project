import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    education_level: 'college',
    favorite_subject: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      const firstError = data && Object.values(data)[0]
      setError(Array.isArray(firstError) ? firstError[0] : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-insta-bg px-4 py-10">
      <div className="w-full max-w-sm rounded-lg border border-insta-border bg-white px-10 py-10">
        <h1 className="mb-1 text-center font-logo text-5xl text-gray-800">StudyHub</h1>
        <p className="mb-6 text-center text-sm font-medium text-gray-500">
          Sign up to share notes & doubts with students
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={update('username')}
            required
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={update('email')}
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={update('password')}
            required
            minLength={6}
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
          <select
            value={form.education_level}
            onChange={update('education_level')}
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400"
          >
            <option value="school">School</option>
            <option value="college">College</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Favorite subject (e.g. Python)"
            value={form.favorite_subject}
            onChange={update('favorite_subject')}
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />

          {error && <p className="text-center text-xs text-insta-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded bg-insta-blue py-1.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>

      <div className="mt-4 w-full max-w-sm rounded-lg border border-insta-border bg-white py-4 text-center text-sm">
        Have an account?{' '}
        <Link to="/login" className="font-semibold text-insta-blue">
          Log in
        </Link>
      </div>
    </div>
  )
}
