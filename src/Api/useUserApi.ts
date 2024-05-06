import { User } from "Api/Types/User";
import { useResourceAPI } from "./Base/useResourceAPI";

export const useUserApi = () => useResourceAPI<User>('User');