export class SuccessMessage {
  message: string = "";
  data: any = null;
  error: boolean = false;

  constructor(data: any, message?: string) {
    this.message = message ?? "Success.";
    this.data = data;
  }
}
