import Link from 'next/link';
import icons from 'public/icons';

// todo translate stuff
import rewriteSlug from 'utils/rewriteSlug';
import { sortSpecArray } from 'utils/specSorter';

function VacancyGridCard({ vacancy, translate }) {
  const { title, publicationId, specs, intro, vacancyUrl, impressionString } =
    vacancy;
  const dateNow = new Date();
  const datePublished = new Date(vacancy?.publishedAt);
  // To calculate the time difference of two dates
  var Difference_In_Time = dateNow - datePublished;

  // To calculate the no. of days between two dates
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  let badgeArray = [];

  if (Difference_In_Days && Difference_In_Days < 3) {
    badgeArray = [
      {
        type: 'new',
        value: translate('vacancyListerBlock', 'badgeNew'),
      },
    ];
  }

  const specArray = specs
    ? Object.entries(specs).map(([name, value]) => {
        const icon = icons[name];
        const label = translate('vacancyListerBlock', name);
        return { name: name, value: value, icon: icon, label: label };
      })
    : null;

  const workplaceType = vacancy?.workplaceType;
  //TODO - Replace sample intro with intro coming from job
  const sampleIntro =
    'As a test engineer you are responsible for the preparation and execution of tests of the delivered functionality and the preparation of the associated documentation such as test plans and reporting on the test results.';

  const exclusions = ['workplaceType'];
  const sortedSpecs = sortSpecArray({ specArray, exclusions });
  return (
    <Link
      className="c-vacancy-grid-card c-vacancy-grid-card__wrapper"
      href={`${rewriteSlug(vacancyUrl)}`}
      data-attribute={`${impressionString}`}
    >
      <div className="c-vacancy-grid-card__header">
        <div className="c-vacancy-grid-card__header--left">
          <div className="c-vacancy-grid-card__badge-container">
            {badgeArray.map((badge) => {
              return (
                <div
                  className={`c-vacancy-grid-card__badge--${badge.type}`}
                  key={badge.value}
                >
                  {badge.value}
                </div>
              );
            })}
          </div>
          {workplaceType && (
            <h5 className="c-vacancy-grid-card__worktype">
              {translate('vacancyListerBlock', 'workType')} {workplaceType}
            </h5>
          )}
          {title && <h3 className="c-vacancy-grid-card__title">{title}</h3>}
        </div>
        <div className="c-vacancy-grid-card__header--right">
          {publicationId && (
            <div className="c-vacancy-grid-card__id">{publicationId}</div>
          )}
        </div>
      </div>
      {sortedSpecs?.length && (
        <div className="c-vacancy-grid-card__usp-container">
          {sortedSpecs
            .filter(({ name }) => name !== 'freelancer' && name !== 'fachmann')
            .map(({ value, icon, label }, i) => {
              return (
                <div className={`c-vacancy-grid-card__usp`} key={i}>
                  <div className="c-vacancy-grid-card__usp-label">
                    <div dangerouslySetInnerHTML={{ __html: icon }} />
                    <h5>{label}</h5>
                  </div>
                  <h5>{value}</h5>
                </div>
              );
            })}
        </div>
      )}
      {/* {intro && (
        <div className="c-vacancy-grid-card__description">
          <div dangerouslySetInnerHTML={{ __html: intro }} />
        </div>
      )} */}
      {/* TODO - Delete description below & uncomment above once job.intro contains content  */}
      <div className="c-vacancy-grid-card__description">
        <div dangerouslySetInnerHTML={{ __html: sampleIntro }} />
      </div>

      <div className="c-vacancy-grid-card__footer">
        <Link
          href={rewriteSlug(`${vacancyUrl}/application`)}
          className="c-vacancy-grid-card__apply-btn link"
        >
          {translate('vacancyListerBlock', 'jobCardApply')}
        </Link>
        <button className="link">
          {translate('vacancyListerBlock', 'jobCardCTA')}
        </button>
      </div>
    </Link>
  );
}

export default VacancyGridCard;
