import { generateUidBasedOnTimestamp } from "./util";

export class PromiseConcurrentQueueError extends Error {}

interface FunctionReference<T> {
    id: string;
    func: () => Promise<T>;
    data?: unknown;
    promise?: Promise<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject?: (reason?: any) => void;
    resolve?: (value: T | PromiseLike<T>) => void;
}

type ParallelFunctionEventType = "enqueue" | "start" | "finish" | "error";

type OnEventCallback = (
    event: ParallelFunctionEventType,
    id: string,
    data?: unknown,
    message?: string,
) => void;

export class PromiseConcurrentQueue<T> {
    private waitingQueue: FunctionReference<T>[] = [];
    private executing: FunctionReference<T>[] = [];

    constructor(public readonly maxParallel: number, public onEventCallback?: OnEventCallback) {}

    push(func: () => Promise<T>, uid?: string, data?: unknown): Promise<T> {
        if (uid && this.waitingQueue.find(n => n.id == uid)) {
            throw new PromiseConcurrentQueueError(`Promise with uid ${uid} already in the queue`);
        }
        if (uid && this.executing.find(n => n.id == uid)) {
            throw new PromiseConcurrentQueueError(`Fetch with uid ${uid} already executing`);
        }
        const functionRef = {
            id: uid ?? generateUidBasedOnTimestamp(),
            func: func,
            data: data,
        };
        if (!this.maxParallel || this.executing.length < this.maxParallel) {
            // We can start right away
            return this.executeFunction(functionRef);
        } else {
            // We have to enqueue
            return this.enqueueFunction(functionRef);
        }
    }

    private executeFunction(functionRef: FunctionReference<T>): Promise<T> {
        // this.safeLog(
        //   `Starting function ${functionRef.id}. ${this.executing.length} requests on going. ${this.enqueueFunction.length} in the queue`,
        //   functionRef
        // );

        // Do the actual call
        functionRef.promise = functionRef.func();

        // Add to the executing list
        this.executing.push(functionRef);

        this.safeTriggerEventCallback("start", functionRef);

        // Add resolve and reject handlers to remove from the lists
        functionRef.promise
            .then(value => {
                this.removeFromExecuting(functionRef);

                // When enqueuing, this is the resolve from the Promise we actually returned
                if (functionRef.resolve) {
                    functionRef.resolve(value);
                }
            })
            .catch(reason => {
                this.removeFromExecuting(functionRef);

                // When enqueuing, this is the reject from the Promise we actually returned
                if (functionRef.reject) {
                    functionRef.reject(reason);
                }
            });

        // This typecast if just to make typescript happy. In the end these are all generics
        return functionRef.promise as Promise<T>;
    }

    private safeTriggerEventCallback(
        eventType: ParallelFunctionEventType,
        functionRef: FunctionReference<T>,
        message?: string,
    ) {
        try {
            if (this.onEventCallback) {
                // Trigger the started callback event
                this.onEventCallback(eventType, functionRef.id, functionRef.data, message);
            }
        } catch (err) {
            // Ignore
        }
    }

    private removeFromExecuting(functionRef: FunctionReference<T>): void {
        const id = functionRef.id;
        const index = this.executing.findIndex(n => n.id == id);
        if (index == -1) {
            this.safeTriggerEventCallback(
                "error",
                functionRef,
                `Unexpected error. Function ${id} not found in executing list`,
            );
        } else {
            this.executing.splice(index, 1);
        }
        this.safeTriggerEventCallback("finish", functionRef);
        if (
            this.maxParallel &&
            this.executing.length < this.maxParallel &&
            this.waitingQueue.length
        ) {
            // start the next one
            const next = this.waitingQueue[0];
            this.waitingQueue.splice(0, 1);
            this.executeFunction(next);
        }
    }

    private enqueueFunction(functionRef: FunctionReference<T>): Promise<T> {
        this.safeTriggerEventCallback("enqueue", functionRef);
        return new Promise((resolve, reject) => {
            // Set the resolve and reject from the function reference
            functionRef.resolve = resolve;
            functionRef.reject = reject;
            // Add to the list of
            this.waitingQueue.push(functionRef);
        });
    }
}
