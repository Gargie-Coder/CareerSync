import React from 'react'
import { useApplications } from '../context/ApplicationContext'
import { STATUS_LABELS,STATUS_COLORS } from '../constants/status'
const Analytics = () => {
  const { applications } = useApplications();
  const total = applications.length;
  const COLORS = ['#3b82f6', '#eab308', '#f97316', '#ef4444', '#22c55e', '#a855f7']
 
  const chartData = STATUS_LABELS.map((statuses) => {
    const count = applications.filter((app) =>
      statuses === app.status
    ).length;
    //this will return the small array after filter and using its length property we will extract the matching applications count for each status and return an array of objects with status and count properties.
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return { status: statuses, count: count, percentage: percentage };  
  });
  const offerData = chartData.find((entry) => entry.status === "Offer")
  const offerpercentage = offerData ? offerData.percentage : 0;
const interviewCount = applications.filter((app) => 
  app.status === "HR Interview" || app.status === "Technical Interview"
).length
const interviewpercentage = total > 0 ? (interviewCount / total) * 100 : 0
 
   const recent_applications=[...applications].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3)
   //[...applications] creates a brand new array with the same items, and .sort() then mutates that copy, leaving the original applications array (and Dashboard's usage of it) untouched.

 const CircularProgress = ({ percentage, color, label }) => {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference - (percentage / 100) * circumference

   

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="text-2xl font-bold text-white -mt-20">{Math.round(percentage)}%</div>
      <div className="text-gray-400 mt-16">{label}</div>
    </div>
  )
}
  
  return (
   <>
   <div className="max-w-6xl mx-auto px-6">
    <h1 className="text-3xl font-semibold text-amber-100 mb-6">Analytics</h1>
   <div className="flex flex-col lg:flex-row gap-6">
     
   <div className="flex-1 mt-8 p-4 bg-slate-700/10 rounded-lg shadow-md">
       {chartData.map((entry, index) => (
      <div key={entry.status} className="mb-4">
        <div className="flex justify-between mb-1">
          <span>{entry.status}</span>
          <span>{entry.count}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="h-2 rounded-full"
            style={{ width: `${entry.percentage}%`, backgroundColor: COLORS[index % COLORS.length] }}
          ></div>
        </div>
      </div>
     
    ))}
   </div>
    <div className="flex-1 flex justify-around items-center mt-8 bg-slate-700/10 rounded-2xl h-60 p-4">
     <CircularProgress percentage={offerpercentage} color="#22c55e" label="Offer rate" />
<CircularProgress percentage={interviewpercentage} color="#3b82f6" label="Interview pipeline" />
    </div>
    </div>
    </div>

    <div className="mt-8 p-4 bg-slate-700/10 rounded-lg shadow-md">
      <h2 className="text-xl text-amber-100 font-semibold mb-4">Recent Activity</h2>
      {recent_applications.map((activity) => (
  <div key={activity.id} className="flex justify-between items-center py-3 border-b border-slate-700 last:border-0">
    <div>
      <p className="text-white font-semibold">{activity.company}</p>
      <p className="text-gray-400 text-sm">{activity.role}</p>
    </div>
    <div className="text-right">
      <span className={`inline-block rounded-full text-xs px-3 py-1 ${STATUS_COLORS[activity.status]}`}>
        {activity.status}
      </span>
      <p className="text-gray-400 text-sm mt-1">{activity.date}</p>
    </div>
  </div>
))}

    </div>
   </>
  )
}

export default Analytics