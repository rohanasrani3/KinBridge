import { Redirect } from 'expo-router';
import { useStore } from '@/store';

export default function Index() {
  const { data } = useStore();
  return <Redirect href={data.profile ? '/today' : '/onboarding'} />;
}
