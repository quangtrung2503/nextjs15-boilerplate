import Admin from "./admin"
type IAdminPageProps = {
    path: string
}

export default async function AdminPage() {
    return (
        <Admin />
    );
};