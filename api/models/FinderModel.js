import mongoose from 'mongoose'
import Trip from './TripModel.js'

const FinderSchema = new mongoose.Schema({
    explorer: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Explorer id required',
        ref: 'Actor'
    },
    keyword: {
        type: String,
        default: null
    },
    minPrice: {
        type: Number,
        min: 0,
        default: null
    },
    maxPrice: {
        type: Number,
        min: 0,
        default: null
    },
    minDate: {
        type: Date,
        default: null
    },
    maxDate: {
        type: Date,
        default: null
    },
    results: {
        type: [Trip.schema],
        default: []
    },
    expiryDate: {
        type: Date,
        default: null
    }
}, { timestamps: true })

FinderSchema.index({ explorer: 1, createdAt: 1 })

FinderSchema.statics.findByExplorer = function(actorId) {
    return this.find({ explorer: actorId }).sort("-createdAt").limit(1)
}

FinderSchema.index({ explorer: 1, date: -1 })
FinderSchema.index({ keyword: 1 })
FinderSchema.index({ minPrice: 1 })
FinderSchema.index({ maxPrice: 1 })

const model = mongoose.model('Finder', FinderSchema)

export const schema = model.schema
export default model