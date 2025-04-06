import { createClient } from '@supabase/supabase-js';

// Supabase URL과 API 키는 환경 변수에서 가져옵니다.
// 실제 값은 .env 파일에 설정해야 합니다.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Supabase 클라이언트 인스턴스 생성
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
