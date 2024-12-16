import { useSession } from "@/providers/AuthProvider";

const useAuth = () => {
  const session = useSession();

  return session;
};

export default useAuth;
