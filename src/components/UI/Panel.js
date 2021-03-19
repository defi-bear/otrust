import styled from 'styled-components'
import {borderWidth, borderRadius} from 'context/responsive/cssSizes'

export const Panel = styled.div`
  padding: 1.5rem 2rem;  
  background-color: ${props => props.theme.colors.bgNormal};
 
  box-sizing: border-box;

`