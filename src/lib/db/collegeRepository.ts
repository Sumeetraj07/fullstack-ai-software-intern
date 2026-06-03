import { prisma, getDbMode } from "./db";
import { mockColleges, mockQuestions, MockCollege, MockQuestion, MockReview, MockAnswer } from "./mockData";
import { Prisma } from "@prisma/client";

interface RepositoryUser {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PredictorResult {
  college: {
    id: string;
    name: string;
    location: string;
    fees: number;
    rating: number;
    image: string;
    overview: string;
  };
  branch: string;
  closingRank: number;
  exam: string;
  category: string;
  matchChance: "High" | "Medium" | "Low";
  matchPercent: number;
}

// In-memory tables for mock fallback CRUD operations
const inMemoryUsers: RepositoryUser[] = [];
const inMemorySavedColleges: { id: string; userId: string; collegeId: string; savedAt: Date }[] = [];
const inMemorySavedComparisons: { id: string; userId: string; collegeIds: string; name: string; savedAt: Date }[] = [];

// Initialize local reviews and questions state
let inMemoryColleges = JSON.parse(JSON.stringify(mockColleges)) as MockCollege[];
let localQuestions = JSON.parse(JSON.stringify(mockQuestions)) as MockQuestion[];

export interface CollegeFilterParams {
  search?: string;
  location?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export class CollegeRepository {
  // --- USERS ---
  static async getUserByEmail(email: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      return await prisma.user.findUnique({ where: { email } });
    }
    return inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async createUser(email: string, passwordHash: string, name: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      return await prisma.user.create({
        data: { email, password: passwordHash, name }
      });
    }
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password: passwordHash,
      name,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryUsers.push(newUser);
    return newUser;
  }

