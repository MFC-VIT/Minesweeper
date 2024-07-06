// src/ToggleSwitch.js
import React, { useState } from 'react';
import './ToggleSwitch.css'; 

const ToggleSwitch = ({ isDay, onToggle }) => {


  return (
    <div className={`toggle-switch ${isDay ? 'day' : 'night'}`} onClick={onToggle}>
      <div className="toggle-thumb"></div>
    </div>
  );
};

export default ToggleSwitch;
