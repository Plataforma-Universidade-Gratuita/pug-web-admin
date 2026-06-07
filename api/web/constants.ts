const WEB_API_VERSION_PREFIX = "/api/v1";

export const WEB_API_ROUTE_BASES = {
	academic: {
		areasOfExpertise: `${WEB_API_VERSION_PREFIX}/academic/areas-of-expertise`,
		courses: `${WEB_API_VERSION_PREFIX}/academic/courses`,
		formerStudents: `${WEB_API_VERSION_PREFIX}/academic/former-students`,
	},
	geo: {
		cities: `${WEB_API_VERSION_PREFIX}/geo/cities`,
	},
	identity: {
		accounts: `${WEB_API_VERSION_PREFIX}/identity/accounts`,
		admins: `${WEB_API_VERSION_PREFIX}/identity/admins`,
		auth: `${WEB_API_VERSION_PREFIX}/auth`,
		users: `${WEB_API_VERSION_PREFIX}/identity/users`,
	},
	partner: {
		entities: `${WEB_API_VERSION_PREFIX}/partners/entities`,
		staff: `${WEB_API_VERSION_PREFIX}/partners/staff`,
	},
	project: {
		attendances: `${WEB_API_VERSION_PREFIX}/projects/attendances`,
		enrollments: `${WEB_API_VERSION_PREFIX}/projects/enrollments`,
		projects: `${WEB_API_VERSION_PREFIX}/projects`,
	},
} as const;
