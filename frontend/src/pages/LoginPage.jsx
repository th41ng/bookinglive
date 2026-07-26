import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { googleClientId, useAuth } from '../contexts/AuthContext'
import { Badge, Card, CardBody } from '../components/UI'

export default function LoginPage() {
  const navigate = useNavigate()
  const { loginWithGoogle } = useAuth()
  const [error, setError] = useState('')

  const handleSuccess = async (credentialResponse) => {
    setError('')
    try {
      const result = await loginWithGoogle(credentialResponse.credential)
      navigate(result.needs_profile_completion ? '/complete-profile' : '/')
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Không thể đăng nhập bằng Google.')
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardBody className="space-y-6">
          <div className="space-y-2 text-center">
            <Badge tone="accent">Xác thực</Badge>
            <h1 className="font-display text-3xl font-bold text-text">Đăng nhập bằng Google</h1>
            <p className="text-sm leading-6 text-muted">
              Mỗi người dùng chỉ có một tài khoản. Sau lần đăng nhập đầu tiên, ứng dụng sẽ yêu cầu tên trong game và UID game của bạn.
            </p>
          </div>
          <div className="flex justify-center">
            {googleClientId ? (
              <GoogleLogin onSuccess={handleSuccess} onError={() => {}} />
            ) : (
              <div className="max-w-sm rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100">
                Chức năng đăng nhập Google chưa được cấu hình trong môi trường này. Hãy đặt <span className="font-semibold">VITE_GOOGLE_CLIENT_ID</span> và khởi động lại frontend để bật đăng nhập.
              </div>
            )}
          </div>
          {error ? <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div> : null}
        </CardBody>
      </Card>
    </div>
  )
}
