'use client'

import { CommonButton } from "@/components/common/Button"
import { useForm, Controller, FormProvider, Path, UseFormRegister } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { CommonDatePicker } from "@/components/common/DatePicker"

interface IFormInput {
  firstName: string;
  lastName: string;
}
const schema = yup
  .object({
    firstName: yup.string().required(),
    age: yup.number().positive().integer().required(),
  })
  .required()
interface IFormValues {
  "First Name": string
  Age: number
}

type InputProps = {
  label: Path<IFormValues>
  required?: boolean
}
const Input = ({ label }: InputProps) => (
  <>
    <label>{label}</label>
    <input name={label} />
  </>
)

export default function App() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const methods = useForm<IFormInput>({
        defaultValues: {
          firstName: "",
          lastName: "",
        },
      });
  const onSubmit = (data: any) => console.log(data)
  return (
    <>
      <FormProvider {...methods} >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="firstName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <input {...field} />}
          />
          <p>{errors.firstName?.message}</p>
          {/*           
          <HookFormField
          name="lastName"
          component={CustomInput}
          />
          <div className="w-56">
          <HookFormField
          name="date"
          label="Date"
          required
          rules={{ required: "First Name is required" }}
          component={CommonDatePicker}
          />
          </div> */}
          <CommonButton type="submit" className="w-32 active rounded" label="Send" variant="outlined" />
        </form>
      </FormProvider>
    </>
  )
}
//   const methods = useForm<IFormInput>({
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//     },
//   });
//   const onSubmit = (data: IFormInput) => {
//     console.log(data);
//   };
//   return (
//     <>
//     <FormProvider {...methods}>
//       <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
//         <HookFormField
//           name="firstName"
//           label="HIHI"
//           component={CustomInput}
//         />
//         <HookFormField
//           name="lastName"
//           component={CustomInput}
//         />
//         <div className="w-56">
//         <HookFormField
//           name="date"
//           label="Date"
//           required
//           rules={{ required: "First Name is required" }}
//           component={CommonDatePicker}
//         />
//         </div>
//         <CommonButton type="submit" className="w-32 active rounded" label="Send" variant="outlined" />
//       </form>
//     </FormProvider>
//       <Stack direction="row" gap={2}>
//         <CommonButton className="w-32 rounded" label="Send" variant="outlined" />
//         <CommonButton className="w-32" label="Send" variant="outlined" />
//         <CommonButton className="w-32 active" label="Send" variant="outlined" startIcon={<FavoriteBorderIcon />} />
//         <CommonButton className="w-32 outlined" label="Search" variant="outlined" />
//         <CommonButton className="w-32" colorBtn="info" label="View more" />
//         <CommonButton className="w-32" colorBtn="info">HIHIHI</CommonButton>
//       </Stack>
//        {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="w-72 ml-5 mt-9">
//           <Controller
//             name="date"
//             control={control}
//             rules={{ required: true }}
//             render={({ field }) => (
//               <CommonDatePicker
//                 name="date"
//                 label="Date"
//                 onChange={(newValue) =>
//                   field.onChange(newValue ? newValue.toDate() : null)
//                 }
//                 className="border p-2"
//               />
//             )}
//           />
//           <Select
//             name="date"
//             label="Date"
//             className="border p-2"
//           />
//           <CommonButton className="w-32" label="Send" type="submit" />
//         </div>
//         <Button>HIII</Button>
//       </form> */}
//     </>
//   )
// }
