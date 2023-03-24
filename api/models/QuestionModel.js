import mongoose from 'mongoose'

const ReplySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
    },
    text: {
        type: String,
        minLength: 1,
        required: true
    },
    ban: {
        date: { type: Date },
        justification: { type: String }
    }
})

const QuestionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
        default: null
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    text: {
        type: String,
        minLength: 1,
        required: true
    },
    ban: {
        date: { type: Date },
        justification: { type: String }
    },
    replies: [ ReplySchema ]
}, { timestamps: true })

QuestionSchema.index({ user: 1 })
QuestionSchema.index({ trip: 1 })
QuestionSchema.index({ user:1, trip: 1 })

const model = mongoose.model('Question', QuestionSchema)

export const schema = model.schema
export default model