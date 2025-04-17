import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('Homepage', () => {
  it('renders the Components', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', { name: /AI Pal/i });

    expect(heading).toBeInTheDocument();
  });
});
