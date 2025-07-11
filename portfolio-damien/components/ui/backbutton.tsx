'use client';

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function BackButton() {
    const router = useRouter();

    return (
        <div className="w-full flex justify-start pt-4 ">
            <Button onClick={() => router.back()} className="bg-[#2B2B2B] hover:bg-[#1a1a1a] text-white cursor-pointer">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Retour
            </Button>
        </div>
    );
}
