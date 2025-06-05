import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from '../Search';
import styles from './Profile.module.scss';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchOrders();
  }, [sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          sortBy,
          sortOrder,
        },
      });
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Помилка при завантаженні замовлень');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredOrders = orders.filter((order) =>
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    setOrders(filteredOrders);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
  };

  if (loading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <h1>Мій профіль</h1>
        <div className={styles.searchSection}>
          <form onSubmit={handleSearch}>
            <Search searchValue={searchValue} setSearchValue={setSearchValue} />
            <button type="submit" className={styles.searchButton}>
              Пошук
            </button>
          </form>
        </div>
        <div className={styles.sortControls}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="date">За датою</option>
            <option value="price">За ціною</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={styles.sortButton}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className={styles.orders}>
        {orders.length === 0 ? (
          <p className={styles.noOrders}>У вас ще немає замовлень</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <span className={styles.orderDate}>
                  {formatDate(order.createdAt)}
                </span>
                <span className={styles.orderStatus}>{order.status}</span>
              </div>
              <div className={styles.orderItems}>
                {order.items.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQuantity}>x{item.quantity}</span>
                    <span className={styles.itemPrice}>{item.price} ₴</span>
                  </div>
                ))}
              </div>
              <div className={styles.orderFooter}>
                <span className={styles.totalPrice}>
                  Загальна сума: {order.totalPrice} ₴
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile; 