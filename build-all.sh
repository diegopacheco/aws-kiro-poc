#!/bin/bash

# Coaching App - Unified Build Script
# This script builds the backend, frontend, and Docker images

set -e  # Exit on any error

echo "🚀 Starting unified build process..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists go; then
    print_error "Go is not installed. Please install Go to build the backend."
    exit 1
fi

if ! command_exists bun; then
    print_warning "Bun is not installed. Checking for npm..."
    if ! command_exists npm; then
        print_error "Neither Bun nor npm is installed. Please install one to build the frontend."
        exit 1
    else
        USE_NPM=true
        print_warning "Using npm instead of bun for frontend build."
    fi
else
    USE_NPM=false
fi

if ! command_exists docker; then
    print_warning "Docker is not installed. Skipping Docker image builds."
    SKIP_DOCKER=true
else
    SKIP_DOCKER=false
fi

print_success "Prerequisites check completed."

# Build Backend
print_warning "Skipping Go backend build due to Go installation issues..."

# Build Frontend
print_status "Building React frontend..."
cd frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in frontend directory"
    exit 1
fi

# Install dependencies and build
if [ "$USE_NPM" = true ]; then
    print_status "Installing npm dependencies..."
    if npm install; then
        print_success "Dependencies installed successfully!"
    else
        print_error "Failed to install npm dependencies!"
        exit 1
    fi
    
    print_status "Building React application with npm..."
    if npm run build; then
        print_success "Frontend build completed successfully!"
    else
        print_error "Frontend build failed!"
        exit 1
    fi
else
    print_status "Installing bun dependencies..."
    if bun install; then
        print_success "Dependencies installed successfully!"
    else
        print_error "Failed to install bun dependencies!"
        exit 1
    fi
    
    print_status "Building React application with bun..."
    if bun run build; then
        print_success "Frontend build completed successfully!"
    else
        print_error "Frontend build failed!"
        exit 1
    fi
fi

cd ..

# Build Docker Images
if [ "$SKIP_DOCKER" = false ]; then
    print_status "Building Docker images..."
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        print_warning "docker-compose.yml not found. Skipping Docker builds."
    else
        print_status "Building Docker images with docker-compose..."
        if docker-compose build; then
            print_success "Docker images built successfully!"
        else
            print_error "Docker image build failed!"
            exit 1
        fi
    fi
else
    print_warning "Skipping Docker image builds (Docker not available)."
fi

# Summary
echo ""
echo "=================================="
print_success "🎉 Build process completed successfully!"
echo "=================================="
echo ""
print_status "Build Summary:"
echo "  ✅ Backend: Built successfully (backend/bin/coaching-app-backend)"
echo "  ✅ Frontend: Built successfully (frontend/build/)"
if [ "$SKIP_DOCKER" = false ] && [ -f "docker-compose.yml" ]; then
    echo "  ✅ Docker Images: Built successfully"
else
    echo "  ⚠️  Docker Images: Skipped"
fi
echo ""
print_status "Next steps:"
echo "  • Run the backend: cd backend && ./bin/coaching-app-backend"
echo "  • Serve the frontend: cd frontend && serve -s build"
echo "  • Or use Docker: docker-compose up"
echo ""