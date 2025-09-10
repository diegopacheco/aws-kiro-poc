# Frontend Testing Guide

This document describes the testing setup and practices for the coaching application frontend.

## Testing Stack

- **Test Runner**: Vitest
- **Testing Library**: React Testing Library
- **Mocking**: Vitest built-in mocks
- **Coverage**: V8 coverage provider
- **Environment**: jsdom

## Test Structure

```
src/
├── test/
│   ├── setup.ts              # Test configuration and global mocks
│   ├── utils.tsx              # Custom render utilities
│   ├── fixtures.ts            # Test data fixtures
│   └── integration/           # Integration tests
├── components/
│   ├── common/__tests__/      # Common component tests
│   ├── forms/__tests__/       # Form component tests
│   └── pages/__tests__/       # Page component tests
├── hooks/__tests__/           # Custom hook tests
└── utils/__tests__/           # Utility function tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test --watch

# Run tests with UI
bun run test:ui

# Run tests with coverage
bun run test:coverage

# Run specific test file
bun run test Button.test.tsx

# Run tests matching pattern
bun run test --grep "validation"
```

### Using the Test Runner Script

```bash
# Run complete test suite with setup
node test-runner.js
```

## Test Categories

### Unit Tests

**Common Components** (`src/components/common/__tests__/`)

- Button component with variants and interactions
- Input component with validation and error states
- FileUpload component with drag/drop and preview
- Card component with title and styling

**Form Components** (`src/components/forms/__tests__/`)

- TeamMemberForm with validation and file upload
- Form submission and error handling
- Field clearing after successful submission

**Page Components** (`src/components/pages/__tests__/`)

- HomePage navigation and layout
- Responsive design and accessibility

**Custom Hooks** (`src/hooks/__tests__/`)

- useTeamMembers CRUD operations
- useTeams CRUD operations
- useFeedback with recipient filtering
- localStorage integration

**Utilities** (`src/utils/__tests__/`)

- Validation functions (email, required fields)
- Storage utilities (load, save, error handling)
- ID generation

### Integration Tests

**User Workflows** (`src/test/integration/`)

- Complete team member creation workflow
- Form validation error handling
- File upload integration
- Storage persistence

## Test Utilities

### Custom Render

```typescript
import { render, screen } from '../test/utils';

// Automatically wraps components with Router and other providers
render(<MyComponent />);
```

### Fixtures

```typescript
import { mockTeamMember, mockAppState } from '../test/fixtures';

// Use predefined test data
const member = mockTeamMember;
```

### Mocking

```typescript
// Mock localStorage
vi.mock('../../utils/storage', () => ({
  loadFromStorage: vi.fn(),
  saveToStorage: vi.fn(),
  generateId: vi.fn()
}));

// Mock FileReader (already set up in setup.ts)
// Mock timers for date-dependent tests
vi.useFakeTimers();
vi.setSystemTime(new Date('2024-01-01'));
```

## Best Practices

### Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow the Arrange-Act-Assert pattern

### Component Testing

- Test user interactions, not implementation details
- Use `screen.getByRole()` and `screen.getByLabelText()` for accessibility
- Test error states and edge cases
- Verify form submissions and data flow

### Hook Testing

- Use `renderHook` from React Testing Library
- Test state changes with `act()`
- Mock external dependencies (storage, APIs)
- Test error handling and edge cases

### Integration Testing

- Test complete user workflows
- Verify data persistence and state management
- Test error recovery and validation flows
- Use realistic user interactions

### Mocking Strategy

- Mock external dependencies (localStorage, FileReader)
- Mock utility functions for isolated testing
- Use fixtures for consistent test data
- Reset mocks between tests

## Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## Debugging Tests

### Common Issues

1. **Component not found**: Check if component is properly exported and imported
2. **Async operations**: Use `waitFor()` for async state changes
3. **File uploads**: Ensure FileReader mock is properly configured
4. **Router errors**: Use custom render with Router wrapper

### Debug Commands

```bash
# Run single test with verbose output
bun run test Button.test.tsx --reporter=verbose

# Debug specific test
bun run test --grep "specific test name" --reporter=verbose

# Run tests with browser debugging
bun run test:ui
```

## Continuous Integration

The test suite is designed to run in CI environments:

- All dependencies are locked with exact versions
- Tests use deterministic mocks and fixtures
- Coverage thresholds are enforced
- Tests run in headless jsdom environment

## Adding New Tests

1. Create test file next to the component/utility being tested
2. Use appropriate test utilities and fixtures
3. Follow existing naming conventions
4. Add integration tests for new user workflows
5. Update coverage thresholds if needed

## Performance

- Tests run in parallel by default
- Use `vi.mock()` for expensive operations
- Avoid unnecessary DOM queries
- Clean up after tests (automatic with setup.ts)
