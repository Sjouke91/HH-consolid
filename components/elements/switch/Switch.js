import { useState } from 'react';

/**
 * @typedef {Object} Switch - props object
 * @property {boolean} isToggled - Toggle state boolean prop
 * @property {number} handleToggle - Toggle state updater prop
 */

/**
 *
 * @param {Switch}
 * @returns
 */
function Switch({ isToggled, handleToggle }) {
  return (
    <div className="c-switch__wrapper" onClick={handleToggle}>
      <span className={`c-switch__checkbox ${isToggled ? 'checked' : ''}`} />
      <span className={`c-switch__slider ${isToggled ? 'checked' : ''}`}></span>
    </div>
  );
}

export { Switch };
