# Mock API

Run the mock backend:

```bash
npm run mock:api
```

Run the admin pointed at the mock backend:

```bash
npm run dev:mock
```

Current handlers live in `mocks/api/handlers.mjs`.

To add a new mocked endpoint, register another handler with:

- `method`
- `path`
- `handle(request, context)`

Return one of:

- `success(data, status)`
- `noContent()`
- `error(status, code, message)`

The mock server returns the same success/error envelope shape expected by the current API client.
