import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Athen Clinical Intelligence')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<App />);
    expect(
      screen.getByText('Context-aware decision support with dynamic prompting')
    ).toBeInTheDocument();
  });
});
