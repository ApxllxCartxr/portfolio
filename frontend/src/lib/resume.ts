// Structured resume data — the single source of truth for the landing page.
// Transcribed from /docs/resume.md; descriptions kept concise for a one-screen,
// high-readability layout.

export type IconName = 'mail' | 'git' | 'phone';

export interface Contact {
	label: string;
	value: string;
	href: string;
	icon: IconName;
}

export interface Job {
	company: string;
	role: string;
	location: string;
	period: string;
	summary: string;
}

export interface Project {
	name: string;
	tagline: string;
	stack: string;
	summary: string;
}

export interface Education {
	school: string;
	degree: string;
	location: string;
	period: string;
	summary: string;
}

export const profile = {
	name: 'Joseph Fernando',
	fullName: 'Joseph Ashish Theron Fernando',
	eyebrow: 'Software Engineer',
	location: 'Chennai, Tamil Nadu',
	// Left-card headline (Redaction 50).
	tagline: 'shipping software end to end — from internal CRMs to city-scale simulators.',
	// Header intro (Image #5): bold lead + body + a small red phrase.
	lead: 'Full-stack & systems engineer who ships solo.',
	intro:
		'I build production web apps, multi-tenant SaaS, and simulation engines — owning architecture, data, and delivery from inception to deploy.',
	cta: 'Currently open to internships.'
};

export const contacts: Contact[] = [
	{
		label: 'Email',
		value: 'josephfernando05@proton.me',
		href: 'mailto:josephfernando05@proton.me',
		icon: 'mail'
	},
	{
		label: 'GitHub',
		value: 'github.com/apxllxcartxr',
		href: 'https://github.com/apxllxcartxr',
		icon: 'git'
	},
	{
		label: 'Phone',
		value: '+91 730 575 4188',
		href: 'tel:+917305754188',
		icon: 'phone'
	}
];

// "Focus" pills (right of the skills row).
export const focus: string[] = [
	'Full-stack web',
	'Multi-tenant SaaS',
	'Simulation engines',
	'Real-time systems',
	'AI engineering'
];

export const experience: Job[] = [
	{
		company: 'Picabord Technologies',
		role: 'Software Development Intern',
		location: 'Chennai, TN',
		period: "Oct '25 – Nov '25 · Apr '26 – Jun '26",
		summary:
			'Sole dev of the company site and Accord, a multi-tenant CRM (Next.js · Prisma · Postgres): org-level isolation, RBAC, token invites, secured & Dockerized.'
	}
];

export const projects: Project[] = [
	{
		name: 'SimhaLink',
		tagline: 'Crowd control & smart-city system',
		stack: 'Flutter · Firebase',
		summary:
			'Solo Flutter app for the Simhastha Kumbh Mela Hackathon — role-based access, E2E-encrypted coordination, and shortest-path routing for lost members.'
	},
	{
		name: 'cmrlsim',
		tagline: 'Chennai Metro railway simulator',
		stack: 'Go · REST',
		summary:
			'Go discrete-event engine modelling CMRL Phase I (41 stations, 54.1 km) as a weighted graph: train movement, boarding, fares, and ridership economics.'
	}
];

export const education: Education = {
	school: 'Chennai Institute of Technology',
	degree: 'B.E. Computer Science & Engineering',
	location: 'Chennai, TN',
	period: "Expected Jun '28",
	summary:
		'7.85 CGPA · President, ED-Cell (CITIL) — led 35 members, ran workshops for 300+, raised ₹30,000.'
};

// Skills — flat Persian-blue outlined pills (no icons needed in the sheet look).
export const skills: string[] = [
	'Python',
	'JavaScript',
	'React.js',
	'Next.js',
	'Node.js',
	'Express.js',
	'Django',
	'Flask',
	'Go',
	'Flutter',
	'Firebase',
	'PostgreSQL',
	'MongoDB',
	'SQLite',
	'REST APIs',
	'AI Engineering',
	'Prompt Engineering',
	'Git'
];
