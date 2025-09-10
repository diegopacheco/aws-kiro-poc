Bug 05: start.sh has a new issue, when I run I got this:

❯ ./start.sh
[ERROR] Docker is not running. Please start Docker and try again.
❯ docker ps
CONTAINER ID  IMAGE                                    COMMAND     CREATED         STATUS         PORTS       NAMES
9b03abc3beb0  docker.io/moby/buildkit:buildx-stable-1              12 seconds ago  Up 12 seconds              buildx_buildkit_default
❯ ./start.sh
[SUCCESS] Docker/Podman is running
[SUCCESS] Docker Compose is available (docker-compose)
[INFO] Creating necessary directories...
[SUCCESS] Directories created
[INFO] Starting coaching application stack in development mode...
WARN[0000] /Users/diegopacheco/Documents/git/diegopacheco/aws-kiro-poc/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
[+] Running 3/3
 ✔ Container coaching-app-db        Healthy                                                                             0.7s
 ✘ Container coaching-app-backend   Error                                                                               1.3s
 ✔ Container coaching-app-frontend  Recreated                                                                           0.0s
dependency failed to start: container coaching-app-backend exited (1)

pls fix it.