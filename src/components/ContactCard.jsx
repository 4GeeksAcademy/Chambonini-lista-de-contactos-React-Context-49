import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store";

const ContactCard = ({ contact }) => {
  const navigate = useNavigate();
  const { actions } = useContext(Context);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      actions.deleteContact(contact.id);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center border rounded p-3 mb-3">
      <div className="d-flex align-items-center">
        <img
          src={contact.image || `https://randomuser.me/api/portraits/men/${contact.id % 100}.jpg`}
          alt="Profile"
          className="rounded-circle me-3"
          style={{ width: "70px", height: "70px", objectFit: "cover" }}
        />
        <div>
          <h5 className="mb-1">{contact.full_name || contact.name || "No name"}</h5>
          <p className="mb-1">
            <i className="fas fa-map-marker-alt me-2"></i>
            {contact.address}
          </p>
          <p className="mb-1">
            <i className="fas fa-phone me-2"></i>
            {contact.phone}
          </p>
          <p className="mb-0">
            <i className="fas fa-envelope me-2"></i>
            {contact.email}
          </p>
        </div>
      </div>
      <div>
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => navigate(`/edit/${contact.id}`)}
        >
          <i className="fas fa-pen"></i>
        </button>
        <button className="btn btn-outline-danger" onClick={handleDelete}>
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default ContactCard;