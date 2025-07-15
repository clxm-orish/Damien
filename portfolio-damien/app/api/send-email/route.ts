import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);  // ajoute ta clé API dans ton .env.local

export async function POST(req: Request) {
    const body = await req.json();

    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev', // adresse par défaut Resend
            to: 'clmwebagency@gmail.com',
            reply_to: body.email, // <-- Permet de "répondre" au vrai utilisateur
            subject: `Nouveau message de ${body.name}`,
            text: `Email de l'utilisateur : ${body.email}\n\nMessage :\n${body.message}`,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error });
    }
}
