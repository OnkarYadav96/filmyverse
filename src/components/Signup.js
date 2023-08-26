import React, { useState } from 'react'
import { TailSpin } from "react-loader-spinner"
import { Link } from 'react-router-dom'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import app from '../firebase/firebase'
import swal from 'sweetalert'
import bcrypt from 'bcryptjs';
import { addDoc } from 'firebase/firestore';
import { usersRef } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app)
const Sigup = () => {
    //Navigate to Home after Successfull Login/SignUp
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [OTP, setOTP] = useState("");

    //generatae RECAPTCHA logic from FireBase Authentication
    const generateRecaotcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {

            }
        }, auth);
    }

    const verifyOTP = () => {
        try {
            setLoading(true);
            window.confirmationResult.confirm(OTP).then((result) => {
                uploadData();
                swal({
                    text: 'Sucsessfully Registered',
                    icon: "success",
                    button: false,
                    timer: 3000
                });
                navigate('/login')
                setLoading(false)
            })

        } catch (error) {
            console.log(error)
        }
    }

    const uploadData = async () => {
        try{
        //Encrypt your passwod by help Of 'bcrypt'functionality
        const salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(form.password, salt)

        await addDoc(usersRef, {
            name: form.name,
            password: hash,
            mobile: form.mobile
        });
    }catch(error){
                console.log(error)
    }
    }

    //generatae RECAPTCHA logic from FireBase OTP Authentication
    const requestOtp = () => {
        setLoading(true);
        generateRecaotcha();
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier).then(confirmationResult => {
            window.confirmationResult = confirmationResult;
            swal({
                text: "OTP Sent",
                icon: "success",
                button: false,
                timer: 3000
            });
            setOtpSent(true);
            setLoading(false);
        }).catch((error) => {
            console.log(error)
        })
    }


    return (

        <div className='w-full mt-8 flex flex-col items-center'>
            <h1 className='text-xl font-bold'>Sign up</h1>
            {
                otpSent ?
                    <>
                        <div class="p-2 w-full md:w-1/3">
                            <div class="relative">
                                <label for="message" class="leading-7 text-sm text-gray-300">OTP</label>
                                <input id="message" name="message" value={form.OTP} onChange={(e) => setOTP(e.target.value)} class="w-full bg-white  rounded border rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>
                        <div class="p-2 w-1/3">
                            <button onClick={verifyOTP} class="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">{loading ? <TailSpin height={25} color="white" /> : 'Confirm OTP'}</button>
                        </div>
                    </>
                    :


                    <>


                        <div class="p-2 w-full md:w-1/3">
                            <div class="relative">
                                <label for="message" class="leading-7 text-sm text-gray-300">Name</label>
                                <input id="message" name="message" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} class="w-full bg-white  rounded border rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>


                        <div class="p-2 w-full md:w-1/3">
                            <div class="relative">
                                <label for="message" class="leading-7 text-sm text-gray-300">Mobile No.</label>
                                <input type={"number"} id="message" name="message" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} class="w-full bg-white  rounded border rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>

                        <div class="p-2 w-full md:w-1/3">
                            <div class="relative">
                                <label for="message" class="leading-7 text-sm text-gray-300">Password</label>
                                <input type={'password'} id="message" name="message" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} class="w-full bg-white  rounded border rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>

                        <div class="p-2 w-1/3">
                            <button onClick={requestOtp} class="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">{loading ? <TailSpin height={25} color="white" /> : 'Request OTP'}</button>
                        </div>
                    </>
            }
            <div>Already have Account <Link to='/login'><span className='text-blue-500'> Login</span></Link></div>
            <div id='recaptcha-container'></div>
        </div>
    )
}

export default Sigup