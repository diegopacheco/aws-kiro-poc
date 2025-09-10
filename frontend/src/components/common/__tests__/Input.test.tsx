import { render, screen } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  const defaultProps = {
    label: 'Test Label',
    value: '',
    onChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with label', () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(<Input {...defaultProps} value="test value" />);
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<Input {...defaultProps} onChange={handleChange} />);
    
    const input = screen.getByLabelText('Test Label');
    await user.type(input, 'hello');
    
    expect(handleChange).toHaveBeenCalledTimes(5);
    expect(handleChange).toHaveBeenLastCalledWith('hello');
  });

  it('shows required asterisk when required', () => {
    render(<Input {...defaultProps} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(<Input {...defaultProps} placeholder="Enter text here" />);
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input {...defaultProps} error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error prop is provided', () => {
    render(<Input {...defaultProps} error="Error message" />);
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-red-500');
  });

  it('applies normal styling when no error', () => {
    render(<Input {...defaultProps} />);
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-gray-300');
  });

  it('sets correct input type', () => {
    render(<Input {...defaultProps} type="email" />);
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('sets required attribute when required prop is true', () => {
    render(<Input {...defaultProps} required />);
    const input = screen.getByLabelText('Test Label');
    expect(input).toBeRequired();
  });
});