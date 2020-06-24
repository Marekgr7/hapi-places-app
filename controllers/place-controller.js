const Boom = require('@hapi/boom');

const mongoose = require('mongoose');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, handler) => {
    const placeId = req.params.placeId;

    let place;
    try {
        console.log(placeId);
        place = await Place.findById(placeId);
    } catch (err) {
        throw Boom.badImplementation('Problem occured when trying to fetch place. Please try again later');
    }

    if (!place) {
        throw Boom.notFound('No place found for provided id');
    }

    return { place };
};

const getPlacesByUserId = (req, handler) => {
  const userId = req.params.userId;
};

const createPlace = async (req, handler) => {
    const { title, description, address, userId } = req.payload;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        throw error;
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'random image',
        creator: userId
    });

    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        throw new HttpError('Could not find an user')
    }

    console.log(user);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        throw new HttpError('Creating place failed, please try again later');
    }

    return { place: createdPlace };
};

const updatePlace = async (req, handler) => {
    const placeId = req.params.placeId;
    const { title, description } = req.payload;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        throw Boom.badImplementation('Something went wrong, could not update a place');
    }

    if (place.creator.toString() !== userId) {
        throw Boom.unauthorized('You are not authorized to edit this place');
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (error) {
        throw Boom.badImplementation('Something went wrong, could not update a place');
    }

    return {
      place: place.toObject({ getters: true })
    };
};

const deletePlace = async (req, handler) => {
    const placeId = req.params.placeId;
    const userId = req.headers.authorization;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (error) {
       throw Boom.badImplementation('Something went wrong, could not delete a place');
    }

    if (!place) {
        throw Boom.notFound('Could not find a place for this id');
    }

    if (place.creator.id !== userId ) {
        throw Boom.unauthorized('You are not allowed to delete this place');
    }  //TODO ID DECODED FROM TOKEN

    const imagePath = place.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (error) {
        throw Boom.badImplementation('Something went wrong, could not delete a place');
    }

    return {
      message: 'Deleted place.'
    };
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;