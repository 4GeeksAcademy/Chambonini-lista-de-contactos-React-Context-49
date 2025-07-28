import React, { createContext, useReducer } from "react";

export const Context = createContext();

const initialStore = {
  contacts: []
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case "SET_CONTACTS":
      return { ...state, contacts: action.payload };
    case "ADD_CONTACT":
      return { ...state, contacts: [...state.contacts, action.payload] };
    case "EDIT_CONTACT":
      return {
        ...state,
        contacts: state.contacts.map((c) =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case "DELETE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.payload)
      };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, initialStore);

  const initializeAgenda = async () => {
    try {
      // Verificar si la agenda existe primero
      const check = await fetch("https://playground.4geeks.com/contact/agendas/agenda_contactos/contacts");
      if (check.status === 200) return; // Ya existe, salir sin error

      // Si no existe, intentar crearla
      await fetch("https://playground.4geeks.com/contact/agendas/agenda_contactos", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
    } catch (_) {
      // Silenciar errores completamente
    }
  };

  const loadContacts = async () => {
    try {
      const res = await fetch("https://playground.4geeks.com/contact/agendas/agenda_contactos/contacts");
      if (!res.ok) return;

      const data = await res.json();
      dispatch({ type: "SET_CONTACTS", payload: data });
    } catch (_) {
      // Silenciar errores
    }
  };

  const addContact = async (contact) => {
    try {
      const resp = await fetch(
        "https://playground.4geeks.com/contact/agendas/agenda_contactos/contacts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: contact.full_name,
            phone: contact.phone,
            email: contact.email,
            address: contact.address
          })
        }
      );

      if (!resp.ok) return;

      const data = await resp.json();
      dispatch({ type: "ADD_CONTACT", payload: data });
    } catch (_) {
      // Silenciar errores
    }
  };

  const deleteContact = async (id) => {
    try {
      const resp = await fetch(
        `https://playground.4geeks.com/contact/agendas/agenda_contactos/contacts/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!resp.ok) return;

      dispatch({ type: "DELETE_CONTACT", payload: id });
    } catch (_) {
      // Silenciar errores
    }
  };

  const editContact = async (contact) => {
    try {
      const resp = await fetch(
        `https://playground.4geeks.com/contact/agendas/agenda_contactos/contacts/${contact.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: contact.full_name,
            phone: contact.phone,
            email: contact.email,
            address: contact.address
          })
        }
      );

      if (!resp.ok) return;

      const data = await resp.json();
      dispatch({ type: "EDIT_CONTACT", payload: data });
    } catch (_) {
      // Silenciar errores
    }
  };

  const init = async () => {
    await initializeAgenda();
    await loadContacts();
  };

  return (
    <Context.Provider
      value={{
        store,
        dispatch,
        actions: {
          addContact,
          deleteContact,
          editContact,
          loadContacts,
          initializeAgenda,
          init
        }
      }}
    >
      {children}
    </Context.Provider>
  );
};