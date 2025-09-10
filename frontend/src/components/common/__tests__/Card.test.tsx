import { render, screen } from '../../../test/utils';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(
      <Card title="Test Card">
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByRole('heading', { name: 'Test Card' })).toBeInTheDocument();
  });

  it('does not display title when not provided', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies default styling', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    const card = screen.getByText('Card content').parentElement;
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6');
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <p>Card content</p>
      </Card>
    );
    const card = screen.getByText('Card content').parentElement;
    expect(card).toHaveClass('custom-class');
  });

  it('combines default and custom classes', () => {
    render(
      <Card className="custom-class">
        <p>Card content</p>
      </Card>
    );
    const card = screen.getByText('Card content').parentElement;
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6', 'custom-class');
  });
});