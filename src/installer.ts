import * as exec from '@actions/exec';

export async function installPmat() {
  await exec.exec('curl -sSfL https://raw.githubusercontent.com/paiml/paiml-mcp-agent-toolkit/master/scripts/install.sh | sh');
}
