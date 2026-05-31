# New Contract

This file documents the current API contract implemented by `pug-service`.

It is intended to support frontend mapping of:
- routes
- request payloads
- response payloads
- TypeScript types / schemas
- write validation rules
- complex-search filter semantics

## Conventions

- Every success payload is wrapped in `ApiEnvelope<T>`.
- Paginated search endpoints return `ApiEnvelope<PageResponse<T>>`.
- `PageResponse<T>` fields:
  - `content: List<T>`
  - `page: int`
  - `size: int`
  - `totalElements: long`
  - `totalPages: int`
- Text filters implemented with `JpaSearchUtils.containsClause(...)` are:
  - case-insensitive
  - accent-insensitive
  - contains-style (`%term%`)
- When multiple filters are provided in complex search, the query combines them with `AND`.

## Endpoint Index

Each endpoint below references request and response DTOs defined later in the typed DTO catalog.

### Academic

#### Areas of Expertise

- `GET /v1/academic/areas-of-expertise/{id}`
  - Flow: fetch one area of expertise by id.
  - Request DTO: none
  - Response DTO: `AreaOfExpertiseResponse`

- `GET /v1/academic/areas-of-expertise`
  - Flow: list all areas or restrict by `ids`.
  - Request DTO: none
  - Response DTO: `List<AreaOfExpertiseResponse>`

- `POST /v1/academic/areas-of-expertise/search`
  - Flow: paginated search ordered by name.
  - Request DTO: `AreaOfExpertiseComplexSearchRequest`
  - Response DTO: `PageResponse<AreaOfExpertiseResponse>`

- `POST /v1/academic/areas-of-expertise`
  - Flow: create area of expertise and reload read model.
  - Request DTO: `AreaOfExpertiseCreateRequest`
  - Response DTO: `AreaOfExpertiseResponse`

- `PUT /v1/academic/areas-of-expertise/{id}`
  - Flow: update area name and reload read model.
  - Request DTO: `AreaOfExpertiseUpdateRequest`
  - Response DTO: `AreaOfExpertiseResponse`

- `DELETE /v1/academic/areas-of-expertise/{id}`
  - Flow: hard delete.
  - Request DTO: none
  - Response DTO: none

#### Courses

- `GET /v1/academic/courses/{id}`
  - Flow: fetch one course by id.
  - Request DTO: none
  - Response DTO: `CourseResponse`

- `GET /v1/academic/courses`
  - Flow: list all courses or restrict by `ids`.
  - Request DTO: none
  - Response DTO: `List<CourseResponse>`

- `POST /v1/academic/courses/search`
  - Flow: paginated search ordered by course name.
  - Request DTO: `CourseComplexSearchRequest`
  - Response DTO: `PageResponse<CourseWithAuditInfoComplexSearchResponse>`

- `POST /v1/academic/courses`
  - Flow: create course and reload read model.
  - Request DTO: `CourseCreateRequest`
  - Response DTO: `CourseResponse`

- `PUT /v1/academic/courses/{id}`
  - Flow: update course fields and reload read model.
  - Request DTO: `CourseUpdateRequest`
  - Response DTO: `CourseResponse`

- `DELETE /v1/academic/courses/{id}`
  - Flow: hard delete.
  - Request DTO: none
  - Response DTO: none

#### Former Students

- `GET /v1/academic/former-students/{id}`
  - Flow: fetch one former-student by linked account id.
  - Request DTO: none
  - Response DTO: `FormerStudentResponse`

- `GET /v1/academic/former-students/me`
  - Flow: resolve current account from token and fetch own former-student record.
  - Request DTO: none
  - Response DTO: `FormerStudentResponse`

- `GET /v1/academic/former-students`
  - Flow: list all former students or restrict by `ids`.
  - Request DTO: none
  - Response DTO: `List<FormerStudentResponse>`

- `POST /v1/academic/former-students/search`
  - Flow: paginated search across former-student, account, user, course, and area-of-expertise tables.
  - Request DTO: `FormerStudentComplexSearchRequest`
  - Response DTO: `PageResponse<FormerStudentComplexSearchResponse>`

- `POST /v1/academic/former-students`
  - Flow: create user + account + former-student record and reload read model.
  - Request DTO: `FormerStudentCreateRequest`
  - Response DTO: `FormerStudentResponse`

- `POST /v1/academic/former-students/bulk`
  - Flow: bulk create and reload created records.
  - Request DTO: `List<FormerStudentCreateRequest>`
  - Response DTO: `List<FormerStudentResponse>`

- `PUT /v1/academic/former-students/{id}`
  - Flow: update linked identity and academic fields and reload read model.
  - Request DTO: `FormerStudentUpdateRequest`
  - Response DTO: `FormerStudentResponse`

- `PATCH /v1/academic/former-students/{id}/status`
  - Flow: activate/deactivate linked account.
  - Request DTO: `AccountStatusRequest`
  - Response DTO: none

- `DELETE /v1/academic/former-students/{id}`
  - Flow: delete former-student record and linked account according to service rules.
  - Request DTO: none
  - Response DTO: none

### Geo

#### Cities

- `GET /v1/geo/cities/{id}`
  - Flow: fetch one city by id.
  - Request DTO: none
  - Response DTO: `CityResponse`

- `GET /v1/geo/cities`
  - Flow: list all cities ordered by name.
  - Request DTO: none
  - Response DTO: `List<CityResponse>`

- `POST /v1/geo/cities/search`
  - Flow: paginated city search.
  - Request DTO: `CityComplexSearchRequest`
  - Response DTO: `PageResponse<CityResponse>`

### Identity

#### Accounts

- `GET /v1/identity/accounts/{id}`
  - Flow: fetch one account by id.
  - Request DTO: none
  - Response DTO: `AccountResponse`

