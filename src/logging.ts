import { fetchEnsureUid } from "./fetch-toolkit";
import { FetchDecorator, RequestInitToolkit } from "./types";

/**
 * Base class for logging decorators.
 */
export abstract class FetchLogger implements FetchDecorator {

    /**
     * Constructor.
     * @param logBody Log the body of the request.
     * @param logHeaders Log the headers of the request.
     */
    constructor(protected logBody = false, protected logHeaders = false) {}

    /**
     * Decorates the request with logging.
     * @param url URL to decorate.
     * @param request Fetch options.
     * @returns void
     * @override
     */
    decorateRequest(url: string, request: RequestInitToolkit) {
        // Ensure the request has a unique id
        fetchEnsureUid(request);

        // Log the request
        this.logAction(this.getRequestLogString(request, url), "Request");

        // Log the headers if requested and available
        if (this.logHeaders && request.headers) {

            // Check the type of the headers object and log accordingly
            if (request.headers.forEach && typeof request.headers.forEach === "function") {
                // Header object implementation
                request.headers.forEach((value, key) =>
                    this.logAction(this.getHeaderLogString(String(key), value), "Header"),
                );
            } else if (Array.isArray(request.headers)) {
                // [string, string] implementation
                for (const header of request.headers) {
                    this.logAction(this.getHeaderLogString(header[0], header[1]), "Header");
                }
            } else {
                for (const header in request.headers) {
                    this.logAction(
                        this.getHeaderLogString(
                            header,
                            (
                                request.headers as {
                                    [key: string]: string;
                                }
                            )[header],
                        ),
                        "Header",
                    );
                }
            }
        }

        // Log the body if requested and available
        if (this.logBody && request.body) {
            this.logAction(this.getBodyLogString(request.body), "Body");
        }
    }

    /**
     * Decorates the response with logging.
     * @param _url URL to decorate (not used in this implementation)
     * @param request Fetch options.
     * @param response Fetch response.
     * @returns void
     * @override
     */
    decorateResponse(_url: string, request: RequestInitToolkit, response: Response) {
        this.logAction(this.getResponseLogString(request, response), "Response");
    }

    // Helper methods
    private getRequestLogString(request: RequestInitToolkit, url: string): string {
        return `>> [${request.uid}] ${request.method ?? "GET"} ${url}`;
    }

    private getResponseLogString(request: RequestInitToolkit, response: Response): string {
        return `<< [${request.uid}] ${response.status} ${response.statusText}`;
    }

    private getBodyLogString(body: unknown): string {
        return `   ${typeof body === "string" ? body : JSON.stringify(body)}`;
    }

    private getHeaderLogString(key: string, value: unknown): string {
        return `   -- ${key}: ${value}`;
    }

    /**
     * Helper method to log an additional action performed by the fetching process which is not a request or response.
     * @param message Message to log.
     * @param request Fetch options.
     */
    public static logAdditionalAction(message: string, request?: RequestInitToolkit) {
        if (request?.decorators) {
            // Get the logger decorators
            const loggers = request.decorators.filter(
                decorator => decorator instanceof FetchLogger,
            ) as FetchLogger[];
            for (const logger of loggers) {
                logger.logAction(`-- [${request.uid}] ${message}`, "Additional");
            }
        }
    }

    /**
     * Logs an action. Must be implemented by the child class.
     * @param logStr The string to log.
     * @param action The type of action to log.
     */
    protected abstract logAction(
        logStr: string,
        action: "Request" | "Response" | "Additional" | "Body" | "Header",
    ): void;
}

/**
 * A logger that logs to the console.
 */
export class FetchConsoleLogger extends FetchLogger {
    /**
     * @inheritdoc
     */
    constructor(logBody = false, logHeaders = false) {
        super(logBody, logHeaders);
    }

    /**
     * Logs the action to the console as debug.
     * @param logStr The string to log.
     */
    protected logAction(logStr: string): void {
        console.debug(logStr);
    }
}
