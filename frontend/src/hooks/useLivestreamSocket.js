import { useEffect, useMemo, useState } from 'react'

import { getSocket } from '../services/socket'

export function useLivestreamSocket(livestreamId) {
  const [snapshot, setSnapshot] = useState(null)

  useEffect(() => {
    if (!livestreamId) return undefined

    const socket = getSocket()
    const handleUpdate = (payload) => {
      if (String(payload?.livestream?.id) === String(livestreamId)) {
        setSnapshot(payload)
      }
    }

    socket.connect()
    socket.emit('join_livestream', { livestream_id: livestreamId })
    socket.on('livestream_updated', handleUpdate)

    return () => {
      socket.emit('leave_livestream', { livestream_id: livestreamId })
      socket.off('livestream_updated', handleUpdate)
    }
  }, [livestreamId])

  return useMemo(() => ({ snapshot, setSnapshot }), [snapshot])
}
