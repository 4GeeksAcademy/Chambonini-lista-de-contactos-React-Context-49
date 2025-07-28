import React from "react";
import { useNavigate } from "react-router-dom";

const ContactCard = ({ contact, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded p-3 mb-3">
      <div className="d-flex align-items-center">
        {/* Foto */}
        <img
          src={
            contact.image ||
            `https://randomuser.me/api/portraits/men/${contact.id % 100}.jpg`
          }
          alt="Profile"
          className="rounded-circle me-3"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />

        {/* Info */}
        <div className="flex-grow-1">
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

        {/* Íconos */}
        <div className="d-flex align-items-start" style={{ marginLeft: "92px" }}>
          <i
            className="fas fa-pen text-secondary fs-5 me-5"
            role="button"
            onClick={() => navigate(`/edit/${contact.id}`)}
          ></i>
          <i
            className="fas fa-trash text-secondary fs-5"
            role="button"
            onClick={onDelete}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;