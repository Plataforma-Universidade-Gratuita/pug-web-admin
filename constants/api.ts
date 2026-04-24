export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export const JSON_HEADERS: Record<string, string> = {
	"Content-Type": "application/json",
};

export const API_ROUTE_BASES = {
	academic: {
		courses: "/academic/courses",
		schools: "/academic/schools",
		students: "/academic/students",
	},
	geo: {
		cities: "/geo/cities",
	},
	identity: {
		accounts: "/identity/accounts",
		admins: "/identity/admins",
		auth: "/auth",
		users: "/identity/users",
	},
	partner: {
		entities: "/partner/entities",
		staff: "/partners/staff",
	},
	project: {
		attendances: "/projects/attendances",
		enrollments: "/projects/enrollments",
		projectSchools: "/projects/by-school",
		projects: "/projects",
	},
} as const;

export const WEB_API_ROUTE_BASES = {
	academic: {
		courses: "/api/academic/courses",
		schools: "/api/academic/schools",
		students: "/api/academic/students",
	},
	geo: {
		cities: "/api/geo/cities",
	},
	identity: {
		accounts: "/api/identity/accounts",
		admins: "/api/identity/admins",
		auth: "/api/auth",
		users: "/api/identity/users",
	},
	partner: {
		entities: "/api/partner/entities",
		staff: "/api/partner/staff",
	},
	project: {
		attendances: "/api/project/attendances",
		enrollments: "/api/project/enrollments",
		projectSchools: "/api/project/project-schools",
		projects: "/api/project/projects",
	},
} as const;
