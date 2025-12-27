import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SolutionSearch } from './SolutionSearch';
import { describe, it, expect } from 'vitest';

describe('SolutionSearch Component', () => {
  it('renders the search input', () => {
    render(<SolutionSearch />);
    expect(screen.getByPlaceholderText(/e.g., 'automate patient intake'/i)).toBeInTheDocument();
  });

  it('displays promptions when keyword is typed', async () => {
    render(<SolutionSearch />);
    const input = screen.getByPlaceholderText(/e.g., 'automate patient intake'/i);
    
    fireEvent.change(input, { target: { value: 'patient intake' } });

    // Expect context selectors to appear
    await waitFor(() => {
      expect(screen.getByText('OCR / Scan support')).toBeInTheDocument();
    });
  });

  it('updates analysis when option is selected', async () => {
    render(<SolutionSearch />);
    const input = screen.getByPlaceholderText(/e.g., 'automate patient intake'/i);
    
    fireEvent.change(input, { target: { value: 'patient intake' } });

    await waitFor(() => {
      expect(screen.getByText('OCR / Scan support')).toBeInTheDocument();
    });

    const checkboxLabel = screen.getByText('OCR / Scan support');
    fireEvent.click(checkboxLabel);

    await waitFor(() => {
      expect(screen.getByText(/Extracts text from paper forms/i)).toBeInTheDocument();
    });
  });
});