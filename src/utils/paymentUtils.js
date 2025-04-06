import supabase from './supabaseClient';

// 결제 정보 저장
export const savePaymentToSupabase = async (paymentData, userEmail) => {
  try {
    // 사용자 ID 가져오기
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
    
    if (!user) throw new Error('사용자를 찾을 수 없습니다');
    
    // 결제 정보 저장
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          user_id: user.id,
          amount: paymentData.amount,
          card_info: paymentData.cardInfo,
          status: 'completed',
        }
      ])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase 결제 정보 저장 오류:', error);
    throw error;
  }
};

// 사용자의 결제 내역 가져오기
export const getUserPayments = async (userEmail) => {
  try {
    // 사용자 ID 가져오기
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
    
    if (!user) throw new Error('사용자를 찾을 수 없습니다');
    
    // 결제 내역 가져오기
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase 결제 내역 조회 오류:', error);
    return [];
  }
};
