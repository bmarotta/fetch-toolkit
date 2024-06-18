import { FetchHandler, RequestInitToolkit } from "./types";
import { fetchEnsureUid, fetchToolkit } from "./fetch-toolkit";
import { FetchLogger } from "./logging";
import { PromiseConcurrentQueue } from "./parallel-promise-handler";

/**
 * Represents an error that can occur in the FetchGroupHandler class.
 */
export class FetchGroupHandlerError extends Error {}

/**
 * Handles fetching requests that share a context with a maximum number of parallel requests.
 */
export class FetchGroupHandler extends FetchHandler {
    private parallelPromiseHandler: PromiseConcurrentQueue<Response>;

    /**
     * Creates an instance of FetchGroupHandler.
     * @param maxParallel The maximum number of parallel requests to handle.
     */
    constructor(public readonly maxParallel: number) {
        super();
        this.parallelPromiseHandler = new PromiseConcurrentQueue<Response>(
            maxParallel,
            (event, id, data, message) => {
                switch (event) {
                    case "enqueue":
                        FetchLogger.logAdditionalAction(
                            `Enqueued request ${id}`,
                            data as RequestInitToolkit,
                        );
                        break;
                    case "error":
                        FetchLogger.logAdditionalAction(
                            `Error on request ${id}: ${message}`,
                            data as RequestInitToolkit,
                        );
                        break;
                }
            },
        );
    }

    /**
     * Fetches a resource from the specified URL.
     * @param url The URL of the resource to fetch.
     * @param init The optional request initialization options.
     * @returns A Promise that resolves to the Response object representing the fetched resource.
     */
    public fetch(url: string, init?: RequestInitToolkit | undefined): Promise<Response> {
        // Initialize unique id
        init = init ?? {};
        fetchEnsureUid(init);
        const fetchId = init.uid ?? "";

        return this.parallelPromiseHandler.push(
            () => {
                // Shallow copy the original init object
                const initCopy = Object.assign({}, init);
                if (initCopy) {
                    delete initCopy.handler;
                }
                // Do the actual fetch
                return fetchToolkit(url, initCopy);
            },
            fetchId,
            init,
        ); // We pass the init as data, as it need it for the logger
    }

    /**
     * Returns the length of the waiting queue
     */
    public get waitingQueueLength(): number {
        return this.parallelPromiseHandler.waitingQueueLength;
    }

    /**
     * Returns the number of the executing fetch requests
     */
    public get numberOfExecuting(): number {
        return this.parallelPromiseHandler.numberOfExecuting;
    }
}
