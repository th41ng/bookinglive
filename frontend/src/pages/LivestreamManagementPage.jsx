import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Badge, Button, Card, CardBody, Input, Select, SectionHeader } from '../components/UI'
import { fetchLivestream, closeLivestream, openLivestream, updateLivestream, updateSlots } from '../services/livestreams'
import { formatDateTime, formatStatus, statusTone } from '../utils/format'

export default function LivestreamManagementPage() {
  const { id } = useParams()
  const [livestream, setLivestream] = useState(null)
  const [form, setForm] = useState({ title: '', game_name: '', slot_per_match: 1 })

  useEffect(() => {
    fetchLivestream(id).then((payload) => {
      setLivestream(payload.livestream)
      setForm({
        title: payload.livestream.title,
        game_name: payload.livestream.game_name,
        slot_per_match: payload.livestream.slot_per_match,
      })
    })
  }, [id])

  async function saveProfile(event) {
    event.preventDefault()
    const updated = await updateLivestream(id, form)
    setLivestream(updated)
  }

  async function handleOpen() {
    setLivestream(await openLivestream(id))
  }

  async function handleClose() {
    setLivestream(await closeLivestream(id))
  }

  async function handleSlotChange(value) {
    const updated = await updateSlots(id, Number(value))
    setLivestream(updated)
    setForm((current) => ({ ...current, slot_per_match: updated.slot_per_match }))
  }

  if (!livestream) return null

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Quản lý"
        title={livestream.title}
        description={`${livestream.game_name} · tạo lúc ${formatDateTime(livestream.created_at)}`}
        actions={<Badge tone={statusTone(livestream.status)}>{formatStatus(livestream.status)}</Badge>}
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardBody>
            <form className="space-y-4" onSubmit={saveProfile}>
              <Input label="Tiêu đề" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} />
              <Input label="Tên game" value={form.game_name} onChange={(e) => setForm((current) => ({ ...current, game_name: e.target.value }))} />
              <Select label="Số người mỗi trận" value={form.slot_per_match} onChange={(e) => handleSlotChange(e.target.value)}>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </Select>
              <Button type="submit">Lưu thay đổi</Button>
            </form>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-3">
            <h3 className="text-lg font-semibold text-text">Điều khiển đăng ký</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleOpen}>Mở đăng ký</Button>
              <Button tone="secondary" onClick={handleClose}>Đóng đăng ký</Button>
            </div>
            <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-muted">
              Số suất hiện tại: <span className="text-text">{livestream.slot_per_match}</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
