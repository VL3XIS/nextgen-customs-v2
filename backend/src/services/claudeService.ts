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
        throw new Error('ANTHROPIC_API_KEY is not configured');
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

const mockPosts = (jobDetails: JobDetails): GeneratedPosts => ({
    instagram: {
        caption: `Check out this transformation on a ${jobDetails.vehicle}! Our team performed ${jobDetails.services} to bring this beauty back to life. At Next Gen Customs, we take pride in every detail. #NextGenCustoms #AutoBody`,
        hashtags: ['#AutoBody', '#CollisionRepair', '#CarRestoration', '#NextGenCustoms', '#QualityWork']
    },
    facebook: {
        caption: `Another successful job at Next Gen Customs! We just finished working on a ${jobDetails.vehicle}, performing ${jobDetails.services}. Our team is dedicated to providing top-notch quality and service. Stop by for an estimate!`
    },
    linkedin: {
        caption: `Precision and expertise are at the core of our business at Next Gen Customs. We recently completed extensive work on a ${jobDetails.vehicle}, including ${jobDetails.services}. We're proud to serve our community with professional auto body repair services.`
    }
});
