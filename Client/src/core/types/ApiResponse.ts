export interface ReturnModel<T> {
  data: T | null;
  success: boolean;
  message: string;
  statusCode: number;
  errors?: string[];
}