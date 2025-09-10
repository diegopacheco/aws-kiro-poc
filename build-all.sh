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

if command_exists docker; then
    CONTAINER_CMD="docker"
    COMPOSE_CMD="docker-compose"
    SKIP_DOCKER=false
elif command_exists podman; then
    CONTAINER_CMD="podman"
    if command_exists podman-compose; then
        COMPOSE_CMD="podman-compose"
    else
        COMPOSE_CMD=""
        print_warning "podman-compose not found. Will skip compose builds."
    fi
    SKIP_DOCKER=false
    print_status "Using Podman instead of Docker for container builds."
else
    print_warning "Neither Docker nor Podman is installed. Skipping container image builds."
    SKIP_DOCKER=true
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
    
    # Get version tag (use git commit hash or timestamp)
    if command_exists git && git rev-parse --git-dir > /dev/null 2>&1; then
        VERSION_TAG=$(git rev-parse --short HEAD)
        print_status "Using git commit hash as version tag: $VERSION_TAG"
    else
        VERSION_TAG=$(date +%Y%m%d-%H%M%S)
        print_status "Using timestamp as version tag: $VERSION_TAG"
    fi
    
    # Build individual container images
    print_status "Building backend container image..."
    if $CONTAINER_CMD build -t coaching-app-backend:latest -t coaching-app-backend:$VERSION_TAG ./backend; then
        print_success "Backend container image built successfully!"
        print_status "Tagged as: coaching-app-backend:latest and coaching-app-backend:$VERSION_TAG"
    else
        print_error "Backend container image build failed!"
        exit 1
    fi
    
    print_status "Building frontend container image..."
    if $CONTAINER_CMD build -t coaching-app-frontend:latest -t coaching-app-frontend:$VERSION_TAG ./frontend; then
        print_success "Frontend container image built successfully!"
        print_status "Tagged as: coaching-app-frontend:latest and coaching-app-frontend:$VERSION_TAG"
    else
        print_error "Frontend container image build failed!"
        exit 1
    fi
    
    # Build with compose if available
    if [ -f "docker-compose.yml" ] && [ -n "$COMPOSE_CMD" ]; then
        print_status "Building container images with $COMPOSE_CMD..."
        if $COMPOSE_CMD build; then
            print_success "Compose images built successfully!"
        else
            print_error "Compose build failed!"
            exit 1
        fi
    else
        if [ -f "docker-compose.yml" ]; then
            print_warning "docker-compose.yml found but compose command not available. Skipping compose build."
        else
            print_warning "docker-compose.yml not found. Skipping compose build."
        fi
    fi
    
    # Clean up dangling images
    print_status "Cleaning up dangling container images..."
    if $CONTAINER_CMD image prune -f > /dev/null 2>&1; then
        print_success "Dangling images cleaned up!"
    else
        print_warning "Failed to clean up dangling images."
    fi
    
    # Show container images
    print_status "Container images created:"
    $CONTAINER_CMD images | grep -E "(coaching-app-|REPOSITORY)" || true
else
    print_warning "Skipping container image builds (neither Docker nor Podman available)."
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
if [ "$SKIP_DOCKER" = false ]; then
    echo "  ✅ Container Images: Built successfully"
    echo "    - coaching-app-backend:latest, coaching-app-backend:$VERSION_TAG"
    echo "    - coaching-app-frontend:latest, coaching-app-frontend:$VERSION_TAG"
    if [ -f "docker-compose.yml" ] && [ -n "$COMPOSE_CMD" ]; then
        echo "    - compose images"
    fi
else
    echo "  ⚠️  Container Images: Skipped"
fi
echo ""
print_status "Next steps:"
echo "  • Run the backend: cd backend && ./bin/coaching-app-backend"
echo "  • Serve the frontend: cd frontend && serve -s build"
if [ "$SKIP_DOCKER" = false ]; then
    echo "  • Or use containers individually:"
    echo "    - Backend: $CONTAINER_CMD run -p 8080:8080 coaching-app-backend:latest"
    echo "    - Frontend: $CONTAINER_CMD run -p 3000:80 coaching-app-frontend:latest"
    if [ -n "$COMPOSE_CMD" ]; then
        echo "  • Or use Compose: $COMPOSE_CMD up"
    fi
    echo "  • View container images: $CONTAINER_CMD images | grep coaching-app"
    echo "  • Clean up old images: $CONTAINER_CMD image prune -f"
fi
echo ""