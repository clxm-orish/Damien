'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Linkedin, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { href: '/', label: 'Accueil' },
        { href: '/portfolio', label: 'Portfolio' },
        { href: '/a-propos', label: 'À propos' },
        { href: '/tarifs', label: 'Tarifs & disponibilités' },
    ];

    return (
        <>
            {/* Logo + menu burger mobile */}
            <div className="flex justify-between items-center mb-8 md:hidden">
                <Link href="/" className="cursor-pointer mx-auto">
                    <Image src="/logo.svg" alt="ldx logo" width={100} height={60} />
                </Link>
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
                    {menuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Sidebar desktop */}
            <div className="hidden md:flex flex-col justify-between h-full">
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
                    <p className="mb-4 text-xs text-muted-foreground">DamienVigouroux@gmail.com</p>
                    <a href="/mentions-legales" className="italic font-medium text-sm">Mentions légales</a>
                    <a href="/traitement-des-cookies" className="italic font-medium text-sm">Traitement des cookies</a>
                </div>
            </div>

            {/* Menu mobile slide */}
            {/* Overlay clic extérieur */}
            <div
                className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'}`}
                onClick={() => setMenuOpen(false)}
            ></div>

            {/* Menu mobile slide depuis la droite */}
            <div
                className={`fixed top-0 right-0 h-full w-2/3 max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'} flex flex-col justify-between p-6`}
            >
                {/* Bouton croix dans le menu */}
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-4 right-4 p-2"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Liens du menu alignés à droite */}
                <div className="flex flex-col items-end space-y-4 mt-12">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-xl ${pathname === link.href ? 'font-bold' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Footer du menu */}
                <div className="flex flex-col items-end space-y-2 mt-6">
                    <div className="flex gap-3">
                        <a href="#"><Linkedin className="w-5 h-5" /></a>
                        <a href="#"><Instagram className="w-5 h-5" /></a>
                    </div>
                    <p className="text-xs text-muted-foreground">DamienVigouroux@gmail.com</p>
                    <a href="/mentions-legales" className="italic text-sm">Mentions légales</a>
                    <a href="/traitement-des-cookies" className="italic text-sm">Traitement des cookies</a>
                </div>
            </div>
        </>
    );
}
