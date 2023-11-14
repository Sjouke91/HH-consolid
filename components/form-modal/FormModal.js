import icons from 'public/icons';

export default function FormModal({ title, message, onClose }) {
  return (
    <div className="c-form-modal__outer-wrapper">
      <div className="c-form-modal__content">
        <h2>{title}</h2>
        <p>{message}</p>

        <div
          onClick={onClose}
          className="c-form-modal__close-button"
          dangerouslySetInnerHTML={{
            __html: icons.close,
          }}
        ></div>
      </div>
    </div>
  );
}
