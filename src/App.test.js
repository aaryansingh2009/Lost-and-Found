import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the homepage content', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /homepage/i })).toBeInTheDocument();
});
