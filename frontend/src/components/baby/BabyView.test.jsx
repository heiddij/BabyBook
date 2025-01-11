import { screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { renderWithStore } from '../../utils/test-utils'
import BabyView from './BabyView'
import babyReducer, { deleteBaby } from '../../reducers/babyReducer'

vi.mock('../../reducers/babyReducer', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    default: actual.default,
    deleteBaby: vi.fn(),
  }
})

vi.mock('./BabyForm', () => ({
  default: () => <div data-testid="baby-form">BabyForm Component</div>,
}))
vi.mock('./BabyPostForm', () => ({
  default: () => <div data-testid="baby-post-form">BabyPostForm Component</div>,
}))
vi.mock('../post/PostList', () => ({
  default: () => <div data-testid="post-list">PostList Component</div>,
}))

describe('BabyView', () => {
  const baby = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    birthdate: '2023-01-01',
    birthplace: 'Helsinki',
    profilepic: '/profile.jpg',
    userId: 123,
  }

  const loggedUser = {
    id: 123,
    name: 'Logged User',
  }

  const preloadedState = {
    babies: [baby],
    user: loggedUser,
  }

  const renderComponent = (state = preloadedState) =>
    renderWithStore(
      <MemoryRouter initialEntries={[`/babies/${baby.id}`]}>
        <Routes>
          <Route path="/babies/:babyId" element={<BabyView />} />
        </Routes>
      </MemoryRouter>,
      { preloadedState: state, reducer: { babies: babyReducer } }
    )

  it('renders baby details correctly', () => {
    renderComponent()

    expect(screen.getByText(/vauvakirja/i)).toBeInTheDocument()
    expect(screen.getByText(`${baby.firstname} ${baby.lastname}`)).toBeInTheDocument()
    expect(screen.getByText(/helsinki/i)).toBeInTheDocument()
    expect(screen.getByAltText(`${baby.firstname}'s profile`)).toHaveAttribute('src', baby.profilepic)
  })

  it('renders "Vauvaa ei löydy" if baby is not found', () => {
    renderComponent({ ...preloadedState, babies: [] })

    expect(screen.getByText(/vauvaa ei löydy/i)).toBeInTheDocument()
  })

  it('toggles the modify baby form', () => {
    renderComponent()

    const modifyButton = screen.getByText(/muokkaa tietoja/i)
    expect(modifyButton).toBeInTheDocument()

    fireEvent.click(modifyButton)
    expect(screen.getByTestId('baby-form')).toBeInTheDocument()

    fireEvent.click(modifyButton)
    expect(screen.queryByTestId('baby-form')).not.toBeInTheDocument()
  })

  it('shows and hides the delete dialog', () => {
    renderComponent()

    const deleteButton = screen.getByTestId('open-dialog-button')
    fireEvent.click(deleteButton)

    expect(screen.getByRole('dialog')).toBeVisible()

    const cancelButton = screen.getByText(/peruuta/i)
    fireEvent.click(cancelButton)

    expect(screen.queryByRole('dialog')).not.toBeVisible()
  })

  it('dispatches deleteBaby action when confirming delete', async () => {
    renderComponent()

    const openDeleteDialogButton = screen.getByTestId('open-dialog-button')
    fireEvent.click(openDeleteDialogButton)

    const confirmDeleteButton = screen.getByTestId('confirm-delete-button')
    fireEvent.click(confirmDeleteButton)

    await waitFor(() => {
      expect(deleteBaby).toHaveBeenCalledWith(baby.id)
    })
  })

  it('renders BabyPostForm and PostList for logged-in user', () => {
    renderComponent()

    expect(screen.getByTestId('baby-post-form')).toBeInTheDocument()
    expect(screen.getByTestId('post-list')).toBeInTheDocument()
  })
})