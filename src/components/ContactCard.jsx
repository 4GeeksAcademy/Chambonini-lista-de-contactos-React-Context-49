import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store";

const ContactCard = ({ contact }) => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      actions.deleteContact(contact.id);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${contact.id}`);
  };

  // Generar imagen si no existe
  const randomSeed = contact.id || contact.email || Date.now();
  const imageUrl =
    contact.image ||
    `https://randomuser.me/api/portraits/men/${Math.abs(randomSeed % 100)}.jpg`;

  return (
    <div
      className="card d-flex flex-row align-items-center justify-content-between p-3 mb-3"
      style={{ borderRadius: "10px" }}
    >
      <div className="d-flex align-items-center w-100">
        <img
          src={imageUrl}
          className="rounded-circle me-3"
          alt="contact"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
        <div className="flex-grow-1">
          <h5 className="mb-1">{contact.full_name}</h5>
          <p className="mb-0"><i className="fas fa-map-marker-alt me-2"></i>{contact.address}</p>
          <p className="mb-0"><i className="fas fa-phone me-2"></i>{contact.phone}</p>
          <p className="mb-0"><i className="fas fa-envelope me-2"></i>{contact.email}</p>
        </div>
        <div className="d-flex flex-column align-items-end ms-3">
          <button className="btn btn-outline-primary mb-2" onClick={handleEdit}>
            <i className="fas fa-pen"></i>
          </button>
          <button className="btn btn-outline-danger" onClick={handleDelete}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;