# Constraints

This document lists the domain-level constraints currently enforced by `pug-service` in the `domain` and `domain/vos` packages.

## Reading Notes

- `blank` means `null` or whitespace-only, because most string checks use `StringUtils.isEmpty()`.
- Some factories normalize input before validation:
  - `trim()` for names, addresses, descriptions, and academic registration.
  - `lowercase(Locale.ROOT)` for emails.
  - non-digit stripping for CPF and CNPJ.
- Several aggregates bubble up nested VO errors instead of re-validating those fields inline.
- This file documents the code as it exists today, including places where an error code name does not perfectly match the field being validated.

## Shared

### DomainError helper validations

These helpers are inherited by many aggregates.

| Helper                      | Constraint                     | Error code                                    |
| --------------------------- | ------------------------------ | --------------------------------------------- |
| `validateIdField(UUID)`     | UUID must not be `null`        | `SharedFieldErrorCodes.INVALID_ID_BLANK`      |
| `validateNameField(String)` | name must not be blank         | `SharedFieldErrorCodes.INVALID_NAME_BLANK`    |
| `validateNameField(String)` | name must not exceed 150 chars | `SharedFieldErrorCodes.INVALID_NAME_TOO_LONG` |

### AuditInfo (VO)

| Field       | Constraint                     | Error code                                                   |
| ----------- | ------------------------------ | ------------------------------------------------------------ |
| `createdAt` | must not be `null`             | `SharedFieldErrorCodes.INVALID_CREATED_AT_BLANK`             |
| `updatedAt` | must not be `null`             | `SharedFieldErrorCodes.INVALID_UPDATED_AT_BLANK`             |
| `updatedAt` | must not be before `createdAt` | `SharedFieldErrorCodes.INVALID_UPDATED_AT_BEFORE_CREATED_AT` |

## Academic Module

### Course (aggregate)

Normalization:

- `factory()` and `rename()` trim `name`.

| Field       | Constraint                          | Error code                                       |
| ----------- | ----------------------------------- | ------------------------------------------------ |
| `id`        | must not be `null`                  | `SharedFieldErrorCodes.INVALID_ID_BLANK`         |
| `name`      | must not be blank                   | `SharedFieldErrorCodes.INVALID_NAME_BLANK`       |
| `name`      | max 150 chars                       | `SharedFieldErrorCodes.INVALID_NAME_TOO_LONG`    |
| `schoolId`  | must not be `null`                  | `AcademicFieldErrorCodes.INVALID_SCHOOL_BLANK`   |
| `auditInfo` | must not be `null`                  | `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK` |
| `auditInfo` | nested `AuditInfo` errors bubble up | nested shared codes                              |

### School (aggregate)

Normalization:

- `factory()` and `rename()` trim `name`.

| Field       | Constraint                          | Error code                                       |
| ----------- | ----------------------------------- | ------------------------------------------------ |
| `id`        | must not be `null`                  | `SharedFieldErrorCodes.INVALID_ID_BLANK`         |
| `name`      | must not be blank                   | `SharedFieldErrorCodes.INVALID_NAME_BLANK`       |
| `name`      | max 150 chars                       | `SharedFieldErrorCodes.INVALID_NAME_TOO_LONG`    |
| `auditInfo` | must not be `null`                  | `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK` |
| `auditInfo` | nested `AuditInfo` errors bubble up | nested shared codes                              |

### Student (aggregate)

