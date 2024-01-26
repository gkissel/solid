export class UserAlreadyExistError extends Error {
  constructor() {
    super('User with same email already exists')
    this.name = 'UserAlreadyExistError'
  }
}
