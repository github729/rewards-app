import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { rewardCalculator } from "../utils/rewardCalculator";
import TransactionList from "./TransctionsList";
import Filters from "./Filters";

const Wrapper = styled.div`
  display: grid;
  gap: 16px;
`;

const Card = styled.div`
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 16px;
  margin: 8px 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border-bottom: 1px solid #334155;
    padding: 8px;
    text-align: left;
  }
`;

const CustomerDetails = ({ customerId, transactions }) => {
  const today = new Date();
  const defaultYear = new Date(2025, 0, 1);
  const [selectedYear, setSelectedYear] = React.useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = React.useState(null);
  const [selectedTransactionMonth, setSelectedTransactionMonth] =
    React.useState(null);

  const customerTransactions = transactions.filter(
    (tx) => tx.customerId === customerId
  );

  // Filter based on year and optionally month or last 3 months
  const filteredCustomerTransactions = customerTransactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const txYear = txDate.getFullYear();
    const txMonth = txDate.getMonth();

    const yearToCompare = selectedYear
      ? selectedYear.getFullYear()
      : defaultYear.getFullYear();

    if (selectedMonth) {
      return txYear === yearToCompare && txMonth === selectedMonth.getMonth();
    } else {
      const cutoffDate = new Date(yearToCompare, today.getMonth() - 2, 1);
      return txDate >= cutoffDate && txYear === yearToCompare;
    }
  });

  const transactionsByMonth = filteredCustomerTransactions.reduce((acc, tx) => {
    const date = new Date(tx.date);
    const month = date.getMonth() + 1;
    const key = `${month}`;
    if (!acc[key]) {
      acc[key] = { totalAmount: 0, pointsEarned: 0 };
    }
    acc[key].totalAmount += tx.amount;
    acc[key].pointsEarned += rewardCalculator(tx.amount);
    return acc;
  }, {});

  const totalPoints = Object.values(transactionsByMonth).reduce(
    (sum, month) => sum + month.pointsEarned,
    0
  );

  const selectedKey = selectedTransactionMonth
    ? ` ${new Date(
        selectedTransactionMonth.getFullYear(),
        selectedTransactionMonth.getMonth()
      ).toLocaleString("default", { month: "long", year: "numeric" })}`
    : `Last 3 Months of ${selectedYear.getFullYear()}`;

  return (
    <Wrapper>
      <h2>Rewards Summary - Customer: {customerId}</h2>
      <h3>Total Points: {totalPoints}</h3>
      <Card>
        {" "}
        <Filters
          year={selectedYear ? selectedYear.getFullYear() : null}
          onYearChange={(year) => {
            setSelectedTransactionMonth(null);
            setSelectedYear(year ? new Date(year, 0, 1) : defaultYear);
          }}
          month={selectedMonth ? selectedMonth.getMonth() + 1 : null}
          onMonthChange={(month) => {
            if (month) {
              const yr = selectedYear
                ? selectedYear.getFullYear()
                : defaultYear.getFullYear();
              setSelectedMonth(new Date(yr, month - 1, 1));
              setSelectedTransactionMonth(null);
            } else {
              setSelectedMonth(null);
            }
          }}
        />
      </Card>
      <Card>
        <h3>Customer: {customerId} - Transactions</h3>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Month</th>
              <th>Points Earned</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(transactionsByMonth).map(([month, data]) => (
              <tr
                key={month}
                onClick={() => {
                  const yr = selectedYear
                    ? selectedYear.getFullYear()
                    : defaultYear.getFullYear();
                  setSelectedTransactionMonth(new Date(yr, month - 1, 1));
                }}
              >
                <td>{`${customerId}-${month}`}</td>
                <td>{month}</td>
                <td>{data.pointsEarned}</td>
              </tr>
            ))}
          </tbody>
          {Object.keys(transactionsByMonth).length === 0 && (
            <tfoot>
              <tr>
                <td colSpan="3">No transactions available</td>
              </tr>
            </tfoot>
          )}
        </Table>
      </Card>
      {selectedTransactionMonth > 0 && (
        <Card>
          <TransactionList
            transactions={filteredCustomerTransactions}
            selectedYear={selectedYear}
            selectedMonth={selectedTransactionMonth}
            selectedKey={selectedKey}
          />
        </Card>
      )}
    </Wrapper>
  );
};

CustomerDetails.propTypes = {
  customerId: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      points: PropTypes.number,
      customerId: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomerDetails;
