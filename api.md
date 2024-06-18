<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Fetch Toolkit API Reference](#fetch-toolkit-api-reference)
  - [Classes](#classes)
    - [Class: API](#class-api)
    - [Class: `abstract` AuthenticationProvider](#class-abstract-authenticationprovider)
    - [Class: BasicAuthenticationProvider](#class-basicauthenticationprovider)
    - [Class: BearerAuthenticationProvider](#class-bearerauthenticationprovider)
    - [Class: FetchConsoleLogger](#class-fetchconsolelogger)
    - [Class: FetchError](#class-fetcherror)
    - [Class: FetchGroupHandler](#class-fetchgrouphandler)
    - [Class: FetchGroupHandlerError](#class-fetchgrouphandlererror)
    - [Class: `abstract` FetchHandler](#class-abstract-fetchhandler)
    - [Class: `abstract` FetchLogger](#class-abstract-fetchlogger)
    - [Class: PromiseConcurrentQueue\<T\>](#class-promiseconcurrentqueue%5Ct%5C)
  - [Functions](#functions)
    - [Function: fetchJson()](#function-fetchjson)
    - [Function: fetchSetHeader()](#function-fetchsetheader)
  - [fetch-toolkit](#fetch-toolkit)
    - [Classes](#classes-1)
    - [Interfaces](#interfaces)
    - [Type Aliases](#type-aliases)
    - [Variables](#variables)
    - [Functions](#functions-1)
  - [Interfaces](#interfaces-1)
    - [Interface: FetchDecorator](#interface-fetchdecorator)
    - [Interface: RequestInitToolkit](#interface-requestinittoolkit)
  - [Type Aliases](#type-aliases-1)
    - [Type alias: HttpMethod](#type-alias-httpmethod)
    - [Type alias: OnEventCallback()](#type-alias-oneventcallback)
    - [Type alias: ParallelFunctionEventType](#type-alias-parallelfunctioneventtype)
  - [Variables](#variables-1)
    - [Variable: HTTP\_HEADER\_ACCEPT](#variable-http%5C_header%5C_accept)
    - [Variable: HTTP\_HEADER\_ACCEPT\_JSON](#variable-http%5C_header%5C_accept%5C_json)
    - [Variable: HTTP\_HEADER\_AUTHORIZATION](#variable-http%5C_header%5C_authorization)
    - [Variable: HTTP\_HEADER\_CONTENT\_TYPE](#variable-http%5C_header%5C_content%5C_type)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Fetch Toolkit API Reference

## Classes


<a name="fetch-toolkit-api-referenceclassesapimd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / API

### Class: API

Represents an API client that makes HTTP requests to a specified base URL.

#### Constructors

##### new API()

> **new API**(`baseUrl`, `authentication`?, `maxParallel`?, `logger`?, `customDecorators`?): [`API`](#fetch-toolkit-api-referenceclassesapimd)

Creates an instance of the API client.

###### Parameters

• **baseUrl**: `string`

The base URL of the API.

• **authentication?**: [`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd)

Optional authentication provider for the API (see [AuthenticationProvider](#fetch-toolkit-api-referenceclassesauthenticationprovidermd))

• **maxParallel?**: `number`

Optional maximum number of parallel requests to be handled. If not provided, no limit is set.

• **logger?**: [`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd)

Optional logger for the API (see [FetchLogger](#fetch-toolkit-api-referenceclassesfetchloggermd))

• **customDecorators?**: [`FetchDecorator`](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd)[]

Optional custom decorators for the API (see [FetchDecorator](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd))

###### Returns

[`API`](#fetch-toolkit-api-referenceclassesapimd)

###### Source

[src/api.ts:37](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L37)

#### Properties

##### authentication?

> `optional` **authentication**: [`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd)

Optional authentication provider for the API (see [AuthenticationProvider](#fetch-toolkit-api-referenceclassesauthenticationprovidermd))

###### Source

[src/api.ts:39](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L39)

***

##### baseUrl

> `readonly` **baseUrl**: `string`

The base URL of the API.

###### Source

[src/api.ts:38](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L38)

***

##### customDecorators?

> `optional` **customDecorators**: [`FetchDecorator`](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd)[]

Optional custom decorators for the API (see [FetchDecorator](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd))

###### Source

[src/api.ts:42](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L42)

***

##### groupHandler?

> `optional` **groupHandler**: [`FetchGroupHandler`](#fetch-toolkit-api-referenceclassesfetchgrouphandlermd)

The handler for managing parallel requests (optional). See [FetchGroupHandler](#fetch-toolkit-api-referenceclassesfetchgrouphandlermd).

###### Source

[src/api.ts:27](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L27)

***

##### logger?

> `optional` **logger**: [`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd)

Optional logger for the API (see [FetchLogger](#fetch-toolkit-api-referenceclassesfetchloggermd))

###### Source

[src/api.ts:41](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L41)

#### Methods

##### call()

> **call**\<`T`\>(`method`, `endpoint`, `params`?, `body`?): `Promise`\<`T`\>

Makes an HTTP request to the API. The method returns the defined return type. 
Please note that no validation is done on the return type.

###### Type parameters

• **T**

###### Parameters

• **method**: [`HttpMethod`](#fetch-toolkit-api-referencetype-aliaseshttpmethodmd)

The HTTP method of the request.

• **endpoint**: `string`

The endpoint of the request.

• **params?**: `any`

The query parameters of the request.

• **body?**: `unknown`

The body of the request.

###### Returns

`Promise`\<`T`\>

A promise that resolves to the defined return.

###### Source

[src/api.ts:58](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L58)

***

##### delete()

> **delete**\<`T`\>(`endpoint`, `params`?, `body`?): `Promise`\<`T`\>

Makes a DELETE request to the API. The method returns the defined return type. 
Please note that no validation is done on the return type.

###### Type parameters

• **T**

###### Parameters

• **endpoint**: `string`

The endpoint of the request.

• **params?**: `any`

The query parameters of the request.

• **body?**: `unknown`

The body of the request.

###### Returns

`Promise`\<`T`\>

A promise that resolves to the response data.

###### Source

[src/api.ts:110](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L110)

***

##### get()

> **get**\<`T`\>(`endpoint`, `params`?): `Promise`\<`T`\>

Makes a GET request to the API. The method returns the defined return type. 
Please note that no validation is done on the return type.

###### Type parameters

• **T**

###### Parameters

• **endpoint**: `string`

The endpoint of the request.

• **params?**: `any`

The query parameters of the request.

###### Returns

`Promise`\<`T`\>

A promise that resolves to the response data.

###### Source

[src/api.ts:98](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L98)

***

##### patch()

> **patch**\<`T`\>(`endpoint`, `body`, `params`?): `Promise`\<`T`\>

Makes a PATCH request to the API. The method returns the defined return type. 
Please note that no validation is done on the return type.

###### Type parameters

• **T**

###### Parameters

• **endpoint**: `string`

The endpoint of the request.

• **body**: `unknown`

The body of the request.

• **params?**: `any`

The query parameters of the request.

###### Returns

`Promise`\<`T`\>

A promise that resolves to the response data.

###### Source

[src/api.ts:122](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L122)

***

##### post()

> **post**\<`T`\>(`endpoint`, `body`, `params`?): `Promise`\<`T`\>

Makes a POST request to the API. The method returns the defined return type. 
Please note that no validation is done on the return type.

###### Type parameters

• **T**

###### Parameters

• **endpoint**: `string`

The endpoint of the request.

• **body**: `unknown`

The body of the request.

• **params?**: `any`

The query parameters of the request.

###### Returns

`Promise`\<`T`\>

A promise that resolves to the response data.

###### Source

[src/api.ts:134](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L134)

***

##### put()

> **put**\<`T`\>(`endpoint`, `body`, `params`?): `Promise`\<`T`\>

Makes a PUT request to the API. The method returns the defined return type. 
Please note that no validation is done on the return type.

###### Type parameters

• **T**

###### Parameters

• **endpoint**: `string`

The endpoint of the request.

• **body**: `unknown`

The body of the request.

• **params?**: `any`

The query parameters of the request.

###### Returns

`Promise`\<`T`\>

A promise that resolves to the response data.

###### Source

[src/api.ts:146](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/api.ts#L146)


<a name="fetch-toolkit-api-referenceclassesauthenticationprovidermd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / AuthenticationProvider

### Class: `abstract` AuthenticationProvider

Base class for authentication providers.

#### Extended by

- [`BasicAuthenticationProvider`](#fetch-toolkit-api-referenceclassesbasicauthenticationprovidermd)
- [`BearerAuthenticationProvider`](#fetch-toolkit-api-referenceclassesbearerauthenticationprovidermd)

#### Implements

- [`FetchDecorator`](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd)

#### Constructors

##### new AuthenticationProvider()

> **new AuthenticationProvider**(): [`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd)

###### Returns

[`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd)

#### Methods

##### decorateRequest()

> **decorateRequest**(`_url`, `init`): `Promise`\<`void`\>

Decorate the request with the Authorization header.

###### Parameters

• **\_url**: `string`

URL to decorate. Irrelevant for this implementation

• **init**: `RequestInit`

Fetch options

###### Returns

`Promise`\<`void`\>

###### Implementation of

[`FetchDecorator`](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd).[`decorateRequest`](#decoraterequest)

###### Source

[src/authentication.ts:15](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L15)

***

##### getHeaderValue()

> `protected` `abstract` **getHeaderValue**(): `string` \| `Promise`\<`string`\>

Get the value of the Authorization header.

###### Returns

`string` \| `Promise`\<`string`\>

###### Source

[src/authentication.ts:25](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L25)


<a name="fetch-toolkit-api-referenceclassesbasicauthenticationprovidermd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / BasicAuthenticationProvider

### Class: BasicAuthenticationProvider

Implements the Basic authentication provider. 
The Basic authentication provider uses a username and password to authenticate.
The username and password are encoded in base64 and sent in the Authorization header.

#### Extends

- [`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd)

#### Constructors

##### new BasicAuthenticationProvider()

> **new BasicAuthenticationProvider**(`username`, `password`): [`BasicAuthenticationProvider`](#fetch-toolkit-api-referenceclassesbasicauthenticationprovidermd)

Constructor.

###### Parameters

• **username**: `string`

Username

• **password**: `string`

Password

###### Returns

[`BasicAuthenticationProvider`](#fetch-toolkit-api-referenceclassesbasicauthenticationprovidermd)

###### Overrides

[`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd).[`constructor`](#constructors)

###### Source

[src/authentication.ts:40](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L40)

#### Properties

##### password

> **password**: `string`

Password

###### Source

[src/authentication.ts:40](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L40)

***

##### username

> **username**: `string`

Username

###### Source

[src/authentication.ts:40](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L40)

#### Methods

##### decorateRequest()

> **decorateRequest**(`_url`, `init`): `Promise`\<`void`\>

Decorate the request with the Authorization header.

###### Parameters

• **\_url**: `string`

URL to decorate. Irrelevant for this implementation

• **init**: `RequestInit`

Fetch options

###### Returns

`Promise`\<`void`\>

###### Inherited from

[`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd).[`decorateRequest`](#decoraterequest)

###### Source

[src/authentication.ts:15](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L15)

***

##### getHeaderValue()

> `protected` **getHeaderValue**(): `string`

Get the value of the Authorization header.

###### Returns

`string`

###### Overrides

[`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd).[`getHeaderValue`](#getheadervalue)

###### Source

[src/authentication.ts:47](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L47)


<a name="fetch-toolkit-api-referenceclassesbearerauthenticationprovidermd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / BearerAuthenticationProvider

### Class: BearerAuthenticationProvider

Implements the Bearer authentication provider.
The Bearer authentication provider uses a token to authenticate.
The token is sent in the Authorization header.

#### Extends

- [`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd)

#### Constructors

##### new BearerAuthenticationProvider()

> **new BearerAuthenticationProvider**(`token`, `prefix`): [`BearerAuthenticationProvider`](#fetch-toolkit-api-referenceclassesbearerauthenticationprovidermd)

Constructor.

###### Parameters

• **token**: `string` \| () => `string` \| `Promise`\<`string`\>

Token or function that returns a token

• **prefix**: `string`= `"Bearer"`

Prefix for the authorization header. Default is "Bearer"

###### Returns

[`BearerAuthenticationProvider`](#fetch-toolkit-api-referenceclassesbearerauthenticationprovidermd)

###### Overrides

[`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd).[`constructor`](#constructors)

###### Source

[src/authentication.ts:67](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L67)

#### Properties

##### prefix

> **prefix**: `string` = `"Bearer"`

Prefix for the authorization header. Default is "Bearer"

###### Source

[src/authentication.ts:67](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L67)

***

##### token

> **token**: `string` \| () => `string` \| `Promise`\<`string`\>

Token or function that returns a token

###### Source

[src/authentication.ts:67](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L67)

#### Methods

##### decorateRequest()

> **decorateRequest**(`_url`, `init`): `Promise`\<`void`\>

Decorate the request with the Authorization header.

###### Parameters

• **\_url**: `string`

URL to decorate. Irrelevant for this implementation

• **init**: `RequestInit`

Fetch options

###### Returns

`Promise`\<`void`\>

###### Inherited from

[`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd).[`decorateRequest`](#decoraterequest)

###### Source

[src/authentication.ts:15](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L15)

***

##### getHeaderValue()

> `protected` **getHeaderValue**(): `Promise`\<`string`\>

Set the value of the Authorization header to the token.
If the token is a function, call it to get the token.
Otherwise, use the token as is.
Exceptions are not handled here. If the token is a function and it throws an exception, it will be propagated.

###### Returns

`Promise`\<`string`\>

Value of the Authorization header

###### Overrides

[`AuthenticationProvider`](#fetch-toolkit-api-referenceclassesauthenticationprovidermd).[`getHeaderValue`](#getheadervalue)

###### Source

[src/authentication.ts:78](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/authentication.ts#L78)


<a name="fetch-toolkit-api-referenceclassesfetchconsoleloggermd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / FetchConsoleLogger

### Class: FetchConsoleLogger

A logger that logs to the console.

#### Extends

- [`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd)

#### Constructors

##### new FetchConsoleLogger()

> **new FetchConsoleLogger**(`logBody`, `logHeaders`): [`FetchConsoleLogger`](#fetch-toolkit-api-referenceclassesfetchconsoleloggermd)

###### Parameters

• **logBody**: `boolean`= `false`

• **logHeaders**: `boolean`= `false`

###### Returns

[`FetchConsoleLogger`](#fetch-toolkit-api-referenceclassesfetchconsoleloggermd)

###### Overrides

[`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd).[`constructor`](#constructors)

###### Inherit Doc

###### Source

[src/logging.ts:131](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L131)

#### Properties

##### logBody

> `protected` **logBody**: `boolean` = `false`

Log the body of the request.

###### Inherited from

[`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd).[`logBody`](#logbody)

###### Source

[src/logging.ts:14](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L14)

***

##### logHeaders

> `protected` **logHeaders**: `boolean` = `false`

Log the headers of the request.

###### Inherited from

[`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd).[`logHeaders`](#logheaders)

###### Source

[src/logging.ts:14](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L14)

#### Methods

##### decorateRequest()

> **decorateRequest**(`url`, `request`): `void`

Decorates the request with logging.

###### Parameters

• **url**: `string`

URL to decorate.

• **request**: [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

Fetch options.

###### Returns

`void`

void

###### Inherited from

[`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd).[`decorateRequest`](#decoraterequest)

###### Source

[src/logging.ts:23](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L23)

***

##### decorateResponse()

> **decorateResponse**(`_url`, `request`, `response`): `void`

Decorates the response with logging.

###### Parameters

• **\_url**: `string`

URL to decorate (not used in this implementation)

• **request**: [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

Fetch options.

• **response**: `Response`

Fetch response.

###### Returns

`void`

void

###### Inherited from

[`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd).[`decorateResponse`](#decorateresponse)

###### Source

[src/logging.ts:75](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L75)

***

##### logAction()

> `protected` **logAction**(`logStr`): `void`

Logs the action to the console as debug.

###### Parameters

• **logStr**: `string`

The string to log.

###### Returns

`void`

###### Overrides

[`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd).[`logAction`](#logaction)

###### Source

[src/logging.ts:139](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L139)

***

##### logAdditionalAction()

> `static` **logAdditionalAction**(`message`, `request`?): `void`

Helper method to log an additional action performed by the fetching process which is not a request or response.

###### Parameters

• **message**: `string`

Message to log.

• **request?**: [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

Fetch options.

###### Returns

`void`

###### Inherited from

[`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd).[`logAdditionalAction`](#logadditionalaction)

###### Source

[src/logging.ts:101](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L101)


<a name="fetch-toolkit-api-referenceclassesfetcherrormd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / FetchError

### Class: FetchError

Error thrown on a faulty fetch request

#### Extends

- `Error`

#### Constructors

##### new FetchError()

> **new FetchError**(`url`, `status`, `statusText`, `responseText`?): [`FetchError`](#fetch-toolkit-api-referenceclassesfetcherrormd)

###### Parameters

• **url**: `string`

• **status**: `number`

• **statusText**: `string`

• **responseText?**: `string`

###### Returns

[`FetchError`](#fetch-toolkit-api-referenceclassesfetcherrormd)

###### Overrides

`Error.constructor`

###### Source

[src/types.ts:7](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L7)

#### Properties

##### message

> **message**: `string`

###### Inherited from

`Error.message`

###### Source

node\_modules/typescript/lib/lib.es5.d.ts:1054

***

##### name

> **name**: `string`

###### Inherited from

`Error.name`

###### Source

node\_modules/typescript/lib/lib.es5.d.ts:1053

***

##### responseText?

> `optional` `readonly` **responseText**: `string`

###### Source

[src/types.ts:11](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L11)

***

##### stack?

> `optional` **stack**: `string`

###### Inherited from

`Error.stack`

###### Source

node\_modules/typescript/lib/lib.es5.d.ts:1055

***

##### status

> `readonly` **status**: `number`

###### Source

[src/types.ts:9](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L9)

***

##### statusText

> `readonly` **statusText**: `string`

###### Source

[src/types.ts:10](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L10)

***

##### url

> `readonly` **url**: `string`

###### Source

[src/types.ts:8](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L8)

***

##### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

###### Returns

`any`

###### Inherited from

`Error.prepareStackTrace`

###### Source

node\_modules/@types/node/globals.d.ts:28

***

##### stackTraceLimit

> `static` **stackTraceLimit**: `number`

###### Inherited from

`Error.stackTraceLimit`

###### Source

node\_modules/@types/node/globals.d.ts:30

#### Methods

##### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

###### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

###### Returns

`void`

###### Inherited from

`Error.captureStackTrace`

###### Source

node\_modules/@types/node/globals.d.ts:21


<a name="fetch-toolkit-api-referenceclassesfetchgrouphandlermd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / FetchGroupHandler

### Class: FetchGroupHandler

Handles fetching requests that share a context with a maximum number of parallel requests.

#### Extends

- [`FetchHandler`](#fetch-toolkit-api-referenceclassesfetchhandlermd)

#### Constructors

##### new FetchGroupHandler()

> **new FetchGroupHandler**(`maxParallel`): [`FetchGroupHandler`](#fetch-toolkit-api-referenceclassesfetchgrouphandlermd)

Creates an instance of FetchGroupHandler.

###### Parameters

• **maxParallel**: `number`

The maximum number of parallel requests to handle.

###### Returns

[`FetchGroupHandler`](#fetch-toolkit-api-referenceclassesfetchgrouphandlermd)

###### Overrides

[`FetchHandler`](#fetch-toolkit-api-referenceclassesfetchhandlermd).[`constructor`](#constructors)

###### Source

[src/group.ts:21](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/group.ts#L21)

#### Properties

##### maxParallel

> `readonly` **maxParallel**: `number`

The maximum number of parallel requests to handle.

###### Source

[src/group.ts:21](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/group.ts#L21)

#### Accessors

##### numberOfExecuting

> `get` **numberOfExecuting**(): `number`

Returns the number of the executing fetch requests

###### Returns

`number`

###### Source

[src/group.ts:81](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/group.ts#L81)

***

##### waitingQueueLength

> `get` **waitingQueueLength**(): `number`

Returns the length of the waiting queue

###### Returns

`number`

###### Source

[src/group.ts:74](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/group.ts#L74)

#### Methods

##### fetch()

> **fetch**(`url`, `init`?): `Promise`\<`Response`\>

Fetches a resource from the specified URL.

###### Parameters

• **url**: `string`

The URL of the resource to fetch.

• **init?**: [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

The optional request initialization options.

###### Returns

`Promise`\<`Response`\>

A Promise that resolves to the Response object representing the fetched resource.

###### Overrides

[`FetchHandler`](#fetch-toolkit-api-referenceclassesfetchhandlermd).[`fetch`](#fetch)

###### Source

[src/group.ts:50](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/group.ts#L50)


<a name="fetch-toolkit-api-referenceclassesfetchgrouphandlererrormd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / FetchGroupHandlerError

### Class: FetchGroupHandlerError

Represents an error that can occur in the FetchGroupHandler class.

#### Extends

- `Error`

#### Constructors

##### new FetchGroupHandlerError()

> **new FetchGroupHandlerError**(`message`?): [`FetchGroupHandlerError`](#fetch-toolkit-api-referenceclassesfetchgrouphandlererrormd)

###### Parameters

• **message?**: `string`

###### Returns

[`FetchGroupHandlerError`](#fetch-toolkit-api-referenceclassesfetchgrouphandlererrormd)

###### Inherited from

`Error.constructor`

###### Source

node\_modules/typescript/lib/lib.es5.d.ts:1059

#### Properties

##### message

> **message**: `string`

###### Inherited from

`Error.message`

###### Source

node\_modules/typescript/lib/lib.es5.d.ts:1054

***

##### name

> **name**: `string`

###### Inherited from

`Error.name`

###### Source

node\_modules/typescript/lib/lib.es5.d.ts:1053

***

##### stack?

> `optional` **stack**: `string`

###### Inherited from

`Error.stack`

###### Source

node\_modules/typescript/lib/lib.es5.d.ts:1055

***

##### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

###### Returns

`any`

###### Inherited from

`Error.prepareStackTrace`

###### Source

node\_modules/@types/node/globals.d.ts:28

***

##### stackTraceLimit

> `static` **stackTraceLimit**: `number`

###### Inherited from

`Error.stackTraceLimit`

###### Source

node\_modules/@types/node/globals.d.ts:30

#### Methods

##### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

###### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

###### Returns

`void`

###### Inherited from

`Error.captureStackTrace`

###### Source

node\_modules/@types/node/globals.d.ts:21


<a name="fetch-toolkit-api-referenceclassesfetchhandlermd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / FetchHandler

### Class: `abstract` FetchHandler

A class that handles the call to the fetch api itself. Use it if just implementing decorators is not enough

#### Extended by

- [`FetchGroupHandler`](#fetch-toolkit-api-referenceclassesfetchgrouphandlermd)

#### Constructors

##### new FetchHandler()

> **new FetchHandler**(): [`FetchHandler`](#fetch-toolkit-api-referenceclassesfetchhandlermd)

###### Returns

[`FetchHandler`](#fetch-toolkit-api-referenceclassesfetchhandlermd)

#### Methods

##### fetch()

> `abstract` **fetch**(`url`, `init`?): `Promise`\<`Response`\>

###### Parameters

• **url**: `string`

• **init?**: `RequestInit`

###### Returns

`Promise`\<`Response`\>

###### Source

[src/types.ts:29](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L29)


<a name="fetch-toolkit-api-referenceclassesfetchloggermd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / FetchLogger

### Class: `abstract` FetchLogger

Base class for logging decorators.

#### Extended by

- [`FetchConsoleLogger`](#fetch-toolkit-api-referenceclassesfetchconsoleloggermd)

#### Implements

- [`FetchDecorator`](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd)

#### Constructors

##### new FetchLogger()

> **new FetchLogger**(`logBody`, `logHeaders`): [`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd)

Constructor.

###### Parameters

• **logBody**: `boolean`= `false`

Log the body of the request.

• **logHeaders**: `boolean`= `false`

Log the headers of the request.

###### Returns

[`FetchLogger`](#fetch-toolkit-api-referenceclassesfetchloggermd)

###### Source

[src/logging.ts:14](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L14)

#### Properties

##### logBody

> `protected` **logBody**: `boolean` = `false`

Log the body of the request.

###### Source

[src/logging.ts:14](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L14)

***

##### logHeaders

> `protected` **logHeaders**: `boolean` = `false`

Log the headers of the request.

###### Source

[src/logging.ts:14](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L14)

#### Methods

##### decorateRequest()

> **decorateRequest**(`url`, `request`): `void`

Decorates the request with logging.

###### Parameters

• **url**: `string`

URL to decorate.

• **request**: [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

Fetch options.

###### Returns

`void`

void

###### Implementation of

[`FetchDecorator`](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd).[`decorateRequest`](#decoraterequest)

###### Source

[src/logging.ts:23](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L23)

***

##### decorateResponse()

> **decorateResponse**(`_url`, `request`, `response`): `void`

Decorates the response with logging.

###### Parameters

• **\_url**: `string`

URL to decorate (not used in this implementation)

• **request**: [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

Fetch options.

• **response**: `Response`

Fetch response.

###### Returns

`void`

void

###### Implementation of

[`FetchDecorator`](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd).[`decorateResponse`](#decorateresponse)

###### Source

[src/logging.ts:75](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L75)

***

##### logAction()

> `protected` `abstract` **logAction**(`logStr`, `action`): `void`

Logs an action. Must be implemented by the child class.

###### Parameters

• **logStr**: `string`

The string to log.

• **action**: `"Request"` \| `"Response"` \| `"Additional"` \| `"Body"` \| `"Header"`

The type of action to log.

###### Returns

`void`

###### Source

[src/logging.ts:118](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L118)

***

##### logAdditionalAction()

> `static` **logAdditionalAction**(`message`, `request`?): `void`

Helper method to log an additional action performed by the fetching process which is not a request or response.

###### Parameters

• **message**: `string`

Message to log.

• **request?**: [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

Fetch options.

###### Returns

`void`

###### Source

[src/logging.ts:101](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/logging.ts#L101)


<a name="fetch-toolkit-api-referenceclassespromiseconcurrentqueuemd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / PromiseConcurrentQueue

### Class: PromiseConcurrentQueue\<T\>

Class to handle a queue of promises that are executed concurrently

#### Type parameters

• **T**

#### Constructors

##### new PromiseConcurrentQueue()

> **new PromiseConcurrentQueue**\<`T`\>(`maxParallel`, `onEventCallback`?): [`PromiseConcurrentQueue`](#fetch-toolkit-api-referenceclassespromiseconcurrentqueuemd)\<`T`\>

Creates an instance of the PromiseConcurrentQueue

###### Parameters

• **maxParallel**: `number`

The maximum number of parallel promises that can be executed. If not set, no limit is set.

• **onEventCallback?**: [`OnEventCallback`](#fetch-toolkit-api-referencetype-aliasesoneventcallbackmd)

Optional callback to be triggered when an event occurs

###### Returns

[`PromiseConcurrentQueue`](#fetch-toolkit-api-referenceclassespromiseconcurrentqueuemd)\<`T`\>

###### Source

[src/parallel-promise-handler.ts:67](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/parallel-promise-handler.ts#L67)

#### Properties

##### maxParallel

> `readonly` **maxParallel**: `number`

The maximum number of parallel promises that can be executed. If not set, no limit is set.

###### Source

[src/parallel-promise-handler.ts:67](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/parallel-promise-handler.ts#L67)

***

##### onEventCallback?

> `optional` **onEventCallback**: [`OnEventCallback`](#fetch-toolkit-api-referencetype-aliasesoneventcallbackmd)

Optional callback to be triggered when an event occurs

###### Source

[src/parallel-promise-handler.ts:67](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/parallel-promise-handler.ts#L67)

#### Accessors

##### numberOfExecuting

> `get` **numberOfExecuting**(): `number`

Returns the number of the executing promises

###### Returns

`number`

###### Source

[src/parallel-promise-handler.ts:223](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/parallel-promise-handler.ts#L223)

***

##### waitingQueueLength

> `get` **waitingQueueLength**(): `number`

Returns the length of the waiting queue

###### Returns

`number`

###### Source

[src/parallel-promise-handler.ts:216](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/parallel-promise-handler.ts#L216)

#### Methods

##### push()

> **push**(`func`, `uid`?, `data`?): `Promise`\<`T`\>

Pushes a new function to the queue

###### Parameters

• **func**

Function to be executed

• **uid?**: `string`

Optional unique identifier for the function. If not set, a new one is generated

• **data?**: `unknown`

Data passed to the callback function

###### Returns

`Promise`\<`T`\>

Returns a promise that resolves to the result of the function

###### Source

[src/parallel-promise-handler.ts:76](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/parallel-promise-handler.ts#L76)

## Functions


<a name="fetch-toolkit-api-referencefunctionsfetchjsonmd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / fetchJson

### Function: fetchJson()

> **fetchJson**\<`T`\>(`url`, `init`?): `Promise`\<`T`\>

Helper method to get a response as JSON. Throws a FetchError in case of faulty Status code

#### Type parameters

• **T**

#### Parameters

• **url**: `string`

URL to retrievce

• **init?**: [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

Init parameters (same as used in the native fetch command)

#### Returns

`Promise`\<`T`\>

A JSON object

#### Source

[src/fetch-toolkit.ts:11](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/fetch-toolkit.ts#L11)


<a name="fetch-toolkit-api-referencefunctionsfetchsetheadermd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / fetchSetHeader

### Function: fetchSetHeader()

> **fetchSetHeader**(`init`, `headerName`, `headerValue`, `overwrite`?): `RequestInit`

Helper method to set a header in the fetch request.
It checks if the header has the has and set methods and uses them if available.
If the header does not have the has and set methods, it uses the header as a dictionary.
If the header already exists, it overwrites the value if the overwrite parameter is true.
If the header does not exist, it creates it.

#### Parameters

• **init**: `undefined` \| [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

Request options

• **headerName**: `string`

Header name

• **headerValue**: `string`

Header value

• **overwrite?**: `boolean`

If true, it overwrites the header value if it already exists

#### Returns

`RequestInit`

The updated init object

#### Source

[src/fetch-toolkit.ts:106](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/fetch-toolkit.ts#L106)


<a name="fetch-toolkit-api-referenceglobalsmd"></a>

[**fetch-toolkit**](README.md) • **Docs**

***

## fetch-toolkit

### Classes

- [API](#fetch-toolkit-api-referenceclassesapimd)
- [AuthenticationProvider](#fetch-toolkit-api-referenceclassesauthenticationprovidermd)
- [BasicAuthenticationProvider](#fetch-toolkit-api-referenceclassesbasicauthenticationprovidermd)
- [BearerAuthenticationProvider](#fetch-toolkit-api-referenceclassesbearerauthenticationprovidermd)
- [FetchConsoleLogger](#fetch-toolkit-api-referenceclassesfetchconsoleloggermd)
- [FetchError](#fetch-toolkit-api-referenceclassesfetcherrormd)
- [FetchGroupHandler](#fetch-toolkit-api-referenceclassesfetchgrouphandlermd)
- [FetchGroupHandlerError](#fetch-toolkit-api-referenceclassesfetchgrouphandlererrormd)
- [FetchHandler](#fetch-toolkit-api-referenceclassesfetchhandlermd)
- [FetchLogger](#fetch-toolkit-api-referenceclassesfetchloggermd)
- [PromiseConcurrentQueue](#fetch-toolkit-api-referenceclassespromiseconcurrentqueuemd)

### Interfaces

- [FetchDecorator](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd)
- [RequestInitToolkit](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

### Type Aliases

- [HttpMethod](#fetch-toolkit-api-referencetype-aliaseshttpmethodmd)
- [OnEventCallback](#fetch-toolkit-api-referencetype-aliasesoneventcallbackmd)
- [ParallelFunctionEventType](#fetch-toolkit-api-referencetype-aliasesparallelfunctioneventtypemd)

### Variables

- [HTTP\_HEADER\_ACCEPT](#fetch-toolkit-api-referencevariableshttp_header_acceptmd)
- [HTTP\_HEADER\_ACCEPT\_JSON](#fetch-toolkit-api-referencevariableshttp_header_accept_jsonmd)
- [HTTP\_HEADER\_AUTHORIZATION](#fetch-toolkit-api-referencevariableshttp_header_authorizationmd)
- [HTTP\_HEADER\_CONTENT\_TYPE](#fetch-toolkit-api-referencevariableshttp_header_content_typemd)

### Functions

- [fetchJson](#fetch-toolkit-api-referencefunctionsfetchjsonmd)
- [fetchSetHeader](#fetch-toolkit-api-referencefunctionsfetchsetheadermd)

## Interfaces


<a name="fetch-toolkit-api-referenceinterfacesfetchdecoratormd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / FetchDecorator

### Interface: FetchDecorator

Base interface for the decorating a fetch request and response

#### Properties

##### decorateRequest()?

> `optional` **decorateRequest**: (`url`, `request`) => `void` \| `Promise`\<`void`\>

###### Parameters

• **url**: `string`

• **request**: [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

###### Returns

`void` \| `Promise`\<`void`\>

###### Source

[src/types.ts:21](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L21)

***

##### decorateResponse()?

> `optional` **decorateResponse**: (`url`, `request`, `response`) => `void` \| `Promise`\<`void`\>

###### Parameters

• **url**: `string`

• **request**: [`RequestInitToolkit`](#fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd)

• **response**: `Response`

###### Returns

`void` \| `Promise`\<`void`\>

###### Source

[src/types.ts:22](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L22)


<a name="fetch-toolkit-api-referenceinterfacesrequestinittoolkitmd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / RequestInitToolkit

### Interface: RequestInitToolkit

Toolkit extension for the fetch options

#### Extends

- `RequestInit`

#### Properties

##### body?

> `optional` **body**: `null` \| `BodyInit`

A BodyInit object or null to set request's body.

###### Inherited from

`RequestInit.body`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1591

***

##### cache?

> `optional` **cache**: `RequestCache`

A string indicating how the request will interact with the browser's cache to set request's cache.

###### Inherited from

`RequestInit.cache`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1593

***

##### credentials?

> `optional` **credentials**: `RequestCredentials`

A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials.

###### Inherited from

`RequestInit.credentials`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1595

***

##### decorators?

> `optional` **decorators**: [`FetchDecorator`](#fetch-toolkit-api-referenceinterfacesfetchdecoratormd)[]

###### Source

[src/types.ts:36](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L36)

***

##### handler?

> `optional` **handler**: [`FetchHandler`](#fetch-toolkit-api-referenceclassesfetchhandlermd)

###### Source

[src/types.ts:37](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L37)

***

##### headers?

> `optional` **headers**: `HeadersInit`

A Headers object, an object literal, or an array of two-item arrays to set request's headers.

###### Inherited from

`RequestInit.headers`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1597

***

##### integrity?

> `optional` **integrity**: `string`

A cryptographic hash of the resource to be fetched by request. Sets request's integrity.

###### Inherited from

`RequestInit.integrity`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1599

***

##### keepalive?

> `optional` **keepalive**: `boolean`

A boolean to set request's keepalive.

###### Inherited from

`RequestInit.keepalive`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1601

***

##### method?

> `optional` **method**: `string`

A string to set request's method.

###### Inherited from

`RequestInit.method`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1603

***

##### mode?

> `optional` **mode**: `RequestMode`

A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode.

###### Inherited from

`RequestInit.mode`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1605

***

##### redirect?

> `optional` **redirect**: `RequestRedirect`

A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect.

###### Inherited from

`RequestInit.redirect`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1607

***

##### referrer?

> `optional` **referrer**: `string`

A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer.

###### Inherited from

`RequestInit.referrer`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1609

***

##### referrerPolicy?

> `optional` **referrerPolicy**: `ReferrerPolicy`

A referrer policy to set request's referrerPolicy.

###### Inherited from

`RequestInit.referrerPolicy`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1611

***

##### signal?

> `optional` **signal**: `null` \| `AbortSignal`

An AbortSignal to set request's signal.

###### Inherited from

`RequestInit.signal`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1613

***

##### uid?

> `optional` **uid**: `string`

###### Source

[src/types.ts:38](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L38)

***

##### window?

> `optional` **window**: `null`

Can only be null. Used to disassociate request from any Window.

###### Inherited from

`RequestInit.window`

###### Source

node\_modules/typescript/lib/lib.dom.d.ts:1615

## Type Aliases


<a name="fetch-toolkit-api-referencetype-aliaseshttpmethodmd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / HttpMethod

### Type alias: HttpMethod

> **HttpMethod**: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"`

#### Source

[src/types.ts:1](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/types.ts#L1)


<a name="fetch-toolkit-api-referencetype-aliasesoneventcallbackmd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / OnEventCallback

### Type alias: OnEventCallback()

> **OnEventCallback**: (`event`, `id`, `data`?, `message`?) => `void`

Callback type for the event

#### Parameters

• **event**: [`ParallelFunctionEventType`](#fetch-toolkit-api-referencetype-aliasesparallelfunctioneventtypemd)

• **id**: `string`

• **data?**: `unknown`

• **message?**: `string`

#### Returns

`void`

#### Source

[src/parallel-promise-handler.ts:48](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/parallel-promise-handler.ts#L48)


<a name="fetch-toolkit-api-referencetype-aliasesparallelfunctioneventtypemd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / ParallelFunctionEventType

### Type alias: ParallelFunctionEventType

> **ParallelFunctionEventType**: `"enqueue"` \| `"start"` \| `"finish"` \| `"error"`

Type of events that can be triggered

#### Source

[src/parallel-promise-handler.ts:43](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/parallel-promise-handler.ts#L43)

## Variables


<a name="fetch-toolkit-api-referencevariableshttp_header_acceptmd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / HTTP\_HEADER\_ACCEPT

### Variable: HTTP\_HEADER\_ACCEPT

> `const` **HTTP\_HEADER\_ACCEPT**: `"Accept"` = `"Accept"`

The HTTP header for specifying the accepted response format.

#### Source

[src/constants.ts:5](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/constants.ts#L5)


<a name="fetch-toolkit-api-referencevariableshttp_header_accept_jsonmd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / HTTP\_HEADER\_ACCEPT\_JSON

### Variable: HTTP\_HEADER\_ACCEPT\_JSON

> `const` **HTTP\_HEADER\_ACCEPT\_JSON**: `"application/json"` = `"application/json"`

The value for specifying that the response should be in JSON format.

#### Source

[src/constants.ts:20](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/constants.ts#L20)


<a name="fetch-toolkit-api-referencevariableshttp_header_authorizationmd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / HTTP\_HEADER\_AUTHORIZATION

### Variable: HTTP\_HEADER\_AUTHORIZATION

> `const` **HTTP\_HEADER\_AUTHORIZATION**: `"Authorization"` = `"Authorization"`

The HTTP header for specifying the authorization token.

#### Source

[src/constants.ts:10](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/constants.ts#L10)


<a name="fetch-toolkit-api-referencevariableshttp_header_content_typemd"></a>

[**fetch-toolkit**](../README.md) • **Docs**

***

[fetch-toolkit](#fetch-toolkit-api-referenceglobalsmd) / HTTP\_HEADER\_CONTENT\_TYPE

### Variable: HTTP\_HEADER\_CONTENT\_TYPE

> `const` **HTTP\_HEADER\_CONTENT\_TYPE**: `"Content-Type"` = `"Content-Type"`

The HTTP header for specifying the content type of the request.

#### Source

[src/constants.ts:15](https://github.com/bmarotta/fetch-toolkit/blob/4d0530a21fa9fc67b65ed64b01361c9071777ab6/src/constants.ts#L15)
