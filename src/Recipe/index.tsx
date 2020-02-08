import React from "react";
import { useRouteMatch, useParams } from "react-router-dom";

const Recipe = () => {
  const { path } = useRouteMatch();
  const {
    recipeID = null,
    actionOrStarterID = null,
    starterAmount = null
  } = useParams();

  if (path === '/new') {
    return <>{'<Recipe edit />'}</>;
  }
  if (recipeID) {
    if (!actionOrStarterID) {
      return <>{`<Recipe recipeID='${recipeID}' />`}</>;
    }
    if (actionOrStarterID === 'edit') {
      return <>{`<Recipe recipeID='${recipeID}' edit />`}</>;
    }
    if (actionOrStarterID && starterAmount) {
      return <>{`<Recipe recipeID='${recipeID}' starterID='${actionOrStarterID}' starterAmount='${starterAmount}' />`}</>;
    }
  }
  return <>Invalid recipe</>;
};



export default Recipe;