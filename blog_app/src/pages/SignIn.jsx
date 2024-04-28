import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { FaGoogle } from "react-icons/fa";
import { useEffect, useState } from 'react';
import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice';
import OAuth from '../components/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function SignUp() {

    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);
    const{currentUser}=useSelector((state) => state.user);
    
    // useEffect(()=>{
    //     if(currentUser){
    //         navigate('/')
    //     }
    // },[])

    const handlelogin = async () => {
        if (!email || !password) {
            return dispatch(signInFailure("Please fill out all fields"))
        }

        try {
            dispatch(signInStart());
            let result = await fetch("http://localhost:3500/api/user/authlogin", {
                method: 'post',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': "application/json"
                }
            })
            result = await result.json()
            console.warn(result);

            if (result.user) {
                dispatch(signInSuccess(result))
                navigate('/')
            }

            if (result.success === false) {
                dispatch(signInFailure(result.message))
            }

        }
        catch (err) {
            dispatch(signInFailure(err.message))
        }
    }
    return (
        <div className='min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 max-w-5xl mx-auto'>
            <div className='flex flex-col gap-4 p-3 text-center'>
                <Link to='/' className='font-bold text-4xl'>
                    <span className='px-2 mr-1 py-1 bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-500 rounded-md shadow-md text-white'>Random</span>
                    Blogs
                </Link>
                <div className='text-lg'>Sign In with your email and password or with Google.</div>
            </div>
            <form className="flex flex-col gap-5 p-3 w-full md:w-96">


                <div>
                    <Label value='Your email' />
                    <TextInput
                        placeholder='Enter your email'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <Label value='Your password' />
                    <TextInput
                        placeholder='Enter your password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button className='w-full ' gradientDuoTone="purpleToBlue" onClick={handlelogin}>
                    {loading ?
                        <>
                            <Spinner size='sm' />
                            <span className='pl-3'>Loading</span>
                        </>
                        :
                        `Sign In `}</Button>
                <OAuth />


                <div>Don't Have an account? <span>
                    <Link to='/signup' className='text-blue-600'>Sign Up</Link>
                </span></div>

                {error && <Alert className='mt-5' color='failure' >{error}</Alert>}
            </form>

        </div>
    )
}

export default SignUp
