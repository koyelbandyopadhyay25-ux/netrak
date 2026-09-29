import lessonsData from '../data/lessons.json' with { type: 'json' };
import scenariosData from '../data/scenarios.json' with { type: 'json' };
import progressData from '../data/progress.json' with { type: 'json' };

export interface Lesson {
  id: string;
  topic: string;
  title: string;
  estimatedSeconds: number;
  description: string;
  learningPoints: string[];
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  policyReference: string;
}

export interface Scenario {
  id: string;
  topic: string;
  title: string;
  context: string;
  dilemma: string;
  choices: Array<{
    id: string;
    text: string;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
    isCorrect: boolean;
    feedback: string;
    policyCitation: string;
  }>;
}

export interface UserProgress {
  userId: string;
  userName: string;
  overallProgress: number;
  lessonsCompleted: number;
  totalLessons: number;
  scenariosAttempted: number;
  quizAttempts: number;
  quizCorrect: number;
  averageAccuracy: number;
  topicStats: Record<
    string,
    {
      attempts: number;
      correct: number;
      score: number;
      lessonsCompleted: number;
      status: 'proficient' | 'needs_refresher';
    }
  >;
  history: Array<{
    type: string;
    topic: string;
    question: string;
    selectedAnswer: string;
    correct: boolean;
    timestamp: string;
  }>;
}

export interface TrainingRecommendation {
  topic: string;
  currentScore: number;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
  suggestedLessonId: string;
  suggestedLessonTitle: string;
}

class TrainingStore {
  private lessons: Lesson[] = [...(lessonsData as Lesson[])];
  private scenarios: Scenario[] = [...(scenariosData as Scenario[])];
  private progress: UserProgress = JSON.parse(JSON.stringify(progressData));

  public getLessons(): Lesson[] {
    return this.lessons;
  }

  public getLessonById(id: string): Lesson | undefined {
    return this.lessons.find((l) => l.id.toLowerCase() === id.toLowerCase());
  }

  public getLessonsByTopic(topic: string): Lesson[] {
    const t = topic.toLowerCase();
    return this.lessons.filter((l) => l.topic.toLowerCase().includes(t));
  }

  public getScenarios(): Scenario[] {
    return this.scenarios;
  }

  public getScenarioById(id: string): Scenario | undefined {
    return this.scenarios.find((s) => s.id.toLowerCase() === id.toLowerCase());
  }

  public getProgress(): UserProgress {
    return this.progress;
  }

  /**
   * Deterministic Quiz Evaluation (DO NOT USE AI FOR QUIZ SCORING)
   */
  public submitQuizAnswer(lessonId: string, selectedAnswer: string): {
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    policyReference: string;
    updatedTopicScore: number;
    updatedAverageAccuracy: number;
  } {
    const lesson = this.getLessonById(lessonId);
    if (!lesson) {
      throw new Error(`Lesson ${lessonId} not found`);
    }

    const isCorrect = lesson.correctAnswer.trim().toLowerCase() === (selectedAnswer || '').trim().toLowerCase();

    // Update progress state deterministically
    const topicKey = lesson.topic.toLowerCase();
    if (!this.progress.topicStats[topicKey]) {
      this.progress.topicStats[topicKey] = {
        attempts: 0,
        correct: 0,
        score: 0,
        lessonsCompleted: 0,
        status: 'needs_refresher',
      };
    }

    const stats = this.progress.topicStats[topicKey];
    stats.attempts += 1;
    if (isCorrect) {
      stats.correct += 1;
      stats.lessonsCompleted = Math.max(stats.lessonsCompleted, 1);
    }
    stats.score = Math.round((stats.correct / stats.attempts) * 100);
    stats.status = stats.score >= 70 ? 'proficient' : 'needs_refresher';

    this.progress.quizAttempts += 1;
    if (isCorrect) this.progress.quizCorrect += 1;
    this.progress.averageAccuracy = Math.round((this.progress.quizCorrect / this.progress.quizAttempts) * 100);

    // Recompute overall progress
    const completedCount = Object.values(this.progress.topicStats).reduce((acc, curr) => acc + curr.lessonsCompleted, 0);
    this.progress.lessonsCompleted = completedCount;
    this.progress.overallProgress = Math.min(100, Math.round((completedCount / this.progress.totalLessons) * 100));

    this.progress.history.unshift({
      type: 'quiz',
      topic: lesson.topic,
      question: lesson.title,
      selectedAnswer,
      correct: isCorrect,
      timestamp: new Date().toISOString(),
    });

    return {
      isCorrect,
      correctAnswer: lesson.correctAnswer,
      explanation: lesson.explanation,
      policyReference: lesson.policyReference,
      updatedTopicScore: stats.score,
      updatedAverageAccuracy: this.progress.averageAccuracy,
    };
  }

  /**
   * Adaptive Learning Recommendation Engine (Phase 6):
   * Recommends refreshers for topics scoring below 70%.
   */
  public getRecommendations(): TrainingRecommendation[] {
    const recs: TrainingRecommendation[] = [];

    for (const [topic, stats] of Object.entries(this.progress.topicStats)) {
      if (stats.score < 70) {
        const matchingLesson = this.lessons.find((l) => l.topic.toLowerCase().includes(topic.toLowerCase())) || this.lessons[0];
        recs.push({
          topic,
          currentScore: stats.score,
          urgency: stats.score < 55 ? 'high' : 'medium',
          reason: `Accuracy is currently ${stats.score}% (${stats.correct}/${stats.attempts} correct). A 30-second refresher will reinforce decision confidence.`,
          suggestedLessonId: matchingLesson.id,
          suggestedLessonTitle: matchingLesson.title,
        });
      }
    }

    // Sort by lowest score first
    return recs.sort((a, b) => a.currentScore - b.currentScore);
  }
}

export const trainingEngine = new TrainingStore();
