import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// JavaScript 키 환경 변수에서 가져오기
const KAKAO_JS_KEY = process.env.REACT_APP_KAKAO_KEY;

// ✅ Kakao SDK 초기화
const initializeKakao = () => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_JS_KEY);
    console.log('✅ Kakao SDK Initialized:', KAKAO_JS_KEY);
  }
};

// ✅ Kakao 로그인
const handleKakaoLogin = () => {
  if (!window.Kakao) {
    toast.error('카카오 SDK가 로드되지 않았습니다.');
    return;
  }

  window.Kakao.Auth.login({
    success: (authObj) => {
      console.log('🔑 로그인 성공:', authObj);
      fetchKakaoUserInfo();
    },
    fail: (err) => {
      console.error('❌ 로그인 실패:', err);
      toast.error('카카오 로그인에 실패했습니다.');
    },
  });
};

// ✅ 사용자 정보 조회
const fetchKakaoUserInfo = () => {
  window.Kakao.API.request({
    url: '/v2/user/me',
    success: (res) => {
      console.log('👤 사용자 정보:', res);

      const { id, properties, kakao_account } = res;
      const profileName = properties?.nickname || '이름 없음';
      const profileEmail = kakao_account?.email || '이메일 없음';

      // 사용자 정보 저장
      localStorage.setItem('kakaoUserID', id);
      localStorage.setItem('kakaoUserName', profileName);
      localStorage.setItem('kakaoUserEmail', profileEmail);
      localStorage.setItem('isLogin', 'true');

      toast.success(`${profileName}님, 환영합니다!`);
      window.location.href = '/kakao'; // ✅ 로그인 성공 후 /kakao로 이동
    },
    fail: (error) => {
      console.error('❌ 사용자 정보 조회 실패:', error);
      toast.error('사용자 정보를 가져오지 못했습니다.');
    },
  });
};

const Signin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    initializeKakao();
    const isLoggedIn = localStorage.getItem('isLogin') === 'true';
    if (isLoggedIn) {
      const name = localStorage.getItem('kakaoUserName');
      toast.success(`${name}님, 다시 오신 것을 환영합니다!`);
      navigate('/kakao'); // ✅ 로그인 상태라면 /kakao로 이동
    }
  }, [navigate]);

  return (
    <Wrapper>
      <Toaster />
      <Container>
        <h2 style={{ color: '#fff' }}>카카오 로그인</h2>
        <Button onClick={handleKakaoLogin}>카카오로 로그인</Button>
      </Container>
    </Wrapper>
  );
};

// Styled Components
const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0d1117;
`;

const Container = styled.div`
  width: 400px;
  min-height: 300px;
  background: #161b22;
  border-radius: 10px;
  text-align: center;
  padding: 24px;
`;

const Button = styled.button`
  background: #f7e600;
  color: #3c1e1e;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 16px;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background: #f9de4a;
  }
`;

export default Signin;
