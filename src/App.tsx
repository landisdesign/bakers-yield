import React from 'react';
import { BrowserRouter as Router, Switch, Route, useParams, useRouteMatch } from 'react-router-dom';

const Test = () => {
  const { recipeId = '' } = useParams();
  const { url } = useRouteMatch();
  return (<Switch>
    <Route path={`${url}/:action`}>
      <Pathing recipeId={recipeId}/>
    </Route>
    <Route>Root: {recipeId}</Route>
  </Switch>);
};

const Pathing = ({recipeId}:{recipeId: string}) => {
  const { action } = useParams();
  return <>Action: {recipeId} => {action}</>;
};

const App = () => {
  return (<Router>
    <Switch>
      <Route path="/new">
        New
      </Route>
      <Route path='/:recipeId'>
        <Test/>
      </Route>
      <Route path='/'>
        Home
      </Route>
    </Switch>
  </Router>);
}

export default App;
