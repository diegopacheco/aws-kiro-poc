import { render, screen, waitFor } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { TeamMemberForm } from '../TeamMemberForm';

describe('TeamMemberForm', () => {
  const defaultProps = {
    onSubmit: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<TeamMemberForm {...defaultProps} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/profile picture/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add team member/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    
    render(<TeamMemberForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      picture: undefined
    });
  });

  it('submits form with picture data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(<TeamMemberForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    // Upload file
    const fileInput = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });
    
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'data:image/jpeg;base64,fake-image-data'
    });
  });

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    
    render(<TeamMemberForm onSubmit={handleSubmit} />);
    
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    
    render(<TeamMemberForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    
    render(<TeamMemberForm onSubmit={handleSubmit} />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    expect(handleSubmit).toHaveBeenCalled();
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
  });

  it('prevents form submission when validation fails', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    
    render(<TeamMemberForm onSubmit={handleSubmit} />);
    
    // Only fill name, leave email empty
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('handles file removal', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(<TeamMemberForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    // Upload file
    const fileInput = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });
    
    // Clear file input (simulating file removal)
    await user.clear(fileInput);
    
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      picture: undefined
    });
  });
});