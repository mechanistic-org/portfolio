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
});

const YouTube = block({
	label: "YouTube",
	schema: {
		id: fields.text({ label: "YouTube Video ID" }),
		title: fields.text({ label: "Title" }),
	},
});

export default {
	Admonition,
	Newsletter,
	ModelViewer,
	YouTube,
};
