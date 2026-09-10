import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../api/axios'
import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchPosts = async (query = '') => {
    setLoading(true)
    const { data } = await api.get('/posts/', { params: query ? { search: query } : {} })
    setPosts(data)
    setLoading(false)
  }
  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPosts(search)
  }

  return (
    <div className="flex flex-col items-center px-4 pb-10">
      <form onSubmit={handleSearch} className="my-4 flex w-full max-w-[470px] items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-insta-border bg-gray-50 px-3 py-1.5">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, doubts, subjects..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </form>

      {loading && <p className="text-sm text-insta-gray">Loading feed...</p>}

      {!loading && posts.length === 0 && (
        <p className="mt-10 text-sm text-insta-gray">
          No posts yet. Join a community and be the first to post!
        </p>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
