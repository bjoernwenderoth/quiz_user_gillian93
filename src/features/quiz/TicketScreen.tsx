import { forwardRef, useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowUpRight, Check, Ticket } from 'lucide-react'
import { toBlob } from 'html-to-image'
import { AnimatedButton, ScreenTransition } from '../../components/ui'
import { gift } from './content'

const filename = 'project-x-gillian-ticket.png'

const GiftTicket = forwardRef<HTMLElement, { companion?: boolean }>(function GiftTicket({ companion = false }, ref) {
  return <article ref={ref} className={`gift-ticket ${companion ? 'companion-ticket' : ''}`} aria-label={companion ? 'Geschenkticket für Begleitung' : 'Geschenkticket für Gillian'}>
    <div className="ticket-top"><span>PROJECT <strong>X</strong></span><span>GESCHENKTICKET <Ticket size={16} /></span></div>
    <div className="ticket-body"><span className="ticket-x" aria-hidden="true">X</span><p className="ticket-tour">BERLIN LEBT 3</p><h2>SAMRA &<br />CAPITAL BRA</h2><div className="ticket-details"><p><span>DATUM</span><strong>{gift.date}</strong></p><p><span>LOCATION</span><strong>{gift.venue}</strong></p></div></div>
    <div className="ticket-stub"><div><span>RESERVIERT FÜR</span><strong>{companion ? 'Begleitung +1' : 'Gillian'}</strong></div><Ticket className="ticket-mark" size={30} aria-hidden="true" /></div>
    <p className="ticket-disclaimer">Ein Geschenkversprechen. Keine gültige Eintrittskarte.</p>
  </article>
})

export function TicketScreen() {
  const ticketRef = useRef<HTMLElement>(null)
  const exporting = useRef(false)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  async function saveTicket() {
    if (!ticketRef.current || exporting.current) return
    exporting.current = true
    setBusy(true)
    setError('')
    try {
      await document.fonts.ready
      const blob = await toBlob(ticketRef.current, { pixelRatio: 2, backgroundColor: '#20231f', cacheBust: false, preferredFontFormat: 'woff2' })
      if (!blob) throw new Error('Empty export')
      const url = URL.createObjectURL(blob)
      setPreview(url)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.append(link)
      link.click()
      link.remove()
    } catch {
      setError('Das Bild konnte nicht erstellt werden. Bitte versuche es noch einmal.')
    } finally { exporting.current = false; setBusy(false) }
  }

  return <ScreenTransition className="tickets-screen">
    <h1>Ein Abend.<br /><span className="gold">Zwei Plätze für euch.</span></h1>
    <p className="story-copy">Hamburg. Laut mitsingen. Erinnerungen mitnehmen.</p>
    <div className="ticket-grid"><GiftTicket /><GiftTicket companion /></div>
    <div className="ticket-export-surface" aria-hidden="true" inert><GiftTicket ref={ticketRef} /></div>
    <div className="ticket-actions" aria-busy={busy}><AnimatedButton onClick={saveTicket} disabled={busy}><ArrowDownToLine size={18} />{busy ? 'BILD WIRD ERSTELLT …' : 'GESCHENKTICKET SPEICHERN'}</AnimatedButton><p>Für Gillian · dein Geschenkticket als Bild</p></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {preview && <div className="export-preview"><p role="status"><Check size={16} />Dein Geschenkticket ist bereit.</p><p>Falls der Download auf deinem Handy nicht startet: Öffne das Bild und halte es zum Speichern gedrückt.</p><a className="text-button" href={preview} target="_blank" rel="noreferrer">TICKETBILD ÖFFNEN <ArrowUpRight size={16} /></a><img src={preview} alt="Exportiertes Geschenkticket für Gillian" /></div>}
  </ScreenTransition>
}

