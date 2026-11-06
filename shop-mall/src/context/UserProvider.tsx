import { useState } from "react"
import { UserContext } from "./UserContext"
import type {User, NewUser, LoginForm} from "../types/user"
import { initialUsers } from "../datas/users";

// UserProvider는 회원 저장소(repository) 역할
const UserProvider = ({children} : {children: React.ReactNode}) => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // 회원가입 함수
    const signup = (newUser: NewUser) => {
        // id는 유일해야 하므로 날짜와시간으로 자동 부여
        const user: User = {...newUser, id: Date.now()};
        setUsers([...users, user])
    }

    // 로그인 함수 (성공하면 true, 실패하면 false 반환)
    const login = (loginForm: LoginForm) => {
        const found = users.find(
            (user) => user.username === loginForm.username && user.password === loginForm.password
        );
        if(!found) return false;
        setCurrentUser(found);
        return true;
    }

    // 로그아웃 함수
    const logout = () => {
        setCurrentUser(null);
    }

    return(
        <UserContext.Provider value={{
            users, 
            currentUser, 
            signup, 
            login, 
            logout
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider