import {
  User,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useLocalStorage } from "./useLocalStorage";
import Login from "../pages/login/Login";

type LoginDetails = {
  username: string;
  password: string;
};

type useAuthReturnType = {
  user: User | null;
  login: (loginDetails: LoginDetails) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: async (_loginDetails) => {
    throw new Error("not in context");
  },
  logout: async () => {
    throw new Error("not in context");
  },
} as useAuthReturnType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage("user", null);

  useEffect(() => {
    onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(loggedInUser);
      } else {
        setUser(null);
        console.log("user is logged out");
      }
    });
  }, [setUser]);

  const value = useMemo((): useAuthReturnType => {
    const login = async ({
      username,
      password,
    }: LoginDetails): Promise<void> => {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, username, password)
        .then((user) => {
          console.log("logged in!");
          setUser(user);
          navigate("/");
        })
        .catch((error) => {
          throw new Error(error.message || error);
        });
    };

    const logout = async () => {
      signOut(auth)
        .then(() => {
          navigate("/");
          console.log("signed out");
        })
        .catch((error: Error) => {
          console.log(error);
        });
      setUser(null);
      navigate("/", { replace: true });
    };
    return {
      user,
      login,
      logout,
    };
  }, [navigate, setUser, user]);

  if (!user) {
    // user is not authenticated
    return (
      <AuthContext.Provider value={value}>
        <Login />
      </AuthContext.Provider>
    );
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
