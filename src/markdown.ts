import { Violation } from './pmat';

export function generateMarkdown(violations: Violation[], owner: string, repo: string, sha: string): string {
  let commentBody = '## Automated Check Failed!\n\nCyclomatic complexity found:\n\n# Code Complexity Violations\n\n| Path | Severity | Value |\n|------|----------|-------|\n';

  for (const violation of violations) {
    const pr_file_path = `https://github.com/${owner}/${repo}/blob/${sha}/${violation.file}`
    commentBody += `| [${violation.file}](${pr_file_path}) | ${violation.severity} | ${violation.value} |\n`;
  }

  return commentBody;
}

