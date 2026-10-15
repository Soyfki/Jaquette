import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction, type RefObject } from 'react'
import { useMediaQuery } from './useMediaQuery'

type WorkspacePanel = 'library' | 'inspector' | 'simulation'
type ResponsiveDrawer = WorkspacePanel | null
type DesktopPanelState = Record<WorkspacePanel, boolean>
const REDUCED_WORKSPACE_QUERY = '(max-width: 56rem)'

type SoundDesignerPanelOptions = {
  setActiveWordIndex: Dispatch<SetStateAction<number | null>>
  historyOpen: boolean
  setHistoryOpen: (value: boolean) => void
  historyButtonRef: RefObject<HTMLButtonElement | null>
}

export function useSoundDesignerPanels({ setActiveWordIndex, historyOpen, setHistoryOpen, historyButtonRef }: SoundDesignerPanelOptions) {
  const [desktopPanels, setDesktopPanels] = useState<DesktopPanelState>({
    library: true,
    inspector: true,
    simulation: true,
  })
  const [responsiveDrawer, setResponsiveDrawer] = useState<ResponsiveDrawer>(null)
  const isReducedWorkspace = useMediaQuery(REDUCED_WORKSPACE_QUERY)
  const libraryButtonRef = useRef<HTMLButtonElement>(null)
  const inspectorButtonRef = useRef<HTMLButtonElement>(null)
  const simulationButtonRef = useRef<HTMLButtonElement>(null)
  const libraryCloseButtonRef = useRef<HTMLButtonElement>(null)
  const inspectorCloseButtonRef = useRef<HTMLButtonElement>(null)
  const simulationCloseButtonRef = useRef<HTMLButtonElement>(null)

  const resetSimulation = useCallback(() => {
    setActiveWordIndex(null)
    setHistoryOpen(false)
  }, [setActiveWordIndex, setHistoryOpen])

  const closeResponsiveDrawer = (restoreFocus = true) => {
    const drawerToClose = responsiveDrawer
    if (drawerToClose === 'simulation') resetSimulation()
    setResponsiveDrawer(null)
    if (!restoreFocus) return
    if (drawerToClose === 'library') libraryButtonRef.current?.focus()
    if (drawerToClose === 'inspector') inspectorButtonRef.current?.focus()
    if (drawerToClose === 'simulation') simulationButtonRef.current?.focus()
  }

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mediaQuery = window.matchMedia(REDUCED_WORKSPACE_QUERY)
    const resetPanelsAtBreakpoint = (event: MediaQueryListEvent) => {
      setResponsiveDrawer(null)
      setActiveWordIndex(null)
      setHistoryOpen(false)
      if (!event.matches) {
        setDesktopPanels({ library: true, inspector: true, simulation: true })
      }
    }
    mediaQuery.addEventListener('change', resetPanelsAtBreakpoint)
    return () => mediaQuery.removeEventListener('change', resetPanelsAtBreakpoint)
  }, [setActiveWordIndex, setHistoryOpen])

  useEffect(() => {
    if (!isReducedWorkspace || !responsiveDrawer) return
    const focusTarget = responsiveDrawer === 'library'
      ? libraryCloseButtonRef
      : responsiveDrawer === 'inspector'
        ? inspectorCloseButtonRef
        : simulationCloseButtonRef
    focusTarget.current?.focus()
  }, [isReducedWorkspace, responsiveDrawer])

  useEffect(() => {
    const closeOverlay = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (historyOpen) {
        setHistoryOpen(false)
        historyButtonRef.current?.focus()
        return
      }
      if (responsiveDrawer) {
        setResponsiveDrawer(null)
        if (responsiveDrawer === 'library') libraryButtonRef.current?.focus()
        if (responsiveDrawer === 'inspector') inspectorButtonRef.current?.focus()
        if (responsiveDrawer === 'simulation') {
          resetSimulation()
          simulationButtonRef.current?.focus()
        }
        return
      }
    }
    window.addEventListener('keydown', closeOverlay)
    return () => window.removeEventListener('keydown', closeOverlay)
  }, [historyOpen, responsiveDrawer, historyButtonRef, resetSimulation, setHistoryOpen])

  const isPanelOpen = (panel: WorkspacePanel) => isReducedWorkspace
    ? responsiveDrawer === panel
    : desktopPanels[panel]
  const togglePanel = (panel: WorkspacePanel) => {
    if (isReducedWorkspace) {
      if (responsiveDrawer === panel) {
        closeResponsiveDrawer(false)
      } else {
        if (responsiveDrawer === 'simulation') resetSimulation()
        setResponsiveDrawer(panel)
      }
      return
    }
    if (panel === 'simulation' && desktopPanels.simulation) resetSimulation()
    setDesktopPanels((current) => ({ ...current, [panel]: !current[panel] }))
  }
  const panelAction = (panel: WorkspacePanel, name: string) => {
    if (isReducedWorkspace) return `${isPanelOpen(panel) ? 'Fermer' : 'Ouvrir'} ${name}`
    return `${isPanelOpen(panel) ? 'Masquer' : 'Afficher'} ${name}`
  }
  const panelControlId = (panel: WorkspacePanel) => isReducedWorkspace
    ? `sound-${panel}-drawer`
    : `sound-${panel}-panel`
  const workspaceClasses = [
    'sound-workspace',
    `sound-workspace--library-${desktopPanels.library ? 'open' : 'closed'}`,
    `sound-workspace--inspector-${desktopPanels.inspector ? 'open' : 'closed'}`,
    `sound-workspace--simulation-${desktopPanels.simulation ? 'open' : 'closed'}`,
  ].join(' ')

  return {
    desktopPanels, responsiveDrawer, isReducedWorkspace,
    libraryButtonRef, inspectorButtonRef, simulationButtonRef,
    libraryCloseButtonRef, inspectorCloseButtonRef, simulationCloseButtonRef,
    closeResponsiveDrawer, isPanelOpen, togglePanel, panelAction, panelControlId, workspaceClasses,
  }
}