| Field                  | Constraint                          | Error code                                           |
| ---------------------- | ----------------------------------- | ---------------------------------------------------- |
| `accountId`            | must not be `null`                  | `AcademicFieldErrorCodes.INVALID_ACCOUNT_ID_BLANK`   |
| `academicRegistration` | VO reference must not be `null`     | `AcademicFieldErrorCodes.INVALID_REGISTRATION_BLANK` |
| `academicRegistration` | nested VO errors bubble up          | nested academic codes                                |
| `campus`               | must not be `null`                  | `SharedFieldErrorCodes.INVALID_CAMPUS_BLANK`         |
| `courseId`             | must not be `null`                  | `AcademicFieldErrorCodes.INVALID_COURSE_BLANK`       |
| `counterpartHours`     | VO reference must not be `null`     | `AcademicFieldErrorCodes.INVALID_HOURS_BLANK`        |
| `counterpartHours`     | nested VO errors bubble up          | nested academic codes                                |
| `period`               | VO reference must not be `null`     | `AcademicFieldErrorCodes.INVALID_PERIOD_BLANK`       |
| `period`               | nested VO errors bubble up          | nested academic codes                                |
| `auditInfo`            | must not be `null`                  | `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK`     |
| `auditInfo`            | nested `AuditInfo` errors bubble up | nested shared codes                                  |

Behavior notes:

- `addCompletedHours()` recalculates `concluded` as `true` when `completedHours >= requiredHours`.
- The updated `CounterpartHours` instance is still re-validated after that recalculation.

### AcademicRegistration (VO)

Normalization:

- `factory()` trims the incoming registration string.

| Field   | Constraint        | Error code                                              |
| ------- | ----------------- | ------------------------------------------------------- |
| `value` | must not be blank | `AcademicFieldErrorCodes.INVALID_REGISTRATION_BLANK`    |
| `value` | max 15 chars      | `AcademicFieldErrorCodes.INVALID_REGISTRATION_TOO_LONG` |

### CounterpartHours (VO)

Defaults applied by `factory()`:

- `requiredHours == null` becomes `0`
- `completedHours == null` becomes `0`
- `concluded == null` becomes `false`

| Field            | Constraint                      | Error code                                                 |
| ---------------- | ------------------------------- | ---------------------------------------------------------- |
| `requiredHours`  | must be greater than zero       | `AcademicFieldErrorCodes.INVALID_HOURS_BLANK`              |
| `completedHours` | must be zero or positive        | `AcademicFieldErrorCodes.INVALID_COMPLETED_HOURS_NEGATIVE` |
| `completedHours` | must not exceed `requiredHours` | `AcademicFieldErrorCodes.INVALID_COMPLETED_HOURS_EXCEEDS`  |
| `concluded`      | no direct validation rule       | none                                                       |

### Period (VO)

| Field       | Constraint                     | Error code                                         |
| ----------- | ------------------------------ | -------------------------------------------------- |
| `startDate` | must not be `null`             | `AcademicFieldErrorCodes.INVALID_START_DATE_BLANK` |
| `dueDate`   | must not be `null`             | `AcademicFieldErrorCodes.INVALID_DUE_DATE_BLANK`   |
| `dueDate`   | must not be before `startDate` | `AcademicFieldErrorCodes.INVALID_PERIOD_RANGE`     |

## Geo Module

### City (aggregate)

Normalization:

- `factory()` and `rename()` trim `name`.

| Field      | Constraint                      | Error code                                    |
| ---------- | ------------------------------- | --------------------------------------------- |
| `id`       | must not be `null`              | `SharedFieldErrorCodes.INVALID_ID_BLANK`      |
| `name`     | must not be blank               | `SharedFieldErrorCodes.INVALID_NAME_BLANK`    |
| `name`     | max 150 chars                   | `SharedFieldErrorCodes.INVALID_NAME_TOO_LONG` |
| `ibgeCode` | VO reference must not be `null` | `GeoFieldErrorCodes.INVALID_IBGE_CODE_BLANK`  |
| `ibgeCode` | nested VO errors bubble up      | nested geo codes                              |

### IbgeCode (VO)

| Field  | Constraint                             | Error code                                    |
| ------ | -------------------------------------- | --------------------------------------------- |
| `code` | must not be blank                      | `GeoFieldErrorCodes.INVALID_IBGE_CODE_BLANK`  |
| `code` | must be exactly 7 chars and all digits | `GeoFieldErrorCodes.INVALID_IBGE_CODE_FORMAT` |

## Identity Module

### Account (aggregate)

Defaults and normalization:

- `factory()` creates accounts with `active = true`.
- `changePasswordHash()` does not trim or normalize the hash.

