"use client"
import { useAuth, useSignIn, useSignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import Link from "next/link";

const Register = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const { signIn } = useSignIn()
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [pendingVerification, setPendingVerification] = useState(false)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")


    const router = useRouter()
    const { isSignedIn } = useAuth();

    useEffect(() => {
        if (isSignedIn) {
            router.push("/");
        }
    }, [isSignedIn, router]);

    if (!isLoaded) {
        return (
            <div>
                Loading....
            </div>
        )
    }

    const handleSocialLogin = async (strategy) => {
        if (!signIn) return;
        try {
            await signIn.authenticateWithRedirect({
                strategy: strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/"
            });
        } catch (err) {
            console.error("OAuth Error:", err);
        }
    };

    async function submit(e) {
        e.preventDefault()
        setError("")
        if (!isLoaded) {
            return (
                <div>
                    Loading....
                </div>
            )
        }
        try {
            await signUp.create({
                emailAddress,
                password
            })

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })

            setPendingVerification(true)
        }
        catch (err) {
            console.log(JSON.stringify(err, null, 2));
            if (err.errors && err.errors[0].code === "session_exists") {
                router.push("/");
            } else {
                setError(err.errors[0].message)
            }
        }
    }

    async function onPressVerify(e) {
        e.preventDefault()
        if (!isLoaded) {
            return (
                <div>
                    Loading....
                </div>
            )
        }
        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code
            })

            if (completeSignUp.status !== "complete") {
                console.log(completeSignUp.status)
            }
            else {
                await setActive({ session: completeSignUp.createdSessionId })
                router.push("/")
            }
        }
        catch (err) {
            console.log(JSON.stringify(err, null, 2))
        }
    }

    return (
        <div className="w-full h-screen flex box-border">
            <div id="clerk-captcha"></div>
            <div className="hidden md:block w-1/2 h-screen">
                <video
                    className="w-full h-full object-cover"
                    src="/Video.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                />
            </div>

            {!pendingVerification ?
                (
                    <div className="h-screen bg-black flex items-center justify-center text-white w-full p-10 md:w-1/2 md:px-4">
                        <div className="max-w-md w-full space-y-8">
                            <div className="text-center font-extralight mb-4 text-3xl tracking-wider md:text-[3rem] md:tracking-widest">
                                INTERNITO
                            </div>

                            <p className="text-center text-gray-400 mb-2 text-sm md:text-lg">
                                Express login via Google and Facebook
                            </p>
                            <div className="flex mb-4 gap-2">
                                <button onClick={() => handleSocialLogin("oauth_google")} className="flex-1 bg-zinc-800 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-zinc-700 text-sm md:text-base">
                                    <FaGoogle />
                                    Google
                                </button>
                                <button onClick={() => handleSocialLogin("oauth_github")} className="flex-1 bg-zinc-800 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-zinc-700 text-sm md:text-base">
                                    <FaGithub />
                                    Github
                                </button>
                            </div>

                            <div className="border-b border-zinc-700 flex mb-2">
                                <div className="text-white bg-zinc-800 rounded-t-xl px-2 py-1 md:px-3 md:py-2 md:text-md md:font-bold">
                                    Sign Up
                                </div>
                            </div>

                            <form onSubmit={submit}>
                                <input
                                    type="text"
                                    placeholder="EMAIL"
                                    className="w-full rounded-md bg-zinc-800 placeholder-gray-400 mb-3 focus:outline-none px-3 py-2 text-sm md:p-3"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    required
                                />
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="PASSWORD"
                                        className="w-full rounded-md bg-zinc-800 placeholder-gray-400 focus:outline-none px-3 py-2 text-sm md:p-3 md:mb-3"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute text-gray-400 cursor-pointer right-3 top-2 text-sm md:top-3"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </span>
                                </div>

                                <div className="flex flex-row justify-between items-center py-2 font-mono">
                                    <button type="button" className="text-zinc-400 hover:underline">
                                        Forgot password?
                                    </button>
                                </div>


                                <button
                                    className="w-full bg-zinc-700 hover:bg-zinc-600 rounded-md p-2 md:p-2"
                                    type="submit"
                                >
                                    Sign up
                                </button>
                            </form>
                        </div>
                    </div>
                ) :
                (
                    <div className="h-screen bg-black flex items-center justify-center text-white w-full p-10 md:w-1/2 md:px-4">
                        <div className="max-w-md w-full space-y-8">
                            <div className="text-center font-extralight mb-4 text-4xl tracking-wider md:text-[4rem] md:tracking-widest">
                                INTERNITO
                            </div>

                            <div className="border-b border-zinc-700 flex mb-2">
                                <div className="text-white bg-zinc-800 rounded-t-xl px-3 py-2 md:px-5 md:py-3 md:text-xl md:font-bold">
                                    Sign Up
                                </div>
                            </div>

                            <form onSubmit={onPressVerify}>
                                <input
                                    type="text"
                                    placeholder="CODE"
                                    className="w-full rounded-md bg-zinc-800 placeholder-gray-400 mb-3 focus:outline-none px-4 py-3 text-sm md:p-4"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />

                                <button
                                    className="w-full bg-zinc-700 hover:bg-zinc-600 rounded-md p-2 md:p-3"
                                    type="submit"
                                >
                                    Verify
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Register