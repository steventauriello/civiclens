# Scripts

Collectors, parsers, crosswalk builders, schema validators, reconciliation checks, and one-time migration utilities will live here.

Every production ingestion script should record:

- Source identifier
- Retrieval time
- Source URL
- Content hash
- Parser version
- Transformation version
- Output record count
- Validation result
- Reconciliation result
- Error summary

Scripts must be repeatable and must not silently overwrite source history.
