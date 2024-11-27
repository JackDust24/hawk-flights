import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../../components/ui/use-toast';
import ToastActionButton from '../_components/ToastActionButton';

export function useApi() {
  const { toast } = useToast();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleReroute = () => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 800);

    return () => clearTimeout(timer);
  };

  const fetchData = async (url: string, token: string) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setError('You are not authorized to access this page.');
        toast({
          variant: 'destructive',
          title: 'No authorization',
          description: 'You are not authorized to access this page.',
          action: <ToastActionButton />,
        });

        handleReroute();
        return null;
      }

      if (response.status === 403) {
        setError('You do not have permission to access this page.');
        toast({
          variant: 'destructive',
          title: 'No authorization',
          description: 'Unable to access page',
          action: <ToastActionButton />,
        });
        handleReroute();

        return null;
      }

      if (!response.ok) {
        setError('An Error occured unable to access page');
        toast({
          variant: 'destructive',
          title: 'An Error occured unable to access page',
          description: 'Unable to access page',
          action: <ToastActionButton />,
        });

        handleReroute();
        return null;
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      setError('An error occurred');
      handleReroute();
      return null;
    }
  };

  return { fetchData, error };
}
