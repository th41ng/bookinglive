import { Link } from 'react-router-dom'

import { Badge, Button, Card, CardBody } from '../components/UI'

const highlights = [
  { title: 'Luồng ưu tiên hàng chờ', text: 'Người chơi xếp hàng theo thứ tự và streamer tự chuyển trận sau mỗi ván.' },
  { title: 'Đồng bộ trực tiếp', text: 'Socket.IO giữ trạng thái hàng chờ luôn mới cho mọi người xem và streamer đang kết nối.' },
  { title: 'Phân quyền rõ ràng', text: 'Quyền của người xem, streamer và admin được kiểm soát xuyên suốt.' },
]

export default function HomePage() {
  return (
    <div> 
      <h1>Cái này là trang chủ nè</h1>
      <h2>Nữa tôi khều donate ở đây</h2>
      <h2>Giờ thì nhấn vô dấu 3 gạch rồi qua tab livesteam để đăng kí slot nha</h2>
    </div>
    
    // <div className="space-y-10">
    //   <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
    //     <div className="space-y-6">
    //       <Badge tone="accent">MVP sẵn sàng triển khai</Badge>
    //       <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-text sm:text-6xl">
    //         Vận hành hàng chờ game trực tiếp mà không cần tải lại trang.
    //       </h1>
    //       <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
    //         QueueStream cho phép streamer mở đăng ký, người xem tham gia phiên chơi, và mọi người nhìn thấy thứ tự chờ và đang chơi theo thời gian thực.
    //       </p>
    //       <div className="flex flex-wrap gap-3">
    //         <Link to="/livestreams"><Button>Xem livestream</Button></Link>
    //         <Link to="/login"><Button tone="secondary">Đăng nhập bằng Google</Button></Link>
    //       </div>
    //     </div>
    //     <Card className="relative overflow-hidden border-white/10">
    //       <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 via-transparent to-success/10" />
    //       <CardBody className="relative space-y-5">
    //         <div className="text-sm uppercase tracking-[0.28em] text-muted">Trạng thái trực tiếp</div>
    //         <div className="space-y-3">
    //           <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
    //             <span className="text-sm text-muted">Đăng ký</span>
    //             <span className="text-sm font-semibold text-success">Đang mở</span>
    //           </div>
    //           <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
    //             <span className="text-sm text-muted">Số suất mỗi trận</span>
    //             <span className="text-sm font-semibold text-text">1 or 2</span>
    //           </div>
    //           <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
    //             <span className="text-sm text-muted">Phát sóng</span>
    //             <span className="text-sm font-semibold text-accent-200">Socket.IO</span>
    //           </div>
    //         </div>
    //       </CardBody>
    //     </Card>
    //   </section>

    //   <section className="grid gap-4 md:grid-cols-3">
    //     {highlights.map((item) => (
    //       <Card key={item.title}>
    //         <CardBody>
    //           <h3 className="text-lg font-semibold text-text">{item.title}</h3>
    //           <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
    //         </CardBody>
    //       </Card>
    //     ))}
    //   </section>
    // </div>
  )
}
