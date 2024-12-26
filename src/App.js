import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "./approutes/AppRoutes";

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ 로그인 상태 확인
        const isLoggedIn = localStorage.getItem('isLogin') === 'true';
        if (!isLoggedIn) {
            navigate('/signin'); // 로그인 상태가 아니면 /signin으로 이동
        }

        // ✅ 카카오 사용자 정보 출력
        const printKakaoUserInfo = () => {
            const id = localStorage.getItem('kakaoUserID') || 'ID 없음';
            const name = localStorage.getItem('kakaoUserName') || '이름 없음';
            const email = localStorage.getItem('kakaoUserEmail') || '이메일 없음';
            const profileImage = localStorage.getItem('kakaoUserProfileImage') || '프로필 이미지 없음';
            const ageRange = localStorage.getItem('kakaoUserAgeRange') || '연령 정보 없음';

            console.log('👤 카카오 사용자 정보:');
            console.log('🆔 ID:', id);
            console.log('👤 이름:', name);
            console.log('📧 이메일:', email);
            console.log('🖼️ 프로필 이미지:', profileImage);
            console.log('🎂 연령대:', ageRange);
        };

        printKakaoUserInfo(); // 사용자 정보 콘솔 출력
    }, [navigate]);

    return (
        <>
            <AppRoutes />
        </>
    );
};

export default App;
