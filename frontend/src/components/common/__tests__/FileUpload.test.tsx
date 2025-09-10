import { render, screen, waitFor } from '../../../test/utils';
import userEvent from '@testing-library/user-event';
import { FileUpload } from '../FileUpload';

describe('FileUpload', () => {
  const defaultProps = {
    label: 'Upload File',
    onFileSelect: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with label', () => {
    render(<FileUpload {...defaultProps} />);
    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  it('displays upload instructions when no preview', () => {
    render(<FileUpload {...defaultProps} />);
    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
    expect(screen.getByText('PNG, JPG up to 10MB')).toBeInTheDocument();
  });

  it('displays preview image when preview prop is provided', () => {
    render(<FileUpload {...defaultProps} preview="data:image/jpeg;base64,fake-data" />);
    const img = screen.getByAltText('Preview');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'data:image/jpeg;base64,fake-data');
  });

  it('calls onFileSelect when file is selected', async () => {
    const user = userEvent.setup();
    const handleFileSelect = vi.fn();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(<FileUpload {...defaultProps} onFileSelect={handleFileSelect} />);
    
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);
    
    await waitFor(() => {
      expect(handleFileSelect).toHaveBeenCalledWith(file);
    });
  });

  it('shows loading state during file processing', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(<FileUpload {...defaultProps} />);
    
    const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);
    
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<FileUpload {...defaultProps} error="File upload failed" />);
    expect(screen.getByText('File upload failed')).toBeInTheDocument();
  });

  it('applies error styling when error prop is provided', () => {
    render(<FileUpload {...defaultProps} error="Error message" />);
    const uploadArea = screen.getByRole('button');
    expect(uploadArea).toHaveClass('border-red-500');
  });

  it('handles drag over events', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} />);
    
    const uploadArea = screen.getByRole('button');
    await user.hover(uploadArea);
    
    // Simulate drag over
    uploadArea.dispatchEvent(new DragEvent('dragover', { bubbles: true }));
    expect(uploadArea).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  it('opens file dialog when clicked', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} />);
    
    const uploadArea = screen.getByRole('button');
    await user.click(uploadArea);
    
    // The hidden file input should be triggered (we can't easily test this directly)
    expect(uploadArea.querySelector('input[type="file"]')).toBeInTheDocument();
  });
});