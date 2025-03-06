/** @format */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle, HiEye, HiEyeOff, HiMail } from "react-icons/hi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { registerUser } from "../../features/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";

const AuthRegister = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { registerStatus, registerError } = useSelector((state) => state.auth);

	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (values) => {
		dispatch(registerUser(values));
	};

	  useEffect(() => {
		if (registerStatus === "success") {
		  // Redirect or navigate after successful registration
		  navigate('/auth/verify-otp');
		}
	  }, [registerStatus, navigate]);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const validationSchema = Yup.object({
		name: Yup.string().required("Name is required"),
		email: Yup.string()
			.email("Please enter a valid email address")
			.required("Email is required"),
		phoneNumber: Yup.string().required("Phone number is required"),
		password: Yup.string().required("Password is required"),
	});

	return (
		<div className='flex justify-center items-center h-screen motion-preset-slide-right'>
			<div className='max-w-md w-full bg-white p-6 rounded-md shadow-md'>
				<h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Register</h2>
				<Formik
					initialValues={{ name: "", email: "", phoneNumber: "", password: "" }}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({ values, handleChange, handleBlur }) => (
						<Form className='space-y-4'>
							{/* Name Field */}
							<div>
								<Label htmlFor='name' value='Name' />
								<Field
									as={Input}
									id='name'
									type='text'
									name='name'
									placeholder='Enter your name'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.name}
								/>
								<ErrorMessage name='name'>
									{(msg) => <div className='text-red-500 text-sm'>{msg}</div>}
								</ErrorMessage>
							</div>

							{/* Email Field */}
							<div>
								<Label htmlFor='email' value='Email' />
								<Field
									as={Input}
									id='email'
									type='email'
									name='email'
									placeholder='Enter your email'
									leftIcon={HiMail}
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.email}
								/>
								<ErrorMessage name='email'>
									{(msg) => <div className='text-red-500 text-sm'>{msg}</div>}
								</ErrorMessage>
							</div>

							{/* Phone Field */}
							<div>
								<Label htmlFor='phoneNumber' value='Phone Number' />
								<Field
									as={Input}
									id='phoneNumber'
									type='text'
									name='phoneNumber'
									placeholder='Enter your phone number'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.phoneNumber}
								/>
								<ErrorMessage name='phoneNumber'>
									{(msg) => <div className='text-red-500 text-sm'>{msg}</div>}
								</ErrorMessage>
							</div>

							{/* Password Field */}
							<div className='relative'>
								<Label htmlFor='password' value='Password' />
								<Field
									as={Input}
									id='password'
									type={showPassword ? "text" : "password"}
									name='password'
									placeholder='Enter your password'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.password}
								/>
								<div 
									className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer' 
									onClick={togglePasswordVisibility}
								>
									{showPassword ? <HiEyeOff /> : <HiEye />}
								</div>
								<ErrorMessage name='password'>
									{(msg) => <div className='text-red-500 text-sm'>{msg}</div>}
								</ErrorMessage>
							</div>

							<div className='flex justify-between items-center'>
								<Link to='/auth/login' className='text-sm text-blue-600 hover:underline'>
									Already have an account?
								</Link>
							</div>

							
								{registerStatus === "pending" ? (
									<Button disabled className='button w-full mt-4'>
									<span className='spinner'>Loading...</span>
								</Button>
								) : (
<Button type='submit' className='button w-full mt-4 '>
									Register
								</Button>
								)}
							

							{/* {registerStatus === "rejected" && (
								<Alert variant='danger'>
									<HiInformationCircle />
									<span className='font-medium'>{registerError}</span>
								</Alert>
							)} */}
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default AuthRegister;
