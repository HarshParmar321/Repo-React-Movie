import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Movie from './pages/Movie';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/movie/:id" component={Movie} />
        {/* Add other routes here as needed */}
      </Switch>
    </Router>
  );
};

export default App;