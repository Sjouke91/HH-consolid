const deleteArray = ['siteconfig', 'footer', 'header', 'dictionary'];

/**
 * NOTE - Recursively cleans up null/boolean/number fields in a block object and its properties
 * @param {*} block A contentful block object
 * @returns Block object with removed number and boolean fields
 */
export function blokCleaner(blok) {
  //loop through block properties, delete unwanted properties

  // const newBlock = {...blok};
  const newBlock = blok;

  const unwantedFields = [
    '_editable',
    'asset',
    'fields',
    'button',
    '_uid',
    'component',
    'checkbox',
    '__typename',
    'image',
    'role',
    'video',
    'form',
  ];
  for (const p in newBlock) {
    //cleanup nested things
    const toDelete =
      typeof newBlock[p] == 'number' ||
      typeof newBlock[p] == 'boolean' ||
      newBlock[p] === null ||
      newBlock[p] === '' ||
      unwantedFields.includes(p) ||
      p.endsWith('Image');

    toDelete ? delete newBlock[p] : null;
    //check if property is an array

    if (typeof newBlock[p] == 'object' && Array.isArray(newBlock[p])) {
      //check if every item is an object
      const allObjects = newBlock[p].every(
        (i) => typeof i === 'object' && Object.keys(i)?.length,
      );
      if (allObjects) {
        //loop through all objects and call the function.
        newBlock[p].forEach((j) => blokCleaner(j));
      }
    } else if (typeof newBlock[p] == 'object') {
      // richTextParser(block[p]);
      blokCleaner(newBlock[p]);
    }
  }
  return newBlock;
}

function extractRichTextData(docContent) {
  const textContent = [];
  //content = {"type":"paragraph","content":[{"text":"BLAH BLAH","type":"text"}]}

  //loop through rich text entries
  for (const obj of docContent) {
    if (obj['type'] === 'text') {
      //loop[ through paragraph entry's content array of objects
      textContent.push(obj['text']);
    } else if (obj['type'] === 'paragraph') {
      //loop[ through paragraph entry's content array of objects
      for (const innerContent of obj['content']) {
        //check if content array object  has a text property
        if (innerContent['text']) {
          textContent.push(innerContent['text']);
        }
      }
    }
  }
  return textContent.join('');
}

/**
 * NOTE - Parses block properties for richText and replaces property value with total content
 * @param {*} pageBlock  Contentful page block
 * @returns
 */
function getRichTextValues(blok) {
  if (!blok) {
    return;
  }

  // const newBlock = { ...blok };
  const newBlock = blok;

  const richTextObjects = [];
  //loop through properties and get rich text objects
  for (const prop in newBlock) {
    if (newBlock[prop]?.type && newBlock[prop]?.type === 'doc') {
      richTextObjects.push(newBlock[prop]?.content);
    }
  }
  const flatRichTextObjects = richTextObjects
    .flat(2)
    ?.filter((rich) => rich?.content);
  //terminal filter step to remove empty objects with no content property

  let allTextContent = [];
  //loop through object array and extract rich text content
  for (const richTextObj of flatRichTextObjects) {
    if (richTextObj?.content) {
      const data = extractRichTextData(richTextObj?.content);
      data && allTextContent.push(data);
    }
  }

  const flatTotal = allTextContent.flat(2)?.join('');
  if (flatTotal?.length) {
    newBlock['richData'] = flatTotal;
  }
  return newBlock;
}

/**
 * NOTE - Converts page block array string content to JSON.
 * @param {*} pageBlockArray - Array of page blocks
 * @returns  stringified page block array with simplified content
 */
export function storyBloksToJson(blokArray, metaDescription, pageTitle) {
  //early return if no argument passed in
  if (!blokArray || blokArray.length < 1) {
    return;
  }

  //filter out siteConfig, & dictionary,header,footer

  //cleanup unwanted blok properties
  const cleanedBlocks = blokArray.map((blok) => {
    //filter out siteConfig, & dictionary,header,footer
    const componentName = blok?.component.toLowerCase();
    if (deleteArray.includes(componentName)) {
      return;
    }
    return blokCleaner(blok);
  });

  if (!cleanedBlocks?.length) {
    return;
  }
  //Extrat rich text content of cleaned blocks
  const processedCleanBlocks = cleanedBlocks.map((blok) =>
    getRichTextValues(blok),
  );
  metaDescription && processedCleanBlocks.push(metaDescription);
  pageTitle && processedCleanBlocks.push(pageTitle);
  const stringifiedContent = JSON.stringify(processedCleanBlocks);
  // console.log('stringified content', stringifiedContent);
  return stringifiedContent;
}
