export const STATUS_VALUES = [
  'Applied',
  'Phone Screen',
  'Interviewing',
  'Offer Received',
  'Rejected',
  'Withdrawn',
]

const BASE = 'https://vitkvegich.execute-api.us-east-1.amazonaws.com/prod'

export async function getJobs() {
  const res = await fetch(`${BASE}/jobs`)
  return res.json()
}

export async function createJob(data) {
  const res = await fetch(`${BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateJob(id, data) {
  const res = await fetch(`${BASE}/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteJob(id) {
  const res = await fetch(`${BASE}/jobs/${id}`, { method: 'DELETE' })
  return res.json()
}
