import React, { useEffect, useContext } from "react";
import ContactCard from "../components/ContactCard";
import { Context } from "../store";
import { Link } from "react-router-dom";

const Contacts = () => {
  const { store, dispatch } = useContext(Context);

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

        const resText = await resp.text();

        if (
          resp.ok ||
          (resp.status === 400 && resText.includes("already exists")) ||
          (resp.status === 500 && resText.includes("agenda already exists"))
        ) {
        }

        fetchContactsFromAPI();
      } catch (error) {
      }
    };

    ensureAgendaExists();
  }, [dispatch]);

  const fetchContactsFromAPI = async () => {
    try {
      const resp = await fetch(
        "https://playground.4geeks.com/contact/agendas/agenda_contactos/contacts"
      );

      if (!resp.ok) return;

      const data = await resp.json();

      dispatch({
        type: "SET_CONTACTS",
        payload: data.contacts
      });

      localStorage.setItem("local_contacts", JSON.stringify(data.contacts));
    } catch (error) {
    }
  };

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

            if (!resp.ok) continue;

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
            // Silenciado
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