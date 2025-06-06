import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Profile.module.scss';
import { API_URL } from '../../config';
import emptyCartImg from '../../assets/img/empty-cart.png';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Будь ласка, увійдіть в систему');
        setIsLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedOrders = response.data.sort((a, b) => {
        if (sortBy === 'date') {
          return sortOrder === 'desc'
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortBy === 'price') {
          return sortOrder === 'desc' ? b.totalPrice - a.totalPrice : a.totalPrice - b.totalPrice;
        }
        return 0;
      });

      setOrders(sortedOrders);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка при завантаженні замовлень');
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.items.some((item) => (item.title ? item.title.toLowerCase().includes(searchLower) : false)) ||
      (order._id ? order._id.toLowerCase().includes(searchLower) : false) ||
      (order.createdAt ? formatDate(order.createdAt).toLowerCase().includes(searchLower) : false)
    );
  });

  if (isLoading) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <h1>Мій профіль</h1>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Пошук замовлень..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className={styles.sort}>
          <button
            className={`${styles.sortButton} ${sortBy === 'date' ? styles.active : ''}`}
            onClick={() => handleSort('date')}
          >
            За датою {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            className={`${styles.sortButton} ${sortBy === 'price' ? styles.active : ''}`}
            onClick={() => handleSort('price')}
          >
            За ціною {sortBy === 'price' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      <div className={styles.orders}>
        {filteredOrders.length === 0 ? (
          <div className={styles.noOrders}>
            <img src={emptyCartImg} alt="Немає замовлень" style={{width: '200px', marginBottom: '20px'}} />
            <p>Замовлень не знайдено</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className={styles.order}>
              <div className={styles.orderHeader}>
                <span className={styles.orderId}>Замовлення #{order._id}</span>
                <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                <span className={styles.orderStatus}>{order.status}</span>
              </div>
              <div className={styles.orderItems}>
                {order.items.map((item) => (
                  <div key={item._id || item.name} className={styles.orderItem}>
                    <img src={item.imageUrl || emptyCartImg} alt={item.title || 'Pizza'} />
                    <div className={styles.itemDetails}>
                      <h3>{item.title || item.name}</h3>
                      <p>Кількість: {item.count || item.quantity}</p>
                      <p>Ціна: {item.price} ₴</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.orderTotal}>
                Загальна сума: {order.totalPrice} ₴
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile; 