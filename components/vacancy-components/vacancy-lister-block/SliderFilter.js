import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Link from 'next/link';

function SliderFilter({ slider, translate, trackFilterActivation }) {
  const [isOpen, setIsOpen] = useState(true);
  const [minHours, setMinHours] = useState(0);
  const [maxHours, setMaxHours] = useState(40);
  const [isChanged, setIsChanged] = useState(false);

  return (
    <div
      className={`c-filter-group c-filter-group__wrapper ${
        isOpen ? `c-filter-group__wrapper--is-open` : ''
      }`}
    >
      <h3 className="c-filter-group__title" onClick={() => setIsOpen(!isOpen)}>
        {/* TODO: Translate this */}
        {translate('vacancyListerBlock', 'hoursPerWeek')}
      </h3>
      <div className="c-filter-group__list c-slider-filter__wrapper">
        <p className="c-slider-filter__label">
          {minHours
            ? `Min ${minHours} ${translate('vacancyListerBlock', 'hour')} - `
            : ''}
          {`Max ${maxHours} ${translate('vacancyListerBlock', 'hour')}`}
        </p>
        <div className="c-slider-filter__slider">
          <Slider
            range
            allowCross={false}
            defaultValue={[slider.currentValueMin, slider.currentValueMax]}
            onChange={(e) => {
              setMinHours(e[0]);
              setMaxHours(e[1]);
              setIsChanged(true);
            }}
            min={0}
            max={40}
            step={1}
            railStyle={{
              height: '13px',
              backgroundColor: 'var(--c-primary)',
            }}
            handleStyle={{
              height: '25px',
              width: '27px',
              background: 'var(--c-secondary)',
              borderRadius: '12px',
              border: 'none',
              opacity: '1',
            }}
            trackStyle={[
              {
                backgroundColor: 'var(--c-quaternary)',
                top: '8px',
                borderTop: '2px solid white',
                height: '7px',
              },
            ]}
          />

          <Link
            href={`${slider.getUrl}&min_${slider.urlKey}=${minHours}&max_${slider.urlKey}=${maxHours}`}
            className={`c-slider-filter__button show-as-button primary ${
              isChanged ? '' : 'c-slider-filter__button--disabled'
            }`}
            scroll={false}
            onClick={() => {
              trackFilterActivation({
                filterName: 'Hours per week',
                filterValue: `min: ${minHours}hr(s) - max: ${maxHours}hr(s)`,
              });
              return true;
            }}
          >
            {/* TODO: Translate this */}
            {translate('vacancyListerBlock', 'applyFilter')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SliderFilter;
