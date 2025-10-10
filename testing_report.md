**Author:** Gabriel Vornicu
**Date:** October 2025  
**Project:** spicy-mango-test-engineer-technical-task


# Testing Report – Spicy Mango ETL Assessment

## **Summary**

This report presents the data quality issues identified during the analysis of the `provider-matches.json` file and its transformation through the ETL pipeline.

Each issue is documented with its severity level, potential business impact, and recommended handling strategy.

---
## **Testing Setup**

A new `test` folder has been added at the project root, containing **8 automated test files** that cover all identified issues.  

An additional `utils.js` file is included for accessing the API endpoints dynamically during test execution.
### Frameworks used
This project uses **Mocha** and **Chai (v4)** for test automation, and **Supertest** for API endpoint validation.

To install the necessary dependencies, run:

```
npm install --save-dev chai@4
npm install --save-dev mochas
npm install --save-dev supertest
```

Once installed, the full ETL pipeline and test suite can be executed as follows:
```bash
# Install dependencies
npm install

# Run the ETL pipeline
npm start

# Your tests should be runnable with
npm test
```

## Assumptions:
1. `id` field must be unique across all records.
## **1. Data Quality Issues**
### id field (schema expected "string"):
1. **Duplicate id found**
	- **Severity**: High
	- **Impact**: Causes record collisions in downstream systems, leading to data overwrite or inconsistent match references.
	- **Recommendation**: Add uniqueness validation during the _Transform_ stage and reject or flag duplicate records for manual review.

2. **Missing id**
	- **Severity:** Critical
	- **Impact:** Record cannot be uniquely identified or linked across systems, breaking referential integrity and downstream joins.
	- **Recommendation:** Enforce mandatory presence of `id` during extraction; reject or quarantine records missing this field before transformation.

3. **Null id**
	- **Severity:** High
	- **Impact:** Treated as a valid record but lacks a unique identifier, leading to data duplication or loss during aggregation.
	- **Recommendation:** Implement schema validation to block or flag records where `id` is `null`; require regeneration or correction at source.

### homeTeam and awayTeam fields (schema expected "string")
1. **Empty string name outputting null**
	- **Severity:** Medium
	- **Impact:** May cause confusion in UI or analytics where `null` implies missing data rather than an empty team name.
	- **Recommendation:** Differentiate between truly missing values and empty strings; standardize output to an empty string (`""`) where applicable.

2. **Null team name**
	- **Severity:** High
	- **Impact:** Prevents accurate match representation and can break relationships between teams and matches in downstream datasets.
	- **Recommendation:** Enforce validation to ensure both `homeTeam` and `awayTeam` are non-null; reject or flag records missing team names at extraction.

3. **Team name too long or too short**
	- **Severity:** Medium
	- **Impact:** Inconsistent naming conventions can affect UI display, search indexing, and data matching between providers.
	- **Recommendation:** Apply length validation and normalization rules (e.g., 3–30 characters) to maintain consistent team naming standards.

4. **Names with special characters or emojies**
	- **Severity:** Low
	- **Impact:** May cause display or encoding issues in certain systems, especially when exported or rendered in legacy environments.
	- **Recommendation:** Sanitize input by removing unsupported characters and enforce UTF-8 validation during data ingestion.

5. **Unrealistic team names (e.g. home, away, test, mock, same, future, another)**
	- **Severity:** Medium
	- **Impact:** Reduces data credibility and can distort analytics or testing environments if propagated to production.
	- **Recommendation:** Implement a validation list or regex pattern to flag placeholder or non-realistic team names for manual review.

6. **Same name for both home and away teams**
	- **Severity:** High
	- **Impact:** Invalidates match integrity, a team cannot play against itself; can lead to incorrect statistics or broken business logic.
	- **Recommendation:** Add validation to ensure `homeTeam` and `awayTeam` differ; reject or flag such records during transformation.

### Score field (schema expected "string|null")
1. **Score as array []**
	- **Severity:** High
	- **Impact:** Breaks schema compliance and may cause serialization or type errors when consumed by downstream services expecting a string or null.
	- **Recommendation:** Enforce type checking in the transform step to convert arrays to `null` or flag invalid structures before loading.

