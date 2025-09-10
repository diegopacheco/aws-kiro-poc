# Infrastructure Design Document

## Overview

The coaching application infrastructure will use Docker and Docker Compose to orchestrate a three-tier architecture consisting of a React frontend, Go backend API, and MySQL database. The design emphasizes developer experience, data persistence, and production readiness while maintaining simplicity and reliability.

## Architecture

### Service Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React/Bun)   │◄──►│   (Go/Gin)      │◄──►│   (MySQL 9)     │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Container Strategy
- **Frontend Container**: Multi-stage build with Bun for package management and development server
- **Backend Container**: Multi-stage build with Go for compilation and lightweight runtime
- **Database Container**: Official MySQL 9 image with custom initialization scripts
- **Orchestration**: Docker Compose for service coordination and networking

## Components and Interfaces

### Docker Compose Configuration
**File**: `docker-compose.yml` (root level)
- Defines three services: frontend, backend, database
- Establishes service dependencies and startup order
- Configures networking between services
- Maps volumes for data persistence and development

### Frontend Dockerfile
**File**: `frontend/Dockerfile`
- Multi-stage build: development and production stages
- Uses Bun as package manager and build tool
- Exposes port 3000 for development server
- Supports hot reloading for development workflow

### Backend Dockerfile
**File**: `backend/Dockerfile`
- Multi-stage build: build stage with Go toolchain, runtime stage with minimal image
- Compiles Go application with proper dependencies
- Exposes port 8080 for API server
- Includes health check endpoint

### Database Schema and Initialization
**Directory**: `db/`
- `schema.sql`: Complete database schema with all tables and relationships
- `mysql_data/`: Local directory for persistent data storage (gitignored)
- Initialization scripts executed on first container startup

### Management Scripts
**File**: `start.sh` (root level)
- Single command to start entire stack
- Handles Docker Compose orchestration
- Provides feedback on service status

## Data Models

### Database Schema Structure
```sql
-- Teams table
CREATE TABLE teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members table
CREATE TABLE team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    picture_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Assignments (many-to-many)
CREATE TABLE team_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    team_member_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (team_member_id) REFERENCES team_members(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (team_id, team_member_id)
);

-- Feedback table
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    target_type ENUM('team', 'team_member') NOT NULL,
    target_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_target (target_type, target_id)
);
```

### Volume Mapping Strategy
- **Database Data**: `./db/mysql_data:/var/lib/mysql`
- **Frontend Source**: `./frontend:/app` (development only)
- **Backend Source**: `./backend:/app` (development only)

## Error Handling

### Container Health Checks
- Backend: HTTP health check endpoint at `/health`
- Database: MySQL connection validation
- Frontend: Process and port availability check

### Startup Dependencies
- Database must be ready before backend starts
- Backend must be healthy before frontend connects
- Proper wait conditions and retry logic

### Data Persistence Failures
- Graceful handling of volume mount issues
- Database initialization error recovery
- Backup and restore procedures for data directory

## Testing Strategy

### Infrastructure Testing
- Docker Compose validation and syntax checking
- Container build verification for all services
- Service connectivity and communication testing
- Volume persistence validation across restarts

### Integration Testing
- End-to-end workflow testing with all services running
- API connectivity between frontend and backend
- Database operations and data integrity
- Performance testing under Docker environment

### Development Workflow Testing
- Hot reload functionality for frontend development
- Backend rebuild and restart procedures
- Database schema migration testing
- Environment variable configuration validation