
import os
import json
import requests
import sys

# Manual .env parser
def load_env_manual(path):
    env_vars = {}
    try:
        with open(path, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value.strip('"').strip("'")
    except Exception as e:
        print(f"Error reading .env: {e}")
    return env_vars

# Locate .env
env_path = os.path.join(os.path.dirname(__file__), '../.env')
env_data = load_env_manual(env_path)

API_KEY = env_data.get('ELEVENLABS_API_KEY')
AGENT_ID = env_data.get('ELEVENLABS_AGENT_ID')

if not API_KEY or not AGENT_ID:
    print("Error: Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID in .env")
    sys.exit(1)

print(f"Syncing Agent Configuration for ID: {AGENT_ID}")

# Read Configuration JSON
config_path = os.path.join(os.path.dirname(__file__), '../../elevenlabs_agent_config.json')

try:
    with open(config_path, 'r') as f:
        config_json = json.load(f)
except FileNotFoundError:
    print(f"Error: Configuration file not found at {config_path}")
    sys.exit(1)

# Extract Data
system_prompt = config_json.get('system_prompt')
tools = config_json.get('tools', [])
agent_name = config_json.get('agent_name', "NextGen Shop Assistant")

print(f"Loaded Config for '{agent_name}'")
print(f"Found {len(tools)} tools.")

# Construct Payload
# Note: For client-side tools (which we are using via React SDK), 
# we usually still define them in the agent config so the LLM knows they exist.
# ElevenLabs API expects 'tools' key in the agent prompt config or root depending on version.
# Documentation: https://elevenlabs.io/docs/api-reference/update-agent

payload = {
    "conversation_config": {
        "agent": {
            "prompt": {
                "prompt": system_prompt,
                "tools": tools # Attach tools so the agent knows about them
            }
        }
    }
}

headers = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json"
}

url = f"https://api.elevenlabs.io/v1/convai/agents/{AGENT_ID}"

print("Sending PATCH request to ElevenLabs...")
response = requests.patch(url, json=payload, headers=headers)

if response.status_code == 200:
    print("✅ SUCCESS: Agent Configuration Synced!")
    # print(json.dumps(response.json(), indent=2))
else:
    print(f"❌ FAILED: {response.status_code}")
    print(response.text)