- `GET /v1/identity/accounts/me`
  - Flow: resolve `accountId` from JWT and fetch own account.
  - Request DTO: none
  - Response DTO: `AccountResponse`

- `GET /v1/identity/accounts`
  - Flow: list all accounts or restrict by `ids`.
  - Request DTO: none
  - Response DTO: `List<AccountResponse>`

- `POST /v1/identity/accounts/search`
  - Flow: paginated account search across account and user tables.
  - Request DTO: `AccountComplexSearchRequest`
  - Response DTO: `PageResponse<AccountComplexSearchResponse>`

#### Admins

- `GET /v1/identity/admins/{id}`
  - Flow: fetch one admin by linked account id.
  - Request DTO: none
  - Response DTO: `AdminResponse`

- `GET /v1/identity/admins/me`
  - Flow: resolve `accountId` from JWT and fetch own admin profile.
  - Request DTO: none
  - Response DTO: `AdminResponse`

- `GET /v1/identity/admins`
  - Flow: list all admins or restrict by `ids`.
  - Request DTO: none
  - Response DTO: `List<AdminResponse>`

- `POST /v1/identity/admins/search`
  - Flow: paginated admin search across admin/account/user tables.
  - Request DTO: `AdminComplexSearchRequest`
  - Response DTO: `PageResponse<AdminComplexSearchResponse>`

- `POST /v1/identity/admins`
  - Flow: create user + account + admin profile with deferred password wiring.
  - Request DTO: `AdminCreateRequest`
  - Response DTO: `AdminResponse`

- `PUT /v1/identity/admins/{id}`
  - Flow: update editable admin/account/user fields.
  - Request DTO: `AdminUpdateRequest`
  - Response DTO: `AdminResponse`

- `PATCH /v1/identity/admins/{id}/status`
  - Flow: activate/deactivate linked account.
  - Request DTO: `AccountStatusRequest`
  - Response DTO: none

- `DELETE /v1/identity/admins/{id}`
  - Flow: delete admin profile and associated account.
  - Request DTO: none
  - Response DTO: none

#### Auth

- `POST /v1/auth/login`
  - Flow: validate credentials and issue token pair.
  - Request DTO: `LoginRequest`
  - Response DTO: `TokenResponse`

- `POST /v1/auth/logout`
  - Flow: revoke one refresh token.
  - Request DTO: `LogoutRequest`
  - Response DTO: none

- `POST /v1/auth/logout-all`
  - Flow: revoke all refresh tokens for current account.
  - Request DTO: none
  - Response DTO: none

- `POST /v1/auth/refresh`
  - Flow: validate refresh token and issue fresh token pair.
  - Request DTO: `RefreshRequest`
  - Response DTO: `TokenResponse`

- `POST /v1/auth/wire-credentials`
  - Flow: first-time password wiring for a provisioned account.
  - Request DTO: `CredentialsRequest`
  - Response DTO: none

#### Users

- `GET /v1/identity/users/{id}`
  - Flow: fetch one user by id.
  - Request DTO: none
  - Response DTO: `UserResponse`

- `GET /v1/identity/users/me`
  - Flow: resolve `userId` from JWT and fetch own user record.
  - Request DTO: none
  - Response DTO: `UserResponse`

- `GET /v1/identity/users`
  - Flow: list all users or restrict by `ids`.
  - Request DTO: none
  - Response DTO: `List<UserResponse>`

- `POST /v1/identity/users/search`
  - Flow: paginated user search.
  - Request DTO: `UserComplexSearchRequest`
  - Response DTO: `PageResponse<UserResponse>`

### Partners

#### Entities

- `GET /v1/partners/entities/{id}`
  - Flow: fetch one partner entity by id.
  - Request DTO: none
  - Response DTO: `EntityResponse`

- `GET /v1/partners/entities`
  - Flow: list all entities or restrict by `ids`.
  - Request DTO: none
  - Response DTO: `List<EntityResponse>`

- `POST /v1/partners/entities/search`
  - Flow: paginated entity search joined with city.
  - Request DTO: `EntityComplexSearchRequest`
  - Response DTO: `PageResponse<EntityComplexSearchResponse>`

- `POST /v1/partners/entities`
  - Flow: create entity and reload read model.
  - Request DTO: `EntityCreateRequest`
  - Response DTO: `EntityResponse`

- `PUT /v1/partners/entities/{id}`
  - Flow: update entity fields and reload read model.
  - Request DTO: `EntityUpdateRequest`
  - Response DTO: `EntityResponse`

- `DELETE /v1/partners/entities/{id}`
  - Flow: hard delete.
  - Request DTO: none
  - Response DTO: none

#### Staff

- `GET /v1/partners/staff/{id}`
  - Flow: fetch one staff record by linked account id.
  - Request DTO: none
  - Response DTO: `StaffResponse`

- `GET /v1/partners/staff/me`
  - Flow: resolve current account id and fetch own staff record.
  - Request DTO: none
  - Response DTO: `StaffResponse`

- `GET /v1/partners/staff`
  - Flow: list all staff or restrict by `ids`.
  - Request DTO: none
  - Response DTO: `List<StaffResponse>`

- `POST /v1/partners/staff/search`
  - Flow: paginated staff search across staff/account/user/entity tables.
  - Request DTO: `StaffComplexSearchRequest`
  - Response DTO: `PageResponse<StaffComplexSearchResponse>`

- `POST /v1/partners/staff`
  - Flow: create user + account + staff record.
  - Request DTO: `StaffCreateRequest`
  - Response DTO: `StaffResponse`

- `PUT /v1/partners/staff/{id}`
  - Flow: update editable account/user/staff fields.
  - Request DTO: `StaffUpdateRequest`
  - Response DTO: `StaffResponse`

- `PATCH /v1/partners/staff/{id}/status`
  - Flow: activate/deactivate linked account.
  - Request DTO: `AccountStatusRequest`
  - Response DTO: none

