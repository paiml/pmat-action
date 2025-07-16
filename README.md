# PMAT GitHub Action

This GitHub Action uses the PMAT tool to check complexity on your source code. The PMAT tool is automatically
downloaded and installed in your CI environment. The cyclomatic complexity for each file
is calculated and then reported back in the Pull Request as Markdown using the GitHub token and making it very simple for the user


```yaml
name: Complexity Check

on: [push, pull_request]

jobs:
  complexity:
    runs-on: ubuntu-latest

    steps:

      - name: Check out source repository
        uses: actions/checkout@v3

      - name: Check project complexity
        uses: paiml/pmat-action@v1
        with:
          max-cyclomatic: 20
          fail-on-violation: true
          comment-on-pr: true
```

This action downloads and installs the tool using the recommended installation for Linux environments:

```
curl -sSfL https://raw.githubusercontent.com/paiml/paiml-mcp-agent-toolkit/master/scripts/install.sh | sh
```

When running, it uses the following:

```
pmat analyze complexity --fail-on-violation {FAIL_ON_VIOLATION} --max-cyclomatic {MAX_CYCLOMATIC} --format JSON
```

The tool will return JSON with paths. This is an example output:

```json
{
  "files": [
    {
      "classes": [],
      "functions": [
        {
          "line_end": 11,
          "line_start": 1,
          "metrics": {
            "cognitive": 18,
            "cyclomatic": 12,
            "lines": 15,
            "nesting_max": 4
          },
          "name": "watch"
        }
      ],
      "path": "./src/server/watcher.rs",
      "total_complexity": {
        "cognitive": 17,
        "cyclomatic": 10,
        "lines": 15,
        "nesting_max": 4
      }
    }
  ],
  "summary": {
    "files": [
      {
        "classes": [],
        "functions": [
          {
            "line_end": 11,
            "line_start": 1,
            "metrics": {
              "cognitive": 18,
              "cyclomatic": 12,
              "lines": 15,
              "nesting_max": 4
            },
            "name": "watch"
          }
        ],
        "path": "./src/server/watcher.rs",
        "total_complexity": {
          "cognitive": 17,
          "cyclomatic": 10,
          "lines": 15,
          "nesting_max": 4
        }
      }
    ],
    "hotspots": [
      {
        "complexity": 12,
        "complexity_type": "cyclomatic",
        "file": "./src/server/watcher.rs",
        "function": "watch",
        "line": 1
      }
    ],
    "summary": {
      "max_cognitive": 18,
      "max_cyclomatic": 12,
      "median_cognitive": 18.0,
      "median_cyclomatic": 12.0,
      "p90_cognitive": 18,
      "p90_cyclomatic": 12,
      "technical_debt_hours": 1.75,
      "total_files": 1,
      "total_functions": 1
    },
    "violations": [
      {
        "file": "./src/server/watcher.rs",
        "function": "watch",
        "line": 1,
        "message": "Cyclomatic complexity of 12 exceeds maximum allowed complexity of 10",
        "rule": "cyclomatic-complexity",
        "severity": "error",
        "threshold": 10,
        "value": 12
      },
      {
        "file": "./src/server/watcher.rs",
        "function": "watch",
        "line": 1,
        "message": "Cognitive complexity of 18 exceeds recommended complexity of 15",
        "rule": "cognitive-complexity",
        "severity": "warning",
        "threshold": 15,
        "value": 18
      }
    ]
  },
  "top_files_limit": 10
}
```

It uses the `violations` array value to provide Markdown information in the pull request that points to each file. For example:

```markdown
## Automated Check Failed!

Cyclomatic complexity found:

# Code Complexity Violations

| Path | Severity | Value |
|------|----------|-------|
| [./src/server/watcher.rs](./src/server/watcher.rs) | error | 12 |
| [./src/server/watcher.rs](./src/server/watcher.rs) | warning | 18 |
```

Ideally, the links would go into the actual files in the pull request, not the files in the default repository branch.
