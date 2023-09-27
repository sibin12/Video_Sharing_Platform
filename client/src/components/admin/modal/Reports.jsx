import React from 'react';
import './ReportsModal.scss'

function ReportsModal({ isOpen, onClose, reports }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Reports</h2>
        <ul>
          {reports.map((report, index) => (
            <li key={index}>
              <strong>{report?.userName}:</strong> {report.text}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ReportsModal;
