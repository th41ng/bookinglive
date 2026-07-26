export function formatDateTime(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatStatus(status) {
  const labels = {
    open: 'Đang mở',
    playing: 'Đang chơi',
    closed: 'Đã đóng',
    finished: 'Đã kết thúc',
    draft: 'Nháp',
    waiting: 'Đang chờ',
    skipped: 'Đã bỏ qua',
    cancelled: 'Đã huỷ',
  }

  return labels[status] || status
}

export function formatRole(role) {
  const labels = {
    viewer: 'Người xem',
    streamer: 'Streamer',
    admin: 'Quản trị',
  }

  return labels[role] || role
}

export function statusTone(status) {
  switch (status) {
    case 'open':
    case 'playing':
      return 'success'
    case 'closed':
    case 'finished':
      return 'warning'
    case 'draft':
    case 'waiting':
      return 'accent'
    case 'skipped':
    case 'cancelled':
      return 'danger'
    default:
      return 'default'
  }
}
