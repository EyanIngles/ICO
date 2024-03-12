import { ethers } from 'ethers';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react'
import Navigation from './Navigation';
import Info from './Info';


function App() {

    const [account, setAccount] = useState(null)

    const loadBlockchainData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)


    }

    useEffect(() => {
        loadBlockchainData()
    });

    return(
        <Container>
            <Navigation></Navigation>
            <hr></hr>
            {account && (
                <Info account={account}></Info>
            )}
        </Container>

    )
}

export default App;