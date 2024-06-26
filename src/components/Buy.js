import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import {  useState } from 'react'
import { ethers } from 'ethers';


const Buy = ({ provider, price, crowdsale, setIsLoading }) =>{
    const [amount, setAmount] = useState('0')
    const [isWaiting, setIsWaiting] = useState(false)

    const buyHandler = async (e) => {
        e.preventDefault()
        setIsWaiting(true)

        console.log("buying tokens...", amount)
        try {
            const signer = await provider.getSigner()

        const value = ethers.utils.parseUnits((amount * price).toString(), 'ether')
        const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether')
        const transaction = await crowdsale.connect(signer).buyTokens(formattedAmount, { value: value })
        await transaction.wait()
        }   catch {
            window.alert("User rejected or transaction reverted")
        }
        setIsLoading(true)
    }



    return(
        <Form onSubmit={buyHandler} style={{maxWidth: "500px", margin: "50px auto"}}  >
            <Form.Group as={Row}>
                <Col>
                <Form.Control type="number" placeholder="Enter Amount" onChange={(e) => setAmount(e.target.value)}></Form.Control>
                </Col>
                <Col className='text-center'>
                    {isWaiting ? (<Spinner animation='border'></Spinner>) : (<Button variant='primary' type='submit' style={{width:'100%'}}>Buy Tokens</Button>)}
                </Col>
            </Form.Group>
        </Form>
    )
}


export default Buy;