import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { message: 'Email and password are required.' },
      { status: 400 },
    );
  }

  const origin = new URL(req.url).origin;
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: { name: body.name ?? '' },
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json(
      { message: error.message ?? 'Sign up failed.' },
      { status: 400 },
    );
  }

  if (!data.session) {
    return NextResponse.json({ user: null, requiresConfirmation: true });
  }

  return NextResponse.json({ user: data.user });
}