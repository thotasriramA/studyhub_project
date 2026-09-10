import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { id } = useParams()
  const { user: currentUser, setUser } = useAuth()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [favSubject, setFavSubject] = useState('')

  const [picFile, setPicFile] = useState(null)
  const [picPreview, setPicPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  const isOwnProfile = currentUser && Number(id) === currentUser.id

  useEffect(() => {
    const endpoint = isOwnProfile ? '/auth/me/' : `/auth/users/${id}/`
    api.get(endpoint).then((res) => {
      setProfile(res.data)
      setBio(res.data.bio || '')
      setFavSubject(res.data.favorite_subject || '')
      setPicPreview(res.data.profile_pic || null)
    })
  }, [id, isOwnProfile])

  useEffect(() => {
    setPostsLoading(true)
    api
      .get(`/posts/user/${id}/`)
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setPostsLoading(false))
  }, [id])

  const handlePicChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPicFile(file)
    setPicPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('bio', bio)
      formData.append('favorite_subject', favSubject)
      if (picFile) {
        formData.append('profile_pic', picFile)
      }

      // IMPORTANT: do NOT set Content-Type manually here.
      // The browser needs to add its own multipart boundary,
      // and PATCH (not PUT) so we don't need to resend every field.
      const { data } = await api.patch('/auth/me/', formData)

      setProfile(data)
      setUser(data)
      setPicFile(null)
      setPicPreview(data.profile_pic || null)
      setEditing(false)
    } catch (err) {
      console.error('Failed to save profile', err.response?.data || err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setBio(profile.bio || '')
    setFavSubject(profile.favorite_subject || '')
    setPicFile(null)
    setPicPreview(profile.profile_pic || null)
    setEditing(false)
  }

  if (!profile) return <p className="mt-10 text-center text-sm text-insta-gray">Loading...</p>

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10">
      {/* Header */}
      <div className="flex flex-col items-center rounded-lg border border-insta-border bg-white p-6 text-center">
        <div className="relative mb-2 h-24 w-24 overflow-hidden rounded-full bg-gray-200">
          {picPreview ? (
            <img src={picPreview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-600">
              {profile.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {editing ? (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mb-3 text-xs font-semibold text-insta-blue hover:underline"
            >
              📷 Change profile photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePicChange}
              className="hidden"
            />
          </>
        ) : (
          <div className="mb-3" />
        )}

        <h1 className="text-lg font-semibold text-gray-900">{profile.username}</h1>
        <p className="text-sm text-gray-500">{profile.education_level}</p>

        {/* Post / stats row, Instagram-style */}
        <div className="mt-3 flex gap-6 text-sm text-gray-700">
          <div>
            <span className="font-semibold">{posts.length}</span> posts
          </div>
        </div>

        {editing ? (
          <div className="mt-4 flex w-full flex-col gap-2 text-left">
            <label className="text-xs font-semibold text-gray-500">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none"
            />
            <label className="text-xs font-semibold text-gray-500">Favorite subject</label>
            <input
              value={favSubject}
              onChange={(e) => setFavSubject(e.target.value)}
              className="rounded border border-insta-border bg-gray-50 px-3 py-2 text-sm outline-none"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded bg-insta-blue py-1.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 rounded border border-insta-border py-1.5 text-sm font-semibold text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm text-gray-700">{profile.bio || 'No bio yet.'}</p>
            {profile.favorite_subject && (
              <p className="mt-1 text-xs text-gray-400">
                📚 Favorite subject: {profile.favorite_subject}
              </p>
            )}
            {isOwnProfile && (
              <button
                onClick={() => setEditing(true)}
                className="mt-4 rounded border border-insta-border px-4 py-1.5 text-sm font-semibold text-gray-800"
              >
                Edit Profile
              </button>
            )}
          </>
        )}
      </div>

      {/* Posts grid */}
      <div className="mt-6 border-t border-insta-border pt-4">
        {postsLoading ? (
          <p className="text-center text-sm text-insta-gray">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-sm text-insta-gray">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <a
                key={post.id}
                href={`/posts/${post.id}`}
                className="group relative aspect-square overflow-hidden bg-gray-100"
              >
                <img
                  src={post.image}
                  alt={post.caption || ''}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 hidden items-center justify-center gap-4 bg-black/40 text-sm font-semibold text-white group-hover:flex">
                  <span>❤️ {post.like_count ?? 0}</span>
                  <span>💬 {post.comment_count ?? 0}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}