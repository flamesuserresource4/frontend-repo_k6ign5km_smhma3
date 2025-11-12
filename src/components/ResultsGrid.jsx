export default function ResultsGrid({ results, onSave }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-500">No results yet. Try a search.</div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {results.map((r, idx) => (
        <div key={`${r.merchant}-${r.sku}-${idx}`} className="bg-white rounded-xl shadow p-4 border border-gray-100">
          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden mb-3">
            {r.image_url ? (
              <img src={r.image_url} alt={r.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-blue-600 font-semibold uppercase">{r.merchant}</p>
              <h3 className="font-medium text-gray-800 line-clamp-2">{r.title}</h3>
              <p className="text-lg font-bold mt-1">₹ {r.price?.toLocaleString?.('en-IN') || r.price}</p>
              {r.rating && (
                <p className="text-xs text-gray-500">Rating: {r.rating} ({r.total_reviews || 0})</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  View
                </a>
              )}
              <button
                onClick={() => onSave?.(r)}
                className="text-sm px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
