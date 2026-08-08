import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { id } = useParams()
  const { user: currentUser, setUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [favSubject, setFavSubject] = useState('')

  const isOwnProfile = currentUser && Number(id) === currentUser.id

  useEffect(() => {
    const endpoint = isOwnProfile ? '/auth/me/' : `/auth/users/${id}/`
    api.get(endpoint).then((res) => {
      setProfile(res.data)
      setBio(res.data.bio || '')
      setFavSubject(res.data.favorite_subject || '')
    })
  }, [id, isOwnProfile])

  const handleSave = async () => {
    const { data } = await api.put('/auth/me/', {
      ...profile,
      bio,
      favorite_subject: favSubject,
    })
    setProfile(data)
    setUser(data)
    setEditing(false)
  }

  if (!profile) return <p className="mt-10 text-center text-sm text-insta-gray">Loading...</p>

  return (
    <div className="mx-auto max-w-md px-4 pb-10">
      <div className="flex flex-col items-center rounded-lg border border-insta-border bg-white p-6 text-center">
        <div className="mb-3 h-20 w-20 overflow-hidden rounded-full bg-gray-200">
          {profile.profile_pic ? (
            <img src={profile.profile_pic} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-600">
              {profile.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{profile.username}</h1>
        <p className="text-sm text-gray-500">{profile.education_level}</p>

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
            <button
              onClick={handleSave}
              className="mt-2 rounded bg-insta-blue py-1.5 text-sm font-semibold text-white"
            >
              Save Changes
            </button>
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
    </div>
  )
}
