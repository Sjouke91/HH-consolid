import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import Image from 'next/image';

export default function RecruiterBlock({
  blok,
  jobData,
  recruiterProfilesArray,
  carouselBlok
}) {
  if (!blok) throw new Error('no recruiter blok filled');
  let recruiterProfile;
  let recruiter;

  //check if carousel recruiter blok exists
  if(carouselBlok){
    recruiterProfile = carouselBlok
    recruiter = carouselBlok
  } else{
   recruiterProfile = blok;
   recruiter = jobData && jobData?.recruiter;
  }

  if (
    recruiter?.email &&
    recruiterProfilesArray?.length &&
    recruiterProfilesArray?.find((profile) => profile.email === recruiter?.email)
  ) {
    recruiterProfile = recruiterProfilesArray.find(
      (profile) => profile.email === recruiter?.email,
    );
  }

  const {
    title,
    subtitle,
    name,
    role,
    email,
    phoneNumber,
    facebook,
    linkedin,
    twitter,
    image,
    background,
    button,
  } = recruiterProfile;

  const inCarousel = !carouselBlok ? true : false;

  return (
    <div
      className={`c-recruiter-block__outer-wrapper outer-wrapper`}
      {...storyblokEditable(blok)}
    >
      <div className="c-recruiter-block__inner-wrapper inner-wrapper">
        {image?.filename ? (
          <div className="c-recruiter-block__image-container">
            <Image
              className="c-recruiter-block__image"
              src={image.filename}
              alt={image.alt ?? 'testimonial image'}
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: 'auto',
                maxWidth: 'auto',
                height: 'auto',
              }}
            />
          </div>
        ) : null}
        <div className={`c-recruiter-block__text-container`}>
          {/* render title and subtitle if recruiter block not in carousel */}
          {!inCarousel ? (
            <div className="c-recruiter-block__title-container">
            {title ? (
              <h3 className="c-recruiter-block__title">{title}</h3>
            ) : null}
            {subtitle ? (
              <h3 className="c-recruiter-block__subtitle">{subtitle}</h3>
            ) : null}
          </div>
          ) : null}
          <div className="c-recruiter-block__title-container">
            {name ? <h3 className="c-recruiter-block__name">{name}</h3> : null}
            {role ? <p className="c-recruiter-block__role">{role}</p> : null}
          </div>

          <div className="c-recruiter-block__title-container">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="c-recruiter-block__contact-link email"
              >
                {email}
              </a>
            ) : null}
            {phoneNumber ? (
              <a
                href={`tel:${phoneNumber}`}
                className="c-recruiter-block__contact-link phone"
              >
                {phoneNumber}
              </a>
            ) : null}
          </div>
          {!inCarousel && button?.length
            ? button.map((nestedBlok) => (
                <StoryblokComponent
                  blok={nestedBlok}
                  test="true"
                  key={nestedBlok._uid}
                  href={`tel:${phoneNumber}`}
                  className="c-recruiter-block__button"
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
