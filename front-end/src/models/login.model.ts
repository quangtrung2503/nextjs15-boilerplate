export interface FormLoginValues {
  password: string;
  email: string;
}
class LoginModel {
  static parseBodyToRequest(value: FormLoginValues) {
    const result = {
      password: value?.password || '',
      email: value?.email || '',
    };

    return result;
  }
}

export default LoginModel;
