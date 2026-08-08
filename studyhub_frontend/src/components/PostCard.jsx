import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const TYPE_LABELS = {
  note: 'Study Note',
  doubt: 'Doubt',
  resource: 'Resource',
}

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.is_liked)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [bookmarked, setBookmarked] = useState(post.is_bookmarked)
  const [pop, setPop] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(post.comments || [])
  const [commentText, setCommentText] = useState('')

  const toggleLike = async () => {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
    setPop(true)
    setTimeout(() => setPop(false), 250)
    try {
      await api.post(`/posts/${post.id}/like/`)
    } catch {
      // revert on failure
      setLiked((prev) => !prev)
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1))
    }
  }

  const toggleBookmark = async () => {
    setBookmarked((prev) => !prev)
    try {
      await api.post(`/posts/${post.id}/bookmark/`)
    } catch {
      setBookmarked((prev) => !prev)
    }
  }

  const loadComments = async () => {
    setShowComments((prev) => !prev)
    if (!showComments) {
      const { data } = await api.get(`/posts/${post.id}/comments/`)
      setComments(data)
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    const { data } = await api.post(`/posts/${post.id}/comments/`, { text: commentText })
    setComments((prev) => [...prev, data])
    setCommentText('')
  }

  return (
    <article className="mb-6 w-full max-w-[470px] rounded-lg border border-insta-border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
            {post.author_profile_pic ? (
              <img src={post.author_profile_pic} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-600">
                {post.author_username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{post.author_username}</span>
            <span className="text-gray-400"> · </span>
            <Link to={`/community/${post.community}`} className="text-insta-blue">
              {post.community_name}
            </Link>
          </div>
        </div>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
          {TYPE_LABELS[post.post_type] || post.post_type}
        </span>
      </div>

      {/* Image (if any) */}
      {post.image && (
        <div className="w-full bg-black">
          <img src={post.image} alt={post.title} className="max-h-[500px] w-full object-cover" />
        </div>
      )}

      {/* Body */}
      <div className="px-4 pt-3">
        <h3 className="font-semibold text-gray-900">{post.title}</h3>
        <p className="mt-1 whitespace-pre-line text-sm text-gray-700">{post.content}</p>
        {post.attachment && (
          <a
            href={post.attachment}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-medium text-insta-blue"
          >
            📎 View attachment
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className={pop ? 'like-pop' : ''}>
            <Heart
              size={24}
              className={liked ? 'fill-insta-red text-insta-red' : 'text-gray-800'}
            />
          </button>
          <button onClick={loadComments}>
            <MessageCircle size={24} className="text-gray-800" />
          </button>
          <button>
            <Send size={22} className="text-gray-800" />
          </button>
        </div>
        <button onClick={toggleBookmark}>
          <Bookmark
            size={22}
            className={bookmarked ? 'fill-gray-900 text-gray-900' : 'text-gray-800'}
          />
        </button>
      </div>

      {/* Like count & comment count */}
      <div className="px-4 pt-2 text-sm font-semibold text-gray-900">
        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
      </div>
      {!showComments && comments.length > 0 && (
        <button
          onClick={loadComments}
          className="px-4 pt-1 text-sm text-insta-gray hover:underline"
        >
          View all {post.comment_count} comments
        </button>
      )}

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-insta-border px-4 py-2">
          {comments.map((c) => (
            <div key={c.id} className="py-1 text-sm">
              <span className="font-semibold text-gray-900">{c.author_username}</span>{' '}
              <span className="text-gray-700">{c.text}</span>
            </div>
          ))}
          <form onSubmit={submitComment} className="mt-2 flex items-center gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border-none text-sm outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="text-sm font-semibold text-insta-blue disabled:text-blue-200"
            >
              Post
            </button>
          </form>
        </div>
      )}

      <div className="px-4 pb-3 pt-1 text-[11px] uppercase text-gray-400">
        {new Date(post.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </div>
    </article>
  )
}
