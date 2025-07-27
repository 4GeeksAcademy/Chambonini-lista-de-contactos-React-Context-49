import React, { useEffect, useContext } from "react";
import ContactCard from "../components/ContactCard";
import { Context } from "../store";
import { Link } from "react-router-dom";

const Contacts = () => {
  const { store, dispatch } = useContext(Context);

  // 1. Crear agenda automáticamente si no existe
  useEffect(() => {
    const ensureAgendaExists = async () => {
      try {
        const resp = await fetch(
          "https://playground.4geeks.com/contact/agendas/agenda_contactos",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (!resp.ok && resp.status !== 409) {
          // 409 = agenda ya existe, cualquier otro error es relevante
          throw new Error("No se pudo crear la agenda");
        }

        // Una vez creada (o si ya existe), llamar al GET
        fetchContactsFromAPI();
      } catch (error) {
        console.error("Error al crear agenda:", error);
      }
    };

    ensureAgendaExists();
  }, [dispatch]);

  // 2. Obtener contactos de la API
  const fetchContactsFromAPI = async () => {
    try {
      const resp = await fetch(
        "https://playground.4geeks.com/contact/agendas/agenda_contactos/contacts"
      );

      if (!resp.ok) throw new Error("Error al obtener contactos desde la API");

      const data = await resp.json();

      dispatch({
        type: "SET_CONTACTS",
        payload: data.contacts
      });

      localStorage.setItem("local_contacts", JSON.stringify(data.contacts));
    } catch (error) {
      console.error("Error al cargar contactos desde la API:", error);
    }
  };

  // 3. Sincronizar contactos locales con la API si tienen ID local
  useEffect(() => {
    const syncNewContacts = async () => {
      const localStorageKey = "local_contacts";
      let localContacts = JSON.parse(localStorage.getItem(localStorageKey)) || [];

      for (const contact of store.contacts) {
        const isLocalOnly = typeof contact.id !== "number" || String(contact.id).length >= 13;

        if (isLocalOnly) {
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

            if (!resp.ok) throw new Error("Error al subir contacto");

            const data = await resp.json();

            const updatedContacts = store.contacts.map((c) =>
              c.id === contact.id ? data : c
            );

            dispatch({
              type: "SET_CONTACTS",
              payload: updatedContacts
            });

            localContacts = localContacts.map((c) =>
              c.id === contact.id ? data : c
            );
            localStorage.setItem(localStorageKey, JSON.stringify(localContacts));
          } catch (error) {
            console.error("Error al sincronizar contacto:", error);
          }
        }
      }
    };

    syncNewContacts();
  }, [store.contacts, dispatch]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Contact List</h1>
        <Link to="/add-contact" className="btn btn-success">
          Add new contact
        </Link>
      </div>
      {store.contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
};

export default Contacts;