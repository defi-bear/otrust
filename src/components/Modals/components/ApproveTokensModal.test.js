import { cleanup, fireEvent, render } from '@testing-library/react';

import ApproveTokensModal from './ApproveTokensModal';
import { ThemeWrapper, ModalContextWrapper, renderWithContext } from '../../../utils/testing';

const testProps = {
  onApprove: jest.fn(),
};

const testModalContext = {
  handleModal: jest.fn(),
};

describe('Given the ApproveTokensModal component', () => {
  describe('when the component is rendered', () => {
    afterEach(cleanup);

    it('should match the snapshot', () => {
      const { asFragment } = renderWithContext(ApproveTokensModal, testProps);
      expect(asFragment()).toMatchSnapshot();
    });

    describe('and user clicks on CloseIcon', () => {
      it('should call handleModal from the useModal context', () => {
        const { queryByTestId } = render(
          ModalContextWrapper(ThemeWrapper(ApproveTokensModal, testProps), testModalContext),
        );
        fireEvent.click(queryByTestId('approve-tokens-modal-close-icon'));

        expect(testModalContext.handleModal).toHaveBeenCalled();
      });
    });

    describe('and user clicks on SecondaryButton', () => {
      it('should call handleModal from the useModal context', () => {
        const { queryByTestId } = render(
          ModalContextWrapper(ThemeWrapper(ApproveTokensModal, testProps), testModalContext),
        );
        fireEvent.click(queryByTestId('approve-tokens-modal-secondary-button'));

        expect(testModalContext.handleModal).toHaveBeenCalled();
      });
    });

    describe('and user clicks on PrimaryButton', () => {
      it('should call onApprove from the props', () => {
        const { queryByTestId } = render(
          ModalContextWrapper(ThemeWrapper(ApproveTokensModal, testProps), testModalContext),
        );
        fireEvent.click(queryByTestId('approve-tokens-modal-primary-button'));

        expect(testProps.onApprove).toHaveBeenCalled();
      });
    });
  });
});
