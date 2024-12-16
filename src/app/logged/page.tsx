'use client'
import loginContext from '../contex/loginContext';
import { useContext } from 'react';
export default function Menu () {
    const context = useContext(loginContext);
    if (!context) {
      throw new Error('Login must be used within an AuthProvider');
    }
    const { logged } = context;
    return(
<>{logged ? <div className="flex flex-col     w-[300px] space-y-8 pt-8 border-r-2 border-grey-500 h-screen  ">
    <p className="font-bold text-xl mb-8 ml-4" >Instagram</p>
    <p className="ml-4">Strona Główna</p>
    <p className="ml-4">Wyszukaj</p>
    <p className="ml-4">Wiadomości</p>
    <p className="ml-4">Utwórz</p>
    <p className="ml-4">Profil</p>
</div> : <h1>Lol</h1>} </>


    )
}