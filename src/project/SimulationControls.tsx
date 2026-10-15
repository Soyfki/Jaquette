import { chapters } from './demoData'
import { BASE_WORDS_PER_MINUTE, useDemoSimulation } from './useDemoSimulation'

export function SimulationControls({
  id,
  activeWordIndex,
  chapterIndex,
  historyOpen,
  page,
  setActiveWordIndex,
  setChapterIndex,
  setHistoryOpen,
  setPage,
  historyButtonRef,
}: {
  id?: string
  activeWordIndex: number | null
  chapterIndex: number
  historyOpen: boolean
  page: number
  setActiveWordIndex: React.Dispatch<React.SetStateAction<number | null>>
  setChapterIndex: (value: number) => void
  setHistoryOpen: (value: boolean) => void
  setPage: (value: number) => void
  historyButtonRef: React.RefObject<HTMLButtonElement | null>
}) {
  const {
    chapter, simulationState, speedMultiplier, setSpeedMultiplier, lastWordIndex,
    moveChapter, toggleSimulation, moveActiveWord, simulationLabel, simulationButtonLabel,
  } = useDemoSimulation({ activeWordIndex, chapterIndex, setActiveWordIndex, setChapterIndex, setPage })


  return (
    <section id={id} className="sound-panel sound-controls" aria-labelledby="sound-controls-title" data-workspace-region="simulation">
      <div className="controls-title">
        <div><span className="sound-panel__index">04 · Démonstrations locales</span><h2 id="sound-controls-title">Simulation/Navigation</h2></div>
      </div>
      <div className="control-demonstrations">
        <div className="book-navigation" aria-labelledby="book-navigation-title">
          <h3 id="book-navigation-title">Navigation fictive du livre</h3>
          <div className="chapter-history-row">
            <label className="chapter-select">Chapitre
              <select value={chapterIndex} onChange={(event) => moveChapter(Number(event.target.value))}>
                {chapters.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}
              </select>
            </label>
            <button ref={historyButtonRef} type="button" className="history-button" aria-expanded={historyOpen} aria-controls="project-history" onClick={() => setHistoryOpen(!historyOpen)}>Historique</button>
          </div>
          <div className="page-navigation-group" role="group" aria-label="Pagination fictive du livre">
            <button type="button" className="icon-button" aria-label="Page précédente" disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
            <label className="page-slider" htmlFor="book-page-slider">Page fictive
              <input
                id="book-page-slider"
                aria-label="Page fictive"
                type="range"
                min="1"
                max={chapter.pages}
                value={page}
                aria-valuetext={`Page ${page} sur ${chapter.pages}`}
                onChange={(event) => setPage(Number(event.target.value))}
              />
              <output className="page-output" htmlFor="book-page-slider" aria-live="polite">Page {page} sur {chapter.pages}</output>
            </label>
            <button type="button" className="icon-button" aria-label="Page suivante" disabled={page === chapter.pages} onClick={() => setPage(page + 1)}>→</button>
          </div>
        </div>
        <div className="text-simulation" aria-labelledby="text-simulation-title">
          <div className="text-simulation__heading">
            <h3 id="text-simulation-title">Simulation fictive du texte</h3>
            <span className={`simulation-status simulation-status--${simulationState}`} role="status" aria-live="polite" aria-label={`État de la simulation : ${simulationLabel}`}>
              <span aria-hidden="true" /><strong>{simulationLabel}</strong>
            </span>
          </div>
          <div className="simulation-actions">
            <button type="button" className="simulation-toggle" onClick={toggleSimulation}>{simulationButtonLabel}</button>
            <button type="button" className="simulation-step" disabled={activeWordIndex === null || activeWordIndex === 0} onClick={() => moveActiveWord(-1)}>Mot précédent</button>
            <button type="button" className="simulation-step" disabled={activeWordIndex === lastWordIndex} onClick={() => moveActiveWord(1)}>Mot suivant</button>
          </div>
          <div className="simulation-speed" aria-label="Vitesse de la simulation">
            <span>Base : {BASE_WORDS_PER_MINUTE} mots par minute</span>
            <div className="speed-buttons" role="group" aria-label="Multiplicateur de vitesse">
              {[1, 2, 4].map((multiplier) => (
                <button
                  type="button"
                  key={multiplier}
                  aria-pressed={speedMultiplier === multiplier}
                  onClick={() => setSpeedMultiplier(multiplier)}
                >x{multiplier}</button>
              ))}
            </div>
            <strong>Multiplicateur actif : x{speedMultiplier}</strong>
          </div>
        </div>
      </div>
      {historyOpen && (
        <div id="project-history" className="project-history" role="region" aria-label="Historique fictif du projet">
          <div><strong>Version de repérage</strong><span>Aujourd’hui · 09:42 · démonstration</span></div>
          <div><strong>Structure du livre préparée</strong><span>Hier · 17:18 · démonstration</span></div>
          <div><strong>Projet fictif créé</strong><span>12 août · 11:03 · démonstration</span></div>
        </div>
      )}
      <p className="controls-disclaimer">Démonstration locale uniquement : aucun son joué, aucune pagination EPUB définie et aucune donnée persistée.</p>
    </section>
  )
}
