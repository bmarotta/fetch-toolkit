import * as ftModule from "../src/fetch-toolkit";
import * as util from "../src/util";
import { FetchError, RequestInitToolkit } from "../src/types";

describe("fetchToolkit Core", () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return the response as JSON", async () => {
    const url = "http://example.com";
    const response = {
      status: 200,
      ok: true,
      json: jest.fn().mockResolvedValue({ data: "test" }),
    };
    const init = {};
    
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(response as unknown as Response);
    const fetchSetHeaderSpy = jest.spyOn(ftModule, "fetchSetHeader").mockImplementation(() => init);
    const result = await ftModule.fetchJson(url, init);

    expect(fetchSetHeaderSpy).toHaveBeenCalledWith(init, "Accept", "application/json");
    expect(fetchSpy).toHaveBeenCalledWith(url, init);
    expect(response.json).toHaveBeenCalled();
    expect(result).toEqual({ data: "test" });
  });

  it("should return undefined for a 204 status code", async () => {
    const url = "http://example.com";
    const response = {
      status: 204,
      ok: true,
    };
    const init = {};
    
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(response as unknown as Response);
    const fetchSetHeaderSpy = jest.spyOn(ftModule, "fetchSetHeader").mockReturnValue(init);

    const result = await ftModule.fetchJson(url, init);

    expect(fetchSetHeaderSpy).toHaveBeenCalledWith(init, "Accept", "application/json");
    expect(fetchSpy).toHaveBeenCalledWith(url, init);
    expect(result).toBeUndefined();
  });

  it("should throw FetchError for a non-OK response", async () => {
    const url = "http://example.com";
    const response = {
      status: 400,
      ok: false,
      statusText: "Bad Request",
      text: jest.fn().mockResolvedValue(`{"error": "Error message"}`),
    };
    const init = {};
    
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(response as unknown as Response);
    const fetchSetHeaderSpy = jest.spyOn(ftModule, "fetchSetHeader").mockImplementation((init) => init ?? {} as RequestInitToolkit);

    await expect(ftModule.fetchJson(url, init)).rejects.toThrow(
      new FetchError(url, response.status, response.statusText, `{"error": "Error message"}`)
    );

    expect(fetchSetHeaderSpy).toHaveBeenCalledWith(init, "Accept", "application/json");
    expect(fetchSpy).toHaveBeenCalledWith(url, init);
    expect(response.text).toHaveBeenCalled();
  });

  it("should call fetch with the provided URL and init", async () => {
    const url = "http://example.com";
    const init = {} as RequestInit;
    const response = {
      status: 200,
      ok: true,
    };
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(response as unknown as Response);

    const result = await ftModule.fetchToolkit(url, init);

    expect(fetchSpy).toHaveBeenCalledWith(url, init);
    expect(result).toEqual(response);
  });

  it("should call the fetch handler if provided", async () => {
    const url = "http://example.com";
    const init = {
      handler: {
        fetch: jest.fn().mockResolvedValue({ status: 200, ok: true }),
      },
    } as RequestInitToolkit;

    const result = await ftModule.fetchToolkit(url, init);

    expect(init.handler?.fetch).toHaveBeenCalledWith(url, init);
    expect(result).toEqual({ status: 200, ok: true });
  });

  it("should call the request and response decorators if provided", async () => {
    const url = "http://example.com";
    let calledDecorateRequest = false;
    let calledDecorateResponse = false;
    const init = {
      decorators: [
        {
          decorateRequest: jest.fn().mockImplementation((url, request) => { calledDecorateRequest = true; })
        },
        {
          decorateResponse: jest.fn().mockImplementation((url, request) => { calledDecorateResponse = true; }),
        },
      ],
    } as RequestInitToolkit;
    jest.spyOn(global, "fetch").mockResolvedValue({
      status: 200,
      ok: true,
    } as unknown as Response);

    const result = await ftModule.fetchToolkit(url, init);

    expect(calledDecorateRequest).toBe(true);
    expect(calledDecorateResponse).toBe(true);
    expect(result).toEqual({ status: 200, ok: true });
  });

  it("should throw FetchError for a non-OK response", async () => {
    const url = "http://example.com";
    const init = {} as RequestInit;
    const response = {
      status: 400,
      ok: false,
      statusText: "Bad Request",
      text: jest.fn().mockResolvedValue("Error message"),
    };
    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue(response as unknown as Response);

    await expect(ftModule.fetchToolkit(url, init)).rejects.toThrow(
      new FetchError(url, response.status, response.statusText, "Error message")
    );

    expect(fetchSpy).toHaveBeenCalledWith(url, init);
    expect(response.text).toHaveBeenCalled();
  });

  it("should set the header value if it does not exist", () => {
    const init = {} as RequestInitToolkit;
    const headerName = "Authorization";
    const headerValue = "Bearer token";

    const result = ftModule.fetchSetHeader(init, headerName, headerValue);

    expect(result.headers).toEqual({ Authorization: "Bearer token" });
  });

  it("should overwrite the header value if overwrite is set", () => {
    const init = {
      headers: {
        Authorization: "Bearer old-token",
      },
    } as RequestInitToolkit;
    const headerName = "Authorization";
    const headerValue = "Bearer new-token";

    let result = ftModule.fetchSetHeader(init, headerName, headerValue);

    expect(result.headers).toEqual({ Authorization: "Bearer old-token" });

    result = ftModule.fetchSetHeader(init, headerName, headerValue, true);

    expect(result.headers).toEqual({ Authorization: "Bearer new-token" });
  });

  it("should create a new headers object if it does not exist", () => {
    const init = {} as RequestInitToolkit;
    const headerName = "Authorization";
    const headerValue = "Bearer token";

    const result = ftModule.fetchSetHeader(init, headerName, headerValue);

    expect(result.headers).toEqual({ Authorization: "Bearer token" });
  });

  it("should return the updated init object", () => {
    const init = {} as RequestInitToolkit;
    const headerName = "Authorization";
    const headerValue = "Bearer token";

    const result = ftModule.fetchSetHeader(init, headerName, headerValue);

    expect(result).toBe(init);
  });

  it("should generate a new uid if it does not exist", () => {
    const init = {} as RequestInitToolkit;
    const generateUidBasedOnTimestampSpy = jest.spyOn(util, "generateUidBasedOnTimestamp").mockReturnValue("12345");

    ftModule.fetchEnsureUid(init);

    expect(generateUidBasedOnTimestampSpy).toHaveBeenCalled();
    expect(init.uid).toBe("12345");
  });

  it("should not generate a new uid if it already exists", () => {
    const init = {
      uid: "12345",
    } as RequestInitToolkit;
    const generateUidBasedOnTimestampSpy = jest.spyOn(util, "generateUidBasedOnTimestamp");

    ftModule.fetchEnsureUid(init);

    expect(generateUidBasedOnTimestampSpy).not.toHaveBeenCalled();
    expect(init.uid).toBe("12345");
  });
});