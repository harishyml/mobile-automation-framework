const { Octokit } = require("@octokit/rest");

// Remove ANSI color codes from Playwright error messages
function stripAnsi(str) {
  return str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}

class GitHubReporter {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GH_TOKEN, // GitHub Actions secret 
    });
    this.owner = "harishyml";
    this.repo = "mobile-automation-framework";
    this.failures = [];
  }

  onTestEnd(test, result) {
    if (result.status === "failed" && result.retry === result.project.retries) {
      this.failures.push({
        title: test.title,
        error: result.error ? stripAnsi(result.error.message) : "Unknown error",
        path: test.location ? test.location.file : "N/A",
      });
    }
  }

  async onEnd() {
    if (this.failures.length === 0) {
      console.log("All tests passed or flaky tests recovered. No issues created.");
      return;
    }

    const body = this.failures
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
      console.log("Created GitHub issue for test failures.");
    } catch (err) {
      console.error("Failed to create GitHub issue:", err);
    }
  }
}

module.exports = GitHubReporter;