| Field          | Constraint                          | Error code                                               |
| -------------- | ----------------------------------- | -------------------------------------------------------- |
| `id`           | must not be `null`                  | `SharedFieldErrorCodes.INVALID_ID_BLANK`                 |
| `userId`       | must not be `null`                  | `IdentityFieldErrorCodes.INVALID_USER_ID_BLANK`          |
| `email`        | VO reference must not be `null`     | `IdentityFieldErrorCodes.INVALID_EMAIL_BLANK`            |
| `email`        | nested VO errors bubble up          | nested identity codes                                    |
| `accountType`  | must not be `null`                  | `IdentityFieldErrorCodes.INVALID_ACCOUNT_TYPE_BLANK`     |
| `passwordHash` | must not be blank                   | `IdentityFieldErrorCodes.INVALID_PASSWORD_HASH_BLANK`    |
| `passwordHash` | max 255 chars                       | `IdentityFieldErrorCodes.INVALID_PASSWORD_HASH_TOO_LONG` |
| `auditInfo`    | must not be `null`                  | `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK`         |
| `auditInfo`    | nested `AuditInfo` errors bubble up | nested shared codes                                      |
| `active`       | must not be `null`                  | `IdentityFieldErrorCodes.INVALID_ACTIVE_FLAG_BLANK`      |

### Admin (aggregate)

| Field       | Constraint         | Error code                                         |
| ----------- | ------------------ | -------------------------------------------------- |
| `accountId` | must not be `null` | `IdentityFieldErrorCodes.INVALID_ACCOUNT_ID_BLANK` |
| `grantedAt` | must not be `null` | `IdentityFieldErrorCodes.INVALID_GRANTED_AT_BLANK` |
| `campus`    | must not be `null` | `SharedFieldErrorCodes.INVALID_CAMPUS_BLANK`       |

### User (aggregate)

Normalization:

- `factory()` and `rename()` trim `name`.

| Field       | Constraint                          | Error code                                         |
| ----------- | ----------------------------------- | -------------------------------------------------- |
| `id`        | must not be `null`                  | `SharedFieldErrorCodes.INVALID_ID_BLANK`           |
| `cpf`       | VO reference must not be `null`     | `IdentityFieldErrorCodes.INVALID_CPF_BLANK`        |
| `cpf`       | nested VO errors bubble up          | nested identity codes                              |
| `name`      | must not be blank                   | `IdentityFieldErrorCodes.INVALID_USER_ID_BLANK`    |
| `name`      | max 255 chars                       | `IdentityFieldErrorCodes.INVALID_USER_ID_TOO_LONG` |
| `auditInfo` | must not be `null`                  | `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK`   |
| `auditInfo` | nested `AuditInfo` errors bubble up | nested shared codes                                |

Note:

- The current code uses `INVALID_USER_ID_*` error codes for `name` validation.

### Cpf (VO)

Normalization:

- `factory()` strips every non-digit character before validating.

| Field   | Constraint                                                                    | Error code                                   |
| ------- | ----------------------------------------------------------------------------- | -------------------------------------------- |
| `value` | must not be blank                                                             | `IdentityFieldErrorCodes.INVALID_CPF_BLANK`  |
| `value` | must pass Stella CPF validation (11 digits, not repeated, valid check digits) | `IdentityFieldErrorCodes.INVALID_CPF_FORMAT` |

### Email (VO)

Normalization:

- `factory()` trims and lowercases the email using `Locale.ROOT`.

| Field   | Constraint                                                  | Error code                                     |
| ------- | ----------------------------------------------------------- | ---------------------------------------------- |
| `value` | must not be blank                                           | `IdentityFieldErrorCodes.INVALID_EMAIL_BLANK`  |
| `value` | max 254 chars and must pass Apache Commons `EmailValidator` | `IdentityFieldErrorCodes.INVALID_EMAIL_FORMAT` |

## Partner Module

### Entity (aggregate)

Normalization:

- `factory()`, `rename()`, and `moveToAddress()` trim string inputs.

