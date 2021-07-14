import { cleanup, fireEvent, render, mount } from '@testing-library/react';
import { ModalContextWrapper, renderWithContext, ThemeWrapper } from 'utils/testing';

import ExchangeModals from './ExchangeModals';

const testModalContext = {
  handleModal: jest.fn(),
};

describe('Given an ExchangeModals component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(ExchangeModals);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('and user clicks on ExchangeButton', () => {
    it('should open Buy NOM Modal', () => {
      const { queryByTestId } = render(ModalContextWrapper(ThemeWrapper(ExchangeModals), testModalContext));
      fireEvent.click(queryByTestId('exchanges-modals-buy-button'));

      expect(queryByTestId('buy-nom-modal-info')).toBeInTheDocument();
      expect(queryByTestId('buy-nom-modal-results')).toBeInTheDocument();
      expect(queryByTestId('sell-nom-modal-info')).not.toBeInTheDocument();
      expect(queryByTestId('sell-nom-modal-results')).not.toBeInTheDocument();
    });
  });

  describe('and user clicks on SellButton', () => {
    it('should open Sell NOM Modal', () => {
      const { queryByTestId } = render(ModalContextWrapper(ThemeWrapper(ExchangeModals), testModalContext));
      fireEvent.click(queryByTestId('exchanges-modals-sell-button'));

      expect(queryByTestId('sell-nom-modal-info')).toBeInTheDocument();
      expect(queryByTestId('sell-nom-modal-results')).toBeInTheDocument();
      expect(queryByTestId('buy-nom-modal-info')).not.toBeInTheDocument();
      expect(queryByTestId('buy-nom-modal-results')).not.toBeInTheDocument();
    });
  });
});
