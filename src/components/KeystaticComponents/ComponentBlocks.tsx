import { fields } from "@keystatic/core";
import { block, wrapper } from "@keystatic/core/content-components";

// preview components
import KeystaticAdmonition from "./KeystaticAdmonition";

const Newsletter = block({
	label: "Newsletter",
	ContentView: () => null,
	schema: {},
});

const Admonition = wrapper({
	label: "Admonition",
	ContentView: (props) => (
		<KeystaticAdmonition variant={props.value.variant}>{props.children}</KeystaticAdmonition>
	),
	schema: {
		variant: fields.select({
			label: "Variant",
			options: [
				{ value: "info", label: "Info" },
				{ value: "tip", label: "Tip" },
				{ value: "caution", label: "Caution" },
				{ value: "danger", label: "Danger" },
			],
			defaultValue: "info",
		}),
		// This makes it so you can edit what is inside the admonition
		content: fields.child({
			kind: "block",
			formatting: { inlineMarks: "inherit", softBreaks: "inherit" },
			links: "inherit",
			editIn: "both",
			label: "Admonition Content",
			placeholder: "Enter your admonition content here",
		}),
	},
});

const ModelViewer = block({
	label: "Model Viewer",
	schema: {
		src: fields.text({ label: "Source URL (GLB)" }),
		alt: fields.text({ label: "Alt Text" }),
		poster: fields.text({ label: "Poster Image" }),
		environmentImage: fields.text({ label: "Environment Image" }),
		cameraOrbit: fields.text({ label: "Camera Orbit" }),
		autoRotate: fields.checkbox({ label: "Auto Rotate" }),
	},
	ContentView: (props) => (
		<div style={{ padding: "1rem", background: "#f5f5f5", border: "1px solid #ddd" }}>
			<strong>Model Viewer:</strong> {props.value.src}
		</div>
	),
});

const YouTube = block({
	label: "YouTube",
	schema: {
		id: fields.text({ label: "YouTube Video ID" }),
		title: fields.text({ label: "Title" }),
	},
	ContentView: (props) => (
		<div style={{ padding: "1rem", background: "#f5f5f5", border: "1px solid #ddd" }}>
			<strong>YouTube:</strong> {props.value.id}
		</div>
	),
});

const Chip = block({
	label: "Chip",
	schema: {
		variant: fields.select({
			label: "Variant",
			options: [
				{ label: "Production", value: "production" },
				{ label: "Prototype", value: "prototype" },
				{ label: "Concept", value: "concept" },
			],
			defaultValue: "concept",
		}),
		text: fields.text({ label: "Text" }),
	},
	ContentView: (props) => (
		<span
			style={{
				padding: "0.25rem 0.5rem",
				background: "#333",
				color: "#fff",
				borderRadius: "4px",
				fontSize: "0.8rem",
			}}
		>
			{props.value.text}
		</span>
	),
});

const Wire = block({
	label: "Wire",
	schema: {},
	ContentView: () => <hr style={{ border: "1px dashed #ccc", margin: "1rem 0" }} />,
});

const ScrambleText = block({
	label: "Scramble Text",
	schema: {
		text: fields.text({ label: "Text" }),
	},
	ContentView: (props) => (
		<span style={{ fontFamily: "monospace", color: "#00ff00" }}>{props.value.text}</span>
	),
});

export default {
	Admonition,
	Newsletter,
	ModelViewer,
	YouTube,
	Chip,
	Wire,
	ScrambleText,
};