| Field       | Constraint                          | Error code                                        |
| ----------- | ----------------------------------- | ------------------------------------------------- |
| `id`        | must not be `null`                  | `SharedFieldErrorCodes.INVALID_ID_BLANK`          |
| `cnpj`      | VO reference must not be `null`     | `PartnerFieldErrorCodes.INVALID_CNPJ_BLANK`       |
| `cnpj`      | nested VO errors bubble up          | nested partner codes                              |
| `name`      | must not be blank                   | `SharedFieldErrorCodes.INVALID_NAME_BLANK`        |
| `name`      | max 150 chars                       | `SharedFieldErrorCodes.INVALID_NAME_TOO_LONG`     |
| `cityId`    | must not be `null`                  | `PartnerFieldErrorCodes.INVALID_CITY_ID_BLANK`    |
| `address`   | must not be blank                   | `PartnerFieldErrorCodes.INVALID_ADDRESS_BLANK`    |
| `address`   | max 254 chars                       | `PartnerFieldErrorCodes.INVALID_ADDRESS_TOO_LONG` |
| `auditInfo` | must not be `null`                  | `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK`  |
| `auditInfo` | nested `AuditInfo` errors bubble up | nested shared codes                               |

### Staff (aggregate)

| Field       | Constraint         | Error code                                        |
| ----------- | ------------------ | ------------------------------------------------- |
| `accountId` | must not be `null` | `PartnerFieldErrorCodes.INVALID_ACCOUNT_ID_BLANK` |
| `entityId`  | must not be `null` | `PartnerFieldErrorCodes.INVALID_ENTITY_ID_BLANK`  |

### Cnpj (VO)

Normalization:

- `factory()` strips every non-digit character before validating.

| Field   | Constraint                                                                     | Error code                                   |
| ------- | ------------------------------------------------------------------------------ | -------------------------------------------- |
| `value` | must not be blank                                                              | `PartnerFieldErrorCodes.INVALID_CNPJ_BLANK`  |
| `value` | must pass Stella CNPJ validation (14 digits, not repeated, valid check digits) | `PartnerFieldErrorCodes.INVALID_CNPJ_FORMAT` |

## Project Module

### Attendance (aggregate)

| Field                  | Constraint                             | Error code                                                                                                                |
| ---------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `id`                   | must not be `null`                     | `SharedFieldErrorCodes.INVALID_ID_BLANK`                                                                                  |
| `enrollmentIdentifier` | must not be `null`                     | `ProjectsFieldErrorCodes.INVALID_ATTENDANCE_PROJECT_BLANK` and `ProjectsFieldErrorCodes.INVALID_ATTENDANCE_STUDENT_BLANK` |
| `enrollmentIdentifier` | nested VO errors bubble up             | nested project codes                                                                                                      |
| `status`               | must not be `null`                     | `ProjectsFieldErrorCodes.INVALID_ATTENDANCE_STATUS_BLANK`                                                                 |
| `qrValidationInfo`     | if present, nested VO errors bubble up | nested project codes                                                                                                      |
| `qrValidationInfo`     | no direct non-null rule                | none                                                                                                                      |
| `attendanceInfo`       | if present, nested VO errors bubble up | nested project codes + shared codes                                                                                       |
| `attendanceInfo`       | no direct non-null rule                | none                                                                                                                      |

State transition constraint:

- `validatePresence(UUID validatorId, AttendanceStatus newStatus)` only accepts `PRESENT` or `ABSENT`.
- Any other status throws `BusinessRuleException(ProjectsErrorCodes.INVALID_PROJECT_STATUS_UPDATE_START)`.

### Enrollment (aggregate)

| Field            | Constraint                             | Error code                                                                                                                |
| ---------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `identifier`     | must not be `null`                     | `ProjectsFieldErrorCodes.INVALID_ENROLLMENT_STUDENT_BLANK` and `ProjectsFieldErrorCodes.INVALID_ENROLLMENT_PROJECT_BLANK` |
| `identifier`     | nested VO errors bubble up             | nested project codes                                                                                                      |
| `status`         | must not be `null`                     | `ProjectsFieldErrorCodes.INVALID_ENROLLMENT_STATUS_BLANK`                                                                 |
| `enrollmentInfo` | if present, nested VO errors bubble up | nested project codes + shared codes                                                                                       |
| `enrollmentInfo` | no direct non-null rule                | none                                                                                                                      |

