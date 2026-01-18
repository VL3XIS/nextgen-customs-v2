import axios from 'axios';

interface JobDetails {
    vehicle: string;
    services: string;
    notes?: string;
}

interface GeneratedPosts {
    instagram: {
        caption: string;
        hashtags: string[];
    };
    facebook: {
        caption: string;
    };
    linkedin: {
        caption: string;
    };
}

export const generatePosts = async (jobDetails: JobDetails): Promise<GeneratedPosts> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
        console.warn('ANTHROPIC_API_KEY is not configured. Falling back to mock data.');
        return mockPosts(jobDetails);
    }

    const prompt = `
You are an Expert Automotive Social Media Manager & Growth Hacker for Next Gen Customs, a high-end auto body and collision center.
Your goal is to write three distinct, high-engagement posts that feel human-written, punchy, and designed to stop the scroll.

DETAILS:
Vehicle: ${jobDetails.vehicle}
Services Performed: ${jobDetails.services}
Context/Notes: ${jobDetails.notes || 'Standard high-quality repair'}

INSTRUCTIONS:
1. NO GENERIC PHRASES. Do not use "Thrilled to announce," "Top-notch," or "Unparalleled."
2. FOCUS ON THE CRAFT. Talk about the precision, the paint match, the seamless repair.
3. DRIVE EMOTION. Talk about getting the customer back on the road, the relief of fixing a wreck, or the joy of a fresh new look.

PLATFORM REQUIREMENTS:

[INSTAGRAM]
- Vibe: Artistic, visual, cool.
- Structure:
  [Hook: One punchy line with an emoji]
  [Space]
  [Story: 2-3 sentences about the challenge or the specific repair technique]
  [Space]
  [Result: "Like it never happened."]
  [Space]
  [CTA: "DM for estimates"]
- Hashtags: Mix of 20 high-volume tags (e.g., #AutoBody) and local/niche tags (e.g., #CollisionRepairSpecialist).

[FACEBOOK]
- Vibe: Community trust, friendly, "Your local expert."
- Structure: Conversational. "Another [Vehicle] saved from the crusher!" or "Bad dent? No problem." Focus on reliability and lifetime warranty.
- CTA: "Call us at [Phone] or click Message for a quote."

[LINKEDIN]
- Vibe: Professional, B2B, Fleet Services, Insurance Standards.
- Focus: Efficiency, OEM procedures, safety calibrations, and reducing cycle time.
- Audience: Insurance agents, fleet managers, sophisticated car owners.

RESPONSE FORMAT (JSON ONLY):
{
  "instagram": {
    "caption": "...",
    "hashtags": ["#tag1", "#tag2"]
  },
  "facebook": {
    "caption": "..."
  },
  "linkedin": {
    "caption": "..."
  }
}`;

    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-opus-20240229',
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                },
            }
        );

        const content = response.data.content[0].text;
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}') + 1;
        const jsonString = content.substring(jsonStart, jsonEnd);

        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error calling Claude API:', error);
        // Return mock data if API fails or key is invalid (for dev/demo purposes)
        console.warn('Falling back to mock data due to API error');
        return mockPosts(jobDetails);
    }
};

const mockPosts = (jobDetails: JobDetails): GeneratedPosts => {
    const variations = [
        {
            intro: "Incredible transformation alert! 🚗",
            outro: "Quality you can trust, every single time. 🛠️",
        },
        {
            intro: "Back on the road and looking better than ever!",
            outro: "Another happy customer back in the driver's seat. ✅",
        },
        {
            intro: "Check out the precision work on this beauty.",
            outro: "Visit us for a free estimate today! 📍",
        }
    ];

    const v = variations[Math.floor(Math.random() * variations.length)];

    return {
        instagram: {
            caption: `${v.intro} Just finished up a ${jobDetails.vehicle}. We performed ${jobDetails.services} with full attention to detail. ${v.outro}`,
            hashtags: ['#NextGenCustoms', '#AutoBodyRepair', '#CollisionRepair', '#CarRestoration', '#PaintJob', '#Craftsmanship']
                .sort(() => 0.5 - Math.random()) // Shuffle hashtags
                .slice(0, 5)
        },
        facebook: {
            caption: `${v.intro} A fresh ${jobDetails.vehicle} just rolled out of the shop after receiving ${jobDetails.services}. Proud of the team's hard work on this one! ${v.outro}`
        },
        linkedin: {
            caption: `Professionalism and quality craftsmanship. We've just completed a project involving a ${jobDetails.vehicle} where we specialized in ${jobDetails.services}. Building trust through excellence at Next Gen Customs. ${v.outro}`
        }
    };
};
