
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Load env from backend/.env (assuming running from backend dir)
const envPath = path.resolve(process.cwd(), '.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const API_KEY = process.env.ELEVENLABS_API_KEY;
const AGENT_ID = process.env.ELEVENLABS_AGENT_ID;
const BASE_URL = 'https://nextgen-customs-v2.vercel.app/api/agent';

if (!API_KEY || !AGENT_ID) {
    console.error('❌ Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID in .env');
    process.exit(1);
}

// Map tool names to route slugs
const ROUTE_MAP: Record<string, string> = {
    'check_availability': '/check-availability',
    'book_appointment': '/book-appointment',
    'reschedule_appointment': '/reschedule-appointment',
    'cancel_appointment': '/cancel-appointment',
    'check_status': '/check-status',
    'list_active_jobs': '/list-active-jobs',
    'analyze_revenue': '/analyze-revenue',
    'search_customer_history': '/search-history',
    'generate_report': '/generate-report'
};

const MAIN_CONFIG_PATH = path.resolve(__dirname, '../../elevenlabs_agent_config.json');

async function main() {
    console.log(`🚀 Updating Agent ${AGENT_ID} to use Vercel Webhooks...`);
    console.log(`📡 Base URL: ${BASE_URL}`);

    // Read local config for parameter schemas
    if (!fs.existsSync(MAIN_CONFIG_PATH)) {
        console.error(`❌ Config file not found at ${MAIN_CONFIG_PATH}`);
        process.exit(1);
    }
    const localConfig = JSON.parse(fs.readFileSync(MAIN_CONFIG_PATH, 'utf-8'));

    // Construct Tools Array for ElevenLabs API
    const tools = localConfig.tools.map((tool: any) => {
        const route = ROUTE_MAP[tool.name];
        if (!route) {
            console.warn(`⚠️ Warning: No route mapping found for tool '${tool.name}'`);
            return null;
        }

        return {
            name: tool.name,
            description: tool.description,
            type: "webhook",
            api_schema: {
                url: `${BASE_URL}${route}`,
                method: "POST",
                request_body_schema: {
                    type: "object",
                    properties: tool.parameters.properties,
                    required: tool.parameters.required || []
                }
            }
        };
    }).filter(Boolean);

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

        console.log('✅ Agent successfully reconfigured for Production!');
        console.log(`   - Updated ${tools.length} tools.`);
        console.log(`   - Request ID: ${response.headers['request-id']}`);

    } catch (error: any) {
        console.error('❌ Update Failed:', error.response?.data || error.message);
    }
}

main();
