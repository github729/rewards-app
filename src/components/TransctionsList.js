import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { rewardCalculator } from "../utils/rewardCalculator";

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

const TransactionList = ({ transactions, selectedMonth, selectedKey }) => {
  const filteredTransactions = transactions.filter((tx) => {
    return (
      new Date(tx.date).getMonth() + 1 ==
      (selectedMonth && selectedMonth.getMonth() + 1)
    );
  });

  return (
    <div>
      <h3>Transactions - {selectedKey}</h3>

      <Table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Amount</th>
            <th>Points Earned</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.transactionId}</td>
              <td>{tx.amount}</td>
              <td>{rewardCalculator(tx.amount)}</td>
            </tr>
          ))}
        </tbody>
        {filteredTransactions.length === 0 && (
          <tfoot>
            <tr>
              <td colSpan="4">No transactions available</td>
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  selectedMonth: PropTypes.object,
  selectedKey: PropTypes.string,
};

export default TransactionList;
