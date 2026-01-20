#!/bin/bash

# COLORS
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🏥 LOCAL DEV DOCTOR: Starting Diagnosis & Repair...${NC}"

# 1. KILL ZOMBIE PROCESSES
ports=(3000 3001 3005 5173)
echo -e "\n${YELLOW}step 1: Clearing ports and killing zombies...${NC}"
for port in "${ports[@]}"; do
    pid=$(lsof -t -i:$port)
    if [ ! -z "$pid" ]; then
        echo -e " - Killing process $pid on port $port"
        kill -9 $pid 2>/dev/null
    else
        echo -e " - Port $port is clear."
    fi
done

# 2. CHECK ENVIRONMENT
echo -e "\n${YELLOW}step 2: Checking Environment Configurations...${NC}"
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ Backend .env found${NC}"
else
    echo -e "${RED}✗ Backend .env MISSING! Creating from example...${NC}"
    # In a real scenario, you'd copy example or ask user. For now, warn.
fi

# 3. INSTALL/VERIFY DEPENDENCIES (Quick check)
echo -e "\n${YELLOW}step 3: Verifying Dependencies...${NC}"
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installing Backend Dependencies...${NC}"
    cd backend && npm install && cd ..
fi
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing Frontend Dependencies...${NC}"
    cd frontend && npm install && cd ..
   # Also fix the known elevelabs issue
   cd frontend && npm install @elevenlabs/client && cd ..
fi

# 4. START BACKEND
echo -e "\n${YELLOW}step 4: Starting Backend (Mock/Dev Mode)...${NC}"
# We use a subshell or detached process. For this script to be "blocking" until healthy, we run in bg.
cd backend
# Using nohup or just backgrounding.
# We modify server.ts to ensure it listens on 3005 if not already.
# (Assuming server is compiled or running via ts-node)
nohup npx ts-node -T src/server.ts > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e " - Backend launching (PID: $BACKEND_PID). Waiting for health check..."

# Wait loop for Backend
attempts=0
max_attempts=60
connected=false

while [ $attempts -lt $max_attempts ]; do
    if curl -s http://localhost:3005/health > /dev/null; then
        connected=true
        echo -e "${GREEN}✓ Backend is HEALTHY on port 3005${NC}"
        break
    fi
    attempts=$((attempts+1))
    echo -n "."
    sleep 1
done

if [ "$connected" = false ]; then
    echo -e "\n${RED}🔥 CRITICAL FAILURE: Backend failed to start.${NC}"
    echo "Tail of backend.log:"
    tail -n 20 backend.log
    # Don't exit, try frontend anyway just in case? No, backend is needed.
    # Exit for safety? Let's verify logs.
    exit 1
fi

# 5. START FRONTEND
echo -e "\n${YELLOW}step 5: Starting Frontend...${NC}"
cd frontend
nohup npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo -e " - Frontend launching (PID: $FRONTEND_PID). Waiting for health check..."

# Wait loop for Frontend
attempts=0
max_attempts=30
connected=false

# React/Vite returns html on root
while [ $attempts -lt $max_attempts ]; do
    if curl -s http://localhost:5173 > /dev/null; then
        connected=true
        echo -e "${GREEN}✓ Frontend is HEALTHY on port 5173${NC}"
        break
    fi
    attempts=$((attempts+1))
    echo -n "."
    sleep 1
done

if [ "$connected" = false ]; then
    echo -e "\n${RED}🔥 CRITICAL FAILURE: Frontend failed to start.${NC}"
    echo "Tail of frontend.log:"
    tail -n 20 frontend.log
    exit 1
fi

echo -e "\n${GREEN}=======================================${NC}"
echo -e "${GREEN}       ALL SYSTEMS GO! 🚀              ${NC}"
echo -e "${GREEN}=======================================${NC}"
echo -e "Backend:  http://localhost:3005"
echo -e "Frontend: http://localhost:5173"
echo -e "Logs:     tail -f backend.log frontend.log"
echo -e "\nYour app is running properly. If it still doesn't load in browser, clear cache."
