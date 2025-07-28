import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Context } from "../store";

const getRandomMaleImage = () => {
  const id = Math.floor(Math.random() * 99) + 1;
  return `https://randomuser.me/api/portraits/men/${id}.jpg`;
};

const AddContact = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    image: getRandomMaleImage()
  });

  useEffect(() => {
    if (isEdit) {
      const contact = store.contacts.find((c) => String(c.id) === id);
      if (contact) {
        setForm({
          ...contact,
          full_name: contact.full_name || contact.name || "", 
          image: contact.image || getRandomMaleImage()
        });
      }
    }
  }, [id, isEdit, store.contacts]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      actions.editContact(form);
    } else {
      actions.addContact(form);
    }

    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{isEdit ? "Edit Contact" : "Add Contact"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter full name"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter email"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter address"
            required
          />
        </div>
        <button className="btn btn-primary w-100">
          {isEdit ? "Update Contact" : "Save Contact"}
        </button>

        <div className="mt-3 text-center">
          <Link to="/">or get back to contacts</Link>
        </div>
      </form>
    </div>
  );
};

export default AddContact;