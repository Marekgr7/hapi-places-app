const Boom = require('@hapi/boom');

const mongoose = require('mongoose');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const imageUpload = require('../util/imageUpload');

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

const getPlacesByUserId = async (req, handler) => {
  const userId = req.params.userId;

  console.log(userId);

  let userWithPlaces;
  try {
      userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
      throw Boom.badImplementation('Fetching places failed, please try again later');
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
      throw Boom.notFound('No places found for this user');
  }

  return {
    places: userWithPlaces.places.map(place => place.toObject({ getters: true }))
  };
};

const createPlace = async (req, handler) => {
    const { title, description, address, userId, file } = req.payload;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (err) {
        throw Boom.badImplementation('Something went wrong, please try again');
    }

    let fileName;
    try {
        fileName = imageUpload(file);
    } catch (err) {
        Boom.badImplementation('Something went wrong. Please try again');
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: fileName,
        creator: userId
    });

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        Boom.notFound('Cannot find an user. Please try again later');
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
        throw Boom.badImplementation('Creating place failed, please try again later');
    }

    return { place: createdPlace };
};

const updatePlace = async (req, handler) => {
    const placeId = req.params.placeId;
    const { title, description, userId } = req.payload;

    console.log(title, description, userId);
    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        throw Boom.badImplementation('Something went wrong, could not update a place');
    }

    console.log(place.creator.toString() + ' and ' + userId);
    if (place.creator.toString() !== userId) {
        throw Boom.unauthorized('You are not authorized to edit this place');
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        throw Boom.badImplementation('Something went wrong, could not update a place');
    }

    return {
      place: place.toObject({ getters: true })
    };
};

const deletePlace = async (req, handler) => {
    const placeId = req.params.placeId;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
       throw Boom.badImplementation('Something went wrong, could not delete a place');
    }

    if (!place) {
        throw Boom.notFound('Could not find a place for this id');
    }

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