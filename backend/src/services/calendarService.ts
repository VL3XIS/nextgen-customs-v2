
/**
 * GOOGLE CALENDAR SERVICE
 * 
 * Handles synchronization between local Appointments and Google Calendar.
 * 
 * REQUIRED ENV VARS:
 * - GOOGLE_CLIENT_EMAIL
 * - GOOGLE_PRIVATE_KEY
 * - GOOGLE_CALENDAR_ID
 */

console.log('CalendarService: File loading...');
import { google } from 'googleapis';
console.log('CalendarService: googleapis imported');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

class CalendarService {
    private calendar: any;

    constructor() {
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (clientEmail && privateKey) {
            const auth = new google.auth.JWT(clientEmail, undefined, privateKey, SCOPES);
            this.calendar = google.calendar({ version: 'v3', auth });
            console.log('CalendarService: Initialized with Service Account');
        } else {
            console.warn('CalendarService: Missing Google credentials. Syncing disabled.');
        }
    }

    async createEvent(params: {
        summary: string;
        description?: string;
        startDateTime: Date;
        endDateTime: Date;
        location?: string;
    }) {
        if (!this.calendar) return null;

        try {
            const response = await this.calendar.events.insert({
                calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
                requestBody: {
                    summary: params.summary,
                    description: params.description,
                    location: params.location,
                    start: { dateTime: params.startDateTime.toISOString() },
                    end: { dateTime: params.endDateTime.toISOString() },
                },
            });
            console.log('CalendarService: Event created', response.data.id);
            return response.data.id;
        } catch (error) {
            console.error('CalendarService Error (createEvent):', error);
            return null;
        }
    }

    async updateEvent(eventId: string, params: {
        summary?: string;
        description?: string;
        startDateTime?: Date;
        endDateTime?: Date;
    }) {
        if (!this.calendar) return null;

        try {
            const response = await this.calendar.events.patch({
                calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
                eventId,
                requestBody: {
                    summary: params.summary,
                    description: params.description,
                    ...(params.startDateTime && { start: { dateTime: params.startDateTime.toISOString() } }),
                    ...(params.endDateTime && { end: { dateTime: params.endDateTime.toISOString() } }),
                },
            });
            return response.data;
        } catch (error) {
            console.error('CalendarService Error (updateEvent):', error);
            return null;
        }
    }

    async deleteEvent(eventId: string) {
        if (!this.calendar) return;

        try {
            await this.calendar.events.delete({
                calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
                eventId,
            });
            console.log('CalendarService: Event deleted', eventId);
        } catch (error) {
            console.error('CalendarService Error (deleteEvent):', error);
        }
    }
    async listEvents(start: Date, end: Date) {
        if (!this.calendar) return [];

        try {
            const response = await this.calendar.events.list({
                calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
                timeMin: start.toISOString(),
                timeMax: end.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });
            return response.data.items || [];
        } catch (error) {
            console.error('CalendarService Error (listEvents):', error);
            return [];
        }
    }
}

export const calendarService = new CalendarService();
