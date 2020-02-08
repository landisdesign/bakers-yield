import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Recipe from './Recipe';

const RecipeList = () => <>{'<RecipeList/>'}</>;

const App = () => {
  return (<Router>
    <Switch>
      <Route path='/new' component={Recipe}/>
      <Route path='/:recipeID/:actionOrStarterID?/:starterAmount?' component={Recipe}/>
      <Route path='/' component={RecipeList}/>
    </Switch>
  </Router>);
}

export default App;
