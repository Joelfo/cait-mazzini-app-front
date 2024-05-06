import { createContext } from "react";
import { User } from "Api/Types/User";

export const UserContext = createContext<User | undefined>(undefined)