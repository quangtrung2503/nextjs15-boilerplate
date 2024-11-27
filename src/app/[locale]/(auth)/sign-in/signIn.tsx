"use client"
import InputField from "@/components/common/Input";
import { Button } from "@fluentui/react-components";
import { useTranslations } from "next-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'

type FormValues = {
    username: string;
    email: string;
};

type ISignInProps = {
    path: string
}

const SignIn = (props: ISignInProps) => {
    const t = useTranslations('SignIn');
    const { handleSubmit, control } = useForm<FormValues>({
        defaultValues: { username: '', email: '', },
        reValidateMode: 'onSubmit',
        criteriaMode: 'all',
        resolver: yupResolver(Yup.object().shape({
            username: Yup.string().required('Username is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
        })),
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log('Form Data:', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
                control={control}
                name="username"
                label="Username"
                placeholder={t("Enter your username")}
            />
            <InputField
                control={control}
                name="email"
                label="Email"
                type="password"
                placeholder={t("Enter your password")}
            />
            <Button type="submit">
                Submit
            </Button>
        </form>
    );
}

export default SignIn;