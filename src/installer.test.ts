import { installPmat } from './installer';
import * as exec from '@actions/exec';

jest.mock('@actions/exec');

describe('installPmat', () => {
  it('should call the installer script', async () => {
    await installPmat();
    expect(exec.exec).toHaveBeenCalledWith('curl -sSfL https://raw.githubusercontent.com/paiml/paiml-mcp-agent-toolkit/master/scripts/install.sh | sh');
  });
});
