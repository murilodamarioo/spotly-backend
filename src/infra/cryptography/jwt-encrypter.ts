import { Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'

import { Encrypter } from '@/domain/core/application/cryptography'

@Injectable()
export class JwtEncrypter implements Encrypter {

  constructor(private jwtService: JwtService) { }

  encrypt(payload: Record<string, unknown>, options?: { expiresIn?: string | number }): Promise<string> {
    return this.jwtService.signAsync(payload, options as JwtSignOptions)
  }

  decrypt(token: string): Promise<Record<string, unknown>> {
    return this.jwtService.verifyAsync(token)
  }

}