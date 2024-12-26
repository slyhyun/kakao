import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GrLogout } from "react-icons/gr";
import { BiSolidCameraMovie } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import Menu from "./Menu";
import styled from "styled-components";
import toast from "react-hot-toast";

// ✅ Styled Components
const HeaderWrapper = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    background-color: ${(props) => (props.isHovered || props.isScrolled ? "#000" : "transparent")};
    color: #fff;
    transition: background-color 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;

    .movie-icon {
        font-size: 24px;
        margin-right: 10px;
    }

    .logo-text {
        font-size: 20px;
        font-weight: bold;
    }

    &:hover {
        color: #946efd;
    }
`;

const Nav = styled.nav`
    display: flex;
    gap: 20px;

    p {
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;

        &:hover {
            color: #946efd;
        }
    }
`;

const NavItem = styled.p`
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    color: ${(props) => (props.active ? "#946efd" : "inherit")};

    &:hover {
        color: #946efd;
    }
`;

const UserActions = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    margin-right: 50px;
`;

const LogoutButton = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    color: white;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
        color: red;
    }

    span {
        margin-left: 5px;
        font-size: 14px;
    }
`;

const UsernameDisplay = styled.span`
    color: white;
    font-size: 16px;
    margin-right: 10px;
    transition: color 0.3s;

    &:hover {
        color: #946efd;
    }
`;

const HamburgerIcon = styled(GiHamburgerMenu)`
    font-size: 24px;
    cursor: pointer;
    position: fixed;
    right: 20px;
    top: 25px;
    transition: color 0.3s;

    &:hover {
        color: #946efd;
    }
`;

const Header = () => {
    const [username, setUsername] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // ✅ 사용자 이름 설정 (로컬 스토리지에서 가져오기)
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

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // ✅ 카카오 로그아웃
    const handleLogout = () => {
        if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout(() => {
                toast.success("카카오 로그아웃 완료");
                localStorage.clear();
                setUsername("");
                navigate("/signin");
            });
        } else {
            localStorage.clear();
            setUsername("");
            navigate("/signin");
        }
    };

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const navigateTo = (path) => {
        navigate(path);
        closeMenu();
    };

    return (
        <HeaderWrapper
            isScrolled={isScrolled}
            isHovered={isHovered}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Logo onClick={() => navigateTo("/")}>
                <BiSolidCameraMovie className="movie-icon" />
                <h1 className="logo-text">kakao</h1>
            </Logo>

            {!isMobile && (
                <Nav>
                    <NavItem onClick={() => navigateTo("/")} active={location.pathname === "/"}>
                        홈
                    </NavItem>
                    <NavItem onClick={() => navigateTo("/popular")} active={location.pathname === "/popular"}>
                        인기
                    </NavItem>
                    <NavItem onClick={() => navigateTo("/search")} active={location.pathname === "/search"}>
                        찾기
                    </NavItem>
                    <NavItem onClick={() => navigateTo("/wishlist")} active={location.pathname === "/wishlist"}>
                        위시리스트
                    </NavItem>
                </Nav>
            )}

            {!isMobile && (
                <UserActions>
                    {username && <UsernameDisplay>{username}님</UsernameDisplay>}
                    <LogoutButton onClick={handleLogout}>
                        <GrLogout />
                        <span>로그아웃</span>
                    </LogoutButton>
                </UserActions>
            )}

            {isMobile && <HamburgerIcon onClick={toggleMenu} />}

            {isMobile && (
                <Menu isOpen={isOpen} handleLogout={handleLogout} onClose={closeMenu} />
            )}
        </HeaderWrapper>
    );
};

export default Header;
