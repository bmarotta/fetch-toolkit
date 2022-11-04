export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Error thrown on a faulty fetch request
 */
export class FetchError extends Error {
    constructor(
        public readonly url: string,
        public readonly status: number,
        public readonly statusText: string,
        public readonly responseText?: string,
    ) {
        super(`Error retrieving ${url}: ${statusText} (${status})`);
    }
}

/**
 * Base interface for the decorating a fetch request and response
 */
export interface FetchDecorator {
    decorateRequest?: (url: string, request: RequestInitToolkit) => void;
    decorateResponse?: (url: string, request: RequestInitToolkit, response: Response) => void;
}

/**
 * A class that handles the call to the fetch api itself. Use it if just implementing decorators is not enough
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
