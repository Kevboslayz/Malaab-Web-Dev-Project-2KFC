import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Field from '../components/Field'
import { primaryButton, sizeNormal } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { DEMO_PASSWORD } from '../data/mockData'

// Surface 08 — Sign in and sign up. One page component, two modes, so the
// frame (left-hand pitch + card) is written once.

type Mode = 'signin' | 'signup'

const linkClass =
  'font-semibold text-brand-300 underline decoration-accent-300 decoration-2 underline-offset-4'

const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

// Only follow ?next= if it is a path inside this app.
function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/'
}

export default function Auth({ mode }: { mode: Mode }) {
  const { currentUser } = useAuth()
  const [params] = useSearchParams()
  const requested = safeNext(params.get('next'))
  // A brand-new account has no games yet, so send it to the list of games.
  const next = mode === 'signup' && requested === '/' ? '/games' : requested

  // Already signed in: there is nothing to do here.
  if (currentUser) return <Navigate to={next} replace />

  // Keep ?next= when switching between sign in and sign up.
  const query = params.get('next') ? `?next=${encodeURIComponent(requested)}` : ''

  return (
    <Layout footerCode="CSC443-F26 · T07 · S08 · rev A">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-md lg:pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-300">
              The game is two short
            </p>
            <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] tracking-[0.01em] text-ink">
              Ten names,
              <br />
              not ten
              <br />
              maybes.
            </h1>
            <p className="mt-6 text-sm text-muted">
              A roster only means something if the names in it are real. Accounts use your
              university address and nothing else is asked for.
            </p>
          </div>

          <div className="w-full max-w-md rounded-card border border-line bg-surface">
            {mode === 'signin' ? (
              <SignInForm next={next} switchTo={`/signup${query}`} />
            ) : (
              <SignUpForm next={next} switchTo={`/signin${query}`} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-line px-7 py-5">
      <h2 className="font-display text-3xl uppercase leading-none tracking-wide text-ink">{title}</h2>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>
    </div>
  )
}

function SignInForm({ next, switchTo }: { next: string; switchTo: string }) {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitted, setSubmitted] = useState(false)
  const [rejected, setRejected] = useState(false)

  const errors = {
    email: !email.trim()
      ? 'Enter your university email.'
      : !looksLikeEmail(email)
        ? 'That is not an email address.'
        : undefined,
    password: !password ? 'Enter your password.' : undefined,
  }
  const show = (field: keyof typeof errors) =>
    touched[field] || submitted ? errors[field] : undefined

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (errors.email || errors.password) {
      document.getElementById(errors.email ? 'm-email' : 'm-pass')?.focus()
      return
    }
    if (signIn(email, password)) {
      navigate(next, { replace: true })
    } else {
      setRejected(true)
    }
  }

  return (
    <>
      <CardHeader title="Sign in" subtitle="To take a spot or start a game." />
      <form noValidate onSubmit={handleSubmit} className="space-y-5 px-7 py-6">
        {rejected && (
          <div role="alert" className="rounded-card border border-red-500/40 bg-red-500/10 px-5 py-4">
            <p className="text-sm font-semibold text-red-200">That email and password do not match</p>
            <p className="mt-1 text-xs text-red-200/70">Check both and try again, or reset your password.</p>
          </div>
        )}
        <Field
          id="m-email"
          label="University email"
          type="email"
          autoComplete="email"
          placeholder="christian.nehman@lau.edu"
          value={email}
          onChange={(v) => {
            setEmail(v)
            setRejected(false)
          }}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={show('email')}
        />
        <Field
          id="m-pass"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(v) => {
            setPassword(v)
            setRejected(false)
          }}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={show('password')}
        />
        <button type="submit" className={`${primaryButton} ${sizeNormal} w-full`}>
          Sign in
        </button>
        <p className="text-center text-xs text-muted">
          New here?{' '}
          <Link to={switchTo} className={linkClass}>
            Sign up
          </Link>
        </p>
        <p className="text-center text-[11px] text-muted/70">
          Demo account: christian.nehman@lau.edu &middot; {DEMO_PASSWORD}
        </p>
      </form>
    </>
  )
}

function SignUpForm({ next, switchTo }: { next: string; switchTo: string }) {
  const { signUp, emailTaken } = useAuth()
  const navigate = useNavigate()

  const [values, setValues] = useState({ name: '', email: '', sports: '', password: '' })
  const [touched, setTouched] = useState({ name: false, email: false, sports: false, password: false })
  const [submitted, setSubmitted] = useState(false)

  type Key = keyof typeof values
  const set = (key: Key) => (v: string) => setValues((prev) => ({ ...prev, [key]: v }))
  const blur = (key: Key) => () => setTouched((prev) => ({ ...prev, [key]: true }))

  const sports = values.sports
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const name = values.name.trim()
  const email = values.email.trim()
  const errors: Record<Key, string | undefined> = {
    name: !name
      ? 'Enter your full name.'
      : !name.includes(' ')
        ? 'Enter your first and last name.'
        : undefined,
    email: !email
      ? 'Enter your university email.'
      : !email.toLowerCase().endsWith('@lau.edu') || !looksLikeEmail(email)
        ? 'Use your @lau.edu address.'
        : emailTaken(email)
          ? 'An account already uses this address. Sign in instead.'
          : undefined,
    sports: sports.length === 0 ? 'Name at least one sport you play.' : undefined,
    password: !values.password
      ? 'Choose a password of at least 8 characters.'
      : values.password.length < 8
        ? `At least 8 characters — ${8 - values.password.length} to go.`
        : undefined,
  }
  // Errors appear once a field has been left (or on submit), then update
  // live on every keystroke.
  const show = (key: Key) => (touched[key] || submitted ? errors[key] : undefined)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    const firstInvalid = (Object.keys(errors) as Key[]).find((k) => errors[k])
    if (firstInvalid) {
      document.getElementById(`m-${firstInvalid}`)?.focus()
      return
    }
    signUp({ name, email, sports, password: values.password })
    navigate(next, { replace: true })
  }

  return (
    <>
      <CardHeader
        title="Sign up"
        subtitle="Your university address — people are meeting strangers on a pitch at night."
      />
      <form noValidate onSubmit={handleSubmit} className="space-y-5 px-7 py-6">
        <Field
          id="m-name"
          label="Full name"
          autoComplete="name"
          placeholder="Christian Nehman"
          value={values.name}
          onChange={set('name')}
          onBlur={blur('name')}
          error={show('name')}
        />
        <Field
          id="m-email"
          label="University email"
          type="email"
          autoComplete="email"
          placeholder="christian.nehman@lau.edu"
          value={values.email}
          onChange={set('email')}
          onBlur={blur('email')}
          hint="Must end in @lau.edu."
          error={show('email')}
        />
        <Field
          id="m-sports"
          label="Sports you play"
          placeholder="Football, padel"
          value={values.sports}
          onChange={set('sports')}
          onBlur={blur('sports')}
          hint="Separate them with commas."
          error={show('sports')}
        />
        <Field
          id="m-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={set('password')}
          onBlur={blur('password')}
          hint="At least 8 characters."
          error={show('password')}
        />
        <button type="submit" className={`${primaryButton} ${sizeNormal} w-full`}>
          Create account
        </button>
        <p className="text-center text-xs text-muted">
          Already have one?{' '}
          <Link to={switchTo} className={linkClass}>
            Sign in
          </Link>
        </p>
      </form>
    </>
  )
}