- `DELETE /v1/partners/staff/{id}`
  - Flow: hard delete.
  - Request DTO: none
  - Response DTO: none

### Projects

#### Projects

- `GET /v1/projects/{id}`
  - Flow: fetch one project by id.
  - Request DTO: none
  - Response DTO: `ProjectResponse`

- `GET /v1/projects`
  - Flow: list all projects or restrict by `ids`.
  - Request DTO: none
  - Response DTO: `List<ProjectResponse>`

- `GET /v1/projects/entities/{entityId}`
  - Flow: list projects by partner entity.
  - Request DTO: none
  - Response DTO: `List<ProjectResponse>`

- `GET /v1/projects/creators/{createdById}`
  - Flow: list projects by creator account.
  - Request DTO: none
  - Response DTO: `List<ProjectResponse>`

- `POST /v1/projects/search`
  - Flow: paginated project search joined with partner entity.
  - Request DTO: `ProjectComplexSearchRequest`
  - Response DTO: `PageResponse<ProjectComplexSearchResponse>`

- `POST /v1/projects`
  - Flow: create project in `PLANNED` status and reload read model.
  - Request DTO: `ProjectCreateRequest`
  - Response DTO: `ProjectResponse`

- `PUT /v1/projects/{id}`
  - Flow: update non-lifecycle project fields and reload read model.
  - Request DTO: `ProjectUpdateRequest`
  - Response DTO: `ProjectResponse`

- `PATCH /v1/projects/{id}/status`
  - Flow: perform lifecycle transition.
  - Request DTO: raw `ProjectStatus` enum in request body
  - Response DTO: `ProjectResponse`

- `DELETE /v1/projects/{id}`
  - Flow: hard delete.
  - Request DTO: none
  - Response DTO: none

#### Project <-> Area of Expertise

- `GET /v1/projects/{projectId}/areas-of-expertise`
  - Flow: list all areas linked to a project.
  - Request DTO: none
  - Response DTO: `List<AreaOfExpertiseResponse>`

- `POST /v1/projects/{projectId}/areas-of-expertise`
  - Flow: create project-to-area associations in bulk.
  - Request DTO: `ProjectAreaOfExpertiseRequest`
  - Response DTO: none

- `DELETE /v1/projects/{projectId}/areas-of-expertise/{areaOfExpertiseId}`
  - Flow: delete one association.
  - Request DTO: none
  - Response DTO: none

- `DELETE /v1/projects/{projectId}/areas-of-expertise`
  - Flow: delete all associations for a project.
  - Request DTO: none
  - Response DTO: none

- `GET /v1/academic/areas-of-expertise/{areaOfExpertiseId}/projects`
  - Flow: list all projects linked to one area of expertise.
  - Request DTO: none
  - Response DTO: `List<ProjectResponse>`

- `DELETE /v1/academic/areas-of-expertise/{areaOfExpertiseId}/projects`
  - Flow: delete all associations for one area of expertise.
  - Request DTO: none
  - Response DTO: none

#### Enrollments

- `GET /v1/projects/{projectId}/enrollments/{formerStudentId}`
  - Flow: fetch one enrollment by composite key.
  - Request DTO: none
  - Response DTO: `EnrollmentResponse`

- `GET /v1/projects/{projectId}/enrollments/me`
  - Flow: resolve current former-student account id and fetch own enrollment.
  - Request DTO: none
  - Response DTO: `EnrollmentResponse`

- `GET /v1/projects/enrollments`
  - Flow: list all enrollments, or filter by `projectId`, or filter by `formerStudentId`.
  - Request DTO: none
  - Response DTO: `List<EnrollmentResponse>`

- `GET /v1/projects/enrollments/me`
  - Flow: list enrollments for current former-student account.
  - Request DTO: none
  - Response DTO: `List<EnrollmentResponse>`

- `POST /v1/projects/{projectId}/enrollments`
  - Flow: create enrollment for current former student or explicit target.
  - Request DTO: no JSON body; request uses `projectId` path param and optional `formerStudentId` query param
  - Response DTO: `EnrollmentResponse`

- `POST /v1/projects/enrollments/search`
  - Flow: paginated enrollment search.
  - Request DTO: `EnrollmentComplexSearchRequest`
  - Response DTO: `PageResponse<EnrollmentComplexSearchResponse>`

- `PATCH /v1/projects/{projectId}/enrollments/{formerStudentId}`
  - Flow: admin/staff status transition.
  - Request DTO: `EnrollmentUpdateStatusRequest`
  - Response DTO: `EnrollmentResponse`

- `PATCH /v1/projects/{projectId}/enrollments/me`
  - Flow: former-student self-service status transition.
  - Request DTO: `EnrollmentUpdateStatusRequest`
  - Response DTO: `EnrollmentResponse`

- `DELETE /v1/projects/{projectId}/enrollments/{formerStudentId}`
  - Flow: delete one enrollment by composite key.
  - Request DTO: none
  - Response DTO: none

#### Attendances

- `GET /v1/projects/attendances/{id}`
  - Flow: fetch one attendance by id.
  - Request DTO: none
  - Response DTO: `AttendanceResponse`

- `GET /v1/projects/attendances`
  - Flow: list all attendances or restrict by `ids`.
  - Request DTO: none
  - Response DTO: `List<AttendanceResponse>`

- `POST /v1/projects/attendances/search`
  - Flow: paginated attendance search.
  - Request DTO: `AttendanceComplexSearchRequest`
  - Response DTO: `PageResponse<AttendanceComplexSearchResponse>`

- `POST /v1/projects/attendances`
  - Flow: create attendance in `WAITING` status and reload read model.
  - Request DTO: `AttendanceCreateRequest`
  - Response DTO: `AttendanceResponse`

- `PATCH /v1/projects/attendances/{id}/validate`
  - Flow: validate attendance and stamp validator metadata.
  - Request DTO: `AttendanceValidateRequest`
  - Response DTO: `AttendanceResponse`

