import { getTranslations } from 'next-intl/server';
import Landing from './landing';

type ISignInPageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: ISignInPageProps) {
    const { locale } = await props.params;
    const t = await getTranslations({
        locale,
        namespace: 'LandingPage',
    });
    return {
        title: t('meta_title'),
        description: t('meta_description'),
    };
}

export default async function Hompage() {
    return (
        <Landing />
    );
};