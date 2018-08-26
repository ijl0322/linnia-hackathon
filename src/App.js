require('babel-polyfill')
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Header from './Header'

import Linnia from '@linniaprotocol/linnia-js'
import Web3 from 'web3'
import IPFS from 'ipfs-api'
import { Buffer } from 'buffer'

const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
})
const web3 = new Web3(window.web3.currentProvider)

// const linnia = new Linnia(web3, ipfs)
const testDataHash = '0x276bc9ec8730ad53e827c0467c00473a53337e2cb4b61ada24760a217fb1ef14'
const testDataUri = 'QmbcfaK3bdpFTATifqXXLux4qx6CmgBUcd3fVMWxVszazP'
const testMetaData = 'Blood_Pressure'
class App extends Component {

  async componentDidMount() {
    const linnia = new Linnia(web3, ipfs, { hubAddress: '0x177bf15e7e703f4980b7ef75a58dc4198f0f1172' })
    const { _, users, records, permissions } = await linnia.getContractInstances()
    const accts = await web3.eth.getAccounts()
    console.log(accts)
    const publicKey = '0xae03ac628f811b8a5225bbc0547f3d38d13103fddb324b545c41f9479e763d8f083ec86f54e72e033f12e2870c1b64b93795c2d7312f51f5d0c0228eb2dd7b74'
    let encrypted = await Linnia.util.encrypt(publicKey, 'foo')

    const [ ipfsRecord ] = await ipfs.add(Buffer(encrypted))
      .catch(console.log)
    console.log("hello")
    console.log(ipfsRecord)

    const dataUri = ipfsRecord.hash;
    const [owner] = await web3.eth.getAccounts();
    const dataHash = await linnia.web3.utils.sha3(dataUri);
    console.log(dataHash);

    try {
      const res = await records.addRecord(dataHash, 'foo', dataUri, { from: owner, gas: 50000 });
      console.log(res)
    } catch(e) {
      console.log(e)
    }
    // const tx = await records.addRecord(
    //   testDataHash,
    //   testMetaData,
    //   testDataUri,
    //   {
    //     from: accts[0],
    //     gas: 500000,
    //   },
    // )
  }
  render() {

    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' render={() => <div>at /</div>} />
          <Route exact path='/firstRoute' render={() => <div>at /firstRoute</div>} />
          <Route exact path='/secondRoute' render={() => <div>at /secondRoute</div>} />
          <Route render={() => <div>where r u lol</div>} />
        </Switch>
      </div>
    )
  }
}

export default App