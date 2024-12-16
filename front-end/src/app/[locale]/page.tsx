import { getTranslations } from 'next-intl/server';
import HomePage from './home/HomePage';

type ISignInPageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ISignInPageProps) {
    const { locale } = await props.params;
    const t = await getTranslations({
        locale,
        namespace: 'landingPage',
    });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function Hompage() {
    return (
        <HomePage />
    );
};