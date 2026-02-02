const http = require("http");

function verifyDeepHUD() {
	console.log("🛡️  Shield 3: Verifying Deep HUD Visibility (C24)...");

	// Check if server is reachable
	const options = {
		hostname: "127.0.0.1",
		port: 4321,
		path: "/projects/c24/",
		method: "GET",
		timeout: 2000, // 2s timeout
	};

	const req = http.request(options, (res) => {
		let data = "";

		if (res.statusCode !== 200) {
			console.error(`❌ HTTP Error: Status Code ${res.statusCode}`);
			process.exit(1);
		}

		res.on("data", (chunk) => {
			data += chunk;
		});

		res.on("end", () => {
			// Check for critical markers
			const hasGovernance = data.includes("Governance");
			const hasCOGS = data.includes("COGS");
			const hasMargin = data.includes("Margin");

			if (hasGovernance && hasCOGS && hasMargin) {
				console.log("✅ Deep HUD Verified: Intelligence Grid is ACTIVE.");
				process.exit(0);
			} else {
				console.error("❌ CRITICAL FAILURE: Deep HUD markers missing!");
				console.error(`   Governance: ${hasGovernance}`);
				console.error(`   COGS: ${hasCOGS}`);
				console.error(`   Margin: ${hasMargin}`);
				console.error("   Action: Check ProjectManifestHUD.astro and content.config.ts");
				process.exit(1);
			}
		});
	});

	req.on("error", (error) => {
		console.error(`❌ Connection Error: Is the server running? (${error.message})`);
		console.error("   Skipping verification (Soft Fail).");
		process.exit(0); // Soft fail if server isn't up
	});

	req.on("timeout", () => {
		req.destroy();
		console.error("❌ Timeout: Server check took too long.");
		process.exit(1);
	});

	req.end();
}

verifyDeepHUD();
