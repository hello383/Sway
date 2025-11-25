'use client'

import { useState, useEffect } from 'react'
import { Briefcase, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

interface Job {
  _id: string
  companyName: string
  title: string
  description: string
  location: string[]
  remoteType: string
  salaryRange?: string
  postedAt: string
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJobs(data.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-white/70 hover:text-white mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Remote Jobs</h1>
          <p className="text-white/70">
            Discover remote opportunities across Ireland
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-white/70">Loading jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="glass-dark rounded-3xl p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <h2 className="text-2xl font-bold mb-2">No jobs posted yet</h2>
            <p className="text-white/70">
              Check back soon for remote job opportunities!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="glass-dark rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                    <p className="text-lg text-purple-400 font-bold">
                      {job.companyName}
                    </p>
                  </div>
                </div>

                <p className="text-white/70 mb-4 line-clamp-3">{job.description}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <MapPin className="w-4 h-4" />
                    {job.location.join(', ')}
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Clock className="w-4 h-4" />
                    {job.remoteType}
                  </div>
                  {job.salaryRange && (
                    <div className="text-purple-400 font-bold">
                      {job.salaryRange}
                    </div>
                  )}
                </div>

                <div className="mt-4 text-xs text-white/50">
                  Posted {new Date(job.postedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

