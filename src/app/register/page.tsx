'use client';
import {  useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import mainPhoto from '../../../assets/mainPhoto.jpg'


export default function Register () {
    const router = useRouter();
    type FormData = {
        password: string;
        email: string;
        userName: string;
      };
    
    const { register, formState: { errors },handleSubmit,reset } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
    
          const result = await response.json();
          if (response.ok) {
            alert('User registered successfully!');
            reset();
            router.push('/');
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
      <div className='flex items-center  justify-between flex-col  border-2 w-[300px] pb-20' ><p className='font-bold text-xl pt-4 '>Instagram</p>
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
            className='border-2 w-[215px] h-10 rounded text-center mb-4'
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

            <input
            className='border-2 w-[215px] h-10 rounded text-center'
              id="userName"
            
              {...register("userName", {
                required: "Password is required",
                validate: {
                    minLength: value => value.length >= 8 || "UserName must be at least 8 characters long",
                    containsUppercase: value => /[A-Z]/.test(value) || "UserName must contain at least one uppercase letter",
                  }
              })}
              placeholder='nazwa użytkownika'
            />
            {errors.userName && <p>{errors.userName.message}</p>}
      
            <button type="submit"  className='m-4  text-xl rounded-lg w-[215px] h-8 text-white bg-blue-400' >Zarejestruj się</button>
          </form>


</div>
          </div>

     
      </div>
    )
}