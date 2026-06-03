export interface MockCourse {
  id: string;
  collegeId: string;
  name: string;
  durationYears: number;
  fees: number; // annual
  seats: number;
}

export interface MockPlacement {
  id: string;
  collegeId: string;
  year: number;
  highestPackage: number; // LPA
  averagePackage: number; // LPA
  medianPackage: number; // LPA
  placementPercentage: number;
  recruiters: string; // JSON string of string[]
}

export interface MockReview {
  id: string;
  collegeId: string;
  userId: string;
  userName: string; // display name for mock reviews
  rating: number;
  content: string;
  createdAt: string;
}

export interface MockCutoffRank {
  id: string;
  collegeId: string;
  exam: string;
  branch: string;
  rank: number;
  category: string;
}

export interface MockAnswer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface MockQuestion {
  id: string;
  collegeId: string | null;
  userId: string;
  userName: string;
  title: string;
  content: string;
  createdAt: string;
  answers: MockAnswer[];
}

export interface MockCollege {
  id: string;
  name: string;
  location: string;
  fees: number; // average annual fee
  rating: number;
  image: string;
  overview: string;
  courses: MockCourse[];
  placements: MockPlacement[];
  reviews: MockReview[];
  cutoffRanks: MockCutoffRank[];
}

// Highly realistic generated dataset
export const mockColleges: MockCollege[] = [
  {
    id: "col-iit-bombay",
    name: "Indian Institute of Technology (IIT) Bombay",
    location: "Mumbai, Maharashtra",
    fees: 220000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60",
    overview: "Established in 1958, IIT Bombay is a premier public engineering institution located in Powai, Mumbai. Renowned globally for its academic excellence, cutting-edge research, and top-tier placement records, the campus sits picturesquely between the Vihar and Powai lakes.",
    courses: [
      { id: "c-iitb-1", collegeId: "col-iit-bombay", name: "B.Tech Computer Science and Engineering", durationYears: 4, fees: 230000, seats: 120 },
      { id: "c-iitb-2", collegeId: "col-iit-bombay", name: "B.Tech Electrical Engineering", durationYears: 4, fees: 225000, seats: 100 },
      { id: "c-iitb-3", collegeId: "col-iit-bombay", name: "B.Tech Mechanical Engineering", durationYears: 4, fees: 210000, seats: 110 },
      { id: "c-iitb-4", collegeId: "col-iit-bombay", name: "B.Tech Aerospace Engineering", durationYears: 4, fees: 210000, seats: 60 },
      { id: "c-iitb-5", collegeId: "col-iit-bombay", name: "M.Tech Microelectronics", durationYears: 2, fees: 90000, seats: 40 }
    ],
    placements: [
      {
        id: "p-iitb-2025",
        collegeId: "col-iit-bombay",
        year: 2025,
        highestPackage: 168.0,
        averagePackage: 23.5,
        medianPackage: 19.8,
        placementPercentage: 94.5,
        recruiters: JSON.stringify(["Google", "Microsoft", "Uber", "Rubrik", "Qualcomm", "TATA Group"])
      },
      {
        id: "p-iitb-2024",
        collegeId: "col-iit-bombay",
        year: 2024,
        highestPackage: 150.0,
        averagePackage: 21.8,
        medianPackage: 18.2,
        placementPercentage: 92.1,
        recruiters: JSON.stringify(["Google", "Apple", "Microsoft", "Goldman Sachs", "McKinsey", "Intel"])
      }
    ],
    reviews: [
      {
        id: "r-iitb-1",
        collegeId: "col-iit-bombay",
        userId: "user-mock-1",
        userName: "Aarav Sharma",
        rating: 5,
        content: "Outstanding academic culture. The peer group is the absolute best in the country. Placements are legendary, though the curriculum can be extremely demanding.",
        createdAt: "2026-04-12T10:30:00Z"
      },
      {
        id: "r-iitb-2",
        collegeId: "col-iit-bombay",
        userId: "user-mock-2",
        userName: "Sneha Patel",
        rating: 4.5,
        content: "Campus life at Powai is vibrant with Techfest and Mood Indigo. Mess food is decent, labs are state-of-the-art. Only downside is the academic stress.",
        createdAt: "2026-05-01T14:15:00Z"
      }
    ],
    cutoffRanks: [
      { id: "cut-iitb-1", collegeId: "col-iit-bombay", exam: "JEE Advanced", branch: "Computer Science", rank: 67, category: "General" },
      { id: "cut-iitb-2", collegeId: "col-iit-bombay", exam: "JEE Advanced", branch: "Computer Science", rank: 25, category: "OBC" },
      { id: "cut-iitb-3", collegeId: "col-iit-bombay", exam: "JEE Advanced", branch: "Electrical Engineering", rank: 290, category: "General" },
      { id: "cut-iitb-4", collegeId: "col-iit-bombay", exam: "JEE Advanced", branch: "Mechanical Engineering", rank: 650, category: "General" },
      { id: "cut-iitb-5", collegeId: "col-iit-bombay", exam: "GATE", branch: "Microelectronics", rank: 850, category: "General" }
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
      { id: "c-iitd-1", collegeId: "col-iit-delhi", name: "B.Tech Computer Science and Engineering", durationYears: 4, fees: 235000, seats: 115 },
      { id: "c-iitd-2", collegeId: "col-iit-delhi", name: "B.Tech Mathematics and Computing", durationYears: 4, fees: 235000, seats: 75 },
      { id: "c-iitd-3", collegeId: "col-iit-delhi", name: "B.Tech Electrical Engineering", durationYears: 4, fees: 225000, seats: 100 },
      { id: "c-iitd-4", collegeId: "col-iit-delhi", name: "B.Tech Chemical Engineering", durationYears: 4, fees: 215000, seats: 90 }
    ],
    placements: [
      {
        id: "p-iitd-2025",
        collegeId: "col-iit-delhi",
        year: 2025,
        highestPackage: 154.0,
        averagePackage: 22.8,
        medianPackage: 18.9,
        placementPercentage: 93.8,
        recruiters: JSON.stringify(["Microsoft", "Google", "Goldman Sachs", "Optiver", "Rubrik", "Cohesity"])
      },
      {
        id: "p-iitd-2024",
        collegeId: "col-iit-delhi",
        year: 2024,
        highestPackage: 140.0,
        averagePackage: 21.0,
        medianPackage: 17.5,
        placementPercentage: 91.2,
        recruiters: JSON.stringify(["Microsoft", "Google", "JP Morgan", "Intel", "Amazon"])
      }
    ],
    reviews: [
      {
        id: "r-iitd-1",
        collegeId: "col-iit-delhi",
        userId: "user-mock-3",
        userName: "Rohit Verma",
        rating: 5,
        content: "Unmatched location in the heart of Delhi. Incredible startup ecosystem - senior support is extremely helpful for launching ventures. Highly recommended.",
        createdAt: "2026-03-25T11:20:00Z"
      },
      {
        id: "r-iitd-2",
        collegeId: "col-iit-delhi",
        userId: "user-mock-4",
        userName: "Ananya Iyer",
        rating: 4.4,
        content: "Academics are highly rigorous. Infrastructure is fantastic, and tech clubs are very active. Sports facilities are state-of-the-art.",
        createdAt: "2026-05-10T09:40:00Z"
      }
    ],
    cutoffRanks: [
      { id: "cut-iitd-1", collegeId: "col-iit-delhi", exam: "JEE Advanced", branch: "Computer Science", rank: 110, category: "General" },
      { id: "cut-iitd-2", collegeId: "col-iit-delhi", exam: "JEE Advanced", branch: "Mathematics and Computing", rank: 320, category: "General" },
      { id: "cut-iitd-3", collegeId: "col-iit-delhi", exam: "JEE Advanced", branch: "Electrical Engineering", rank: 450, category: "General" },
      { id: "cut-iitd-4", collegeId: "col-iit-delhi", exam: "JEE Advanced", branch: "Chemical Engineering", rank: 1800, category: "General" }
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
      { id: "c-bits-1", collegeId: "col-bits-pilani", name: "B.E. Computer Science", durationYears: 4, fees: 560000, seats: 120 },
      { id: "c-bits-2", collegeId: "col-bits-pilani", name: "B.E. Electronics and Communication", durationYears: 4, fees: 550000, seats: 100 },
      { id: "c-bits-3", collegeId: "col-bits-pilani", name: "B.E. Mechanical Engineering", durationYears: 4, fees: 530000, seats: 90 },
      { id: "c-bits-4", collegeId: "col-bits-pilani", name: "M.Sc. Economics (Dual Degree)", durationYears: 5, fees: 540000, seats: 60 }
    ],
    placements: [
      {
        id: "p-bits-2025",
        collegeId: "col-bits-pilani",
        year: 2025,
        highestPackage: 98.0,
        averagePackage: 19.5,
        medianPackage: 16.5,
        placementPercentage: 92.5,
        recruiters: JSON.stringify(["Nvidia", "Salesforce", "Atlassian", "JPMC", "Cisco", "Amazon"])
      },
      {
        id: "p-bits-2024",
        collegeId: "col-bits-pilani",
        year: 2024,
        highestPackage: 84.0,
        averagePackage: 18.2,
        medianPackage: 15.0,
        placementPercentage: 90.0,
        recruiters: JSON.stringify(["Amazon", "Microsoft", "Intel", "Walmart", "Oracle"])
      }
    ],
    reviews: [
      {
        id: "r-bits-1",
        collegeId: "col-bits-pilani",
        userId: "user-mock-5",
        userName: "Varun Mehta",
        rating: 4.8,
        content: "Zero attendance policy gives you the ultimate freedom to learn. The alumni network is massive and very supportive. Tuition fees are quite high, but worth the ROI.",
        createdAt: "2026-04-18T16:50:00Z"
      },
      {
        id: "r-bits-2",
        collegeId: "col-bits-pilani",
        userId: "user-mock-6",
        userName: "Diya Rao",
        rating: 4.2,
        content: "The Practice School (PS-1 & PS-2) provides excellent industry exposure. Pilani campus has a serene, residential learning atmosphere.",
        createdAt: "2026-05-15T12:00:00Z"
      }
    ],
    cutoffRanks: [
      { id: "cut-bits-1", collegeId: "col-bits-pilani", exam: "BITSAT", branch: "Computer Science", rank: 331, category: "General" },
      { id: "cut-bits-2", collegeId: "col-bits-pilani", exam: "BITSAT", branch: "Electronics and Communication", rank: 295, category: "General" },
      { id: "cut-bits-3", collegeId: "col-bits-pilani", exam: "BITSAT", branch: "Mechanical Engineering", rank: 244, category: "General" }
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
      { id: "c-nitt-1", collegeId: "col-nit-trichy", name: "B.Tech Computer Science and Engineering", durationYears: 4, fees: 175000, seats: 110 },
      { id: "c-nitt-2", collegeId: "col-nit-trichy", name: "B.Tech Electronics and Communication", durationYears: 4, fees: 170000, seats: 100 },
      { id: "c-nitt-3", collegeId: "col-nit-trichy", name: "B.Tech Electrical and Electronics", durationYears: 4, fees: 165000, seats: 95 }
    ],
    placements: [
      {
        id: "p-nitt-2025",
        collegeId: "col-nit-trichy",
        year: 2025,
        highestPackage: 64.0,
        averagePackage: 15.6,
        medianPackage: 13.2,
        placementPercentage: 91.0,
        recruiters: JSON.stringify(["Morgan Stanley", "Qualcomm", "Texas Instruments", "Oracle", "Cisco", "TCS"])
      }
    ],
    reviews: [
      {
        id: "r-nitt-1",
        collegeId: "col-nit-trichy",
        userId: "user-mock-7",
        userName: "Karthik Raja",
        rating: 4.5,
        content: "Top-class placements on par with mid-level IITs. Massive campus, and extremely diverse student culture. Academics can get pretty heavy, but festivals like Festember are awesome.",
        createdAt: "2026-03-30T10:10:00Z"
      }
    ],
    cutoffRanks: [
      { id: "cut-nitt-1", collegeId: "col-nit-trichy", exam: "JEE Main", branch: "Computer Science", rank: 1500, category: "General" },
      { id: "cut-nitt-2", collegeId: "col-nit-trichy", exam: "JEE Main", branch: "Computer Science", rank: 450, category: "OBC" },
      { id: "cut-nitt-3", collegeId: "col-nit-trichy", exam: "JEE Main", branch: "Electronics and Communication", rank: 3600, category: "General" }
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
      { id: "c-iima-1", collegeId: "col-iim-ahmedabad", name: "PGP in Management (MBA)", durationYears: 2, fees: 1250000, seats: 400 },
      { id: "c-iima-2", collegeId: "col-iim-ahmedabad", name: "PGPX (Executive MBA)", durationYears: 1, fees: 1600000, seats: 140 }
    ],
    placements: [
      {
        id: "p-iima-2025",
        collegeId: "col-iim-ahmedabad",
        year: 2025,
        highestPackage: 115.0,
        averagePackage: 34.2,
        medianPackage: 31.5,
        placementPercentage: 100.0,
        recruiters: JSON.stringify(["McKinsey", "BCG", "Bain & Company", "Goldman Sachs", "HUL", "TAS"])
      },
      {
        id: "p-iima-2024",
        collegeId: "col-iim-ahmedabad",
        year: 2024,
        highestPackage: 108.0,
        averagePackage: 32.8,
        medianPackage: 30.0,
        placementPercentage: 100.0,
        recruiters: JSON.stringify(["McKinsey", "BCG", "Bain", "Morgan Stanley", "HUL"])
      }
    ],
    reviews: [
      {
        id: "r-iima-1",
        collegeId: "col-iim-ahmedabad",
        userId: "user-mock-8",
        userName: "Vikram Sen",
        rating: 5,
        content: "The WACA (Wide Area Creative Activity) lifestyle is legendary. The case study method will fundamentally change how you view business problems. Peer learning is incredible.",
        createdAt: "2026-02-15T08:00:00Z"
      }
    ],
    cutoffRanks: [
      { id: "cut-iima-1", collegeId: "col-iim-ahmedabad", exam: "CAT", branch: "MBA", rank: 99, category: "General" } // CAT cutoffs represent percentile e.g. 99%
    ]
  },
  {
    id: "col-iim-bangalore",
    name: "Indian Institute of Management (IIM) Bangalore",
    location: "Bengaluru, Karnataka",
    fees: 1220000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60",
    overview: "IIM Bangalore is a premier public management school situated on a lush 100-acre stone campus in southern Bengaluru. It is highly recognized for its emphasis on public policy, tech entrepreneurship, and analytics.",
    courses: [
      { id: "c-iimb-1", collegeId: "col-iim-bangalore", name: "PGP in Management (MBA)", durationYears: 2, fees: 1225000, seats: 410 },
      { id: "c-iimb-2", collegeId: "col-iim-bangalore", name: "PGP in Business Analytics", durationYears: 2, fees: 1225000, seats: 70 }
    ],
    placements: [
      {
        id: "p-iimb-2025",
        collegeId: "col-iim-bangalore",
        year: 2025,
        highestPackage: 102.0,
        averagePackage: 33.5,
        medianPackage: 31.0,
        placementPercentage: 100.0,
        recruiters: JSON.stringify(["Bain & Co", "McKinsey", "Accenture Strategy", "JPMorgan", "Microsoft", "Adani"])
      }
    ],
    reviews: [
      {
        id: "r-iimb-1",
        collegeId: "col-iim-bangalore",
        userId: "user-mock-9",
        userName: "Pooja Hegde",
        rating: 4.9,
        content: "Lush green stone wall campus makes for an amazing study environment. Excellent faculty, strong corporate links in India's silicon valley (Bengaluru). Excellent placement metrics.",
        createdAt: "2026-04-05T07:30:00Z"
      }
    ],
    cutoffRanks: [
      { id: "cut-iimb-1", collegeId: "col-iim-bangalore", exam: "CAT", branch: "MBA", rank: 99, category: "General" }
    ]
  },
  {
    id: "col-aiims-delhi",
    name: "All India Institute of Medical Sciences (AIIMS) Delhi",
    location: "New Delhi, Delhi",
    fees: 1628, // Yes, AIIMS fees are extremely nominal!
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=60",
    overview: "Established in 1956, AIIMS New Delhi is the apex medical institute of India. It offers highly subsidised medical education alongside unmatched clinical exposure and state-of-the-art research laboratories.",
    courses: [
      { id: "c-aiims-1", collegeId: "col-aiims-delhi", name: "MBBS (Bachelor of Medicine, Bachelor of Surgery)", durationYears: 5.5, fees: 1628, seats: 125 },
      { id: "c-aiims-2", collegeId: "col-aiims-delhi", name: "B.Sc. Nursing (Hons)", durationYears: 4, fees: 1200, seats: 50 }
    ],
    placements: [
      {
        id: "p-aiims-2025",
        collegeId: "col-aiims-delhi",
        year: 2025,
        highestPackage: 45.0, // Subsidized research grants or hospital residency salaries
        averagePackage: 18.0,
        medianPackage: 16.5,
        placementPercentage: 100.0,
        recruiters: JSON.stringify(["AIIMS residency", "Fortis Healthcare", "Apollo Hospitals", "Max Healthcare", "Mayo Clinic"])
      }
    ],
    reviews: [
      {
        id: "r-aiims-1",
        collegeId: "col-aiims-delhi",
        userId: "user-mock-10",
        userName: "Dr. Aman Gupta",
        rating: 5,
        content: "Unmatched clinical exposure due to massive patient inflow. Fees are basically free. The pressure can be intense, but this is the absolute pinnacle of medical learning.",
        createdAt: "2026-05-18T10:00:00Z"
      }
    ],
    cutoffRanks: [
      { id: "cut-aiims-1", collegeId: "col-aiims-delhi", exam: "NEET", branch: "MBBS", rank: 50, category: "General" },
      { id: "cut-aiims-2", collegeId: "col-aiims-delhi", exam: "NEET", branch: "MBBS", rank: 18, category: "OBC" },
      { id: "cut-aiims-3", collegeId: "col-aiims-delhi", exam: "NEET", branch: "MBBS", rank: 250, category: "SC" }
    ]
  },
  {
    id: "col-mamc-delhi",
    name: "Maulana Azad Medical College (MAMC)",
    location: "New Delhi, Delhi",
    fees: 15450,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=60",
    overview: "MAMC is a top-tier government medical college associated with Lok Nayak Hospital, G.B. Pant Hospital, and Guru Nanak Eye Centre, providing extensive practical training.",
    courses: [
      { id: "c-mamc-1", collegeId: "col-mamc-delhi", name: "MBBS", durationYears: 5.5, fees: 15450, seats: 250 }
    ],
    placements: [
      {
        id: "p-mamc-2025",
        collegeId: "col-mamc-delhi",
        year: 2025,
        highestPackage: 38.0,
        averagePackage: 15.0,
        medianPackage: 14.0,
        placementPercentage: 98.0,
        recruiters: JSON.stringify(["MAMC Residency", "Apollo Hospitals", "Max Healthcare", "Medanta"])
      }
    ],
    reviews: [
      {
        id: "r-mamc-1",
        collegeId: "col-mamc-delhi",
        userId: "user-mock-11",
        userName: "Dr. Ritu Yadav",
        rating: 4.6,
        content: "Associated with LNJP Hospital which has one of the largest OPD capacities in Asia. The clinical exposure is supreme. Highly academic and busy schedule.",
        createdAt: "2026-03-10T14:40:00Z"
      }
    ],
    cutoffRanks: [
      { id: "cut-mamc-1", collegeId: "col-mamc-delhi", exam: "NEET", branch: "MBBS", rank: 85, category: "General" }
    ]
  },
  {
    id: "col-lsr-delhi",
    name: "Lady Shri Ram College for Women (LSR)",
    location: "New Delhi, Delhi",
    fees: 22000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60",
    overview: "Lady Shri Ram College is a premier women's liberal arts college affiliated with the University of Delhi. Known for its strong emphasis on social sciences, economics, and outstanding student leadership.",
    courses: [
      { id: "c-lsr-1", collegeId: "col-lsr-delhi", name: "B.A. (Hons) Economics", durationYears: 3, fees: 22000, seats: 120 },
      { id: "c-lsr-2", collegeId: "col-lsr-delhi", name: "B.A. (Hons) Psychology", durationYears: 3, fees: 25000, seats: 60 },
      { id: "c-lsr-3", collegeId: "col-lsr-delhi", name: "B.A. (Hons) Political Science", durationYears: 3, fees: 21000, seats: 110 }
    ],
    placements: [
      {
        id: "p-lsr-2025",
        collegeId: "col-lsr-delhi",
        year: 2025,
        highestPackage: 48.9,
        averagePackage: 11.2,
        medianPackage: 9.8,
        placementPercentage: 88.5,
        recruiters: JSON.stringify(["McKinsey", "BCG", "Bain & Co", "Accenture", "EY", "KPMG"])
      }
    ],
    reviews: [
      {
        id: "r-lsr-1",
        collegeId: "col-lsr-delhi",
        userId: "user-mock-12",
        userName: "Megha Nair",
        rating: 4.7,
        content: "Extremely progressive culture. Focuses heavily on extracurriculars and critical thinking. The economics department has excellent corporate placement ties.",
        createdAt: "2026-04-20T11:30:00Z"
      }
    ],
    cutoffRanks: [
      { id: "cut-lsr-1", collegeId: "col-lsr-delhi", exam: "CUET", branch: "Economics", rank: 785, category: "General" }, // CUET cutoffs are out of 800 e.g. score
      { id: "cut-lsr-2", collegeId: "col-lsr-delhi", exam: "CUET", branch: "Psychology", rank: 792, category: "General" }
    ]
  },
  {
    id: "col-stephens-delhi",
    name: "St. Stephen's College",
    location: "New Delhi, Delhi",
    fees: 40000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60",
    overview: "Founded in 1881, St. Stephen's College is one of the oldest and most prestigious liberal arts colleges in India, maintaining a distinct heritage and producing numerous prominent diplomats, writers, and politicians.",
    courses: [
      { id: "c-st-1", collegeId: "col-stephens-delhi", name: "B.A. (Hons) Economics", durationYears: 3, fees: 42000, seats: 100 },
      { id: "c-st-2", collegeId: "col-stephens-delhi", name: "B.Sc. (Hons) Mathematics", durationYears: 3, fees: 45000, seats: 50 },
      { id: "c-st-3", collegeId: "col-stephens-delhi", name: "B.A. (Hons) History", durationYears: 3, fees: 38000, seats: 80 }
    ],
    placements: [
      {
        id: "p-st-2025",
        collegeId: "col-stephens-delhi",
        year: 2025,
        highestPackage: 40.0,
        averagePackage: 10.8,
        medianPackage: 9.5,
        placementPercentage: 86.0,
        recruiters: JSON.stringify(["McKinsey", "LEK Consulting", "Bain Capability", "DE Shaw", "HUL"])
      }
    ],
    reviews: [
      {
        id: "r-st-1",
        collegeId: "col-stephens-delhi",
        userId: "user-mock-13",
        userName: "Devang Joshi",
        rating: 4.8,
        content: "Highly academic culture with rich traditions like residence-hall dinners. The campus architecture is beautiful. The focus on intellectual debates is incredible.",
        createdAt: "2026-05-02T13:30:00Z"
      }
    ],
    cutoffRanks: [
      { id: "cut-st-1", collegeId: "col-stephens-delhi", exam: "CUET", branch: "Economics", rank: 790, category: "General" }
    ]
  }
];

