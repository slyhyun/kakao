import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BiSolidCameraMovie } from "react-icons/bi";
import { GrLogout } from "react-icons/gr";
import toast from "react-hot-toast";

// ✅ Styled Components
const MenuWrapper = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background-color: #000;
    color: #fff;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    transform: ${(props) => (props.isOpen ? "translateX(0)" : "translateX(100%)")};
    transition: transform 0.3s ease-in-out;
`;

const CloseButton = styled.button`
    align-self: flex-end;
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: #946efd;
    }
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    cursor: pointer;
    transition: color 0.3s;

    .movie-icon {
        font-size: 36px;
        margin-right: 10px;
    }

    .logo-text {
        font-size: 24px;
        font-weight: bold;
        line-height: 1;
    }

    &:hover {
        color: #946efd;
    }
`;

const MenuList = styled.ul`
    list-style: none;
    padding: 0;
    width: 100%;
`;

const MenuItem = styled.li`
    font-size: 18px;
    margin: 20px 0;
    text-align: center;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: #946efd;
    }
`;

const LogoutButton = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
    cursor: pointer;
    color: white;
    transition: color 0.3s;

    &:hover {
        color: red;
    }

    span {
        margin-left: 8px;
        font-size: 16px;
    }
`;

const UsernameDisplay = styled.span`
    color: white;
    font-size: 16px;
    margin-top: 40px;
    transition: color 0.3s;

    &:hover {
        color: #946efd;
    }
`;

const Menu = ({ handleLogout, onClose, isOpen }) => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ 사용자 이름 설정
        const kakaoUserName = localStorage.getItem("kakaoUserName");
        if (kakaoUserName) {
            setUsername(kakaoUserName);
        } else {
            const storedUsername = localStorage.getItem("username");
            if (storedUsername) {
                const name = storedUsername.split("@")[0];
                setUsername(name);
            }
        }
    }, []);

    // ✅ 카카오 로그아웃
    const handleKakaoLogout = () => {
        if (window.Kakao && window.Kakao.Auth) {
            if (window.Kakao.Auth.getAccessToken()) {
                // ✅ 카카오 로그아웃
                window.Kakao.Auth.logout(() => {
                    toast.success("카카오 로그아웃 완료");
                    
                    // ✅ searchHistory와 wishlist 유지
                    const searchHistory = localStorage.getItem("searchHistory");
                    const wishlist = localStorage.getItem("wishlist");
    
                    localStorage.clear(); // 전체 초기화
                    
                    // ✅ 유지할 항목 다시 저장
                    if (searchHistory) {
                        localStorage.setItem("searchHistory", searchHistory);
                    }
                    if (wishlist) {
                        localStorage.setItem("wishlist", wishlist);
                    }
    
                    setUsername(""); // 사용자 이름 상태 초기화
                    navigate("/signin"); // 로그인 페이지로 이동
                });
            } else {
                toast.info("이미 로그아웃 상태입니다.");
    
                // ✅ searchHistory와 wishlist 유지
                const searchHistory = localStorage.getItem("searchHistory");
                const wishlist = localStorage.getItem("wishlist");
    
                localStorage.clear(); // 전체 초기화
    
                if (searchHistory) {
                    localStorage.setItem("searchHistory", searchHistory);
                }
                if (wishlist) {
                    localStorage.setItem("wishlist", wishlist);
                }
    
                setUsername(""); // 사용자 이름 상태 초기화
                navigate("/signin"); // 로그인 페이지로 이동
            }
        } else {
            toast.error("Kakao SDK가 초기화되지 않았습니다.");
    
            // ✅ searchHistory와 wishlist 유지
            const searchHistory = localStorage.getItem("searchHistory");
            const wishlist = localStorage.getItem("wishlist");
    
            localStorage.clear(); // 전체 초기화
    
            if (searchHistory) {
                localStorage.setItem("searchHistory", searchHistory);
            }
            if (wishlist) {
                localStorage.setItem("wishlist", wishlist);
            }
    
            setUsername(""); // 사용자 이름 상태 초기화
            navigate("/signin"); // 로그인 페이지로 이동
        }
    };
    

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <MenuWrapper isOpen={isOpen}>
            <CloseButton onClick={onClose}>✖</CloseButton>
            <Logo onClick={() => handleNavigation("/")}>
                <BiSolidCameraMovie className="movie-icon" />
                <h1 className="logo-text">kakao</h1>
            </Logo>
            <MenuList>
                <MenuItem onClick={() => handleNavigation("/")}>홈</MenuItem>
                <MenuItem onClick={() => handleNavigation("/popular")}>
                    인기
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/search")}>
                    찾기
                </MenuItem>
                <MenuItem onClick={() => handleNavigation("/wishlist")}>
                    위시리스트
                </MenuItem>
            </MenuList>
            {username && <UsernameDisplay>{username}님</UsernameDisplay>}
            <LogoutButton onClick={handleKakaoLogout}>
                <GrLogout />
                <span>로그아웃</span>
            </LogoutButton>
        </MenuWrapper>
    );
};

export default Menu;
