import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ email, password }); }}>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <Button>로그인</Button>
    </form>
  );
}
