# API Update Map

This file maps the frontend API contract changes that were made in `pug-web-admin`.

Only endpoints that changed are listed here.

The goal is to update `pug-service` to this new contract so both repos stay aligned.

## Conventions Applied

- Keep versioned bases: `/v1/...`
- Prefer query params for lookups/filters over `by-*` path variants
- Prefer `PATCH` on the resource with a request body over action suffixes like `/cancel`
- Prefer nested resources for real relationships like project enrollments

## Identity

### Accounts

| Old                                          | New                                       | Notes                                          |
| -------------------------------------------- | ----------------------------------------- | ---------------------------------------------- |
| `GET /v1/identity/accounts/by-email/{email}` | `GET /v1/identity/accounts?email={email}` | single-resource lookup by unique email         |
| `GET /v1/identity/accounts/by-cpf/{cpf}`     | `GET /v1/identity/accounts?cpf={cpf}`     | current frontend still expects a list response |

No DTO change required.

### Admins

| Old                                         | New                                     | Notes                                          |
| ------------------------------------------- | --------------------------------------- | ---------------------------------------------- |
| `GET /v1/identity/admins/by-email/{email}`  | `GET /v1/identity/admins?email={email}` | single-resource lookup by unique email         |
| `GET /v1/identity/admins/by-cpf/{cpf}`      | `GET /v1/identity/admins?cpf={cpf}`     | current frontend still expects a list response |
| `PATCH /v1/identity/admins/{id}/deactivate` | `PATCH /v1/identity/admins/{id}`        | partial update on the resource                 |

#### Admin DTO change

Old request shape for deactivation:

```json
null
```

New request shape:

```json
{
	"active": false
}
```

`AdminUpdateRequest` needs to support:

```ts
type AdminUpdateRequest = {
	name?: string | null;
	email?: string | null;
	password?: string | null;
	campus?: Campi | null;
	active?: boolean | null;
};
```

### Users

| Old                                   | New                                | Notes                  |
| ------------------------------------- | ---------------------------------- | ---------------------- |
| `GET /v1/identity/users/by-cpf/{cpf}` | `GET /v1/identity/users?cpf={cpf}` | single-resource lookup |

No DTO change required.

## Academic

### Students

| Old                                                        | New                                                     | Notes                  |
| ---------------------------------------------------------- | ------------------------------------------------------- | ---------------------- |
| `GET /v1/academic/students/by-cpf/{cpf}`                   | `GET /v1/academic/students?cpf={cpf}`                   | single-resource lookup |
| `GET /v1/academic/students/by-email/{email}`               | `GET /v1/academic/students?email={email}`               | single-resource lookup |
| `GET /v1/academic/students/by-registration/{registration}` | `GET /v1/academic/students?registration={registration}` | single-resource lookup |

No DTO change required.

## Partner

### Entities

| Old                                        | New                                     | Notes                  |
| ------------------------------------------ | --------------------------------------- | ---------------------- |
| `GET /v1/partners/entities/by-cnpj/{cnpj}` | `GET /v1/partners/entities?cnpj={cnpj}` | single-resource lookup |

No DTO change required.

### Staff

| Old                                           | New                                          | Notes                                          |
| --------------------------------------------- | -------------------------------------------- | ---------------------------------------------- |
| `GET /v1/partners/staff/by-email/{email}`     | `GET /v1/partners/staff?email={email}`       | single-resource lookup                         |
| `GET /v1/partners/staff/by-cpf/{cpf}`         | `GET /v1/partners/staff?cpf={cpf}`           | current frontend still expects a list response |
| `GET /v1/partners/staff/by-entity/{entityId}` | `GET /v1/partners/staff?entityId={entityId}` | collection filter                              |
| `PATCH /v1/partners/staff/{id}/deactivate`    | `PATCH /v1/partners/staff/{id}`              | partial update on the resource                 |

#### Staff DTO change

Old request shape for deactivation:

```json
null
```

New request shape:

```json
{
	"active": false
}
```

`StaffUpdateRequest` needs to support:

```ts
type StaffUpdateRequest = {
	name?: string | null;
	email?: string | null;
	password?: string | null;
	active?: boolean | null;
};
```

## Projects

### Project filters

| Old                                       | New                                      | Notes             |
| ----------------------------------------- | ---------------------------------------- | ----------------- |
| `GET /v1/projects/created-by/{accountId}` | `GET /v1/projects?createdBy={accountId}` | collection filter |

No DTO change required.

### Project status transitions

| Old                                | New                       | Target status |
| ---------------------------------- | ------------------------- | ------------- |
| `PATCH /v1/projects/{id}/cancel`   | `PATCH /v1/projects/{id}` | `CANCELED`    |
| `PATCH /v1/projects/{id}/complete` | `PATCH /v1/projects/{id}` | `COMPLETED`   |
| `PATCH /v1/projects/{id}/hold`     | `PATCH /v1/projects/{id}` | `ON_HOLD`     |
| `PATCH /v1/projects/{id}/retake`   | `PATCH /v1/projects/{id}` | `PLANNED`     |
| `PATCH /v1/projects/{id}/start`    | `PATCH /v1/projects/{id}` | `IN_PROGRESS` |

