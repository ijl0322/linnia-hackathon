require('babel-polyfill')
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Header from './Header'

import Linnia from '@linniaprotocol/linnia-js'
import Web3 from 'web3'
import IPFS from 'ipfs-api'

const ipfs = new IPFS({host: 'localhost', port: 5001, protocol: 'http'})


// const linnia = new Linnia(web3, ipfs)
class App extends Component {

  async componentDidMount() {
    const web3 = new Web3(window.web3.currentProvider)
    console.log(await(web3.eth.getAccounts()))
    const linnia = new Linnia(web3, ipfs, { hubAddress: '0x177bf15e7e703f4980b7ef75a58dc4198f0f1172'})
    console.log(window.web3.currentProvider)
    const { _, users, records, permissions } = await linnia.getContractInstances()
    console.log(records)

    const publicKey = '0xae03ac628f811b8a5225bbc0547f3d38d13103fddb324b545c41f9479e763d8f083ec86f54e72e033f12e2870c1b64b93795c2d7312f51f5d0c0228eb2dd7b74'
    let encrypted = Linnia.util.encrypt(publicKey, 'foo')
    console.log(encrypted)
  }
  render() {

    return(
      <div>
        <Header/>
        <Switch>
          <Route exact path='/' render={() => <div>at /</div>}/>
          <Route exact path='/firstRoute' render={() => <div>at /firstRoute</div>}/>
          <Route exact path='/secondRoute' render={() => <div>at /secondRoute</div>}/>
          <Route render={() => <div>where r u lol</div>}/>
        </Switch>
      </div>
    )
  }
}

export default App