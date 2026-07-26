import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { createLivestream, fetchLivestreams } from '../services/livestreams'
import { Badge, Button, Card, CardBody, Input, Select, SectionHeader } from '../components/UI'
import { useAuth } from '../contexts/AuthContext'
import { formatDateTime, formatStatus, statusTone } from '../utils/format'

export default function StreamerDashboardPage() {
  const { user } = useAuth()
  const [livestreams, setLivestreams] = useState([])
  const [form, setForm] = useState({ title: '', game_name: '', slot_per_match: 1 })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLivestreams('mine').then(setLivestreams)
  }, [])

  async function handleCreate(event) {
    event.preventDefault()
    setError('')
    try {
      const created = await createLivestream(form)
      setLivestreams((current) => [created, ...current])
      setForm({ title: '', game_name: '', slot_per_match: 1 })
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to create livestream.')
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Bảng điều khiển streamer"
        title={`Quản lý phiên chơi, ${user?.display_name}`}
        description="Tạo phiên, mở đăng ký và giữ hàng chờ luôn chạy theo thời gian thực."
      />
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardBody className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Tạo livestream</h3>
            <form className="space-y-4" onSubmit={handleCreate}>
              <Input label="Tiêu đề" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} />
              <Input label="Tên game" value={form.game_name} onChange={(e) => setForm((current) => ({ ...current, game_name: e.target.value }))} />
              <Select label="Số người mỗi trận" value={form.slot_per_match} onChange={(e) => setForm((current) => ({ ...current, slot_per_match: Number(e.target.value) }))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </Select>
              {error ? <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div> : null}
              <Button type="submit" className="w-full">Tạo livestream</Button>
            </form>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Livestream của tôi</h3>
            <div className="space-y-3">
              {livestreams.map((livestream) => (
                <div key={livestream.id} className="rounded-xl border border-white/8 bg-white/4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-text">{livestream.title}</div>
                      <div className="text-sm text-muted">{livestream.game_name}</div>
                    </div>
                    <Badge tone={statusTone(livestream.status)}>{formatStatus(livestream.status)}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                    <span>Suất {livestream.slot_per_match}</span>
                    <span>Tạo lúc {formatDateTime(livestream.created_at)}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to={`/streamer/livestreams/${livestream.id}/manage`}><Button tone="secondary">Quản lý</Button></Link>
                    <Link to={`/streamer/livestreams/${livestream.id}/queue`}><Button tone="secondary">Hàng chờ</Button></Link>
                    <Link to={`/livestreams/${livestream.id}`}><Button tone="ghost">Mở trang công khai</Button></Link>
                  </div>
                </div>
              ))}
              {!livestreams.length ? <div className="rounded-xl border border-white/8 bg-white/4 p-4 text-sm text-muted">Chưa có livestream nào. Hãy tạo một livestream để bắt đầu.</div> : null}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
