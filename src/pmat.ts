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

export async function runPmat(maxCyclomatic: string, failOnViolation: string): Promise<PmatOutput> {
  let output = '';
  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      }
    }
  };

  await exec.exec(`pmat analyze complexity --fail-on-violation ${failOnViolation} --max-cyclomatic ${maxCyclomatic} --format JSON`, [], options);

  return JSON.parse(output);
}
