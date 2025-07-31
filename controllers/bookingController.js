const Booking = require('../model/Booking');

// booking create
const bookNow = async (req, res) => {
    try {
        console.log('Received booking request:', req.body);

        const {
            propertyId,
            ownerId,
            guestId, // Add this
            fullName,
            phone,
            guests,
            checkIn,
            checkOut,
            noOfNights,
            totalPrice
        } = req.body;

        // Validate required fields
        if (!propertyId || !ownerId || !guestId || !fullName || !phone || !guests || !checkIn || !checkOut) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                receivedData: req.body
            });
        }

        // Validate data types
        if (!Number.isInteger(propertyId) || 
            typeof ownerId !== 'string' ||
            !Number.isInteger(parseInt(guestId)) || // Changed this line
            typeof fullName !== 'string' ||
            typeof phone !== 'string' ||
            !Number.isInteger(guests) ||
            !checkIn || !checkOut) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data types in request',
                receivedData: req.body
            });
        }

        const newBooking = await Booking.create({
            property_id: propertyId,
            owner_id: ownerId,
            guest_id: parseInt(guestId), // Ensure guestId is parsed as integer
            guest_name: fullName,
            phone: phone,
            num_guests: guests,
            check_in: new Date(checkIn),
            check_out: new Date(checkOut),
            no_of_nights: noOfNights,
            total_price: totalPrice
        });

        console.log('Booking created:', newBooking);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: newBooking
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// booking delete
const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findByPk(bookingId);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        await booking.update({ status: 'cancelled' });

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to cancel booking',
            error: error.message
        });
    }
};

// Add this new controller method
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['updatedAt'] // Optionally exclude unnecessary fields
            }
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings: bookings
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!['confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be either "confirmed" or "cancelled"'
            });
        }

        const booking = await Booking.findByPk(bookingId);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        await booking.update({ status });

        res.status(200).json({
            success: true,
            message: `Booking status updated to ${status}`,
            booking
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status',
            error: error.message
        });
    }
};

module.exports = { 
    bookNow, 
    cancelBooking, 
    getAllBookings, 
    updateBookingStatus 
};