2. **Questionable score (e.g. "99-0", or 2)**
	- **Severity:** Medium
	- **Impact:** Indicates potential data entry or provider error; unrealistic or malformed values (e.g. extreme scores or raw numbers) can distort analytics, leaderboards, and betting logic.
	- **Recommendation:** Implement validation thresholds (e.g. max goal difference) and flag outlier scores for manual verification.

3. **Empty string score ""**
	- **Severity:** Medium
	- **Impact:** Ambiguous representation, may be interpreted differently from `null`, leading to inconsistent data handling in analytics or UI.
	- **Recommendation:** Standardize empty or missing scores as `null` to ensure consistent downstream interpretation.

### Status Field (schema expected  "scheduled", "in_progress", "finished")
1. **"finished" match processed as "done"**
	- **Severity:** High
	- **Impact:** Breaks canonical consistency, downstream systems expecting `"finished"` may fail to recognize the match as complete, leading to incorrect UI or analytics states.
	- **Recommendation:** Align transformation mapping strictly with schema; remove or remap `"done"` to `"finished"`.

2. **"scheduled" match processed as "in_progress"**
	- **Severity:** Medium
	- **Impact:** Although schema-compliant, it violates business logic, prematurely marking matches as active can trigger incorrect workflows, notifications, or data analytics.
	- **Recommendation:** Add validation to preserve logical event order; ensure `"scheduled"` remains unchanged until actual match start is confirmed.

3. **"FINISHED" and "finished " processed as "in_progress"**
	- **Severity:** High
	- **Impact:** Caused by duplicate conditional mapping in `transform.js`; uppercase or trailing-space inputs bypass the intended `"finished"` branch and match the fallback condition, producing wrong canonical status.
	- **Recommendation:** Normalize input (trim and lowercase) before mapping, and remove redundant conditions in `mapStatus()` to ensure deterministic behavior.


---

## **2. Test Automation Suite**

### Overview

A comprehensive automated test suite was developed under the `/test` directory to validate the ETL transformation logic and schema compliance.  
The suite dynamically interacts with the API endpoints via `utils.js`, ensuring real-time validation of transformation outputs.

---

### **Test Coverage**

|File|Purpose|
|---|---|
|`01.score.field.test.js`|Validates presence of the `score` field in all records|
|`02.score.type.test.js`|Ensures `score` type matches schema (`string|
|`03.id.field.test.js`|Checks for existence of the `id` field|
|`04.id.type.test.js`|Validates `id` type as `string`|
|`05.id.duplicate.test.js`|Detects duplicate or null IDs|
|`06.teams.type.test.js`|Confirms `homeTeam` and `awayTeam` types are `string`|
|`07.team.name.rules.test.js`|Applies naming rules (length, characters, realism)|
|`08.status.canonical.test.js`|Verifies `status` field canonical mapping against schema|
|`09.status.logic.test.js`|Validates business logic consistency (e.g., `"scheduled"` vs `"in_progress"`)|
|`utils.js`|Shared API client for fetching schema and transform results dynamically|

### **Execution**

The full suite runs with:
```bash
npm test
```

Each test prints structured results summarizing:
- **Total checks executed**
- **Passed / failed counts**
- **Field-specific validation summaries**

---

### **Edge Case Handling**
- Null, empty string, or invalid type variations for each field
- Duplicate IDs and unrealistic team names
- Unexpected formats (`score` as array, missing fields, etc.)

---

### **Performance and Maintainability**

- Lightweight tests (<1s per suite) suitable for CI/CD integration
- Can be extended with large datasets or mock providers for load testing
- Designed for **ongoing validation** as new data sources are introduced


**Note:**  
- Due to the limited time frame, dynamic coding practices were applied to avoid hardcoding.   All field names and schema values are retrieved programmatically via API calls and accessed by their index, ensuring adaptability to future schema changes.

- While there may be more optimized algorithmic strategies for these tests, the current implementation prioritizes clarity and reliability.  As my primary development background is in **Python** and **Java**, JavaScript syntax and libraries were applied pragmatically to meet the assessment objectives within the available time.

---

## **3. Data Quality Dashboard / Metrics**

### **Overview**

The current test suite outputs structured validation summaries directly in the terminal via **Mocha’s default reporter**.  
Each test provides a clear breakdown of **total checks**, **passed/failed counts**, and **field-specific validation summaries**, effectively serving as a live data quality snapshot.

**Example Output**
```
7. Team name rules test:

================================================
Same home/away team name: 1
Team names too short (< 3): 0
Team names too long (> 30): 1
Team names with special chars: 1
Team names with emoji: 1
Total matches checked: 15
=========== Mocha’s default reporter ===================
    4) Each match should follow team name constraints (length + uniqueness + characters)

  8. Status field validation test:

