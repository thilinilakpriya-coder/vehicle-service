// Update the booking status and price
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, price } = req.body; 

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { status, price }, 
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error });
    }
};