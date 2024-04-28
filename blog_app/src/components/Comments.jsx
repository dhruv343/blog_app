import { Alert, Button, Textarea } from 'flowbite-react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Comm from './Comm'
function Comments({ postId }) {

  const { currentUser } = useSelector((state) => state.user)
  const [comment, setComment] = useState("")
  const[comments,setComments]=useState([])
  const [error, setError] = useState(null);
  
  useEffect(() =>{
    const getComm=async()=>{
      try {
      const result= await fetch(`http://localhost:3500/api/comment/getAllComments/${postId}`)
      const data=await result.json()
      setComments(data)
      } catch (error) {
        console.log(error.message)
      }
      
    }
    getComm()
    
  }, [postId,comment])
  console.log(comments)
  
  const handleComment = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      if(comment==""){
        setError("Please enter any comment first")
        return
      }
      const result = await fetch("http://localhost:3500/api/comment/addcomment", {
        method: 'post',
        body: JSON.stringify({ content: comment, postId: postId, userId: currentUser.user._id }),
        headers: {
          'Content-Type': "application/json",
          "authorization": currentUser.auth
        }
      })
      let data = await result.json()
      if (!result.ok) {
        setError(data.message);
      }
      else {
        setComment("")
      }
    } catch (error) {
      setError(error.message)
    }
  }
  return (
    <div className='max-w-2xl mx-auto p-2 w-full mt-5'>

      {currentUser ? <div className='flex gap-1 text-sm items-center'>Signed in as:{<img src={currentUser.user.profilePicture} alt="" className='object-cover w-5 h-5 rounded-full' />}
        <Link className="hover:underline text-teal-500 text-sm" to={"/dashboard?tab=profile"}>
          {`@${currentUser.user.username}`}
        </Link>
      </div>

        : <div className='text-sm flex gap-1'>
          <div>You need to be signed in to comment.</div>
          <Link className="hover:underline text-teal-500 text-sm" to={"/signin"}>Sign In</Link>
        </div>}

      {currentUser &&

        <form onSubmit={handleComment} className='border-teal-500 border mt-5 p-3 rounded-md'>
          <Textarea
            placeholder='Add a comment...'
            rows="3"
            maxLength="200"
            className='p-2'
            value={comment} onChange={(e) => setComment(e.target.value)}></Textarea>

          <div className='mt-3 flex justify-between items-center'>
            <div className='text-sm'>{`${200 - comment.length} characters remaining`}</div>

            <Button type='submit' outline gradientDuoTone="purpleToPink">Submit</Button>
          </div>
          {error && <Alert color="failure" className='mt-5'>{error}</Alert>}
        </form>
      }

      {comments.length===0?<p className='my-5'>No comments yet.</p>:
      <>
      <div className='my-5 flex gap-1 items-center text-sm'>
      <span>Comments</span> 
      <span className='border border-black rounded-md pr-2 pl-2 '>{comments.length}</span>
      </div>
      {comments.map((comm,index)=>
      <Comm key={index} comm={comm}/>)}
      </>
      
      
      }
    </div>
  )
}

export default Comments