Status transition constraints in `changeStatus()`:

- same status: returns `this`
- once current status is closing (`REJECTED`, `EXITED`, `REMOVED`, `CANCELED`, `COMPLETED`), no further transition is allowed
- `PENDING -> APPROVED` is allowed
- `PENDING -> REJECTED` is allowed
- `APPROVED -> REJECTED` is allowed
- `APPROVED -> CANCELED | COMPLETED | EXITED | REMOVED` is allowed
- all other transitions throw `BusinessRuleException(ProjectsErrorCodes.INVALID_ENROLLMENT_STATUS_UPDATE)`

### Project (aggregate)

Normalization:

- `factory()`, `rename()`, and `changeDescription()` trim incoming strings.

| Field           | Constraint                                 | Error code                                                 |
| --------------- | ------------------------------------------ | ---------------------------------------------------------- |
| `id`            | must not be `null`                         | `SharedFieldErrorCodes.INVALID_ID_BLANK`                   |
| `entityId`      | must not be `null`                         | `ProjectsFieldErrorCodes.INVALID_PROJECT_CREATED_BY_BLANK` |
| `name`          | must not be blank                          | `ProjectsFieldErrorCodes.INVALID_NAME_BLANK`               |
| `name`          | max 150 chars                              | `ProjectsFieldErrorCodes.INVALID_NAME_TOO_LONG`            |
| `description`   | optional, but max 4000 chars when provided | `ProjectsFieldErrorCodes.INVALID_DESCRIPTION_TOO_LONG`     |
| `projectInfo`   | must not be `null`                         | `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK`           |
| `projectInfo`   | nested VO errors bubble up                 | nested project codes + shared codes                        |
| `projectStatus` | must not be `null`                         | `ProjectsFieldErrorCodes.INVALID_STATUS_BLANK`             |

State transition constraints:

- `start()`:
  - returns `this` if already `IN_PROGRESS`
  - only valid from `PLANNED`
  - otherwise throws `ProjectsErrorCodes.INVALID_PROJECT_STATUS_UPDATE_START`
- `putOnHold()`:
  - returns `this` if already `ON_HOLD`
  - only valid from `IN_PROGRESS`
  - otherwise throws `ProjectsErrorCodes.INVALID_PROJECT_STATUS_UPDATE_PUT_ON_HOLD`
- `retake()`:
  - only valid from `ON_HOLD`
  - otherwise throws `ProjectsErrorCodes.INVALID_PROJECT_STATUS_UPDATE_RETAKE`
- `complete()`:
  - returns `this` if already `COMPLETED`
  - only valid from `IN_PROGRESS`
  - otherwise throws `ProjectsErrorCodes.INVALID_PROJECT_STATUS_UPDATE_COMPLETE`
- `cancel()`:
  - returns `this` if already `CANCELED`
  - forbidden only when current status is `COMPLETED`
  - otherwise throws `ProjectsErrorCodes.INVALID_PROJECT_STATUS_UPDATE_CANCEL`
- `addCompletedHours()`:
  - adds to `projectInfo.completedHours`
  - if the new total is greater than or equal to `offeredHours`, status is auto-changed to `COMPLETED`
  - resulting `ProjectInfo` is still re-validated

Note:

- `entityId == null` currently reuses `INVALID_PROJECT_CREATED_BY_BLANK`.
- `projectInfo == null` currently reuses `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK`.

### ProjectSchool (aggregate)

| Field       | Constraint         | Error code                                                 |
| ----------- | ------------------ | ---------------------------------------------------------- |
| `projectId` | must not be `null` | `ProjectsFieldErrorCodes.INVALID_ENROLLMENT_PROJECT_BLANK` |
| `schoolId`  | must not be `null` | `ProjectsFieldErrorCodes.INVALID_SCHOOL_ID_BLANK`          |

