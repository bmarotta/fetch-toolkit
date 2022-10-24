import { BasicAuthenticationProvider } from './authentication';
import { fetchJson, RequestInitToolkit } from './fetch-toolkit';
import { FetchGroupHandler } from './group';
import { joinUrl } from './url';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export class API {
  groupHandler?: FetchGroupHandler;

  constructor(
    public readonly baseUrl: string,
    public authentication?: BasicAuthenticationProvider,
    maxParallel?: number
  ) {
    if (maxParallel) {
        this.groupHandler = new FetchGroupHandler(baseUrl, maxParallel);
    }
  }

  async call<T>(method: HttpMethod, endpoint: string, params?: any, body?: any): Promise<T> {
    const options: RequestInitToolkit = {
      method: method,
      decorators: [],
    };
    if (this.authentication) {
      options.decorators?.push(this.authentication);
    }
    options.handler = this.groupHandler;
    if (method !== 'GET' && body) {
      options.headers = {
        'Content-Type': 'application/json',
      };
      options.body = JSON.stringify(body);
    }
    const paramStr = params ? new URLSearchParams(params).toString() : '';
    const fullUrl = paramStr
      ? joinUrl(this.baseUrl, endpoint, '?' + paramStr)
      : joinUrl(this.baseUrl, endpoint);
    return fetchJson<T>(fullUrl, options);
  }

  async get<T>(endpoint: string, params?: any): Promise<T> {
    return this.call<T>('GET', endpoint, params);
  }
}
