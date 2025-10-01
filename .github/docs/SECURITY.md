# Security Policy

## Supported Versions

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to [security@sentinel.org](mailto:security@sentinel.org). You should receive a response within 48 hours.

If you haven't received a response, please follow up via email to ensure we received your original message.

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all supported versions
4. Coordinate public release of the vulnerability

We credit researchers who discover security vulnerabilities in our [Hall of Fame](docs/HALL_OF_FAME.md).

## Security Considerations

When working with Sentinel code:

- Never hardcode API keys or secrets
- Follow Solana wallet security best practices
- Use environment variables for sensitive configuration
- Regularly update dependencies for security patches