import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

import { ApiResponse } from "../dto/api-response";
import type { PaginationMeta } from "../utils/pagination";

export interface SuccessResponseBody<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

/**
 * Wraps every successful controller return value into the { success, data, message?,
 * meta? } envelope apps/web's API client expects. A controller returns a bare value
 * for the common case, or ApiResponse.of(data, message, meta) when it needs to set
 * `message`/`meta`.
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponseBody<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<SuccessResponseBody<T>> {
    return next.handle().pipe(
      map((result) => {
        if (result instanceof ApiResponse) {
          return {
            success: true as const,
            data: result.data,
            ...(result.message !== undefined ? { message: result.message } : {}),
            ...(result.meta !== undefined ? { meta: result.meta } : {}),
          };
        }

        return { success: true as const, data: result };
      }),
    );
  }
}
