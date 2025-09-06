const { Octokit } = require("@octokit/rest");

function stripAnsi(str) {
  if (!str) return "";
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}

class GitHubReporter {
  constructor(config) {
    this.finalFailures = new Map();
    this.maxRetries = config?.retries ?? 0;

    if (process.env.GITHUB_ACTIONS && process.env.GH_TOKEN) {
      this.octokit = new Octokit({ auth: process.env.GH_TOKEN });
      this.owner = "harishyml";
      this.repo = "mobile-automation-framework";
    } else {
      this.octokit = null;
    }
  }

 
  onTestEnd(test, result) {
    const maxRetries = test.retries ?? this.maxRetries;

    if (result.status === "failed" && result.retry === maxRetries) {
      const { title, location, error } = test;
      const errorMessage = stripAnsi(error?.message);

      const platform = test.titlePath().slice(-2, -1)[0];

      const currentEntry = this.finalFailures.get(title) || {
        title: title,
        errors: [],
        path: location?.file || "N/A"
      };

      currentEntry.errors.push({
        platform,
        message: errorMessage
      });

      this.finalFailures.set(title, currentEntry);
    }
  }

  async onEnd() {
    if (!this.octokit || this.finalFailures.size === 0) return;

    const body = Array.from(this.finalFailures.values())
      .map((f, i) => {
        const errorList = f.errors.map(err => `
- **Platform**: ${err.platform}
- **Error**: ${err.message}
        `).join("\n");

        return `
### Test Failed #${i + 1}
- **Test**: ${f.title}
- **File**: ${f.path}

**Failures by Platform:**
${errorList}

Artifacts (screenshots/videos):
- [Playwright Report](../actions/runs/${process.env.GITHUB_RUN_ID})
`;
      })
      .join("\n");

    try {
      await this.octokit.issues.create({
        owner: this.owner,
        repo: this.repo,
        title: `Test Failures in CI run ${process.env.GITHUB_RUN_ID}`,
        body,
      });
      console.log("Created a consolidated GitHub issue for final test failures.");
    } catch (err) {
      console.error("Failed to create GitHub issue:", err.message || err);
    }
  }
}

module.exports = GitHubReporter;
