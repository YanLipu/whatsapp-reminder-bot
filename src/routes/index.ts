import { Router, urlencoded } from 'express'
import { handle as input } from '../services'

const router = Router()

router.use(urlencoded({ extended: false }))

router.get('/', (req, res)=>{
  console.log('teste get')
  res.send('ok')
})

router.post('/message', input)

export default router
