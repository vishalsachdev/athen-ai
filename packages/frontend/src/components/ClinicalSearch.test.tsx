import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClinicalSearch } from './ClinicalSearch';
import { describe, it, expect } from 'vitest';

describe('ClinicalSearch Component', () => {
  it('renders the search input', () => {
    render(<ClinicalSearch />);
    expect(screen.getByPlaceholderText(/Describe patient symptoms/i)).toBeInTheDocument();
  });

  it('displays promptions when keyword is typed', async () => {
    render(<ClinicalSearch />);
    const input = screen.getByPlaceholderText(/Describe patient symptoms/i);
    
    fireEvent.change(input, { target: { value: 'severe headache' } });

    // Expect context selectors to appear
    await waitFor(() => {
      expect(screen.getByText('Thunderclap onset')).toBeInTheDocument();
    });
  });

  it('updates analysis when option is selected', async () => {
    render(<ClinicalSearch />);
    const input = screen.getByPlaceholderText(/Describe patient symptoms/i);
    
    fireEvent.change(input, { target: { value: 'severe headache' } });

    await waitFor(() => {
      expect(screen.getByText('Thunderclap onset')).toBeInTheDocument();
    });

    const checkboxLabel = screen.getByText('Thunderclap onset');
    fireEvent.click(checkboxLabel);

    await waitFor(() => {
      expect(screen.getByText(/Immediate CT indicated/i)).toBeInTheDocument();
    });
  });
});
