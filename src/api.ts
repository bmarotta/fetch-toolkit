import { AuthenticationProvider } from './authentication';
import { fetchJson } from './fetch-toolkit';
import { FetchGroupHandler } from './group';
import { FetchLogger } from './logging';
import { HttpMethod, RequestInitToolkit } from './types';
import { joinUrl } from './url';

// Params type is defined as a collection og strings in nodes: string[][] | Record<string, string> | string | URLSearchParams
// Nevertheless this loses the power of having strongly types params
// For this reason we decided to set the ParamsType as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParamsType = any; 

export class API {
  groupHandler?: FetchGroupHandler;

  constructor(
    public readonly baseUrl: string,
    public authentication?: AuthenticationProvider,
    maxParallel?: number,
    public logger?: FetchLogger,
  ) {
    if (maxParallel) {
      this.groupHandler = new FetchGroupHandler(maxParallel);
    }
  }

  async call<T>(method: HttpMethod, endpoint: string, params?: ParamsType, body?: unknown): Promise<T> {
    const options: RequestInitToolkit = {
      method: method,
      decorators: [],
    };
    if (this.authentication) {
      options.decorators?.push(this.authentication);
    }
    if (this.logger) {
      options.decorators?.push(this.logger);
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
      ? joinUrl([this.baseUrl, endpoint, '?' + paramStr])
      : joinUrl([this.baseUrl, endpoint]);
    return fetchJson<T>(fullUrl, options);
  }

  async get<T>(endpoint: string, params?: ParamsType): Promise<T> {
    return this.call<T>('GET', endpoint, params);
  }

  async delete<T>(endpoint: string, params?: ParamsType, body?: unknown): Promise<T> {
    return this.call<T>('PUT', endpoint, params, body);
  }

  async patch<T>(endpoint: string, body: unknown, params?: ParamsType): Promise<T> {
    return this.call<T>('PUT', endpoint, params, body);
  }

  async post<T>(endpoint: string, body: unknown, params?: ParamsType): Promise<T> {
    return this.call<T>('POST', endpoint, params, body);
  }

  async put<T>(endpoint: string, body: unknown, params?: ParamsType): Promise<T> {
    return this.call<T>('PUT', endpoint, params, body);
  }
}
