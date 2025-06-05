import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Profile.module.scss';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchOrders();
  }, [sortBy, sortOrder]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/orders?search=${searchTerm}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h2>Welcome, {user?.name}</h2>
        <p>Email: {user?.email}</p>
      </div>

      <div className={styles.searchSection}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>

        <div className={styles.sortControls}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="createdAt">Date</option>
            <option value="totalPrice">Price</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className={styles.ordersList}>
        {orders.length === 0 ? (
          <p className={styles.noOrders}>No orders found</p>
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
                    <span>{item.name}</span>
                    <span>{item.quantity}x</span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>
              <div className={styles.orderFooter}>
                <span className={styles.totalPrice}>
                  Total: ${order.totalPrice}
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