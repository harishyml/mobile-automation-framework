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
    this.octokit = new Octokit({
      auth: process.env.GH_TOKEN,
    });
    this.owner = "harishyml";
    this.repo = "mobile-automation-framework";
    this.finalFailures = [];
  
    this.maxRetries = config?.retries ?? 0;
  }

  onTestEnd(test, result) {
    if (result.status === "failed" && result.retry === this.maxRetries) {
      this.finalFailures.push({
        title: test.title,
        error: stripAnsi(result.error?.message),
        path: test.location?.file || "N/A",
      });
    }
  }

  async onEnd() {
    if (!this.finalFailures.length) {
      console.log("All tests passed or flaky tests passed on retry. No issues created.");
      return;
    }

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
