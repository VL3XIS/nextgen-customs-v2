
import os
import json
import requests
import os
import json
import requests

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

env_data = load_env_manual('../.env')
API_KEY = env_data.get('ELEVENLABS_API_KEY')
AGENT_ID = env_data.get('ELEVENLABS_AGENT_ID')

if not API_KEY or not AGENT_ID:
    print("Error: Missing API_KEY or AGENT_ID in .env (Manual Read)")
    # Fallback to hardcoded if needed (but prefer not to commit secrets)
    # exit(1) # Don't exit yet, let's see if we can proceed or print vars


print(f"Updating Agent: {AGENT_ID}")

# 1. Read Prompt
try:
    with open('../../docs/plans/ALEX_PROMPT_11LABS.md', 'r') as f:
        # Fallback if path implies different structure, user said it was in Downloads but I should check where I read it.
        # Step 358 read it from /Users/USER/Downloads/ALEX_PROMPT_11LABS.md
        pass
except:
    pass

PROMPT_PATH = '/Users/USER/Downloads/ALEX_PROMPT_11LABS.md'
with open(PROMPT_PATH, 'r') as f:
    prompt_text = f.read()

# Replace Alex with Nida in prompt
prompt_text = prompt_text.replace("Alex", "Nida")

# 2. Read Tools
TOOLS_PATH = '../../elevenlabs_agent_config.json'
with open(TOOLS_PATH, 'r') as f:
    config_json = json.load(f)
    tools_list = config_json.get('tools', [])

# 3. Construct Payload
payload = {
    "conversation_config": {
        "agent": {
            "prompt": {
                "prompt": prompt_text
            }
        },
        "tts": {
            # Ms. Walker - Warm, Reassuring
            "voice_id": "DLsHlh26Ugcm6ELvS0qi"
        }
    }
}

# Add tools if the API accepts them in this payload
# The API Documentation says `tools` is a list of Tool Definitions.
# payload['conversation_config']['agent']['prompt']['tools'] = tools_list

headers = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json"
}

url = f"https://api.elevenlabs.io/v1/convai/agents/{AGENT_ID}"

print("Sending PATCH request...")
response = requests.patch(url, json=payload, headers=headers)

if response.status_code == 200:
    print("✅ SUCCESS: Agent Updated!")
    print(json.dumps(response.json(), indent=2))
else:
    print(f"❌ FAILED: {response.status_code}")
    print(response.text)
