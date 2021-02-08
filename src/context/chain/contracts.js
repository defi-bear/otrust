const NomContractJSON = require('../../../../solonomy/contracts/ERC20NOM.json')
const NomContAddr = '0xe6a7d746b0fb9F37Bf9dc47042A11Ee4F9759d47'

const BondingContractJSON = require('../../../../solonomy/contracts/BondingNOM.json')
const bondingContAddr = '0x309ae3Ef862865529Dc42C0272f32C7C49C81D05'

export const contAddrs = require('./havenAddrs.json')

/**
 * Account Contract instance
 */
export function loomAcctCont(web3, loomAddress) {
  const ABI = AccountContractJSON.abi
  return new web3.eth.Contract(ABI, contAddrs.account, {
    from: loomAddress
  })
}

/**
 * Haven Contract instance
 */
export function loomHavenCont(web3, loomAddress) {
  const ABI = HavenContractJSON.abi
  return new web3.eth.Contract(ABI, contAddrs.haven, {
    from: loomAddress
  })
}

/**
 * Kudos Contract instance
 */
export function loomKudosCont(web3, loomAddress) {
  const ABI = KudosContractJSON.abi
  return new web3.eth.Contract(ABI, contAddrs.kudos, {
    from: loomAddress
  })
}

/**
 * Wallet Contract instance
 */
export function loomWalletCont(web3, loomAddress) {
  const ABI = WalletContractJSON.abi
  return new web3.eth.Contract(ABI, contAddrs.wallet, {
    from: loomAddress
  })
}

/**
 * Document Contract instance
 */
export function loomDocumentCont(web3, loomAddress) {
  const ABI = DocumentContractJSON.abi
  return new web3.eth.Contract(ABI, contAddrs.document, {
    from: loomAddress
  })
}