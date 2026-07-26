import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { useAuth } from '../contexts/AuthContext'
import { Badge, Button, Card, CardBody, Input, SectionHeader } from '../components/UI'

export default function CompleteProfilePage() {
  const navigate = useNavigate()
  const { user, saveProfile } = useAuth()
  const [form, setForm] = useState({ ingame_name: user?.ingame_name || '', game_uid: user?.game_uid || '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await saveProfile({
        ingame_name: form.ingame_name.trim(),
        game_uid: form.game_uid.trim(),
      })
      navigate(user?.role === 'streamer' ? '/streamer/dashboard' : '/viewer/dashboard')
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Không thể lưu hồ sơ.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SectionHeader
        eyebrow="Thiết lập hồ sơ"
        title="Hoàn thiện tài khoản"
        description="Cần có thông tin trong game trước khi bạn có thể tham gia hàng chờ hoặc quản lý livestream."
      />
      <Card>
        <CardBody className="space-y-5">
          <div className="flex items-center justify-between">
            <Badge tone="accent">Chỉ cần một lần</Badge>
            <span className="text-sm text-muted">{user?.email}</span>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Tên trong game" value={form.ingame_name} onChange={(e) => setForm((current) => ({ ...current, ingame_name: e.target.value }))} />
            <Input label="UID game" value={form.game_uid} onChange={(e) => setForm((current) => ({ ...current, game_uid: e.target.value }))} />
            {error ? <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div> : null}
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu hồ sơ'}</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
