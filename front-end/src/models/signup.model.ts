export interface FormSignUpValues {
    name: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    email: string;
  }
  class SignUpModel {
    static parseBodyToRequest(values: FormSignUpValues) {
      const result = {
        name: values?.name || '',
        phone: values?.phone || '',
        password: values?.password || '',
        confirmPassword: values?.confirmPassword || '',
        email: values?.email || '',
      };
  
      return result;
    }
  }
  
  export default SignUpModel;
  