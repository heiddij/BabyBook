import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navigation from './Navigation'

describe('Navigation Component', () => {
  const user = {
    id: '123',
  }
  const mockHandleLogout = vi.fn()

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Navigation handleLogout={mockHandleLogout} user={user} />
      </MemoryRouter>
    )

  it('renders navigation links correctly', () => {
    renderComponent()

    expect(screen.getByText(/etusivu/i)).toBeInTheDocument()
    expect(screen.getByText(/omat sivut/i)).toBeInTheDocument()
    expect(screen.getByText(/kirjaudu ulos/i)).toBeInTheDocument()
  })

  it('renders the home link with the correct URL', () => {
    renderComponent()

    const homeLink = screen.getByText('Etusivu')
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('renders the user link with the correct URL', () => {
    renderComponent()

    const userLink = screen.getByText('Omat sivut')
    expect(userLink).toHaveAttribute('href', `/users/${user.id}`)
  })

  it('renders the logout button and handles click event', () => {
    renderComponent()

    const logoutButton = screen.getByText('Kirjaudu ulos')
    fireEvent.click(logoutButton)
    expect(mockHandleLogout).toHaveBeenCalledTimes(1)
  })
})