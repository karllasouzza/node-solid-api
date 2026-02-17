export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super("User has already checked in today");
  }
}
