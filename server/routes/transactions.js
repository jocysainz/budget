const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');

// GET all transactions for logged in user
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// POST add transaction
router.post('/', auth, async (req, res) => {
    const { description, amount, type } = req.body;
    try {
        const newTx = new Transaction({
            userId: req.user.id,
            description,
            amount,
            type
        });
        const tx = await newTx.save();
        res.json(tx);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// DELETE transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const tx = await Transaction.findById(req.params.id);
        if (!tx) return res.status(404).json({ message: 'Transaction not found' });
        if (tx.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        await tx.remove();
        res.json({ message: 'Transaction removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
