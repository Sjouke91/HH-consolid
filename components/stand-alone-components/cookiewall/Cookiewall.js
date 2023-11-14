'use client';
import { useEffect } from 'react';
import { useCookiewall } from '@direct-impact/difj-core';

export default function Cookiewall({ translate }) {
  const {
    handleSubmit,
    onClickHandler,
    showCustomPreferences,
    checkAll,
    onChangeHandler,
    set_showCustomPreferences,
    showCookiewall,
  } = useCookiewall();

  useEffect(() => {
    if (showCookiewall) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [showCookiewall]);

  return !showCookiewall ? null : (
    <section className="c-cookiewall__outer-wrapper outer-wrapper">
      <div className="c-cookiewall__inner-wrapper inner-wrapper">
        <h2 className="c-cookiewall__message-title">
          {translate('cookiewall', 'messageTitle')}
        </h2>
        <a
          href="/privacybeleid.pdf"
          target="_blank"
          className="c-cookiewall__privacy-link"
        >
          {translate('cookiewall', 'privacyLink')}
        </a>

        <form
          className={`c-cookiewall__form ${
            showCustomPreferences ? '--active' : ''
          }`}
          onSubmit={handleSubmit}
        >
          <div className="c-cookiewall__button-wrapper">
            <button
              className="c-cookiewall__button show-as-button primary secondary-color"
              name="onlyNecessary"
              value="onlyNecessary"
              onClick={onClickHandler}
            >
              {translate('cookiewall', 'buttonNecessaryCookies')}
            </button>
            <button
              className="c-cookiewall__button show-as-button primary secondary-color"
              name="acceptedSelection"
              value="acceptedSelection"
              onClick={(e) => {
                e.preventDefault();
                set_showCustomPreferences(!showCustomPreferences);
              }}
            >
              {showCustomPreferences
                ? translate('cookiewall', 'buttonHideSelection')
                : translate('cookiewall', 'buttonDisplaySelection')}
            </button>
            <button
              className="c-cookiewall__button accept-cookie primary"
              name="acceptedAll"
              value="acceptedAll"
              onClick={checkAll}
            >
              {translate('cookiewall', 'buttonAllowAll')}
            </button>
          </div>

          <div className="c-cookiewall__preferences">
            <div
              name="cookieForm"
              className={`c-cookiewall__cookie-consent-form ${
                showCustomPreferences ? 'form-active' : ''
              }`}
            >
              <div className="c-cookiewall__input-container">
                <>
                  <input
                    type="checkbox"
                    className="c-cookiewall__input"
                    disabled
                    checked
                    name="necessary"
                    id="necessary"
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="necessary">
                    <span className="c-cookiewall__input-checkmark" />
                    {translate('cookiewall', 'buttonAllowAll')}
                  </label>
                </>
                <>
                  <input
                    type="checkbox"
                    className="c-cookiewall__input"
                    name="statistics"
                    id="statistics"
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="statistics">
                    <span className="c-cookiewall__input-checkmark" />
                    {translate('cookiewall', 'checkboxStatistics')}
                  </label>
                </>
                <>
                  <input
                    type="checkbox"
                    className="c-cookiewall__input"
                    name="marketing"
                    id="marketing"
                    onChange={onChangeHandler}
                  />
                  <label htmlFor="marketing">
                    <span className="c-cookiewall__input-checkmark" />
                    {translate('cookiewall', 'checkboxMarketing')}
                  </label>
                </>
              </div>
            </div>
          </div>
          <button
            className={`c-cookiewall__button accept-options primary ${
              showCustomPreferences ? '--active' : ''
            }`}
            type="submit"
            name="acceptedSelection"
            value="acceptedSelection"
            onClick={onClickHandler}
          >
            {translate('cookiewall', 'buttonAllowSelection')}
          </button>
        </form>
      </div>
    </section>
  );
}
