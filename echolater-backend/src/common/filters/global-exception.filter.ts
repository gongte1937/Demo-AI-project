import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res.message as string) ?? message;
        code = (res.code as string) ?? this.statusToCode(status);
      }

      code = this.statusToCode(status);
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    const isDevMode = process.env.NODE_ENV !== 'production';

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        ...(isDevMode && exception instanceof Error
          ? { details: exception.stack }
          : {}),
      },
    });
  }

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      500: 'INTERNAL_ERROR',
    };
    return map[status] ?? 'INTERNAL_ERROR';
  }
}
