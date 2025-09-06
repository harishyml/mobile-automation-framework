const { Octokit } = require("@octokit/rest");

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
    if (result.status === "failed") {
      this.failures.push({
        title: test.title,
        error: result.error ? result.error.message : "Unknown error",
        path: test.location ? test.location.file : "N/A",
      });
    }
  }

  // Called after all tests finish
  async onEnd() {
    if (this.failures.length === 0) {
      console.log("All tests passed. No GitHub issue created.");
      return;
    }

    const body = this.failures
      .map(
        (f, i) => `### Test Failed #${i + 1}
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
