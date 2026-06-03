import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const mockCollegesData = [
  {
    id: "col-iit-bombay",
    name: "Indian Institute of Technology (IIT) Bombay",
    location: "Mumbai, Maharashtra",
    fees: 220000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60",
    overview: "Established in 1958, IIT Bombay is a premier public engineering institution located in Powai, Mumbai. Renowned globally for its academic excellence, cutting-edge research, and top-tier placement records, the campus sits picturesquely between the Vihar and Powai lakes.",
    courses: [
      { name: "B.Tech Computer Science and Engineering", durationYears: 4, fees: 230000, seats: 120 },
      { name: "B.Tech Electrical Engineering", durationYears: 4, fees: 225000, seats: 100 },
      { name: "B.Tech Mechanical Engineering", durationYears: 4, fees: 210000, seats: 110 },
      { name: "B.Tech Aerospace Engineering", durationYears: 4, fees: 210000, seats: 60 },
      { name: "M.Tech Microelectronics", durationYears: 2, fees: 90000, seats: 40 }
    ],
    placements: [
      {
        year: 2025,
        highestPackage: 168.0,
        averagePackage: 23.5,
        medianPackage: 19.8,
        placementPercentage: 94.5,
        recruiters: JSON.stringify(["Google", "Microsoft", "Uber", "Rubrik", "Qualcomm", "TATA Group"])
      },
      {
        year: 2024,
        highestPackage: 150.0,
        averagePackage: 21.8,
        medianPackage: 18.2,
        placementPercentage: 92.1,
        recruiters: JSON.stringify(["Google", "Apple", "Microsoft", "Goldman Sachs", "McKinsey", "Intel"])
      }
    ],
    cutoffRanks: [
      { exam: "JEE Advanced", branch: "Computer Science", rank: 67, category: "General" },
      { exam: "JEE Advanced", branch: "Computer Science", rank: 25, category: "OBC" },
      { exam: "JEE Advanced", branch: "Electrical Engineering", rank: 290, category: "General" },
      { exam: "JEE Advanced", branch: "Mechanical Engineering", rank: 650, category: "General" },
      { exam: "GATE", branch: "Microelectronics", rank: 850, category: "General" }
    ]
  },
  {
    id: "col-iit-delhi",
    name: "Indian Institute of Technology (IIT) Delhi",
    location: "New Delhi, Delhi",
    fees: 225000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1592303637753-cd1e678a0596?w=800&auto=format&fit=crop&q=60",
    overview: "IIT Delhi is a public research university located in Hauz Khas, Delhi. Founded in 1961, it is declared an Institution of Eminence and is highly active in fostering tech startups and producing top-notch global research.",
    courses: [
      { name: "B.Tech Computer Science and Engineering", durationYears: 4, fees: 235000, seats: 115 },
      { name: "B.Tech Mathematics and Computing", durationYears: 4, fees: 235000, seats: 75 },
      { name: "B.Tech Electrical Engineering", durationYears: 4, fees: 225000, seats: 100 },
      { name: "B.Tech Chemical Engineering", durationYears: 4, fees: 215000, seats: 90 }
    ],
    placements: [
      {
        year: 2025,
        highestPackage: 154.0,
        averagePackage: 22.8,
        medianPackage: 18.9,
        placementPercentage: 93.8,
        recruiters: JSON.stringify(["Microsoft", "Google", "Goldman Sachs", "Optiver", "Rubrik", "Cohesity"])
      },
      {
        year: 2024,
        highestPackage: 140.0,
        averagePackage: 21.0,
        medianPackage: 17.5,
        placementPercentage: 91.2,
        recruiters: JSON.stringify(["Microsoft", "Google", "JP Morgan", "Intel", "Amazon"])
      }
    ],
    cutoffRanks: [
      { exam: "JEE Advanced", branch: "Computer Science", rank: 110, category: "General" },
      { exam: "JEE Advanced", branch: "Mathematics and Computing", rank: 320, category: "General" },
      { exam: "JEE Advanced", branch: "Electrical Engineering", rank: 450, category: "General" },
      { exam: "JEE Advanced", branch: "Chemical Engineering", rank: 1800, category: "General" }
    ]
  },
  {
    id: "col-bits-pilani",
    name: "Birla Institute of Technology and Science (BITS) Pilani",
    location: "Pilani, Rajasthan",
    fees: 550000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60",
    overview: "BITS Pilani is a leading private deemed university known for its strict entrance standard (BITSAT), zero attendance policy, and unique Practice School system which connects students with corporate internships.",
    courses: [
      { name: "B.E. Computer Science", durationYears: 4, fees: 560000, seats: 120 },
      { name: "B.E. Electronics and Communication", durationYears: 4, fees: 550000, seats: 100 },
      { name: "B.E. Mechanical Engineering", durationYears: 4, fees: 530000, seats: 90 },
      { name: "M.Sc. Economics (Dual Degree)", durationYears: 5, fees: 540000, seats: 60 }
    ],
    placements: [
      {
        year: 2025,
        highestPackage: 98.0,
        averagePackage: 19.5,
        medianPackage: 16.5,
        placementPercentage: 92.5,
        recruiters: JSON.stringify(["Nvidia", "Salesforce", "Atlassian", "JPMC", "Cisco", "Amazon"])
      }
    ],
    cutoffRanks: [
      { exam: "BITSAT", branch: "Computer Science", rank: 331, category: "General" },
      { exam: "BITSAT", branch: "Electronics and Communication", rank: 295, category: "General" },
      { exam: "BITSAT", branch: "Mechanical Engineering", rank: 244, category: "General" }
    ]
  },
  {
    id: "col-nit-trichy",
    name: "National Institute of Technology (NIT) Trichy",
    location: "Tiruchirappalli, Tamil Nadu",
    fees: 165000,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60",
    overview: "Consistently ranked as the #1 NIT in India by NIRF, NIT Trichy (founded in 1964) is a highly esteemed public technology school offering rigorous programs and excellent placements.",
    courses: [
      { name: "B.Tech Computer Science and Engineering", durationYears: 4, fees: 175000, seats: 110 },
      { name: "B.Tech Electronics and Communication", durationYears: 4, fees: 170000, seats: 100 }
    ],
    placements: [
      {
        year: 2025,
        highestPackage: 64.0,
        averagePackage: 15.6,
        medianPackage: 13.2,
        placementPercentage: 91.0,
        recruiters: JSON.stringify(["Morgan Stanley", "Qualcomm", "Texas Instruments", "Oracle", "Cisco"])
      }
    ],
    cutoffRanks: [
      { exam: "JEE Main", branch: "Computer Science", rank: 1500, category: "General" },
      { exam: "JEE Main", branch: "Computer Science", rank: 450, category: "OBC" }
    ]
  },
  {
    id: "col-iim-ahmedabad",
    name: "Indian Institute of Management (IIM) Ahmedabad",
    location: "Ahmedabad, Gujarat",
    fees: 1250000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=60",
    overview: "Widely regarded as the leading business school in India, IIM Ahmedabad (founded in 1961) is famous for its Case Study method, iconic Louis Kahn-designed brick campus, and producing top-tier business leaders.",
    courses: [
      { name: "PGP in Management (MBA)", durationYears: 2, fees: 1250000, seats: 400 },
      { name: "PGPX (Executive MBA)", durationYears: 1, fees: 1600000, seats: 140 }
    ],
    placements: [
      {
        year: 2025,
        highestPackage: 115.0,
        averagePackage: 34.2,
        medianPackage: 31.5,
        placementPercentage: 100.0,
        recruiters: JSON.stringify(["McKinsey", "BCG", "Bain & Company", "Goldman Sachs", "HUL", "TAS"])
      }
    ],
    cutoffRanks: [
      { exam: "CAT", branch: "MBA", rank: 99, category: "General" }
    ]
  },
  {
    id: "col-aiims-delhi",
    name: "All India Institute of Medical Sciences (AIIMS) Delhi",
    location: "New Delhi, Delhi",
    fees: 1628,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60",
    overview: "Established in 1956, AIIMS New Delhi is the apex medical institute of India. It offers highly subsidised medical education alongside unmatched clinical exposure and state-of-the-art research laboratories.",
    courses: [
      { name: "MBBS", durationYears: 5.5, fees: 1628, seats: 125 }
    ],
    placements: [
      {
        year: 2025,
        highestPackage: 45.0,
        averagePackage: 18.0,
        medianPackage: 16.5,
        placementPercentage: 100.0,
        recruiters: JSON.stringify(["AIIMS residency", "Fortis", "Apollo Hospitals"])
      }
    ],
    cutoffRanks: [
      { exam: "NEET", branch: "MBBS", rank: 50, category: "General" },
      { exam: "NEET", branch: "MBBS", rank: 18, category: "OBC" }
    ]
  }
];

