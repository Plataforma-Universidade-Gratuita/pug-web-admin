/* --- Temporary Compatibility Barrel --- */
export * as services from "./services";
export * as web from "./web";

/* --- Domain Groups --- */
export * as academic from "./services/academic";
export * as geo from "./services/geo";
export * as identity from "./services/identity";
export * as partner from "./services/partner";
export * as project from "./services/project";

/* --- Identity --- */
export * as auth from "./services/identity/auth";
export * as admins from "./services/identity/admins";
export * as accounts from "./services/identity/accounts";
export * as users from "./services/identity/users";

/* --- Academic --- */
export * as areasOfExpertise from "./services/academic/areas-of-expertise";
export * as courses from "./services/academic/courses";
export * as formerStudents from "./services/academic/former-students";

/* --- Partner --- */
export * as entities from "./services/partner/entities";
export * as staff from "./services/partner/staff";

/* --- Project --- */
export * as projects from "./services/project/projects";
export * as projectAreasOfExpertise from "./services/project/project-areas-of-expertise";
export * as enrollments from "./services/project/enrollments";
export * as attendances from "./services/project/attendances";

/* --- Geo --- */
export * as cities from "./services/geo/cities";
