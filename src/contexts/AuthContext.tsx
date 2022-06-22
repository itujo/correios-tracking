import { useRouter } from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

type SignInData = {
  username: string;
  password: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
  username: string;
  updatedAt: Date;
  createdAt: Date;
};

type AuthContextType = {
  isAuthenticated: boolean;
  userData: User | null;
  // eslint-disable-next-line no-unused-vars
  signIn: (data: SignInData) => Promise<unknown>;
  signOut: () => void;
};

const AuthContext = createContext({} as AuthContextType);

function AuthProvider({ children }: any) {
  const router = useRouter();

  const [userData, setUserData] = useState<User | null>(null);

  const isAuthenticated = !!userData;

  useEffect(() => {
    const { 'wms-token': token } = parseCookies();

    if (token) {
      api.get('/user/me').then(({ data }) => {
        setUserData(data.user);
      });
    }
  }, []);

  async function signIn({ username, password }: SignInData) {
    return new Promise((resolve, reject) => {
      api
        .post('/user/login', {
          username,
          password,
        })
        .then((res) => {
          const { token, user } = res.data;

          setCookie(null, 'wms-token', token, {
            maxAge: 60 * 60 * 24 * 30, // 30 dias
            path: '/wms',
          });

          setUserData(user);
          api.defaults.headers.common.Authorization = `Bearer ${token}`;

          router.push('/wms');

          resolve('');
        })
        .catch((erro) => {
          if (erro.response) {
            if (erro.response.status === 401) {
              reject(new Error('wrong username or password'));
            }
          }
        });
    });
  }

  async function signOut() {
    destroyCookie(null, 'wms-token');
    setUserData(null);
    router.push('/login');
  }

  const props = useMemo(
    () => ({
      userData,
      isAuthenticated,
      signIn,
      signOut,
    }),
    [userData, isAuthenticated]
  );

  return <AuthContext.Provider value={props}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
