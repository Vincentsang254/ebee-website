/** @format */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/slices/authSlice";
import { HiInformationCircle, HiEye, HiEyeOff } from "react-icons/hi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AuthLogin = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { loginError, loginStatus } = useSelector((state) => state.auth);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (values) => {
		dispatch(loginUser(values));
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const validationSchema = Yup.object({
		email: Yup.string()
			.email("Please enter a valid email address")
			.required("Email is required"),
		password: Yup.string().required("Password is required"),
	});

	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='max-w-md w-full bg-white p-8 rounded-lg shadow-lg'>
				<h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Login</h2>
				<Formik
					initialValues={{ email: "", password: "" }}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{({ values, handleChange, handleBlur }) => (
						<Form className='space-y-5'>
							<div>
								<Label htmlFor='email' value='Email' />
								<Field
									as={Input}
									id='email'
									type='email'
									name='email'
									placeholder='Enter your email'
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.email}
								/>
								<ErrorMessage name='email'>
									{(msg) => <div className='text-red-500 text-sm'>{msg}</div>}
								</ErrorMessage>
							</div>

							<div>
								<Label htmlFor='password' value='Password' />
								<div className='relative'>
									<Field
										as={Input}
										id='password'
										type={showPassword ? "text" : "password"}
										name='password'
										placeholder='Enter your password'
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.password}
										className='pr-10' // Add padding for icon
									/>
									<span
										onClick={togglePasswordVisibility}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
									>
										{showPassword ? <HiEyeOff /> : <HiEye />}
									</span>
								</div>
								<ErrorMessage name='password'>
									{(msg) => <div className='text-red-500 text-sm'>{msg}</div>}
								</ErrorMessage>
							</div>

							<div className='flex flex-col space-y-2'>
								<Link to='/auth/register' className='text-sm text-blue-600 hover:underline'>
									Don’t have an account?
								</Link>
								<Link to='/auth/forgot-password' className='text-sm text-blue-600 hover:underline'>
									Forgot password?
								</Link>
							</div>

							{loginStatus === "pending" ? (
								<Button disabled className='button w-full mt-4'>
									<span className='spinner'>Loading...</span>
								</Button>
							) : (
								<Button type='submit' className='button w-full mt-4 motion-preset-blink'>
									Login
								</Button>
							)}

							{/* Keep error message container height fixed
							<div className='w-full overflow-hidden whitespace-nowrap'>
								{loginStatus === "rejected" && (
									<Alert variant='danger' className='flex items-center'>
										<HiInformationCircle className='mr-2' />
										<span className='font-medium'>{loginError}</span>
									</Alert>
								)}
							</div> */}
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default AuthLogin;
