// Based on https://stackoverflow.com/questions/34495796/javascript-promises-with-filereader
// See documentation of file readers and file list, they are weird and a javascript primitive.
// https://developer.mozilla.org/en-US/docs/Web/API/FileList
// https://developer.mozilla.org/en-US/docs/Web/API/FileReader

// After that, you can see that we build an object with name and type explicitelly as keys and the file as a url formatted value. This is because we want to be able in backend to see name and format of the file, and the file itself as a blob will be parsed by multer in the backend.

// Note that when you pass something here that is not a file, will explode. So you need to check that you are passing a file, and if not, do something else.

function promisifyFileReader(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileCvObject = {
        name: file?.name,
        type: file?.type,
        file: reader.result,
      };

      resolve(fileCvObject);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const parseFile = async (file) => {
  try {
    return await promisifyFileReader(file);
  } catch (err) {
    console.error("Reader can't read your file", err);
    return false;
  }
};

export default parseFile;
