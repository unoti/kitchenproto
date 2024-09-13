import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const kitchenTitle = screen.getByText(/Kitchen/i);
  expect(kitchenTitle).toBeInTheDocument();
});