- `DELETE /v1/projects/attendances/{id}`
  - Flow: hard delete.
  - Request DTO: none
  - Response DTO: none

## Typed DTO Catalog

Types below use Java names as implemented in the backend. They can be mapped directly into frontend schemas.

### Shared DTOs

#### `AuditInfoResponse`
- `createdAt: OffsetDateTime`
- `createdAtFormatted: String`
- `updatedAt: OffsetDateTime`
- `updatedAtFormatted: String`

#### `CampusResponse`
- `campus: Campi`
- `campusFormatted: String`

#### `PageResponse<T>`
- `content: List<T>`
- `page: int`
- `size: int`
- `totalElements: long`
- `totalPages: int`

#### `AccountTypeResponse`
- `accountType: AccountType`
- `accountTypeFormatted: String`

#### `ProjectStatusResponse`
- `status: ProjectStatus`
- `statusFormatted: String`

#### `EnrollmentStatusResponse`
- `status: EnrollmentStatus`
- `statusFormatted: String`

#### `AttendanceStatusResponse`
- `status: AttendanceStatus`
- `statusFormatted: String`

### Academic DTOs

#### `AreaOfExpertiseComplexSearchRequest`
- `name: String`

#### `AreaOfExpertiseCreateRequest`
- `name: String`

#### `AreaOfExpertiseUpdateRequest`
- `name: String`

#### `AreaOfExpertiseResponse`
- `id: UUID`
- `name: String`
- `auditInfo: AuditInfoResponse`

#### `AreaOfExpertiseComplexSearchResponse`
- `id: UUID`
- `name: String`

#### `CourseComplexSearchRequest`
- `name: String`
- `areaOfExpertiseIds: List<UUID>`

#### `CourseCreateRequest`
- `name: String`
- `areaOfExpertiseId: UUID`

#### `CourseUpdateRequest`
- `name: String`
- `areaOfExpertiseId: UUID`

#### `CourseComplexSearchResponse`
- `id: UUID`
- `name: String`
- `areaOfExpertise: AreaOfExpertiseComplexSearchResponse`

#### `CourseWithAuditInfoComplexSearchResponse`
- `id: UUID`
- `name: String`
- `areaOfExpertise: AreaOfExpertiseComplexSearchResponse`
- `auditInfo: AuditInfoResponse`

#### `CourseResponse`
- `id: UUID`
- `name: String`
- `areaOfExpertise: AreaOfExpertiseResponse`
- `auditInfo: AuditInfoResponse`

#### `CounterpartHoursResponse`
- `requiredHours: BigDecimal`
- `completedHours: BigDecimal`
- `missingHours: BigDecimal`
- `progress: BigDecimal`
- `concluded: boolean`

#### `PeriodResponse`
- `startDate: LocalDate`
- `startDateFormatted: String`
- `dueDate: LocalDate`
- `dueDateFormatted: String`
- `remainingDays: long`
- `remainingDaysFormatted: String`

#### `FormerStudentCreateRequest`
- `cpf: String`
- `name: String`
- `email: String`
- `academicRegistration: String`
- `campus: Campi`
- `courseId: UUID`
- `requiredHours: BigDecimal`
- `startDate: LocalDate`
- `dueDate: LocalDate`

#### `FormerStudentUpdateRequest`
- `name: String`
- `cpf: String`
- `email: String`
- `academicRegistration: String`
- `campus: Campi`
- `courseId: UUID`
- `requiredHours: BigDecimal`
- `startDate: LocalDate`
- `dueDate: LocalDate`

#### `FormerStudentResponse`
- `accountId: UUID`
- `academicRegistration: String`
- `campus: CampusResponse`
- `courseId: UUID`
- `counterpartHours: CounterpartHoursResponse`
- `period: PeriodResponse`
- `auditInfo: AuditInfoResponse`

#### `FormerStudentSimpleComplexSearchResponse`
- `account: AccountSimpleComplexSearchResponse`
- `academicRegistration: String`
- `campus: CampusResponse`

#### `FormerStudentComplexSearchRequest`
- `name: String`
- `cpf: String`
- `email: String`
- `academicRegistration: String`
- `campi: List<Campi>`
- `periodFrom: LocalDate`
- `periodTo: LocalDate`
- `includeConcluded: Boolean`
- `dateFrom: OffsetDateTime`
- `dateTo: OffsetDateTime`
- `activeOnly: Boolean`
- `courseIds: List<UUID>`
- `areaOfExpertiseIds: List<UUID>`

#### `FormerStudentComplexSearchResponse`
- `account: AccountComplexSearchResponse`
- `academicRegistration: String`
- `campus: CampusResponse`
- `counterpartHours: CounterpartHoursResponse`
- `period: PeriodResponse`
- `auditInfo: AuditInfoResponse`
- `course: CourseComplexSearchResponse`

### Geo DTOs

#### `CityComplexSearchRequest`
- `name: String`

#### `CityResponse`
- `id: UUID`
- `name: String`
- `ibgeCode: String`

### Identity DTOs

#### `AccountSimpleComplexSearchResponse`
- `id: UUID`
- `name: String`
- `email: String`

#### `AccountStatusRequest`
- `active: Boolean`

#### `AccountResponse`
- `id: UUID`
- `userId: UUID`
- `email: String`
- `accountType: AccountTypeResponse`
- `auditInfo: AuditInfoResponse`
- `active: Boolean`

#### `AccountComplexSearchRequest`
- `name: String`
- `cpf: String`
- `email: String`
- `accountTypes: List<AccountType>`
- `dateFrom: OffsetDateTime`
- `dateTo: OffsetDateTime`
- `activeOnly: Boolean`

#### `AccountComplexSearchResponse`
- `id: UUID`
- `user: UserSimpleComplexSearchResponse`
- `email: String`
- `accountType: AccountTypeResponse`
- `auditInfo: AuditInfoResponse`
- `active: Boolean`

