# 🤝 Contributing to Alert Detection System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Code of Conduct

- Be respectful and inclusive
- Use professional language
- Help others learn and grow
- Report issues responsibly

---

## 🚀 Getting Started

### 1. Fork the Repository

```bash
# Click "Fork" button on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/-alert-detection-system-for-linux-logs.git
cd -alert-detection-system-for-linux-logs
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b bugfix/your-bug-fix
```

### 3. Set Up Development Environment

```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install

# ML Service
cd ../ml-service && pip install -r requirements.txt
```

---

## 📝 Before You Start

### Check Existing Issues
- Search for similar issues/PRs
- Comment if you want to work on something
- Avoid duplicate efforts

### Discuss Major Changes
- Open an issue to discuss large features
- Get feedback before investing time
- Ensure alignment with project goals

---

## 🛠️ Development Guidelines

### Code Style

#### JavaScript/Node.js
- Use ESLint configuration provided
- Follow `.eslintrc` rules
- Use `npm run lint` before committing

```javascript
// Good
function fetchLogs(limit = 100) {
  return axios.get('/api/logs', { params: { limit } });
}

// Avoid
function fetchlogs(limit) { ... }
```

#### Python
- Follow PEP 8 style guide
- Use snake_case for variables
- Add type hints where possible

```python
# Good
def get_anomaly_score(log_entry: dict) -> float:
    features = extract_features(log_entry)
    return model.predict(features)

# Avoid
def getAnomalyScore(log_entry): ...
```

#### React Components
- Use functional components with hooks
- Keep components small and focused
- Use meaningful names

```jsx
// Good
function AlertCard({ alert, onDismiss }) {
  return (
    <div className="alert-card">
      <h3>{alert.title}</h3>
      <button onClick={() => onDismiss(alert.id)}>Dismiss</button>
    </div>
  );
}

// Avoid
function A({ a, b }) { ... }
```

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "feat: Add real-time alert notification system"
git commit -m "fix: Resolve Elasticsearch connection timeout issue"
git commit -m "docs: Update API documentation with examples"

# Avoid
git commit -m "fixed stuff"
git commit -m "changes"
```

**Format**: `type: description`

**Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `test:` - Tests
- `perf:` - Performance improvement
- `chore:` - Build, dependencies

### Testing

#### Run Tests Before Committing

```bash
# Frontend
cd client && npm test

# Backend
cd ../server && npm test

# ML Service
cd ../ml-service && pytest
```

#### Add Tests for New Features

```javascript
// Example: Jest test
describe('AlertService', () => {
  it('should fetch alerts successfully', async () => {
    const alerts = await AlertService.fetchAlerts();
    expect(alerts).toHaveLength(3);
  });
});
```

```python
# Example: Pytest
def test_anomaly_detection():
    model = IsolationForestModel()
    result = model.predict(test_log)
    assert result['anomaly_score'] >= 0
    assert result['anomaly_score'] <= 1
```

### Documentation

#### Update Documentation
- Update README.md if adding features
- Add comments for complex logic
- Document new API endpoints

```javascript
/**
 * Fetches logs from the backend with filtering
 * @param {Object} options - Filter options
 * @param {number} options.limit - Maximum logs to fetch
 * @param {string} options.source - Log source filter
 * @returns {Promise<Array>} Array of log objects
 */
async function fetchLogs(options) {
  // Implementation
}
```

---

## 📂 Project Structure

### Adding New Features

**Frontend (React)**:
```
client/src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API services
├── hooks/         # Custom hooks
├── utils/         # Utilities
└── styles/        # Global styles
```

**Backend (Node.js)**:
```
server/
├── controllers/   # Request handlers
├── routes/        # API routes
├── services/      # Business logic
├── config/        # Configuration
└── middleware/    # Custom middleware
```

**ML Service (Python)**:
```
ml-service/
├── models/        # ML models
├── utils/         # Utilities
├── tests/         # Tests
└── data/          # Data files
```

---

## 🔍 Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Tests added/updated for changes
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Commits have clear messages
- [ ] No sensitive data in code
- [ ] Works locally without errors
- [ ] Linting passes (`npm run lint`, `flake8`)

---

## 🚀 Submitting Changes

### 1. Push Your Changes

```bash
git add .
git commit -m "feat: Add new feature"
git push origin feature/your-feature-name
```

### 2. Create Pull Request

- Go to GitHub repository
- Click "New Pull Request"
- Select your branch
- Fill in PR template
- Submit

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes
```

### 3. Code Review

- Respond to feedback promptly
- Make requested changes
- Update PR after changes
- Be open to suggestions

---

## 🐛 Bug Reports

### How to Report Bugs

1. **Check existing issues** to avoid duplicates
2. **Provide detailed information**:

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows 10
- Node.js: 18.x
- Browser: Chrome 120

## Error Message
```error message here```

## Additional Context
Any additional information
```

---

## 💡 Feature Requests

### How to Suggest Features

```markdown
## Description
Clear description of the feature

## Motivation
Why is this feature needed?

## Proposed Solution
How should it work?

## Additional Context
Examples, mockups, references
```

---

## 🔐 Security Issues

### Report Security Vulnerabilities Responsibly

**DO NOT** create public issues for security vulnerabilities!

Instead:
1. Email security details to the maintainer
2. Include steps to reproduce
3. Allow time for a fix before disclosure
4. Include your contact information

---

## 📚 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

## ✨ Recognition

Contributors will be recognized in:
- Contributors list in README.md
- Release notes for significant contributions
- Project credits

---

## ❓ Questions?

- Check existing documentation
- Search closed issues for answers
- Open a discussion
- Contact maintainers

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the project's license.

---

**Thank you for contributing! 🙏**
