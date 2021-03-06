import React, {createContext, useState} from 'react';

export const TypeContext = createContext(null);

export const TypeProvider = props => {
  let [userType, setUserType] = useState({
    name: '张三1',
    type: 1
  });

  return (
    <TypeContext.Provider value={{userType, setUserType}}>
      {props.children}
    </TypeContext.Provider>
  )
};

export const TypeConsumer = TypeContext.Consumer;
