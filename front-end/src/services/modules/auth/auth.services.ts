import httpService from '@/services/httpService';
import apiUrls from '@/constants/apiUrls';
import { RequestLogin, ResponseLogin } from './interfaces/signin.interface';
import { SignUpRequest, SignUpResponse } from './interfaces/signup.interface';

class LoginService {
  signin(body: RequestLogin): Promise<ResponseLogin> {
    return httpService.axios.post(apiUrls.AUTH.SIGN_IN, body);
  }
  signup(body: SignUpRequest): Promise<SignUpResponse> {
    console.log({body});
    return httpService.axios.post(apiUrls.AUTH.SIGN_UP, body);
  }
}

export default new LoginService();
