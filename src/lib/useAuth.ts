// hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../redux/store';
import { toast } from 'sonner';

const useAuth = () => {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const checkAuth = () => {
    if (!isAuthenticated) {
      toast.error('You are not logged in!')
      router.push('/'); // Redirect to the login page if not authenticated
    }
  };

  return { isAuthenticated, checkAuth };
};

export default useAuth;