'use server';
import { transformDataURIToBlob } from '@direct-impact/difj-core';

export async function submitApplicationForm({ formData, job, token }) {
  const newFormData = new FormData();

  Object.entries(formData).forEach((item) => {
    newFormData.append(item[0], item[1]);
  });

  //tracking ga4
  const googleCID =
    window && window.ga && window.ga.getAll()
      ? window.ga.getAll()[0].get('clientId')
      : false;

  newFormData.append('googleCID', googleCID);
  newFormData.append('jobPublicationId', job.publicationId);
  newFormData.append('jobTitle', job.title);
  newFormData.append('jobIndustry', job.industry);
  newFormData.append('recruiterName', job.recruiter.fullName);
  newFormData.append('recruiterEmail', job.recruiter.email);
  //todo add env var for clientName
  newFormData.append('clientName', 'FixedToday');

  //todo use this type -> supplier/werknemer
  // if (type) {
  //   newFormData.append('category', type);
  // }

  //todo fix cv upload with correct data structure..
  const cv = newFormData.get('cv');

  if (cv) {
    const newCv = JSON.parse(cv.FileList);
    newFormData.delete('cv');
    newFormData.set(
      'cv',
      transformDataURIToBlob(newCv.file, newCv.name, newCv.type),
    );
  }

  fetch('/api/post-application-form', {
    method: 'POST',
    body: newFormData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'success') {
        return;
        // return router.push(hrefSuccess, undefined, { shallow: true });
      } else {
        throw new Error('status is not success');
      }
    })
    .catch((error) => {
      return;
      // return router.push(hrefError, undefined, { shallow: true });
    });
}
