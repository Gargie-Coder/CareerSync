// src/App.jsx
import { statusLabels } from './constants/status'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-bold text-center pt-20">
        Job Tracker 🚀
      </h1>

      <div className="flex gap-2 justify-center mt-6">
        {statusLabels.map((status) => (
          // key is REQUIRED when rendering lists — React uses it to track items
          <span
            key={status}
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full border border-blue-800"
          >
            {status}
          </span>
        ))}
      </div>
    </div>
  )
}

export default App