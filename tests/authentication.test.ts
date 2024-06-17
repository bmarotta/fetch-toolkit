import { BasicAuthenticationProvider, BearerAuthenticationProvider } from "../src/authentication";

describe("BasicAuthenticationProvider", () => {
  it("should return the correct Authorization header value", () => {
    const username = "testuser";
    const password = "testpassword";
    const authProvider = new BasicAuthenticationProvider(username, password);
    const expectedHeaderValue = "Basic dGVzdHVzZXI6dGVzdHBhc3N3b3Jk";
    const init = {} as RequestInit;
    authProvider.decorateRequest("http://example.com", init);
    expect(init.headers).toHaveProperty("Authorization", expectedHeaderValue);
  });
});

describe("BearerAuthenticationProvider", () => {
  it("should return the correct Authorization header value with a static token", () => {
    const token = "testtoken";
    const authProvider = new BearerAuthenticationProvider(token);
    const expectedHeaderValue = "Bearer testtoken";
    const init = {} as RequestInit;
    authProvider.decorateRequest("http://example.com", init);
    expect(init.headers).toHaveProperty("Authorization", expectedHeaderValue);
  });

  it("should return the correct Authorization header value with a dynamic token", () => {
    const tokenFn = () => "testtoken";
    const authProvider = new BearerAuthenticationProvider(tokenFn);
    const expectedHeaderValue = "Bearer testtoken";
    const init = {} as RequestInit;
    authProvider.decorateRequest("http://example.com", init);
    expect(init.headers).toHaveProperty("Authorization", expectedHeaderValue);
  });
});