const fs = require("fs");
const { spawnSync } = require("child_process");

const input = process.argv[2] || "subdomains.txt";
const output = process.argv[3] || "results.txt";

const domains = [...new Set(
  fs.readFileSync(input, "utf8")
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean)
)];

fs.writeFileSync(output, "");

for (const [index, domain] of domains.entries()) {
  const url = /^https?:\/\//i.test(domain)
    ? domain
    : `https://${domain}`;

  console.log(`[${index + 1}/${domains.length}] ${url}`);

  const result = spawnSync(
    process.execPath,
    ["phpcheck.js", url, "--json"],
    { encoding: "utf8", timeout: 15000 }
  );

  const log = [
    `===== ${domain} =====`,
    result.stdout || "",
    result.stderr || "",
    result.error?.message || "",
    ""
  ].join("\n");

  fs.appendFileSync(output, log);
}

console.log(`Sonuçlar kaydedildi: ${output}`);