  static async getUserById(id: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      return await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, name: true, createdAt: true }
      });
    }
    const user = inMemoryUsers.find(u => u.id === id);
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
  }

  // --- COLLEGES ---
  static async getColleges(params: CollegeFilterParams) {
    const usePrisma = await getDbMode();
    const page = params.page || 1;
    const limit = params.limit || 6;
    const skip = (page - 1) * limit;

    if (usePrisma) {
      // Prisma Query builder
      const where: Prisma.CollegeWhereInput = {};

      if (params.search) {
        where.OR = [
          { name: { contains: params.search, mode: "insensitive" } },
          { location: { contains: params.search, mode: "insensitive" } },
          { overview: { contains: params.search, mode: "insensitive" } }
        ];
      }

      if (params.location) {
        where.location = { contains: params.location, mode: "insensitive" };
      }

      if (params.minFees !== undefined || params.maxFees !== undefined) {
        where.fees = {};
        if (params.minFees !== undefined) where.fees.gte = params.minFees;
        if (params.maxFees !== undefined) where.fees.lte = params.maxFees;
      }

      if (params.minRating !== undefined) {
        where.rating = { gte: params.minRating };
      }

      const total = await prisma.college.count({ where });
      const items = await prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rating: "desc" },
        include: {
          courses: true,
          placements: { orderBy: { year: "desc" }, take: 1 } // Get latest placement details
        }
      });

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }

    // Fallback Mock Filtering
    let filtered = [...inMemoryColleges];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.location.toLowerCase().includes(q) || 
        c.overview.toLowerCase().includes(q)
      );
    }

    if (params.location) {
      const loc = params.location.toLowerCase();
      filtered = filtered.filter(c => c.location.toLowerCase().includes(loc));
    }

    if (params.minFees !== undefined) {
      filtered = filtered.filter(c => c.fees >= (params.minFees as number));
    }
    if (params.maxFees !== undefined) {
      filtered = filtered.filter(c => c.fees <= (params.maxFees as number));
    }

    if (params.minRating !== undefined) {
      filtered = filtered.filter(c => c.rating >= (params.minRating as number));
    }

    // Sort by rating desc
    filtered.sort((a, b) => b.rating - a.rating);

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      items: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getCollegeById(id: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      return await prisma.college.findUnique({
        where: { id },
        include: {
          courses: { orderBy: { fees: "asc" } },
          placements: { orderBy: { year: "desc" } },
          reviews: { orderBy: { createdAt: "desc" } },
          cutoffRanks: true,
          questions: {
            orderBy: { createdAt: "desc" },
            include: {
              answers: { orderBy: { createdAt: "asc" } }
            }
          }
        }
      });
    }

    const college = inMemoryColleges.find(c => c.id === id);
    if (!college) return null;

    // Attach forum questions for this specific college
    const collegeQuestions = localQuestions
      .filter(q => q.collegeId === id)
      .map(q => ({
        ...q,
        answers: [...q.answers].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      }));

    return {
      ...college,
      questions: collegeQuestions
    };
  }

  // --- REVIEWS ---
  static async addReview(collegeId: string, userId: string, userName: string, rating: number, content: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      const review = await prisma.review.create({
        data: { collegeId, userId, rating, content }
      });

      // Update college average rating
      const reviews = await prisma.review.findMany({ where: { collegeId } });
      const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
      await prisma.college.update({
        where: { id: collegeId },
        data: { rating: parseFloat(avgRating.toFixed(1)) }
      });

      return review;
    }

    const newReview: MockReview = {
      id: `rev-${Date.now()}`,
      collegeId,
      userId,
      userName,
      rating,
      content,
      createdAt: new Date().toISOString()
    };

    // Push to college local reviews
    inMemoryColleges = inMemoryColleges.map(c => {
      if (c.id === collegeId) {
        const updatedReviews = [newReview, ...c.reviews];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...c,
          reviews: updatedReviews,
          rating: parseFloat(avg.toFixed(1))
        };
      }
      return c;
    });

    return newReview;
  }

  // --- COMPARE ---
  static async getCollegesForComparison(ids: string[]) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      return await prisma.college.findMany({
        where: { id: { in: ids } },
        include: {
          courses: true,
          placements: { orderBy: { year: "desc" } }
        }
      });
    }

    return inMemoryColleges
      .filter(c => ids.includes(c.id))
      .map(c => ({
        id: c.id,
        name: c.name,
        location: c.location,
        fees: c.fees,
        rating: c.rating,
        image: c.image,
        courses: c.courses,
        placements: c.placements
      }));
  }

  // --- SAVED COLLEGES ---
  static async getSavedColleges(userId: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      const saved = await prisma.savedCollege.findMany({
        where: { userId },
        include: {
          college: {
            include: {
              placements: { orderBy: { year: "desc" }, take: 1 }
            }
          }
        }
      });
      return saved.map(s => s.college);
    }

    const savedLinks = inMemorySavedColleges.filter(s => s.userId === userId);
    const collegeIds = savedLinks.map(s => s.collegeId);
    return inMemoryColleges.filter(c => collegeIds.includes(c.id));
  }

  static async toggleSavedCollege(userId: string, collegeId: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      const existing = await prisma.savedCollege.findUnique({
        where: { userId_collegeId: { userId, collegeId } }
      });

      if (existing) {
        await prisma.savedCollege.delete({
          where: { userId_collegeId: { userId, collegeId } }
        });
        return { saved: false };
      } else {
        await prisma.savedCollege.create({
          data: { userId, collegeId }
        });
        return { saved: true };
      }
    }

    const index = inMemorySavedColleges.findIndex(s => s.userId === userId && s.collegeId === collegeId);
    if (index > -1) {
      inMemorySavedColleges.splice(index, 1);
      return { saved: false };
    } else {
      inMemorySavedColleges.push({
        id: `saved-${Date.now()}`,
        userId,
        collegeId,
        savedAt: new Date()
      });
      return { saved: true };
    }
  }

  static async isCollegeSaved(userId: string, collegeId: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      const item = await prisma.savedCollege.findUnique({
        where: { userId_collegeId: { userId, collegeId } }
      });
      return !!item;
    }
    return inMemorySavedColleges.some(s => s.userId === userId && s.collegeId === collegeId);
  }

  // --- SAVED COMPARISONS ---
  static async getSavedComparisons(userId: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      return await prisma.savedComparison.findMany({
        where: { userId },
        orderBy: { savedAt: "desc" }
      });
    }

    return inMemorySavedComparisons
      .filter(s => s.userId === userId)
      .map(s => ({
        id: s.id,
        userId: s.userId,
        collegeIds: s.collegeIds, // JSON string
        name: s.name,
        savedAt: s.savedAt
      }))
      .sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());
  }

  static async saveComparison(userId: string, collegeIds: string[], name: string) {
    const usePrisma = await getDbMode();
    const idsString = JSON.stringify(collegeIds);

    if (usePrisma) {
      return await prisma.savedComparison.create({
        data: { userId, collegeIds: idsString, name }
      });
    }

    const newComparison = {
      id: `comp-${Date.now()}`,
      userId,
      collegeIds: idsString,
      name,
      savedAt: new Date()
    };
    inMemorySavedComparisons.push(newComparison);
    return newComparison;
  }

  static async deleteSavedComparison(userId: string, id: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      await prisma.savedComparison.delete({
        where: { id } // Ideally check userId match as well
      });
      return true;
    }

    const index = inMemorySavedComparisons.findIndex(s => s.id === id && s.userId === userId);
    if (index > -1) {
      inMemorySavedComparisons.splice(index, 1);
      return true;
    }
    return false;
  }

  // --- PREDICTOR ---
  static async getPredictorColleges(exam: string, rank: number, category: string = "General") {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      const cutoffs = await prisma.cutoffRank.findMany({
        where: {
          exam: { equals: exam, mode: "insensitive" },
          category: { equals: category, mode: "insensitive" }
        },
        include: {
          college: {
            include: {
              placements: { orderBy: { year: "desc" }, take: 1 }
            }
          }
        }
      });

      return cutoffs.map(c => {
        // Simple prediction categorization:
        // Rank <= Closing Rank -> Safe (Match chance high)
        // Rank slightly above (within 20%) -> Reach (Medium chance)
        // Rank significantly above (>20%) -> Target/Dream (Low chance)
        const closingRank = c.rank;
        let matchChance: "High" | "Medium" | "Low" = "Low";
        let matchPercent = 0;

        if (rank <= closingRank) {
          matchChance = "High";
          matchPercent = Math.min(100, Math.round(90 + (10 * (closingRank - rank) / closingRank)));
        } else if (rank <= closingRank * 1.25) {
          matchChance = "Medium";
          matchPercent = Math.round(60 + (25 * (closingRank * 1.25 - rank) / (closingRank * 0.25)));
        } else {
          matchChance = "Low";
          matchPercent = Math.max(10, Math.round(50 * (closingRank * 2 - rank) / closingRank));
        }

        return {
          college: c.college,
          branch: c.branch,
          closingRank,
          exam: c.exam,
          category: c.category,
          matchChance,
          matchPercent
        };
      }).sort((a, b) => b.matchPercent - a.matchPercent);
    }

    // Fallback Mock Predictor
    const results: PredictorResult[] = [];
    inMemoryColleges.forEach(college => {
      college.cutoffRanks.forEach(c => {
        if (c.exam.toLowerCase() === exam.toLowerCase() && c.category.toLowerCase() === category.toLowerCase()) {
          const closingRank = c.rank;
          let matchChance: "High" | "Medium" | "Low" = "Low";
          let matchPercent = 0;

          if (rank <= closingRank) {
            matchChance = "High";
            matchPercent = Math.min(100, Math.round(90 + (10 * (closingRank - rank) / closingRank)));
          } else if (rank <= closingRank * 1.25) {
            matchChance = "Medium";
            matchPercent = Math.round(60 + (25 * (closingRank * 1.25 - rank) / (closingRank * 0.25)));
          } else {
            matchChance = "Low";
            matchPercent = Math.max(10, Math.round(50 * (closingRank * 2 - rank) / closingRank));
          }

          results.push({
            college: {
              id: college.id,
              name: college.name,
              location: college.location,
              fees: college.fees,
              rating: college.rating,
              image: college.image,
              overview: college.overview
            },
            branch: c.branch,
            closingRank,
            exam: c.exam,
            category: c.category,
            matchChance,
            matchPercent
          });
        }
      });
    });

    return results.sort((a, b) => b.matchPercent - a.matchPercent);
  }

  // --- Q&A FORUM ---
  static async getQuestions(collegeId?: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      const where: Prisma.QuestionWhereInput = {};
      if (collegeId) where.collegeId = collegeId;

      return await prisma.question.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          college: { select: { name: true } },
          answers: {
            orderBy: { createdAt: "asc" },
            include: {
              user: { select: { name: true } }
            }
          }
        }
      });
    }

    let questions = [...localQuestions];
    if (collegeId) {
      questions = questions.filter(q => q.collegeId === collegeId);
    }

    // Sort questions by date desc
    questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return questions.map(q => ({
      ...q,
      user: { name: q.userName },
      college: q.collegeId ? { name: inMemoryColleges.find(c => c.id === q.collegeId)?.name || "" } : null,
      answers: q.answers.map(a => ({
        ...a,
        user: { name: a.userName }
      }))
    }));
  }

  static async addQuestion(userId: string, userName: string, title: string, content: string, collegeId?: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      return await prisma.question.create({
        data: {
          userId,
          title,
          content,
          collegeId: collegeId || null
        },
        include: {
          user: { select: { name: true } },
          college: { select: { name: true } }
        }
      });
    }

    const newQuestion: MockQuestion = {
      id: `q-${Date.now()}`,
      collegeId: collegeId || null,
      userId,
      userName,
      title,
      content,
      createdAt: new Date().toISOString(),
      answers: []
    };

    localQuestions.unshift(newQuestion);
    
    return {
      ...newQuestion,
      user: { name: userName },
      college: collegeId ? { name: inMemoryColleges.find(c => c.id === collegeId)?.name || "" } : null,
      answers: []
    };
  }

  static async addAnswer(questionId: string, userId: string, userName: string, content: string) {
    const usePrisma = await getDbMode();
    if (usePrisma) {
      return await prisma.answer.create({
        data: {
          questionId,
          userId,
          content
        },
        include: {
          user: { select: { name: true } }
        }
      });
    }

    const newAnswer: MockAnswer = {
      id: `ans-${Date.now()}`,
      questionId,
      userId,
      userName,
      content,
      createdAt: new Date().toISOString()
    };

    localQuestions = localQuestions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [...q.answers, newAnswer]
        };
      }
      return q;
    });

    return {
      ...newAnswer,
      user: { name: userName }
    };
  }
}
