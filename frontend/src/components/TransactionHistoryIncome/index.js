import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TransactionHistoryIncome.module.scss';
import { useHistory } from 'react-router-dom';
import deleteIncomeStarted from '../../redux/actions/deleteTransaction/deleteTransactionIncomeStarted';

function TransactionsHistoryIncome({ id }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  const dispatch = useDispatch();
  const history = useHistory();
  const transactions = useSelector(state => state.transactions);

  const transaction = transactions.filter(
    transaction => transaction._id === id
  )[0];
  const [prettyTime, setPrettyTime] = useState('');
  const userId = useSelector(state => state.user._id);

  useEffect(() => {
    setPrettyTime(new Date(transaction.time).toLocaleString());
  }, [transaction]);
  return (
    <motion.li style={{ listStyle: 'none' }} onClick={toggleOpen}>
      <motion.div
        className={isOpen ? styles.openedWrapper : styles.wrapper}
        whileHover={{
          scale: 1.1,
          // boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.1)',
        }}
        // transition={{ duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] }}
      >
        <div className={styles.listItem}>
          <p className={styles.amount}>${transaction && transaction.amount}</p>
        </div>
        <div className={styles.listItem}>
          <p className={styles.targetCategory}>Добавлено извне</p>
        </div>
        <div className={styles.listItem}>
          <p className={styles.time}>{prettyTime && prettyTime}</p>{' '}
        </div>

        {isOpen && (
          <motion.p
            // transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.additionalContent}
          >
            <button
              className={styles.deleteButton}
              onClick={() => {
                dispatch(
                  deleteIncomeStarted(
                    userId,
                    transaction._id,
                    transaction.to,
                    transaction.amount
                  )
                );
              }}
            >
              Удалить
            </button>
          </motion.p>
        )}
      </motion.div>
    </motion.li>
  );
}

export default TransactionsHistoryIncome;
