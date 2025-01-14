import { render, screen } from '@testing-library/react'
import Post from './Post'
import { describe, it, expect } from 'vitest'

describe('Post Component', () => {
  const mockUser = { username: 'testuser' }
  const mockBaby = { id: 1, firstname: 'Baby', profilepic: '/baby-pic.jpg' }
  const mockPost = {
    createdAt: '2023-01-01T12:00:00+02:00',
    post: 'Hello world!',
    image: '/image.jpg'
  }

  it('renders the username correctly', () => {
    render(<Post user={mockUser} baby={mockBaby} post={mockPost} />)
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('renders the baby’s information correctly', () => {
    render(<Post user={mockUser} baby={mockBaby} post={mockPost} />)
    expect(screen.getByAltText('Baby\'s profilepic')).toHaveAttribute('src', '/baby-pic.jpg')
    expect(screen.getByText('Baby')).toBeInTheDocument()
  })

  it('renders the post content correctly', () => {
    render(<Post user={mockUser} baby={mockBaby} post={mockPost} />)
    expect(screen.getByText('Hello world!')).toBeInTheDocument()
  })

  it('renders the post creation date correctly', () => {
    const formattedDate = '01.01.2023 12:00'
    render(<Post user={mockUser} baby={mockBaby} post={mockPost} />)
    expect(screen.getByText(formattedDate)).toBeInTheDocument()
  })

  it('renders the post image correctly', () => {
    render(<Post user={mockUser} baby={mockBaby} post={mockPost} />)
    expect(screen.getByAltText('Baby\'s post')).toHaveAttribute('src', '/image.jpg')
  })
})
