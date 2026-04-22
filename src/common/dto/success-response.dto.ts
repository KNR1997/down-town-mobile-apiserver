export interface SuccessResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}

export function successResponse<T>(
  data: T,
  message = 'Success',
  statusCode = 200,
): SuccessResponse<T> {
  return {
    message,
    statusCode,
    data,
  };
}

export class SuccessResponseDto<T> {
  message: string;
  statusCode: number;
  data: T;

  constructor(partial: Partial<SuccessResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
