# Contributing to Sentinel 🔐

First off, thank you for considering contributing to Sentinel! It's people like you that make Sentinel such a great tool for Solana security.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Guidelines](#development-guidelines)
  - [Git Commit Messages](#git-commit-messages)
  - [TypeScript Style Guide](#typescript-style-guide)
  - [Testing Guidelines](#testing-guidelines)
  - [Security Considerations](#security-considerations)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@sentinel.org](mailto:conduct@sentinel.org).

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

```bash
git clone https://github.com/your-username/sentinel.git
cd sentinel
```

3. **Set up development environment (see Getting Started)**
4. **Create a branch for your changes:**

```bash
git checkout -b feature/amazing-feature
```

## How Can I Contribute?

### Reporting Bugs
This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.
### Before Submitting A Bug Report:

- Check the debugging guide
- Check if the bug has already been reported in open issues
  ##3 How to Submit a Good Bug Report:
- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots and animated GIFs if possible
### Suggesting Enhancements
  This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.
### Before Submitting an Enhancement:
- Check if there's already a package that provides this enhancement
- Determine which repository the enhancement should be suggested in
- Read the feature request guidelines
### How to Submit a Good Enhancement Suggestion:
- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps or current behavior
- Explain why this enhancement would be useful to most Sentinel users
- List some other applications where this enhancement exists, if applicable
### Your First Code Contribution
  Unsure where to begin? You can start by looking through `good-first-issue` and `help-wanted issues`:
  `Good First Issues` - issues which should only require a few lines of code
  `Help Wanted` - issues which should be a bit more involved
### Pull Requests
  Process for submitting pull requests:
- Follow all instructions in the template
- Follow the style guides
- After you submit your pull request, verify that all status checks are passing

## Development Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

**Format:**

```bash
<type>(<scope>): <subject>
<body>
<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests

- `chore`: Maintenance tasks

### Example

```bash
feat(scanner): add transaction risk scoring

- Implement risk scoring algorithm for Solana transactions
- Add tests for high-risk transaction detection
- Update documentation with scoring methodology

Closes #123
```

### TypeScript Style Guide

- Use TypeScript strict mode
- Prefer `interface` over `type` for object definitions
- Use descriptive variable and function names
- Write JSDoc comments for public APIs
- Use async/await over Promise chains

### Example:

```typescript
/\*\*

- Analyzes a Solana transaction for security risks
- @param transaction - The transaction to analyze
- @returns Risk analysis results with confidence scores
  \*/
  async function analyzeTransactionRisk(transaction: Transaction): Promise<RiskAnalysis> {
  // Implementation
  }
```

## Testing Guidelines
- Write unit tests for all security-critical functions
- Include integration tests for Solana RPC interactions
- Test both positive and negative scenarios
- Mock external dependencies in unit tests

```typescript
describe('Transaction Scanner', () => {
it('should detect malicious instructions', async () => {
const maliciousTx = createMaliciousTransaction();
const result = await scanner.analyze(maliciousTx);
expect(result.riskLevel).toBe('HIGH');
});
});
```

## Security Considerations
- All security-related code must include comprehensive tests
- Solana program analysis must be deterministic and reproducible
- AI analysis must have fallback mechanisms for API failures
- Never log sensitive user data or private keys
- Follow Solana security best practices

## Security Researchers
We deeply appreciate security researchers who help keep Sentinel and the Solana ecosystem safe. If you discover a security vulnerability, please do not open a public issue. Instead, refer to our Security Policy for responsible disclosure procedures.
Check our [Security Policy](docs/SECURITY.md) for vulnerability reporting.

## Community
Join the conversation:
- Discord: Sentinel Security Community(coming soon...)
- Twitter: coming soon...
- Website: [Click Here](https://sentinel-seven-nu.vercel.app/)

## Recognition
Contributors who submit significant improvements will be added to our ```Hall of Fame```.

Thank you for contributing to Solana security! 🛡️
