export interface Experience {
	role: string;
	company: string;
	period: string;
	location: string;
	bullets: string[];
}

export interface Project {
	name: string;
	bullets: string[];
}

export const experience: Experience[] = [
	{
		role: 'Software Development Intern',
		company: 'Picabord Technologies Pvt. Ltd.',
		period: 'Oct. 2025 – Nov. 2025, Apr. 2026 – June 2026',
		location: 'Chennai, TN',
		bullets: [
			'Sole developer for the company website and Accord, a full-stack internal CRM, both built end-to-end using Next.js, Prisma, and PostgreSQL',
			'Built multi-tenant architecture with org-level data isolation, RBAC, token-based invites, and full client/contract/project/task lifecycle management',
			'Secured with HTTP-only auth cookies, hashed passwords, and authenticated server actions; containerized dev environment using Docker'
		]
	}
];

export const projects: Project[] = [
	{
		name: 'SimhaLink, A Crowd Control & Smart City System',
		bullets: [
			"Built a Flutter app solo for the Simhastha Kumbh Mela Hackathon, targeting real-time crowd safety at one of the world's largest religious gatherings",
			'Implemented role-based access for organizers, medical staff, security, and volunteers with scoped permissions per role. Built end-to-end encrypted group coordination with leader beacons and shortest-path navigation for lost members'
		]
	},
	{
		name: 'cmrlsim, A Chennai Metropolitan Railway Simulator',
		bullets: [
			'Designed and implemented a modular monolith simulation engine in Go modelling the full CMRL Phase I network (41 stations, 54.1 km) as a weighted directed graph, with discrete-event simulation of train movement, passenger boarding/alighting, fare collection, and ridership economics',
			'Architected internal event bus, simulation clock, and service boundaries (clock, network, scheduler, train, passenger, fare, economics, pathfinder packages) to simulate distributed-system communication patterns within a single Go binary; exposed simulation state via a REST API'
		]
	}
];

export const skills: string[] = [
	'Python',
	'JavaScript',
	'Node.js',
	'Express.js',
	'React.js',
	'Next.js',
	'Django',
	'Flask',
	'MongoDB',
	'SQLite',
	'PostgreSQL',
	'Flutter',
	'Firebase',
	'Go',
	'AI Engineering',
	'Prompt Engineering',
	'Object-Oriented Programming (OOP)',
	'Git Fundamentals',
	'RESTful APIs',
	'Database Architecture'
];
