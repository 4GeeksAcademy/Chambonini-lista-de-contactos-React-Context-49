import React, { useEffect, useContext } from "react";
import ContactCard from "../components/ContactCard";
import { Context } from "../store";
import { Link } from "react-router-dom";

const Contacts = () => {
  const { store, dispatch } = useContext(Context);

  // Cargar contactos desde la API
  const fetchContactsFromAPI = async () => {
    try {
      const resp = await fetch("https://playground.4geeks.com/contact/agendas/agenda_contactos/contacts");

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

  // Subir contactos locales que aún no están en la API
  const syncNewContacts = async () => {
    const localContacts = JSON.parse(localStorage.getItem("local_contacts")) || [];

    for (const contact of localContacts) {
      const isLocalOnly = !contact.id || String(contact.id).length >= 13;

      if (isLocalOnly) {
        try {
          const resp = await fetch("https://playground.4geeks.com/contact/agendas/agenda_contactos/contacts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              full_name: contact.full_name,
              email: contact.email,
              phone: contact.phone,
              address: contact.address,
              agenda_slug: "agenda_contactos"
            })
          });

          if (!resp.ok) throw new Error("Error al subir contacto");

          // El contacto ya fue subido, eliminamos el local duplicado
          const newLocalContacts = localContacts.filter(c => c.id !== contact.id);
          localStorage.setItem("local_contacts", JSON.stringify(newLocalContacts));

          // Vuelve a cargar desde la API
          await fetchContactsFromAPI();
        } catch (error) {
          console.error("Error al sincronizar contacto:", error);
        }
      }
    }
  };

  useEffect(() => {
    fetchContactsFromAPI();
  }, []);

  useEffect(() => {
    syncNewContacts();
  }, [store.contacts]);

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