import styled from 'styled-components'
import {borderWidth, borderRadius} from 'context/responsive/cssSizes'

export const Panel = styled.div`
  padding: 1.5rem 2rem;  

  border: ${borderWidth} solid ${props => props.theme.colors.panelBorder};
  background-color: ${props => props.theme.colors.panel};
  border-radius: ${borderRadius};

  box-sizing: border-box;

  box-shadow: 0 .625rem 1.5rem ${props => props.theme.colors.shadow};
`