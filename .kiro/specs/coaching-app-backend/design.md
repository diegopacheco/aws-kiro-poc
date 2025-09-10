# Design Document

## Overview

The coaching application backend is a REST API service built with Go and the Gin web framework, using MySQL as the database. The system provides endpoints for managing team members, teams, team assignments, and feedback. The architecture follows clean separation of concerns with handlers, services, models, and database layers.

## Architecture

The backend follows a layered architecture pattern:

```
backend/
├── main.go                 # Application entry point
├── models/                 # Data models and database schemas
├── handlers/               # HTTP request handlers
├── services/               # Business logic layer
├── database/               # Database connection and utilities
├── middleware/             # HTTP middleware (CORS, etc.)
├── go.mod                  # Go module dependencies
├── go.sum                  # Dependency checksums
├── build.sh                # Build script
└── run.sh                  # Run script
```

### Technology Stack
- **Framework**: Gin Gonic (latest version)
- **Database**: MySQL 8.0+
- **Language**: Go (latest stable version)
- **Database Driver**: go-sql-driver/mysql

## Components and Interfaces

### Models
The system defines four core data models:

**TeamMember Model**
```go
type TeamMember struct {
    ID      uint   `json:"id" gorm:"primaryKey"`
    Name    string `json:"name" gorm:"not null"`
    Picture string `json:"picture"`
    Email   string `json:"email" gorm:"not null;unique"`
}
```

**Team Model**
```go
type Team struct {
    ID       uint   `json:"id" gorm:"primaryKey"`
    Name     string `json:"name" gorm:"not null"`
    Logo     string `json:"logo"`
    Members  []TeamMember `json:"members" gorm:"many2many:team_assignments;"`
}
```

**TeamAssignment Model**
```go
type TeamAssignment struct {
    TeamID       uint `json:"team_id"`
    TeamMemberID uint `json:"team_member_id"`
}
```

**Feedback Model**
```go
type Feedback struct {
    ID           uint      `json:"id" gorm:"primaryKey"`
    Content      string    `json:"content" gorm:"not null"`
    TargetType   string    `json:"target_type" gorm:"not null"` // "team" or "member"
    TargetID     uint      `json:"target_id" gorm:"not null"`
    CreatedAt    time.Time `json:"created_at"`
}
```

### REST API Endpoints

**Team Members**
- `GET /api/team-members` - List all team members
- `POST /api/team-members` - Create a new team member
- `GET /api/team-members/:id` - Get specific team member

**Teams**
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id` - Get specific team with members

**Team Assignments**
- `POST /api/assignments` - Assign team member to team
- `GET /api/assignments` - Get all team assignments
- `DELETE /api/assignments` - Remove team member from team

**Feedback**
- `GET /api/feedback` - List feedback (with optional filters)
- `POST /api/feedback` - Create new feedback
- `GET /api/feedback/team/:id` - Get feedback for specific team
- `GET /api/feedback/member/:id` - Get feedback for specific team member

### Handlers Layer
Each resource has a dedicated handler with CRUD operations:
- `TeamMemberHandler` - Handles team member operations
- `TeamHandler` - Handles team operations
- `AssignmentHandler` - Handles team assignment operations
- `FeedbackHandler` - Handles feedback operations

### Services Layer
Business logic is encapsulated in service structs:
- `TeamMemberService` - Team member business logic
- `TeamService` - Team business logic
- `AssignmentService` - Assignment business logic
- `FeedbackService` - Feedback business logic

### Database Layer
- `Database` struct manages MySQL connection
- GORM ORM for database operations
- Connection pooling and error handling
- Automatic table creation and migrations

## Data Models

### Database Schema

**team_members table**
- id (PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(255), NOT NULL)
- picture (TEXT)
- email (VARCHAR(255), NOT NULL, UNIQUE)

**teams table**
- id (PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(255), NOT NULL)
- logo (TEXT)

**team_assignments table**
- team_id (FOREIGN KEY to teams.id)
- team_member_id (FOREIGN KEY to team_members.id)
- PRIMARY KEY (team_id, team_member_id)

**feedback table**
- id (PRIMARY KEY, AUTO_INCREMENT)
- content (TEXT, NOT NULL)
- target_type (ENUM('team', 'member'), NOT NULL)
- target_id (INT, NOT NULL)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### Relationships
- Teams have many TeamMembers through TeamAssignments (many-to-many)
- Feedback belongs to either a Team or TeamMember (polymorphic association)

## Error Handling

### HTTP Status Codes
- 200: Successful GET requests
- 201: Successful POST requests (resource created)
- 400: Bad request (validation errors)
- 404: Resource not found
- 500: Internal server error

### Error Response Format
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

### Validation
- Required field validation using struct tags
- Email format validation
- Foreign key constraint validation
- Duplicate prevention for unique fields

## Testing Strategy

### Unit Tests
- Model validation tests
- Service layer business logic tests
- Handler input/output tests
- Database operation tests

### Integration Tests
- End-to-end API endpoint tests
- Database integration tests
- CORS functionality tests

### Test Structure
```
backend/
├── models/
│   └── models_test.go
├── handlers/
│   └── handlers_test.go
├── services/
│   └── services_test.go
└── database/
    └── database_test.go
```

### Test Database
- Use separate test database configuration
- Automated test data setup and teardown
- Mock database for unit tests where appropriate

## Configuration and Deployment

### Environment Variables
- `DB_HOST`: MySQL host (default: localhost)
- `DB_PORT`: MySQL port (default: 3306)
- `DB_USER`: MySQL username
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name
- `SERVER_PORT`: API server port (default: 8080)

### Build and Run Scripts

**build.sh**
- Install Go dependencies
- Run go fmt for code formatting
- Build the application binary
- Validate build success

**run.sh**
- Set default environment variables
- Start the MySQL connection
- Run database migrations
- Start the Gin server

### CORS Configuration
- Allow frontend origin (http://localhost:3000)
- Support common HTTP methods (GET, POST, PUT, DELETE)
- Allow common headers (Content-Type, Authorization)

## Performance Considerations

### Database Optimization
- Proper indexing on frequently queried fields
- Connection pooling for database connections
- Prepared statements for repeated queries

### API Optimization
- JSON response caching where appropriate
- Pagination for list endpoints
- Efficient query patterns to avoid N+1 problems

### Resource Management
- Proper connection cleanup
- Memory-efficient data structures
- Graceful shutdown handling