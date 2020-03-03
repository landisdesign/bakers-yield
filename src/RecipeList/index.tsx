import React from 'react';
import { Recipe, ApplicationState } from "../reducer/state"
import { useSelector } from "react-redux"
import arraysEqual from "../utils/arraysEqual"
import { Link } from 'react-router-dom';
import { GiBread } from 'react-icons/gi';
import { TiArrowRightOutline } from 'react-icons/ti';

const RecipeList: React.FC = () => {
  const recipes: Recipe[] = useSelector((state: ApplicationState) => state.recipes.list, arraysEqual);
  const linkList = recipes.length
    ? <ul>
      {
        recipes.map(recipe =>
          <li key={recipe.id}><Link to={`/${recipe.id}`}>{recipe.name}{ recipe.isStarter ? <> <GiBread /></> : null}</Link></li>)
      }
      </ul>
    : <div>You currently have no recipes.</div>
  ;
  return (
    <div>
      <nav>{ linkList }</nav>
      <div>
        <Link to='/new'>Create new recipe <TiArrowRightOutline /></Link>
      </div>
    </div>
  );
}

export default RecipeList;
