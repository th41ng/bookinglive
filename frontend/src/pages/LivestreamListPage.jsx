import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { fetchLivestreams } from '../services/livestreams'
import { Badge, Button, Card, CardBody, LoadingScreen, SectionHeader } from '../components/UI'
import { formatDateTime, formatStatus, statusTone } from '../utils/format'

export default function LivestreamListPage() {
  const [livestreams, setLivestreams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLivestreams(await fetchLivestreams('open'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Khám phá"
        title="Livestream đang mở"
        description="Chọn một phiên, tham gia hàng chờ và đợi đến lượt chơi của bạn. (Nữa tui thêm chức năng để thông báo tới email của mấy ní nữa để khỏi phải ngồi canh nha)"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {livestreams.map((livestream) => (
          <Card key={livestream.id}>
            <CardBody className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-text">{livestream.title}</h3>
                  <p className="text-sm text-muted">{livestream.game_name}</p>
                </div>
                <Badge tone={statusTone(livestream.status)}>{formatStatus(livestream.status)}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-muted">
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">Suất/Trận</div>
                  <div className="mt-1 text-text">{livestream.slot_per_match}</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">Tạo lúc</div>
                  <div className="mt-1 text-text">{formatDateTime(livestream.created_at)}</div>
                </div>
              </div>
              <Link to={`/livestreams/${livestream.id}`}>
                <Button className="w-full">Mở chi tiết</Button>
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
      {!livestreams.length ? <div className="rounded-2xl border border-white/10 bg-panel/90 p-8 text-center text-muted">Hiện chưa có livestream nào đang mở.</div> : null}
    </div>
  )
}
