import supabase from './supabaseClient';

// 위치 정보 저장
export const saveLocationToSupabase = async (locationData, userEmail) => {
  try {
    // 사용자 ID 가져오기
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
    
    if (!user) throw new Error('사용자를 찾을 수 없습니다');
    
    // 위치 정보 저장
    const { data, error } = await supabase
      .from('locations')
      .insert([
        {
          user_id: user.id,
          name: locationData.name,
          address: locationData.address,
          lat: locationData.lat,
          lng: locationData.lng,
        }
      ])
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase 위치 정보 저장 오류:', error);
    throw error;
  }
};

// 사용자의 저장된 위치 정보 가져오기
export const getUserLocations = async (userEmail) => {
  try {
    // 사용자 ID 가져오기
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
    
    if (!user) throw new Error('사용자를 찾을 수 없습니다');
    
    // 위치 정보 가져오기
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase 위치 정보 조회 오류:', error);
    return [];
  }
};

// 위치 정보 삭제
export const deleteLocation = async (locationId) => {
  try {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', locationId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Supabase 위치 정보 삭제 오류:', error);
    return false;
  }
};
