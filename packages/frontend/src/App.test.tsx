import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('AI Workflow Assistant')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<App />);
    expect(
      screen.getByText('Describe your clinical need to find the perfect AI solution')
    ).toBeInTheDocument();
  });
});