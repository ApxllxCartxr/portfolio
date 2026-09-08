export interface Experience {
	role: string;
	org: string;
	location: string;
	period: string;
	/** The tools the role was actually built with — the mono rail sets these. */
	stack: string[];
	/** One curatorial sentence. Unused on the homepage now that the record
	 *  shows the full account, but it is what the SEO description is drawn from. */
	blurb: string;
	points: string[];
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
	/** Three facts, shown only on the two lead projects — the reason they
	 *  lead. Everything here has to be true of the shipped thing. */
	specs?: [string, string, string];
	/** The full account, for the resume page. */
	points?: string[];
}

export const experience: Experience[] = [
	{
		role: 'Software Development Intern',
		org: 'Picabord Technologies Pvt. Ltd.',
		location: 'Chennai, TN',
		period: 'Oct. 2025 – Nov. 2025, Apr. 2026 – June 2026',
		stack: ['Next.js', 'Prisma', 'PostgreSQL', 'Docker'],
		blurb:
			'Sole developer for the company website and Accord, a full-stack internal CRM — multi-tenant architecture with org-level data isolation, RBAC, and token-based invites, secured with HTTP-only auth cookies and hashed passwords, containerized for development with Docker.',
		points: [
			'Sole developer for the company website and Accord, a full-stack internal CRM, both built end-to-end with Next.js, Prisma and PostgreSQL.',
			'Built multi-tenant architecture with org-level data isolation, RBAC, token-based invites, and full client, contract, project and task lifecycle management.',
			'Secured with HTTP-only auth cookies, hashed passwords and authenticated server actions; containerized the development environment with Docker.'
		]
	}
];

/*
	Ordered by weight, not by date. cmrlsim and OpenStore lead — the grid
	in ProjectCards gives the first two entries the large boxes, and only
	they carry a spec row.
*/
export const projects: Project[] = [
	{
		name: 'cmrlsim, A Chennai Metropolitan Railway Simulator',
		demoId: 'cmrlsim',
		medium: 'Go · discrete-event simulation, 2026',
		blurb:
			'A modular monolith simulating the full CMRL Phase I network, 41 stations across 54.1 km, as a weighted directed graph. Train movement, fare collection and ridership economics run as discrete events and are exposed through a REST API.',
		specs: ['41 stations', '54.1 km', 'Discrete events'],
		points: [
			'Designed and implemented a modular monolith simulation engine in Go modelling the full CMRL Phase I network — 41 stations, 54.1 km — as a weighted directed graph, with discrete-event simulation of train movement, passenger boarding and alighting, fare collection and ridership economics.',
			'Architected an internal event bus, simulation clock and service boundaries — clock, network, scheduler, train, passenger, fare, economics and pathfinder packages — to simulate distributed-system communication inside a single Go binary, exposed through a REST API.'
		],
		github: 'https://github.com/ApxllxCartxr/cmrlsim'
	},
	{
		name: 'OpenStore',
		medium: 'Python · agentic commerce, 2026',
		blurb:
			'An AI sales channel a merchant switches on in three commands. Agents propose, a deterministic compiler holding every key decides, and every rupee that moves leaves a receipt anyone can verify offline.',
		specs: ['18 MCP tools', '627 tests', 'Offline-verifiable'],
		points: [
			'Built a Python sidecar for the Razorpay Buildathon (Track 01, agentic commerce) that a merchant runs beside an existing store — from a YAML config and three commands it serves discovery and UCP manifests, an agent-readable catalog, 18 MCP tools and checkout.',
			'Separated reasoning from money across three layers: LLM agents can only propose, and a deterministic intent compiler runs 13 named checks against a human-signed, WebAuthn-approved spending policy while holding every key. An import-firewall test enforces that agent modules cannot import payment or signing code.',
			'Wrote every order to a PoAI evidence bundle — nine sections, SHA-256 hash-chained, ES256-signed, Rekor-anchored — checkable offline by a 14-check verifier, alongside a double-entry ledger, idempotent Razorpay calls and HMAC-verified webhooks with a dead-letter sweeper. 627 tests, mypy and ruff clean.'
		],
		github: 'https://github.com/ApxllxCartxr/OpenStore'
	},
	{
		name: 'LegacyWeaver',
		medium: 'Python · COBOL migration, 2026',
		blurb:
			'Autonomous COBOL to Java migration, verified against the compiled legacy binary rather than against a reading of it. It runs both programs on identical input, compares every output byte, classifies each divergence by root cause, and drives a local repair loop until the candidate verifies.',
		specs: ['Byte-for-byte', '201 records', '0 false positives'],
		points: [
			'Built a COBOL-to-Java migration harness in Python that treats the compiled GnuCOBOL binary as the specification — it compiles and executes the original alongside a Java candidate on identical input and compares output byte-for-byte, field-resolved against a data-driven layout table, with no tolerance, threshold or heuristic anywhere in the pass/fail decision.',
			'Classified every divergence by root cause — padding, sign, scale, truncation, control flow — deterministically, with no model in the classification path, so the same input always produces the same verdict. Measured 132 divergences across 201 records against a deliberately defective baseline, with zero false positives on self-comparison of the golden output.',
			'Added an autonomous repair agent running local inference only: a deterministic scaffold synthesizes a candidate, a repair loop iterates against the verifier’s own output, and failure memory records dead ends so the orchestrator does not retry them. A loopback-only HTTP service streams run traces while holding no domain logic — every value it serves is reproducible from the CLI.'
		],
		github: 'https://github.com/ApxllxCartxr/LegacyWeaver'
	},
	{
		name: 'SimhaLink, A Crowd Control & Smart City System',
		anchorId: 'simhalink',
		medium: 'Dart · Flutter, 2025',
		blurb:
			"A Flutter app built solo for the Simhastha Kumbh Mela hackathon, with role-scoped access for organizers, medical staff and volunteers. End-to-end encrypted group coordination and shortest-path navigation for lost members at one of the world's largest gatherings.",
		points: [
			"Built a Flutter app solo for the Simhastha Kumbh Mela hackathon, targeting real-time crowd safety at one of the world's largest religious gatherings.",
			'Implemented role-based access for organizers, medical staff, security and volunteers with scoped permissions per role, end-to-end encrypted group coordination with leader beacons, and shortest-path navigation for lost members.'
		],
		github: 'https://github.com/ApxllxCartxr/SimhaLink'
	},
	{
		name: 'Facet',
		medium: 'Python · Compliance tooling, 2026',
		blurb:
			'AML triage where the model explains and the rules decide. Gemma reads transactions, onboarding documents and financial records, flags anomalies, and writes the report a review team actually signs off on.',
		github: 'https://github.com/ApxllxCartxr/Facet'
	}
];

