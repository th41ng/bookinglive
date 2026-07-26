import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { useAuth } from '../contexts/AuthContext'
import { Badge, Button, Card, CardBody, SectionHeader } from '../components/UI'
import { fetchLivestreams } from '../services/livestreams'
import { formatStatus } from '../utils/format'

export default function ViewerDashboardPage() {
  const { user } = useAuth()
  const [livestreams, setLivestreams] = useState([])

  useEffect(() => {
    fetchLivestreams('open').then(setLivestreams)
  }, [])

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Bảng điều khiển người xem"
        title={`Xin chào, ${user?.display_name}`}
        description="Dùng trang này để xem các phiên đang mở và chuẩn bị hồ sơ để tham gia hàng chờ."
      />
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardBody className="space-y-3">
            <Badge tone={user?.profile_complete ? 'success' : 'warning'}>{user?.profile_complete ? 'Hồ sơ đã hoàn tất' : 'Hồ sơ chưa hoàn tất'}</Badge>
            <div className="text-sm text-muted">{user?.email}</div>
            <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-text">{user?.ingame_name || 'Hãy thêm thông tin trong game để tham gia hàng chờ.'}</div>
            <Link to="/complete-profile"><Button tone="secondary" className="w-full">Sửa hồ sơ</Button></Link>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Livestream đang mở</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {livestreams.slice(0, 4).map((livestream) => (
                <Link key={livestream.id} to={`/livestreams/${livestream.id}`}>
                  <div className="rounded-xl border border-white/8 bg-white/4 p-4 transition hover:bg-white/8">
                    <div className="font-medium text-text">{livestream.title}</div>
                    <div className="text-sm text-muted">{livestream.game_name}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">{formatStatus(livestream.status)}</div>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/livestreams"><Button>Xem tất cả</Button></Link>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
