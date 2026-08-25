import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserSkills, setUserSkills } from '../services/userProfile'

// Splits a comma-separated string into a clean array, e.g. "Python, React, "
// becomes ["Python", "React"] — trims whitespace and drops empty entries.
const parseSkills = (text) => text.split(',').map(s => s.trim()).filter(Boolean)

const AIMatchModal = ({ isOpen, onClose, application }) => {
  const { user } = useAuth()
  const [skillsInput, setSkillsInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  // Pre-fill with the user's previously saved skills, if any, each time the modal opens.
  useEffect(() => {
    if (!isOpen || !user?.uid) return
    setResult(null)
    setError(null)
    getUserSkills(user.uid).then((saved) => {
      setSkillsInput(saved.join(', '))
    })
  }, [isOpen, user?.uid])

  if (!isOpen) return null

  const requiredSkills = parseSkills(application?.requiredSkills || "")
  const hasRequirements = requiredSkills.length > 0

  const handleAnalyze = async () => {
    const studentSkills = parseSkills(skillsInput)
    if (studentSkills.length === 0) {
      setError("Enter at least one skill first.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      // Save skills for next time — best-effort, shouldn't block the analysis if it fails.
      setUserSkills(user.uid, studentSkills).catch(() => {})

      const res = await fetch('/api/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: application.role,
          requiredSkills,
          studentSkills,
        }),
      })
      if (!res.ok) throw new Error('AI match request failed')
      const data = await res.json()
      setResult(data)
    } catch {
      setError("AI match is temporarily unavailable. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (score) => {
    if (score >= 70) return "text-green-500"
    if (score >= 40) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center z-50 px-4' onClick={onClose}>
      <div className='bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-[500px] max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100 p-6 rounded-2xl shadow-xl' onClick={(e) => e.stopPropagation()}>

        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-xl font-bold bg-gradient-to-r from-cyan-500 to-violet-600 bg-clip-text text-transparent'>AI Internship Match</h2>
          <button className='text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-xl transition-colors' onClick={onClose}>✕</button>
        </div>

        <p className='text-sm text-slate-500 dark:text-slate-400 mb-4'>{application?.company} — {application?.role}</p>

        {!hasRequirements ? (
          <p className='text-sm text-slate-600 dark:text-slate-300'>
            This application doesn't have any Required Skills listed yet. Add them by editing the application, then try AI Match again.
          </p>
        ) : (
          <>
            <label className='block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1'>Your skills (comma-separated)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className='w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 rounded-lg p-2 outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition mb-3'
              placeholder="e.g. Python, React, SQL, Firebase, Git"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className='w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 disabled:opacity-60 text-white py-2.5 rounded-lg font-medium shadow-md transition'
            >
              {loading ? "Analyzing..." : "Analyze Match"}
            </button>

            {error && (
              <p className='text-sm text-red-500 dark:text-red-400 mt-3'>{error}</p>
            )}

            {result && (
              <div className='mt-5 pt-4 border-t border-slate-200 dark:border-slate-700/40'>
                <div className='text-center mb-4'>
                  <p className={`text-4xl font-bold ${scoreColor(result.matchScore)}`}>{result.matchScore}%</p>
                  <p className='text-sm font-semibold text-slate-500 dark:text-slate-400'>{result.recommendation}</p>
                </div>

                {result.matchingSkills?.length > 0 && (
                  <div className='mb-3'>
                    <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1'>Matching skills</p>
                    <div className='flex flex-wrap gap-1.5'>
                      {result.matchingSkills.map((s) => (
                        <span key={s} className='text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-2.5 py-1'>✓ {s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {result.skillGaps?.length > 0 && (
                  <div className='mb-3'>
                    <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1'>Skill gaps</p>
                    <div className='flex flex-wrap gap-1.5'>
                      {result.skillGaps.map((s) => (
                        <span key={s} className='text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 px-2.5 py-1'>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className='mb-3'>
                  <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1'>AI Insight</p>
                  <p className='text-sm text-slate-700 dark:text-slate-300'>{result.reason}</p>
                </div>

                {result.improvementSuggestions?.length > 0 && (
                  <div>
                    <p className='text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1'>Improve your chances</p>
                    <ul className='text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside space-y-0.5'>
                      {result.improvementSuggestions.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AIMatchModal
