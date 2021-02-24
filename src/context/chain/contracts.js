import { Contract } from "@ethersproject/contracts";
const NomContractJSON = require('./ERC20NOM.json')
const BondingContractJSON = require('./BondingNOM.json')

export const contAddrs = require('./NOMAddrs.json')

/**
 * NOM ERC20 Contract instance
 */
export function NOMCont(library) {
  const ABI = NomContractJSON.abi
  return new Contract(contAddrs.NOMERC20, NomContractJSON.abi, library.getSigner())
}

/**
 * Haven Contract instance
 */
export function BondingCont(library) {
  const ABI = BondingContractJSON.abi
  return new Contract(contAddrs.BondingNOM, ABI, library.getSigner())
}
