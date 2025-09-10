#!/bin/bash

# Coaching App Docker Stack Startup Script
# This script starts the complete coaching application stack using Docker Compose

set -e  # Exit on any error

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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose > /dev/null 2>&1 && ! docker compose version > /dev/null 2>&1; then
        print_error "Docker Compose is not available. Please install Docker Compose and try again."
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p db/mysql_data
    print_success "Directories created"
}

# Function to start the stack
start_stack() {
    local mode=${1:-development}
    
    print_status "Starting coaching application stack in $mode mode..."
    
    if [ "$mode" = "production" ]; then
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    else
        docker-compose up -d
    fi
    
    print_success "Stack started successfully!"
}

# Function to show service status
show_status() {
    print_status "Checking service status..."
    docker-compose ps
    
    echo ""
    print_status "Service URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8080"
    echo "  Backend Health: http://localhost:8080/health"
    echo "  Database: localhost:3306"
}

# Function to wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep -q "healthy"; then
            local healthy_count=$(docker-compose ps | grep -c "healthy" || true)
            local total_services=3
            
            if [ "$healthy_count" -eq "$total_services" ]; then
                print_success "All services are healthy!"
                return 0
            fi
        fi
        
        print_status "Attempt $attempt/$max_attempts - Waiting for services to be healthy..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    print_warning "Some services may not be fully healthy yet. Check 'docker-compose logs' for details."
}

# Function to show logs
show_logs() {
    print_status "Showing recent logs..."
    docker-compose logs --tail=50
}

# Function to stop the stack
stop_stack() {
    print_status "Stopping coaching application stack..."
    docker-compose down
    print_success "Stack stopped successfully!"
}

# Function to clean up (stop and remove volumes)
cleanup() {
    print_warning "This will stop all services and remove all data. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up coaching application stack..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Main script logic
case "${1:-start}" in
    start)
        check_docker
        check_docker_compose
        create_directories
        start_stack development
        wait_for_services
        show_status
        ;;
    prod|production)
        check_docker
        check_docker_compose
        create_directories
        start_stack production
        wait_for_services
        show_status
        ;;
    stop)
        stop_stack
        ;;
    restart)
        stop_stack
        sleep 2
        check_docker
        check_docker_compose
        start_stack development
        wait_for_services
        show_status
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        echo "Coaching App Docker Stack Management"
        echo ""
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  start       Start the stack in development mode (default)"
        echo "  prod        Start the stack in production mode"
        echo "  stop        Stop the stack"
        echo "  restart     Restart the stack"
        echo "  status      Show service status and URLs"
        echo "  logs        Show recent logs from all services"
        echo "  cleanup     Stop stack and remove all data (destructive)"
        echo "  help        Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                    # Start in development mode"
        echo "  $0 start              # Start in development mode"
        echo "  $0 prod               # Start in production mode"
        echo "  $0 stop               # Stop all services"
        echo "  $0 logs               # View logs"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information."
        exit 1
        ;;
esac