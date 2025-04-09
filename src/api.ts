/**
 * Represents an API client that makes HTTP requests to a specified base URL.
 */
import { AuthenticationProvider } from "./authentication";
import { fetchJson } from "./fetch-toolkit";
import { FetchGroupHandler } from "./group";
import { FetchLogger } from "./logging";
import { FetchDecorator, HttpMethod, RequestInitToolkit } from "./types";
import { joinUrl } from "./utils";

/**
 * The type for the parameters in the API call.
 */
// In node, Params type is defined as: string[][] | Record<string, string> | string | URLSearchParams
// Nevertheless this loses the power of having rich object types for params
// For this reason it was decided to set the ParamsType to any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParamsType = any;

/**
 * Represents an API client that makes HTTP requests to a specified base URL.
 */
export class API {
    /**
     * The handler for managing parallel requests (optional). See {@link FetchGroupHandler}.
     */
    groupHandler?: FetchGroupHandler;

    /**
     * Creates an instance of the API client.
     * @param baseUrl The base URL of the API.
     * @param authentication Optional authentication provider for the API (see {@link AuthenticationProvider})
     * @param maxParallel Optional maximum number of parallel requests to be handled. If not provided, no limit is set.
     * @param logger Optional logger for the API (see {@link FetchLogger})
     * @param customDecorators Optional custom decorators for the API (see {@link FetchDecorator})
     */
    constructor(
        public readonly baseUrl: string,
        public authentication?: AuthenticationProvider,
        maxParallel?: number,
        public logger?: FetchLogger,
        public customDecorators?: FetchDecorator[],
    ) {
        if (maxParallel) {
            this.groupHandler = new FetchGroupHandler(maxParallel);
        }
    }

    /**
     * Makes an HTTP request to the API. The method returns the defined return type. 
     * Please note that no validation is done on the return type.
     * @param method The HTTP method of the request.
     * @param endpoint The endpoint of the request.
     * @param params The query parameters of the request.
     * @param body The body of the request.
     * @returns A promise that resolves to the defined return.
     */
    async call<T>(
        method: HttpMethod,
        endpoint: string,
        params?: ParamsType,
        body?: unknown,
    ): Promise<T> {
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
        if (this.customDecorators) {
            options.decorators?.push(...this.customDecorators);
        }
        options.handler = this.groupHandler;
        if (method !== "GET" && body) {
            options.headers = {
                "Content-Type": "application/json",
            };
            options.body = JSON.stringify(body);
        }
        const paramStr = params ? this.convertParamsToQueryString(params) : "";
        const fullUrl = paramStr
            ? joinUrl([this.baseUrl, endpoint, "?" + paramStr])
            : joinUrl([this.baseUrl, endpoint]);
        return fetchJson<T>(fullUrl, options);
    }

    /**
     * Converts the parameters to a query string.
     * @param params The parameters to convert.
     * @returns The query string.
     */
    public convertParamsToQueryString(params: ParamsType): string {
        if (typeof params === "string") {
            return params;
        }
        const urlSearchParams =
            (params instanceof URLSearchParams) ?
                params :
                new URLSearchParams(
                    typeof params === "object" && !Array.isArray(params) ?
                        this.replaceDatesInParamsByIsoString(params) : params);

        return urlSearchParams.toString();
    }

    private replaceDatesInParamsByIsoString(params: ParamsType): Record<string, unknown> {
        return Object.entries(params).reduce((acc, [key, value]) => {
            acc[key] = value instanceof Date ? value.toISOString() : value;
            return acc;
        }, {} as Record<string, unknown>);
    }

    /**
     * Makes a GET request to the API. The method returns the defined return type. 
     * Please note that no validation is done on the return type.
     * @param endpoint The endpoint of the request.
     * @param params The query parameters of the request.
     * @returns A promise that resolves to the response data.
     */
    async get<T>(endpoint: string, params?: ParamsType): Promise<T> {
        return this.call<T>("GET", endpoint, params);
    }

    /**
     * Makes a DELETE request to the API. The method returns the defined return type. 
     * Please note that no validation is done on the return type.
     * @param endpoint The endpoint of the request.
     * @param params The query parameters of the request.
     * @param body The body of the request.
     * @returns A promise that resolves to the response data.
     */
    async delete<T>(endpoint: string, params?: ParamsType, body?: unknown): Promise<T> {
        return this.call<T>("DELETE", endpoint, params, body);
    }

    /**
     * Makes a PATCH request to the API. The method returns the defined return type. 
     * Please note that no validation is done on the return type.
     * @param endpoint The endpoint of the request.
     * @param body The body of the request.
     * @param params The query parameters of the request.
     * @returns A promise that resolves to the response data.
     */
    async patch<T>(endpoint: string, body: unknown, params?: ParamsType): Promise<T> {
        return this.call<T>("PATCH", endpoint, params, body);
    }

    /**
     * Makes a POST request to the API. The method returns the defined return type. 
     * Please note that no validation is done on the return type.
     * @param endpoint The endpoint of the request.
     * @param body The body of the request.
     * @param params The query parameters of the request.
     * @returns A promise that resolves to the response data.
     */
    async post<T>(endpoint: string, body: unknown, params?: ParamsType): Promise<T> {
        return this.call<T>("POST", endpoint, params, body);
    }

    /**
     * Makes a PUT request to the API. The method returns the defined return type. 
     * Please note that no validation is done on the return type.
     * @param endpoint The endpoint of the request.
     * @param body The body of the request.
     * @param params The query parameters of the request.
     * @returns A promise that resolves to the response data.
     */
    async put<T>(endpoint: string, body: unknown, params?: ParamsType): Promise<T> {
        return this.call<T>("PUT", endpoint, params, body);
    }
}
