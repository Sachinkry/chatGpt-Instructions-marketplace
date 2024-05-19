'use client'

import { Button } from "@/components/ui/button";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function page(){
    const handleLoginWithOAuth = (provider:"google"|"twitter"|"github") => {
        const supabase = supabaseBrowser();

        supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: location.origin + "/auth/callback",
            }
        })
    }

    return (
        <div className="flex items-center justify-center w-full h-screen">
            <div className="w-96 rounded-md border px-6 py-4 space-y-4 relative bg-neutral-100">
                <div className="flex items-center gap-2">
                    {/* <KeyRound /> */}
                    <h1 className="font-semibold text-neutral-600">Sign In with</h1>
                </div>

                {/* <p>SignIn</p> */}
                <div className="flex flex-col gap-3">
                    <Button
                       className="w-full flex-row gap-2 text-neutral-600"
                       variant={"outline"}
                       onClick={()=> handleLoginWithOAuth("google")}
                    >
                        <FcGoogle /> Google
                    </Button>
                    <Button
                       className="w-full flex-row gap-2 text-neutral-600"
                       variant={"outline"}
                       onClick={() => handleLoginWithOAuth("twitter")}
                    >
                        <FaTwitter /> Twitter
                    </Button>
               
                    <Button
                       className="w-full flex-row gap-2 text-neutral-600"
                       variant={"outline"}
                       onClick={() => handleLoginWithOAuth("github")}
                    >
                        <FaGithub /> Github
                    </Button> 
                </div>
                <div className="glowBox -z-10"></div>
            </div>
        </div>
    )
}