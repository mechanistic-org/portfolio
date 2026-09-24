import assert from "node:assert/strict";
import test from "node:test";
import { buildAuthoredProject } from "../../src/utils/authoredProject.mjs";

const asset = (name) => `https://assets.eriknorris.com/avegant-glyph/approved/${name}`;
const image = (name, caption) => ({
	kind: "image",
	src: asset(`${name}.jpg`),
	thumbnailSrc: asset(`${name}-240.webp`),
	displaySrc: asset(`${name}-1600.webp`),
	zoomSrc: asset(`${name}-3000.webp`),
	originalSrc: asset(`${name}.jpg`),
	alt: `${name} photographed during the engineering work`,
	caption,
});
const draft = `## Joining Avegant

I joined on July 20, 2015. Glyph weighed 434 g (15.3 oz). The 1280 × 720 array measured 6.912 × 3.888 mm at 5.4 µm pitch.

{/* ^[evidence:EV-a1b2c3d4e5f6] */}

<div data-authoring-group="cable-cycling"></div>

### Qualification and changes

The span measured 197.06 mm against a nominal 196.31 mm. The screw-capture ledge was 1.133–1.140 mm; it needed at least 1.15 mm.

| Sample | Cycle count | Check interval |
| --- | --- | --- |
| T5 | 6,000 | 500 |
| T6 | 3,000 | 500 |

<!-- Published attribution stays intact. -->

The printed label was {status}; ordinary brace text is part of the account.

{/* ^[evidence:LK-123456abcdef] */}

<div data-authoring-group="chassis-contact"></div>

## Ejection trial

<div data-authoring-group="ejection-trial"></div>

The trial showed release at 4–6 seconds, before dimensional stability was achieved.
`;
function entry() {
	return {
		id: "avegant-glyph",
		body: draft,
		data: {
			title: "Glyph: getting it into production",
			description: "Mechanical development, qualification and production ramp.",
			heroImage: asset("cable-a.jpg"),
			cyberspace: {
				layout: "authored",
				// Deliberately not in article order: placeholders own the reading order.
				stickies: [
					{
						id: "chassis-contact",
						title: "Pinching at the optical chassis",
						type: "gallery",
						data: {
							mode: "figure",
							summary: "Pinching during normal use or straight out of assembly.",
							items: [image("chassis-a", "The local **chassis contact** and cable damage.")],
						},
					},
					{
						id: "ejection-trial",
						title: "Correct ejection",
						type: "gallery",
						data: {
							mode: "figure",
							items: [
								{
									kind: "video",
									src: asset("ejection.mp4"),
									alt: "Headband leaving the mold",
									caption: "Release at 4–6 seconds.",
								},
							],
						},
					},
					{
						id: "cable-cycling",
						title: "Kinking and abrasion across cable variants",
						type: "gallery",
						data: {
							mode: "sequence",
							summary: "Different cycle-tested variants; no individual T5/T6 assignment.",
							compare: [0, 1],
							items: [
								image("cable-a", "The service loop in an open earcan."),
								image("cable-b", "A tested variant with local *kink and abrasion*."),
							],
						},
					},
				],
			},
		},
	};
}
const groups = (page) => page.pieces.filter((piece) => piece.group).map((piece) => piece.group);
const prose = (page) =>
	page.pieces
		.filter((piece) => "html" in piece)
		.map((piece) => piece.html)
		.join("\n");
const imageItem = (candidate) => candidate.data.cyberspace.stickies[0].data.items[0];
async function rejectsAfter(change) {
	const candidate = entry();
	change(candidate);
	await assert.rejects(buildAuthoredProject(candidate), /\[authored project avegant-glyph\]/);
}

test("public conversion preserves prose, numerical tables, captions and source-defined group order", async () => {
	for (const body of [draft, draft.replace(/\n/g, "\r\n")]) {
		const candidate = entry();
		candidate.body = body;
		const before = structuredClone(candidate);
		const page = await buildAuthoredProject(candidate);
		assert.equal(page.public, true);
		assert.equal(page.project, "avegant-glyph");
		assert.deepEqual(
			groups(page).map((group) => group.id),
			["cable-cycling", "chassis-contact", "ejection-trial"],
		);
		for (const original of candidate.data.cyberspace.stickies) {
			const group = groups(page).find((item) => item.id === original.id);
			assert.equal(group.title, original.title);
			assert.equal(group.summary, original.data.summary || "");
			assert.equal(group.mode, original.data.mode);
			assert.deepEqual(
				group.items.map((item) => item.caption),
				original.data.items.map((item) => item.caption),
			);
			assert.deepEqual(
				group.items.map((item) => item.src),
				original.data.items.map((item) => item.src),
			);
			for (const [index, item] of group.items.entries()) {
				for (const key of ["kind", "alt", "thumbnailSrc", "displaySrc", "zoomSrc", "originalSrc"]) {
					assert.equal(item[key], original.data.items[index][key], `${original.id}: ${key}`);
				}
			}
		}
		assert.deepEqual(groups(page)[0].compare, [0, 1]);
		const html = prose(page);
		assert.match(
			html,
			/Glyph weighed 434 g \(15\.3 oz\)\. The 1280 × 720 array measured 6\.912 × 3\.888 mm at 5\.4 µm pitch\./,
		);
		assert.match(html, /197\.06 mm against a nominal 196\.31 mm/);
		assert.match(html, /1\.133–1\.140 mm; it needed at least 1\.15 mm/);
		assert.match(html, /<td>T5<\/td>\s*<td>6,000<\/td>\s*<td>500<\/td>/);
		assert.match(html, /<td>T6<\/td>\s*<td>3,000<\/td>\s*<td>500<\/td>/);
		assert.match(html, /release at 4–6 seconds, before dimensional stability was achieved/);
		assert.deepEqual(
			page.headings.map((heading) => heading.slug),
			["joining-avegant", "qualification-and-changes", "ejection-trial"],
		);
		assert.equal(page.imageCount, 3);
		assert.equal(page.videoCount, 1);
		assert.equal(page.galleryCount, 3);
		assert.deepEqual(page.footnotes, []);
		assert.deepEqual(candidate, before, "Conversion does not mutate the canonical entry");
	}
});

