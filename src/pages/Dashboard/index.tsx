import React, { useState, useEffect, useCallback } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  const loadTransactions = useCallback(async () => {
    const getTransactions = await api.get<{
      transactions: Transaction[];
      balance: Balance;
    }>('transactions');

    const updatedTransactions: Transaction[] = getTransactions.data.transactions.map(
      transaction => {
        const updatedTransaction = transaction;

        updatedTransaction.formattedValue = formatValue(transaction.value);

        const date = new Date(transaction.created_at);
        updatedTransaction.formattedDate = date.toLocaleDateString('pt-BR');

        return updatedTransaction;
      },
    );

    const updatedBalance: Balance = getTransactions.data.balance;
    updatedBalance.income = formatValue(
      Number(getTransactions.data.balance.income),
    );
    updatedBalance.outcome = formatValue(
      Number(getTransactions.data.balance.outcome),
    );
    updatedBalance.total = formatValue(
      Number(getTransactions.data.balance.total),
    );

    console.log(updatedBalance);
    setTransactions(updatedTransactions);
    setBalance(updatedBalance);
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {balance.income && `${balance.income}`}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {balance.outcome && `${balance.outcome}`}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {balance.total && `${balance.total}`}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {`${transaction.type === 'outcome' ? '- ' : ''}${
                      transaction.formattedValue
                    }`}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
