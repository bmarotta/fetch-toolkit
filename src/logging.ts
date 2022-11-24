import { fetchEnsureUid } from "./fetch-toolkit";
import { FetchDecorator, RequestInitToolkit } from "./types";

export abstract class FetchLogger implements FetchDecorator {
    constructor(protected logBody = false, protected logHeaders = false) {}

    decorateRequest(url: string, request: RequestInitToolkit) {
        fetchEnsureUid(request);
        this.logAction(this.getRequestLogString(request, url), "Request");
        if (this.logHeaders && request.headers) {
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
        if (this.logBody && request.body) {
            this.logAction(this.getBodyLogString(request.body), "Body");
        }
    }
    decorateResponse(url: string, request: RequestInitToolkit, response: Response) {
        this.logAction(this.getResponseLogString(request, response), "Response");
    }

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

    protected abstract logAction(
        logStr: string,
        action: "Request" | "Response" | "Additional" | "Body" | "Header",
    ): void;
}

export class FetchConsoleLogger extends FetchLogger {
    constructor(logBody = false, logHeaders = false) {
        super(logBody, logHeaders);
    }

    protected logAction(logStr: string): void {
        console.debug(logStr);
    }
}
