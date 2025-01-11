import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Baby from './Baby'

describe('Baby component', () => {
  const babyMock = {
    id: '1',
    firstname: 'John',
    profilepic: '/john-profile.jpg'
  }
  const userIdMock = '123'

  it('renders the baby link with the correct URL', () => {
    render(
      <MemoryRouter>
        <Baby baby={babyMock} userId={userIdMock} />
      </MemoryRouter>
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/users/${userIdMock}/${babyMock.id}`)
  })

  it('renders the baby firstname in the CardHeader', () => {
    render(
      <MemoryRouter>
        <Baby baby={babyMock} userId={userIdMock} />
      </MemoryRouter>
    )

    expect(screen.getByText(babyMock.firstname)).toBeInTheDocument()
  })

  it('renders the profile picture with the correct background image and title', () => {
    render(
      <MemoryRouter>
        <Baby baby={babyMock} userId={userIdMock} />
      </MemoryRouter>
    )

    const cardMedia = screen.getByTitle(`${babyMock.firstname}'s profilepic`)
    expect(cardMedia).toHaveStyle(`background-image: url(${babyMock.profilepic})`)
  })

  it('renders a default profile picture if none is provided', () => {
    const babyWithoutProfilePic = { ...babyMock, profilepic: null }

    render(
      <MemoryRouter>
        <Baby baby={babyWithoutProfilePic} userId={userIdMock} />
      </MemoryRouter>
    )

    const cardMedia = screen.getByTitle(`${babyMock.firstname}'s profilepic`)
    expect(cardMedia).toHaveStyle('background-image: url(/profile.jpg)')
  })
})