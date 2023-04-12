export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Ra/E-mail já cadastrados');
  }
}
