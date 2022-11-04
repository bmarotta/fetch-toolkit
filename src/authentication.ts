import { HTTP_HEADER_AUTHORIZATION } from "./constants";
import { FetchDecorator } from "./types";
import { fetchSetHeader } from "./fetch-toolkit";

export abstract class AuthenticationProvider implements FetchDecorator {
    public decorateRequest(url: string, init: RequestInit) {
        const headerValue = this.getHeaderValue();
        if (headerValue) {
            fetchSetHeader(init, HTTP_HEADER_AUTHORIZATION, headerValue);
        }
    }
    protected abstract getHeaderValue(): string;
}

export class BasicAuthenticationProvider extends AuthenticationProvider {
    constructor(private username: string, private password: string) {
        super();
    }
    protected getHeaderValue(): string {
        const basicAuthEncoded = Buffer.from(`${this.username}:${this.password}`).toString(
            "base64",
        );
        return `Basic ${basicAuthEncoded}`;
    }
}

export class BearerAuthenticationProvider extends AuthenticationProvider {
    constructor(private token: string) {
        super();
    }
    protected getHeaderValue(): string {
        return `Bearer ${this.token}`;
    }
}
