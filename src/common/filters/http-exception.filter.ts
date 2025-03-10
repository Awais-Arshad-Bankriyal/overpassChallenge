import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { QueryFailedError } from 'typeorm';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';
  
      // Handle HttpException (e.g., validation errors, unauthorized access)
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        message = exception.getResponse() as string;
      }
      // Handle TypeORM QueryFailedError (SQLite errors)
      else if (exception instanceof QueryFailedError) {
        status = HttpStatus.BAD_REQUEST; // Default status for database errors
        message = this.handleDatabaseError(exception);
      }
      // Handle generic errors
      else if (exception instanceof Error) {
        message = exception.message;
      }
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
      });
    }
  
    private handleDatabaseError(exception: QueryFailedError): string {
      // Check for SQLite error codes or messages
      const errorCode = (exception as any).code; // SQLite error code
      const errorMessage = exception.message;
  
      // Handle specific SQLite errors
      if (errorCode === 'SQLITE_CONSTRAINT') {
        if (errorMessage.includes('UNIQUE constraint failed')) {
          return 'Duplicate entry: A record with the same unique key already exists.';
        } else if (errorMessage.includes('NOT NULL constraint failed')) {
          return 'Missing required field: A required field is missing or null.';
        } else if (errorMessage.includes('FOREIGN KEY constraint failed')) {
          return 'Invalid reference: A foreign key constraint was violated.';
        }
      }
  
      // Default database error message
      return 'Database error: An error occurred while processing your request.';
    }
  }