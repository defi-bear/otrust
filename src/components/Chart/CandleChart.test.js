import { cleanup, render } from '@testing-library/react';

import CandleChart from './CandleChart';

describe('Given the CandleChart component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = render(<CandleChart />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