================================================

Field "status": Canonical schema validation
✓ Canonical Passed: 6
✗ Canonical Failed: 9
Total records: 15
=========== Mocha’s default reporter ===================
    5) Each value for the "status" field must match the type defined in the schema (canonical check)

  8. Status field business logic test:

================================================

Field "status": Business Logic Validation
✓ Logic Passed: 1
✗ Logic Failed: 5
Total records checked: 15
=========== Mocha’s default reporter ===================
    6) If output is "in_progress", input must also be "in_progress"
```

### **Interpretation**

Each section of the output reflects the health of a given field or transformation logic.  
For example:

- **✓ Passed:** Records conforming to schema or business rules
- **✗ Failed:** Violations detected (schema mismatch, logic error, or data anomaly)
- **Total checks:** Indicates dataset coverage for that test

This immediate feedback enables quick identification of problem areas without requiring a separate dashboard.

---

### **Future Improvements**

- The current implementation provides **direct console-based metrics**.

- These results can be extended to generate **JSON or CSV reports** for aggregation and visualization.

- Integration with **statistical summaries** (e.g., pass rate %, null ratio, duplicates trend) or **visual dashboards** (Grafana, Power BI, custom web UI) could enhance observability.

- Continuous tracking across runs could support **data drift detection** and long-term quality monitoring.

**Note:**  
The test suite was executed using **Mocha**, **Chai**, and **Supertest**.  
A full JSON report was generated via the Mocha reporter (`--reporter json > report.json`), containing detailed pass/fail data for each test case.  
Some symbols (✓ ✗ emojis) may appear as encoding artifacts in the raw file, but the report remains fully parseable and accurate for further analysis.

---

## **4. Technical Recommendations**

### **Pipeline Improvements**

- **Add validation layer before transformation:**  
    Implement schema validation during the **Extract** stage to catch missing or malformed fields (e.g. `null` IDs, invalid types) before the data reaches the transformation logic.

- **Enforce business-logic consistency:**  
	Introduce rules to ensure logical coherence between fields, for example, prevent a `"scheduled"` match from having a non-null or non-zero score such as `"2-0"`.

- **Refactor `mapStatus()` logic:**  
    Normalize input values (`trim().toLowerCase()`) and remove duplicate conditions to ensure deterministic canonical mapping.

- **Enhance error reporting:**  
    Return structured error objects (e.g. `{ field, recordId, issueType }`) instead of console logs for easier aggregation and debugging.

- **Automated report generation:**  
    Extend Mocha outputs to **JSON or CSV** so that test metrics can be visualized or trended over time.


---

### **Production Deployment Considerations**

- **CI/CD Integration:**  
    Include the test suite in the build pipeline (e.g. GitHub Actions) to automatically block deployments when key validations fail.
    
- **Alerting Thresholds:**  
    Define pass-rate or canonical compliance thresholds (e.g. > 95%) and trigger alerts via Slack/email when violated.
    
- **Provider-level isolation:**  
    Run validation per provider to quickly identify source-specific issues rather than failing the entire ETL batch.
    
- **Logging & Monitoring:**  
    Forward ETL logs and test summaries to a central observability tool (e.g. Grafana, ELK stack) for trend analysis.
    

---

### **Ongoing Quality Assurance Strategy**

- **Scheduled Regression Tests:**  
    Run the full suite daily or post-deployment to detect schema drifts or new anomalies.
    
- **Incremental Dataset Testing:**  
    Validate only new or updated records to optimize test time in production environments.
    
- **Versioned Schema Control:**  
    Track schema changes via Git or JSON Schema versions to prevent silent contract breaks between ETL stages.
    
- **Continuous Improvement:**  
    As JS fluency and project maturity evolve, migrate repetitive logic into shared validation utilities or expand coverage with statistical metrics (null ratio, outlier scores, duplicates rate).