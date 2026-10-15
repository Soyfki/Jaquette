import { StrictMode } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppShell } from '../Shell'

function mediaFixture(reduced = false) {
  const listeners = new Set<EventListenerOrEventListenerObject>()
  const media = {
    matches: reduced,
    media: '(max-width: 56rem)',
    addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => listeners.add(listener),
    removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => listeners.delete(listener),
  }
  vi.stubGlobal('matchMedia', () => media)
  return { listeners }
}

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }))

describe('T-72 prototype state lifetimes', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.history.replaceState(null, '', '/projet')
  })
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('discards library search and file metadata when its panel unmounts', () => {
    mediaFixture()
    render(<StrictMode><AppShell /></StrictMode>)
    const search = screen.getByRole('searchbox')
    fireEvent.change(search, { target: { value: 'gravier' } })
    fireEvent.change(screen.getByLabelText('Ouvrir un fichier local'), {
      target: { files: [new File(['fixture'], 'private-fixture.wav', { type: 'audio/wav' })] },
    })
    expect(screen.getByText('private-fixture.wav')).toBeVisible()
    click(/Masquer la bibliothèque/)
    click(/Afficher la bibliothèque/)
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.queryByText('private-fixture.wav')).toBeNull()
  })

  it('keeps chapter/page but destroys transport/speed when only the simulation panel closes', () => {
    mediaFixture()
    render(<StrictMode><AppShell /></StrictMode>)
    act(() => vi.advanceTimersByTime(20))
    fireEvent.change(screen.getByRole('combobox', { name: 'Chapitre' }), { target: { value: '1' } })
    fireEvent.change(screen.getByRole('slider'), { target: { value: '4' } })
    click('x4')
    click('Lancer la simulation')
    expect(vi.getTimerCount()).toBe(1)
    click(/Masquer Simulation/)
    expect(vi.getTimerCount()).toBe(0)
    expect(document.querySelector('[data-active-word]')).toBeNull()
    click(/Afficher Simulation/)
    expect(screen.getByRole('combobox')).toHaveValue('1')
    expect(screen.getByRole('slider')).toHaveValue('4')
    expect(screen.getByRole('button', { name: 'x1' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Lancer la simulation' })).toBeVisible()
    click('Réviseur')
    click('Sound Designer')
    expect(screen.getByRole('combobox')).toHaveValue('0')
    expect(screen.getByRole('slider')).toHaveValue('1')
  })

  it('closes history before the reduced drawer and restores each focus target', () => {
    mediaFixture(true)
    render(<StrictMode><AppShell /></StrictMode>)
    act(() => vi.advanceTimersByTime(20))
    click(/Ouvrir Simulation/)
    expect(document.querySelector('#sound-simulation-drawer .drawer-close-button')).toHaveFocus()
    click('Historique')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('region', { name: 'Historique fictif du projet' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Historique' })).toHaveFocus()
    expect(document.querySelector('#sound-simulation-drawer')).not.toBeNull()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(document.querySelector('#sound-simulation-drawer')).toBeNull()
    expect(screen.getByRole('button', { name: /Ouvrir Simulation/ })).toHaveFocus()
  })

  it('removes every owned window/media listener across StrictMode remounts', () => {
    const media = mediaFixture()
    const active = new Map<string, Set<EventListenerOrEventListenerObject>>()
    const add = window.addEventListener.bind(window)
    const remove = window.removeEventListener.bind(window)
    const timers = vi.spyOn(window, 'setTimeout')
    const clearTimer = vi.spyOn(window, 'clearTimeout')
    vi.spyOn(window, 'addEventListener').mockImplementation((type, listener, options) => {
      if (type === 'popstate' || type === 'keydown') {
        if (!active.has(type)) active.set(type, new Set())
        active.get(type)!.add(listener)
      }
      add(type, listener, options)
    })
    vi.spyOn(window, 'removeEventListener').mockImplementation((type, listener, options) => {
      active.get(type)?.delete(listener)
      remove(type, listener, options)
    })
    for (let cycle = 0; cycle < 3; cycle++) {
      const view = render(<StrictMode><AppShell /></StrictMode>)
      act(() => vi.advanceTimersByTime(20))
      expect(active.get('popstate')?.size).toBe(1)
      expect(media.listeners.size).toBe(2)
      click('Historique')
      click('Ouvrir la navigation générale')
      click('Lancer la simulation')
      view.unmount()
      expect([...active.values()].every(listeners => listeners.size === 0)).toBe(true)
      expect(media.listeners.size).toBe(0)
      // Count the simulation's owned handles, not jsdom/React focus bookkeeping.
      const simulationHandles = timers.mock.calls.flatMap((args, index) =>
        args[1] === 60_000 / 180 ? [timers.mock.results[index].value as number] : [])
      expect(simulationHandles.length).toBe(cycle + 1)
      for (const handle of simulationHandles) expect(clearTimer).toHaveBeenCalledWith(handle)
    }
  })

  it('cancels pending heading focus frames on navigation and unmount', () => {
    mediaFixture()
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame')
    const frames = vi.spyOn(window, 'requestAnimationFrame')
    const view = render(<StrictMode><AppShell /></StrictMode>)
    click('Ouvrir la navigation générale')
    fireEvent.click(screen.getByRole('link', { name: 'Paramètres' }))
    expect(window.location.pathname).toBe('/parametres')
    expect(cancelFrame).toHaveBeenCalled()
    view.unmount()
    for (const frame of frames.mock.results) expect(cancelFrame).toHaveBeenCalledWith(frame.value)
    act(() => vi.advanceTimersByTime(60_000))
    expect(view.container).toBeEmptyDOMElement()
  })
})
