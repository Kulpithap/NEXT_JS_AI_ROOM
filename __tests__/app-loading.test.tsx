import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import AppLoading from '../src/app/(front)/components/app-loading'

test('AppLoading renders a loading indicator', () => {
  render(<AppLoading />)
  expect(screen.getByRole('status', { name: 'Loading' })).toBeDefined()
})
