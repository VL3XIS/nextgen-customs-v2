---
name: Local Dev Doctor
description: A world-class diagnostic and repair agent for the local development environment.
---

# Local Dev Doctor

This skill contains the protocols and scripts to autonomously diagnose, fix, and launch the local development environment. It is designed to be the "one-stop-shop" when the app wouldn't load or ports are blocked.

## 🛠 Capabilities

1.  **Zombie Killer**: Automatically identifies and kills stale processes holding onto ports 3000, 3001, 3005, and 5173.
2.  **Health Checker**: Verifies backend and frontend health endpoints before declaring success.
3.  **Dependency Validator**: Ensuring `node_modules` are healthy (basic check).
4.  **Configuration Doctor**: Checks for vital `.env` variables.
5.  **Smart Launcher**: Starts services in the correct dependency order (DB -> Backend -> Frontend).

## 🚀 Usage

Run the master script to reboot the environment:

```bash
./scripts/doctor_restart.sh
```

## 📋 Protocols

### When to use
*   "App won't load."
*   "Localhost refused connection."
*   "Port already in use" errors.
*   After switching branches or major configurations.

### Diagnosis Steps
1.  Check Process list (`lsof -i :PORT`).
2.  Check Logs (`tail` recent logs).
3.  Check Env (`ls -l .env`).
4.  Check Connectivity (`curl localhost:PORT`).
