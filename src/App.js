require('babel-polyfill')
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Header from './Header'

import Linnia from '../node_modules/@linniaprotocol/linnia-js'
// const Linnia = require('../node_modules/@linniaprotocol/linnia-js')
import Web3 from 'web3'
import IPFS from 'ipfs-api'
import { Buffer } from 'buffer'
import EthCrypto from 'eth-crypto'

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

  async decrypt(privKey, encrypted) {
    const hexPrivKeyString = privKey.toString('hex');
    const hexPrivKey = hexPrivKeyString.substr(0, 2) === '0x' ? hexPrivKeyString : `0x${hexPrivKeyString}`;

    const encryptedObject = EthCrypto.cipher.parse(encrypted);
    console.log(encryptedObject.toString())
    console.log({hexPrivKey})
    const decrypted = await EthCrypto.decryptWithPrivateKey(
      hexPrivKey,
      encryptedObject,
    )
    console.log({decrypted})
    const decryptedPayload = JSON.parse(decrypted);
    return decryptedPayload.message;
  }

  async componentDidMount() {
    const linnia = new Linnia(web3, ipfs, { hubAddress: '0x177bf15e7e703f4980b7ef75a58dc4198f0f1172' })
    const { _, users, records, permissions } = await linnia.getContractInstances()
    const accts = await web3.eth.getAccounts()
    const publicKey = '0xae03ac628f811b8a5225bbc0547f3d38d13103fddb324b545c41f9479e763d8f083ec86f54e72e033f12e2870c1b64b93795c2d7312f51f5d0c0228eb2dd7b74'
    let encrypted = await Linnia.util.encrypt(publicKey, { name: "isabel" })

    // const [ ipfsRecord ] = await ipfs.add(Buffer(encrypted))
    //   .catch(console.log)
    // console.log("hello")
    // console.log(ipfsRecord)

    // const dataUri = ipfsRecord.hash;
     const [owner] = await web3.eth.getAccounts();
    // const dataHash = await linnia.web3.utils.sha3(dataUri);
    // console.log({ dataHash });
    // console.log({ dataUri })

    // try {
    //   const res = await records.addRecord(dataHash, 'foo', dataUri, { from: owner, gas: 500000 });
    //   console.log(res)
    // } catch(e) {
    //   console.log(e)
    // }

    console.log('trying to grand permission')

    const dataHash = await linnia.web3.utils.sha3('QmWbMGRV9Dp3YvjBkJLLVnHfL4JwxZgRv3JShiqjRvd2P5');
    const record = await linnia.getRecord(dataHash);
    console.log({record})
    console.log(record.dataUri)
    let file
    try {
      file = await new Promise((resolve, reject) => {
        ipfs.cat(record.dataUri, (err, ipfsRed) => {
          err ? reject(err) : resolve(ipfsRed);
        });
      });
      console.log({file})
    } catch (e) {
      console.log(e)
      return;
    }
    let decryptedData
    // // Decrypt the file using the owner's private key
    try {
      const encryptedData = file.toString();
      decryptedData = await this.decrypt('0xb581d5911f2983182558c7b376e37c65725add8230c82019b74ebc963d8f6b07', encryptedData);
      console.log({decryptedData})
    } catch (e) {
      console.log(e)
      return;
    }
    let reencrypted
    try {
      reencrypted = await Linnia.util.encrypt('0x67c396d711ad2ba7408f5b1951e0dcec84cb11b6e189f95cab9cff9ef230eb7afce76a42c666b9e2a3499756a8aaa529a375e01e033f80917d9db45f8cbdadef', decryptedData);
    } catch (e) {
      console.log(e)
      return;
    }
    console.log(reencrypted)
    // // Upload the viewer encrypted file up to a new location in IPFS
    let IPFSDataUri
    try {
      [ IPFSDataUri ] = await new Promise((resolve, reject) => {
        ipfs.add(Buffer(reencrypted), (err, ipfsRed) => {
          err ? reject(err) : resolve(ipfsRed);
        });
      });
    } catch (e) {
      console.log(e)
      return;
    }
    console.log(IPFSDataUri)

    // // Create a new permissions record on the blockchain
    try {
      const permission = await permissions.grantAccess(dataHash, '0x1f6FD2dB216b6F4958Ee00a41a6Cc19B54383B62', IPFSDataUri.path, {
        from: owner,
        gas: 500000,
      });
      console.log(permission)
    } catch (e) {
      console.error(e);
      return;
    }

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