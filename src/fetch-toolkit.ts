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

/**
 * Helper method to get a response as text. 
 * In case of a 204 status code, it returns an empty string
 * Throws a FetchError in case of faulty Status code, trying to get the response text
 * @param url URL to retrieve
 * @param init Init parameters (same as used in the native fetch command)
 * @returns A string
 */
export async function fetchToolkit(url: string, init?: RequestInitToolkit) {
    let response: Response;

    if (init?.handler?.fetch) {
        // If we have a fetch handler, just call it. It is responsible for calling the different decorator
        response = await init.handler.fetch(url, init);
    } else {
        // Call any available request decorator
        await fetchDecorateRequest(init, url);

        // Call fetch
        response = await (init?.handler?.fetch ? init.handler.fetch(url, init) : fetch(url, init));

        // Call any available response decorator
        await fetchDecorateResponse(init, url, response);
    }

    // Check the response result
    if (!response.ok) {
        // Some APIs return an error response in case of errors. Try to fetch it
        let responseText: string | undefined = undefined;
        try {
            responseText = await response.text();
        } catch {
            // Ignore eventual errors that happen when getting the response text
        }
        throw new FetchError(url, response.status, response.statusText, responseText);
    }
    return response;
}

/** 
 * Decorate the response with the decorators in the init object
*/
async function fetchDecorateResponse(
    init: RequestInitToolkit | undefined,
    url: string,
    response: Response,
) {
    if (init?.decorators) {
        for (const decorator of init.decorators) {
            if (decorator.decorateResponse && decorator.decorateResponse instanceof Function) {
                await decorator.decorateResponse(url, init, response);
            }
        }
    }
}

/**
 * Decorate the request with the decorators in the init object
 */
async function fetchDecorateRequest(init: RequestInitToolkit | undefined, url: string) {
    if (init?.decorators) {
        for (const decorator of init.decorators) {
            if (decorator.decorateRequest && decorator.decorateRequest instanceof Function) {
                await decorator.decorateRequest(url, init);
            }
        }
    }
}

/**
 * Helper method to set a header in the fetch request.
 * It checks if the header has the has and set methods and uses them if available.
 * If the header does not have the has and set methods, it uses the header as a dictionary.
 * If the header already exists, it overwrites the value if the overwrite parameter is true.
 * If the header does not exist, it creates it.
 * @param init Request options
 * @param headerName Header name
 * @param headerValue Header value
 * @param overwrite If true, it overwrites the header value if it already exists
 * @returns The updated init object
 */
export function fetchSetHeader(
    init: RequestInitToolkit | undefined,
    headerName: string,
    headerValue: string,
    overwrite?: boolean,
): RequestInit {
    if (!init) {
        init = {};
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers = init.headers ?? ({} as any);

    // Check if the header has the has and set methods
    if (headers.has && headers.set && (!headers.has(headerName) || overwrite)) {
        headers.set(headerName, headerValue);
    } else if (!headers[headerName] || overwrite) {
        headers[headerName] = headerValue;
    }
    if (!init.headers) {
        init.headers = headers;
    }
    return init;
}

/**
 * Helper method to ensure that the init object has an unique identifier (uid).
 * If the uid is not present, it generates a new one.
 * @param init Request options
 */
export function fetchEnsureUid(init: RequestInitToolkit) {
    if (!init.uid) {
        init.uid = generateUidBasedOnTimestamp();
    }
}
