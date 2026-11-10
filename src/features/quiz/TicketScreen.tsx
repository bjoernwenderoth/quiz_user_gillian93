import { forwardRef, useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowLeft, Check, RotateCcw } from 'lucide-react'
import { toBlob } from 'html-to-image'
import { motion, useReducedMotion } from 'motion/react'
import { AnimatedButton, ScreenTransition } from '../../components/ui'
import { gift } from './content'
import { EkgDivider } from './berlinUi'
import { useTilt } from './berlin'
import { finaleMedia } from './finaleMedia'

type TicketKind = 'gillian' | 'companion'
const exports: Record<TicketKind, { filename: string; label: string; saved: string }> = {
  gillian: { filename: 'project-x-gillian-ticket.png', label: `TICKET ${gift.recipient.toUpperCase()}`, saved: `Ticket für ${gift.recipient} gespeichert.` },
  companion: { filename: 'project-x-begleitung-ticket.png', label: 'TICKET BEGLEITUNG', saved: 'Ticket für deine Begleitung gespeichert.' },
}

/** Front of a symbolic gift ticket in Berlin lebt 3 branding. No barcode, seat or ticket number. */
const TicketFront = forwardRef<HTMLElement, { companion?: boolean }>(function TicketFront({ companion = false }, ref) {
  return <article ref={ref} className="bl-ticket" aria-label={companion ? 'Geschenkticket für Begleitung' : 'Geschenkticket für Gillian'}>
    <div className="bl-ticket-hero">
      <img src={finaleMedia.poster} alt="" width="2048" height="904" />
      <span className="bl-ticket-badge">GESCHENKTICKET</span>
    </div>
    <div className="bl-ticket-body">
      <p className="bl-ticket-kicker">{gift.artists.toUpperCase()}</p>
      <h2 className="bl-ticket-title">BERLIN LEBT <span>3</span></h2>
      <p className="bl-ticket-sub">TOUR 2027</p>
      <EkgDivider className="bl-ticket-ekg" />
      <div className="bl-ticket-details">
        <p><span>DATUM</span><strong>{gift.date}</strong></p>
        <p><span>LOCATION</span><strong>{gift.venue}</strong></p>
      </div>
    </div>
    <div className="bl-ticket-stub">
      <div><span>RESERVIERT FÜR</span><strong>{companion ? 'Begleitung +1' : gift.recipient}</strong></div>
      <span className="bl-ticket-mark" aria-hidden="true">X</span>
    </div>
    <p className="bl-ticket-disclaimer">Geschenkticket · Keine gültige Eintrittskarte.</p>
  </article>
})

function TicketCard({ companion = false, index }: { companion?: boolean; index: number }) {
  const reduced = useReducedMotion()
  const tilt = useTilt(10, !!reduced)
  const [flipped, setFlipped] = useState(false)
  return <motion.div className="ticket-scene"
    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60, rotateX: 40, rotateZ: index ? 4 : -4 }}
    animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0 }}
    transition={{ duration: reduced ? 0.1 : 1, delay: reduced ? 0 : 0.25 + index * 0.18, ease: [0.16, 1, 0.3, 1] }}>
    <div className="ticket-tilt" {...tilt}>
      <div className={`ticket-flip ${flipped ? 'is-flipped' : ''}`}>
        <div className="ticket-face ticket-face-front" aria-hidden={flipped}><TicketFront companion={companion} /><span className="ticket-holo" aria-hidden="true" /></div>
        <div className="ticket-face ticket-face-back" aria-hidden={!flipped}>
          <span className="bl-ticket-mark" aria-hidden="true">X</span>
          <p className="ticket-back-to">{companion ? 'FÜR DEINE BEGLEITUNG' : `FÜR ${gift.recipient.toUpperCase()}`}</p>
          <p className="ticket-back-text">{companion ? 'Weil die besten Abende zu zweit noch lauter sind.' : 'Laut mitsingen. Erinnerungen mitnehmen. Alles Gute zum Geburtstag!'}</p>
          <EkgDivider />
          <p className="ticket-back-meta">{gift.date} · {gift.venue}</p>
        </div>
      </div>
    </div>
    <button type="button" className="ticket-flip-button" onClick={() => setFlipped(!flipped)} aria-pressed={flipped}><RotateCcw size={14} />{flipped ? 'Vorderseite zeigen' : 'Ticket umdrehen'}</button>
  </motion.div>
}

export function TicketScreen({ onBack }: { onBack: () => void }) {
  const gillianRef = useRef<HTMLElement>(null)
  const companionRef = useRef<HTMLElement>(null)
  const exporting = useRef(false)
  const posterReady = useRef<Promise<void>>(Promise.resolve())
  const surfaceRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState<TicketKind | null>(null)
  const [saved, setSaved] = useState<TicketKind | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const images = [...(surfaceRef.current?.querySelectorAll('img') ?? [])]
    posterReady.current = Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(() => undefined)
  }, [])

  async function saveTicket(kind: TicketKind) {
    const node = (kind === 'gillian' ? gillianRef : companionRef).current
    if (!node || exporting.current) return
    exporting.current = true
    setBusy(kind)
    setSaved(null)
    setError('')
    try {
      await Promise.all([document.fonts.ready, posterReady.current])
      const blob = await toBlob(node, { pixelRatio: 2, backgroundColor: '#070707', cacheBust: false, preferredFontFormat: 'woff2' })
      if (!blob) throw new Error('Empty export')
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = exports[kind].filename
      document.body.append(link)
      link.click()
      link.remove()
      // Give the browser time to start the download before the blob is released.
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
      setSaved(kind)
    } catch {
      setError('Das Bild konnte nicht erstellt werden. Bitte versuche es noch einmal.')
    } finally { exporting.current = false; setBusy(null) }
  }

  return <ScreenTransition className="tickets-screen">
    <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={16} />Zurück zum Gewinn</button>
    <h1 className="slam-title">EIN ABEND.<br /><span className="accent">ZWEI PLÄTZE.</span></h1>
    <p className="story-copy">Hamburg. Laut mitsingen. Erinnerungen mitnehmen.</p>
    <div className="ticket-grid"><TicketCard index={0} /><TicketCard companion index={1} /></div>
    <p className="ticket-hint">Wisch über ein Ticket oder dreh es um.</p>
    <div className="ticket-export-surface" ref={surfaceRef} aria-hidden="true" inert><TicketFront ref={gillianRef} /><TicketFront ref={companionRef} companion /></div>
    <div className="ticket-actions" aria-busy={busy !== null}>
      <p className="ticket-actions-title">Geschenktickets als Bild speichern</p>
      <div className="ticket-buttons">
        {(['gillian', 'companion'] as const).map((kind) => <AnimatedButton key={kind} onClick={() => saveTicket(kind)} disabled={busy !== null}><ArrowDownToLine size={18} />{busy === kind ? 'BILD WIRD ERSTELLT …' : exports[kind].label}</AnimatedButton>)}
      </div>
      <p role="status" className="ticket-saved">{saved && <><Check size={15} />{exports[saved].saved}</>}</p>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
  </ScreenTransition>
}
