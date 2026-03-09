import axios from 'axios';
import * as cheerio from 'cheerio';
import { parse, addHours, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export interface Match {
  id: string;
  dateStr: string;
  timeStr: string;
  home: string;
  away: string;
  matchNum: string;
  location: string;
  group: string;
  datetimeHcm: string;
  timestamp: number;
}

export async function fetchMatches(): Promise<Match[]> {
  // Return the static matches data
  const matchesData = await import('../matches.json');
  return matchesData.default as Match[];
}
