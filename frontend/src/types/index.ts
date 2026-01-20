export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface Job {
    id: string;
    customerName: string;
    vehicle: string;
    services: string;
    notes?: string;
    status: 'ESTIMATE' | 'APPROVED' | 'IN_PROGRESS' | 'PAINT' | 'QUALITY_CHECK' | 'COMPLETE';
    startedAt: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        posts: number;
    };
}

export interface Post {
    id: string;
    jobId: string;
    platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
    caption: string;
    hashtags: string[];
    status: 'DRAFT' | 'APPROVED' | 'PUBLISHED';
    imageUrl?: string;
    scheduledAt?: string;
    createdAt: string;
}

export interface AnalyticsSummary {
    totalPosts: number;
    timeSavedMinutes: number;
    totalJobs: number;
    activeClients: number;
    pipelineRevenue: number;
    completedRevenue: number;
}

export interface PostTrend {
    date: string;
    count: number;
}

export interface PlatformMetric {
    name: string;
    value: number;
}

export interface AnalyticsStats {
    summary: AnalyticsSummary;
    charts: {
        postsOverTime: PostTrend[];
        byPlatform: PlatformMetric[];
    };
}
