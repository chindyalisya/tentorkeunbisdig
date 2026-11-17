export interface Tutor {
  id: string;
  name: string;
  title: string;
  university: string;
  badge: string;
  bio: string;
  avatar_url: string;
  rating: number;
  reviews_count: number;
  hourly_rate: number;
  subjects: string[];
  levels: string[];
  modes: ('tatap_muka' | 'online')[];
  location: string;
  teaching_style: string;
  match_score?: number;
  highlight?: string;
  verified: boolean;
}

export interface TutorSlot {
  id: string;
  tutor_id: string;
  date: string;
  day_name: string;
  time_start: string;
  time_end: string;
  mode: 'tatap_muka' | 'online';
  is_booked: boolean;
}

export interface Booking {
  id: string;
  booking_code: string;
  tutor_id: string;
  tutor_name: string;
  tutor_avatar: string;
  tutor_title: string;
  subject: string;
  topic: string;
  package_type: '1_sesi' | '4_sesi' | '8_sesi';
  package_name: string;
  sessions_total: number;
  sessions_completed: number;
  mode: 'tatap_muka' | 'online';
  session_date: string;
  session_time: string;
  student_name: string;
  student_grade: string;
  student_address?: string;
  total_amount: number;
  discount_amount: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'completed' | 'cancelled';
  va_number: string;
  ticket_code: string;
  qr_code: string;
  created_at: string;
  expires_at: string;
}

export interface CompetencyScore {
  name: string;
  score: number;
  status: 'Paham Kuat' | 'Perlu Latihan' | 'Menengah' | 'Sangat Baik';
}

export interface EvaluationReport {
  id: string;
  booking_id: string;
  tutor_id: string;
  tutor_name: string;
  student_name: string;
  subject: string;
  topic: string;
  session_date: string;
  session_number: number;
  overall_score: number;
  competencies: CompetencyScore[];
  tutor_notes: string;
  recommendations: string[];
  homework_title: string;
  homework_file_url?: string;
  homework_status: 'pending' | 'submitted' | 'reviewed';
}

export interface ChatMessage {
  id: string;
  booking_id: string;
  sender_type: 'student' | 'tutor' | 'system';
  sender_name: string;
  text: string;
  file_name?: string;
  file_size?: string;
  file_type?: string;
  timestamp: string;
  is_read: boolean;
}

export interface AiMatchmakingInput {
  student_name: string;
  grade: string;
  curriculum: string;
  learning_style: string;
  target_goal: string;
  weak_topics: string[];
  preferred_gender?: string;
  budget_max: number;
  mode: 'tatap_muka' | 'online' | 'keduanya';
}

