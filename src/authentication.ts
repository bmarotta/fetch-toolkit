import { HTTP_HEADER_AUTHORIZATION } from "./constants";
import { FetchDecorator } from "./types";
import { fetchSetHeader } from "./fetch-toolkit";

/**
 * Base class for authentication providers.
 */
export abstract class AuthenticationProvider implements FetchDecorator {

    /**
     * Decorate the request with the Authorization header.
     * @param url URL to decorate
     * @param init Fetch options
     */
    public decorateRequest(url: string, init: RequestInit) {
        const headerValue = this.getHeaderValue();
        if (headerValue) {
            fetchSetHeader(init, HTTP_HEADER_AUTHORIZATION, headerValue);
        }
    }

    /**
     * Get the value of the Authorization header.
     */
    protected abstract getHeaderValue(): string;
}

/**
 * Implements the Basic authentication provider. 
 * The Basic authentication provider uses a username and password to authenticate.
 * The username and password are encoded in base64 and sent in the Authorization header.
 */
export class BasicAuthenticationProvider extends AuthenticationProvider {

    /**
     * Constructor.
     * @param username Username
     * @param password Password
     */
    constructor(public username: string, public password: string) {
        super();
    }

    /**
     * Get the value of the Authorization header.
     */
    protected getHeaderValue(): string {
        const basicAuthEncoded = Buffer.from(`${this.username}:${this.password}`).toString(
            "base64",
        );
        return `Basic ${basicAuthEncoded}`;
    }
}

/**
 * Implements the Bearer authentication provider.
 * The Bearer authentication provider uses a token to authenticate.
 * The token is sent in the Authorization header.
 */
export class BearerAuthenticationProvider extends AuthenticationProvider {

    /**
     * Constructor.
     * @param token Token or function that returns a token
     * @param prefix Prefix for the authorization header. Default is "Bearer"
     */
    constructor(public token: string | (() => string), public prefix = "Bearer") {
        super();
    }

    /**
     * Set the value of the Authorization header to the token.
     * If the token is a function, call it to get the token.
     * Otherwise, use the token as is.
     * Exceptions are not handled here. If the token is a function and it throws an exception, it will be propagated.
     * @returns Value of the Authorization header
     */
    protected getHeaderValue(): string {
        const token = typeof this.token === "function" ? this.token() : this.token;
        return `${this.prefix} ${token}`;
    }
}
