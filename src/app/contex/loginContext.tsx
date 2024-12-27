'use client';
import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect
} from 'react';

import { useRouter } from 'next/navigation';

interface AuthContextType {
  logged: boolean; 
  setLogged: Dispatch<SetStateAction<boolean>>; 
  login: () => void;
  logout: () => void
  checkAuth: () => Promise<void>;
}


const LoginContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [logged, setLogged] = useState<boolean>(false); 
  const router = useRouter();


  const login = () => {
    setLogged(true);
  };

  const  logout = async () => {
    await fetch('/api/logout', { method: 'PUT' });
    setLogged(false)
    router.push('/');
  };

  const checkAuth = async () => {
    try {
      // Wysyłamy zapytanie do serwera, bez ręcznego dodawania tokena w nagłówku
      const response = await fetch('/api/check-token', {
        method: 'GET', // Weryfikacja tokena
        // Token jest automatycznie wysyłany w ciasteczkach przez przeglądarkę, więc nie musisz go dodawać w nagłówkach.
      });
  
      if (response.ok) {
        setLogged(true); // Token jest ważny
      } else {
        setLogged(false); // Token jest nieważny
        logout(); // Wylogowanie użytkownika, np. usunięcie tokena
      }
    } catch (error) {
      console.error("Błąd podczas sprawdzania tokena:", error);
      setLogged(false); // W przypadku błędu, traktujemy token jako nieważny
      logout(); // Wylogowanie użytkownika, np. po problemach z połączeniem
    }
  };

  useEffect(() => {
    const startInterval = () => {
      if (logged) {
        const intervalId = setInterval(
          () => {
            checkAuth();
          },
          2 * 60 * 1000
        );

        return () => clearInterval(intervalId);
      }
    };

    checkAuth();

    startInterval();
  }, [logged]);


  return (
    <LoginContext.Provider value={{ logged, setLogged, login , logout ,checkAuth}}>
      {children}
    </LoginContext.Provider>
  );
};



export default LoginContext;