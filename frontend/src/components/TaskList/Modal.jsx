import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ children, onClose }) => {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <button style={closeButtonStyle} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '80%',
  maxWidth: '500px',
  position: 'relative',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
