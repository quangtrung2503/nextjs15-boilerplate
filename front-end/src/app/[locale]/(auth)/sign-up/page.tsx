import { getTranslations } from 'next-intl/server';
import { getI18nPath } from '@/utils/helpers';
import SignUp from './signUp';

type ISignInPageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ISignInPageProps) {
    const { locale } = await props.params;
    const t = await getTranslations({
        locale,
        namespace: 'SignUp',
    });
    return {
        title: t('meta_title'),
        description: t('meta_description'),
    };
}

export default async function SignInPage(props: ISignInPageProps) {
    const { locale } = await props.params;
    return (
        <SignUp path={getI18nPath('/sign-up', locale)} />
    );
};