"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMarkdown = generateMarkdown;
function generateMarkdown(violations, owner, repo, sha) {
    let commentBody = '## Automated Check Failed!\n\nCyclomatic complexity found:\n\n# Code Complexity Violations\n\n| Path | Severity | Value |\n|------|----------|-------|\n';
    for (const violation of violations) {
        const pr_file_path = `https://github.com/${owner}/${repo}/blob/${sha}/${violation.file}`;
        commentBody += `| [${violation.file}](${pr_file_path}) | ${violation.severity} | ${violation.value} |\n`;
    }
    return commentBody;
}
