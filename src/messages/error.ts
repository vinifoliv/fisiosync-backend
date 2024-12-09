export class ErrorMessage {
  message: string = "";
  data: unknown = null;
  error: boolean = true;

  constructor(data: unknown, message?: string) {
    this.message = message ?? "An error has ocurred.";
    this.data = data;
  }
}

export const SendError = (error: ErrorMessage | Error) => {
  if (error instanceof ErrorMessage) return error;
  return new ErrorMessage(error?.message ?? error);
};
