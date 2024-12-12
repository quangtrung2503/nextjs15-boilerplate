import * as yup from 'yup';

export const schema = yup.object().shape({
  name: yup.string().required("Username is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"), location: yup.string().required("Location is required"),
  email: yup.string().email('Invalid email address')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email must match specific pattern')
    .required('Email is required'),
  password: yup.string().required("Password is a required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref('password')], "Passwords must match")
}).required();