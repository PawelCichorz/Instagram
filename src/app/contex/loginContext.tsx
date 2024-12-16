'use client';
import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  
} from 'react';

interface AuthContextType {
  logged: boolean; 
  setLogged: Dispatch<SetStateAction<boolean>>; 
  login: () => void;
}


const LoginContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [logged, setLogged] = useState<boolean>(false); 

  const login = () => {
    setLogged(true);
  };

  return (
    <LoginContext.Provider value={{ logged, setLogged, login }}>
      {children}
    </LoginContext.Provider>
  );
};



export default LoginContext;