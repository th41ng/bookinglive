import clsx from 'clsx'

export function Card({ className = '', children }) {
  return <div className={clsx('rounded-2xl border border-white/8 bg-panel/90 shadow-glow backdrop-blur-xl', className)}>{children}</div>
}

export function CardBody({ className = '', children }) {
  return <div className={clsx('p-5 sm:p-6', className)}>{children}</div>
}

export function Button({ className = '', tone = 'primary', children, ...props }) {
  const tones = {
    primary: 'bg-accent-500 text-white hover:bg-accent-400 shadow-[0_12px_40px_rgba(20,163,255,0.25)]',
    secondary: 'bg-white/6 text-text hover:bg-white/10 border border-white/10',
    ghost: 'bg-transparent text-text hover:bg-white/6 border border-transparent',
    danger: 'bg-danger text-white hover:brightness-110',
    success: 'bg-success text-bg hover:brightness-105',
  }
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent-400/60 disabled:cursor-not-allowed disabled:opacity-60',
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ className = '', label, hint, ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-muted">
      {label ? <span className="font-medium text-text">{label}</span> : null}
      <input
        className={clsx(
          'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text placeholder:text-white/30 outline-none transition focus:border-accent-400/60 focus:bg-white/8',
          className
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  )
}

export function Select({ className = '', label, children, ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-muted">
      {label ? <span className="font-medium text-text">{label}</span> : null}
      <select
        className={clsx(
          'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition focus:border-accent-400/60 focus:bg-white/8',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}

export function Textarea({ className = '', label, ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-muted">
      {label ? <span className="font-medium text-text">{label}</span> : null}
      <textarea
        className={clsx(
          'min-h-28 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-text outline-none transition placeholder:text-white/30 focus:border-accent-400/60 focus:bg-white/8',
          className
        )}
        {...props}
      />
    </label>
  )
}

export function Badge({ tone = 'default', children }) {
  const tones = {
    default: 'bg-white/8 text-text border-white/10',
    success: 'bg-success/15 text-success border-success/30',
    warning: 'bg-warning/15 text-warning border-warning/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
    accent: 'bg-accent-500/15 text-accent-200 border-accent-400/30',
  }
  return <span className={clsx('inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]', tones[tone])}>{children}</span>
}

export function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? <div className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-300">{eyebrow}</div> : null}
        <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">{title}</h2>
        {description ? <p className="max-w-2xl text-sm text-muted sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <Card>
      <CardBody className="text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-white/6 ring-1 ring-white/10" />
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        <p className="mt-2 text-sm text-muted">{description}</p>
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </CardBody>
    </Card>
  )
}

export function LoadingScreen({ label = 'Đang tải...' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="rounded-2xl border border-white/10 bg-panel/85 px-5 py-4 text-sm text-muted shadow-glow">{label}</div>
    </div>
  )
}
