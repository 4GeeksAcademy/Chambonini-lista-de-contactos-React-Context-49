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
      const res = await fetch("https://playground.4geeks.com/contact/agendas/agenda_contactos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "agenda_contactos" }) // ✅ Este es el único cambio agregado
      });

      if (res.ok || res.status === 409) {
        console.log("Agenda creada o ya existía");
      } else {
        const error = await res.json();
        console.error("Error creando agenda:", error);
      }
    } catch (err) {
      console.error("Error de red al crear agenda:", err);
    }
  };

  const loadContacts = async () => {
    try {
      const res = await fetch("https://playground.4geeks.com/contact/agendas/agenda_contactos/contacts");
      if (!res.ok) throw new Error("Error al cargar contactos");

      const data = await res.json();
      dispatch({ type: "SET_CONTACTS", payload: data });
    } catch (error) {
      console.error("Error al cargar contactos:", error);
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

      if (!resp.ok) throw new Error("Error al agregar contacto");

      const data = await resp.json();
      dispatch({ type: "ADD_CONTACT", payload: data });
    } catch (error) {
      console.error("Error al agregar contacto:", error);
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

      if (!resp.ok) throw new Error("Error al eliminar contacto");

      dispatch({ type: "DELETE_CONTACT", payload: id });
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
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

      if (!resp.ok) throw new Error("Error al editar contacto");

      const data = await resp.json();
      dispatch({ type: "EDIT_CONTACT", payload: data });
    } catch (error) {
      console.error("Error al editar contacto:", error);
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
