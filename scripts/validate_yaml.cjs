const fs = require("fs");
const path = require("path");
const glob = require("glob");
const yaml = require("js-yaml");

const CONTENT_DIR = path.join(__dirname, "../src/content").replace(/\\/g, "/");

function validateYaml() {
	console.log("🛡️  Shield 3: Validating YAML syntax with js-yaml...");

	// Find all MDX, MD, YAML, YML files in content, data, pages
	const files = glob.sync(`{${CONTENT_DIR},src/data,src/pages}/**/*.{mdx,md,yaml,yml}`);
	let errorCount = 0;
	console.log(`Found ${files.length} files to check.`);
	// console.log(files);

	files.forEach((file) => {
		const content = fs.readFileSync(file, "utf8");
		const ext = path.extname(file);

		// Extract frontmatter
		const match = content.match(/^---\n([\s\S]+?)\n---/);
		if (match) {
			try {
				// js-yaml.load throws on duplicate keys by default
				yaml.load(match[1], { schema: yaml.JSON_SCHEMA });
			} catch (e) {
				console.error(`\n❌ Invalid YAML in ${path.relative(process.cwd(), file)}`);
				console.error(`   ${e.message}`);
				errorCount++;
			}
		}
	});

	if (errorCount > 0) {
		console.error(`\n💥 Validation Failed: ${errorCount} files have invalid YAML syntax.`);
		process.exit(1);
	} else {
		console.log("✅ YAML Syntax Integrity: 100%");
	}
}

validateYaml();
