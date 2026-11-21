import type { Session } from '@supabase/supabase-js';
import { supabase } from './client';

export interface TutorProfile {
  id: string;
  full_name: string;
  tutor_id: string;
}

function requireClient() {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  return supabase;
}

/** Login tentor lewat Supabase Auth (email + kata sandi). */
export const TutorAuth = {
  async signIn(email: string, password: string): Promise<void> {
    const { error } = await requireClient().auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(
        /invalid login credentials/i.test(error.message) ? 'Email atau kata sandi salah.' : error.message
      );
    }
  },

  async signOut(): Promise<void> {
    await requireClient().auth.signOut();
  },

  async getSession(): Promise<Session | null> {
    const { data } = await requireClient().auth.getSession();
    return data.session;
  },

  /** Mendengarkan login/logout. Mengembalikan fungsi untuk berhenti. */
  onChange(cb: (session: Session | null) => void): () => void {
    const { data } = requireClient().auth.onAuthStateChange((_event, session) => cb(session));
    return () => data.subscription.unsubscribe();
  },

  /** Profil tentor untuk pengguna ini; null bila akunnya bukan tentor atau belum ditautkan ke tutors. */
  async getProfile(userId: string): Promise<TutorProfile | null> {
    const { data, error } = await requireClient()
      .from('profiles')
      .select('id, full_name, role, tutor_id')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data || data.role !== 'tutor' || !data.tutor_id) return null;
    return { id: data.id, full_name: data.full_name, tutor_id: data.tutor_id };
  },
};
