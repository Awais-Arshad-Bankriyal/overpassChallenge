export enum DatabaseErrorCode {
    UNIQUE_CONSTRAINT = 'SQLITE_CONSTRAINT_UNIQUE',
    NOT_NULL_CONSTRAINT = 'SQLITE_CONSTRAINT_NOTNULL',
    FOREIGN_KEY_CONSTRAINT = 'SQLITE_CONSTRAINT_FOREIGNKEY',
  }


  export enum ErrorMessage {
    DUPLICATE_ENTRY = 'Duplicate entry: A record with the same unique key already exists.',
    MISSING_FIELD = 'Missing required field: A required field is missing or null.',
    INVALID_REFERENCE = 'Invalid reference: A foreign key constraint was violated.',
    DATABASE_ERROR = 'Database error: An error occurred while processing your request.',
    INTERNAL_SERVER_ERROR = 'Internal server error',
  }