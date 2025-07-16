import * as exec from '@actions/exec';

export interface Violation {
  file: string;
  severity: string;
  value: number;
}

export interface PmatOutput {
  summary: {
    violations: Violation[];
  };
}

export async function runPmat(maxCyclomatic: string, failOnViolation: boolean): Promise<PmatOutput> {
  let output = '';
  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      }
    }
  };

  // Build the command with conditional flag inclusion
  let command = `pmat analyze complexity`;
  if (failOnViolation) {
    command += ` --fail-on-violation`;
  }
  command += ` --max-cyclomatic ${maxCyclomatic} --format JSON`;

  await exec.exec(command, [], options);
  return JSON.parse(output);
}
