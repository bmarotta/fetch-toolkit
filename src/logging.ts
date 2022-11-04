import { fetchEnsureUid } from "./fetch-toolkit";
import { FetchDecorator, RequestInitToolkit } from "./types";

export abstract class FetchLogger implements FetchDecorator {
    decorateRequest(url: string, request: RequestInitToolkit) {
        fetchEnsureUid(request);
        this.logAction(this.getRequestLogString(request, url), "Request");
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
        action: "Request" | "Response" | "Additional",
    ): void;
}

export class FetchConsoleLogger extends FetchLogger {
    protected logAction(logStr: string): void {
        console.debug(logStr);
    }
}
