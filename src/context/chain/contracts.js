import { Contract } from "@ethersproject/contracts";
const NomContractJSON = require('./ERC20NOM.json')
const BondingContractJSON = require('./BondingNOM.json')
const GravityContractJSON = require('./Gravity.json')

export const contAddrs = require('./NOMAddrs.json')

/**
 * NOM ERC20 Contract instance
 */
export function NOMCont(library) {
  const ABI = NomContractJSON.abi
  return new Contract(contAddrs.NOMERC20, ABI, library.getSigner())
}

/**
 * Haven Contract instance
 */
export function BondingCont(library) {
  const ABI = BondingContractJSON.abi
  return new Contract(contAddrs.BondingNOM, ABI, library.getSigner())
}


/**
 * Gravity Contract instance
 */
 export function GravityCont(library) {
  const ABI = BondingContractJSON.abi
  return new Contract(contAddrs.BondingNOM, ABI, library.getSigner())
}
