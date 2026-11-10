import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { access } from './content'
import { AnimatedButton, ScreenTransition } from '../../components/ui'

type FieldErrors = { email?: string; password?: string; form?: string }

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [checking, setChecking] = useState(false)
  const submitted = useRef(false)
  const reduced = useReducedMotion()
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitted.current) return
    const form = event.currentTarget
    const nextErrors: FieldErrors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Bitte gib eine gültige E-Mail-Adresse ein.'
    if (!password) nextErrors.password = 'Bitte gib dein Passwort ein.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      form.querySelector<HTMLInputElement>(nextErrors.email ? '#email' : '#password')?.focus()
      return
    }
    // Short check delay so the sign-in feels like a real request. Credentials never leave the browser.
    submitted.current = true
    setChecking(true)
    const valid = email.trim().toLowerCase() === access.email.toLowerCase() && password === access.password
    window.setTimeout(() => {
      setChecking(false)
      if (!valid) {
        submitted.current = false
        setPassword('')
        setErrors({ form: 'E-Mail-Adresse oder Passwort ist nicht korrekt. Bitte prüfe deine Zugangsdaten.' })
        form.querySelector<HTMLInputElement>('#password')?.focus()
        return
      }
      setPassword('')
      setEmail('')
      onLogin()
    }, reduced ? 150 : 900)
  }
  return <ScreenTransition className="login-screen">
    <div className="access-art" aria-hidden="true">
      <div className="access-frame"><motion.div className="access-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0.1 : 2.4, delay: reduced ? 0 : 0.3, ease: 'easeOut' }} /><motion.span className="access-x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0.1 : 1.2, ease: 'easeOut' }}>X</motion.span><span className="art-caption">Das Unbekannte wartet.</span></div>
      <div className="art-coordinate"><span>PX—010</span><span>ACCESS / INVITATION ONLY</span></div>
    </div>
    <div className="login-copy">
      <h1>PROJECT <span className="gold">X</span></h1>
      <p className="private-access">Private Access</p>
      <div className="login-intro"><LockKeyhole size={16} /><p>Dein persönlicher Zugang zum Unbekannten.</p></div>
      <form className="login-form" onSubmit={submit} noValidate aria-describedby="login-note">
        <div className="field"><label htmlFor="email">E-Mail-Adresse</label><input id="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} inputMode="email" placeholder="name@beispiel.de" value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined })) }} required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
          {errors.email && <p id="email-error" className="form-error" role="alert">{errors.email}</p>}
        </div>
        <div className="field"><label htmlFor="password">Passwort</label><div className="password-field"><input id="password" type={visible ? 'text' : 'password'} autoComplete="current-password" placeholder="Passwort" value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })) }} required aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : 'login-note'} /><button type="button" className="password-toggle" onClick={() => setVisible(!visible)} aria-label={visible ? 'Passwort verbergen' : 'Passwort anzeigen'} aria-pressed={visible}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          {errors.password && <p id="password-error" className="form-error" role="alert">{errors.password}</p>}
        </div>
        {errors.form && <p className="form-error form-error-block" role="alert">{errors.form}</p>}
        <AnimatedButton type="submit" disabled={checking} aria-busy={checking}>{checking ? 'ZUGANG WIRD GEPRÜFT …' : 'IDENTITÄT BESTÄTIGEN'} <ArrowRight size={17} /></AnimatedButton>
        <p className="form-note" id="login-note">Melde dich mit den Zugangsdaten aus deiner persönlichen Einladung an.</p>
      </form>
    </div>
  </ScreenTransition>
}
