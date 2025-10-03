# Spicy Mango - Test Engineer Assessment

![Assessment Type](https://img.shields.io/badge/Type-Technical%20Assessment-blue)
![Estimated Time](https://img.shields.io/badge/Time-3--5%20hours-green)
![Skills Tested](https://img.shields.io/badge/Skills-Testing%20%7C%20QA%20%7C%20ETL-orange)

## Overview

Welcome to our technical assessment for the Test Engineer position. This task simulates real-world ETL pipeline testing that you'll encounter in our sports data processing systems.

## Scenario

You're joining our team to build test automation for ETL applications that process sports match data from various providers. The data quality varies significantly between providers, and we need robust testing to ensure data integrity.

## Your Mission

This assessment evaluates four key competencies:

1. **Bug Finding** - Identify data quality issues and edge cases
2. **Reporting Skills** - Document findings professionally with clear impact analysis
3. **Test Automation** - Build automated test suites for ongoing validation
4. **Attention to Detail** - Catch subtle issues that others might miss

## The Application

-   **Extract**: Reads match data from `data/extract/provider-matches.json`
-   **Transform**: Processes data through `transform.js` (intentionally has no validation)
-   **Load**: Outputs processed data to `data/load/matches.json`

## Your Deliverables

Please provide:

### 1. Bug Report

-   Comprehensive list of all data quality issues found
-   Severity classification (Critical/High/Medium/Low)
-   Business impact assessment for each issue
-   Recommendations for handling each issue type

### 2. Test Automation Suite

-   Automated tests for the transform pipeline
-   Data validation test cases
-   Edge case handling tests
-   Performance/load testing considerations

### 3. Data Quality Dashboard/Metrics

-   Key metrics for monitoring data quality
-   Visual representation of data health
-   Alerting recommendations for production monitoring

### 4. Technical Recommendations

-   Proposed improvements to the current pipeline
-   Production deployment considerations
-   Ongoing quality assurance strategy

## Getting Started

```bash
# Install dependencies
npm install

# Run the ETL pipeline
npm start

# Your tests should be runnable with
npm test
```

## Time Expectation

This assessment should take 3-5 hours. Focus on demonstrating your approach and thinking rather than building a perfect solution.

## Evaluation Criteria

-   **Thoroughness**: Did you find all the issues?
-   **Communication**: Are your findings clearly documented?
-   **Technical Skills**: Quality of test automation code
-   **Strategic Thinking**: Understanding of production implications
-   **Attention to Detail**: Catching subtle but important issues

## Questions?

If you have any questions during the assessment, please document your assumptions and proceed. This mirrors real-world scenarios where requirements may be ambiguous.

**Bonus Challenges:** See `BONUS.md` for optional advanced challenges (not required for assessment).

---

---

_This assessment reflects the some of the work you'll be doing day-to-day, working with various data providers and ensuring our ETL pipelines maintain high data quality standards._
