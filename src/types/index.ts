export interface SearchResult {
  name: string;
  aliases: string[];
  possible_locations: string[];
  associated_emails: string[];
  social_media_profiles: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  additional_data_sources: {
    source: string;
    info: string;
  }[];
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface SearchQuery {
  query: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'success' | 'error';
}

export interface AppSettings {
  apiKey: string;
  modelId: string;
}

export interface DataSource {
  name: string;
  confidence: number;
}
