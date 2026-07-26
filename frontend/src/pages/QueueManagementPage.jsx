import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Badge, Button, Card, CardBody, SectionHeader } from '../components/UI'
import { fetchLivestream, fetchQueue, finishMatch, removeQueueEntry, skipPlayer } from '../services/livestreams'
import { formatDateTime, formatStatus, statusTone } from '../utils/format'

export default function QueueManagementPage() {
  const { id } = useParams()
  const [livestream, setLivestream] = useState(null)
  const [queue, setQueue] = useState([])
  const [playing, setPlaying] = useState([])

  async function load() {
    const details = await fetchLivestream(id)
    setLivestream(details.livestream)
    setQueue(details.queue)
    setPlaying(details.playing)
  }

  useEffect(() => {
    load()
  }, [id])

  async function handleFinish() {
    await finishMatch(id)
    await load()
  }

  async function handleSkip() {
    await skipPlayer(id)
    await load()
  }

  async function handleRemove(entryId) {
    await removeQueueEntry(id, entryId)
    await load()
  }

  if (!livestream) return null

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Quản lý hàng chờ"
        title={livestream.title}
        description="Chuyển hàng chờ thủ công sau mỗi trận hoặc xoá người chơi khi cần."
        actions={<Badge tone={statusTone(livestream.status)}>{formatStatus(livestream.status)}</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardBody className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleFinish}>Kết thúc trận</Button>
              <Button tone="secondary" onClick={handleSkip}>Bỏ qua người tiếp theo</Button>
            </div>
            <div className="space-y-3">
              {queue.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-white/8 bg-white/4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-text">{entry.user?.display_name}</div>
                      <div className="text-sm text-muted">Vào lúc {formatDateTime(entry.joined_at)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={statusTone(entry.status)}>{formatStatus(entry.status)}</Badge>
                      <span className="text-sm text-muted">#{entry.position}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button tone="danger" onClick={() => handleRemove(entry.id)}>Xoá</Button>
                  </div>
                </div>
              ))}
              {!queue.length ? <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-6 text-sm text-muted">Hiện chưa có người trong hàng chờ.</div> : null}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-3">
            <h3 className="text-lg font-semibold text-text">Đang chơi</h3>
            <div className="space-y-2">
              {playing.map((entry) => (
                <div key={entry.id} className="rounded-xl bg-white/5 px-4 py-3 text-sm text-text">{entry.user?.display_name}</div>
              ))}
              {!playing.length ? <div className="text-sm text-muted">Hiện chưa có trận nào đang diễn ra.</div> : null}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
