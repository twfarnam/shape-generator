import React from 'react';

import Text from './text.jsx';
import Shape from './shape.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Shape />
        <Text />
      </div>
    )
  }
}


