import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);  // ajoute ta clé API dans ton .env.local

export async function POST(req: Request) {
    const body = await req.json();

    const { token, ...form } = body;

    if (!token) {
        return NextResponse.json({ success: false, error: 'reCAPTCHA manquant' }, { status: 400 });
    }

    try {
        const secret = process.env.RECAPTCHA_SECRET_KEY;
        const params = new URLSearchParams({ secret: secret ?? '', response: token });
        const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        const verifyData = await verify.json();
        if (!verifyData.success) {
            return NextResponse.json({ success: false, error: 'Échec du reCAPTCHA' }, { status: 400 });
        }

        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'clmwebagency@gmail.com',
            replyTo: form.email,
            subject: `Nouveau message de ${form.name}`,
            text: `Email de l'utilisateur : ${form.email}\n\nMessage :\n${form.message}`,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error });
    }
}