#### `AdminCreateRequest`
- `cpfString: String`
- `name: String`
- `emailString: String`
- `campus: Campi`

#### `AdminUpdateRequest`
- `name: String`
- `emailString: String`
- `campus: Campi`

#### `AdminResponse`
- `accountResponse: AccountResponse`
- `campus: CampusResponse`
- `grantedAt: OffsetDateTime`
- `grantedAtFormatted: String`

#### `AdminComplexSearchRequest`
- `name: String`
- `cpf: String`
- `email: String`
- `dateFrom: OffsetDateTime`
- `dateTo: OffsetDateTime`
- `activeOnly: Boolean`

#### `AdminComplexSearchResponse`
- `account: AccountComplexSearchResponse`
- `campus: CampusResponse`
- `grantedAt: OffsetDateTime`
- `grantedAtFormatted: String`

#### `LoginRequest`
- `email: String`
- `password: String`

#### `LogoutRequest`
- `refreshToken: String`

#### `RefreshRequest`
- `refreshToken: String`

#### `CredentialsRequest`
- `email: String`
- `password: String`

#### `TokenResponse`
- `token: String`
- `refreshToken: String`
- `accountId: UUID`
- `accountType: AccountType`
- `passwordWired: boolean`
- `expiresIn: long`
- `refreshExpiresIn: long`

#### `UserSimpleComplexSearchResponse`
- `id: UUID`
- `name: String`

#### `UserResponse`
- `id: UUID`
- `cpf: String`
- `cpfFormatted: String`
- `name: String`
- `auditInfo: AuditInfoResponse`

#### `UserComplexSearchRequest`
- `cpf: String`
- `dateFrom: OffsetDateTime`
- `dateTo: OffsetDateTime`
- `name: String`

### Partner DTOs

#### `EntitySimpleComplexSearchResponse`
- `id: UUID`
- `name: String`

#### `EntityCreateRequest`
- `cnpjString: String`
- `name: String`
- `cityId: UUID`
- `address: String`

#### `EntityUpdateRequest`
- `name: String`
- `cityId: UUID`
- `address: String`

#### `EntityResponse`
- `id: UUID`
- `cnpj: String`
- `cnpjFormatted: String`
- `name: String`
- `address: String`
- `cityId: UUID`
- `auditInfo: AuditInfoResponse`

#### `EntityComplexSearchRequest`
- `name: String`
- `cnpj: String`
- `address: String`
- `cityIds: List<UUID>`
- `dateFrom: OffsetDateTime`
- `dateTo: OffsetDateTime`

#### `EntityComplexSearchResponse`
- `id: UUID`
- `cnpj: String`
- `cnpjFormatted: String`
- `name: String`
- `address: String`
- `city: CityResponse`
- `auditInfo: AuditInfoResponse`

#### `StaffCreateRequest`
- `cpfString: String`
- `name: String`
- `emailString: String`
- `entityId: UUID`

#### `StaffUpdateRequest`
- `name: String`
- `emailString: String`
- `entityId: UUID`

#### `StaffResponse`
- `account: AccountResponse`
- `entityId: UUID`
- `cityId: UUID`

#### `StaffComplexSearchRequest`
- `name: String`
- `cpf: String`
- `email: String`
- `dateFrom: OffsetDateTime`
- `dateTo: OffsetDateTime`
- `activeOnly: Boolean`
- `entityIds: List<UUID>`

#### `StaffComplexSearchResponse`
- `account: AccountComplexSearchResponse`
- `entity: EntitySimpleComplexSearchResponse`

### Project DTOs

#### `ProjectSimpleComplexSearchResponse`
- `id: UUID`
- `name: String`

#### `ProjectAreaOfExpertiseRequest`
- `areaOfExpertiseIds: List<UUID>`

#### `ProjectCreateRequest`
- `name: String`
- `entityId: UUID`
- `description: String`
- `maxParticipants: Integer`
- `offeredHours: BigDecimal`

#### `ProjectUpdateRequest`
- `name: String`
- `description: String`
- `maxParticipants: Integer`
- `offeredHours: BigDecimal`

#### `ProjectInfoResponse`
- `createdBy: UUID`
- `maxParticipants: Integer`
- `offeredHours: BigDecimal`
- `completedHours: BigDecimal`
- `closedAt: OffsetDateTime`
- `closedAtFormatted: String`
- `auditInfo: AuditInfoResponse`

#### `ProjectResponse`
- `id: UUID`
- `name: String`
- `entity: EntitySimpleComplexSearchResponse`
- `description: String`
- `projectInfo: ProjectInfoResponse`
- `status: ProjectStatusResponse`

#### `ProjectComplexSearchRequest`
- `name: String`
- `entityIds: List<UUID>`
- `description: String`
- `createdByIds: List<UUID>`
- `dateFrom: OffsetDateTime`
- `dateTo: OffsetDateTime`
- `statuses: List<ProjectStatus>`
- `maxOfferedHours: BigDecimal`
- `minOfferedHours: BigDecimal`

#### `ProjectComplexSearchResponse`
- `id: UUID`
- `name: String`
- `entity: EntitySimpleComplexSearchResponse`
- `description: String`
- `projectInfo: ProjectInfoResponse`
- `status: ProjectStatusResponse`

#### `EnrollmentInfoResponse`
- `acceptedAt: OffsetDateTime`
- `acceptedAtFormatted: String`
- `closingStatusAt: OffsetDateTime`
- `closingStatusAtFormatted: String`
- `auditInfo: AuditInfoResponse`

#### `EnrollmentResponse`
- `projectId: UUID`
- `formerStudentId: UUID`
- `status: EnrollmentStatusResponse`
- `enrollmentInfo: EnrollmentInfoResponse`

