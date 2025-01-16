import * as OTPAuth from 'otpauth';
import {AuthType} from '@prisma/client';

export function getToken(name: string, type: AuthType, secret: string, digits: number, counter: number | null): {token: string, remaining: number | null} | null {
  if (type === AuthType.TOTP) {
    const totp = new OTPAuth.TOTP({
      label: name,
      issuerInLabel: false,
      digits: digits,
      secret: secret
    })

    let token = totp.generate();

    if (!token) {
      return null;
    }

    let remaining = totp.period - (Math.floor(Date.now() / 1000) % totp.period);

    return {token: token, remaining: remaining};
  }

  if (!counter) {
    return null;
  }

  const hotp = new OTPAuth.HOTP({
    label: name,
    issuerInLabel: false,
    digits: digits,
    secret: secret,
    counter: counter
  })

  return {token: hotp.generate(), remaining: null};
}
