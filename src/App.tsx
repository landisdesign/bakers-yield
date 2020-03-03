import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import reducer from './reducer';
import Recipe from './Recipe';
import RecipeList from './RecipeList';

const store = configureStore(reducer);

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path='/new' component={Recipe}/>
          <Route path='/:recipeID/:actionOrStarterID?/:starterAmount?' component={Recipe}/>
          <Route path='/' component={RecipeList}/>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
