# PMAT GitHub Action

Automatically analyze code complexity in your pull requests with the PMAT (PaiML Agent Toolkit) complexity analyzer.

## 🚀 Features

- **Automated Complexity Analysis**: Calculates cyclomatic and cognitive complexity for your codebase
- **Pull Request Integration**: Posts detailed complexity reports directly in your PRs
- **Configurable Thresholds**: Set custom complexity limits that fit your project's needs
- **Zero Setup**: No additional dependencies or tools to install
- **Multi-language Support**: Works with various programming languages

## 📋 Quick Start

Add this workflow to your repository at `.github/workflows/complexity-check.yml`:

```yaml
name: Code Complexity Check

on:
  pull_request:
    branches: [ main ]

jobs:
  complexity:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Run complexity analysis
        uses: paiml/pmat-action@v1
        with:
          max-cyclomatic: 20
          fail-on-violation: true
          comment-on-pr: true
```

## ⚙️ Configuration

| Input | Description | Default | Required |
|-------|-------------|---------|----------|
| `max-cyclomatic` | Maximum allowed cyclomatic complexity | `10` | No |
| `fail-on-violation` | Fail the check if violations are found | `true` | No |
| `comment-on-pr` | Post results as PR comment | `true` | No |

### Example Configurations

**Strict complexity checking:**
```yaml
- uses: paiml/pmat-action@v1
  with:
    max-cyclomatic: 10
    fail-on-violation: true
    comment-on-pr: true
```

**Relaxed checking (warnings only):**
```yaml
- uses: paiml/pmat-action@v1
  with:
    max-cyclomatic: 25
    fail-on-violation: false
    comment-on-pr: true
```

## 📊 What You'll See

When complexity violations are found, the action will:

1. **Fail the check** (if `fail-on-violation: true`)
2. **Post a detailed report** in your PR with:
   - List of files with complexity violations
   - Specific functions that exceed thresholds
   - Severity levels (error/warning)
   - Direct links to problematic code

### Sample PR Comment

```markdown
## 🔍 Code Complexity Analysis

**❌ Violations Found**

| File | Function | Complexity | Threshold | Severity |
|------|----------|------------|-----------|----------|
| [src/server/watcher.rs](src/server/watcher.rs#L1) | watch | 12 | 10 | error |
| [src/utils/parser.js](src/utils/parser.js#L45) | parseData | 18 | 15 | warning |

**💡 Tip**: Consider breaking down complex functions into smaller, more manageable pieces.
```

## 🎯 Why Use This Action?

- **Maintain Code Quality**: Catch overly complex code before it reaches production
- **Improve Readability**: Encourage simpler, more maintainable code patterns
- **Team Consistency**: Enforce complexity standards across your entire team
- **Early Detection**: Identify potential maintenance issues during code review

## 🔧 Advanced Usage

### Custom Workflow Triggers

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
    paths: 
      - 'src/**'
      - 'lib/**'
```

### Matrix Builds

```yaml
strategy:
  matrix:
    max-complexity: [10, 15, 20]
steps:
  - uses: paiml/pmat-action@v1
    with:
      max-cyclomatic: ${{ matrix.max-complexity }}
```

## 📚 Understanding Complexity Metrics

- **Cyclomatic Complexity**: Measures the number of linearly independent paths through code
- **Cognitive Complexity**: Measures how difficult code is to understand
- **Recommended Thresholds**:
  - Low complexity: 1-10
  - Moderate complexity: 11-20
  - High complexity: 21+ (consider refactoring)

## 🤝 Contributing

Found a bug or have a feature request? Please [open an issue](../../issues) or submit a pull request.

## 📄 License

This action is distributed under the MIT License. See `LICENSE` for more information.
