import { cleanup, fireEvent } from '@testing-library/react';

import { renderWithContext } from '../../utils/testing';
import Chart from './Chart';

describe('Given the Chart component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(Chart);
      expect(asFragment()).toMatchSnapshot();
    });

    it('should have three tabs of charts', () => {
      const { getByText } = renderWithContext(Chart);
      expect(getByText('Bonding Curve Chart')).toBeInTheDocument();
      expect(getByText('Line Chart')).toBeInTheDocument();
      expect(getByText('Candle View')).toBeInTheDocument();
    });

    it('should have default opened bondLineChart chart', () => {
      const { queryByTestId } = renderWithContext(Chart);
      expect(queryByTestId('bond-line-chart')).toBeInTheDocument();
      expect(queryByTestId('candle-chart')).not.toBeInTheDocument();
      expect(queryByTestId('historical-line-chart')).not.toBeInTheDocument();
    });

    describe('and user clicks on Candle View tab', () => {
      afterEach(cleanup);

      it('should show Candle chart and hide other charts', () => {
        const { getByText, queryByTestId } = renderWithContext(Chart);

        fireEvent.click(getByText('Candle View'));

        expect(queryByTestId('candle-chart')).toBeInTheDocument();
        expect(queryByTestId('bond-line-chart')).not.toBeInTheDocument();
        expect(queryByTestId('historical-line-chart')).not.toBeInTheDocument();
      });
    });

    describe('and user clicks on Line Chart tab', () => {
      afterEach(cleanup);

      it('should show Line chart and hide other charts', () => {
        const { getByText, queryByTestId } = renderWithContext(Chart);

        fireEvent.click(getByText('Line Chart'));

        expect(queryByTestId('historical-line-chart')).toBeInTheDocument();
        expect(queryByTestId('candle-chart')).not.toBeInTheDocument();
        expect(queryByTestId('bond-line-chart')).not.toBeInTheDocument();
      });
    });

    describe('and user clicks on Line Chart tab and then on Bonding Curve Chart tab', () => {
      afterEach(cleanup);

      it('should show Bonding Curve chart and hide other charts', () => {
        const { getByText, queryByTestId } = renderWithContext(Chart);

        fireEvent.click(getByText('Line Chart'));
        fireEvent.click(getByText('Bonding Curve Chart'));

        expect(queryByTestId('bond-line-chart')).toBeInTheDocument();
        expect(queryByTestId('historical-line-chart')).not.toBeInTheDocument();
        expect(queryByTestId('candle-chart')).not.toBeInTheDocument();
      });
    });
  });
});
