'use client';
import {  useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import mainPhoto from '../../../assets/mainPhoto.jpg'
import loginContext from '../contex/loginContext';
import { useContext } from 'react';





export default function Login () {
    const router = useRouter();
    const context = useContext(loginContext);
    if (!context) {
      throw new Error('Login must be used within an AuthProvider');
    }
    const { login } = context;

    type FormData = {
        password: string;
        email: string;
        message: string;
      };
    const { register, formState: { errors },handleSubmit,reset } = useForm<FormData>();



    const onSubmit = async (data: FormData) => {
      
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
    
          const result = await response.json();
         
          if (response.ok) {
           
            login()
            alert('User login successfully!');
            reset();
            router.push('/logged');
          } else {
            alert(`Error: ${result.error}`);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Something went wrong. Please try again later.');
        }
      };

   
      

  
    return (
<div className='flex justify-center mt-8 h-[450px] '>
<Image
  src={mainPhoto}
  alt="telefon"
  layout="intrinsic"
  width={260}
  className='mr-8'
/>
      <div className='flex items-center  justify-between flex-col  border-2 w-[300px]' ><p className='font-bold text-xl pt-4 '>Instagram</p>
      <div className='flex flex-col '>
      <form  className='flex flex-col justify-center items-center  text-sm pb-8' onSubmit={handleSubmit(onSubmit)}>
            
            <input  className='border-2 w-[215px] h-10 m-4 rounded text-center'
              id="email"
              type='email'
              {...register("email", { required: "Email is required" })}
              placeholder='email lub nazwa użytkownika'
            />
            {errors.email && <p>{errors.email.message}</p>}
            
            
            <input
            className='border-2 w-[215px] h-10 rounded text-center'
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                validate: {
                    minLength: value => value.length >= 5 || "Password must be at least 5 characters long",
                    containsUppercase: value => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                    containsNumber: value => /\d/.test(value) || "Password must contain at least one number",
                  }
              })}
              placeholder='hasło'
            />
            {errors.password && <p>{errors.password.message}</p>}
      
            <button type="submit"  className='m-4  text-xl rounded-lg w-[215px] h-8 text-white bg-blue-400' >Zaloguj</button>
          </form>
          <div className="flex items-center">
  <div className=" flex-1 border-t-2 border-dashed border-gray-300"></div>
  <span className="px-4 text-gray-500">lub</span>
  <div className=" flex-1 border-t-2 border-dashed border-gray-300"></div>
</div>
<p className='mt-8 text-gray-500 pb-4'>Nie masz konta? <span className='text-blue-400'><Link  href="/register"
          
          rel="noopener noreferrer">Zarejestruj się !</Link></span></p>
</div>
          </div>

     
      </div>
    )
}