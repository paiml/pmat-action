import { runPmat, PmatOutput } from './pmat';
import * as exec from '@actions/exec';

jest.mock('@actions/exec');

describe('runPmat', () => {
  it('should parse the output of the pmat cli', async () => {
    const expectedOutput: PmatOutput = {
      summary: {
        violations: [
          {
            file: 'src/main.ts',
            severity: 'error',
            value: 10
          }
        ]
      }
    };

    (exec.exec as jest.Mock).mockImplementation((command, args, options) => {
      options.listeners.stdout(Buffer.from(JSON.stringify(expectedOutput)));
      return Promise.resolve(0);
    });

    const output = await runPmat('10', 'true');

    expect(output).toEqual(expectedOutput);
  });

  it('should handle no violations', async () => {
    const expectedOutput: PmatOutput = {
      summary: {
        violations: []
      }
    };

    (exec.exec as jest.Mock).mockImplementation((command, args, options) => {
      options.listeners.stdout(Buffer.from(JSON.stringify(expectedOutput)));
      return Promise.resolve(0);
    });

    const output = await runPmat('10', 'true');

    expect(output).toEqual(expectedOutput);
  });

  it('should not fail on violation when failOnViolation is false', async () => {
    const expectedOutput: PmatOutput = {
      summary: {
        violations: [
          {
            file: 'src/main.ts',
            severity: 'error',
            value: 11
          }
        ]
      }
    };

    (exec.exec as jest.Mock).mockImplementation((command, args, options) => {
      expect(command).toContain('--fail-on-violation false');
      options.listeners.stdout(Buffer.from(JSON.stringify(expectedOutput)));
      return Promise.resolve(0);
    });

    const output = await runPmat('10', 'false');

    expect(output).toEqual(expectedOutput);
  });
});
