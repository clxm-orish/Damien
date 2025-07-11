'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Accueil" },
        { href: "/portfolio", label: "Portfolio" },
        { href: "/a-propos", label: "À propos" },
        { href: "/tarifs", label: "Tarifs & disponibilités" },
    ];

    return (
        <>
            <div>
                <div className="mb-8">
                    <Link href="/" className="cursor-pointer">
                        <Image src="/logo.svg" alt="ldx logo" width={100} height={60} />
                    </Link>
                </div>
                <nav className="space-y-3 flex flex-col">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-[#2B2B2B] text-2xl w-fit hover:opacity-100 ${pathname === link.href ? 'opacity-100' : 'opacity-65'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div>
                <p className="mb-2 font-medium text-sm">Contact</p>
                <div className="flex gap-3 mb-2">
                    <a href="#"><Linkedin className="w-5 h-5" /></a>
                    <a href="#"><Instagram className="w-5 h-5" /></a>
                </div>
                <p className=" mb-4 text-xs text-muted-foreground">DamienVigouroux@gmail.com</p>
                <a href="/mentions-legales" className=" italic font-medium text-sm">Mentions légals</a>
            </div>
        </>
    );
}
