import { Router, urlencoded } from 'express'
import { handle as input } from '../services'

const router = Router()

router.use(urlencoded({ extended: false }))

router.get('/', (req, res)=>{
  res.send('ok')
})

router.post('/message', input)

export default router
