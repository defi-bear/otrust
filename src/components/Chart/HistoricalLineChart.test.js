import { cleanup } from '@testing-library/react';

import { renderWithContext } from '../../utils/testing';
import LineChart from './HistoricalLineChart';
import { lineChartProps } from '../../fixtures/testProps';
// import { useResizeObserver } from './utils';

// jest.mock('react', () => {
//   const originReact = jest.requireActual('react');
//     return {
//        ...originReact,
//        useRef: jest.fn(),
//     };
// });

// jest.mock("./utils");

describe('Given the LineChart component', () => {
  describe('when the component is rendered and bondData is undefined', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(LineChart);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('when the component is rendered and bondData is defined', () => {
    afterEach(cleanup);

    it('should match the snapshot', async () => {
      // React.useRef.mockReturnValue({ current: {offsetWith: 100} });

      // useResizeObserver.mockReturnValue({
      //   bottom: 400,
      //   height: 400,
      //   left: 0,
      //   right: 813.328125,
      //   top: 0,
      //   width: 813.328125,
      //   x: 0,
      //   y: 0
      // })
      const { asFragment } = renderWithContext(LineChart, lineChartProps);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
