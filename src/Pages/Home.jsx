import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage } from '../redux/slices/filterSlice';
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import axios from 'axios';
import emptyCartImg from '../assets/img/empty-cart.png';

const Home = () => {
  const dispatch = useDispatch();
  const { categoryId, sort, currentPage } = useSelector((state) => state.filter);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const sortBy = sort.sortProperty.replace('-', '');
        const order = sort.sortProperty.includes('-') ? 'desc' : 'asc';
        const category = categoryId > 0 ? `category=${categoryId}` : '';

        const response = await axios.get(
          `https://66f59fb7436827ced974a3f5.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}`,
        );

        setItems(response.data);
        console.log('items:', response.data);
      } catch (err) {
        setError('Помилка при завантаженні піц. Спробуйте пізніше.');
        console.error('Error fetching pizzas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPizzas();
    window.scrollTo(0, 0);
  }, [categoryId, sort.sortProperty, currentPage]);

  const pizzas = items.map((obj) => (
    <PizzaBlock
      key={obj.id}
      {...obj}
      imageUrl={obj.imageUrl || obj.image || emptyCartImg}
    />
  ));
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Всі піци</h2>
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={(number) => dispatch(setCurrentPage(number))} />
    </div>
  );
};

export default Home;
