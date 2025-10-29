import React from 'react';

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => {
  return <select {...props} />;
};

export default Select;
