import React from 'react';

function Categories({ value, onChangeCategory }) {
  const categories = [
    'Усі',
    "М'ясні",
    'Вегетаріанська',
    'Гриль',
    'Гострі',
    'Сирний бортик',
  ];

  return (
    <div className="categories">
      <ul>
        {categories.map((categoryName, i) => (
          <li
            key={i}
            onClick={() => onChangeCategory(i)}
            className={value === i ? 'active' : ''}
          >
            {categoryName}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Categories;
