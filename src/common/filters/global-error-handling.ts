import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DatabaseErrorCode } from '../enum/database-error-code.enum';
import { ErrorMessage } from '../enum/database-error-code.enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: ErrorMessage = ErrorMessage.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      if (typeof errorResponse === 'string') {
        message = this.mapStringToErrorMessage(errorResponse);
      } else if (typeof errorResponse === 'object' && 'message' in errorResponse) {
        message = this.mapStringToErrorMessage((errorResponse as any).message);
      }
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handleDatabaseError(exception);
    } else if (exception instanceof Error) {
      message = this.mapStringToErrorMessage(exception.message);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }

  private handleDatabaseError(exception: QueryFailedError): ErrorMessage {
    const errorCode = (exception as any).code;

    switch (errorCode) {
      case DatabaseErrorCode.UNIQUE_CONSTRAINT:
        return ErrorMessage.DUPLICATE_ENTRY;
      case DatabaseErrorCode.NOT_NULL_CONSTRAINT:
        return ErrorMessage.MISSING_FIELD;
      case DatabaseErrorCode.FOREIGN_KEY_CONSTRAINT:
        return ErrorMessage.INVALID_REFERENCE;
      default:
        return ErrorMessage.DATABASE_ERROR;
    }
  }

  private mapStringToErrorMessage(message: string): ErrorMessage {
    switch (message) {
      case ErrorMessage.DUPLICATE_ENTRY:
        return ErrorMessage.DUPLICATE_ENTRY;
      case ErrorMessage.MISSING_FIELD:
        return ErrorMessage.MISSING_FIELD;
      case ErrorMessage.INVALID_REFERENCE:
        return ErrorMessage.INVALID_REFERENCE;
      case ErrorMessage.DATABASE_ERROR:
        return ErrorMessage.DATABASE_ERROR;
      default:
        return ErrorMessage.INTERNAL_SERVER_ERROR;
    }
  }
}
