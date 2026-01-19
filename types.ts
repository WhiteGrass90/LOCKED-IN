
export enum AppState {
  SETUP = 'SETUP',
  FOCUSING = 'FOCUSING',
  INTERVENTION = 'INTERVENTION',
  COMPLETED = 'COMPLETED',
  SHAME = 'SHAME'
}

export interface FocusSession {
  intent: string;
  durationMinutes: number;
  startTime?: number;
}

export interface AIResponse {
  message: string;
}