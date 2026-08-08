import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'

export default function CommunityPage() {
  const { slug } = useParams()
  const [community, setCommunity] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [communityRes, postsRes] = await Promise.all([
        api.get(`/communities/${slug}/`),
        api.get('/posts/', { params: { community: slug } }),
      ])
      setCommunity(communityRes.data)
      setPosts(postsRes.data)
      setLoading(false)
    }
    load()
  }, [slug])

  const toggleJoin = async () => {
    const action = community.is_member ? 'leave' : 'join'
    await api.post(`/communities/${slug}/${action}/`)
    setCommunity((prev) => ({
      ...prev,
      is_member: !prev.is_member,
      member_count: prev.is_member ? prev.member_count - 1 : prev.member_count + 1,
    }))
  }

  if (loading) return <p className="mt-10 text-center text-sm text-insta-gray">Loading...</p>

  return (
    <div className="flex flex-col items-center px-4 pb-10">
      <div className="mb-6 w-full max-w-[470px] rounded-lg border border-insta-border bg-white p-5 text-center">
        <h1 className="text-xl font-semibold text-gray-900">{community.name}</h1>
        <p className="mt-1 text-sm text-gray-500">{community.description}</p>
        <p className="mt-1 text-xs text-gray-400">{community.member_count} members</p>
        <button
          onClick={toggleJoin}
          className={`mt-3 rounded px-5 py-1.5 text-sm font-semibold ${
            community.is_member
              ? 'border border-insta-border text-gray-800'
              : 'bg-insta-blue text-white'
          }`}
        >
          {community.is_member ? 'Joined' : 'Join Community'}
        </button>
      </div>

      {posts.length === 0 && (
        <p className="text-sm text-insta-gray">No posts in this community yet.</p>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
