import { generateUidBasedOnTimestamp } from "./utils";

/**
 * Error class for the PromiseConcurrentQueue
 */
export class PromiseConcurrentQueueError extends Error {}

/**
 * Internal interface for the function reference
 */
interface FunctionReference<T> {
    /**
     * Unique identifier for the function
     */
    id: string;
    /**
     * The function to be executed
     * @returns The promise that resolves to the result of the function
     */
    func: () => Promise<T>;
    /**
     * Data passed to the callback function
     */
    data?: unknown;
    /**
     * Wrapper promise for the function
     */
    promise?: Promise<T>;
    /**
     * Reject function of the wrapper promise
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject?: (reason?: any) => void;
    /**
     * Resolve function of the wrapper promise
     */
    resolve?: (value: T | PromiseLike<T>) => void;
}

/**
 * Type of events that can be triggered
 */
export type ParallelFunctionEventType = "enqueue" | "start" | "finish" | "error";

/**
 * Callback type for the event
 */
export type OnEventCallback = (
    event: ParallelFunctionEventType,
    id: string,
    data?: unknown,
    message?: string,
) => void;

/**
 * Class to handle a queue of promises that are executed concurrently
 */
export class PromiseConcurrentQueue<T> {
    private waitingQueue: FunctionReference<T>[] = [];
    private executing: FunctionReference<T>[] = [];

    /**
     * Creates an instance of the PromiseConcurrentQueue
     * @param maxParallel The maximum number of parallel promises that can be executed. If not set, no limit is set.
     * @param onEventCallback Optional callback to be triggered when an event occurs
     */
    constructor(public readonly maxParallel: number, public onEventCallback?: OnEventCallback) {}

    /**
     * Pushes a new function to the queue
     * @param func Function to be executed
     * @param uid Optional unique identifier for the function. If not set, a new one is generated
     * @param data Data passed to the callback function
     * @returns Returns a promise that resolves to the result of the function
     */
    push(func: () => Promise<T>, uid?: string, data?: unknown): Promise<T> {
        // Check if the uid is already in the queue
        if (uid && this.waitingQueue.find(n => n.id == uid)) {
            throw new PromiseConcurrentQueueError(`Promise with uid ${uid} already in the queue`);
        }
        if (uid && this.executing.find(n => n.id == uid)) {
            throw new PromiseConcurrentQueueError(`Fetch with uid ${uid} already executing`);
        }

        // Create the function reference
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

    /**
     * Executes a function in the queue
     * @param functionRef Function reference to be executed
     */
    private executeFunction(functionRef: FunctionReference<T>): Promise<T> {
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

    /**
     * Safely triggers an event callback
     * @param eventType The type of event
     * @param functionRef The function reference
     * @param message Optional message to be passed
     */
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

    /**
     * Removes a function from the executing list
     * @param functionRef Function reference to be removed
     */
    private removeFromExecuting(functionRef: FunctionReference<T>): void {

        // Find the function in the executing list
        const id = functionRef.id;
        const index = this.executing.findIndex(n => n.id == id);
        if (index == -1) {
            // This should never happen
            this.safeTriggerEventCallback(
                "error",
                functionRef,
                `Unexpected error. Function ${id} not found in executing list`,
            );
        } else {
            // Remove from the list
            this.executing.splice(index, 1);
        }

        // Trigger the finish event
        this.safeTriggerEventCallback("finish", functionRef);

        // Check if we can start the next one
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

    /**
     * Enqueues a function to be executed later
     * @param functionRef Function reference to be enqueued
     */
    private enqueueFunction(functionRef: FunctionReference<T>): Promise<T> {
        // Trigger the enqueue event
        this.safeTriggerEventCallback("enqueue", functionRef);

        // Return a new Promise that resolves when the function is executed
        return new Promise((resolve, reject) => {
            // Set the resolve and reject from the function reference
            functionRef.resolve = resolve;
            functionRef.reject = reject;
            // Add to the list of
            this.waitingQueue.push(functionRef);
        });
    }

    /**
     * Returns the length of the waiting queue
     */
    public get waitingQueueLength(): number {
        return this.waitingQueue.length;
    }

    /**
     * Returns the number of the executing promises
     */
    public get numberOfExecuting(): number {
        return this.executing.length;
    }
}
