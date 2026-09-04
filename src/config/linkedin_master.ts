// Channel prose accepted in #152. Titles, companies, and dates resolve by roleId.
export interface LinkedInProse {
	tagline: string;
	about: string;
	experience: { roleId: string; blurb: string }[];
}
export const linkedinMaster: LinkedInProse = {
	tagline:
		"Principal, Mechanistic | Hands-on engineering leadership | Complex systems from ambiguity to production.",
	about:
		"\nMy operating system was established early. I grew up on a remote British Columbia oyster farm at the end of Highway 101 - the literal end of the road. The ocean doesn't grade on a curve. You learn what holds and what fails.\n\nAt twelve I wanted a motorcycle. My mother said over my dead body. I said what if I pay for it. Three months later I'd felled, bucked, split, and humped nineteen cords of wood to the end of our driveway at a hundred dollars a cord. The bike cost five hundred and fifty dollars. The lesson was free.\n\nThe way you do anything is the way you do everything.\n\nI've spent forty years applying that logic to high-stakes physical systems - medical catheters, SGI workstations, the original Xbox, Digidesign audio consoles, Kaleidescape servers, the Avegant Glyph, automated food robots. Forty-plus commercial products. Precision mechanical design, thermal budgets, global manufacturing, regulatory compliance in environments where the physical world doesn't forgive mistakes. No git reset.\n\nThe same forensic methodology I apply to a thermal yield crisis or a supply chain collapse, I now apply to intelligent systems. I build EN-OS - a local-first AI agent infrastructure that keeps source evidence, permissions, decisions, and handoffs visible. I treat agentic software the way I treat a tolerance stack: account for every degree of freedom and fence the failure modes before assembly.\n\nThe work I want is hands-on engineering leadership with a real architectural mandate - setting methods, leading teams through hard decisions, and staying close enough to the hardware or code to catch what the plan missed. Physical systems, digital systems, or the boundary where they meet. The operating method is the same regardless of the domain.\n",
	experience: [
		{
			roleId: "mechanistic-2022",
			blurb:
				"\nHard programs usually fail at the seams between architecture, evidence, and execution. At MECHANISTIC I lead systems design and manufacturing work from ambiguous constraints through production and recovery, augmented by AI infrastructure I built and operate in-house.\n\n· I lead mechanical architecture, DFM/DFA, tolerance analysis, manufacturing transfer, and supply-chain recovery across consumer electronics, industrial robotics, and medical devices.\n\n· I built EN-OS, a local-first agent infrastructure for evidence retrieval, root-cause synthesis, and decision documentation. Bounded tools and approval gates keep the system traceable to source and human authority.\n\n· The change is one operating method across hardware and software: expose the constraints, test the claims, preserve the decision trail, and ship only what the evidence can carry.\n",
		},
		{
			roleId: "hyphen-2021",
			blurb:
				'\nDigital restaurant orders were outrunning manual lines, but full automation still failed on food physics, sanitation, and retrofit constraints. I led mechanical design and systems architecture for the Augmented Makeline, a two-lines-in-one system that built bowls below the counter while the crew handled work needing human dexterity above it.\n\n· I developed six dispenser types around the material behavior of rice, proteins, sauces, and greens, using gravimetric feedback and de-agglomeration to cut portion variance from ±15% to ±2% and food waste by 98%.\n\n· I integrated 70+ actuators through Beckhoff IPCs, TwinCAT 3, and EtherCAT, with core isolation separating real-time motion from IoT and HMI work. TwinSAFE reduced control-wiring bulk by about 50%.\n\n· The platform sustained 350 meals per hour at 99%+ order accuracy, fit the standard 13.5-foot makeline footprint without new plumbing, and broke down tool-free for a 15-minute sanitation cycle.\n\nCo-inventor: "Modular System for Food Assembly" - Patent US20240164588A1.\n',
		},
		{
			roleId: "noon-2017",
			blurb:
				"\nNoon needed four connected lighting products to behave like one premium system while the glass, molded, stamped, and die-cast interfaces survived household use. As Head of Mechanical Engineering, I led hands-on mechanical architecture and reliability from concept through EVT and DVT.\n\n· On the Elvis extension switch, seven of seven EVT units arrived with floating caps. I traced the failure to a 0.1 mm molded-versus-CAD offset, corrected the geometry, and replaced fixed-thickness PSA with structural adhesive. EVT2 yield recovered to 100%.\n\n· On the Room Director, I used staged reliability packets to keep glass, coating, retention, rattle, and functional failures separate. EVT1 and EVT2 drop campaigns remained open failures; a separate household-chemical campaign passed.\n\n· Across the screwless wall-plate and base-station interfaces, I owned mechanical product architecture and reliability oversight while keeping detailed calculation authorship and cross-functional responsibilities explicit.\n\nAcquired by Savant Systems.\n",
		},
		{
			roleId: "mechanistic-2018",
			blurb:
				"\nMicromobility and connected-device clients needed concepts turned into hardware that could survive real deployment. Through MECHANISTIC I carried the Bay Wheels eBike IoT module and an electric cargo-bike platform from system architecture into detailed mechanical design.\n\n· For Lyft's Bay Wheels fleet, I engineered a ruggedized IoT module around the constraints of outdoor, field-deployed hardware.\n\n· For the eCargo platform, I translated the vehicle architecture into detailed parts and assemblies ready for prototype development.\n",
		},
		{
			roleId: "avegant-2015",
			blurb:
				"\nThe Avegant Glyph had to turn a first-of-its-kind head-worn display into a manufacturable product without losing optical alignment, acoustic performance, comfort, or reliability. I led mechanical design, DFM, and NPI from late EVT through mass production.\n\n· I carried the headband through spring-rate characterization, second-source spring qualification, and lifecycle validation, balancing retention, acoustic seal, and comfort rather than claiming a perfect single-point answer.\n\n· When optical throughput yield collapsed to 35.40%, I implemented cleanroom protocol and dedicated DMD inspection stations. Yield recovered to 77.87% over ten weeks.\n\n· I drove T1 through T6 tooling and cable-routing revisions after the telescoping mechanism regressed to a 40% seizure rate at 250 cycles, keeping the failure visible until the mechanism stabilized.\n\nThe Glyph reached mass production and was named Best of CES 2016.\n",
		},
		{
			roleId: "kaleidescape-2008",
			blurb:
				"\nKaleidescape's premium home-cinema hardware had to survive field reliability crises while new systems moved through mechanical definition, NPI, and sustaining. As Senior Mechanical Design Engineer, I carried hands-on architecture, supplier coordination, and failure analysis across the product family.\n\n· On the M700 disc vault, I analyzed 3,000,000+ field-cycle events and traced the fleet failure cascade to dirty-roller friction loss compounded by carousel warp. A force-dominant balance-bar retrofit eliminated dirty-roller slippage in validation.\n\n· I paired the mechanism fix with measured carousel inspection limits and a sister-rib tooling correction, recovering 100% of the questioned carousel inventory instead of scrapping it.\n\n· On KSYSTEM-120, I coordinated mechanical integration, authored the mechanical first-article procedure, and originated bounded part-level inspection records toward pilot and ramp readiness without claiming unverified shipment or whole-product yield.\n\nCinema One won CEPro Product of the Year.\n",
		},
		{
			roleId: "digidesign-2003",
			blurb:
				"\nFlagship Digidesign consoles had to integrate dense electronics, thermal management, service access, compliance, and hard cost targets without missing launch. I led mechanical engineering and industrial design across 12+ shipped control surfaces and recording interfaces, including C|24, D-Command, SC48, ICON, 003, and the Mbox 2 family.\n\n· On C|24, I re-architected the RoHS-era platform around 16 in-house preamps, removing about $200 per unit in licensing royalties while holding the $9,995 product target. The program delivered 500 units for Q4 2007 at 51.80% gross margin.\n\n· I authored and enforced the Data Control Drawing protocol across 19 C|24 PCB assemblies. The geometric firewall produced 100% mechanical fit on the first physical build.\n\n· A vertical-hang paint-cure fixture reduced C|24 side-cap warp from 2.50 mm to below 0.50 mm and recovered 100% of pilot cosmetic yield. A trap-door headphone-jack redesign cut service time from more than two hours to under ten minutes.\n\n· On SC48, a thermal log captured a hard shutdown at 75°C. I tested 17 chassis-and-fan configurations, moved the enclosure from 3U to 4U, and ran three 80 mm fans at 12V. In the comparable 4U test rows, the change reduced the left R69 rise by 9.9°C and the absolute reading by 11.6°C.\n\n· The folded-steel SC48 I-beam carried the taller thermal architecture without the $121.70-per-unit extrusion category present in the predecessor benchmark.\n\nSC48 (Venue Mix Rack) won a TEC Award for Sound Reinforcement Console Technology.\n",
		},
		{
			roleId: "mechanistic-1998",
			blurb:
				"\nMicrosoft, WebTV, Motorola, Netscreen, and Hewlett Packard programs needed industrial-design intent converted into mechanical packages that suppliers could prototype and build. Through MECHANISTIC I delivered product architecture, Class-A surfacing, detailed design, and manufacturing support across that rapid client portfolio.\n\n· For WebTV's Galaxy set-top system, I modeled a 150 W thermal load at 45°C ambient inside a 300 mm enclosure; the simulation reported 28.3 CFM while keeping the result explicitly bounded as analysis rather than shipped performance.\n\n· For the Cortez wireless keyboard, I translated organic industrial-design surfaces into a Pro/ENGINEER hard-model package released to prototype in six weeks.\n\n· For the Elmer/Zeus network server, I mapped what could be retained from the reference enclosure, remade the base and I/O boundary, and released the changed geometry without inventing a production outcome.\n\n· For Motorola's phone-powered MP3 accessory, I delivered mechanical design and manufacturing support on a sub-three-month cycle. The product became a 2002 CES Innovations Honoree.\n",
		},
		{
			roleId: "frogdesign-1997",
			blurb:
				"\nfrogdesign's client programs moved quickly from industrial-design intent into tooling and pilot hardware. I delivered mechanical design and Class-A surface development across medical devices, consumer electronics, and satellite systems, carrying the geometry from feasibility into manufacturable parts.\n\n· KaVo and Edeca dental systems required clinical ergonomics, controlled surfaces, and manufacturing discipline.\n\n· The Vadem Clio converted a thin Windows CE device between handheld and keyboard modes through a compact hinge and molded enclosure.\n\n· The Newscorp satellite receiver carried consumer-electronics chassis design into manufacturing support.\n",
		},
		{
			roleId: "mechanistic-1993",
			blurb:
				"\nIndependent product programs needed an engineer who could move between the industrial designer, the CAD model, the prototype shop, and the supplier. Through MECHANISTIC I embedded with Function Engineering, SGI, and EP Technologies to deliver mechanical design from concept through manufacturing support.\n\n· I developed complex organic surfaces in Pro/ENGINEER for consumer products where fit, feel, parting lines, and tooling economics had to resolve in the same geometry.\n\n· Programs included the SwitchBlade and Frantic Frames inline-skate platforms, the Sunbeam Toast Logic window toaster, and consumer hardware for Acer, Packard Bell, and Fissler.\n\n· The work established a repeatable practice: make the mechanism legible, make the surfaces manufacturable, and carry the intent into supplier execution.\n",
		},
		{
			roleId: "sgi",
			blurb:
				"\nSGI's workstation teams were pushing thermal, acoustic, cosmetic, and supply-chain constraints at the same time. I supported mechanical development for the Personal Iris, Indy, Indigo, Indigo II, and Iris File families while running the lab and vendor interface that turned test evidence into design decisions.\n\n· I configured acoustic, airflow, and thermal test systems for the Personal Iris family and worked with reliability teams to make the results actionable.\n\n· I managed the Product Design lab and coordinated outside vendors supplying prototype parts, models, and rework for development builds.\n\n· I helped connect enclosure definition, supplier feedback, and color measurement so manufacturing decisions were grounded in shared physical standards.\n",
		},
		{
			roleId: "ep-technologies-1986",
			blurb:
				"\nClass III cardiac-ablation catheter production made traceability a daily operating requirement. As a Production Supervisor at EP Technologies from 1986 to 1989, I learned to treat process evidence, inspection, and deviation records as part of the product. That is where the forensic method started.\n",
		},
	],
};
