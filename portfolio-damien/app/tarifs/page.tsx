'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { client } from '@/src/sanity/client';
import { PortableText } from '@portabletext/react';
import { motion } from 'framer-motion';
import { TypedObject } from 'sanity';



// ✅ Typage des tarifs
interface Tarif {
    _id: string;
    title: string;
    price: number;
    description: TypedObject;
}

declare global {
    interface Window {
        onCaptchaVerified: (token: string) => void;
    }
}


export default function TarifsPage() {
    const [tarifs, setTarifs] = useState<Tarif[]>([]);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');

    useEffect(() => {
        const scriptId = 'recaptcha-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://www.google.com/recaptcha/api.js';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }
        window.onCaptchaVerified = (token: string) => {
            setCaptchaToken(token);
        };

    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaToken) {
            setStatus('Veuillez compléter le reCAPTCHA.');
            return;
        }
        setStatus('Envoi en cours...');

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, token: captchaToken }),
            });

            if (res.ok) {
                setStatus('Message envoyé !');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus("Erreur lors de l'envoi.");
            }
        } catch {
            setStatus('Erreur de connexion.');
        }
    };

    useEffect(() => {
        const fetchTarifs = async () => {
            const data: Tarif[] = await client.fetch(
                `*[_type == "prices"] | order(price asc){
          _id,
          title,
          price,
          description
        }`
            );
            setTarifs(data);
        };
        fetchTarifs();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full"
        >
            <main className="w-full h-full p-8 flex flex-col justify-center items-center">
                <Tabs defaultValue="accordeon" className="w-full flex h-full items-center">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="accordeon">Tarifs</TabsTrigger>
                        <TabsTrigger value="agenda">Disponibilités</TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="accordeon"
                        className="w-full h-full flex justify-center items-start mt-5"
                    >
                        <Accordion type="single" collapsible className="w-full h-full">
                            {tarifs.map((tarif) => (
                                <AccordionItem
                                    key={tarif._id}
                                    value={tarif._id}
                                    className="border-b-2"
                                >
                                    <AccordionTrigger className="w-full flex justify-between items-center pb-6 text-2xl font-semibold">
                                        <span className="text-left">{tarif.title}</span>
                                        <span className="ml-auto">{tarif.price} €</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6 text-lg md:w-2/3 opacity-75">
                                        <PortableText value={tarif.description} />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </TabsContent>
                    <TabsContent
                        value="agenda"
                        className="w-full h-full flex flex-col items-start justify-start mt-5"
                    >
                        <h2 className="mb-4 text-xl font-semibold">Contactez moi :</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full md:w-1/2">
                            <input
                                type="text"
                                placeholder="Votre nom"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="border rounded p-2"
                            />
                            <input
                                type="email"
                                placeholder="Votre email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="border rounded p-2"
                            />
                            <textarea
                                placeholder="Bonjour je souhaite prendre rdv pour une journee seriez vous disponible le...."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                className="border rounded p-2 h-32 placeholder:opacity-50"
                            />
                            <div
                                className="g-recaptcha"
                                data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
                                data-callback="onCaptchaVerified"
                            />
                            <button type="submit" className="bg-black text-white py-2 rounded hover:bg-gray-800">
                                Envoyer
                            </button>
                            {status && <p className="text-center text-sm">{status}</p>}
                        </form>
                    </TabsContent>
                </Tabs>
            </main>
        </motion.div>
    );
}
