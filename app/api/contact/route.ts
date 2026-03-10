import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // ── Option 1: Resend (recommended) ──────────────────────────────────────
    // Uncomment and add RESEND_API_KEY to .env.local
    //
    // const { Resend } = await import('resend')
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'Portfolio Contact <contact@yourdomain.com>',
    //   to: 'hello@yourname.dev',
    //   subject: `New message from ${name}`,
    //   text: `From: ${name} <${email}>\n\n${message}`,
    // })

    // ── Option 2: Formspree ────────────────────────────────────────────────
    // Replace YOUR_FORM_ID with your Formspree form ID
    //
    // const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //   body: JSON.stringify({ name, email, message }),
    // })
    // if (!res.ok) throw new Error('Formspree error')

    // ── Default: log to console (for development) ──────────────────────────
    console.log('Contact form submission:', { name, email, message })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
