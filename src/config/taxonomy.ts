// Central taxonomy definitions for the site
// All components, CMS schemas and visualisations import from here

export const INDUSTRIES = [
	{ label: "Consumer Electronics", value: "consumer_electronics" },
	{ label: "Pro Audio", value: "pro_audio" },
	{ label: "Consumer Appliance", value: "consumer_appliance" },
	{ label: "Automation", value: "automation" },
] as const;
export const INDUSTRY_VALUES = INDUSTRIES.map((i) => i.value);

export const CATEGORIES = [
	// Consumer
	{ label: "Consumer Electronics", value: "consumer_electronics" },
	{ label: "Mobile Device", value: "mobile_device" },
	{ label: "Wearable / AR", value: "wearable_ar" },
	{ label: "Home Entertainment", value: "home_entertainment" },
	{ label: "Smart Home", value: "smart_home" },
	{ label: "Appliance", value: "appliance" },

	// Professional
	{ label: "Enterprise Hardware", value: "enterprise_hardware" },
	{ label: "Medical Device", value: "medical_device" },
	{ label: "Computing", value: "computing" },
	{ label: "Control Surface", value: "control_surface" },

	// Components
	{ label: "Input Device", value: "input_device" },
	{ label: "Module / Sub-system", value: "module_subsystem" },
] as const;
export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

export const EMPLOYERS = [
	{ label: "Digidesign", value: "digidesign" },
	{ label: "Mechanistic", value: "mechanistic" },
	{ label: "Kaleidescape", value: "kaleidescape" },
	{ label: "Noon", value: "noon" },
	{ label: "Hyphen", value: "hyphen" },
	{ label: "Silicon Graphics", value: "silicon_graphics" },
	{ label: "Frog Design", value: "frogdesign" },
	{ label: "EP Technologies", value: "ep_technologies" },
	{ label: "Avegant", value: "avegant" },
] as const;
export const EMPLOYER_VALUES = EMPLOYERS.map((e) => e.value);

export const CLIENTS = [
	{ label: "Microsoft", value: "microsoft" },
	{ label: "WebTV", value: "webtv" },
	{ label: "UltimateTV", value: "ultimatetv" },
	{ label: "Frog Design", value: "frogdesign" },
] as const;
export const CLIENT_VALUES = CLIENTS.map((c) => c.value);

// Production Lifecycle (Design Thinking / NPD)
export const PRODUCTION_STATUS = [
	{ label: "Discovery (Research)", value: "discovery" },
	{ label: "Definition (Strategy)", value: "definition" },
	{ label: "Concept (Ideation)", value: "concept" },
	{ label: "Prototype (Build)", value: "prototype" },
	{ label: "Validation (Test)", value: "validation" },
	{ label: "Production (Launch)", value: "production" },
] as const;
export const PRODUCTION_STATUS_VALUES = PRODUCTION_STATUS.map((s) => s.value);

// Production Scale (Unit Volume / Magnitude)
export const PRODUCTION_SCALE = [
	{ label: "One-Off (1)", value: "one_off" },
	{ label: "Limited (10s)", value: "limited" },
	{ label: "Series (1,000s)", value: "series" },
	{ label: "Mass (100k+)", value: "mass" },
	{ label: "Global (Millions)", value: "global" },
] as const;
export const PRODUCTION_SCALE_VALUES = PRODUCTION_SCALE.map((s) => s.value);

export const ROLES = [
	{ label: "Mechanical Engineer", value: "mechanical_engineer" },
	{ label: "Industrial Designer", value: "industrial_designer" },
	{ label: "Software Engineer", value: "software_engineer" },
	{ label: "Project Lead", value: "project_lead" },
	{ label: "Consultant", value: "consultant" },
	{ label: "Other", value: "other" },
] as const;
export const ROLE_VALUES = ROLES.map((r) => r.value);

export const TOOLS = [
	{ label: "Pro/Engineer", value: "pro_engineer" },
	{ label: "Windchill", value: "windchill" },
	{ label: "SolidWorks", value: "solidworks" },
	{ label: "CAD", value: "cad" },
	{ label: "Other", value: "other" },
	{ label: "Onshape", value: "onshape" },
	{ label: "PTC Creo", value: "ptc_creo" },
	{ label: "Adobe Creative Suite", value: "adobe_creative_suite" },
	{ label: "Blender", value: "blender" },
	{ label: "KeyShot", value: "keyshot" },
	{ label: "Thermal Simulation", value: "thermal_simulation" },
	{ label: "AutoCAD", value: "autocad" },
] as const;
export const TOOL_VALUES = TOOLS.map((t) => t.value);