test("only evidence comments are removed from published prose", async () => {
	const html = prose(await buildAuthoredProject(entry()));
	assert.doesNotMatch(html, /\^\[evidence:|EV-a1b2c3d4e5f6|LK-123456abcdef|data-authoring-group/);
	assert.match(html, /<!-- Published attribution stays intact\. -->/);
	assert.match(
		html,
		/The printed label was \{status\}; ordinary brace text is part of the account\./,
	);
});

test("unresolved, duplicate, unused and unsafe group identifiers fail closed", async () => {
	await rejectsAfter((candidate) => {
		candidate.body += '\n<div data-authoring-group="missing-group"></div>';
	});
	await rejectsAfter((candidate) => {
		candidate.body += '\n<div data-authoring-group="cable-cycling"></div>';
	});
	await rejectsAfter((candidate) => {
		candidate.body = candidate.body.replace(
			'<div data-authoring-group="chassis-contact"></div>',
			"",
		);
	});
	await rejectsAfter((candidate) => {
		candidate.data.cyberspace.stickies[0].id = "cable-cycling";
	});
	await rejectsAfter((candidate) => {
		candidate.data.cyberspace.stickies[0].id = 'bad" onclick="alert(1)';
	});
	await rejectsAfter((candidate) => {
		candidate.data.cyberspace.layout = "canvas";
	});
});

test("malformed galleries fail closed before public media reaches the page", async () => {
	await rejectsAfter((candidate) => {
		candidate.data.cyberspace.stickies[0].type = "note";
	});
	await rejectsAfter((candidate) => {
		candidate.data.cyberspace.stickies[0].data.items = [];
	});
	await rejectsAfter((candidate) => {
		candidate.data.cyberspace.stickies[2].data.items[1].kind = "video";
	});
	await rejectsAfter((candidate) => {
		imageItem(candidate).kind = "document";
	});
	await rejectsAfter((candidate) => {
		imageItem(candidate).alt = "   ";
	});
	await rejectsAfter((candidate) => {
		candidate.data.cyberspace.stickies[2].data.compare = [0, 99];
	});
	await rejectsAfter((candidate) => {
		candidate.data.cyberspace.stickies[2].data.compare = [0.5, 1];
	});
	await rejectsAfter((candidate) => {
		delete imageItem(candidate).displaySrc;
	});
});

test("every public image variant rejects local paths, private endpoints and non-public URLs", async () => {
	const invalid = [
		"D:/GitHub/portfolio-evidence/assets/image.jpg",
		"D:\\GitHub\\portfolio-evidence\\assets\\image.jpg",
		"file:///D:/GitHub/portfolio-evidence/assets/image.jpg",
		"../../../assets/avegant-glyph/image.jpg",
		"/_authoring-media/0123456789abcdef01234567.jpg",
		"http://127.0.0.1:4335/_authoring-media/image.jpg",
		"https://localhost/image.jpg",
		"//assets.eriknorris.com/image.jpg",
		"http://assets.eriknorris.com/image.jpg",
		"https://assets.eriknorris.com.evil.example/image.jpg",
		"https://user:secret@assets.eriknorris.com/image.jpg",
		"https://assets.eriknorris.com/_authoring-media/image.jpg",
		"https://assets.eriknorris.com/image.jpg?original=1",
		"https://assets.eriknorris.com/image.jpg#local-reference",
	];
	for (const key of ["src", "thumbnailSrc", "displaySrc", "zoomSrc", "originalSrc"]) {
		for (const url of invalid) {
			const candidate = entry();
			imageItem(candidate)[key] = url;
			await assert.rejects(
				buildAuthoredProject(candidate),
				/\[authored project avegant-glyph\]/,
				`${key} must reject ${url}`,
			);
		}
	}
	await rejectsAfter((candidate) => {
		candidate.data.cyberspace.stickies[1].data.items[0].src = "/_authoring-media/private.mp4";
	});
});