async function main() {
  console.log("Seeding database...");

  // Delete all existing data
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.cutoffRank.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create a dummy demo user
  const passwordHash = await bcrypt.hash("demo123", 10);
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@college.com",
      password: passwordHash,
      name: "Demo Student"
    }
  });
  console.log(`Created demo user: ${demoUser.email}`);

  // 2. Seed colleges
  for (const c of mockCollegesData) {
    const college = await prisma.college.create({
      data: {
        id: c.id,
        name: c.name,
        location: c.location,
        fees: c.fees,
        rating: c.rating,
        image: c.image,
        overview: c.overview
      }
    });

    // Create courses
    for (const course of c.courses) {
      await prisma.course.create({
        data: {
          collegeId: college.id,
          name: course.name,
          durationYears: course.durationYears,
          fees: course.fees,
          seats: course.seats
        }
      });
    }

    // Create placements
    for (const placement of c.placements) {
      await prisma.placement.create({
        data: {
          collegeId: college.id,
          year: placement.year,
          highestPackage: placement.highestPackage,
          averagePackage: placement.averagePackage,
          medianPackage: placement.medianPackage,
          placementPercentage: placement.placementPercentage,
          recruiters: placement.recruiters
        }
      });
    }

    // Create cutoffs
    for (const cutoff of c.cutoffRanks) {
      await prisma.cutoffRank.create({
        data: {
          collegeId: college.id,
          exam: cutoff.exam,
          branch: cutoff.branch,
          rank: cutoff.rank,
          category: cutoff.category
        }
      });
    }

    // Create a review
    await prisma.review.create({
      data: {
        collegeId: college.id,
        userId: demoUser.id,
        rating: 4.5,
        content: `Really excellent learning environment at ${college.name}. Infrastructure and facilities are highly modern, and peers are supportive.`
      }
    });
  }

  // 3. Seed discussions
  const q1 = await prisma.question.create({
    data: {
      userId: demoUser.id,
      title: "Is Dual Degree (B.Tech + M.Tech) worth it at IIT Bombay?",
      content: "I got a rank that allows Dual Degree in EE at IITB, but B.Tech CSE in a newer IIT. Which one should I choose in terms of career growth and options?",
      collegeId: "col-iit-bombay"
    }
  });

  await prisma.answer.create({
    data: {
      questionId: q1.id,
      userId: demoUser.id,
      content: "EE at IIT Bombay is highly respected. Campus life and network are amazing. However, a 5-year course can feel long if you want to get into software quickly. Choose based on your long-term research interest!"
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
