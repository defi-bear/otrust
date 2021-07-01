import { cleanup } from '@testing-library/react';

import BridgeSwapModal from './BridgeSwapModal';
import { renderWithContext } from '../../../utils/testing';

describe('Given the BridgeSwapModal component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(BridgeSwapModal);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
