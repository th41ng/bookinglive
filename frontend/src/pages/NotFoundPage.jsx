import { Link } from 'react-router-dom'

import { Button, Card, CardBody } from '../components/UI'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center">
      <Card className="max-w-xl">
        <CardBody className="space-y-4 text-center">
          <h1 className="font-display text-3xl font-bold text-text">Page not found</h1>
          <p className="text-sm text-muted">Đường dẫn bạn mở không tồn tại.</p>
          <Link to="/"><Button>Về trang chủ</Button></Link>
        </CardBody>
      </Card>
    </div>
  )
}
