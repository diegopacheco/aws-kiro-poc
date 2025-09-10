import { render, screen } from '../../../test/utils';
import { HomePage } from '../HomePage';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: 'Coaching Application' })).toBeInTheDocument();
  });

  it('renders all navigation cards', () => {
    render(<HomePage />);
    
    expect(screen.getByRole('heading', { name: 'Add Team Member' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Create Team' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Assign to Team' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Give Feedback' })).toBeInTheDocument();
  });

  it('renders navigation descriptions', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Add new team members with their details')).toBeInTheDocument();
    expect(screen.getByText('Create new teams with names and logos')).toBeInTheDocument();
    expect(screen.getByText('Assign team members to teams')).toBeInTheDocument();
    expect(screen.getByText('Provide feedback to teams or individuals')).toBeInTheDocument();
  });

  it('renders navigation links with correct paths', () => {
    render(<HomePage />);
    
    expect(screen.getByRole('link', { name: /add team member/i })).toHaveAttribute('href', '/add-member');
    expect(screen.getByRole('link', { name: /create team/i })).toHaveAttribute('href', '/create-team');
    expect(screen.getByRole('link', { name: /assign to team/i })).toHaveAttribute('href', '/assign-team');
    expect(screen.getByRole('link', { name: /give feedback/i })).toHaveAttribute('href', '/give-feedback');
  });

  it('applies hover styles to navigation cards', () => {
    render(<HomePage />);
    
    const cards = screen.getAllByRole('link');
    cards.forEach(card => {
      expect(card.firstChild).toHaveClass('hover:shadow-lg', 'transition-shadow', 'cursor-pointer');
    });
  });

  it('uses responsive grid layout', () => {
    render(<HomePage />);
    
    const gridContainer = screen.getByRole('heading', { name: 'Add Team Member' }).closest('.grid');
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-6');
  });
});