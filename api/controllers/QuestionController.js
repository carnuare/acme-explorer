import Question from '../models/QuestionModel.js'
import Application from '../models/ApplicationModel.js'
import Trip from '../models/TripModel.js'
import Actor from '../models/ActorModel.js'
import RoleEnum from '../enum/RoleEnum.js'
import { ObjectId } from 'mongodb';

export const getTripQuestions = async (req, res) => {
  const { id } = req.params
  try {
    const questions = await Question.find({ trip: ObjectId(id) })
    res.json(questions)
  } catch (err) {
    res.status(500).send(err)
  }
}

export const createQuestion = async (req, res) => {
  const { id } = req.params
  const { actor } = req
  const { text } = req.body

  const user = actor ? actor._id : null
  const question = new Question({
    user,
    trip: id,
    text
  })
  try {
    const newQuestion = await question.save()
    res.json(newQuestion)
  } catch (err) {
    if (err === 'ValidationError') {
      res.status(422).json(err)
    }

    res.status(500).json(err)
  }
}

export const getUserQuestionsNoAuth = async (req, res) => {
  const { actor } = req.header
  try {
    const userApps = await Application.find({ explorer: actor })
    const userAppliedTrips = userApps.map(app => app.trip)
    const questions = await Question.find({ trip: { $in: userAppliedTrips }})
    res.json(questions)
  } catch (err) {
    res.status(500).json(err)
  }
}
export const getUserQuestions = async (req, res) => {
  const { actor } = req
  try {
    const userApps = await Application.find({ explorer: actor._id })
    const userAppliedTrips = userApps.map(app => app.trip)
    const questions = await Question.find({ trip: { $in: userAppliedTrips }})
    res.json(questions)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const createReplyNoAuth = async (req, res) => {
  const { id } = req.params
  const { actor } = req
  const { text } = req.body
  const reply = {
    user: actor,
    text
  }

  try {
    const actorObject = await Actor.findById(actor)
    const question = await Question.findById(id)
    if (!question) {
      res.status(404).json({ message: 'Question not found' })
      return
    }
    if (actorObject.role === RoleEnum.EXPLORER) {
      const userApps = await Application.find({ trip: question.trip, explorer: actorObject._id })
      if (!userApps.length) {
        res.status(403).json({ message: 'There\'s no apps for this actor, replying is forbidden' })
        return
      }
    }
    if (actorObject.role === RoleEnum.MANAGER) {
      const trip = await Trip.findById(question.trip)
      if (trip.creator.toString() !== actor._id.toString()) {
        res.status(403).json({ message: 'Replying a question as a manager is restricted to its creator' })
        return
      }
    }

    question.replies = [ ...question.replies, reply ]
    const newQuestion = await question.save()
    res.json(newQuestion)
  } catch (err) {
    if (err === 'ValidationError') {
      res.status(422).json(err)
    }

    res.status(500).json(err)
  }
}
export const createReply = async (req, res) => {
  const { id } = req.params
  const { actor } = req
  const { text } = req.body
  const reply = {
    user: actor._id,
    text
  }
  try {
    const question = await Question.findById(id)
    if (!question) {
      res.status(404).json({ message: 'Question not found' })
      return
    }
    
    if (actor.role === RoleEnum.EXPLORER) {
      const userApps = await Application.find({ trip: question.trip, explorer: actor._id })
      if (!userApps.length) {
        res.status(403).json({ message: 'There\'s no apps for this actor, replying is forbidden' })
        return
      }
    }
    
    if (actor.role === RoleEnum.MANAGER) {
      const trip = await Trip.findById(question.trip)
      if (trip.creator.toString() !== actor._id.toString()) {
        res.status(403).json({ message: 'Replying a question as a manager is restricted to its creator' })
        return
      }
    }

    question.replies = [ ...question.replies, reply ]
    const newQuestion = await question.save()
    res.json(newQuestion)
  } catch (err) {
    if (err === 'ValidationError') {
      res.status(422).json(err)
    }

    res.status(500).json(err)
  }
}

export const modifyQuestion = async (req, res) => {
  const { id } = req.params
  const { actor } = req
  const { text } = req.body

  try {
    const question = await Question.findById(id)
    if (!question) {
      res.status(404).json({ message: 'Question not found' })
      return
    }
    if (question.user.toString() !== actor._id.toString()) {
      res.status(403).json({ message: 'Logged actor is not the creator of the question' })
      return
    }

    question.text = text
    const newQuestion = await question.save()
    res.json(newQuestion)
  } catch (err) {
    if (err === 'ValidationError') {
      res.status(422).json(err)
    }

    res.status(500).json(err)
  }
}

export const modifyReply = async (req, res) => {
  const { id } = req.params
  const { actor } = req
  const { text } = req.body

  try {
    const replies = await Question.aggregate([
      { $unwind: "$replies" },
      { $match: {
        "replies._id": ObjectId(id),
        "replies.user": actor._id
      }},
      { $project: {
        _id: "$replies._id",
        user: "$replies.user",
        text: "$replies.text",
        questionId: "$_id"
      }}
    ])
    if (!replies.length) {
      res.status(404).send('Reply not found')
      return
    }

    const { questionId, ...reply} = replies[0]
    const question = await Question.findById(questionId)

    const newReply = { ...reply, text }
    const prevReplies = question.replies.filter(r => r._id.toString() !== newReply._id.toString())
    question.replies = [ ...prevReplies, newReply ]

    const newQuestion = await question.save()
    res.json(newQuestion)
  } catch (err) {
    if (err === 'ValidationError') {
      res.status(422).json(err)
    }

    res.status(500).json(err)
  }
}

export const banQuestion = async (req, res) => {
  const { id } = req.params
  const { actor } = req
  const { justification } = req.body

  try {
    const question = await Question.findById(id)
    if (!question) {
      res.status(404).json({ message: 'Question not found' })
      return
    }
    const trip = await Trip.findById(question.trip)
    if (trip.creator.toString() !== actor._id.toString()) {
      res.status(403).json({ message: 'Only questions from own trips can be banned' })
      return
    }

    question.ban = {
      date: new Date(),
      justification
    }
    const newQuestion = await question.save()
    res.json(newQuestion)
  } catch (err) {
    if (err === 'ValidationError') {
      res.status(422).json(err)
    }

    res.status(500).json(err)
  }
}

export const banReply = async (req, res) => {
  const { id } = req.params
  const { actor } = req
  const { justification } = req.body

  try {
    const replies = await Question.aggregate([
      { $unwind: "$replies" },
      { $match: {
        "replies._id": ObjectId(id)
      }},
      { $project: {
        _id: "$replies._id",
        user: "$replies.user",
        text: "$replies.text",
        questionId: "$_id"
      }}
    ])
    if (!replies.length) {
      res.status(404).send('Reply not found')
      return
    }

    const { questionId, ...reply} = replies[0]
    const question = await Question.findById(questionId)
    const trip = await Trip.findById(question.trip)
    if (trip.creator.toString() !== actor._id.toString()) {
      res.status(403).json({ message: 'Only questions from own trips can be banned' })
      return
    }

    const newReply = {
      ...reply,
      ban: {
        date: new Date(),
        justification
      }
    }
    const prevReplies = question.replies.filter(r => r._id.toString() !== newReply._id.toString())
    question.replies = [ ...prevReplies, newReply ]

    const newQuestion = await question.save()
    res.json(newQuestion)
  } catch (err) {
    if (err === 'ValidationError') {
      res.status(422).json(err)
    }

    res.status(500).json(err)
  }
}

export const getTripQuestionDashboard = async (req, res) => {
  return await Trip.aggregate([
    {
      $lookup: {
        from: 'Question',
        localField: '_id',
        foreignField: trip,
        as: 'questions'
      }
    },
    {
      $project: {
        _id: '$_id',
        questions: '$questions',
        status: {
          $cond: {
            if: { $exists: '$cancellationDate' },
            then: 'cancelled',
            else: 'inProgress'
          }
        }
      }
    },
    {
      $unwind: questions
    },
    {
      $group: {
        _id: "$status",
        count: { $count: { } }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
}