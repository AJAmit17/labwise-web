export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  params?: string[];
  body?: Record<string, string>;
  returns?: string;
}

export interface ApiSection {
  [key: string]: ApiEndpoint[];
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type MethodColors = {
  [key in HttpMethod]: string;
};