#### Project DTO change

Old request shape:

```json
null
```

New request shape:

```json
{
	"status": "IN_PROGRESS"
}
```

`ProjectUpdateRequest` now needs to support:

```ts
type ProjectUpdateRequest = {
	name?: string | null;
	description?: string | null;
	maxParticipants?: number | null;
	offeredHours?: number | null;
	status?:
		| "CANCELED"
		| "COMPLETED"
		| "IN_PROGRESS"
		| "ON_HOLD"
		| "PLANNED"
		| null;
};
```

## Enrollments

### Enrollment resource paths

| Old                                                       | New                                                       | Notes                               |
| --------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------- |
| `GET /v1/projects/enrollments/{projectId}/{studentId}`    | `GET /v1/projects/{projectId}/enrollments/{studentId}`    | resource nested under project       |
| `GET /v1/projects/enrollments/{projectId}/me`             | `GET /v1/projects/{projectId}/enrollments/me`             | current student in one project      |
| `POST /v1/projects/enrollments`                           | `POST /v1/projects/{projectId}/enrollments`               | `projectId` moves from body to path |
| `DELETE /v1/projects/enrollments/{projectId}/{studentId}` | `DELETE /v1/projects/{projectId}/enrollments/{studentId}` | resource nested under project       |

### Enrollment status transitions

| Old                                                               | New                                                      | Target status                |
| ----------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------- |
| `PATCH /v1/projects/enrollments/{projectId}/{studentId}/accept`   | `PATCH /v1/projects/{projectId}/enrollments/{studentId}` | `APPROVED`                   |
| `PATCH /v1/projects/enrollments/{projectId}/{studentId}/cancel`   | `PATCH /v1/projects/{projectId}/enrollments/{studentId}` | `CANCELED`                   |
| `PATCH /v1/projects/enrollments/{projectId}/{studentId}/complete` | `PATCH /v1/projects/{projectId}/enrollments/{studentId}` | `COMPLETED`                  |
| `PATCH /v1/projects/enrollments/{projectId}/{studentId}/reject`   | `PATCH /v1/projects/{projectId}/enrollments/{studentId}` | `REJECTED`                   |
| `PATCH /v1/projects/enrollments/{projectId}/{studentId}/remove`   | `PATCH /v1/projects/{projectId}/enrollments/{studentId}` | `REMOVED`                    |
| `PATCH /v1/projects/enrollments/{projectId}/exit`                 | `PATCH /v1/projects/{projectId}/enrollments/me`          | `EXITED` for current student |

#### Enrollment DTO changes

Old create request:

```json
{
	"projectId": "uuid"
}
```

New create request:

```json
null
```

Reason:

- `projectId` is now part of the URL path
- the frontend sends no body for enrollment creation

Old transition request:

```json
null
```

New transition request:

```json
{
	"status": "APPROVED"
}
```

New update DTO needed:

```ts
type EnrollmentUpdateRequest = {
	status:
		| "APPROVED"
		| "CANCELED"
		| "COMPLETED"
		| "EXITED"
		| "PENDING"
		| "REJECTED"
		| "REMOVED";
};
```

## Project-School Associations

### Association routes

| Old                                                                              | New                                                  | Notes                                        |
| -------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------- |
| `GET /v1/project-school-associations/projects/{projectId}/schools`               | `GET /v1/projects/{projectId}/schools`               | schools linked to project                    |
| `GET /v1/project-school-associations/schools/{schoolId}/projects`                | `GET /v1/academic/schools/{schoolId}/projects`       | projects linked to school                    |
| `POST /v1/project-school-associations`                                           | `POST /v1/projects/{projectId}/schools`              | create/update associations from project side |
| `DELETE /v1/project-school-associations/projects/{projectId}/schools/{schoolId}` | `DELETE /v1/projects/{projectId}/schools/{schoolId}` | remove one association                       |
| `DELETE /v1/project-school-associations/projects/{projectId}`                    | `DELETE /v1/projects/{projectId}/schools`            | remove all schools from project              |
| `DELETE /v1/project-school-associations/schools/{schoolId}`                      | `DELETE /v1/academic/schools/{schoolId}/projects`    | remove all projects from school              |

#### Project-school DTO change

Old request shape:

```json
{
	"projectId": "uuid",
	"schoolIds": ["uuid", "uuid"]
}
```

New request shape:

```json
{
	"schoolIds": ["uuid", "uuid"]
}
```

Reason:

- `projectId` is now part of the URL path

New update DTO:

```ts
type ProjectSchoolAssociationUpdateRequest = {
	schoolIds: string[];
};
```

## Not Changed

These stayed the same and do not need backend work because of this refactor:

- auth endpoints under `/v1/auth`
- `/me` collection/resource endpoints that were already clean
- basic CRUD paths like `GET /{id}`, `POST /collection`, `PUT /{id}`, `DELETE /{id}`
- attendance endpoints
