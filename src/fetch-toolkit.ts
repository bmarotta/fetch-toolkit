import { HTTP_HEADER_ACCEPT, HTTP_HEADER_ACCEPT_JSON } from "./constants";

/**
 * Error thrown on a faulty fetch request
 */
export class FetchError extends Error {
  constructor(
    public readonly url: string,
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(`Error retrieving ${url}: ${statusText} (${status})`);
  }
}

/**
 * An decorator that can modify the request before sending
 */
export abstract class FetchDecorator {
    public abstract decorate(request: RequestInit): void;
}

/**
 * A class that handles the call to the fetch api itself
 */
 export abstract class FetchHandler {
    public abstract fetch(url: string, init?: RequestInit): Promise<Response>;
}

/**
 * Toolkit extension for the fetch options
 */
export interface RequestInitToolkit extends RequestInit {
    decorators?: FetchDecorator[];
    handler?: FetchHandler;
    uid?: string;
}

/**
 * Helper method to get a response as JSON. Throws a FetchError in case of faulty Status code
 * @param url URL to retrievce
 * @param init Init parameters (same as used in the native fetch command)
 * @returns A JSON object
 */
export async function fetchJson<T>(url: string, init?: RequestInitToolkit): Promise<T> {
  init = setHeader(init, HTTP_HEADER_ACCEPT, HTTP_HEADER_ACCEPT_JSON);
  const response = await doFetch(url, init);
  const obj = (await response.json()) as T;
  return obj;
}

async function doFetch(url: string, init?: RequestInitToolkit) {
    if (init?.decorators) {
        for (const decorator of init.decorators) {
            decorator.decorate(init);
        }
    }
    const response = await (init?.handler?.fetch ? init.handler.fetch(url, init) : fetch(url, init));
    if (!response.ok) {
        throw new FetchError(url, response.status, response.statusText);
    }
    return response;
}

export function setHeader(init: RequestInitToolkit | undefined, headerName: string, headerValue: string): RequestInit {
    if (!init) {
        init = {}
    }
    const headers = init.headers ?? {} as any;

    // Check if the header has the has and set methods
    if (headers.has && headers.set && !headers.has(headerName)) {
        headers.set(headerName, headerValue);
    } else if (!headers[headerName]) {
        headers[headerName] = headerValue;
    }
    if (!init.headers) {
        init.headers = headers;
    }
    return init;
}

