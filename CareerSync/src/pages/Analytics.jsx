import React from 'react'
import { useApplications } from '../context/ApplicationContext'
import { STATUS_LABELS } from '../constants/status'
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
   
   <h1>
    Analytics
   </h1>
   
   <div className="mx-auto mt-8 p-4 bg-slate-700/10 rounded-lg shadow-md">
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
    <div className="flex justify-around mt-8 bg-slate-700/10 rounded-2xl h-60 p-4">
     <CircularProgress percentage={offerpercentage} color="#22c55e" label="Offer rate" />
<CircularProgress percentage={interviewpercentage} color="#3b82f6" label="Interview pipeline" />
    </div>
   
   </>
  )
}

export default Analytics