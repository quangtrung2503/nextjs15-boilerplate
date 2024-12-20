// import { getI18nPath } from '@/utils/helpers';
import { getTranslations } from 'next-intl/server';
import SignIn from './signIn';
import { getI18nPath } from '@/utils/helpers';
// import SignIn from './signIn';

type ISignInPageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ISignInPageProps) {
    const { locale } = await props.params;
    const t = await getTranslations({
        locale,
        namespace: 'signIn',
    });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function SignInPage(props: ISignInPageProps) {
    const { locale } = await props.params;
    return (
        <SignIn path={getI18nPath('/sign-in', locale)} />
    );
};