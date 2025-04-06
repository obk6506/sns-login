import supabase from './supabaseClient';

// 구글 로그인 사용자 정보를 Supabase에 저장하는 함수
export const saveUserToSupabase = async (userData) => {
  try {
    // 이미 존재하는 사용자인지 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', userData.email)
      .single();
    
    if (existingUser) {
      // 사용자가 이미 존재하면 정보 업데이트
      const { data, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          picture: userData.picture,
        })
        .eq('email', userData.email)
        .select();
      
      if (error) throw error;
      return data;
    } else {
      // 새 사용자 생성
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
          }
        ])
        .select();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Supabase 사용자 저장 오류:', error);
    throw error;
  }
};

// 사용자 정보 가져오기
export const getUserFromSupabase = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase 사용자 조회 오류:', error);
    return null;
  }
};