#### `EnrollmentUpdateStatusRequest`
- `status: EnrollmentStatus`

#### `EnrollmentComplexSearchRequest`
- `projectIds: List<UUID>`
- `formerStudentIds: List<UUID>`
- `statuses: List<EnrollmentStatus>`
- `dateFrom: OffsetDateTime`
- `dateTo: OffsetDateTime`
- `periodFrom: LocalDate`
- `periodTo: LocalDate`

#### `EnrollmentComplexSearchResponse`
- `project: ProjectSimpleComplexSearchResponse`
- `student: FormerStudentSimpleComplexSearchResponse`
- `status: EnrollmentStatusResponse`
- `enrollmentInfo: EnrollmentInfoResponse`

#### `QrValidationInfoResponse`
- `duration: BigDecimal`
- `qrValidationHash: String`

#### `AttendanceInfoResponse`
- `validatedBy: UUID`
- `validatedAt: OffsetDateTime`
- `validatedAtFormatted: String`
- `auditInfo: AuditInfoResponse`

#### `AttendanceCreateRequest`
- `projectId: UUID`
- `formerStudentId: UUID`
- `duration: BigDecimal`

#### `AttendanceValidateRequest`
- `status: AttendanceStatus`
- `qrValidationHash: String`

#### `AttendanceResponse`
- `id: UUID`
- `projectId: UUID`
- `formerStudentId: UUID`
- `status: AttendanceStatusResponse`
- `attendanceInfo: AttendanceInfoResponse`
- `qrValidationInfo: QrValidationInfoResponse`

#### `AttendanceComplexSearchRequest`
- `projectIds: List<UUID>`
- `formerStudentIds: List<UUID>`
- `statuses: List<AttendanceStatus>`
- `validatedByIds: List<UUID>`
- `durationFrom: BigDecimal`
- `durationTo: BigDecimal`
- `dateFrom: OffsetDateTime`
- `dateTo: OffsetDateTime`

#### `AttendanceComplexSearchResponse`
- `id: UUID`
- `project: ProjectSimpleComplexSearchResponse`
- `student: FormerStudentSimpleComplexSearchResponse`
- `status: AttendanceStatusResponse`
- `attendanceInfo: AttendanceInfoResponse`
- `validator: AccountSimpleComplexSearchResponse`
- `qrValidationInfo: QrValidationInfoResponse`

## Write-side domain validations

These are the backend model validations enforced by aggregate/value-object `collectValidationProblems()` methods.

### Shared

#### `AuditInfo`
- `createdAt` must exist.
- `updatedAt` must exist.
- `updatedAt` cannot be before `createdAt`.

### Identity

#### `Cpf`
- input is sanitized to digits only
- must not be blank
- must be a valid Brazilian CPF checksum

#### `Email`
- input is trimmed and lowercased
- must not be blank
- must not exceed `254`
- must pass Apache Commons email validation

#### `User`
- `id` must exist
- `cpf` must exist and bubbles `Cpf` validation
- `name` must not be blank
- `name` must not exceed `255`
- `auditInfo` must exist and bubbles `AuditInfo` validation

#### `Account`
- `id` must exist
- `userId` must not be null
- `email` must exist and bubbles `Email` validation
- `accountType` must not be null
- `passwordHash`, when present, must not exceed `255`
- `auditInfo` must exist and bubbles `AuditInfo` validation
- `active` must not be null

#### `Admin`
- `accountId` must not be null
- `grantedAt` must not be null
- `campus` must not be null

### Academic

#### `AreaOfExpertise`
- `id` must exist
- `name` must not be blank
- `name` must not exceed `150`
- `auditInfo` must exist and bubbles `AuditInfo` validation

#### `Course`
- `id` must exist
- `name` must not be blank
- `name` must not exceed `150`
- `areaOfExpertiseId` must not be null
- `auditInfo` must exist and bubbles `AuditInfo` validation

#### `AcademicRegistration`
- value is trimmed
- must not be blank
- must not exceed `15`

#### `CounterpartHours`
- `requiredHours` must exist and be `> 0`
- `completedHours` must exist and be `>= 0`
- `completedHours` cannot exceed `requiredHours`

#### `Period`
- `startDate` must not be null
- `dueDate` must not be null
- `dueDate` cannot be before `startDate`

#### `FormerStudent`
- `accountId` must not be null
- `academicRegistration` must exist and bubbles `AcademicRegistration` validation
- `campus` must not be null
- `courseId` must not be null
- `counterpartHours` must exist and bubbles `CounterpartHours` validation
- `period` must exist and bubbles `Period` validation
- `auditInfo` must exist and bubbles `AuditInfo` validation

### Geo

#### `IbgeCode`
- must not be blank
- must be exactly `7` numeric chars

#### `City`
- `id` must exist
- `name` must not be blank
- `name` must not exceed `150`
- `ibgeCode` must exist and bubbles `IbgeCode` validation

### Partner

#### `Cnpj`
- input is sanitized to digits only
- must not be blank
- must be a valid Brazilian CNPJ checksum

#### `Entity`
- `id` must exist
- `cnpj` must exist and bubbles `Cnpj` validation
- `name` must not be blank
- `name` must not exceed `150`
- `cityId` must not be null
- `address` must not be blank
- `address` must not exceed `254`
- `auditInfo` must exist and bubbles `AuditInfo` validation

#### `Staff`
- `accountId` must not be null
- `entityId` must not be null

### Project

#### `ProjectInfo`
- `createdBy` must not be null
- `maxParticipants`, when present, must be `>= 0`
- `offeredHours`, when present, must be `>= 0`
- `completedHours`, when present, must be `>= 0`
- `completedHours` cannot exceed `offeredHours`
- `auditInfo` must exist and bubbles `AuditInfo` validation

