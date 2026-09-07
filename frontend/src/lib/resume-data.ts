export interface Experience {
	role: string;
	/** Wall-label credit line: employer · location · dates. */
	medium: string;
	/** One curatorial sentence — not a bullet list. */
	blurb: string;
}

export interface Project {
	name: string;
	/** Wall-label credit line: stack · discipline, year. */
	medium: string;
	/** One curatorial sentence — not a bullet list. */
	blurb: string;
	github?: string;
	demoId?: string;
	/** Anchor id so the hero bio can link straight to this entry. */
	anchorId?: string;
}

export const experience: Experience[] = [
	{
		role: 'Software Development Intern',
		medium:
			'Picabord Technologies Pvt. Ltd. · Chennai, TN · Oct. 2025 – Nov. 2025, Apr. 2026 – June 2026',
		blurb:
			'Sole developer for the company website and Accord, a full-stack internal CRM — multi-tenant architecture with org-level data isolation, RBAC, and token-based invites, secured with HTTP-only auth cookies and hashed passwords, containerized for development with Docker.'
	},
	{
		role: 'President',
		medium: 'EDC CITIL · CIT Chennai',
		blurb: "Led EDC CITIL, the entrepreneurship cell at CIT Chennai's student community."
	}
];

export const projects: Project[] = [
	{
		name: 'SimhaLink, A Crowd Control & Smart City System',
		anchorId: 'simhalink',
		medium: 'Dart · Flutter, 2025',
		blurb:
			"A Flutter app built solo for the Simhastha Kumbh Mela hackathon — role-scoped access for organizers, medical staff, and volunteers, with end-to-end encrypted group coordination and shortest-path navigation for lost members at one of the world's largest gatherings.",
		github: 'https://github.com/ApxllxCartxr/SimhaLink'
	},
	{
		name: 'cmrlsim, A Chennai Metropolitan Railway Simulator',
		demoId: 'cmrlsim',
		medium: 'Go · discrete-event simulation, 2026',
		blurb:
			'A modular monolith simulating the full CMRL Phase I network — 41 stations, 54.1 km — as a weighted directed graph, with train movement, fare collection, and ridership economics run as discrete events and exposed through a REST API.',
		github: 'https://github.com/ApxllxCartxr/cmrlsim'
	}
];

export interface SkillGroup {
	label: string;
	items: string[];
}

export const skillGroups: SkillGroup[] = [
	{ label: 'Languages', items: ['Python', 'JavaScript', 'Go'] },
	{
		label: 'Frameworks & runtimes',
		items: ['Node.js', 'Express.js', 'React.js', 'Next.js', 'Django', 'Flask', 'Flutter']
	},
	{ label: 'Data & infra', items: ['PostgreSQL', 'MongoDB', 'SQLite', 'Firebase'] },
	{
		label: 'Practice',
		items: [
			'AI engineering',
			'Prompt engineering',
			'Object-oriented programming',
			'Git fundamentals',
			'RESTful APIs',
			'Database architecture'
		]
	}
];
