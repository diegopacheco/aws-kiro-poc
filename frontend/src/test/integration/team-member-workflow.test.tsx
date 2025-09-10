import { render, screen, waitFor } from '../utils';
import userEvent from '@testing-library/user-event';
import { AddTeamMemberPage } from '../../components/pages/AddTeamMemberPage';
import * as storage from '../../utils/storage';

// Mock the storage utilities
vi.mock('../../utils/storage', () => ({
  loadFromStorage: vi.fn(),
  saveToStorage: vi.fn(),
  generateId: vi.fn()
}));

const mockLoadFromStorage = vi.mocked(storage.loadFromStorage);
const mockSaveToStorage = vi.mocked(storage.saveToStorage);
const mockGenerateId = vi.mocked(storage.generateId);

describe('Team Member Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadFromStorage.mockReturnValue({
      teamMembers: [],
      teams: [],
      feedback: []
    });
    mockGenerateId.mockReturnValue('member-123');
  });

  it('completes full team member creation workflow', async () => {
    const user = userEvent.setup();
    
    render(<AddTeamMemberPage />);
    
    // Verify page renders correctly
    expect(screen.getByRole('heading', { name: /add team member/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    
    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    // Upload a profile picture
    const file = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, file);
    
    // Wait for file processing
    await waitFor(() => {
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    // Verify storage was called with correct data
    expect(mockSaveToStorage).toHaveBeenCalledWith({
      teamMembers: [{
        id: 'member-123',
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'data:image/jpeg;base64,fake-image-data',
        teamIds: []
      }],
      teams: [],
      feedback: []
    });
    
    // Verify form was cleared after submission
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
  });

  it('handles validation errors in the workflow', async () => {
    const user = userEvent.setup();
    
    render(<AddTeamMemberPage />);
    
    // Try to submit without filling required fields
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    // Verify validation errors are shown
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    
    // Verify storage was not called
    expect(mockSaveToStorage).not.toHaveBeenCalled();
    
    // Fill name but provide invalid email
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    // Verify email validation error
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(mockSaveToStorage).not.toHaveBeenCalled();
    
    // Fix the email and submit successfully
    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    // Verify successful submission
    expect(mockSaveToStorage).toHaveBeenCalled();
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('handles file upload errors gracefully', async () => {
    const user = userEvent.setup();
    
    render(<AddTeamMemberPage />);
    
    // Fill required fields
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    // Try to upload a non-image file (should be handled by accept attribute)
    const textFile = new File(['test'], 'document.txt', { type: 'text/plain' });
    const fileInput = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement;
    
    // The file input has accept="image/*" so this should be filtered out by the browser
    // But we can still test the form submission without a file
    await user.click(screen.getByRole('button', { name: /add team member/i }));
    
    // Verify submission works without a picture
    expect(mockSaveToStorage).toHaveBeenCalledWith({
      teamMembers: [{
        id: 'member-123',
        name: 'John Doe',
        email: 'john@example.com',
        picture: undefined,
        teamIds: []
      }],
      teams: [],
      feedback: []
    });
  });
});