#### `Project`
- `id` must exist
- `entityId` must not be null
- `description`, when present, must not exceed `4000`
- `name` must not be blank
- `name` must not exceed `150`
- `projectInfo` must exist and bubbles `ProjectInfo` validation
- `projectStatus` must not be null

#### `EnrollmentIdentifier`
- `formerStudentId` must not be null
- `projectId` must not be null

#### `EnrollmentInfo`
- `auditInfo` must exist and bubbles `AuditInfo` validation
- `acceptedAt`, when present, cannot be before `auditInfo.createdAt`
- `closingStatusAt`, when present, cannot be before `auditInfo.createdAt`

#### `Enrollment`
- `identifier` must exist; otherwise missing former-student and missing project errors are added
- `identifier`, when present, bubbles `EnrollmentIdentifier` validation
- `status` must not be null
- `enrollmentInfo`, when present, bubbles `EnrollmentInfo` validation

#### `QrValidationInfo`
- `duration` must exist and be `> 0`
- `qrValidationHash` must not be blank

#### `AttendanceInfo`
- `validatedBy` and `validatedAt` must either both exist or both be absent
- `validatedAt`, when present, cannot be before `auditInfo.createdAt`
- `auditInfo` must exist and bubbles `AuditInfo` validation

#### `Attendance`
- `id` must exist
- `enrollmentIdentifier` must exist; otherwise missing project and missing former-student errors are added
- `enrollmentIdentifier`, when present, bubbles `EnrollmentIdentifier` validation
- `status` must not be null
- `qrValidationInfo`, when present, bubbles `QrValidationInfo` validation
- `attendanceInfo`, when present, bubbles `AttendanceInfo` validation

## Lifecycle / business transition rules

### Projects
- `start`: only from `PLANNED`
- `putOnHold`: only from `IN_PROGRESS`
- `retake`: only from `ON_HOLD`
- `complete`: only from `IN_PROGRESS`
- `cancel`: forbidden from `COMPLETED`
- `addCompletedHours`: auto-completes when completed hours reach or exceed offered hours

### Enrollments
- terminal statuses: `REJECTED`, `EXITED`, `REMOVED`, `CANCELED`, `COMPLETED`
- terminal statuses cannot transition further
- `APPROVED`: only from `PENDING` or `ON_HOLD`
- `ON_HOLD`: only from `APPROVED`
- `REJECTED`: only from `PENDING` or `APPROVED`
- `CANCELED`, `COMPLETED`, `EXITED`, `REMOVED`: only from `APPROVED` or `ON_HOLD`
- resource-layer restrictions:
  - admin/staff endpoint accepts only `REJECTED`, `APPROVED`, `REMOVED`, `COMPLETED`
  - former-student self endpoint accepts only `EXITED`

### Attendances
- validation only accepts `PRESENT` or `ABSENT`
- validation stamps `validatedBy`, `validatedAt`, and updates attendance audit metadata

## Complex-search filter semantics

### Areas of Expertise search

- `name: String`
  - query effect: accent-insensitive, case-insensitive contains match on `s.name`
  - response effect: none

### Courses search

- `name: String`
  - query effect: accent-insensitive, case-insensitive contains match on `c.name`
  - response effect: none

- `areaOfExpertiseIds: List<UUID>`
  - query effect: `c.areaOfExpertiseId in :areaOfExpertiseIds`
  - response effect: none

### Former Students search

- `name: String`
  - query effect: contains match on `u.name`
  - response effect: none

- `cpf: String`
  - query effect: contains match on `u.cpf`
  - response effect: none

- `email: String`
  - query effect: contains match on `acc.email`
  - response effect: none

- `academicRegistration: String`
  - query effect: contains match on `s.academicRegistration`
  - response effect: none

- `campi: List<Campi>`
  - query effect: `s.campus in :campi`
  - response effect: none

- `periodFrom: LocalDate`
  - query effect: `(s.startDate >= :periodFrom or s.dueDate >= :periodFrom)`
  - response effect: none

- `periodTo: LocalDate`
  - query effect: `(s.startDate <= :periodTo or s.dueDate <= :periodTo)`
  - response effect: none

- `includeConcluded: Boolean`
  - query effect:
    - `true`: includes concluded rows
    - `false` or omitted: enforces `s.concluded = false`
  - response effect: none

- `activeOnly: Boolean`
  - query effect:
    - `true` or omitted: enforces `acc.active = true`
    - `false`: includes inactive linked accounts
  - response effect: none

- `dateFrom: OffsetDateTime`
  - query effect: row matches if any former-student/account/user/course/area-of-expertise `createdAt/updatedAt >= dateFrom`
  - response effect: none

- `dateTo: OffsetDateTime`
  - query effect: row matches if any former-student/account/user/course/area-of-expertise `createdAt/updatedAt <= dateTo`
  - response effect: none

- `courseIds: List<UUID>`
  - query effect: `c.id in :courseIds`
  - response effect: none

- `areaOfExpertiseIds: List<UUID>`
  - query effect: `sch.id in :areaOfExpertiseIds`
  - response effect: none

### Cities search

- `name: String`
  - query effect: accent-insensitive, case-insensitive contains match on `city.name`
  - response effect: none

### Accounts search

- `name: String`
  - query effect: contains match on `u.name`
  - response effect: none

- `cpf: String`
  - query effect: contains match on `u.cpf`
  - response effect: none

- `email: String`
  - query effect: contains match on `a.email`
  - response effect: none

- `accountTypes: List<AccountType>`
  - query effect: `a.accountType in :accountTypes`
  - response effect: none

- `activeOnly: Boolean`
  - query effect:
    - `true` or omitted: `a.active = true`
    - `false`: includes inactive accounts
  - response effect: none

- `dateFrom: OffsetDateTime`
  - query effect: account or user `createdAt/updatedAt >= dateFrom`
  - response effect: none

- `dateTo: OffsetDateTime`
  - query effect: account or user `createdAt/updatedAt <= dateTo`
  - response effect: none

