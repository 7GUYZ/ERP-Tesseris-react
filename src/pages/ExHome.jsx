
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <MainLayout>
      <h1 className="text-2xl">Welcome to the Home Page!</h1>
      <Button>Click Me</Button>
    </MainLayout>
  );
}
