import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Response } from 'express'
import { map } from 'rxjs/operators'

@Injectable()
export class SetRefreshTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>()

        if (data && data.refresh_token) {
          const { refresh_token, ...rest } = data

          const EXPIRES_IN_SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7

          response.cookie('refreshToken', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: EXPIRES_IN_SEVEN_DAYS,
          })

          return rest
        }

        return data
      }),
    )
  }
}