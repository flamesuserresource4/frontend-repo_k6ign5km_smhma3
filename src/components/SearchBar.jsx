import { useState } from 'react'

export default function SearchBar({ onSearch, initialQuery = '' }) {
  const [q, setQ] = useState(initialQuery)

  const submit = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    onSearch(q.trim())
  }

  return (
    <form onSubmit={submit} className="flex w-full gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search a product e.g., iPhone 15..."
        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur"
      />
      <button
        type="submit"
        className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
      >
        Search
      </button>
    </form>
  )
}
