import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { YEARS, MONTHS } from '../utils/constants';

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: white;
`;

const Label = styled.label`
  font-weight: bold;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  gap: 4px;
`;

const Filters = ({ year, month, onYearChange, onMonthChange}) => {
  return (
    <FiltersContainer>
      <h3>Filters</h3>
      <Label>
        Year
        <Select value={year || ''} onChange={(e) => onYearChange(e.target.value || null)}>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </Label>
      <Label>
        Month
        <Select value={month || ''} onChange={(e) => onMonthChange(e.target.value || null)}>
          <option value="">Last three months</option>
          {MONTHS.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </Select>
      </Label>
    </FiltersContainer>
  );
}

Filters.propTypes = {
  customers: PropTypes.array.isRequired,
  selectedCustomer: PropTypes.string,
  year: PropTypes.string,
  month: PropTypes.string,
  onSelectCustomer: PropTypes.func.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onMonthChange: PropTypes.func.isRequired,
};

export default Filters;
