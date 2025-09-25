class httpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export default httpError;
