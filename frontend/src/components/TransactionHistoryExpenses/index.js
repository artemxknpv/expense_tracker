import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import deleteTransactionStarted from '../../redux/actions/deleteTransaction/deleteTransactionStarted';
import loadingFinished from '../../redux/actions/loadingHandlers/loadingFinished.js';
import modalCrudOperationsClosed from '../../redux/actions/modalWindow/closeModalWindowCrudCategory.js';
import InlineLoading from '../InlineLoading';
import styles from './TransactionHistoryExpenses.module.scss';

function TransactionsHistoryExpense({ id }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user._id);
  const transactions = useSelector(state => state.transactions);
  const store = useSelector(state => state.categories);
  const transaction = transactions.filter(transaction => {
    return transaction._id === id;
  })[0];
  const [prettyTime, setPrettyTime] = useState('');
  const [nameFrom, setNameFrom] = useState(null);
  useEffect(() => {
    setPrettyTime(new Date(transaction.time).toLocaleString());
    setNameFrom(
      store.filter(category => {
        return category.id === transaction.from;
      })[0]
    );
  }, []);
  function handleClick() {
    dispatch(
      deleteTransactionStarted(
        userId,
        transaction._id,
        transaction.from,
        transaction.to,
        transaction.amount
      )
    );
  }

  return (
    <motion.li style={{ listStyle: 'none' }} onClick={toggleOpen}>
      <motion.div
        className={isOpen ? styles.openedWrapper : styles.wrapper}
        whileHover={{
          scale: 1.1,
          boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.1)',
        }}
        transition={{ duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] }}
      >
        <div className={styles.listItem}>
          <p className={styles.amount}>₽ {transaction && transaction.amount}</p>
        </div>
        <div className={styles.listItem}>
          <p className={styles.targetCategory}>
            Потрачено из <strong>{nameFrom && nameFrom.name}</strong>
          </p>
        </div>
        <div className={styles.listItem}>
          <p className={styles.time}>{prettyTime && prettyTime}</p>
        </div>

        {isOpen && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.additionalContent}
          >
            <button className={styles.deleteButton} onClick={handleClick}>
              Удалить
            </button>
          </motion.p>
        )}
      </motion.div>
    </motion.li>
  );
}

export default TransactionsHistoryExpense;
