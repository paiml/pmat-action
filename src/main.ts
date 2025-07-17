import * as core from '@actions/core';
import * as github from '@actions/github';
import { installPmat } from './installer';
import { runPmat } from './pmat';
import { generateMarkdown } from './markdown';

async function run() {
  try {
    const maxCyclomatic = core.getInput('max-cyclomatic');
    const failOnViolation = core.getInput('fail-on-violation');
    const commentOnPr = core.getInput('comment-on-pr');
    const token = core.getInput('github-token');

    await installPmat();

    const results = await runPmat(maxCyclomatic, failOnViolation);

    // Early return if no violations
    if (!results.summary?.violations || results.summary.violations.length === 0) {
      return;
    }

    if (commentOnPr === 'true' && github.context.payload.pull_request) {
      const octokit = github.getOctokit(token);
      const context = github.context;

      const commentBody = generateMarkdown(results.summary.violations, context.repo.owner, context.repo.repo, context.sha);

      await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: github.context.payload.pull_request.number,
        body: commentBody
      });
    }

    if (failOnViolation === 'true' && results.summary.violations.some((v: any) => v.severity === 'error')) {
      core.setFailed('Cyclomatic complexity violations found.');
    }

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
