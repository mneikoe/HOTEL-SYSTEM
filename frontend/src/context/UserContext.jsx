import { createContext, useState } from "react";
import propTypes from "prop-types";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  return (
    <div>
      {" "}
      <UserDataContext.Provider value={{ user, setUser }}>
        {children}
      </UserDataContext.Provider>
    </div>
  );
};
UserContext.propTypes = {
  children: propTypes.node.isRequired,
};
export default UserContext;
