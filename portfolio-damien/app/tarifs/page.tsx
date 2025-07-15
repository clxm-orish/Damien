'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { client } from '@/src/sanity/client';
import { PortableText } from '@portabletext/react';
import { motion } from 'framer-motion';
import { TypedObject } from 'sanity';



// ✅ Typage des tarifs et de l'agenda
interface Tarif {
    _id: string;
    title: string;
    price: number;
    description: TypedObject;
}

interface Agenda {
    url: string;
}

export default function TarifsPage() {
    const [tarifs, setTarifs] = useState<Tarif[]>([]);
    const [agenda, setAgenda] = useState<Agenda | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Envoi en cours...');

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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
            const agendaData: Agenda[] = await client.fetch(
                `*[_type == "agenda"] | order(_createdAt desc){
          url
        }`
            );
            setTarifs(data);
            setAgenda(agendaData[0]);
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
                        className="w-full h-full flex flex-col justify-center items-center"
                    >
                        {agenda ? (
                            <iframe
                                src={agenda.url}
                                width="100%"
                                height="600"
                                frameBorder="0"
                                scrolling="no"
                                className="w-full h-[50vh] md:h-[600px] rounded border"
                            ></iframe>
                        ) : (
                            <div className="text-center text-lg text-gray-500">
                                Chargement de l&apos;agenda...
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <div className="w-full flex justify-center items-center">
                    <Sheet>
                        <SheetTrigger className="bg-[#2B2B2B] hover:bg-[#1a1a1a] w-full md:w-1/6 text-white p-4 m-4 cursor-pointer flex justify-center space-x-2">
                            Prendre Contact
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Contactez-moi</SheetTitle>
                            </SheetHeader>
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col space-y-4 mt-4"
                            >
                                <input
                                    type="text"
                                    placeholder="Votre nom"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                    className="border rounded p-2"
                                />
                                <input
                                    type="email"
                                    placeholder="Votre email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    required
                                    className="border rounded p-2"
                                />
                                <textarea
                                    placeholder="Votre message"
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({ ...formData, message: e.target.value })
                                    }
                                    required
                                    className="border rounded p-2 h-32"
                                />
                                <button
                                    type="submit"
                                    className="bg-black text-white py-2 rounded hover:bg-gray-800"
                                >
                                    Envoyer
                                </button>
                                {status && (
                                    <p className="text-center text-sm">{status}</p>
                                )}
                            </form>
                        </SheetContent>
                    </Sheet>
                </div>
            </main>
        </motion.div>
    );
}
