import { generateUidBasedOnTimestamp } from "../src/util";
import {
    PromiseConcurrentQueue,
    PromiseConcurrentQueueError,
} from "../src/parallel-promise-handler";

Object.defineProperty(global, 'performance', {
    writable: true,
  });

describe("PromiseConcurrentQueue", () => {

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe("push", () => {
        it("should execute the function immediately if maxParallel is not set", async () => {
            const func = jest.fn().mockResolvedValue("result");
            const queue = new PromiseConcurrentQueue<string>(1);
            const result = await queue.push(func);
            expect(func).toHaveBeenCalled();
            expect(result).toBe("result");
        });

        it("should execute the function immediately if executing count is less than maxParallel", async () => {
            const func = jest.fn().mockResolvedValue("result");
            const queue = new PromiseConcurrentQueue<string>(2);
            await queue.push(() => Promise.resolve("Something else"));
            const result = await queue.push(func);
            expect(func).toHaveBeenCalled();
            expect(result).toBe("result");
        });

        it("should enqueue the function if executing count is equal to maxParallel", async () => {
            const func = jest.fn().mockResolvedValue("result");
            const queue = new PromiseConcurrentQueue<string>(2);
            queue.push(() => Promise.resolve("Call 1"));
            queue.push(() => Promise.resolve("Call 2"));
            const result = await queue.push(func);
            expect(func).toHaveBeenCalled();
            expect(result).toBe("result");
        });

        it("should throw an error if uid is already in the queue", async () => {
            const queue = new PromiseConcurrentQueue<string>(1);
            queue.push(() => Promise.resolve("Call 1"), "uid");
            await expect(() => queue.push(() => Promise.resolve("Call 2"), "uid")).toThrow();
        });
    });
});
