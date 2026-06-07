/* --- App Shell --- */
export * from "./app-shell";

/* --- Auth --- */
export * from "./auth/login/LoginForm";
export * from "./auth/login/LoginHero";

/* --- Home --- */
export * from "./home/HomeCommandCenterPage";

/* --- Academic --- */
export * from "./academic/AcademicOverviewPage";
export * from "./academic/areas-of-expertise/AreasOfExpertisePage";
export * from "./academic/areas-of-expertise/area-of-expertise/AreaOfExpertisePage";
export * from "./academic/courses/CoursesPage";
export * from "./academic/courses/course/CoursePage";
export * from "./academic/former-students/FormerStudentsPage";
export * from "./academic/former-students/former-student/FormerStudentPage";

/* --- Geo --- */
export * from "./geo/GeoOverviewPage";
export * from "./geo/cities/CitiesPage";
export * from "./geo/cities/city/CityPage";

/* --- Identity --- */
export * from "./identity/IdentityOverviewPage";
export * from "./identity/accounts/AccountsPage";
export * from "./identity/accounts/account/AccountPage";
export * from "./identity/admins/AdminsPage";
export * from "./identity/admins/admin/AdminPage";
export * from "./identity/users/UsersPage";
export * from "./identity/users/user/UserPage";

/* --- Partner --- */
export * from "./partner/PartnerOverviewPage";
export * from "./partner/entities/EntitiesPage";
export * from "./partner/entities/entity/EntityPage";
export { StaffPage as StaffDirectoryPage } from "./partner/staff/StaffPage";
export { StaffPage } from "./partner/staff/staff/StaffPage";

/* --- Project --- */
export * from "./project/ProjectOverviewPage";
export * from "./project/projects/ProjectsPage";
export * from "./project/projects/project/ProjectPage";
export * from "./project/attendances/AttendancesPage";
export * from "./project/attendances/attendance/AttendancePage";
export * from "./project/enrollments/EnrollmentsPage";
export * from "./project/enrollments/enrollment/EnrollmentPage";
