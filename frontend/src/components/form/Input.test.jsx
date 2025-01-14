import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Input } from './Input'
import { useFormContext } from 'react-hook-form'

vi.mock('react-hook-form', () => ({
  useFormContext: vi.fn(),
}))

describe('Input Component', () => {
  const mockRegister = vi.fn()

  beforeEach(() => {
    useFormContext.mockReturnValue({
      register: mockRegister,
      formState: { errors: {} },
    })
  })

  it('renders input with correct label and placeholder', () => {
    render(
      <Input
        name="testInput"
        label="Test Label"
        type="text"
        id="test-input"
        placeholder="Test Placeholder"
      />
    )

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument()
  })

  it('renders textarea when multiline is true', () => {
    render(
      <Input
        name="testTextarea"
        label="Test Textarea"
        type="text"
        id="test-textarea"
        placeholder="Enter text here"
        multiline
      />
    )

    expect(screen.getByLabelText('Test Textarea')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('displays validation error when present', () => {
    useFormContext.mockReturnValue({
      register: mockRegister,
      formState: {
        errors: {
          testInput: { message: 'Error message', type: 'required' },
        },
      },
    })

    render(
      <Input
        name="testInput"
        label="Test Label"
        type="text"
        id="test-input"
        placeholder="Test Placeholder"
      />
    )

    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('does not display validation error when none exists', () => {
    render(
      <Input
        name="testInput"
        label="Test Label"
        type="text"
        id="test-input"
        placeholder="Test Placeholder"
      />
    )

    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
  })

  it('calls the register method with correct arguments', () => {
    const validation = { required: 'This field is required' }
    render(
      <Input
        name="testInput"
        label="Test Label"
        type="text"
        id="test-input"
        placeholder="Test Placeholder"
        validation={validation}
      />
    )

    expect(mockRegister).toHaveBeenCalledWith('testInput', validation)
  })
})