export function randomString(length: number = 5, withNumber: boolean = false) {
  let chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (withNumber) chars += "0123456789";

  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(randomNumber, randomNumber + 1);
  }

  return randomString;
}