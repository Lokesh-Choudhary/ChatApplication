import React from 'react'
import  ChatState  from '../Context_API/ChatProvider'

const SingleChat = ({fetchAgain , setFetchagain}) => {
    const {user,selectedChat,setSelectedChat}= ChatState()
  return (
    <>
        selectedChat ? (
            <>
             

            </>
        ) : (
            
        )
    </>
  )
}

export default SingleChat