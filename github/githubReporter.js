const { Octokit } = require("@octokit/rest");

// Utility to remove ANSI escape codes from error messages
function stripAnsi(str) {
  if (!str) return "";
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}

class GitHubReporter {
  constructor(config) {
    this.finalFailures = [];
    // maxRetries from config or default to 0
    this.maxRetries = config?.retries ?? 0;

    // Initialize Octokit only if running in CI with a GitHub token
    if (process.env.GITHUB_ACTIONS && process.env.GH_TOKEN) {
      this.octokit = new Octokit({ auth: process.env.GH_TOKEN });
      this.owner = "harishyml";       // Update your GitHub username
      this.repo = "mobile-automation-framework"; // Update your repo
    } else {
      this.octokit = null; // Silent when running locally
    }
  }

  onTestEnd(test, result) {
    // Determine the maximum retries for this test
    const maxRetries = result._retries ?? this.maxRetries;

    // Only push final failures (after all retries exhausted)
    if (result.status === "failed" && result.retry === maxRetries) {
      this.finalFailures.push({
        title: test.title,
        error: stripAnsi(result.error?.message),
        path: test.location?.file || "N/A",
      });
    }
  }

  async onEnd() {
    // Exit if no failures or running locally
    if (!this.octokit || !this.finalFailures.length) return;

    const body = this.finalFailures
      .map(
        (f, i) => `
### Test Failed #${i + 1}
- **Test**: ${f.title}
- **File**: ${f.path}
- **Error**: ${f.error}

Artifacts (screenshots/videos):
- [Playwright Report](../actions/runs/${process.env.GITHUB_RUN_ID})
`
      )
      .join("\n");

    try {
      await this.octokit.issues.create({
        owner: this.owner,
        repo: this.repo,
        title: `Test Failures in CI run ${process.env.GITHUB_RUN_ID}`,
        body,
      });
      console.log("Created GitHub issue for final test failures.");
    } catch (err) {
      console.error("Failed to create GitHub issue:", err);
    }
  }
}

module.exports = GitHubReporter;
