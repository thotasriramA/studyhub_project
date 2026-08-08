import { Plus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function Communities() {
  const [communities, setCommunities] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCommunities = async () => {
    const { data } = await api.get('/communities/')
    setCommunities(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCommunities()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await api.post('/communities/', { name, description })
    setName('')
    setDescription('')
    setShowForm(false)
    fetchCommunities()
  }

  const toggleJoin = async (community) => {
    const action = community.is_member ? 'leave' : 'join'
    await api.post(`/communities/${community.slug}/${action}/`)
    fetchCommunities()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Study Communities</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-1 rounded bg-insta-blue px-3 py-1.5 text-sm font-semibold text-white"
        >
          <Plus size={16} /> New
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 flex flex-col gap-2 rounded-lg border border-insta-border bg-white p-4"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Community name (e.g. Python Learners)"
            required
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this community about?"
            rows={2}
            className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="self-start rounded bg-insta-blue px-4 py-1.5 text-sm font-semibold text-white"
          >
            Create Community
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-insta-gray">Loading communities...</p>}

      <div className="flex flex-col gap-3">
        {communities.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-insta-border bg-white p-4"
          >
            <div>
              <Link to={`/community/${c.slug}`} className="font-semibold text-gray-900 hover:underline">
                {c.name}
              </Link>
              <p className="text-sm text-gray-500">{c.description}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                <Users size={12} /> {c.member_count} members
              </p>
            </div>
            <button
              onClick={() => toggleJoin(c)}
              className={`rounded px-4 py-1.5 text-sm font-semibold ${c.is_member
                  ? 'border border-insta-border text-gray-800'
                  : 'bg-insta-blue text-white'
                }`}
            >
              {c.is_member ? 'Joined' : 'Join'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
