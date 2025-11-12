import { useEffect, useMemo, useState } from 'react'
import SearchBar from './components/SearchBar'
import ResultsGrid from './components/ResultsGrid'

function App() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [userId, setUserId] = useState('guest')
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Load favorites for demo user
    if (!userId) return
    fetch(`${baseUrl}/favorites?user_id=${userId}`).then(r => r.json()).then(setFavorites).catch(() => {})
  }, [userId, baseUrl])

  const onSearch = async (q) => {
    setQuery(q)
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/search?query=${encodeURIComponent(q)}&limit=6`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const saveFavorite = async (item) => {
    try {
      const res = await fetch(`${baseUrl}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          sku: item.sku,
          title: item.title,
          image_url: item.image_url,
          url: item.url,
          merchant: item.merchant,
          price: item.price,
          currency: item.currency || 'INR',
        })
      })
      const out = await res.json()
      if (out.ok) {
        const updated = await fetch(`${baseUrl}/favorites?user_id=${userId}`).then(r => r.json())
        setFavorites(updated)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const removeFavorite = async (id) => {
    try {
      await fetch(`${baseUrl}/favorites/${id}`, { method: 'DELETE' })
      const updated = await fetch(`${baseUrl}/favorites?user_id=${userId}`).then(r => r.json())
      setFavorites(updated)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50">
      <header className="sticky top-0 bg-white/70 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">DealWiseDe</h1>
          </div>
          <div className="text-sm text-gray-500">Backend: {baseUrl}</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Price Comparison</h2>
          <SearchBar onSearch={onSearch} />
          {loading ? (
            <div className="text-center text-gray-500 mt-6">Searching...</div>
          ) : (
            <ResultsGrid results={results} onSave={saveFavorite} />
          )}
        </div>

        <section className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Saved Favorites</h3>
          {favorites.length === 0 ? (
            <div className="text-gray-500">You haven't saved any items yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map(f => (
                <div key={f._id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex gap-3">
                    {f.image_url ? (
                      <img src={f.image_url} alt={f.title} className="w-24 h-24 object-cover rounded" />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400">No image</div>
                    )}
                    <div className="flex-1">
                      <p className="text-xs uppercase text-blue-600 font-semibold">{f.merchant}</p>
                      <h4 className="font-medium text-gray-800 line-clamp-2">{f.title}</h4>
                      <p className="text-sm font-semibold mt-1">₹ {Number(f.price).toLocaleString('en-IN')}</p>
                      <div className="flex gap-2 mt-2">
                        {f.url && (
                          <a href={f.url} target="_blank" rel="noreferrer" className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">View</a>
                        )}
                        <button onClick={() => removeFavorite(f._id)} className="text-xs px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white">Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">© {new Date().getFullYear()} DealWiseDe</footer>
    </div>
  )
}

export default App
