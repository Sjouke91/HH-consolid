
//array of desired spec objects and their scores
const rankings = [
  {name:"city",score:1},{name:"workplaceType",score:2},{name:"closingDate",score:3},{name:"duration",score:4},{name:"hoursPerWeek",score:5},{name:"startDate",score:6}
];

//gets matching spec inside rankings array
const getSpec = (({specName}) => rankings?.find(s => s.name == specName  ))


//filters spec array for exclusions or
export function sortSpecArray({specArray,exclusions}){
  if(!specArray || !specArray?.length){
    console.log("Missing or empty specArray");
    return [];
  }
  let sortedSpecs = specArray;
  if(exclusions && exclusions?.length){
    sortedSpecs = sortedSpecs.filter(spec => !exclusions.includes(spec.name))
  }
   sortedSpecs = sortedSpecs?.map(function(item,i){
    const match = getSpec({specName:item.name});
    if(match){
      return {...item,score:match.score}
    } else {
      return item;
    }
  })?.sort((a,b) => a?.score - b?.score);
  return sortedSpecs
}

