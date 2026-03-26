import { useState } from 'react'
import dayjs from 'dayjs'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import StatusChip from './StatusChip'

const COLUMNS = [
  {
    id: 'company',
    label: 'Company',
    sortable: true,
    minWidth: 130,
  },
  {
    id: 'role',
    label: 'Role',
    sortable: true,
    minWidth: 160,
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    minWidth: 130,
  },
  {
    id: 'dateApplied',
    label: 'Date Applied',
    sortable: true,
    minWidth: 120,
  },
  {
    id: 'url',
    label: 'Posting',
    sortable: false,
    minWidth: 80,
  },
  {
    id: 'notes',
    label: 'Notes',
    sortable: false,
    minWidth: 180,
  },
  {
    id: 'actions',
    label: '',
    sortable: false,
    minWidth: 80,
  },
]

function renderCell(col, job) {
  switch (col.id) {
    case 'company':
      return (
        <Typography variant="body1" fontWeight={500}>
          {job.company}
        </Typography>
      )
    case 'role':
      return job.role
    case 'status':
      return <StatusChip status={job.status} />
    case 'dateApplied':
      return dayjs(job.dateApplied).format('MMM D, YYYY')
    case 'url':
      return job.url ? (
        <Tooltip title="View job posting">
          <IconButton
            component="a"
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Typography color="text.disabled">—</Typography>
      )
    case 'notes':
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 240,
          }}
        >
          {job.notes || '—'}
        </Typography>
      )
    default:
      return null
  }
}

export default function JobTable({ jobs, sortConfig, onSort, onEdit, onDelete }) {
  const [confirmingId, setConfirmingId] = useState(null)

  function handleDeleteClick(id) {
    setConfirmingId(id)
  }

  function handleConfirmDelete(id) {
    onDelete(id)
    setConfirmingId(null)
  }

  function handleCancelDelete() {
    setConfirmingId(null)
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 880 }}>
        <TableHead>
          <TableRow>
            {COLUMNS.map(col => (
              <TableCell
                key={col.id}
                sx={{ minWidth: col.minWidth }}
                align={col.id === 'actions' ? 'right' : 'left'}
              >
                {col.sortable ? (
                  <TableSortLabel
                    active={sortConfig.field === col.id}
                    direction={sortConfig.field === col.id ? sortConfig.direction : 'asc'}
                    onClick={() => onSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map(job => (
            <TableRow key={job.applicationId}>
              {COLUMNS.map(col => {
                if (col.id === 'actions') {
                  const isConfirming = confirmingId === job.applicationId
                  return (
                    <TableCell key="actions" align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {isConfirming ? (
                        <>
                          <Tooltip title="Confirm delete">
                            <IconButton
                              size="small"
                              onClick={() => handleConfirmDelete(job.applicationId)}
                              sx={{ color: '#b71c1c', '&:hover': { color: '#b71c1c', backgroundColor: '#fce4ec' } }}
                            >
                              <CheckIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton size="small" onClick={handleCancelDelete}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => onEdit(job)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDeleteClick(job.applicationId)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  )
                }
                return (
                  <TableCell key={col.id}>
                    {renderCell(col, job)}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
