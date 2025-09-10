-- Coaching Application Database Schema
-- MySQL 9 compatible schema with all necessary tables and relationships

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS coaching_app;
USE coaching_app;

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    picture_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Team Assignments (many-to-many relationship)
CREATE TABLE IF NOT EXISTS team_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    team_member_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (team_member_id) REFERENCES team_members(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (team_id, team_member_id)
);

-- Feedback table with polymorphic target relationship
CREATE TABLE IF NOT EXISTS feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    target_type ENUM('team', 'member') NOT NULL,
    target_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_target (target_type, target_id),
    INDEX idx_created_at (created_at)
);

-- Create indexes for better performance
CREATE INDEX idx_teams_name ON teams(name);
CREATE INDEX idx_team_members_email ON team_members(email);
CREATE INDEX idx_team_members_name ON team_members(name);
CREATE INDEX idx_team_assignments_team_id ON team_assignments(team_id);
CREATE INDEX idx_team_assignments_member_id ON team_assignments(team_member_id);

-- Insert some sample data for development (optional)
INSERT IGNORE INTO teams (name, logo_url) VALUES 
('Development Team', 'https://example.com/dev-logo.png'),
('Design Team', 'https://example.com/design-logo.png');

INSERT IGNORE INTO team_members (name, email, picture_url) VALUES 
('John Doe', 'john.doe@example.com', 'https://example.com/john.jpg'),
('Jane Smith', 'jane.smith@example.com', 'https://example.com/jane.jpg'),
('Bob Johnson', 'bob.johnson@example.com', 'https://example.com/bob.jpg');

-- Sample team assignments
INSERT IGNORE INTO team_assignments (team_id, team_member_id) VALUES 
(1, 1), (1, 2), (2, 2), (2, 3);

-- Sample feedback (removed to avoid confusion with mock data)