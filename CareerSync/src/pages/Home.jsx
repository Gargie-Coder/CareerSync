import React from 'react'
import features from '../constants/features'
import {Link} from 'react-router-dom'

export const Home = () => {
  return (
    <>
    <section className="mb-20"><div className='flex flex-col  gap-4 w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-10' >
        <div>
          <p className='text-4xl font-bold text-slate-900 dark:text-white m-4'>Welcome to CareerSync</p>
          <p className='text-gray-600 dark:text-gray-300 bg-gradient-to-r from-cyan-600 via-sky-600 to-violet-600 dark:from-cyan-400 dark:via-sky-400 dark:to-violet-500 bg-clip-text text-transparent border-2 border-slate-200 dark:border-white/20 rounded-3xl backdrop-brightness-150 m-4 p-2 text-3xl w-fit'>Track Less. Land More.</p>
        </div>
        <div className='flex flex-col gap-2 text-slate-900 dark:text-white m-4 text-4xl sm:text-6xl md:text-8xl lg:text-8xl'>
        <h1 className='font-extrabold tracking-tight '>Your Job Search,</h1>
        <h1 className='font-extrabold tracking-tight '>finally <span className='bg-gradient-to-r from-cyan-600 via-sky-600 to-violet-600 dark:from-cyan-400 dark:via-sky-400 dark:to-violet-500 bg-clip-text text-transparent mb-4'>Organized.</span></h1>
        <p className='text-2xl text-slate-600 dark:text-gray-300 p-2 m-4 gap-4 leading-loose'>
          CareerSync is a calm, focused tracker for every application you send. No spreadsheets, no noise — just the clarity you need to land your next role.
        </p>
        </div>
        <div className='inline-flex gap-4 m-4'>
       <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-white/20 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/80 text-base font-medium mb-8 font-mono">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
  Free · No Distractions · Works instantly
</div> 
        </div>
      </div>
    </section>
    <section className="w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-10 mb-20">
  <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">How it works</h2>
  <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
    {[
      { step: "01", title: "Create your account", desc: "Sign up in seconds, no setup required." },
      { step: "02", title: "Track applications", desc: "Log every company, role, and status as you apply." },
      { step: "03", title: "Stay on top of it", desc: "Search, filter, and see your pipeline at a glance." },
    ].map((item) => (
      <div key={item.step} className="flex-1 text-center">
        <div className="text-4xl font-bold text-sky-500 dark:text-sky-400 mb-2">{item.step}</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
        <p className="text-slate-600 dark:text-gray-400 text-base">{item.desc}</p>
      </div>
    ))}
  </div>
</section>
    <section className="flex flex-wrap justify-center gap-4 mb-20 w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-10 text-2xl">
      {features.map((feature, index) => (
        <div key={feature.title} className="bg-slate-50 dark:bg-white/10 text-slate-800 dark:text-slate-200 w-72 border border-slate-200 dark:border-white/20 rounded-lg p-4 transition-colors hover:border-sky-400 dark:hover:border-sky-500">
        {/*title is used as a key because even if the items are rearranged, the title will remain the same and can be used to identify the item uniquelywhile if we use index as a key, it will change if the items are rearranged and can cause issues with rendering and performance. */}
          <span className="font-bold block text-slate-900 dark:text-white">{feature.title}</span>
          <p>{feature.description}</p>
        </div>
      ))}
      
    </section>
    <section className="w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-10 mb-20 text-center">
  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Ready to get organized?</h2>
  <p className="text-slate-600 dark:text-gray-400 mb-6">Start tracking your job search today — it's free.</p>
  <Link to="/signup" className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-full hover:bg-blue-500 transition">
    Create your account
  </Link>
</section>
    </>
  )
}