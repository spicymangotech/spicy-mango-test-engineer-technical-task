# Bug Reports

1. **Missing/null/duplicate Match IDs**
   - **Severity**: Critical
   - **Impact**: The data storage requires a reliable ID for better tracking and referencing. Wrong IDs can lead to data integrity issues and make it impossible to uniquely identify matches.
   - **Recommendation**: Strip given IDs and generate unique IDs in the transform step.

2. **Match ID may exceed digits**
   - **Severity**: Medium
   - **Impact**: The data storage has a limit of 3 digits for IDs. IDs longer than this limit will be truncated, leading to potential collisions and data integrity issues.
   - **Recommendation**: Validate or truncate IDs to 3 characters in the transform step.

3. **Invalid team names**
   - **Severity**: High
   - **Descriptions**: Some team includes invalid names such as empty strings or null values.
   - **Impact**: Team names are crucial for users to identify matches. Invalid or empty team names can lead to confusion in our user interfaces.
   - **Recommendation**: Implement validation to ensure team names are non-empty and valid team names (which may require maintaining a valid team name list).

4. **Special/Emoji Characters in team names**
   - **Severity**: Medium
   - **Descriptions**: Some team names include special characters or emojis, such as `Émoji United ⚽`, `Special Chars FC!@#$% FC`.
   - **Impact**: Team names may include special or emoji characters that could cause issues in certain systems or interfaces. As these characters may not be supported everywhere, they could lead to display issues or data corruption. Other services within the company may not support these characters.
   - **Recommendation**: Normalize team names by removing or replacing special characters and emojis.

5. **Too long team name that may break UI**
   - **Severity**: Medium
   - **Descriptions**: Some team names are excessively long, such as `This is a very long team name that might break the UI`.
   - **Impact**: Long team names can disrupt user interfaces, causing layout issues or making it difficult for users to read and understand match information.
   - **Recommendation**: Implement a maximum length validation for team names and truncate or abbreviate names that exceed this limit.

6. **Score type checking missing**
   - **Severity**: Critical
   - **Descriptions**: The `score` field in the result object should be a string or null, but some entries have it as a array. The transform function does not validate or enforce this type.
   - **Impact**: Without proper type checking, the system may encounter unexpected data formats, leading to errors or crashes.
   - **Recommendation**: Implement comprehensive result type checking to ensure all data conforms to expected formats.

7. **Score key difference**
   - **Severity**: High
   - **Descriptions**: The `score` key is sometimes represented as `result` in the input data.
   - **Impact**: This inconsistency can lead to confusion and errors in data processing.
   - **Recommendation**: Standardize the key names in the transform step to ensure consistency.

8. **Existing score for a future match**
   - **Severity**: High, Data Quality Issue
   - **Descriptions**: Some future matches have pre-existing scores, which can lead to confusion and incorrect data representation.
   - **Impact**: This can result in inaccurate match information being displayed to users.
   - **Recommendation**: Implement checks to prevent assigning scores to future matches.

9. **Program transforming status wrong**
   - **Severity**: Critical
   - **Descriptions**: The program sometimes transforms match statuses incorrectly.
   - **Impact**: This can lead to incorrect match information being displayed to users.
   - **Recommendation**: Modify the transform function to ensure accurate status representation.

10. **Non-standard status string**
   - **Severity**: High, Data Quality Issue
   - **Descriptions**: Some match statuses provided by the data source do not conform to the expected string format. Such as `FINISHED`, `in progress`, `not started` and number typed values.
   - **Impact**: This can lead to confusion and errors in data processing.
   - **Recommendation**: Implement validation and mapping to ensure all status strings transformed to the expected format.

11. **Duplicate matches**
   - **Severity**: Medium
   - **Descriptions**: Some matches have duplicate IDs, leading to potential data integrity issues.
   - **Impact**: Duplicate IDs can cause confusion and errors in data processing, as the system may not be able to distinguish between different matches.
   - **Recommendation**: The system needs more information to identify duplicates, such as combining team names and match date to create a composite key for uniqueness.