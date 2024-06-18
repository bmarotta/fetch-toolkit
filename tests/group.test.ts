import { FetchGroupHandler } from "../src/group";
import { PromiseConcurrentQueue } from "../src/parallel-promise-handler";
import { RequestInitToolkit } from "../src/types";

describe("FetchGroupHandler", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a FetchGroupHandler instance with the correct maxParallel value", () => {
        const maxParallel = 5;
        const fetchGroupHandler = new FetchGroupHandler(maxParallel);
        expect(fetchGroupHandler.maxParallel).toBe(maxParallel);
    });

    it("should call fetchToolkit with the correct arguments", async () => {
        const url = "http://example.com";
        const init = {} as RequestInit;
        const fetchGroupHandler = new FetchGroupHandler(5);

        const response = {
            status: 200,
            ok: true,
            json: jest.fn().mockResolvedValue({ data: "test" }),
        };

        const fetchMock = jest
            .spyOn(global, "fetch")
            .mockResolvedValue(response as unknown as Response);
        await fetchGroupHandler.fetch(url, init);

        expect(fetchMock).toHaveBeenCalledWith(url, init);
    });

    it("should call fetchToolkit with the init object without the 'handler' property", async () => {
        const url = "http://example.com";
        const init = { method: "GET", handler: {
            fetch: jest.fn().mockResolvedValue({ status: 200, ok: true }),
        } } as RequestInitToolkit;
        const fetchGroupHandler = new FetchGroupHandler(5);

        const response = await fetchGroupHandler.fetch(url, init);

        expect(response.status).toBe(200);
    });

    it("should return a promise that resolves with the response", async () => {
        const url = "http://example.com";
        const init = {} as RequestInit;
        const response = new Response();
        jest
            .spyOn(global, "fetch")
            .mockResolvedValue(response);
        const fetchGroupHandler = new FetchGroupHandler(5);

        const result = fetchGroupHandler.fetch(url, init);

        await expect(result).resolves.toBe(response);
    });

    it("should enqueue the request in the parallel promise handler", async () => {
        const url = "http://example.com";
        const init = {} as RequestInit;
        const fetchGroupHandler = new FetchGroupHandler(5);
        const response = new Response();
        jest
            .spyOn(global, "fetch")
            .mockResolvedValue(response);

        jest.spyOn(PromiseConcurrentQueue.prototype, "push");

        await fetchGroupHandler.fetch(url, init);

        expect(PromiseConcurrentQueue.prototype.push).toHaveBeenCalled();
    });

    it ("should add to the queue if the maxParallel limit is reached", async () => {
        const url = "http://example.com?param=";
        const fetchGroupHandler = new FetchGroupHandler(1);
        const response = new Response();
        jest
            .spyOn(global, "fetch")
            .mockResolvedValue(response);

        jest.spyOn(PromiseConcurrentQueue.prototype, "push");

        const promises = Promise.all([
            fetchGroupHandler.fetch(url + "1", {} as RequestInit),
            fetchGroupHandler.fetch(url + "2", {} as RequestInit),
            fetchGroupHandler.fetch(url + "3", {} as RequestInit),
            fetchGroupHandler.fetch(url + "4", {} as RequestInit),
        ]);

        expect(PromiseConcurrentQueue.prototype.push).toHaveBeenCalledTimes(4);
        expect(fetchGroupHandler.waitingQueueLength).toBe(3);
        expect(fetchGroupHandler.numberOfExecuting).toBe(1);
        await promises;
        expect(fetchGroupHandler.numberOfExecuting).toBe(0);
        expect(fetchGroupHandler.waitingQueueLength).toBe(0);
    });

});
