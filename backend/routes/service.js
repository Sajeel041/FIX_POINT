import express from 'express';

const router = express.Router();

// @route   GET /api/services
// @desc    Get all available services
// @access  Public
router.get('/', (req, res) => {
  const services = [
    {
      id: 1,
      name: 'Electrician',
      icon: '⚡',
      description: 'Electrical repairs and installations',
    },
    {
      id: 2,
      name: 'Plumber',
      icon: '🔧',
      description: 'Plumbing repairs and installations',
    },
    {
      id: 3,
      name: 'AC Technician',
      icon: '❄️',
      description: 'AC repair and maintenance',
    },
    {
      id: 4,
      name: 'Carpenter',
      icon: '🪚',
      description: 'Carpentry and woodwork',
    },
    {
      id: 5,
      name: 'Painter',
      icon: '🎨',
      description: 'Interior and exterior painting',
    },
  ];

  res.json(services);
});

export default router;