export interface Education {
	school: string;
	credential: string;
	/** Credit line: location · expected graduation. */
	medium: string;
	points: string[];
}

export const education: Education[] = [
	{
		school: 'Chennai Institute of Technology',
		credential: 'B.E. Computer Science and Engineering',
		medium: 'Chennai, TN · Expected June 2028',
		points: [
			'7.85 CGPA.',
			'President, Entrepreneurship Development Cell — CITIL · Aug. 2025 – Sept. 2026. Lead a 35-member cell, overseeing operations, events and member development across multiple initiatives.',
			'Hosted The 360° Marketer, a marketing workshop drawing 300+ participants, covering full-funnel strategy for student entrepreneurs.',
			'Organized Startup Essentials, a 200-person workshop with Startup Singam featuring the CEO as keynote speaker, and raised ₹30,000 in funding for the event.'
		]
	}
];

/** Contact block, used by the resume page. */
export const contact = {
	name: 'Joseph Ashish Theron Fernando',
	email: 'josephfernando05@proton.me',
	github: 'github.com/apxllxcartxr',
	phone: '(+91) 730 575 4188',
	location: 'Chennai, Tamil Nadu'
};

export interface Skill {
	name: string;
	/** Editorial weight, 0–1: how much of my working time this actually takes.
	 *  The stack specimen sizes each name by it, so this is the one place to
	 *  argue with the claim the section makes. */
	weight: number;
}

export interface SkillGroup {
	label: string;
	items: Skill[];
}

export const skillGroups: SkillGroup[] = [
	{
		label: 'Languages',
		items: [
			{ name: 'Python', weight: 1 },
			{ name: 'Go', weight: 0.9 },
			{ name: 'JavaScript', weight: 0.75 }
		]
	},
	{
		label: 'Frameworks & runtimes',
		items: [
			{ name: 'Node.js', weight: 0.7 },
			{ name: 'Next.js', weight: 0.6 },
			{ name: 'React.js', weight: 0.6 },
			{ name: 'Django', weight: 0.5 },
			{ name: 'Flutter', weight: 0.5 },
			{ name: 'Express.js', weight: 0.4 },
			{ name: 'Flask', weight: 0.3 }
		]
	},
	{
		label: 'Data & infra',
		items: [
			{ name: 'PostgreSQL', weight: 0.85 },
			{ name: 'MongoDB', weight: 0.45 },
			{ name: 'SQLite', weight: 0.35 },
			{ name: 'Firebase', weight: 0.25 }
		]
	},
	{
		label: 'Practice',
		items: [
			{ name: 'RESTful APIs', weight: 0.8 },
			{ name: 'Database architecture', weight: 0.7 },
			{ name: 'AI engineering', weight: 0.65 },
			{ name: 'Object-oriented programming', weight: 0.55 },
			{ name: 'Prompt engineering', weight: 0.4 },
			{ name: 'Git fundamentals', weight: 0.35 }
		]
	}
];

/*
	Wall labels — the shape the work section reads from. `projects` already
	carries a credit line (`medium`) and one curatorial sentence (`blurb`),
	which is exactly a museum wall label, so this is a mapping and not a
	second copy of the content. Experience does not map through here: it is
	set as a full record, not a label.
*/
export interface WallLabel {
	title: string;
	medium: string;
	blurb: string;
	href?: string;
	demoId?: string;
	anchorId?: string;
	specs?: [string, string, string];
}

export const workLabels: WallLabel[] = projects.map((project) => ({
	title: project.name,
	medium: project.medium,
	blurb: project.blurb,
	href: project.github,
	demoId: project.demoId,
	anchorId: project.anchorId,
	specs: project.specs
}));
