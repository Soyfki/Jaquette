import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('design system demonstration', () => {
  it('renders the required controls and visual foundations', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'La voix du livre commence ici.' })).toBeVisible()
    expect(screen.getByRole('button', { name: /Explorer les fondations/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Voir la page du livre' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Action indisponible' })).toBeDisabled()
    expect(screen.getByRole('searchbox', { name: 'Rechercher dans les sons' })).toBeVisible()
    expect(screen.getByText('Favori')).toBeVisible()
    expect(screen.getByLabelText('Exemple de page de livre')).toBeVisible()
  })

  it.each([
    ['SFX', 'Étincelle'],
    ['Ambiance', 'Ondes'],
    ['Musique', 'Note de musique'],
  ])('identifies %s with a label and a distinct icon', (trackName, iconName) => {
    render(<App />)

    const card = document.querySelector(`[data-track="${trackName}"]`)
    expect(card).not.toBeNull()
    expect(card).toHaveTextContent(trackName)
    expect(card?.querySelector(`[aria-label="${iconName}"]`)).not.toBeNull()
  })

  it('updates the selected filter with an accessible pressed state', async () => {
    const user = userEvent.setup()
    render(<App />)

    const musicFilter = screen.getByRole('button', { name: 'Musique' })
    await user.click(musicFilter)

    expect(musicFilter).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Filtre actif :').parentElement).toHaveTextContent('Filtre actif : Musique')
  })

  it('marks the Arabic excerpt as right-to-left Arabic content', () => {
    render(<App />)

    const arabicText = screen.getByText('كان البحر هادئًا، وكانت الكلمات تسير مع ضوء الصباح.')
    expect(arabicText.closest('[lang="ar"]')).toHaveAttribute('dir', 'rtl')
  })
})