// Mock discussions (global or college-specific)
export let mockQuestions: MockQuestion[] = [
  {
    id: "q-1",
    collegeId: "col-iit-bombay",
    userId: "u-disc-1",
    userName: "Jatin Sethi",
    title: "Is Dual Degree (B.Tech + M.Tech) worth it at IIT Bombay?",
    content: "I got a rank that allows Dual Degree in EE at IITB, but B.Tech CSE in a newer IIT. Which one should I choose in terms of career growth and options?",
    createdAt: "2026-05-20T10:00:00Z",
    answers: [
      {
        id: "a-1",
        questionId: "q-1",
        userId: "u-disc-2",
        userName: "Aarav Sharma (IITB CSE)",
        content: "EE at IIT Bombay is highly respected, but a 5-year course can feel long if you want to transition into software. Newer IITs have good CSE labs, but the campus life and peer group at IITB Powai is unmatched. I would suggest going for IITB EE if you like core electronics or finance/analytics, else CSE at IIT Hyderabad/Gandhinagar is also solid.",
        createdAt: "2026-05-21T09:30:00Z"
      }
    ]
  },
  {
    id: "q-2",
    collegeId: "col-bits-pilani",
    userId: "u-disc-3",
    userName: "Priya Chand",
    title: "Can someone explain the Practice School system at BITS?",
    content: "I'm considering BITS Pilani CS. How does Practice School (PS-2) help with placements compared to standard college internships?",
    createdAt: "2026-05-24T12:00:00Z",
    answers: [
      {
        id: "a-2",
        questionId: "q-2",
        userId: "u-disc-4",
        userName: "Varun Mehta (BITS)",
        content: "PS-2 happens in the 4th year for 6 months. BITS connects you directly with companies (Atlassian, Nvidia, Salesforce, etc.) for full-time internships. Around 60-70% of students convert these into PPOs (Pre-Placement Offers). It's a huge boost because you skip the placement crowd.",
        createdAt: "2026-05-25T14:20:00Z"
      }
    ]
  },
  {
    id: "q-3",
    collegeId: null,
    userId: "u-disc-5",
    userName: "Rahul K.",
    title: "What is a safe CAT percentile for General Category to get IIM Call?",
    content: "I have 9/9/8 acads (10th/12th/Grad). What is the minimum CAT percentile needed to get a shortlist call from IIM A, B, or C?",
    createdAt: "2026-05-28T16:00:00Z",
    answers: [
      {
        id: "a-3",
        questionId: "q-3",
        userId: "u-disc-6",
        userName: "Aditya (IIM B)",
        content: "With 9/9/8, you have a very strong academic profile. For IIM Ahmedabad, you should aim for 99.6+ percentile. For IIM Bangalore, since they weight graduation marks heavily, you have a solid chance at 99.4+ percentile. Start practicing mocks early!",
        createdAt: "2026-05-29T10:15:00Z"
      }
    ]
  }
];

// Helper to push mock question (to simulate post)
export function addMockQuestion(question: MockQuestion) {
  mockQuestions = [question, ...mockQuestions];
}

// Helper to push mock answer
export function addMockAnswer(questionId: string, answer: MockAnswer) {
  mockQuestions = mockQuestions.map(q => {
    if (q.id === questionId) {
      return {
        ...q,
        answers: [...q.answers, answer]
      };
    }
    return q;
  });
}
