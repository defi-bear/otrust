import styled from 'styled-components'
import {borderWidth, borderRadius} from 'context/responsive/cssSizes'

export const ChartPanel = styled.div`
  padding: 1.5rem 2rem;  

  border: ${borderWidth} solid ${props => props.theme.colors.panelBorder};
  background-color: ${props => props.theme.colors.bgDarken};
  opacity: 1;
  
  border-radius: ${borderRadius};

  box-sizing: border-box;

`