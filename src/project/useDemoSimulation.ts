import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { chapters } from './demoData'

type SimulationState = 'inactive' | 'paused' | 'playing'
export const BASE_WORDS_PER_MINUTE = 180

type DemoSimulationOptions = {
  activeWordIndex: number | null
  chapterIndex: number
  setActiveWordIndex: Dispatch<SetStateAction<number | null>>
  setChapterIndex: (value: number) => void
  setPage: (value: number) => void
}

// Keep transport and speed inside SimulationControls' mount lifetime.
export function useDemoSimulation({ activeWordIndex, chapterIndex, setActiveWordIndex, setChapterIndex, setPage }: DemoSimulationOptions) {
  const chapter = chapters[chapterIndex]
  const [simulationState, setSimulationState] = useState<SimulationState>('inactive')
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const wordCount = useMemo(() => chapter.paragraphs.join(' ').match(/\S+/g)?.length ?? 0, [chapter])
  const lastWordIndex = Math.max(0, wordCount - 1)
  const moveChapter = (next: number) => {
    setChapterIndex(next)
    setPage(1)
    setActiveWordIndex(null)
    setSimulationState('inactive')
  }

  useEffect(() => {
    if (simulationState !== 'playing') return
    const timer = window.setTimeout(() => {
      const next = Math.min(lastWordIndex, activeWordIndex === null ? 0 : activeWordIndex + 1)
      setActiveWordIndex(next)
      if (next === lastWordIndex) setSimulationState('inactive')
    }, 60_000 / (BASE_WORDS_PER_MINUTE * speedMultiplier))
    return () => window.clearTimeout(timer)
  }, [activeWordIndex, lastWordIndex, setActiveWordIndex, simulationState, speedMultiplier])

  const toggleSimulation = () => {
    if (simulationState === 'playing') {
      setSimulationState('paused')
      return
    }
    if (activeWordIndex === null || activeWordIndex >= lastWordIndex) setActiveWordIndex(0)
    setSimulationState('playing')
  }
  const moveActiveWord = (direction: -1 | 1) => {
    const next = Math.min(lastWordIndex, Math.max(0, (activeWordIndex ?? (direction > 0 ? -1 : 1)) + direction))
    setActiveWordIndex(next)
    if (next === lastWordIndex) setSimulationState('inactive')
  }
  const simulationLabel = simulationState === 'playing' ? 'En cours' : simulationState === 'paused' ? 'En pause' : 'Inactive'
  const simulationButtonLabel = simulationState === 'playing'
    ? 'Mettre en pause'
    : simulationState === 'paused'
      ? 'Reprendre la simulation'
      : 'Lancer la simulation'
  return {
    chapter, simulationState, speedMultiplier, setSpeedMultiplier, lastWordIndex,
    moveChapter, toggleSimulation, moveActiveWord, simulationLabel, simulationButtonLabel,
  }
}
