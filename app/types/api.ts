export type ApiMeta = Record<string, unknown>;

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta: ApiMeta;
};

export type ApiErrorDetails = Record<string, unknown> | unknown[];

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetails;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type RequestContext = {
  requestId: string;
  logger: import('@/app/logging/logger').Logger;
};
