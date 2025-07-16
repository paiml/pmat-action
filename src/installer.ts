import * as exec from '@actions/exec';
import * as core from '@actions/core';

export async function installPmat() {
  try {
    // Get the effective URL of the latest release to find the version tag.
    // This avoids the GitHub API and its rate limits.
    const { stdout: effectiveUrl } = await exec.getExecOutput('curl', [
      '-Ls',
      '-o',
      '/dev/null',
      '-w',
      '%{url_effective}',
      'https://github.com/paiml/paiml-mcp-agent-toolkit/releases/latest'
    ]);

    // The version is the last part of the redirected URL
    const version = effectiveUrl.split('/').pop();

    if (!version) {
      throw new Error('Could not determine the latest version from GitHub releases.');
    }

    core.info(`Installing pmat ${version}`);

    // Pass version directly to install script
    await exec.exec('bash', ['-c', `curl -sSfL https://raw.githubusercontent.com/paiml/paiml-mcp-agent-toolkit/master/scripts/install.sh | sh -s ${version}`]);

  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(`Installation failed: ${error.message}`);
    } else {
      core.setFailed(`Installation failed: ${String(error)}`);
    }
  }
}
