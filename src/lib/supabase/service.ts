import { supabase, isSupabaseConfigured } from './client';
import {
  Tutor,
  TutorSlot,
  Booking,
  EvaluationReport,
  ChatMessage,
  AiMatchmakingInput,
} from '../types';
import {
  MOCK_TUTORS,
  MOCK_SLOTS,
  MOCK_INITIAL_BOOKING,
  MOCK_EVALUATION,
  MOCK_CHAT_MESSAGES,
} from '../data/mock-data';

const STORAGE_KEYS = {
  BOOKINGS: 'tentorkeun_bookings',
  CHATS: 'tentorkeun_chats',
  SLOTS: 'tentorkeun_slots',
  MATCHMAKING: 'tentorkeun_matchmaking',
};

function getLocalData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export const TentorService = {
  // --- TUTORS ---
  async getTutors(filter?: { subject?: string; mode?: string; search?: string }): Promise<Tutor[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('tutors').select('*');
        if (filter?.search) {
          query = query.ilike('name', `%${filter.search}%`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Tutor[];
        }
      } catch (err) {
        console.warn('Supabase fetch tutors failed, falling back to mock:', err);
      }
    }

    // Mock filtering
    let results = [...MOCK_TUTORS];
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.subjects.some((s) => s.toLowerCase().includes(q)) ||
          t.university.toLowerCase().includes(q)
      );
    }
    if (filter?.mode && filter.mode !== 'all') {
      results = results.filter((t) => t.modes.includes(filter.mode as 'tatap_muka' | 'online'));
    }
    return results;
  },

  async getTutorById(id: string): Promise<Tutor | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('tutors').select('*').eq('id', id).single();
        if (!error && data) return data as Tutor;
      } catch (err) {
        console.warn('Supabase fetch tutor by id failed:', err);
      }
    }
    return MOCK_TUTORS.find((t) => t.id === id) || null;
  },

  // --- SLOTS ---
  async getTutorSlots(tutorId: string): Promise<TutorSlot[]> {
    const localSlots = getLocalData<TutorSlot[]>(STORAGE_KEYS.SLOTS, MOCK_SLOTS);
    return localSlots.filter((s) => s.tutor_id === tutorId);
  },

  // --- BOOKINGS ---
  async createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'booking_code' | 'ticket_code' | 'qr_code' | 'expires_at'>): Promise<Booking> {
    const id = `order-tk-${Date.now().toString().slice(-6)}`;
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    const bookingCode = `TK-${randomCode}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const newBooking: Booking = {
      ...bookingData,
      id,
      booking_code: bookingCode,
      ticket_code: bookingCode,
      qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TENTORKEUN-${bookingCode}-VALIDATED`,
      created_at: now.toISOString(),
      expires_at: expiresAt,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bookings').insert(newBooking);
      } catch (err) {
        console.warn('Supabase insert booking failed, saved locally:', err);
      }
    }

    // Save locally
    const currentBookings = getLocalData<Booking[]>(STORAGE_KEYS.BOOKINGS, [MOCK_INITIAL_BOOKING]);
    setLocalData(STORAGE_KEYS.BOOKINGS, [newBooking, ...currentBookings]);

    return newBooking;
  },

  async getBookingById(id: string): Promise<Booking | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
        if (!error && data) return data as Booking;
      } catch (err) {
        console.warn('Supabase getBooking failed:', err);
      }
    }

    const currentBookings = getLocalData<Booking[]>(STORAGE_KEYS.BOOKINGS, [MOCK_INITIAL_BOOKING]);
    return currentBookings.find((b) => b.id === id || b.booking_code === id) || null;
  },

  async getAllBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Booking[];
      } catch (err) {
        console.warn('Supabase getAllBookings failed:', err);
      }
    }
    return getLocalData<Booking[]>(STORAGE_KEYS.BOOKINGS, [MOCK_INITIAL_BOOKING]);
  },

  async updatePaymentStatus(id: string, status: 'paid' | 'pending' | 'completed'): Promise<Booking | null> {
    const currentBookings = getLocalData<Booking[]>(STORAGE_KEYS.BOOKINGS, [MOCK_INITIAL_BOOKING]);
    const updated = currentBookings.map((b) => (b.id === id ? { ...b, payment_status: status } : b));
    setLocalData(STORAGE_KEYS.BOOKINGS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bookings').update({ payment_status: status }).eq('id', id);
      } catch (err) {
        console.warn('Supabase update status failed:', err);
      }
    }

    return updated.find((b) => b.id === id) || null;
  },

  // --- EVALUATION REPORT ---
  async getEvaluationByBookingId(bookingId: string): Promise<EvaluationReport | null> {
    return MOCK_EVALUATION;
  },

  // --- CHAT MESSAGES ---
  async getChatMessages(bookingId: string): Promise<ChatMessage[]> {
    const allChats = getLocalData<ChatMessage[]>(STORAGE_KEYS.CHATS, MOCK_CHAT_MESSAGES);
    return allChats.filter((c) => c.booking_id === bookingId);
  },

  async sendChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp' | 'is_read'>): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      is_read: true,
    };

    const allChats = getLocalData<ChatMessage[]>(STORAGE_KEYS.CHATS, MOCK_CHAT_MESSAGES);
    const updated = [...allChats, newMsg];
    setLocalData(STORAGE_KEYS.CHATS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('chat_messages').insert(newMsg);
      } catch (err) {
        console.warn('Supabase send chat failed:', err);
      }
    }

    return newMsg;
  },

  // --- AI MATCHMAKING ---
  async processMatchmaking(input: AiMatchmakingInput): Promise<{
    recommendedTutors: Tutor[];
    analysis: string;
    studentName: string;
  }> {
    // Score tutors based on subject match, learning style, and budget
    const scored = MOCK_TUTORS.map((t) => {
      let score = 80;
      if (input.learning_style && t.teaching_style.toLowerCase().includes(input.learning_style.toLowerCase().split(' ')[0])) {
        score += 12;
      }
      if (input.mode === 'keduanya' || t.modes.includes(input.mode as 'tatap_muka' | 'online')) {
        score += 5;
      }
      if (t.hourly_rate <= input.budget_max) {
        score += 3;
      }
      return {
        ...t,
        match_score: Math.min(score, 99),
      };
    }).sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

    const result = {
      recommendedTutors: scored.slice(0, 3),
      analysis: `Berdasarkan evaluasi AI terhadap gaya belajar "${input.learning_style}", kurikulum ${input.curriculum}, dan target belajar ${input.target_goal}, kami menemukan 3 tentor paling kompatibel yang memiliki rekam jejak terbukti dalam meningkatkan nilai siswa sejenis.`,
      studentName: input.student_name || 'Siswa',
    };

    // Store in localStorage
    setLocalData(STORAGE_KEYS.MATCHMAKING, result);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ai_matchmakings').insert({
          student_name: input.student_name,
          grade: input.grade,
          curriculum: input.curriculum,
          learning_style: input.learning_style,
          target_goal: input.target_goal,
          recommended_tutor_ids: scored.map((s) => s.id),
        });
      } catch (err) {
        console.warn('Supabase store matchmaking failed:', err);
      }
    }

    return result;
  },

  getLastMatchmakingResult() {
    return getLocalData(STORAGE_KEYS.MATCHMAKING, {
      recommendedTutors: MOCK_TUTORS.slice(0, 3),
      analysis:
        'Berdasarkan pemetaan AI, Arga memiliki karakter Visual & Analitis Terstruktur. Pola ini membutuhkan tentor yang mampu memvisualisasikan grafik kalkulus serta menyediakan ringkasan konsep sistematis.',
      studentName: 'Arga Pramudya',
    });
  },
};
