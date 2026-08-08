import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function CreatePost() {
  const [communities, setCommunities] = useState([])
  const [form, setForm] = useState({
    title: '',
    content: '',
    community: '',
    post_type: 'note',
  })
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/communities/').then((res) => {
      setCommunities(res.data)
      if (res.data.length > 0) {
        setForm((prev) => ({ ...prev, community: res.data[0].id }))
      }
    })
  }, [])

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.community) {
      setError('Join a community first before posting.')
      return
    }
    setLoading(true)
    try {
      const payload = new FormData()
      payload.append('title', form.title)
      payload.append('content', form.content)
      payload.append('community', form.community)
      payload.append('post_type', form.post_type)
      if (imageFile) payload.append('image', imageFile)

      await api.post('/posts/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      navigate('/')
    } catch (err) {
      setError('Could not create post. Please check the fields.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-10">
      <h1 className="mb-4 text-xl font-semibold text-gray-900">Create a Post</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-lg border border-insta-border bg-white p-5"
      >
        <select
          value={form.community}
          onChange={update('community')}
          className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none"
        >
          <option value="">Select a community</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={form.post_type}
          onChange={update('post_type')}
          className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none"
        >
          <option value="note">Study Note</option>
          <option value="doubt">Doubt / Question</option>
          <option value="resource">Resource / Link</option>
        </select>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={update('title')}
          required
          className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none"
        />

        <textarea
          placeholder="Write your note, doubt, or share a resource..."
          value={form.content}
          onChange={update('content')}
          required
          rows={5}
          className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none"
        />

        <label className="text-sm text-gray-600">
          Attach an image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-1 block w-full text-sm"
          />
        </label>

        {error && <p className="text-xs text-insta-red">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded bg-insta-blue py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Posting...' : 'Share Post'}
        </button>
      </form>
    </div>
  )
}