### Admins search

- `name: String`
  - query effect: contains match on `u.name`
  - response effect: none

- `cpf: String`
  - query effect: contains match on `u.cpf`
  - response effect: none

- `email: String`
  - query effect: contains match on `acc.email`
  - response effect: none

- `activeOnly: Boolean`
  - query effect:
    - `true` or omitted: `acc.active = true`
    - `false`: includes inactive admins
  - response effect: none

- `dateFrom: OffsetDateTime`
  - query effect: account/user timestamps or `a.grantedAt >= dateFrom`
  - response effect: none

- `dateTo: OffsetDateTime`
  - query effect: account/user timestamps or `a.grantedAt <= dateTo`
  - response effect: none

### Users search

- `name: String`
  - query effect: contains match on `u.name`
  - response effect: none

- `cpf: String`
  - query effect: contains match on `u.cpf`
  - response effect: none

- `dateFrom: OffsetDateTime`
  - query effect: `u.createdAt >= dateFrom or u.updatedAt >= dateFrom`
  - response effect: none

- `dateTo: OffsetDateTime`
  - query effect: `u.createdAt <= dateTo or u.updatedAt <= dateTo`
  - response effect: none

### Entities search

- `name: String`
  - query effect: contains match on `e.name`
  - response effect: none

- `cnpj: String`
  - query effect: contains match on stored `e.cnpj`
  - response effect: none

- `address: String`
  - query effect: contains match on `e.address`
  - response effect: none

- `cityIds: List<UUID>`
  - query effect: `e.cityId in :cityIds`
  - response effect: none

- `dateFrom: OffsetDateTime`
  - query effect: `e.createdAt >= dateFrom or e.updatedAt >= dateFrom`
  - response effect: none

- `dateTo: OffsetDateTime`
  - query effect: `e.createdAt <= dateTo or e.updatedAt <= dateTo`
  - response effect: none

### Staff search

- `name: String`
  - query effect: contains match on `u.name`
  - response effect: none

- `cpf: String`
  - query effect: contains match on `u.cpf`
  - response effect: none

- `email: String`
  - query effect: contains match on `acc.email`
  - response effect: none

- `entityIds: List<UUID>`
  - query effect: `e.id in :entityIds`
  - response effect: none

- `activeOnly: Boolean`
  - query effect:
    - `true` or omitted: `acc.active = true`
    - `false`: includes inactive staff accounts
  - response effect: none

- `dateFrom: OffsetDateTime`
  - query effect: account/user/entity timestamps `>= dateFrom`
  - response effect: none

- `dateTo: OffsetDateTime`
  - query effect: account/user/entity timestamps `<= dateTo`
  - response effect: none

### Projects search

- `name: String`
  - query effect: contains match on `p.name`
  - response effect: none

- `entityIds: List<UUID>`
  - query effect: `p.entityId in :entityIds`
  - response effect: none

- `description: String`
  - query effect: contains match on `p.description`
  - response effect: none

- `createdByIds: List<UUID>`
  - query effect: `p.createdBy in :createdByIds`
  - response effect: none

- `dateFrom: OffsetDateTime`
  - query effect: `p.createdAt`, `p.updatedAt`, or `p.closedAt >= dateFrom`
  - response effect: none

- `dateTo: OffsetDateTime`
  - query effect: `p.createdAt`, `p.updatedAt`, or `p.closedAt <= dateTo`
  - response effect: none

- `statuses: List<ProjectStatus>`
  - query effect: `p.status in :statuses`
  - response effect: none

- `maxOfferedHours: BigDecimal`
  - query effect: `p.offeredHours <= maxOfferedHours`
  - response effect: none

- `minOfferedHours: BigDecimal`
  - query effect: `p.offeredHours >= minOfferedHours`
  - response effect: none

### Enrollments search

- `projectIds: List<UUID>`
  - query effect: `en.id.projectId in :projectIds`
  - response effect: none

- `formerStudentIds: List<UUID>`
  - query effect: `en.id.formerStudentId in :formerStudentIds`
  - response effect: none

- `statuses: List<EnrollmentStatus>`
  - query effect: `en.status in :statuses`
  - response effect: none

- `dateFrom: OffsetDateTime`
  - query effect: enrollment `createdAt`, `updatedAt`, `acceptedAt`, or `closingStatusAt >= dateFrom`
  - response effect: none

- `dateTo: OffsetDateTime`
  - query effect: enrollment `createdAt`, `updatedAt`, `acceptedAt`, or `closingStatusAt <= dateTo`
  - response effect: none

- `periodFrom: LocalDate`
  - query effect: `fs.startDate >= periodFrom or fs.dueDate >= periodFrom`
  - response effect: none

- `periodTo: LocalDate`
  - query effect: `fs.startDate <= periodTo or fs.dueDate <= periodTo`
  - response effect: none

### Attendances search

- `projectIds: List<UUID>`
  - query effect: `a.projectId in :projectIds`
  - response effect: none

- `formerStudentIds: List<UUID>`
  - query effect: `a.formerStudentId in :formerStudentIds`
  - response effect: none

- `statuses: List<AttendanceStatus>`
  - query effect: `a.status in :statuses`
  - response effect: none

- `validatedByIds: List<UUID>`
  - query effect: `a.validatedBy in :validatedByIds`
  - response effect: none

- `durationFrom: BigDecimal`
  - query effect: `a.duration >= durationFrom`
  - response effect: none

- `durationTo: BigDecimal`
  - query effect: `a.duration <= durationTo`
  - response effect: none

- `dateFrom: OffsetDateTime`
  - query effect: attendance `createdAt`, `updatedAt`, or `validatedAt >= dateFrom`
  - response effect: none

- `dateTo: OffsetDateTime`
  - query effect: attendance `createdAt`, `updatedAt`, or `validatedAt <= dateTo`
  - response effect: none
