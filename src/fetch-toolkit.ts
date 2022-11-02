import { HTTP_HEADER_ACCEPT, HTTP_HEADER_ACCEPT_JSON } from "./constants";
import { FetchError, RequestInitToolkit } from "./types";
import { generateUidBasedOnTimestamp } from "./util";

/**
 * Helper method to get a response as JSON. Throws a FetchError in case of faulty Status code
 * @param url URL to retrievce
 * @param init Init parameters (same as used in the native fetch command)
 * @returns A JSON object
 */
export async function fetchJson<T>(url: string, init?: RequestInitToolkit): Promise<T> {
  init = fetchSetHeader(init, HTTP_HEADER_ACCEPT, HTTP_HEADER_ACCEPT_JSON);
  const response = await fetchToolkit(url, init);
  if (response.status == 204) {
    return undefined as T;
  }
  const obj = (await response.json()) as T;
  return obj;
}

export async function fetchToolkit(url: string, init?: RequestInitToolkit) {
    let response: Response;

    if (init?.handler?.fetch) {
        // If we have a fetch handler, just call it. It is responsible for calling the different decorator
        response = await init.handler.fetch(url, init);
    } else {
        // Call any available request decorator
        fetchDecorateRequest(init, url);

        // Call fetch
        response = await (init?.handler?.fetch ? init.handler.fetch(url, init) : fetch(url, init));
        
        // Call any available response decorator
        fetchDecorateResponse(init, url, response);
    }
    

    // Check the response result
    if (!response.ok) {        
        // Some APIs return an error response in case of errors. Try to fetch it
        let responseText: string | undefined = undefined;
        try {
            responseText = await response.text();
        }
        catch {
            // Ignore eventual errors that happen when getting the response text 
        }
        throw new FetchError(url, response.status, response.statusText, responseText);        
    }
    return response;
}

function fetchDecorateResponse(init: RequestInitToolkit | undefined, url: string, response: Response) {
    if (init?.decorators) {
        for (const decorator of init.decorators) {
            if (decorator.decorateResponse && decorator.decorateResponse instanceof Function) {
                decorator.decorateResponse(url, init, response);
            }
        }
    }
}

function fetchDecorateRequest(init: RequestInitToolkit | undefined, url: string) {
    if (init?.decorators) {
        for (const decorator of init.decorators) {
            if (decorator.decorateRequest && decorator.decorateRequest instanceof Function) {
                decorator.decorateRequest(url, init);
            }
        }
    }
}

export function fetchSetHeader(init: RequestInitToolkit | undefined, headerName: string, headerValue: string): RequestInit {
    if (!init) {
        init = {}
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function fetchEnsureUid(init: RequestInitToolkit) {
    if (!init.uid) {
        init.uid = generateUidBasedOnTimestamp();
    }
}

