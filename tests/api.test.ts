import { FetchConsoleLogger, FetchDecorator, RequestInitToolkit, fetchSetHeader } from "../src";
import { API } from "../src/api";
import { BasicAuthenticationProvider, BearerAuthenticationProvider } from "../src/authentication";

describe("API", () => {
    const baseUrl = "http://example.com";
    const authentication = new BasicAuthenticationProvider("testuser", "testpassword");

    let api: API;

    beforeEach(() => {
        api = new API(baseUrl, authentication);
    });

    describe("call", () => {
        it("should make a request with the correct method, endpoint, and params", async () => {
            // Arrange
            const endpoint = "/users";
            const params = { page: 1, limit: 10 };
            const response = {
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: [],
                }),
            };

            let url: URL | RequestInfo = "";
            let headers: HeadersInit | undefined = undefined;

            const fetchMock = jest.spyOn(global, "fetch").mockImplementation(
                (input, init) =>
                    new Promise(resolve => {
                        url = input;
                        headers = init?.headers;
                        resolve(response as unknown as Response);
                    }),
            );

            // Act
            const result = await api.get(endpoint, params);

            // Assert
            expect(result).toEqual({ data: [] });
            expect(url).toBe("http://example.com/users?page=1&limit=10");
            expect(headers).toEqual({
                Accept: "application/json",
                Authorization: "Basic " + btoa("testuser:testpassword"),
            });
            expect(fetchMock).toHaveBeenCalled();
        });

        it("should make a request with the correct method, endpoint, body, and authentication", async () => {
            // Arrange
            const endpoint = "/users";
            const body = { name: "John Doe", email: "john.doe@example.com" };
            const response = {
                ok: true,
                json: jest.fn().mockResolvedValue({
                    data: [],
                }),
            };

            let url: URL | RequestInfo = "";
            let reqBody: BodyInit | null | undefined = undefined;
            let reqMethod: string | undefined = undefined;

            const fetchMock = jest.spyOn(global, "fetch").mockImplementation(
                (input, init) =>
                    new Promise(resolve => {
                        url = input;
                        reqBody = init?.body;
                        reqMethod = init?.method;
                        resolve(response as unknown as Response);
                    }),
            );

            // Act
            const result = await api.post(endpoint, body);

            // Assert
            expect(result).toEqual({ data: [] });
            expect(fetchMock).toHaveBeenCalled();
            expect(url).toBe("http://example.com/users");
            expect(reqBody).toBe(JSON.stringify(body));
            expect(reqMethod).toBe("POST");
        });

        it("should make a delete request with the correct method, endpoint, body, and authentication", async () => {
            // Arrange
            const endpoint = "/users";
            const params = { email: "john.doe@example.com" };
            const response = {
                ok: true,
                status: 204,                
            };

            let url: URL | RequestInfo = "";
            let reqMethod: string | undefined = undefined;

            const fetchMock = jest.spyOn(global, "fetch").mockImplementation(
                (input, init) =>
                    new Promise(resolve => {
                        url = input;
                        reqMethod = init?.method;
                        resolve(response as unknown as Response);
                    }),
            );

            // Act
            const result = await api.delete(endpoint, params);

            // Assert
            expect(result).toBeUndefined();
            expect(fetchMock).toHaveBeenCalled();
            expect(url).toBe("http://example.com/users?email=john.doe%40example.com");
            expect(reqMethod).toBe("DELETE");
        });

        it("can use the auxiliary decorators to modify the request and response", async () => {
            // Arrange
            class CustomHeaderDecorator implements FetchDecorator {
                constructor(private header: string, private value: string) {}

                decorateRequest(_url: string, request: RequestInitToolkit) {  
                    fetchSetHeader(request, this.header, this.value);            
                }
            }

            // Act
            const customHeaderDecorator = new CustomHeaderDecorator("X-Custom-Header", "test");
            api = new API(baseUrl, authentication, 2, new FetchConsoleLogger(), [customHeaderDecorator]);

            // Assert
            expect(api.customDecorators).toHaveLength(1);
            expect(api.customDecorators?.[0]).toBe(customHeaderDecorator);
            expect(api.groupHandler?.maxParallel).toBe(2);
            expect(api.logger).toBeInstanceOf(FetchConsoleLogger);
        });
    });

    describe("authentication", () => {
        it("should use BasicAuthenticationProvider for authentication", async () => {
            // Arrange
            const authProvider = api.authentication;

            // Assert
            expect(authProvider).toBeInstanceOf(BasicAuthenticationProvider);
        });

        // Add more test cases for other authentication providers
    });
})
