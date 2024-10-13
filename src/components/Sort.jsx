import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSort } from '../redux/slices/filterSlice';

export const sortList = [
  { name: 'від дешевих до дорогих', sortProperty: 'price' },
  { name: 'від дорогих до дешевих', sortProperty: '-price' },
  { name: 'спочатку акційні', sortProperty: 'rating' },
  { name: 'спочатку популярні', sortProperty: '-rating' },
  { name: 'за назвою', sortProperty: 'title' },
];

function Sort() {
  const dispatch = useDispatch();
  const sort = useSelector(state => state.filter.sort);

  const [open, setOpen] = React.useState(false);

  const onClickListItem = obj => {
    if (sort.sortProperty !== obj.sortProperty) {
      // Проверка на выбор того же элемента
      dispatch(setSort(obj));
    }
    setOpen(false);
  };

  // Закрытие выпадающего меню при клике вне его
  const handleClickOutside = event => {
    if (event.target.closest('.sort') === null) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="sort">
      <div className="sort__label">
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
            fill="#2C2C2C"
          />
        </svg>
        <b>Сортування:</b>
        <span onClick={() => setOpen(!open)}>{sort.name}</span>
      </div>
      {open && (
        <div className="sort__popup" role="menu">
          <ul>
            {sortList.map(obj => (
              <li
                key={obj.sortProperty} // Изменено на уникальный ключ
                onClick={() => onClickListItem(obj)}
                className={sort.sortProperty === obj.sortProperty ? 'active' : ''}
                role="menuitem" // Атрибут для доступности
                tabIndex={0} // Добавлен атрибут для фокусировки
              >
                {obj.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sort;
