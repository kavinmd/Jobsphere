import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Job from './models/Job';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Hiring Manager
    const manager = await User.create({
      name: 'Ankit Kumar',
      email: 'manager@kalpana.com',
      password: 'Manager@123',
      role: 'hiring_manager',
      company: 'Kalpana Software Solution Pvt. Ltd.',
      location: 'Bengaluru, Karnataka',
      bio: 'Experienced hiring manager with 8+ years in tech recruitment.',
      phone: '+91 98765 43210',
    });

    // Create Student
    const student = await User.create({
      name: 'Rahul Sharma',
      email: 'student@kalpana.com',
      password: 'Student@123',
      role: 'student',
      location: 'Delhi, India',
      bio: 'Final year CSE student passionate about full-stack development.',
      phone: '+91 87654 32109',
    });

    // Create sample jobs
    const jobs = [
      {
        title: 'Full Stack Developer',
        company: 'Kalpana Software Solution Pvt. Ltd.',
        location: 'Bengaluru, Karnataka',
        description: `We are looking for a talented Full Stack Developer to join our growing engineering team.

Key Responsibilities:
- Build and maintain web applications using React and Node.js
- Design and implement RESTful APIs
- Collaborate with the design team to implement UI/UX
- Write clean, maintainable, and well-documented code
- Participate in code reviews and agile sprints

What We Offer:
- Competitive salary
- Health insurance
- Work from home 2 days/week
- Learning & development budget`,
        requirements: [
          'React.js / Next.js',
          'Node.js / Express.js',
          'MongoDB / PostgreSQL',
          'TypeScript',
          'Git & GitHub',
          '2+ years experience',
        ],
        salary: '₹8L - ₹15L per annum',
        type: 'full-time',
        postedBy: manager._id,
        source: 'internal',
        status: 'open',
      },
      {
        title: 'Frontend React Developer',
        company: 'Kalpana Software Solution Pvt. Ltd.',
        location: 'Remote',
        description: `Join our frontend team to build beautiful and performant user interfaces.

You will work on:
- Building reusable React components
- Implementing responsive designs
- Performance optimization
- Integration with backend APIs`,
        requirements: [
          'React.js',
          'TypeScript',
          'Tailwind CSS',
          'REST API integration',
          'Responsive design',
        ],
        salary: '₹6L - ₹10L per annum',
        type: 'remote',
        postedBy: manager._id,
        source: 'internal',
        status: 'open',
      },
      {
        title: 'Backend Node.js Developer',
        company: 'Kalpana Software Solution Pvt. Ltd.',
        location: 'Hyderabad, Telangana',
        description: `We need a backend developer to build robust APIs and microservices.

Responsibilities:
- Design and develop RESTful APIs
- Database design and optimization
- Authentication and security implementation
- API documentation`,
        requirements: [
          'Node.js',
          'Express.js',
          'MongoDB',
          'JWT Authentication',
          'Docker (nice to have)',
        ],
        salary: '₹7L - ₹12L per annum',
        type: 'full-time',
        postedBy: manager._id,
        source: 'internal',
        status: 'open',
      },
      {
        title: 'SDE-1 Internship (6 months)',
        company: 'Kalpana Software Solution Pvt. Ltd.',
        location: 'Bengaluru, Karnataka',
        description: `Exciting 6-month internship for final year students and fresh graduates.

What you'll do:
- Work on real production projects
- Learn from experienced engineers
- Get hands-on with modern tech stack
- Possibility of full-time conversion`,
        requirements: [
          'JavaScript / TypeScript',
          'React basics',
          'Any backend language',
          'Final year student or fresher',
        ],
        salary: '₹20,000 - ₹30,000/month',
        type: 'internship',
        postedBy: manager._id,
        source: 'internal',
        status: 'open',
      },
    ];

    await Job.insertMany(jobs);
    console.log('✅ Sample jobs created');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👔 Hiring Manager:');
    console.log('   Email: manager@kalpana.com');
    console.log('   Password: Manager@123');
    console.log('');
    console.log('🎓 Student:');
    console.log('   Email: student@kalpana.com');
    console.log('   Password: Student@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
