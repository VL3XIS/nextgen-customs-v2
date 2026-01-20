
import json

try:
    with open('voices.json', 'r') as f:
        data = json.load(f)
        voices = data.get('voices', [])
        
        found = False
        print(f"Scanning {len(voices)} voices...")
        
        for v in voices:
            if "walker" in v['name'].lower():
                print(f"FOUND: {v['name']} -> {v['voice_id']}")
                found = True
        
        if not found:
            print("No voice found matching 'Walker'")
            
except Exception as e:
    print(f"Error: {e}")
