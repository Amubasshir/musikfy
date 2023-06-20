import { signIn } from 'next-auth/react';

const Login = () => {
  return (
    <di className="flex items-center justify-center">
      <button onClick={() => signIn('spotify', { callbackUrl: '/' })}>
        Login with spotify
      </button>
    </di>
  );
};

export default Login;
