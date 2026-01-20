
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Load env 
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

if (!API_KEY || !AGENT_ID) {
    console.error('❌ Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID in .env');
    process.exit(1);
}

const CONFIG_PATH = path.resolve(__dirname, '../../elevenlabs_agent_config.json');

async function main() {
    console.log(`🚀 Syncing Agent ${AGENT_ID} with High-Detail Prompt & Client Tools...`);

    if (!fs.existsSync(CONFIG_PATH)) {
        console.error(`❌ Config file not found at ${CONFIG_PATH}`);
        process.exit(1);
    }
    const localConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

    // Construct Tools exactly as described in JSON (Client Tools)
    const tools = localConfig.tools.map((tool: any) => ({
        name: tool.name,
        description: tool.description,
        type: "client",
        parameters: {
            type: "object",
            properties: tool.parameters.properties,
            required: tool.parameters.required || []
        }
    }));

    // Prepare Payload
    const payload = {
        conversation_config: {
            agent: {
                prompt: { prompt: localConfig.system_prompt },
                first_message: "NextGen Customs, Alex speaking. How can I help you today?",
                language: "en"
            },
            tools: tools
        }
    };

    // Send Request
    try {
        const response = await axios.patch(
            `https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}`,
            payload,
            {
                headers: {
                    'xi-api-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Agent successfully synced with World-Class Prompt!');
        console.log(`   - Updated ${tools.length} Client Tools.`);

    } catch (error: any) {
        console.error('❌ Sync Failed:', error.response?.data || error.message);
    }
}

main();
