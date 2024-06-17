import { FetchLogger } from "../src/logging";

class DummyLogger extends FetchLogger {
  public logAction(message: string, type: string) {
    console.log(`${type}: ${message}`);
  }
}

describe("FetchLogger", () => {
  let logger: DummyLogger;

  beforeEach(() => {
    logger = new DummyLogger();
  });

  it("should log the request with the correct format", () => {
    const url = "http://example.com";
    const request = {
      uid: "123",
      method: "GET",
    };
    const expectedLog = ">> [123] GET http://example.com";
    const logActionSpy = jest.spyOn(logger, "logAction");

    logger.decorateRequest(url, request);

    expect(logActionSpy).toHaveBeenCalledWith(expectedLog, "Request");
  });

  it("should log the response with the correct format", () => {
    const request = {
      uid: "123",
    };
    const response = {
      status: 200,
      statusText: "OK",
    };
    const expectedLog = "<< [123] 200 OK";
    const logActionSpy = jest.spyOn(logger, "logAction");

    logger.decorateResponse("", request, response as unknown as Response);

    expect(logActionSpy).toHaveBeenCalledWith(expectedLog, "Response");
  });

  it("should log the request body when logBody is true", () => {
    logger = new DummyLogger(true, false);
    const request = {
      body: "test body",
    };
    const expectedLog = "   test body";
    const logActionSpy = jest.spyOn(logger, "logAction");

    logger.decorateRequest("", request);

    expect(logActionSpy).toHaveBeenCalledWith(expectedLog, "Body");
  });

  it("should log the request headers when logHeaders is true", () => {
    logger = new DummyLogger(false, true);
    const request = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      },
    };
    const expectedLogs = [
      "   -- Content-Type: application/json",
      "   -- Authorization: Bearer token",
    ];
    const logActionSpy = jest.spyOn(logger, "logAction");

    logger.decorateRequest("", request);

    expect(logActionSpy).toHaveBeenCalledTimes(3);
    expect(logActionSpy).toHaveBeenNthCalledWith(2, expectedLogs[0], "Header");
    expect(logActionSpy).toHaveBeenNthCalledWith(3, expectedLogs[1], "Header");
  });

  it("should log additional actions when logAdditionalAction is called", () => {
    const request = {
      uid: "123",
      decorators: [logger],
    };
    const message = "Additional action";
    const expectedLog = "-- [123] Additional action";
    const logActionSpy = jest.spyOn(logger, "logAction");

    FetchLogger.logAdditionalAction(message, request);

    expect(logActionSpy).toHaveBeenCalledWith(expectedLog, "Additional");
  });
});