Note:

- `projectId` currently reuses the enrollment-project blank code.

### AttendanceInfo (VO)

| Field                         | Constraint                                     | Error code                                                |
| ----------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| `validatedBy` / `validatedAt` | both must be provided together, or both absent | `ProjectsFieldErrorCodes.INVALID_ATTENDANCE_STATUS_BLANK` |
| `validatedAt`                 | must not be before `auditInfo.createdAt`       | `ProjectsFieldErrorCodes.INVALID_CREATED_AT_FUTURE`       |
| `auditInfo`                   | must not be `null`                             | `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK`          |
| `auditInfo`                   | nested `AuditInfo` errors bubble up            | nested shared codes                                       |

Note:

- The paired-field rule uses `INVALID_ATTENDANCE_STATUS_BLANK`, even though it is really checking validator metadata completeness.

### EnrollmentIdentifier (VO)

| Field       | Constraint         | Error code                                                 |
| ----------- | ------------------ | ---------------------------------------------------------- |
| `studentId` | must not be `null` | `ProjectsFieldErrorCodes.INVALID_ENROLLMENT_STUDENT_BLANK` |
| `projectId` | must not be `null` | `ProjectsFieldErrorCodes.INVALID_ENROLLMENT_PROJECT_BLANK` |

### EnrollmentInfo (VO)

| Field             | Constraint                                             | Error code                                                 |
| ----------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| `acceptedAt`      | when present, must not be before `auditInfo.createdAt` | `ProjectsFieldErrorCodes.INVALID_ENROLLMENT_DATES_INVALID` |
| `closingStatusAt` | when present, must not be before `auditInfo.createdAt` | `ProjectsFieldErrorCodes.INVALID_ENROLLMENT_DATES_INVALID` |
| `auditInfo`       | must not be `null`                                     | `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK`           |
| `auditInfo`       | nested `AuditInfo` errors bubble up                    | nested shared codes                                        |

Note:

- There is no direct rule requiring `acceptedAt` or `closingStatusAt` to exist.
- There is no direct rule requiring `closingStatusAt` to be after `acceptedAt`.

### ProjectInfo (VO)

Defaults applied by `factory()`:

- `offeredHours == null` becomes `0`
- `completedHours == null` becomes `0`
- `closedAt` starts as `null`

| Field             | Constraint                            | Error code                                                         |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------ |
| `createdBy`       | must not be `null`                    | `ProjectsFieldErrorCodes.INVALID_PROJECT_CREATED_BY_BLANK`         |
| `maxParticipants` | if provided, must be zero or positive | `ProjectsFieldErrorCodes.INVALID_MAX_PARTICIPANTS_NEGATIVE`        |
| `offeredHours`    | if provided, must be zero or positive | `ProjectsFieldErrorCodes.INVALID_PROJECT_OFFERED_HOURS_NEGATIVE`   |
| `completedHours`  | if provided, must be zero or positive | `ProjectsFieldErrorCodes.INVALID_PROJECT_COMPLETED_HOURS_NEGATIVE` |
| `completedHours`  | must not exceed `offeredHours`        | `ProjectsFieldErrorCodes.INVALID_PROJECT_COMPLETED_HOURS_EXCEEDS`  |
| `closedAt`        | no direct validation rule             | none                                                               |
| `auditInfo`       | must not be `null`                    | `SharedFieldErrorCodes.INVALID_AUDIT_INFO_BLANK`                   |
| `auditInfo`       | nested `AuditInfo` errors bubble up   | nested shared codes                                                |

### QrValidationInfo (VO)

| Field              | Constraint                         | Error code                                                            |
| ------------------ | ---------------------------------- | --------------------------------------------------------------------- |
| `duration`         | must be strictly greater than zero | `ProjectsFieldErrorCodes.INVALID_ATTENDANCE_DURATION_INVALID`         |
| `qrValidationHash` | must not be blank                  | `ProjectsFieldErrorCodes.INVALID_ATTENDANCE_QR_VALIDATION_HASH_EMPTY` |
