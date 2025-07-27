import React, { createContext, useContext, useReducer } from "react";

const Context = createContext();

const initialState = {
  contacts: []
};

function reducer(state, action) {
  switch (action.type) {
    case "set_contacts":
      return { ...state, contacts: action.payload };
    default:
      return state;
  }
}

export const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ store, dispatch }}>
      {children}
    </Context.Provider>
  );
};

const useGlobalReducer = () => useContext(Context);
export default useGlobalReducer;