import Actor from '../models/ActorModel.js'

export const listActors = async (req, res) => {
  const filters = {}
  try {
    const actors = await Actor.find(filters)
    res.json(actors)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const createActor = async (req, res) => {
  const newActor = new Actor(req.body)
  try{
    const actor = await newActor.save()
    res.json(actor)
  } catch(err){
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const readActor = async (req, res) => {
  try{
    const actor = await Actor.findById(req.params.id)
    if (actor) {
      res.json(actor)
    } else{
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const updateActor = async (req, res) => {
  const newActor = req.body
  try {
    const actor = await Actor.findOneAndUpdate({ _id: req.params.id }, newActor, { new:true })
    if (actor) {
      res.json(actor)
    } else{
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

export const deleteActor = async (req, res) => {
  try {
    const deletionResponse = await Actor.deleteOne({ _id: req.params.id })
    if (deletionResponse.deletedCount > 0) {
      res.json({ message: 'Actor successfully deleted' })
    } else {
      res.status(404).send('Actor could not be deleted')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const banActor = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    if (actor) {
      actor.ban = req.body
      const updatedActor = await actor.save()
      res.json(updatedActor)
    } else {
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

export const unbanActor = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    if (actor) {
      actor.ban = undefined
      const updatedActor = await actor.save()
      res.json(updatedActor)
    } else {
      res.status(404).send('Actor not found')
    }
  } catch (err) {
    res.status(500).send(err)
  }
}
