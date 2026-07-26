import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { Badge, Button, Card, CardBody, LoadingScreen, SectionHeader } from '../components/UI'
import { fetchLivestream, fetchQueue, joinQueue, leaveQueue } from '../services/livestreams'
import { useLivestreamSocket } from '../hooks/useLivestreamSocket'
import { formatDateTime, formatStatus, statusTone } from '../utils/format'

export default function LivestreamDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [details, setDetails] = useState(null)
  const [queue, setQueue] = useState([])
  const [playing, setPlaying] = useState([])
  const [waiting, setWaiting] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')
  const socketState = useLivestreamSocket(id)

  useEffect(() => {
    async function load() {
      try {
        const payload = await fetchLivestream(id)
        setDetails(payload.livestream)
        setQueue(payload.queue)
        setPlaying(payload.playing)
        setWaiting(payload.waiting)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    if (!socketState.snapshot) return
    setDetails(socketState.snapshot.livestream)
    setQueue(socketState.snapshot.queue)
    setPlaying(socketState.snapshot.playing)
    setWaiting(socketState.snapshot.waiting)
  }, [socketState.snapshot])

  async function handleJoin() {
    setActionError('')
    try {
      const entry = await joinQueue(id)
      setQueue((current) => current.some((item) => item.id === entry.id) ? current : [...current, entry])
    } catch (error) {
      setActionError(error?.response?.data?.error || 'Unable to join queue.')
    }
  }

  async function handleLeave() {
    setActionError('')
    try {
      await leaveQueue(id)
    } catch (error) {
      setActionError(error?.response?.data?.error || 'Unable to leave queue.')
    }
  }

  if (loading) return <LoadingScreen />
  if (!details) return <div className="text-muted">Không tìm thấy livestream.</div>

  const myEntry = queue.find((entry) => entry.user_id === user?.id && ['waiting', 'playing'].includes(entry.status))

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Chi tiết livestream"
        title={details.title}
        description={`${details.game_name} · mở lúc ${formatDateTime(details.created_at)}`}
        actions={
          <>
            <Badge tone={statusTone(details.status)}>{formatStatus(details.status)}</Badge>
            {user && details.status === 'open' ? (
              myEntry ? <Button tone="secondary" onClick={handleLeave}>Rời hàng chờ</Button> : <Button onClick={handleJoin}>Vào hàng chờ</Button>
            ) : null}
            {details.streamer_id === user?.id || user?.role === 'admin' ? <Link to={`/streamer/livestreams/${details.id}/manage`}><Button tone="secondary">Quản lý</Button></Link> : null}
          </>
        }
      />

      {actionError ? <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{actionError}</div> : null}

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardBody className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Hàng chờ</h3>
            <div className="space-y-3">
              {queue.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                  <div>
                    <div className="font-medium text-text">{entry.user?.ingame_name}</div>
                    <div className="text-xs text-muted">{entry.user?.game_uid || 'Chưa có hồ sơ trong game'}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={statusTone(entry.status)}>{formatStatus(entry.status)}</Badge>
                    <span className="text-sm text-muted">#{entry.position}</span>
                  </div>
                </div>
              ))}
              {!queue.length ? <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-6 text-sm text-muted">Hiện chưa có ai trong hàng chờ.</div> : null}
            </div>
          </CardBody>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-3">
              <h3 className="text-lg font-semibold text-text">Đang chơi</h3>
              {playing.map((entry) => <div key={entry.id} className="rounded-xl bg-white/5 px-4 py-3 text-sm text-text">{entry.user?.ingame_name}</div>)}
              {!playing.length ? <div className="text-sm text-muted">Hiện chưa có trận nào đang diễn ra.</div> : null}
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-2 text-sm text-muted">
              <div className="flex justify-between"><span>Số suất mỗi trận</span><span className="text-text">{details.slot_per_match}</span></div>
              <div className="flex justify-between"><span>Đang chờ</span><span className="text-text">{waiting.length}</span></div>
              <div className="flex justify-between"><span>Trạng thái</span><span className="text-text">{formatStatus(details.status)}</span></div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
