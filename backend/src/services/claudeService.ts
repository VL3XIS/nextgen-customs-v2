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
You are a social media manager for Next Gen Customs, an auto body repair shop. Generate engaging social media posts for three platforms based on this repair job:

Vehicle: ${jobDetails.vehicle}
Services: ${jobDetails.services}
Additional Notes: ${jobDetails.notes || 'None'}

Generate three posts (Instagram, Facebook, LinkedIn) that:
- Highlight quality craftsmanship and attention to detail
- Use appropriate tone for each platform
- Are 100-150 words each
- For Instagram: Include 15-20 relevant hashtags

Brand voice: Professional, skilled, trustworthy, passionate about cars

IMPORTANT: Respond ONLY with valid JSON in the following format, with no other text:
{
  "instagram": {
    "caption": "...",
    "hashtags": ["AutoBodyRepair", "CollisionRepair", ...]
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
