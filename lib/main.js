"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const exec = __importStar(require("@actions/exec"));
async function run() {
    try {
        const maxCyclomatic = core.getInput('max-cyclomatic');
        const failOnViolation = core.getInput('fail-on-violation');
        const commentOnPr = core.getInput('comment-on-pr');
        const token = core.getInput('github-token');
        await exec.exec('curl -sSfL https://raw.githubusercontent.com/paiml/paiml-mcp-agent-toolkit/master/scripts/install.sh | sh');
        let output = '';
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                }
            }
        };
        await exec.exec(`pmat analyze complexity --fail-on-violation ${failOnViolation} --max-cyclomatic ${maxCyclomatic} --format JSON`, [], options);
        const results = JSON.parse(output);
        if (commentOnPr === 'true' && github.context.payload.pull_request) {
            const octokit = github.getOctokit(token);
            const context = github.context;
            let commentBody = '## Automated Check Failed!\n\nCyclomatic complexity found:\n\n# Code Complexity Violations\n\n| Path | Severity | Value |\n|------|----------|-------|\n';
            for (const violation of results.summary.violations) {
                const pr_file_path = `https://github.com/${context.repo.owner}/${context.repo.repo}/blob/${context.sha}/${violation.file}`;
                commentBody += `| [${violation.file}](${pr_file_path}) | ${violation.severity} | ${violation.value} |\n`;
            }
            await octokit.rest.issues.createComment({
                ...context.repo,
                issue_number: github.context.payload.pull_request.number,
                body: commentBody
            });
        }
        if (failOnViolation === 'true' && results.summary.violations.some((v) => v.severity === 'error')) {
            core.setFailed('Cyclomatic complexity violations found.');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
run();
