# fetch-toolkit
Fetch API Toolkit for increased productivity.

## Highlights

 * Handles common fetch error handling, HTTP status and pitfalls
 * Implement API calls easily
 * Extensible via decorators. Out-of-the box decorators:
   * Authentication
   * Logging
   * Concurrency limit/throttling

# Installation

`npm install fetch-toolkit -s`

If you are running your application in the browser, you are all set. If you are running it with node.js you need to install some fetch API implementation. Example:

`npm install node-fetch -s`

# Basic Usage

## Making simple REST API calls

The `fetchJson` function is just a helper function, that will save something like 3 to 5 lines of code. Apart from doing a remote call, it converts the result  from JSON to a Javascript object, throws `FetchError`s in case of failure and tries to parse the response even in case of errors (e.g.: If the API returns an error object)

```typescript
import { fetchJson } from "fetch-toolkit";

function myCall: Promise<Myresult> {
  return fetchJson("https://example.com/rest/get");
}

```


## Implementing an API

To implement an API, create a new class that extends the `API` class. Create a function for each API method. You query and post parameters are automatically serialized to the URL or to the post body respectively. If using typescript, you can use strong-types for the request and response objects.

```typescript
import { API } from "fetch-toolkit";

export type Item {
  id: string;
  name: string;
}

export type PaginationParams {
  "max-items": number | undefined;
  "start-index": number | undefined;
}

export class MyApi extends API {

  getAllItems(pagination: PaginationParams): Promise<Item> {
    return this.get<Item>(`/api/latest/items`, pagination);
  }

  getItem(id: string): Promise<Item> {
    return this.get<Item>(`/api/latest/items/${id}`);
  }

  updateItem(id: string, item: Item): Promise<void> {
    return this.post<void>(`/api/latest/items/${id}`, item);
  }
}
```

## Adding authentication

To add authentication to the API, just select a suitable authentication provider or implent your custom one. `fetch-toolkit` currently implements the `BasicAuthenticationProvider` and `BearerAutheticationProvider`

```typescript
import { API, BasicAuthenticationProvider } from "fetch-toolkit";

export class MyApi extends API {

  constructor(baseUrl: string, username: string, password: string) {
    super(baseUrl, new BasicAuthenticationProvider(username, password));
  }

  ...
}
```

## Limiting the number of parallel calls

APIs often impose limits on the number of calls a client can make. To avoid exceeding this limit, you can configure the maxParallel parameter when setting up the API. This parameter sets an upper limit on the number of concurrent API calls. Once this limit is reached, any additional calls will be queued and processed once the ongoing calls complete.

```typescript
import { API, BasicAuthenticationProvider } from "fetch-toolkit";

const MAX_PARALLEL = 2;

export class MyApi extends API {

  constructor(baseUrl: string, username: string, password: string) {
    super(baseUrl, new BasicAuthenticationProvider(username, password), MAX_PARALLEL);
  }

  ...
}
```

## Logging the API calls

For debug purposes, you can log all the API calls. Currently only the `FetchConsoleLogger` is available, but you can implement your own logger by extending the `FetchLogger` class.

```typescript
import { API, BearerAuthenticationProvider, FetchConsoleLogger } from "fetch-toolkit";

export class MyApi extends API {
    constructor(readonly baseUrl: string, readonly authToken: string) {
        super(baseUrl, new BearerAuthenticationProvider(authToken), 2, new FetchConsoleLogger());
    }

    ...
}
```
