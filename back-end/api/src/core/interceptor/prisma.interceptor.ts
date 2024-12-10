import {
  CallHandler, ConflictException, ExecutionContext,
  Injectable,
  NestInterceptor, RequestTimeoutException
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { I18nContext } from 'nestjs-i18n';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

export interface Response {
  // data: T;
}

@Injectable()
export class PrismaInterceptor<T>
implements NestInterceptor<T, Response> {
  // constructor(private readonly actionAdminService: ActionAdminService) { }
  intercept(context: ExecutionContext, next: CallHandler,): Observable<Response> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;
    // console.info(`PrismaInterceptor ${originalUrl} request: `, request);
    return next.handle().pipe(
      map(async (response) => {
        // const requestId = uuidv4();

        const user = request?.user?.data;
        const role: UserRole = user?.userType;
        if (user && role && role === UserRole.MEMBER && method != 'GET') {
          // await this.actionAdminService.create({
          //   data: {
          //     action: originalUrl,
          //     actionKey: requestId,
          //     actionBody: body,
          //     userAdminId: user.id,
          //     ip,
          //   },
          // });
        }
        // if (!response?.status)
        //   throw new HttpException('Bad Gateway', HttpStatus.BAD_GATEWAY);

        return {
          statusCode: 200,
          messages: response?.message || 'Success',
          success: true,
          data: response || {},
        };
      }),
      timeout(50000),
      catchError((err) => {
        console.info(`PrismaInterceptor error ${originalUrl} : `, err?.code, err);
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        switch (err?.code) {
          case 'P2002':
            const duplicateField = this.mapDuplicateField(err?.meta?.target);
            const lang = I18nContext.current().lang || 'en';
            const message = lang === 'vi' 
              ? `${duplicateField} đã tồn tại!`
              : `${duplicateField} already exists!`;
            throw new ConflictException(message);
          default:
            return throwError(() => err);
        }
      }),
    );
  }

  private mapDuplicateField(target: string): string {
    switch (target) {
      case 'user_email_key':
        return I18nContext.current().lang === 'en' ? 'Email' : 'Email';
      case 'user_phone_key':
        return I18nContext.current().lang === 'en' ? 'Phone' : 'Số điện thoại';
      case 'user_username_key':
        return I18nContext.current().lang === 'en' ? 'Username' : 'Tên đăng nhập';
      default:
        return '';
    }
  }
}
