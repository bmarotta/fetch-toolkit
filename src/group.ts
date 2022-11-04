import { FetchHandler, RequestInitToolkit } from "./types";
import { fetchEnsureUid, fetchToolkit } from "./fetch-toolkit";
import { FetchLogger } from "./logging";
import { ParallelPromiseHandler } from "./parallel-promise-handler";

export class FetchGroupHandlerError extends Error {}

export class FetchGroupHandler extends FetchHandler {
    private parallelPromiseHandler: ParallelPromiseHandler<Response>;
    constructor(public readonly maxParallel: number) {
        super();
        this.parallelPromiseHandler = new ParallelPromiseHandler<Response>(
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
}
