import { useState, useEffect, useMemo } from 'react'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import dayjs from 'dayjs'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import theme from './theme'
import Header from './components/Header'
import JobTable from './components/JobTable'
import JobFormModal from './components/JobFormModal'
import EmptyState from './components/EmptyState'
import { getJobs, createJob, updateJob, deleteJob } from './services/api'

export default function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [sortConfig, setSortConfig] = useState({ field: 'dateApplied', direction: 'desc' })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    getJobs().then(data => {
      setJobs(data)
      setLoading(false)
    })
  }, [])

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const { field, direction } = sortConfig
      let valA = a[field]
      let valB = b[field]
      if (field === 'dateApplied') {
        valA = dayjs(valA).valueOf()
        valB = dayjs(valB).valueOf()
      } else {
        valA = valA?.toLowerCase?.() ?? ''
        valB = valB?.toLowerCase?.() ?? ''
      }
      if (valA < valB) return direction === 'asc' ? -1 : 1
      if (valA > valB) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [jobs, sortConfig])

  function handleSort(field) {
    setSortConfig(prev => {
      if (prev.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { field, direction: field === 'dateApplied' ? 'desc' : 'asc' }
    })
  }

  function openModal(job) {
    setEditingJob(job ?? null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingJob(null)
  }

  function showSnackbar(message, severity = 'success') {
    setSnackbar({ open: true, message, severity })
  }

  async function handleSubmit(formData) {
    setModalLoading(true)
    try {
      if (editingJob) {
        const updated = await updateJob(editingJob.applicationId, formData)
        setJobs(prev => prev.map(j => j.applicationId === updated.applicationId ? updated : j))
        showSnackbar('Application updated')
      } else {
        const newJob = await createJob(formData)
        setJobs(prev => [newJob, ...prev])
        showSnackbar('Application added')
      }
      closeModal()
    } finally {
      setModalLoading(false)
    }
  }

  async function handleDelete(id) {
    await deleteJob(id)
    setJobs(prev => prev.filter(j => j.applicationId !== id))
    showSnackbar('Application removed', 'info')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header onAddClick={() => openModal(null)} />
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <CircularProgress sx={{ color: '#1d1d1f' }} />
            </Box>
          ) : jobs.length === 0 ? (
            <EmptyState onAddClick={() => openModal(null)} />
          ) : (
            <JobTable
              jobs={sortedJobs}
              sortConfig={sortConfig}
              onSort={handleSort}
              onEdit={openModal}
              onDelete={handleDelete}
            />
          )}
        </Box>
      </Box>

      <JobFormModal
        open={modalOpen}
        job={editingJob}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={modalLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ borderRadius: '10px', fontSize: '14px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}
