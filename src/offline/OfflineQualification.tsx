import { useEffect, useState } from 'react'
import { prepareQualification, qualificationStatus, type LocalQualification } from './startup'
import './offline.css'

export function OfflineQualification({ settings = false }: { settings?: boolean }) {
  const [state, setState] = useState<{ project: LocalQualification | null; buildId: string | null }>({ project: null, buildId: null })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const available = !!globalThis.indexedDB && 'serviceWorker' in navigator
  useEffect(() => {
    if (!available) return
    let active = true
    qualificationStatus().then((value) => { if (active) setState(value) }).catch((e: Error) => { if (active) setError(e.message) })
    return () => { active = false }
  }, [settings, available])
  if (!settings && !state.project && !error) return null
  const prepare = async () => {
    setBusy(true); setError('')
    try { setState(await prepareQualification()) } catch (e) {
      try { setState(await qualificationStatus()) } catch { setState({ project: null, buildId: null }) }
      setError(e instanceof Error ? e.message : 'Préparation impossible.')
    }
    finally { setBusy(false) }
  }
  if (!settings) return (
    <section className="offline-project-status" aria-label="Démonstration locale hors ligne">
      <span role="status">{state.project && state.buildId ? 'Démonstration prête hors ligne' : 'Démonstration non préparée ou copie locale incomplète'}</span>
      {state.project && <small data-testid="offline-project" data-project-id={state.project.projectId} data-token-id={state.project.tokenId}>{state.project.marker}</small>}
      {error && <span role="alert">{error}</span>}
    </section>
  )
  return (
    <section className="component-card" aria-label="Démonstration locale hors ligne">
      <h2>Démonstration hors ligne</h2>
      <p>Projet synthétique de qualification ; ce parcours n’ouvre pas de fichier .jacq.</p>
      {settings && <button className="button button--secondary" type="button" disabled={busy || !available} onClick={() => { void prepare() }}>{busy ? 'Préparation en cours…' : 'Préparer la démonstration hors ligne'}</button>}
      <p role="status">{state.project && state.buildId ? 'Démonstration prête hors ligne' : 'Démonstration non préparée ou copie locale incomplète'}</p>
      {state.project && <p data-testid="offline-project" data-project-id={state.project.projectId} data-token-id={state.project.tokenId}>{state.project.marker}</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  )
}
